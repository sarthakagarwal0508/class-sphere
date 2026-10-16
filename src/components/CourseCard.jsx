import { BookOpen, Layers, Sparkles } from "lucide-react";
import Card from "./Card";

const looks = {
  yellow: { header: "bg-tone-yellow", Icon: BookOpen },
  blue: { header: "bg-tone-blue", Icon: Layers },
  green: { header: "bg-tone-green", Icon: Sparkles },
};

export default function CourseCard({ course }) {
  const { name, teacher, tag, assignments, quizzes, progress, color } = course;
  const { header, Icon } = looks[color];

  return (
    <Card className="overflow-hidden">
      <div className={`h-16 ${header}`} />

      <div className="px-4 pb-4">
        <div className="-mt-5 mb-2 grid h-10 w-10 place-items-center rounded-xl bg-card shadow">
          <Icon size={18} />
        </div>

        <h3 className="text-base font-bold leading-tight">{name}</h3>
        <p className="text-xs text-muted">{teacher}</p>

        <p className="mt-2 text-xs font-bold text-tone-green-fg">{tag}</p>
        <p className="mt-0.5 text-xs text-muted">
          {assignments} assignments &nbsp; {quizzes} quizzes
        </p>

        <div className="mt-2 h-1 rounded-full bg-line">
          <div className="h-full rounded-full bg-ink" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-1.5 text-xs text-muted">Completed: {progress}%</p>
      </div>
    </Card>
  );
}