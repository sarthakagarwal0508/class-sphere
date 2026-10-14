const express = require("express");
const { googleAuth } = require("../controllers/googleAuthController");

const router = express.Router();
router.post("/", googleAuth);

module.exports = router;
