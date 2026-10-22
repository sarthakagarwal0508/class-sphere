import { fetchMaterialFile } from "./materialService";

export const MIN_CHARS = 60;
export const MAX_CHARS = 8000;
const MAX_PDF_CHARS = 50000;

const STOP_WORDS = new Set(
  (
    "a an the and or but if so of to in on at by for with from as is are was were be been being " +
    "it its this that these those which who what when where why how not no can will would should " +
    "may might must do does did has have had than then there their they them we you your our can"
  ).split(" ")
);

const clean = (sentence) => sentence.replace(/[.!?]+$/, "").trim();
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const wordsOf = (sentence) => sentence.toLowerCase().match(/[a-z0-9]+/g) ?? [];
const meaningful = (sentence) => wordsOf(sentence).filter((w) => w.length > 2 && !STOP_WORDS.has(w));

function splitSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.split(" ").length >= 5);
}

function wordFrequency(sentences) {
  const freq = new Map();
  sentences.forEach((s) => meaningful(s).forEach((w) => freq.set(w, (freq.get(w) ?? 0) + 1)));
  return freq;
}

// Jin sentences mein zyada baar aane wale words hon, wo zyada zaroori maane jaate hain
function pickKeyPoints(sentences, freq, count) {
  return sentences
    .map((sentence, index) => {
      const words = meaningful(sentence);
      const score = words.reduce((sum, w) => sum + freq.get(w), 0) / Math.sqrt(words.length || 1);
      return { sentence, index, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .sort((a, b) => a.index - b.index) // wapas original order
    .map((item) => item.sentence);
}

// "A stack is a linear structure..."  ->  Q: What is a stack?  A: A linear structure...
const DEFINITION = /^(?:(?:a|an|the)\s+)?(.{2,50}?)\s+(is|are)\s+(.{8,})$/i;

function definitionCard(sentence) {
  const text = clean(sentence);
  const match = text.match(DEFINITION);
  if (!match) return null;

  const [, subject, verb, rest] = match;
  const subjectWords = subject.split(" ");
  const lastWord = subjectWords[subjectWords.length - 1];

  // Subject chhota aur saaf hona chahiye ("last element pushed" jaisa nahi)
  if (/[,;:]/.test(subject) || subjectWords.length > 5 || /(ed|ing)$/i.test(lastWord)) return null;
  if (rest.split(" ").length < 3) return null;

  const article = /^(a|an|the)\s/i.test(text) ? `${text.split(" ")[0].toLowerCase()} ` : "";
  return {
    question: `What ${verb.toLowerCase()} ${article}${subject}?`,
    answer: `${capitalize(rest)}.`,
  };
}

// Definition na mile to "fill in the blank" card: sabse zaroori word chhupa do
function fallbackCard(sentence, freq) {
  const tokens = sentence.match(/[A-Za-z0-9]+/g) ?? [];
  const candidates = tokens.filter((t) => t.length > 3 && !STOP_WORDS.has(t.toLowerCase()));
  if (candidates.length === 0) return null;

  const answer = candidates.sort(
    (a, b) => (freq.get(b.toLowerCase()) ?? 0) - (freq.get(a.toLowerCase()) ?? 0) || b.length - a.length
  )[0];

  const blanked = clean(sentence).replace(new RegExp(`\\b${answer}\\b`, "gi"), "_____");
  return { question: `Fill in the blank: ${blanked}.`, answer };
}

async function extractPdfText(file) {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const document = await pdfjs.getDocument({
    data: await file.arrayBuffer(),
  }).promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .filter(Boolean)
      .join(" ");
    pages.push(pageText);
  }

  const extracted = pages.join("\n").replace(/\s+/g, " ").trim();
  if (!extracted) {
    throw new Error(
      "This PDF has no selectable text. Scanned/image-only PDFs cannot be summarized yet."
    );
  }
  return extracted.slice(0, MAX_PDF_CHARS);
}

function summarizeText(source) {
  if (source.trim().length < MIN_CHARS) {
    throw new Error(`Add at least ${MIN_CHARS} characters of notes to get a useful summary.`);
  }

  const sentences = splitSentences(source);
  if (sentences.length < 2) {
    throw new Error("We could not find enough full sentences. Write a few complete sentences.");
  }

  const freq = wordFrequency(sentences);
  const keyCount = Math.min(6, Math.max(2, Math.ceil(sentences.length * 0.6)));
  const keyPoints = pickKeyPoints(sentences, freq, keyCount);

  const flashcards = [];
  const seen = new Set();
  const add = (card) => {
    if (card && !seen.has(card.question)) {
      seen.add(card.question);
      flashcards.push(card);
    }
  };

  sentences.forEach((s) => {
    if (flashcards.length < 6) add(definitionCard(s));
  });
  keyPoints.forEach((s) => {
    if (flashcards.length < 3) add(fallbackCard(s, freq));
  });

  return { keyPoints, flashcards };
}

export async function generateStudyAid({ text = "", material = null }) {
  const source = material
    ? await extractPdfText(await fetchMaterialFile(material.id))
    : text;
  if (!material && source.length > MAX_CHARS) {
    throw new Error(`Please keep your notes under ${MAX_CHARS} characters.`);
  }
  return summarizeText(source);
}