const express = require("express");
const router = express.Router();
const db = require("../models");

// GET /api/leaderboard
router.get("/", async (req, res) => {
  try {
    // Tüm kullanıcıları çek
    const users = await db.User.findAll();

    const leaderboard = await Promise.all(
      users.map(async (user) => {
        // Toplam puan
        const totalPoints = await db.UserPoint.sum("points", {
          where: { userId: user.id }
        });

        // Rozet sayısı
        const badgeCount = await db.UserBadge.count({
          where: { userId: user.id }
        });

        // Quiz ortalaması
        const quizResults = await db.UserQuizResult.findAll({
          where: { userId: user.id }
        });

        const quizAverage =
          quizResults.length > 0
            ? Math.round(
                quizResults.reduce((sum, r) => sum + r.percentage, 0) / quizResults.length
              )
            : 0;

        return {
          id: user.id,
          name: user.name,
          languageLevel: user.level,
          totalPoints: totalPoints || 0,
          badgeCount,
          quizAverage
        };
      })
    );

    // Puanlara göre sırala (yüksekten düşüğe)
    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

    res.json(leaderboard);
  } catch (err) {
    console.error("Liderlik tablosu hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = router;