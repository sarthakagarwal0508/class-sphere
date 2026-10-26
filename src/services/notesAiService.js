import { fetchMaterialFile } from "./materialService";
import { summarizePdf } from "./aiService";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

export const MIN_CHARS = 60;
export const MAX_CHARS = 8000;

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
  const sentences = text
    .replace(/\r/g, "")
    .trim()
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.split(" ").length >= 5);
  if (sentences.length >= 2) return sentences;

  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length < 10) return sentences;

  const chunkCount = Math.min(6, Math.max(2, Math.ceil(words.length / 30)));
  const chunkSize = Math.ceil(words.length / chunkCount);
  return Array.from({ length: chunkCount }, (_, index) =>
    words.slice(index * chunkSize, (index + 1) * chunkSize).join(" ")
  ).filter((chunk) => chunk.split(" ").length >= 5);
}

function wordFrequency(sentences) {
  const freq = new Map();
  sentences.forEach((s) => meaningful(s).forEach((w) => freq.set(w, (freq.get(w) ?? 0) + 1)));
  return freq;
}

function pickKeyPoints(sentences, freq, count) {
  return sentences
    .map((sentence, index) => {
      const words = meaningful(sentence);
      const score = words.reduce((sum, w) => sum + freq.get(w), 0) / Math.sqrt(words.length || 1);
      return { sentence, index, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence);
}

const DEFINITION = /^(?:(?:a|an|the)\s+)?(.{2,50}?)\s+(is|are)\s+(.{8,})$/i;

function definitionCard(sentence) {
  const text = clean(sentence);
  const match = text.match(DEFINITION);
  if (!match) return null;

  const [, subject, verb, rest] = match;
  const subjectWords = subject.split(" ");
  const lastWord = subjectWords[subjectWords.length - 1];

if (/[,;:]/.test(subject) || subjectWords.length > 5 || /(ed|ing)$/i.test(lastWord)) return null;
  if (rest.split(" ").length < 3) return null;

  const article = /^(a|an|the)\s/i.test(text) ? `${text.split(" ")[0].toLowerCase()} ` : "";
  return {
    question: `What ${verb.toLowerCase()} ${article}${subject}?`,
    answer: `${capitalize(rest)}.`,
  };
}

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

async function extractPdfText(pdf) {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(await pdf.arrayBuffer()),
  });

  try {
    const document = await loadingTask.promise;
    const pages = await Promise.all(
      Array.from({ length: document.numPages }, async (_, pageIndex) => {
        const page = await document.getPage(pageIndex + 1);
        const content = await page.getTextContent();
        return content.items
          .filter((item) => typeof item.str === "string")
          .map((item) => `${item.str}${item.hasEOL ? "\n" : " "}`)
          .join("")
          .trim();
      })
    );
    const text = pages.filter(Boolean).join("\n");
    if (text.trim().length < MIN_CHARS) {
      throw new Error(
        "This PDF has no readable text. It may be scanned; try a text-based PDF or paste the notes instead."
      );
    }
    return text;
  } finally {
    await loadingTask.destroy();
  }
}

function normalizeAiResult(response) {
  const summary = response?.summary ?? response?.keyPoints ?? response?.key_points ?? [];
  const keyPoints = Array.isArray(summary)
    ? summary.map((point) => (typeof point === "string" ? point : point?.text ?? point?.content ?? "")).filter(Boolean)
    : String(summary)
        .split(/\r?\n|(?<=[.!?])\s+/)
        .map((line) => line.replace(/^\s*(?:[-*#]+\s*)/, "").trim())
        .filter(Boolean);
  const rawCards = response?.flashcards ?? response?.flash_cards ?? [];
  const flashcards = Array.isArray(rawCards)
    ? rawCards
        .map((card) => ({
          question: card?.question ?? card?.front ?? card?.term ?? "",
          answer: card?.answer ?? card?.back ?? card?.definition ?? "",
        }))
        .filter((card) => card.question && card.answer)
    : [];
  return { keyPoints, flashcards };
}

export async function generateStudyAid({ text = "", material = null }) {
  if (material) {
    const pdf = await fetchMaterialFile(material.id);
    if (!(pdf instanceof Blob) || pdf.size === 0) {
      throw new Error("The selected study material is empty or could not be downloaded.");
    }
    const filename = material.title?.toLowerCase().endsWith(".pdf")
      ? material.title
      : `${material.title || "study-material"}.pdf`;
    const file = new File([pdf], filename, { type: "application/pdf" });
    let aiResult;
    let aiError;
    try {
      aiResult = normalizeAiResult(await summarizePdf(file));
      if (aiResult.keyPoints.length && aiResult.flashcards.length) return aiResult;
    } catch (error) {
      aiError = error;
    }

    try {
      const localResult = summarizeText(await extractPdfText(pdf));
      return {
        keyPoints: aiResult?.keyPoints.length
          ? aiResult.keyPoints
          : localResult.keyPoints,
        flashcards: aiResult?.flashcards.length
          ? aiResult.flashcards
          : localResult.flashcards,
        warning:
          "The AI service could not fully process this PDF. Results were generated from its readable text in your browser.",
      };
    } catch (localError) {
      if (aiError) {
        throw new Error(
          `${aiError.message} Browser fallback could not process the PDF: ${localError.message}`,
          { cause: localError }
        );
      }
      throw localError;
    }
  }

  const source = text;
  if (!material && source.length > MAX_CHARS) {
    throw new Error(`Please keep your notes under ${MAX_CHARS} characters.`);
  }
  return summarizeText(source);
}
