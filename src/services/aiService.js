import api from "./api";
import { toApiError } from "./apiError";

const unwrap = (response) => response?.data?.data ?? response?.data;

export async function summarizePdf(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    return unwrap(await api.post("/ai/summarize", formData, { timeout: 120000 }));
  } catch (error) {
    throw toApiError(error);
  }
}

export async function generateQuizFromTopic({
  topic,
  studyMaterial = "",
  numQuestions = 5,
  difficulty = "mixed",
}) {
  try {
    const response = await api.post("/ai/quizzes/generate", {
      topic,
      study_material: studyMaterial,
      num_questions: numQuestions,
      difficulty,
    }, { timeout: 120000 });
    return unwrap(response);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function generateQuizFromPdf({ file, numQuestions = 5, difficulty = "mixed" }) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("num_questions", String(numQuestions));
    formData.append("difficulty", difficulty);
    return unwrap(await api.post("/ai/quizzes/generate-from-pdf", formData, { timeout: 120000 }));
  } catch (error) {
    throw toApiError(error);
  }
}
