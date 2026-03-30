const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const { getRecommendedLessons, getLessonById, getAllLessons   } = require("../controllers/lessonController");
const checkAdmin = require("../middleware/roleMiddleware");

router.get("/recommendations", authenticateToken, getRecommendedLessons);


router.get("/all", authenticateToken, checkAdmin , getAllLessons);

router.get("/:id", authenticateToken, getLessonById);


module.exports = router; 