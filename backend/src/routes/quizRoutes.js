
const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  saveQuiz,
  getTeacherQuizzes,
} = require("../controllers/quizController");

const router = express.Router();

router.post("/", protect, authorizeRoles("teacher"), saveQuiz);

router.get("/classrooms/:classroomId",protect,authorizeRoles("teacher"),getTeacherQuizzes);

module.exports = router;
