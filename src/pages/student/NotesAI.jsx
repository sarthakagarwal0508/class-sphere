import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles, FileText, Layers } from "lucide-react";

import Topbar from "../../components/Topbar";
import HeroBanner from "../../components/HeroBanner";
import Card from "../../components/Card";
import MaterialPicker from "../../components/MaterialPicker";
import KeyPointsCard from "../../components/KeyPointsCard";
import FlashcardsCard from "../../components/FlashcardsCard";
import { courses, materials } from "../../data/mockData";
import { generateStudyAid, MIN_CHARS, MAX_CHARS } from "../../services/notesAiService";

// Link wale material se text nahi nikal sakte, isliye sirf PDF aur Notes
const pickable = materials
  .filter((m) => m.type !== "Link")
  .map((m) => ({ ...m, courseName: courses.find((c) => c.id === m.courseId)?.name ?? "" }));

const steps = [
  "Paste your notes, or pick a PDF or notes file from Study Material.",
  "Press Generate. The AI reads the text and finds the most important sentences.",
  "Read the key points and use the flashcards to test yourself.",
];

export default function NotesAI() {
  const location = useLocation();
  const incomingId = location.state?.materialId ?? null;

  const [text, setText] = useState("");
  const [materialId, setMaterialId] = useState(incomingId);
  // "Summarize" dabake aaye ho to turant generate shuru
  const [request, setRequest] = useState(
    incomingId !== null ? { key: 1, text: "", materialId: incomingId } : null
  );
  const [status, setStatus] = useState(incomingId !== null ? "loading" : "idle"); // idle | loading | ready | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [reviseNote, setReviseNote] = useState("");

  // Request badalte hi service ko bulao (purana jawab ignore karne ke liye flag)
  useEffect(() => {
    if (!request) return undefined;

    let ignore = false;
    generateStudyAid(request)
      .then((data) => {
        if (ignore) return;
        setResult(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.message);
        setStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [request]);

  const loading = status === "loading";
  const hasInput = materialId !== null || text.trim().length > 0;

  const handleGenerate = () => {
    if (materialId === null && text.trim().length < MIN_CHARS) {
      setError(`Add at least ${MIN_CHARS} characters of notes (you have ${text.trim().length}).`);
      setStatus("error");
      return;
    }

    setError("");
    setReviseNote("");
    setStatus("loading");
    setRequest((prev) => ({ key: (prev?.key ?? 0) + 1, text, materialId }));
  };

  const handleClear = () => {
    setText("");
    setMaterialId(null);
    setRequest(null);
    setResult(null);
    setError("");
    setReviseNote("");
    setStatus("idle");
  };

  return (
    <div className="dashboard-stagger space-y-5">
      <Topbar title="Notes AI" subtitle="Turn notes into key points and flashcards" />

      <HeroBanner
        variant="navy"
        title="Study smarter with Notes AI"
        subtitle="Paste notes or pick a PDF. Get key points and flashcards in seconds."
        buttonText={showHelp ? "Hide how it works" : "See how it works"}
        onButtonClick={() => setShowHelp((v) => !v)}
        icons={[Sparkles, FileText, Layers]}
      />

      {showHelp && (
        <Card className="p-5">
          <h2 className="text-lg font-extrabold">How it works</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </Card>
      )}

      <div className="grid gap-5 min-[1100px]:grid-cols-2">
        {/* Left: input */}
        <Card className="p-5 min-[1100px]:self-start">
          <h2 className="text-lg font-extrabold">Your notes</h2>

          <label htmlFor="notes-text" className="mt-3 block text-xs font-bold">
            Paste text
          </label>
          <textarea
            id="notes-text"
            rows={9}
            value={text}
            maxLength={MAX_CHARS}
            disabled={materialId !== null}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              materialId !== null
                ? "Using the selected material. Remove it to paste your own text."
                : "Paste your class notes here..."
            }
            className="mt-1 w-full resize-none rounded-xl border border-line bg-card p-3 text-sm outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <p className="mt-1 text-right text-xs text-muted">
            {text.length}/{MAX_CHARS}
          </p>

          <MaterialPicker items={pickable} selectedId={materialId} onSelect={setMaterialId} />

          {status === "error" && error && (
            <p role="alert" className="mt-3 text-xs font-semibold text-tone-red-fg">
              {error}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !hasInput}
              className="rounded-lg bg-panel px-4 py-2.5 text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate summary and flashcards"}
            </button>

            {(hasInput || result) && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-lg bg-soft px-4 py-2.5 text-xs font-bold transition hover:opacity-80"
              >
                Clear
              </button>
            )}
          </div>
        </Card>

        {/* Right: results */}
        <div className="space-y-4" aria-live="polite">
          <KeyPointsCard items={result?.keyPoints ?? []} status={status} />
          <FlashcardsCard
            cards={result?.flashcards ?? []}
            status={status}
            onRevise={() => setReviseNote("The Flashcards page opens here in the next step.")}
          />
          {reviseNote && <p className="text-xs text-muted">{reviseNote}</p>}
        </div>
      </div>
    </div>
  );
}