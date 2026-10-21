import { useState } from "react";
import { FileText } from "lucide-react";

export default function MaterialPicker({ items, selectedId, onSelect }) {
  const [open, setOpen] = useState(false);
  const selected = items.find((m) => m.id === selectedId);

  return (
    <div className="mt-3">
      {selected ? (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-soft px-3 py-2 text-xs">
          <span className="min-w-0 truncate font-semibold">
            {selected.title}{" "}
            <span className="font-normal text-muted">({selected.courseName})</span>
          </span>
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="shrink-0 font-bold text-tone-red-fg hover:underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="w-full rounded-xl border-2 border-dashed border-line px-4 py-4 text-center text-sm text-muted transition hover:border-muted hover:text-ink"
        >
          Or pick a PDF from Study Material
        </button>
      )}

      {open && !selected && (
        <ul className="mt-2 max-h-56 space-y-1 overflow-y-auto rounded-xl border border-line p-1.5">
          {items.length === 0 && (
            <li className="px-3 py-2 text-xs text-muted">No PDFs or notes shared yet.</li>
          )}
          {items.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(m.id);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-soft"
              >
                <FileText size={16} className="shrink-0 text-muted" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{m.title}</span>
                  <span className="block text-xs text-muted">
                    {m.courseName}, {m.type}, {m.detail}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}