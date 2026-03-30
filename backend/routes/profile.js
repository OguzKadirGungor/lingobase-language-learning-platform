const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const db = require("../models");

// Kullanıcı profilini getir
router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.json({
      email: user.email,
      level: user.level || "",
      goal: user.goal || "",
      profileImageUrl: user.profileImageUrl || "",
      name: user.name || "",
    });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Kullanıcı profilini güncelle
router.put("/", authenticateToken, async (req, res) => {
  try {
    const { level, goal, profileImageUrl, name } = req.body;
    const user = await db.User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    user.level = level || user.level;
    user.goal = goal || user.goal;
    user.profileImageUrl = profileImageUrl || user.profileImageUrl;
    user.name = name || user.name;
    await user.save();

    res.json({ message: "Profil başarıyla güncellendi" });
  } catch (err) {
    console.error("Profil güncelleme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = router;