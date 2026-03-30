const db = require("../models");

exports.getUserBadges = async (req, res) => {
  try {
    const badges = await db.UserBadge.findAll({
      where: { userId: req.userId },
      include: {
        model: db.Badge,
        attributes: ["code", "title", "description", "icon"]
      }
    });

    const formatted = badges.map(entry => ({
      code: entry.Badge.code,
      title: entry.Badge.title,
      description: entry.Badge.description,
      icon: entry.Badge.icon,
      awardedAt: entry.awardedAt
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Rozetler alınamadı:", err);
    res.status(500).json({ error: "Rozetler alınamadı." });
  }
};