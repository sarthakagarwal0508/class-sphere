import { ClipboardList } from "lucide-react";
import Card from "./Card";

const styles = {
  pending: { label: "Pending", icon: "bg-amber-100", badge: "bg-amber-100 text-amber-800" },
  submitted: { label: "Submitted", icon: "bg-blue-100", badge: "bg-blue-100 text-blue-700" },
  graded: { label: "Graded", icon: "bg-green-100", badge: "bg-green-100 text-green-700" },
};

// compact = dashboard version, full = Assignments page version
function getSubtitle(a, compact) {
  if (compact) {
    if (a.status === "graded") return `${a.course}, graded`;
    return `${a.course}, due ${a.due}, ${a.marks} marks`;
  }
  if (a.status === "pending") return `${a.course}, due ${a.due}, ${a.marks} marks`;
  if (a.status === "submitted") return `${a.course}, submitted ${a.submittedOn}`;
  return `Feedback: ${a.feedback}`;
}

export default function AssignmentCard({ assignment, compact = false, onSubmit }) {
  const { title, status, score, marks } = assignment;
  const s = styles[status];

  return (
    <Card className="flex items-center gap-3 p-3">
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

      {status === "pending" && (
        <button
          onClick={() => onSubmit?.(assignment)}
          className="rounded-lg bg-brand px-4 py-1.5 text-sm font-bold text-navy"
        >
          Submit
        </button>
      )}
    </Card>
  );
}