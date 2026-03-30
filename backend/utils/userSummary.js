const db = require("../models");
const { getUserTimeline } = require("./userActivity");

async function getUserLearningSummary(userId) {
  // 👤 Kullanıcıyı al
  const user = await db.User.findByPk(userId);

  // 📚 Tüm dersler
  const allLessons = await db.Lesson.findAll();
  const allLessonTitles = allLessons.map(l => l.title);

  // ✅ Kullanıcının tamamladığı dersler
  const userLessons = await db.UserLesson.findAll({
    where: { userId, isCompleted: true },
    include: db.Lesson
  });
  const completedLessons = userLessons
    .map(ul => ul.Lesson?.title)
    .filter(Boolean);

  const completedLessonIds = userLessons.map(ul => ul.lessonId);
  const incompleteLessons = allLessons
    .filter(l => !completedLessonIds.includes(l.id))
    .map(l => l.title);

  // 🧪 Tüm quizler
  const allQuizzes = await db.Quiz.findAll();
  const allQuizTitles = allQuizzes.map(q => q.title);

  // ✅ Kullanıcının tamamladığı quizler

  const quizResults = await db.UserQuizResult.findAll({
  where: { userId },
  include: db.Quiz
});

  const quizPerformance = quizResults.map(result => ({
  title: result.Quiz?.title || `Quiz ${result.quizId}`,
  percentage: result.percentage
}));
  const completedQuizzes = quizResults
    .map(r => r.Quiz?.title)
    .filter(Boolean);

  const completedQuizIds = quizResults.map(q => q.quizId);
  const incompleteQuizzes = allQuizzes
    .filter(q => !completedQuizIds.includes(q.id))
    .map(q => q.title);

  // Quiz başarı ortalaması
  const quizCount = quizResults.length;
  const avgScore = quizCount > 0
    ? Math.round(quizResults.reduce((sum, r) => sum + r.percentage, 0) / quizCount)
    : "Yok";

  //  Hatalı cevaplar
  const wrongAnswers = await db.UserQuizAnswer.findAll({
    where: { userId, isCorrect: false },
    include: db.QuizQuestion
  });

  const mistakeTopics = wrongAnswers
    .map(a => a.QuizQuestion?.topic || null)
    .filter(Boolean);

  const mistakeCounts = {};
  mistakeTopics.forEach(topic => {
    mistakeCounts[topic] = (mistakeCounts[topic] || 0) + 1;
  });



  // 🏅 Rozetler
  const userBadges = await db.UserBadge.findAll({
    where: { userId },
    include: db.Badge
  });
  const badges = userBadges.map(b => b.Badge?.title || "").filter(Boolean);

  // 🧮 Toplam puan
  const points = await db.UserPoint.findAll({ where: { userId } });
  const latest = points[points.length - 1];
  const totalPoints = latest ? latest.totalPoints : 0;

  // 📜 Timeline
  const timeline = await getUserTimeline(userId);

  return {
    level: user.level,
    goal: user.goal,
    totalPoints,
    badges,
    quizCount,
    averageQuizSuccess: avgScore,
    commonMistakes: mistakeCounts,
    timeline,

    allLessons: allLessonTitles,
    completedLessons,
    incompleteLessons,

    allQuizzes: allQuizTitles,
    completedQuizzes,
    incompleteQuizzes,
    quizPerformance
  };
}

module.exports = { getUserLearningSummary };
