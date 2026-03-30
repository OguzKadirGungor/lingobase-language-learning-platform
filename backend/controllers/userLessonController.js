const db = require("../models");
const addUserPoint = require("../utils/addUserPoint");

exports.enrollLesson = async (req, res) => {
  try {
    const userId = req.userId;
    const { lessonId } = req.body;

    if (!lessonId) {
      return res.status(400).json({ error: "lessonId gerekli." });
    }

    // Kullanıcı bu derse zaten kayıtlı mı?
    const existing = await db.UserLesson.findOne({
      where: { userId, lessonId },
    });

    if (existing) {
      return res.status(409).json({ error: "Bu derse zaten kayıt olunmuş." });
    }

    const record = await db.UserLesson.create({
      userId,
      lessonId,
      progress: 0,
      isCompleted: false,
      startedAt: new Date(),
      lastAccessedAt: new Date(),
    });

    res.status(201).json(record);
  } catch (error) {
    console.error("Derse kayıt sırasında hata:", error);
    res.status(500).json({ error: "Derse kayıt başarısız." });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { lessonId } = req.params;
    const { progress } = req.body;

    if (progress == null || progress < 0 || progress > 1) {
      return res.status(400).json({ error: "Progress değeri 0 ile 1 arasında olmalıdır." });
    }

    const userLesson = await db.UserLesson.findOne({
      where: { userId, lessonId },
    });

    if (!userLesson) {
      return res.status(404).json({ error: "Kullanıcı bu derse kayıtlı değil." });
    }

    const updateData = {
      progress,
      lastAccessedAt: new Date(),
    };

    let awardedBadges = [];

    if (progress === 1) {
      updateData.isCompleted = true;
      updateData.completedAt = new Date();
      awardedBadges = await addUserPoint(req.userId, "lesson_completed");
    }
 
    await userLesson.update(updateData);

    res.json({
      message: "İlerleme güncellendi.",
      progress: updateData.progress,
      awardedBadges
    });
  } catch (error) {
    console.error("İlerleme güncellenemedi:", error);
    res.status(500).json({ error: "İlerleme güncellenemedi." });
  }
};
exports.getUserLessons = async (req, res) => {
  try {
    const userId = req.userId;

    const lessons = await db.UserLesson.findAll({
      where: { userId },
      include: {
        model: db.Lesson,
        attributes: ["id", "title", "level", "goal", "description"]
      },
      order: [["updatedAt", "DESC"]],
    });

    res.json(lessons);
  } catch (error) {
    console.error("Kullanıcı dersleri alınamadı:", error);
    res.status(500).json({ error: "Kullanıcı dersleri alınamadı." });
  }
};

exports.getCompletedLessons = async (req, res) => {
  try {
    const userId = req.userId;

    const lessons = await db.UserLesson.findAll({
      where: { userId, isCompleted: true },
      include: {
        model: db.Lesson,
        attributes: ["id", "title", "level", "goal", "description"]
      },
      order: [["updatedAt", "DESC"]],
    });

    // Sadece Lesson bilgilerini sade biçimde alalım
    const simplified = lessons.map(entry => ({
      id: entry.Lesson.id,
      title: entry.Lesson.title,
      level: entry.Lesson.level,
      goal: entry.Lesson.goal,
      description: entry.Lesson.description
    }));

    res.json(simplified);
  } catch (error) {
    console.error("Tamamlanan dersler alınamadı:", error);
    res.status(500).json({ error: "Tamamlanan dersler alınamadı." });
  }
};
