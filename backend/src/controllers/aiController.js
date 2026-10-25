const {
  AIServiceError,
  summarizePdf,
  generateQuiz,
  generateQuizFromPdf,
} = require("../services/aiServiceClient");

const sendServiceError = (res, error) => {
  if (error instanceof AIServiceError) {
    return res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message,
    });
  }
  console.error("AI integration error:", error.message);
  return res.status(500).json({ success: false, message: "Internal server error." });
};

const summarizeNotes = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Please upload a PDF in the 'file' field." });
  }

  try {
    const data = await summarizePdf(req.file);
    if (typeof data?.summary !== "string" || !Array.isArray(data?.flashcards)) {
      return res.status(502).json({ success: false, code: "AI_INVALID_RESPONSE", message: "The summarizer returned an unexpected response." });
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return sendServiceError(res, error);
  }
};

const validateQuizPayload = (body) => {
  const topic = typeof body.topic === "string" ? body.topic.trim() : "";
  const studyMaterial = typeof body.study_material === "string" ? body.study_material.trim() : "";
  const numQuestions = body.num_questions === undefined ? 5 : Number(body.num_questions);
  const difficulty = body.difficulty === undefined ? "mixed" : body.difficulty;

  if (!topic && !studyMaterial) return { error: "Send 'topic' or 'study_material'." };
  if (!Number.isInteger(numQuestions) || numQuestions < 1 || numQuestions > 20) {
    return { error: "num_questions must be an integer between 1 and 20." };
  }
  if (!["easy", "medium", "hard", "mixed"].includes(difficulty)) {
    return { error: "difficulty must be easy, medium, hard or mixed." };
  }
  if (topic.length > 500 || studyMaterial.length > 12000) {
    return { error: "topic must be at most 500 characters and study_material at most 12000 characters." };
  }
  return { value: { topic, study_material: studyMaterial, num_questions: numQuestions, difficulty } };
};

const generateQuizFromText = async (req, res) => {
  const validation = validateQuizPayload(req.body || {});
  if (validation.error) return res.status(400).json({ success: false, message: validation.error });

  try {
    const data = await generateQuiz(validation.value);
    if (!data || !Array.isArray(data.questions)) {
      return res.status(502).json({ success: false, code: "AI_INVALID_RESPONSE", message: "The quiz service returned an unexpected response." });
    }
    // This route is teacher-only because the response includes correct answers.
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return sendServiceError(res, error);
  }
};

const generateQuizFromPdfController = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "Upload a PDF in the 'file' field." });

  const numQuestions = req.body.num_questions === undefined ? 5 : Number(req.body.num_questions);
  const difficulty = req.body.difficulty === undefined ? "mixed" : req.body.difficulty;
  if (!Number.isInteger(numQuestions) || numQuestions < 1 || numQuestions > 20) {
    return res.status(400).json({ success: false, message: "num_questions must be an integer between 1 and 20." });
  }
  if (!["easy", "medium", "hard", "mixed"].includes(difficulty)) {
    return res.status(400).json({ success: false, message: "difficulty must be easy, medium, hard or mixed." });
  }

  try {
    const data = await generateQuizFromPdf(req.file, { num_questions: numQuestions, difficulty });
    if (!data || !Array.isArray(data.questions)) {
      return res.status(502).json({ success: false, code: "AI_INVALID_RESPONSE", message: "The quiz service returned an unexpected response." });
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return sendServiceError(res, error);
  }
};

module.exports = { summarizeNotes, generateQuizFromText, generateQuizFromPdfController };
