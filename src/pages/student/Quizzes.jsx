import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleHelp, ClipboardCheck } from "lucide-react";
import Topbar from "../../components/Topbar";
import HeroBanner from "../../components/HeroBanner";
import Card from "../../components/Card";
import { fetchMyClassrooms } from "../../services/classroomService";
import {
  getStudentClassroomQuizzes,
  getStudentQuizAttempts,
  normalizeQuiz,
} from "../../services/quizService";

function quizIdOf(value) {
  const quiz = value?.quiz;
  return String(
    value?._id ??
      value?.id ??
      (typeof quiz === "string" ? quiz : quiz?._id ?? quiz?.id) ??
      ""
  );
}

export default function Quizzes() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([fetchMyClassrooms(), getStudentQuizAttempts()])
      .then(async ([classrooms, attempts]) => {
        const groups = await Promise.all(
          classrooms.map(async (classroom) => {
            const id = String(classroom._id ?? classroom.id);
            const classroomQuizzes = await getStudentClassroomQuizzes(id);
            return classroomQuizzes.map((quiz) => normalizeQuiz(quiz, classroom));
          })
        );
        if (!active) return;
        const attemptByQuizId = new Map(
          attempts.map((attempt) => [quizIdOf(attempt), attempt])
        );
        setQuizzes(groups.flat().map((quiz) => {
          const attempt = attemptByQuizId.get(quiz.id);
          return {
            ...quiz,
            attempt,
            completed: Boolean(attempt),
            score: attempt?.score ?? attempt?.marksObtained,
            total: attempt?.totalMarks ?? attempt?.total ?? quiz.totalMarks,
          };
        }));
        setStatus("ready");
      })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError.message || "Could not load published quizzes.");
        setStatus("error");
      });
    return () => { active = false; };
  }, []);

  return (
    <div className="dashboard-stagger space-y-5">
      <Topbar title="Quizzes" subtitle="Published quizzes from your classrooms" />
      <HeroBanner
        variant="yellow"
        title="Practice what you have learned"
        subtitle="Take a published class quiz and review your saved results."
        icons={[CircleHelp, ClipboardCheck]}
      />

      {status === "loading" && (
        <Card className="p-6 text-center text-sm text-muted">Loading your quizzes...</Card>
      )}
      {status === "error" && (
        <Card className="p-5 text-sm text-tone-red-fg" role="alert">{error}</Card>
      )}
      {status === "ready" && quizzes.length === 0 && (
        <Card className="p-8 text-center">
          <p className="font-bold">No published quizzes yet</p>
          <p className="mt-1 text-sm text-muted">When a teacher publishes a quiz for your class, it will appear here.</p>
        </Card>
      )}
      {status === "ready" && quizzes.length > 0 && (
        <div className="grid gap-3">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-tone-yellow text-tone-yellow-fg">
                <CircleHelp size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-extrabold">{quiz.title}</h2>
                <p className="mt-1 text-xs text-muted">
                  {quiz.course} · {quiz.topic} · {quiz.questionCount} questions · {quiz.difficulty}
                </p>
              </div>
              {quiz.completed ? (
                <span className="rounded-full bg-tone-green px-3 py-1.5 text-xs font-bold text-tone-green-fg">
                  Completed{quiz.score != null ? ` · ${quiz.score}/${quiz.total}` : ""}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate(`/student/quizzes/${quiz.id}`, {
                    state: { quiz, classroomId: quiz.classroomId },
                  })}
                  className="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-on-brand"
                >
                  Start quiz
                </button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
