const db = require("../models");
const { Op } = require("sequelize");

exports.getRecommendedLessons = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    const level = user.level;
    const goal = user.goal;

    const lessons = await db.Lesson.findAll({
      where: {
        level,
        isPublished: true,
        [Op.or]: [
          { goal: goal },
          { goal: null }
        ]
      },
      order: [["createdAt", "ASC"]],
    });

    // Kullanıcının tamamladığı dersleri bul
    const userLessons = await db.UserLesson.findAll({
      where: { userId, isCompleted: true }
    });
    const completedLessonIds = userLessons.map(l => l.lessonId);

    // Her dersin kilitli olup olmadığını hesapla
    const lessonsWithAccess = lessons.map(lesson => {
      let locked = false;
      // Önkoşulu varsa ve tamamlanmamışsa kilitli
      if (lesson.prerequisiteLessonId && !completedLessonIds.includes(lesson.prerequisiteLessonId)) {
        locked = true;
      }
      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        level: lesson.level,
        goal: lesson.goal,
        isPublished: lesson.isPublished,
        prerequisiteLessonId: lesson.prerequisiteLessonId,
        locked
      }
    });

    res.json(lessonsWithAccess);

  } catch (err) {
    console.error("Önerilen dersler alınamadı:", err);
    res.status(500).json({ error: "Önerilen dersler alınamadı." });
  }
};

  exports.getLessonById = async (req, res) => {
    try {
      const lesson = await db.Lesson.findByPk(req.params.id);
      if (!lesson) {
        return res.status(404).json({ error: "Ders bulunamadı" });
      }
  
      res.json(lesson);
    } catch (err) {
      console.error("Ders getirme hatası:", err);
      res.status(500).json({ error: "Sunucu hatası" });
    }
  };

  // Tüm dersleri getiren endpoint (admin paneli için)
exports.getAllLessons = async (req, res) => {
  try {
    const lessons = await db.Lesson.findAll({
      order: [["createdAt", "DESC"]]
    });

    res.json(lessons);
  } catch (error) {
    console.error("Tüm dersler alınamadı:", error);
    res.status(500).json({ error: "Tüm dersler alınamadı." });
  }
};