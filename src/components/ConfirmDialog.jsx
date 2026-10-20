import { useEffect } from "react";
import Card from "./Card";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) {
  // Escape dabane par band
  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="p-5">
          <h2 id="confirm-title" className="text-lg font-extrabold">
            {title}
          </h2>
          <p className="mt-2 text-sm text-muted">{message}</p>

          <div className="mt-5 flex justify-end gap-2">
            <button
              autoFocus
              onClick={onCancel}
              className="rounded-lg bg-soft px-4 py-2 text-xs font-bold"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className="rounded-lg bg-panel px-4 py-2 text-xs font-bold text-white"
            >
              {confirmLabel}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}