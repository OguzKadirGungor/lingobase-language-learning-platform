const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const { getUserBadges } = require("../controllers/badgeController");

router.get("/", authenticateToken, getUserBadges);

module.exports = router;