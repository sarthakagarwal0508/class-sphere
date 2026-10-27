import { ClipboardList } from "lucide-react";
import Card from "./Card";

const styles = {
  pending: {
    label: "Pending",
    icon: "bg-tone-yellow",
    badge: "bg-tone-yellow text-tone-yellow-fg",
  },
  submitted: {
    label: "Submitted",
    icon: "bg-tone-blue",
    badge: "bg-tone-blue text-tone-blue-fg",
  },
  graded: {
    label: "Graded",
    icon: "bg-tone-green",
    badge: "bg-tone-green text-tone-green-fg",
  },
};

function getSubtitle(a, compact) {
  if (compact) {
    if (a.status === "graded") return `${a.course}, graded`;
    return `${a.course}, due ${a.due}, ${a.marks} marks`;
  }
  if (a.status === "pending") return `${a.course}, due ${a.due}, ${a.marks} marks`;
  if (a.status === "submitted") return `${a.course}, submitted ${a.submittedOn}`;
  return `Feedback: ${a.feedback}`;
}

export default function AssignmentCard({
  assignment,
  compact = false,
  onSubmit,
  onViewQuestions,
  loadingQuestions = false,
}) {
  const { title, status, score, marks } = assignment;
  const s = styles[status];

  return (
    <Card className="flex flex-wrap items-center gap-3 p-3">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${s.icon}`}>
        <ClipboardList size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold">{title}</h3>
        <p className="truncate text-xs text-muted">{getSubtitle(assignment, compact)}</p>
      </div>

      {status === "graded" && (
        <span className="text-sm font-bold">
          {score}/{marks}
        </span>
      )}

      <span className={`rounded-full px-3 py-1 text-xs font-bold ${s.badge}`}>{s.label}</span>

      {onViewQuestions && (
        <button
          type="button"
          onClick={onViewQuestions}
          disabled={loadingQuestions}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-bold text-ink transition hover:bg-soft disabled:opacity-60"
        >
          <ClipboardList size={14} />
          {loadingQuestions ? "Opening..." : "View questions"}
        </button>
      )}

      {["pending", "submitted"].includes(status) && onSubmit && (
        <button
          onClick={() => onSubmit?.(assignment)}
          className="rounded-lg bg-brand px-4 py-1.5 text-sm font-bold text-on-brand"
        >
          {status === "submitted" ? "Resubmit" : "Submit"}
        </button>
      )}
    </Card>
  );
}
