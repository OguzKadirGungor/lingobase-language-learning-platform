const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const {
  getAllPages,
  getPageByNumber,
} = require("../controllers/lessonPageController");

// Sayfa listeleme (öğrenci)
router.get("/:lessonId/pages", authenticateToken, getAllPages);

// Belirli sayfa (öğrenci)
router.get("/:lessonId/page/:pageNumber", authenticateToken, getPageByNumber);



module.exports = router;