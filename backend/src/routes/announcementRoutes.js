const express = require("express");
const router = express.Router();

const {createAnnouncement,getAnnouncements,updateAnnouncement, deleteAnnouncement,
} = require("../controllers/announcementController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/classrooms/:id/announcements",protect,authorizeRoles("teacher"),createAnnouncement);
router.get("/classrooms/:id/announcements",protect,getAnnouncements);
router.patch("/announcements/:id",protect,authorizeRoles("teacher"),updateAnnouncement);
router.delete("/announcements/:id",protect,authorizeRoles("teacher"),deleteAnnouncement);

module.exports = router;