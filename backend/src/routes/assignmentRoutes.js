
const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const uploadPdf = require("../middleware/uploadPdf");

const {
  createAssignment,
  getAssignments,
  getAssignmentAttachment,
  submitAssignment,
  getAssignmentSubmissions,
  getSubmissionAttachment,
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

// View/download the assignment question PDF.
router.get(
  "/assignments/:id/attachment",
  protect,
  authorizeRoles("teacher", "student"),
  getAssignmentAttachment
);

router.post(
  "/assignments/:id/submit",
  protect,
  authorizeRoles("student"),
  uploadPdf,
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
router.get(
  "/assignments/:assignmentId/submissions/:submissionId/attachment",
  protect,
  authorizeRoles("teacher"),
  getSubmissionAttachment
);
module.exports = router;
