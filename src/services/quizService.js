import api from "./api";
import { toApiError } from "./apiError";

function unwrap(response) {
  return response?.data?.data ?? response?.data ?? response;
}

export function listFrom(response, key = "quizzes") {
  const data = unwrap(response);
  return Array.isArray(data) ? data : data?.[key] ?? [];
}

export async function createQuiz(payload) {
  try {
    return unwrap(await api.post("/quizzes", payload));
  } catch (error) {
    throw toApiError(error);
  }
}

export async function getClassroomQuizzes(classroomId) {
  try {
    return listFrom(await api.get(`/quizzes/classrooms/${classroomId}`));
  } catch (error) {
    throw toApiError(error);
  }
}

export async function publishQuiz(quizId) {
  try {
    return unwrap(await api.patch(`/quizzes/${quizId}/publish`));
  } catch (error) {
    throw toApiError(error);
  }
}

export async function unpublishQuiz(quizId) {
  try {
    return unwrap(await api.patch(`/quizzes/${quizId}/unpublish`));
  } catch (error) {
    throw toApiError(error);
  }
}

export async function getQuizResults(quizId) {
  try {
    return unwrap(await api.get(`/quizzes/${quizId}/results`));
  } catch (error) {
    throw toApiError(error);
  }
}

export async function getStudentClassroomQuizzes(classroomId) {
  try {
    return listFrom(
      await api.get(`/quizzes/student/classrooms/${classroomId}`)
    );
  } catch (error) {
    throw toApiError(error);
  }
}

export async function submitQuiz({ quizId, answers }) {
  try {
    return unwrap(await api.post(`/quizzes/${quizId}/submit`, { answers }));
  } catch (error) {
    throw toApiError(error);
  }
}

export async function getStudentQuizAttempts() {
  try {
    return listFrom(await api.get("/quizzes/student/attempts"), "attempts");
  } catch (error) {
    throw toApiError(error);
  }
}

export function normalizeQuiz(quiz, classroom = {}) {
  const questions = Array.isArray(quiz.questions) ? quiz.questions : [];
  return {
    ...quiz,
    id: String(quiz._id ?? quiz.id),
    classroomId: String(
      quiz.classroomId ??
        (typeof quiz.classroom === "object"
          ? quiz.classroom?._id ?? quiz.classroom?.id
          : quiz.classroom) ??
        classroom._id ??
        classroom.id ??
        ""
    ),
    course:
      classroom.name ??
      classroom.title ??
      (typeof quiz.classroom === "object"
        ? quiz.classroom?.name ?? quiz.classroom?.title
        : "") ??
      quiz.course ??
      "Classroom",
    topic: quiz.topic ?? "",
    title: quiz.title ?? quiz.topic ?? "Quiz",
    status: quiz.status ?? "published",
    difficulty: quiz.difficulty ?? "mixed",
    questionCount: quiz.questionCount ?? questions.length,
    questions: questions.map((question, index) => ({
      ...question,
      id: String(question._id ?? question.id ?? index),
      question: question.question ?? question.text ?? "",
      options: Array.isArray(question.options) ? question.options : [],
    })),
    totalMarks: Number(quiz.totalMarks ?? quiz.total ?? questions.length),
    durationMin: Number(quiz.durationMin ?? quiz.duration ?? 0),
    dueDate: quiz.dueDate ?? quiz.due ?? null,
  };
}
