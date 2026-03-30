const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const db = require("../models");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    const results = await db.UserQuizResult.findAll({
      where: { userId },
      include: [
        {
          model: db.Quiz,
          include: [{ model: db.Lesson, attributes: ["title"] }],
        },
      ],
      order: [["completedAt", "DESC"]],
    });

    const formatted = results.map((r) => ({
      quizId: r.quizId,
      lessonTitle: r.Quiz?.Lesson?.title || "Bilinmeyen Ders",
      score: r.score,
      totalQuestions: r.totalQuestions,
      percentage: r.percentage,
      completedAt: r.completedAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Quiz geçmişi hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

router.get("/statistics", authenticateToken, async (req, res) => {
  try {
    const results = await db.UserQuizResult.findAll({
      where: { userId: req.userId },
      attributes: ["percentage"]
    });

    const total = results.length;
    const averagePercentage = total > 0
      ? results.reduce((sum, r) => sum + r.percentage, 0) / total
      : 0;

    res.json({ totalQuizzes: total, averagePercentage });
  } catch (error) {
    console.error("Quiz istatistikleri alınamadı:", error);
    res.status(500).json({ error: "Quiz istatistikleri alınamadı." });
  }
});

router.get("/result-answers/:quizId", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const quizId = req.params.quizId;

    const answers = await db.UserQuizAnswer.findAll({
      where: { userId, quizId },
      attributes: ["quizQuestionId", "userAnswer"],
      order: [["answeredAt", "ASC"]]
    });

    res.json(answers);
  } catch (error) {
    console.error("Kullanıcı quiz cevapları alınamadı:", error);
    res.status(500).json({ error: "Quiz cevapları alınamadı." });
  }
});
module.exports = router;