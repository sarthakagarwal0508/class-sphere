import { useRef, useState } from "react";
import Card from "./Card";

const ALLOWED = ["c", "pdf", "zip"];
const MAX_MB = 20;

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SubmitForm({ assignment, onSubmit }) {
  const [answer, setAnswer] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  const pickFile = (picked) => {
    if (!picked) return;

    const extension = picked.name.split(".").pop().toLowerCase();
    if (!ALLOWED.includes(extension)) {
      setError("Only C, PDF or ZIP files are allowed.");
      return;
    }
    if (picked.size > MAX_MB * 1024 * 1024) {
      setError(`File must be smaller than ${MAX_MB} MB.`);
      return;
    }

    setFile(picked);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!answer.trim() && !file) {
      setError("Write your answer or attach a file before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await onSubmit({ assignmentId: assignment.id, answer: answer.trim(), file });
    } catch (err) {
      setError(err.message || "Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-5">
      <form onSubmit={handleSubmit} noValidate>
        <h2 className="text-lg font-extrabold">Submit: {assignment.title}</h2>
        <p className="mt-1 text-sm text-muted">{assignment.description}</p>

        <label htmlFor="answer" className="mt-4 block text-xs font-bold">
          Your answer
        </label>
        <textarea
          id="answer"
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your answer or add notes for your teacher..."
          className="mt-1 w-full resize-none rounded-xl border border-line bg-card p-3 text-sm outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/30"
        />

        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`mt-3 cursor-pointer rounded-xl border-2 border-dashed px-4 py-5 text-center text-sm transition ${
            dragging ? "border-brand bg-brand-soft text-ink" : "border-line text-muted hover:border-muted"
          }`}
        >
          Drop a file here or browse (C, PDF, ZIP)
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".c,.pdf,.zip"
          className="hidden"
          onChange={(e) => {
            pickFile(e.target.files[0]);
            e.target.value = "";
          }}
        />

        {file && (
          <div className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-soft px-3 py-2 text-xs">
            <span className="min-w-0 truncate font-semibold">
              {file.name} <span className="font-normal text-muted">({formatSize(file.size)})</span>
            </span>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="shrink-0 font-bold text-tone-red-fg hover:underline"
            >
              Remove
            </button>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-3 text-xs font-semibold text-tone-red-fg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 rounded-lg bg-panel px-4 py-2 text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit assignment"}
        </button>
      </form>
    </Card>
  );
}