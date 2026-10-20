import { CircleHelp } from "lucide-react";
import Card from "./Card";

const tints = {
  yellow: "bg-tone-yellow",
  blue: "bg-tone-blue",
  green: "bg-tone-green",
};

export default function QuizCard({ quiz, onStart }) {
  const { title, course, topic, questionCount, durationMin, due, status, score, total, color } = quiz;
  const completed = status === "completed";

  return (
    <Card className="flex items-center gap-3 p-3">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tints[color]}`}>
        <CircleHelp size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold">{title}</h3>
        <p className="truncate text-xs text-muted">
          {course}, {topic}, {questionCount} questions, {durationMin} min
        </p>
      </div>

      {completed ? (
        <>
          <span className="text-sm font-bold">
            {score}/{total}
          </span>
          <span className="rounded-full bg-tone-green px-3 py-1 text-xs font-bold text-tone-green-fg">
            Completed
          </span>
        </>
      ) : (
        <>
          <span className="rounded-full bg-tone-yellow px-3 py-1 text-xs font-bold text-tone-yellow-fg">
            Due {due}
          </span>
          <button
            onClick={() => onStart?.(quiz)}
            className="rounded-lg bg-brand px-4 py-1.5 text-sm font-bold text-on-brand"
          >
            Start quiz
          </button>
        </>
      )}
    </Card>
  );
}