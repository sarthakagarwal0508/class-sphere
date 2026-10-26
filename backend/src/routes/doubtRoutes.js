
const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
  createDoubt,
  getClassroomDoubts,
  addReply,
  updateDoubtStatus,
} = require("../controllers/doubtController");

const router = express.Router();

router.use(protect);

router.post("/classrooms/:classroomId/doubts", createDoubt);
router.get("/classrooms/:classroomId/doubts", getClassroomDoubts);
router.post("/doubts/:doubtId/replies", addReply);
router.patch("/doubts/:doubtId/status", updateDoubtStatus);

module.exports = router;
