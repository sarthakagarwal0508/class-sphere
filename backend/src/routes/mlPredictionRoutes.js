const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  upsertStudentRiskProfile,
  getClassroomRiskPredictions,
} = require("../controllers/mlPredictionController");

const router = express.Router();

// Teacher must own the classroom; controller also verifies student enrollment.
router.put(
  "/teacher/classrooms/:id/students/:studentId/risk-profile",
  protect,
  authorizeRoles("teacher"),
  upsertStudentRiskProfile
);

router.get("/teacher/classrooms/:id/risk-predictions",protect,authorizeRoles("teacher"),getClassroomRiskPredictions);

module.exports = router;
