
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  Clock3,
  FileQuestion,
  Search,
  Trophy,
  XCircle,
} from "lucide-react";

import Topbar from "../../components/Topbar";
import Card from "../../components/Card";

const initialQuizzes = [
  {
    id: 1,
    title: "Data Structures Fundamentals",
    subject: "Data Structures",
    description: "Test your understanding of arrays, linked lists, stacks and queues.",
    questions: 10,
    duration: 15,
    marks: 20,
    due: "20 Oct 2026",
    status: "available",
    questionsData: [
      {
        question: "Which data structure follows the LIFO principle?",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        answer: 1,
      },
      {
        question: "What is the time complexity of accessing an array element by index?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        answer: 2,
      },
      {
        question: "Which data structure follows FIFO?",
        options: ["Stack", "Queue", "Graph", "Heap"],
        answer: 1,
      },
    ],
  },
  {
    id: 2,
    title: "Database Management Basics",
    subject: "Database Systems",
    description: "Revise SQL, keys, relationships and database fundamentals.",
    questions: 15,
    duration: 20,
    marks: 30,
    due: "22 Oct 2026",
    status: "available",
    questionsData: [
      {
        question: "Which key uniquely identifies a row in a table?",
        options: ["Foreign key", "Primary key", "Duplicate key", "Secondary value"],
        answer: 1,
      },
      {
        question: "Which SQL command retrieves data?",
        options: ["GET", "OPEN", "SELECT", "FETCH ALL"],
        answer: 2,
      },
      {
        question: "What does DBMS stand for?",
        options: [
          "Data Backup Management System",
          "Database Management System",
          "Digital Base Mapping Software",
          "Database Memory Storage",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 3,
    title: "Web Development Checkpoint",
    subject: "Web Development",
    description: "Check your knowledge of HTML, CSS and JavaScript basics.",
    questions: 12,
    duration: 15,
    marks: 24,
    due: "Completed",
    status: "completed",
    score: 18,
    questionsData: [
      {
        question: "Which HTML element creates a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        answer: 1,
      },
    ],
  },
  {
    id: 4,
    title: "Object-Oriented Programming",
    subject: "Programming",
    description: "Practice questions on classes, objects, inheritance and polymorphism.",
    questions: 10,
    duration: 12,
    marks: 20,
    due: "25 Oct 2026",
    status: "available",
    questionsData: [
      {
        question: "Which concept allows a class to inherit properties from another class?",
        options: ["Encapsulation", "Inheritance", "Abstraction", "Compilation"],
        answer: 1,
      },
      {
        question: "Which concept bundles data and methods together?",
        options: ["Encapsulation", "Iteration", "Recursion", "Overloading"],
        answer: 0,
      },
      {
        question: "Which OOP concept allows one interface to have different implementations?",
        options: ["Inheritance", "Polymorphism", "Encapsulation", "Instantiation"],
        answer: 1,
      },
    ],
  },
];

const filters = [
  { id: "all", label: "All quizzes" },
  { id: "available", label: "Available" },
  { id: "in-progress", label: "In progress" },
  { id: "completed", label: "Completed" },
];

function StatusBadge({ status }) {
  const styles = {
    available: "bg-tone-green text-tone-green-fg",
    "in-progress": "bg-tone-yellow text-tone-yellow-fg",
    completed: "bg-tone-blue text-tone-blue-fg",
  };

  const labels = {
    available: "Available",
    "in-progress": "In progress",
    completed: "Completed",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] ?? styles.available
      }`}
    >
      {labels[status] ?? "Available"}
    </span>
  );
}

function QuizCard({ quiz, onStart, onReview }) {
  const isCompleted = quiz.status === "completed";

  return (
    <Card className="flex h-full flex-col p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-tone-yellow text-tone-yellow-fg">
          <FileQuestion size={21} />
        </div>
        <StatusBadge status={quiz.status} />
      </div>

      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-muted">
        {quiz.subject}
      </p>

      <h2 className="mt-1 text-base font-extrabold leading-snug">
        {quiz.title}
      </h2>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {quiz.description}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2 border-y border-line py-3">
        <div>
          <p className="text-base font-extrabold">{quiz.questions}</p>
          <p className="mt-0.5 text-xs text-muted">Questions</p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-base font-extrabold">
            <Clock3 size={14} className="text-muted" />
            {quiz.duration}m
          </p>
          <p className="mt-0.5 text-xs text-muted">Duration</p>
        </div>
        <div>
          <p className="text-base font-extrabold">{quiz.marks}</p>
          <p className="mt-0.5 text-xs text-muted">Total marks</p>
        </div>
      </div>

      {isCompleted && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-tone-blue px-3 py-2 text-sm">
          <span className="text-tone-blue-fg">Your score</span>
          <span className="font-extrabold text-tone-blue-fg">
            {quiz.score ?? 0}/{quiz.marks}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={() => (isCompleted ? onReview(quiz) : onStart(quiz))}
        className={`mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
          isCompleted
            ? "border border-line bg-card text-ink hover:bg-soft"
            : "bg-brand text-on-brand hover:brightness-95"
        }`}
      >
        {isCompleted ? "Review quiz" : "Start quiz"}
        <ArrowRight size={16} />
      </button>
    </Card>
  );
}

function QuizRunner({ quiz, onClose, onComplete, reviewOnly = false }) {
  const questions = quiz.questionsData ?? [];
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(reviewOnly);

  const question = questions[questionIndex];
  const selectedAnswer = answers[questionIndex];
  const isLastQuestion = questionIndex === questions.length - 1;

  const score = questions.reduce(
    (total, item, index) =>
      total + (answers[index] === item.answer ? 1 : 0),
    0,
  );

  if (!questions.length) {
    return (
      <Card className="p-6 text-center">
        <FileQuestion className="mx-auto text-muted" size={32} />
        <h2 className="mt-3 text-lg font-extrabold">Questions are not available yet</h2>
        <p className="mt-2 text-sm text-muted">
          The quiz questions will appear here when they are added.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 rounded-xl bg-brand px-4 py-2 text-sm font-bold text-on-brand"
        >
          Back to quizzes
        </button>
      </Card>
    );
  }

  const finishQuiz = () => {
    setSubmitted(true);
    if (!reviewOnly) {
      onComplete({
        ...quiz,
        status: "completed",
        score: Math.round((score / questions.length) * quiz.marks),
      });
    }
  };

  if (submitted) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <Card className="mx-auto max-w-2xl p-6 text-center sm:p-9">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-tone-yellow text-tone-yellow-fg">
          <Trophy size={30} />
        </div>
        <p className="mt-5 text-sm font-bold text-muted">
          {reviewOnly ? "QUIZ REVIEW" : "QUIZ COMPLETED"}
        </p>
        <h2 className="mt-2 text-2xl font-extrabold">
          {reviewOnly ? "Your quiz result" : "Well done!"}
        </h2>
        <p className="mt-2 text-sm text-muted">{quiz.title}</p>

        <div className="mx-auto mt-6 max-w-xs rounded-2xl bg-soft p-5">
          <p className="text-4xl font-extrabold">{percentage}%</p>
          <p className="mt-1 text-sm text-muted">
            {score} correct out of {questions.length} questions
          </p>
          <p className="mt-2 text-sm font-bold">
            Score: {Math.round((score / questions.length) * quiz.marks)} / {quiz.marks}
          </p>
        </div>

        <div className="mt-6 space-y-3 text-left">
          {questions.map((item, index) => {
            const correct = answers[index] === item.answer;

            return (
              <div key={`${quiz.id}-${index}`} className="rounded-xl border border-line p-4">
                <div className="flex items-start gap-2">
                  {correct ? (
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-tone-green-fg" />
                  ) : (
                    <XCircle size={18} className="mt-0.5 shrink-0 text-tone-red-fg" />
                  )}
                  <div>
                    <p className="text-sm font-bold">
                      {index + 1}. {item.question}
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      Your answer:{" "}
                      {answers[index] === undefined
                        ? "Not answered"
                        : item.options[answers[index]]}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-tone-green-fg">
                      Correct answer: {item.options[item.answer]}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-on-brand"
        >
          Back to quizzes
        </button>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-3xl p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={onClose}
            className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
          >
            <ArrowLeft size={16} />
            All quizzes
          </button>
          <p className="text-xs font-bold uppercase tracking-wide text-muted">
            {quiz.subject}
          </p>
          <h2 className="mt-1 text-xl font-extrabold">{quiz.title}</h2>
        </div>
        <span className="rounded-xl bg-tone-yellow px-3 py-2 text-sm font-bold text-tone-yellow-fg">
          {questionIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-soft">
        <div
          className="h-full rounded-full bg-brand transition-all"
          style={{
            width: `${((questionIndex + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      <div className="mt-7">
        <p className="text-xs font-bold text-muted">
          QUESTION {questionIndex + 1}
        </p>
        <h3 className="mt-2 text-lg font-extrabold leading-relaxed">
          {question.question}
        </h3>

        <div className="mt-5 space-y-3">
          {question.options.map((option, index) => {
            const selected = selectedAnswer === index;

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  setAnswers((previous) => ({
                    ...previous,
                    [questionIndex]: index,
                  }))
                }
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${
                  selected
                    ? "border-brand bg-brand-soft text-ink ring-1 ring-brand"
                    : "border-line bg-card hover:bg-soft"
                }`}
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border text-xs font-bold ${
                    selected
                      ? "border-brand bg-brand text-on-brand"
                      : "border-line text-muted"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-semibold">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between gap-3 border-t border-line pt-5">
        <button
          type="button"
          disabled={questionIndex === 0}
          onClick={() => setQuestionIndex((index) => index - 1)}
          className="flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-bold transition hover:bg-soft disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft size={16} />
          Previous
        </button>

        {isLastQuestion ? (
          <button
            type="button"
            onClick={finishQuiz}
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-extrabold text-on-brand transition hover:brightness-95"
          >
            Submit quiz
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setQuestionIndex((index) => index + 1)}
            className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-on-brand transition hover:brightness-95"
          >
            Next question
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </Card>
  );
}

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [reviewOnly, setReviewOnly] = useState(false);

  const counts = useMemo(() => {
    return {
      all: quizzes.length,
      available: quizzes.filter((quiz) => quiz.status === "available").length,
      "in-progress": quizzes.filter((quiz) => quiz.status === "in-progress").length,
      completed: quizzes.filter((quiz) => quiz.status === "completed").length,
    };
  }, [quizzes]);

  const visibleQuizzes = useMemo(() => {
    const term = search.trim().toLowerCase();

    return quizzes.filter((quiz) => {
      const matchesFilter = filter === "all" || quiz.status === filter;
      const matchesSearch =
        !term ||
        quiz.title.toLowerCase().includes(term) ||
        quiz.subject.toLowerCase().includes(term) ||
        quiz.description.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [quizzes, filter, search]);

  const openQuiz = (quiz, review = false) => {
    setActiveQuiz(quiz);
    setReviewOnly(review);
  };

  const completeQuiz = (updatedQuiz) => {
    setQuizzes((previous) =>
      previous.map((quiz) => (quiz.id === updatedQuiz.id ? updatedQuiz : quiz)),
    );
  };

  if (activeQuiz) {
    return (
      <div className="dashboard-stagger space-y-5">
        <Topbar
          title={reviewOnly ? "Quiz Review" : "Take Quiz"}
          subtitle="Read each question carefully and choose your answer"
        />
        <QuizRunner
          key={`${activeQuiz.id}-${reviewOnly ? "review" : "take"}`}
          quiz={activeQuiz}
          reviewOnly={reviewOnly}
          onClose={() => setActiveQuiz(null)}
          onComplete={completeQuiz}
        />
      </div>
    );
  }

  return (
    <div className="dashboard-stagger space-y-5">
      <Topbar
        title="Quizzes"
        subtitle="Practice your knowledge and track your progress"
      />

      <section className="relative overflow-hidden rounded-2xl bg-panel p-5 text-white shadow-sm sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-brand/15 blur-2xl" />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-sm font-bold text-brand">
              <CircleHelp size={17} />
              YOUR LEARNING CHECKPOINT
            </div>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
              Ready to test yourself?
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/70">
              Take a quick quiz, strengthen your concepts and keep moving
              forward one question at a time.
            </p>
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center self-start rounded-2xl bg-white/10 sm:self-center">
            <BookOpen size={38} className="text-brand" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total quizzes", value: counts.all, icon: FileQuestion, tone: "bg-tone-yellow text-tone-yellow-fg" },
          { label: "Available", value: counts.available, icon: CircleHelp, tone: "bg-tone-green text-tone-green-fg" },
          { label: "In progress", value: counts["in-progress"], icon: Clock3, tone: "bg-tone-yellow text-tone-yellow-fg" },
          { label: "Completed", value: counts.completed, icon: CheckCircle2, tone: "bg-tone-blue text-tone-blue-fg" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <Card key={label} className="flex items-center gap-3 p-3 sm:p-4">
            <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone}`}>
              <Icon size={19} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-muted">{label}</p>
              <p className="text-2xl font-extrabold">{value}</p>
            </div>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-extrabold">Your quizzes</h2>
            <p className="mt-1 text-sm text-muted">
              Choose a quiz and see how much you know.
            </p>
          </div>

          <label className="flex min-h-10 w-full items-center gap-2 rounded-xl border border-line bg-card px-3 sm:max-w-xs">
            <Search size={16} className="shrink-0 text-muted" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search quizzes..."
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`rounded-xl border px-4 py-2 text-xs font-bold transition ${
                filter === item.id
                  ? "border-brand bg-brand text-on-brand"
                  : "border-line bg-card text-muted hover:text-ink"
              }`}
            >
              {item.label}
              <span className="ml-2 opacity-70">{counts[item.id]}</span>
            </button>
          ))}
        </div>

        {visibleQuizzes.length === 0 ? (
          <Card className="p-8 text-center">
            <Search className="mx-auto text-muted" size={28} />
            <h3 className="mt-3 font-extrabold">No quizzes found</h3>
            <p className="mt-1 text-sm text-muted">
              Try another search or select a different filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="mt-4 rounded-xl bg-brand px-4 py-2 text-sm font-bold text-on-brand"
            >
              Clear filters
            </button>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 min-[1400px]:grid-cols-3">
            {visibleQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onStart={(selected) => openQuiz(selected)}
                onReview={(selected) => openQuiz(selected, true)}
              />
            ))}
          </div>
        )}
      </section>

      <p className="text-center text-xs text-muted">
        Quiz content shown here is sample data for frontend development.
      </p>
    </div>
  );
}
