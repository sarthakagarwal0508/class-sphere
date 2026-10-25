import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, FileText, Layers } from "lucide-react";

import Topbar from "../../components/Topbar";
import HeroBanner from "../../components/HeroBanner";
import Card from "../../components/Card";
import MaterialPicker from "../../components/MaterialPicker";
import KeyPointsCard from "../../components/KeyPointsCard";
import FlashcardsCard from "../../components/FlashcardsCard";
import { fetchMyClassrooms } from "../../services/classroomService";
import { fetchClassroomMaterials } from "../../services/materialService";
import { generateStudyAid, MIN_CHARS, MAX_CHARS } from "../../services/notesAiService";

const steps = [
  "Choose a PDF shared by your teacher, or paste your own notes.",
  "Shared PDFs are summarized by the configured ClassSphere AI service; pasted text uses the built-in summary helper.",
  "Read the key points and use the flashcards to test yourself.",
];

function unwrap(response) {
  return response?.data?.data ?? response?.data ?? response;
}

function listFrom(response, key) {
  const data = unwrap(response);
  return Array.isArray(data) ? data : data?.[key] ?? [];
}

export default function NotesAI() {
  const location = useLocation();
  const navigate = useNavigate();
  const incomingMaterial = location.state?.material ?? null;

  const [text, setText] = useState("");
  const [material, setMaterial] = useState(incomingMaterial);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [materialsError, setMaterialsError] = useState("");
  const [request, setRequest] = useState(
    incomingMaterial ? { key: 1, text: "", material: incomingMaterial } : null
  );
  const [status, setStatus] = useState(incomingMaterial ? "loading" : "idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    let active = true;
    fetchMyClassrooms()
      .then((classrooms) =>
        Promise.all(
          classrooms.map(async (classroom) => {
            const classroomId = classroom._id ?? classroom.id;
            const response = await fetchClassroomMaterials(classroomId);
            return listFrom(response, "materials")
              .filter((item) => {
                const type = String(
                  item.type ?? item.mimeType ?? item.contentType ?? ""
                ).toLowerCase();
                const fileName = String(
                  item.fileName ?? item.originalName ?? ""
                ).toLowerCase();
                return (
                  !type.includes("link") &&
                  (type.includes("pdf") ||
                    fileName.endsWith(".pdf") ||
                    (!type && !fileName))
                );
              })
              .map((item) => ({
                id: String(item._id ?? item.id),
                classroomId,
                title: item.title ?? item.originalName ?? item.fileName ?? "Study material",
                courseName: classroom.name ?? classroom.title ?? "Classroom",
              }));
          })
        )
      )
      .then((groups) => {
        if (active) setAvailableMaterials(groups.flat());
      })
      .catch((loadError) => {
        if (active) {
          setMaterialsError(
            loadError.message || "Could not load your classroom PDFs."
          );
        }
      });
    return () => {
      active = false;
    };
  }, []);

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
  const hasInput = material !== null || text.trim().length > 0;

  const handleGenerate = () => {
    if (material === null && text.trim().length < MIN_CHARS) {
      setError(`Add at least ${MIN_CHARS} characters of notes (you have ${text.trim().length}).`);
      setStatus("error");
      return;
    }

    setError("");
    setStatus("loading");
    setRequest((prev) => ({ key: (prev?.key ?? 0) + 1, text, material }));
  };

  const handleClear = () => {
    setText("");
    setMaterial(null);
    setRequest(null);
    setResult(null);
    setError("");
    setStatus("idle");
  };

  return (
    <div className="dashboard-stagger space-y-5">
      <Topbar title="Notes AI" subtitle="Turn notes into key points and flashcards" />

      <HeroBanner
        variant="navy"
        title="Study smarter with Notes AI"
        subtitle="Summarize a teacher-shared PDF or paste notes to get key points and flashcards."
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
            onChange={(e) => setText(e.target.value)}
            placeholder={
              material !== null
                ? `Summarizing “${material.title}”. Remove it to paste your own text.`
                : "Paste your class notes here..."
            }
            disabled={material !== null}
            className="mt-1 w-full resize-none rounded-xl border border-line bg-card p-3 text-sm outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <p className="mt-1 text-right text-xs text-muted">
            {text.length}/{MAX_CHARS}
          </p>

          {materialsError && (
            <p role="alert" className="mt-3 text-xs text-tone-red-fg">
              {materialsError}
            </p>
          )}
          <MaterialPicker
            items={availableMaterials}
            selectedId={material?.id ?? null}
            onSelect={(id) =>
              setMaterial(
                availableMaterials.find((item) => item.id === String(id)) ?? null
              )
            }
          />

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

<div className="space-y-4" aria-live="polite">
          <KeyPointsCard items={result?.keyPoints ?? []} status={status} />
          <FlashcardsCard
            cards={result?.flashcards ?? []}
            status={status}
            onRevise={() => navigate("/student/flashcards", {
              state: { cards: result?.flashcards ?? [] },
            })}
          />
        </div>
      </div>
    </div>
  );
}
