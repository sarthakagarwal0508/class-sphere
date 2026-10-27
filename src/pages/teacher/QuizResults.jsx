import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Award, ClipboardList, RotateCcw } from "lucide-react";
import Topbar from "../../components/Topbar";
import HeroBanner from "../../components/HeroBanner";
import Card from "../../components/Card";
import { fetchMyClassrooms } from "../../services/classroomService";
import {
  getClassroomQuizzes,
  getQuizResults,
  normalizeQuiz,
  publishQuiz,
  unpublishQuiz,
} from "../../services/quizService";

function resultList(response) {
  if (Array.isArray(response)) return response;
  return response?.results ?? response?.attempts ?? response?.data?.results ?? response?.data?.attempts ?? [];
}

function studentName(attempt) {
  const student = attempt.student ?? attempt.user;
  if (typeof student === "string") return attempt.studentName ?? "Student";
  return student?.name ?? student?.fullName ?? student?.email ?? "Student";
}

export default function QuizResults() {
  const location = useLocation();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedId, setSelectedId] = useState(
    String(location.state?.quizId ?? new URLSearchParams(location.search).get("quizId") ?? "")
  );
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchMyClassrooms()
      .then((classrooms) => Promise.all(classrooms.map(async (classroom) => {
        const items = await getClassroomQuizzes(classroom._id ?? classroom.id);
        return items.map((item) => normalizeQuiz(item, classroom));
      })))
      .then((groups) => {
        if (!active) return;
        const all = groups.flat();
        setQuizzes(all);
        if (all.length) setSelectedId((current) => current || all[0].id);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "Could not load classroom quizzes.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!selectedId) return undefined;
    let active = true;
    Promise.resolve()
      .then(() => {
        if (active) {
          setResultsLoading(true);
          setError("");
          setResults([]);
        }
        return getQuizResults(selectedId);
      })
      .then((response) => {
        if (active) setResults(resultList(response));
      })
      .catch((loadError) => {
        if (active) {
          setResults([]);
          setError(loadError.message || "Could not load quiz results.");
        }
      })
      .finally(() => {
        if (active) setResultsLoading(false);
      });
    return () => { active = false; };
  }, [selectedId]);

  const selectedQuiz = useMemo(
    () => quizzes.find((quiz) => quiz.id === selectedId) ?? null,
    [quizzes, selectedId]
  );

  async function changeStatus(action) {
    if (!selectedQuiz) return;
    setWorking(true);
    setError("");
    try {
      if (action === "publish") await publishQuiz(selectedQuiz.id);
      else await unpublishQuiz(selectedQuiz.id);
      setQuizzes((previous) => previous.map((quiz) =>
        quiz.id === selectedQuiz.id
          ? { ...quiz, status: action === "publish" ? "published" : "draft" }
          : quiz
      ));
    } catch (statusError) {
      setError(statusError.message || "Could not update quiz status.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="dashboard-stagger space-y-5">
      <Topbar title="Quiz Results" subtitle="Manage classroom quizzes and review student attempts" backFallbackPath="/teacher/dashboard" />
      <HeroBanner
        variant="navy"
        title="Quiz performance"
        subtitle="Select a classroom quiz to review saved student results."
        icons={[Award, ClipboardList]}
      />

      {error && <Card role="alert" className="p-4 text-sm text-tone-red-fg">{error}</Card>}
      {loading ? (
        <Card className="p-6 text-sm text-muted">Loading classroom quizzes...</Card>
      ) : quizzes.length === 0 ? (
        <Card className="p-6 text-sm text-muted">No quizzes found in your classrooms. Create a quiz to get started.</Card>
      ) : (
        <>
          <Card className="grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <label className="text-sm font-bold">
              Select quiz
              <select
                value={selectedId}
                onChange={(event) => setSelectedId(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-2.5 font-normal"
              >
                {quizzes.map((quiz) => (
                  <option key={quiz.id} value={quiz.id}>
                    {quiz.title} · {quiz.course} ({quiz.status})
                  </option>
                ))}
              </select>
            </label>
            {selectedQuiz && (
              <div className="flex flex-wrap gap-2">
                {selectedQuiz.status === "published" ? (
                  <button
                    type="button"
                    disabled={working}
                    onClick={() => changeStatus("unpublish")}
                    className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-3 py-2.5 text-xs font-bold disabled:opacity-50"
                  >
                    <RotateCcw size={14} /> Unpublish
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={working}
                    onClick={() => changeStatus("publish")}
                    className="rounded-xl bg-brand px-3 py-2.5 text-xs font-bold text-on-brand disabled:opacity-50"
                  >
                    Publish quiz
                  </button>
                )}
              </div>
            )}
          </Card>

          {selectedQuiz && (
            <Card className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold">{selectedQuiz.title}</h2>
                  <p className="mt-1 text-xs text-muted">
                    {selectedQuiz.course} · {selectedQuiz.topic} · {selectedQuiz.questionCount} questions · {selectedQuiz.difficulty}
                  </p>
                </div>
                <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold capitalize">{selectedQuiz.status}</span>
              </div>

              {resultsLoading ? (
                <p className="mt-5 text-sm text-muted">Loading student attempts...</p>
              ) : results.length === 0 ? (
                <p className="mt-5 rounded-xl bg-soft p-4 text-sm text-muted">No student attempts are available for this quiz yet.</p>
              ) : (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[32rem] text-left text-sm">
                    <thead className="border-b border-line text-xs text-muted">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Student</th>
                        <th className="px-3 py-2 font-semibold">Score</th>
                        <th className="px-3 py-2 font-semibold">Correct</th>
                        <th className="px-3 py-2 font-semibold">Submitted</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {results.map((attempt, index) => (
                        <tr key={attempt._id ?? attempt.id ?? index}>
                          <td className="px-3 py-3 font-bold">{studentName(attempt)}</td>
                          <td className="px-3 py-3">
                            {attempt.score ?? attempt.marksObtained ?? "—"} / {attempt.totalMarks ?? attempt.total ?? selectedQuiz.totalMarks}
                          </td>
                          <td className="px-3 py-3">
                            {attempt.correctAnswers == null
                              ? "—"
                              : `${attempt.correctAnswers}/${attempt.totalQuestions ?? selectedQuiz.questionCount}`}
                          </td>
                          <td className="px-3 py-3 text-xs text-muted">
                            {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}
        </>
      )}
    </div>
  );
}
