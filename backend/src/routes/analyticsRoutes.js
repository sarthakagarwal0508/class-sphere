
const express = require("express");
const router = express.Router();

const {
  getStudentOverview,
  getStudentClassroomAnalytics,
  getTeacherClassroomAnalytics,
  getTeacherStudentAnalytics,
} = require("../controllers/analyticsController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/student/overview",protect,authorizeRoles("student"),getStudentOverview);
router.get("/student/classrooms/:id",protect,authorizeRoles("student"),getStudentClassroomAnalytics);
router.get("/teacher/classrooms/:id",protect,authorizeRoles("teacher"),getTeacherClassroomAnalytics);
router.get("/teacher/classrooms/:id/students",protect,authorizeRoles("teacher"),getTeacherStudentAnalytics);

module.exports = router;
