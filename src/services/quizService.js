

import { quizzesData } from "../data/quizzesData";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const store = quizzesData.map((q) => ({ ...q }));

const attempts = new Map();

const find = (quizId) => store.find((q) => String(q.id) === String(quizId));

function toSummary(q) {
  return {
    id: q.id,
    title: q.title,
    course: q.course,
    color: q.color,
    topic: q.topic,
    durationMin: q.durationMin,
    due: q.due,
    dueDate: q.dueDate,
    status: q.status,
    score: q.score,
    total: q.total,
    questionCount: q.questions ? q.questions.length : q.total,
  };
}

export async function getQuizzes() {
  await delay(500);

  return store.map(toSummary);
}

export async function startQuiz(quizId) {
  await delay(500);

  const quiz = find(quizId);
  if (!quiz) throw new Error("Quiz not found.");
  if (quiz.status === "completed") throw new Error("You have already completed this quiz.");

  if (!attempts.has(quiz.id)) {
    attempts.set(quiz.id, Date.now() + quiz.durationMin * 60 * 1000);
  }

  return {
    id: quiz.id,
    title: quiz.title,
    course: quiz.course,
    topic: quiz.topic,
    durationMin: quiz.durationMin,
    endsAt: attempts.get(quiz.id),

    questions: quiz.questions.map(({ id, text, options }) => ({ id, text, options })),
  };
}

export async function submitQuiz({ quizId, answers }) {
  await delay(700);

  const quiz = find(quizId);
  if (!quiz) throw new Error("Quiz not found.");
  if (quiz.status === "completed") throw new Error("This quiz was already submitted.");

  const review = quiz.questions.map((q) => ({
    id: q.id,
    text: q.text,
    options: q.options,
    selected: answers[q.id] ?? null,
    correct: q.correct,
  }));
  const score = review.filter((r) => r.selected === r.correct).length;

  quiz.status = "completed";
  quiz.score = score;
  quiz.total = review.length;
  attempts.delete(quiz.id);

  return {
    quizId: quiz.id,
    score,
    total: review.length,
    percent: Math.round((score / review.length) * 100),
    review,
  };
}
