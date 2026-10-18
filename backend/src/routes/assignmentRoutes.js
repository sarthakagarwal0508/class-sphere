const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createAssignment,getAssignments} = require("../controllers/assignmentController");

const router = express.Router();

router.post("/classrooms/:id/assignments",protect,authorizeRoles("teacher"),createAssignment);
router.get("/classrooms/:id/assignments",protect,authorizeRoles("teacher", "student"),getAssignments);

module.exports = router;