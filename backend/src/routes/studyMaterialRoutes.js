const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const uploadPdf = require("../middleware/uploadPdf");

const {createStudyMaterial,getClassroomMaterials,downloadStudyMaterial,updateStudyMaterial,deleteStudyMaterial,
} = require("../controllers/studyMaterialController");

router.use(protect);
router.post("/classrooms/:id/materials",authorizeRoles("teacher"),uploadPdf,createStudyMaterial);
router.get("/classrooms/:id/materials",authorizeRoles("teacher", "student"),getClassroomMaterials);
router.get("/materials/:id/download",authorizeRoles("teacher", "student"),downloadStudyMaterial);
router.patch("/materials/:id",authorizeRoles("teacher"),updateStudyMaterial);
router.delete("/materials/:id",authorizeRoles("teacher"),deleteStudyMaterial);

module.exports = router;