const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const db = require("../models");

const { getUserTimeline } = require("../utils/userActivity");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Tamamlanan dersler
    const completedLessons = await db.UserLesson.count({
      where: { userId, isCompleted: true }
    });

    const totalLessons = await db.UserLesson.count({ where: { userId } });

    // Quiz sonuçları
    const results = await db.UserQuizResult.findAll({
      where: { userId }
    });

    const completedQuizzes = results.length;
    const quizAverage =
      completedQuizzes > 0
        ? Math.round(
            results.reduce((sum, r) => sum + r.percentage, 0) / completedQuizzes
          )
        : 0;

    // Toplam puan
    const points = await db.UserPoint.sum("points", {
      where: { userId }
    });

    res.json({
      completedLessons,
      totalLessons,
      completedQuizzes,
      quizAverage,
      totalPoints: points || 0
    });
  } catch (err) {
    console.error("İstatistik hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});


router.get("/recent", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const timeline = await getUserTimeline(userId);
    const sorted = timeline.sort((a, b) => new Date(b.time) - new Date(a.time));

    const lastLesson = sorted.find(item => item.type === "lesson");
    const lastQuiz = sorted.find(item => item.type === "quiz");
    const lastBadge = sorted.find(item => item.type === "badge");

    let badgeTitle = null;
    let badgeDescription = null;
    let badgeImageUrl = null;

    if (lastBadge) {
      // 🧠 Badge verisini detaylı almak için veritabanından çekiyoruz
      const badgeRecord = await db.Badge.findOne({
        where: { title: lastBadge.name }
      });

      if (badgeRecord) {
        badgeTitle = badgeRecord.title;
        badgeDescription = badgeRecord.description;
        badgeImageUrl = badgeRecord.icon;
      }
    }

    res.json({
      lessonTitle: lastLesson?.name || null,
      quizTitle: lastQuiz?.name || null,
      badgeTitle,
      badgeDescription,
      badgeImageUrl
    });
  } catch (err) {
    console.error("Son aktivite hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = router;