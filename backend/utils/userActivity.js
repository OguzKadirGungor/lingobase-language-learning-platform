const db = require("../models");

async function getUserTimeline(userId) {
  const timeline = [];

  // 🎓 Tüm ders geçmişi
  const lessons = await db.UserLesson.findAll({
    where: { userId },
    include: { model: db.Lesson }
  });

  lessons.forEach(ul => {
    if (ul.lastAccessedAt) {
      timeline.push({
        type: "lesson",
        name: ul.Lesson?.title || "Ders",
        time: ul.lastAccessedAt
      });
    }
  });

  // 🧪 Tüm quiz sonuçları (Quiz başlığı için include ekledik)
  const results = await db.UserQuizResult.findAll({
    where: { userId },
    include: { model: db.Quiz }  // 🔧 Eklendi
  });

  results.forEach(q => {
    timeline.push({
      type: "quiz",
      name: q.Quiz?.title || `Quiz ${q.quizId}`,  // 🔧 Quiz başlığı kullanıldı
      time: q.completedAt
    });
  });

  // 🏅 Rozet kazanımları
  const badges = await db.UserBadge.findAll({
    where: { userId },
    include: db.Badge
  });

  badges.forEach(b => {
    timeline.push({
      type: "badge",
      name: b.Badge?.title || "Rozet",
      time: b.awardedAt
    });
  });

  // 🧮 Puanlar (action bazlı)
  const points = await db.UserPoint.findAll({ where: { userId } });

  points.forEach(p => {
    timeline.push({
      type: "point",
      name: p.action,
      time: p.createdAt
    });
  });

  // 📊 Tüm kayıtları tek dizide topla ve sırala (yeni → eski)
  timeline.sort((a, b) => new Date(b.time) - new Date(a.time));

  return timeline;
}

module.exports = { getUserTimeline };
