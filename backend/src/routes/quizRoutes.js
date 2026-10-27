
const express = require("express");
const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const {
  saveQuiz,
  getTeacherQuizzes,
  getStudentQuizzes,
  submitQuiz,
  getMyQuizAttempts,
} = require("../controllers/quizController");

const router = express.Router();

// Teacher APIs
router.post("/", protect, authorizeRoles("teacher"), saveQuiz);
router.get("/classrooms/:classroomId",protect,authorizeRoles("teacher"),getTeacherQuizzes);
// Student APIs
router.get("/student/classrooms/:classroomId",protect,authorizeRoles("student"),getStudentQuizzes);
router.post("/:quizId/submit",protect,authorizeRoles("student"),submitQuiz);
router.get("/student/attempts",protect,authorizeRoles("student"),getMyQuizAttempts);

module.exports = router;
