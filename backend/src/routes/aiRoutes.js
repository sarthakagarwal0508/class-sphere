const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const uploadPdf = require("../middleware/uploadPdf");
const {
  summarizeNotes,
  generateQuizFromText,
  generateQuizFromPdfController,
} = require("../controllers/aiController");

const router = express.Router();

// Summaries and flashcards are available to authenticated teachers and students.
router.post("/summarize", protect, authorizeRoles("teacher", "student"), uploadPdf, summarizeNotes);

// Generated MCQs include correct answers; only teachers may request them.
router.post("/quizzes/generate", protect, authorizeRoles("teacher"), generateQuizFromText);
router.post("/quizzes/generate-from-pdf", protect, authorizeRoles("teacher"), uploadPdf, generateQuizFromPdfController);

module.exports = router;
