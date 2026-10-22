import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Flag } from "lucide-react";

import Topbar from "../../components/Topbar";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import ConfirmDialog from "../../components/ConfirmDialog";
import ProgressRing from "../../components/ProgressRing";
import useFetch from "../../hooks/useFetch";
import { startQuiz, submitQuiz } from "../../services/quizService";
import { formatTimer } from "../../utils/timer";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

function ResultView({ quiz, result }) {
  const skipped = result.review.filter((r) => r.selected === null).length;
  const wrong = result.total - result.score - skipped;

  let message = "Keep practising. Review the answers below and revise the notes.";
  if (result.percent >= 80) message = "Excellent work!";
  else if (result.percent >= 50) message = "Good effort. Revise the topics you missed.";

  return (
    <div className="space-y-5">
      <Topbar title={quiz.title} subtitle={`${quiz.course}, result`} />

      <Card className="flex flex-wrap items-center gap-6 p-5">
        <ProgressRing done={result.score} total={result.total} size={112} stroke={14} />

        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-extrabold">
            You scored {result.score} out of {result.total} ({result.percent}%)
          </h2>
          <p className="mt-1 text-sm text-muted">{message}</p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-tone-green px-3 py-1 text-tone-green-fg">
              Correct {result.score}
            </span>
            <span className="rounded-full bg-tone-red px-3 py-1 text-tone-red-fg">Wrong {wrong}</span>
            <span className="rounded-full bg-soft px-3 py-1 text-muted">Skipped {skipped}</span>
          </div>

          <Link
            to="/student/quizzes"
            className="mt-4 inline-block rounded-lg bg-panel px-4 py-2 text-xs font-bold text-white"
          >
            Back to quizzes
          </Link>
        </div>
      </Card>

      <section>
        <h2 className="text-xl font-extrabold">Review your answers</h2>

        <div className="mt-2 space-y-3">
          {result.review.map((item, index) => (
            <Card key={item.id} className="p-4">
              <p className="text-xs text-muted">Question {index + 1}</p>
              <h3 className="mt-0.5 text-base font-bold">{item.text}</h3>

              <div className="mt-3 space-y-2">
                {item.options.map((option, i) => {
                  const isCorrect = i === item.correct;
                  const isPicked = i === item.selected;

                  let style = "border-line";
                  if (isCorrect) style = "border-tone-green-fg bg-tone-green";
                  else if (isPicked) style = "border-tone-red-fg bg-tone-red";

                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm ${style}`}
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-card text-xs font-bold">
                        {LETTERS[i]}
                      </span>
                      <span className="min-w-0 flex-1">{option}</span>
                      {isCorrect && (
                        <span className="text-xs font-bold text-tone-green-fg">Correct answer</span>
                      )}
                      {isPicked && !isCorrect && (
                        <span className="text-xs font-bold text-tone-red-fg">Your answer</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {item.selected === null && (
                <p className="mt-2 text-xs font-semibold text-muted">You skipped this question.</p>
              )}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function QuizRunner({ quiz }) {
  const { questions } = quiz;
  const total = questions.length;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [now, setNow] = useState(() => Date.now());
  const [result, setResult] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submitRef = useRef(null);

const secondsLeft = Math.max(
    0,
    Math.min(quiz.durationMin * 60, Math.ceil((quiz.endsAt - now) / 1000))
  );
  const lowTime = secondsLeft <= 60;

  const question = questions[current];
  const selected = answers[question.id];
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const isLast = current === total - 1;

  const submit = async () => {
    if (submitting) return;

    setConfirming(false);
    setSubmitting(true);
    setSubmitError("");
    try {
      setResult(await submitQuiz({ quizId: quiz.id, answers }));
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

useEffect(() => {
    submitRef.current = submit;
  });

useEffect(() => {
    if (result) return undefined;

    const id = setInterval(() => {
      const time = Date.now();
      setNow(time);
      if (time >= quiz.endsAt) {
        clearInterval(id);
        submitRef.current?.();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [quiz.endsAt, result]);

useEffect(() => {
    if (result) return undefined;

    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [result]);

  if (result) return <ResultView quiz={quiz} result={result} />;

  const choose = (index) => setAnswers((prev) => ({ ...prev, [question.id]: index }));
  const toggleFlag = () => setFlagged((prev) => ({ ...prev, [question.id]: !prev[question.id] }));

  const unanswered = total - answeredCount;
  const confirmMessage =
    `You answered ${answeredCount} of ${total} questions` +
    (unanswered > 0 ? ` (${unanswered} left blank)` : "") +
    (flaggedCount > 0 ? ` and flagged ${flaggedCount} for review` : "") +
    ". You cannot change your answers after submitting.";

  return (
    <div className="space-y-5">
      <Topbar
        title={quiz.title}
        subtitle={`${quiz.course}, question ${current + 1} of ${total}`}
      />

      <div className="grid gap-5 min-[1100px]:grid-cols-[minmax(0,1fr)_16rem]">

        <Card className="p-5">
          <div className="h-1.5 rounded-full bg-soft">
            <div
              className="h-full rounded-full bg-brand transition-all duration-300"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>

          <p className="mt-4 text-sm text-muted">Topic: {quiz.topic}</p>
          <h2 className="mt-1 text-xl font-extrabold leading-snug">{question.text}</h2>

          <div role="radiogroup" aria-label="Answer options" className="mt-4 space-y-2.5">
            {question.options.map((option, i) => {
              const isSelected = selected === i;

              return (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => choose(i)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                    isSelected
                      ? "border-brand bg-brand-soft font-bold"
                      : "border-line hover:bg-soft"
                  }`}
                >
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                      isSelected ? "bg-brand text-on-brand" : "bg-soft"
                    }`}
                  >
                    {LETTERS[i]}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="rounded-lg bg-soft px-4 py-2 text-xs font-bold transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={toggleFlag}
                aria-pressed={Boolean(flagged[question.id])}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition ${
                  flagged[question.id] ? "bg-tone-red text-tone-red-fg" : "bg-soft hover:opacity-80"
                }`}
              >
                <Flag size={13} />
                {flagged[question.id] ? "Flagged" : "Flag for review"}
              </button>

              <button
                type="button"
                onClick={() => (isLast ? setConfirming(true) : setCurrent((c) => c + 1))}
                className="rounded-lg bg-brand px-4 py-2 text-xs font-bold text-on-brand"
              >
                {isLast ? "Review and submit" : "Next question"}
              </button>
            </div>
          </div>
        </Card>

<aside className="space-y-4 min-[1100px]:self-start">
          <div
            className={`rounded-2xl p-5 text-center text-white ${lowTime ? "bg-red-600" : "bg-panel"}`}
          >
            <p className="text-sm text-white/80">Time left</p>
            <p role="timer" className="mt-1 text-4xl font-extrabold tabular-nums">
              {formatTimer(secondsLeft)}
            </p>
          </div>

          <Card className="p-4">
            <h2 className="text-base font-extrabold">Questions</h2>
            <p className="mt-0.5 text-xs text-muted">
              {answeredCount} of {total} answered
            </p>

            <div className="mt-3 grid grid-cols-5 gap-2">
              {questions.map((q, i) => {
                const isCurrent = i === current;
                const isAnswered = answers[q.id] !== undefined;

                let style = "bg-soft text-muted";
                if (isAnswered) style = "bg-panel text-white";
                if (isCurrent) style = "bg-brand text-on-brand";

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrent(i)}
                    aria-current={isCurrent ? "true" : undefined}
                    aria-label={`Question ${i + 1}${isAnswered ? ", answered" : ""}${
                      flagged[q.id] ? ", flagged" : ""
                    }`}
                    className={`relative grid h-8 place-items-center rounded-lg text-xs font-bold transition ${style}`}
                  >
                    {i + 1}
                    {flagged[q.id] && (
                      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-xs text-muted">Dark: answered. Red dot: flagged.</p>

            {submitError && (
              <p role="alert" className="mt-3 text-xs font-semibold text-tone-red-fg">
                {submitError}
              </p>
            )}

            <button
              type="button"
              onClick={() => setConfirming(true)}
              disabled={submitting}
              className="mt-4 w-full rounded-xl bg-panel py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit quiz"}
            </button>
          </Card>
        </aside>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Submit this quiz?"
        message={confirmMessage}
        confirmLabel="Submit quiz"
        cancelLabel="Keep working"
        onConfirm={submit}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
}

export default function AttemptQuiz() {
  const { quizId } = useParams();
  const fetchQuiz = useCallback(() => startQuiz(quizId), [quizId]);
  const { data: quiz, error, status, reload } = useFetch(fetchQuiz);

  if (status === "loading") {
    return (
      <div className="space-y-5">
        <Topbar title="Quiz" subtitle="Getting your questions ready" />
        <Loader label="Loading quiz..." />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-5">
        <Topbar title="Quiz" subtitle="Something went wrong" />
        <Card className="p-5 text-center">
          <p className="text-sm font-semibold">{error?.message || "Could not load this quiz."}</p>
          <div className="mt-3 flex justify-center gap-2">
            <button
              onClick={reload}
              className="rounded-lg bg-brand px-4 py-2 text-xs font-bold text-on-brand"
            >
              Try again
            </button>
            <Link
              to="/student/quizzes"
              className="rounded-lg bg-soft px-4 py-2 text-xs font-bold"
            >
              Back to quizzes
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return <QuizRunner key={quiz.id} quiz={quiz} />;
}
