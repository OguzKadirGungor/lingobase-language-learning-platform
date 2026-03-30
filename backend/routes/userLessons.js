const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const db = require("../models");

const { enrollLesson, updateProgress, getUserLessons, getCompletedLessons} = require("../controllers/userLessonController");

router.post("/", authenticateToken, enrollLesson);

router.put("/:lessonId/progress", authenticateToken, updateProgress);

router.get("/", authenticateToken, getUserLessons);

router.get("/completed", authenticateToken, getCompletedLessons);

router.get("/progress", authenticateToken, async (req, res) => {
  try {
    const lessons = await db.UserLesson.findAll({
      where: { userId: req.userId },
      attributes: ["progress", "isCompleted"]
    });

    const total = lessons.length;
    const completed = lessons.filter(l => l.isCompleted).length;
    const averageProgress = total > 0
      ? lessons.reduce((sum, l) => sum + l.progress, 0) / total
      : 0;

    res.json({
      totalLessons: total,
      completedLessons: completed,
      averageProgress
    });
  } catch (error) {
    console.error("İlerleme verisi alınamadı:", error);
    res.status(500).json({ error: "İlerleme verisi alınamadı." });
  }
});
 
module.exports = router;