const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {createAssignment,getAssignments, submitAssignment , getAssignmentSubmissions ,gradeSubmission , getMySubmission} = require("../controllers/assignmentController");

const router = express.Router();

router.post("/classrooms/:id/assignments",protect,authorizeRoles("teacher"),createAssignment);
router.get("/classrooms/:id/assignments",protect,authorizeRoles("teacher", "student"),getAssignments);
router.post("/assignments/:id/submit",protect,authorizeRoles("student"),submitAssignment);
router.get("/assignments/:id/submissions",protect,authorizeRoles("teacher"),getAssignmentSubmissions);
router.patch("/assignments/:assignmentId/submissions/:submissionId/grade",protect,authorizeRoles("teacher"),gradeSubmission);
router.get("/assignments/:id/my-submission",protect,authorizeRoles("student"),getMySubmission);

module.exports = router;