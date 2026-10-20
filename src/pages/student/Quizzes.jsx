import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleHelp, Clock, Award } from "lucide-react";

import Topbar from "../../components/Topbar";
import HeroBanner from "../../components/HeroBanner";
import Tabs from "../../components/Tabs";
import Card from "../../components/Card";
import QuizCard from "../../components/QuizCard";
import Loader from "../../components/Loader";
import useFetch from "../../hooks/useFetch";
import { getQuizzes } from "../../services/quizService";

const tabs = [
  { key: "all", label: "All" },
  { key: "available", label: "Available" },
  { key: "completed", label: "Completed" },
];

export default function Quizzes() {
  const navigate = useNavigate();
  const { data, status, reload } = useFetch(getQuizzes);
  const [tab, setTab] = useState("all");

  const quizzes = data ?? [];
  const visible = quizzes.filter((q) => tab === "all" || q.status === tab);
  const next = quizzes.find((q) => q.status === "available");

  const start = (quiz) => navigate(`/student/quizzes/${quiz.id}`);

  return (
    <div className="space-y-5">
      <Topbar title="Quizzes" subtitle="Timed MCQ quizzes from your teachers" />

      <HeroBanner
        variant="yellow"
        title="Test what you have learned"
        subtitle="Timed MCQ quizzes that are marked automatically."
        buttonText={next ? "Start next quiz" : undefined}
        onButtonClick={() => next && start(next)}
        icons={[CircleHelp, Clock, Award]}
      />

      {status === "loading" && <Loader label="Loading quizzes..." />}

      {status === "error" && (
        <Card className="p-5 text-center">
          <p className="text-sm font-semibold">Could not load your quizzes.</p>
          <button
            onClick={reload}
            className="mt-3 rounded-lg bg-brand px-4 py-2 text-xs font-bold text-on-brand"
          >
            Try again
          </button>
        </Card>
      )}

      {status === "ready" && (
        <div className="space-y-4">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />

          <div className="space-y-2">
            {visible.length === 0 && (
              <p className="py-6 text-center text-sm text-muted">No quizzes here yet.</p>
            )}
            {visible.map((q) => (
              <QuizCard key={q.id} quiz={q} onStart={start} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}