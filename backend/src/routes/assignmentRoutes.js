const express = require("express");
const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const uploadPdf = require("../middleware/uploadPdf");

const {
  createAssignment,
  getAssignments,
  downloadAssignmentAttachment,
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
  getMySubmission,
} = require("../controllers/assignmentController");

const router = express.Router();

router.post(
  "/classrooms/:id/assignments",
  protect,
  authorizeRoles("teacher"),
  uploadPdf,
  createAssignment
);

router.get(
  "/classrooms/:id/assignments",
  protect,
  authorizeRoles("teacher", "student"),
  getAssignments
);

// Teacher/student must be a member of this assignment's classroom.
router.get(
  "/assignments/:id/attachment",
  protect,
  authorizeRoles("teacher", "student"),
  downloadAssignmentAttachment
);

router.post(
  "/assignments/:id/submit",
  protect,
  authorizeRoles("student"),
  submitAssignment
);

router.get(
  "/assignments/:id/submissions",
  protect,
  authorizeRoles("teacher"),
  getAssignmentSubmissions
);

router.patch(
  "/assignments/:assignmentId/submissions/:submissionId/grade",
  protect,
  authorizeRoles("teacher"),
  gradeSubmission
);

router.get(
  "/assignments/:id/my-submission",
  protect,
  authorizeRoles("student"),
  getMySubmission
);

module.exports = router;