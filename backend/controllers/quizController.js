const db = require("../models");
const addUserPoint = require("../utils/addUserPoint");

exports.getQuizByLesson = async (req, res) => {
  try {
    const lessonId = req.params.lessonId;

    const quiz = await db.Quiz.findOne({
      where: { lessonId },
      include: {
        model: db.QuizQuestion,
        attributes: ["id", "questionText", "options", "correctAnswer"]
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz bulunamadı." });
    }

    res.json(quiz);
  } catch (err) {
    console.error("Quiz getirilemedi:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

exports.submitQuizResult = async (req, res) => {
  try {
    const userId = req.userId;
    const { quizId, answers } = req.body;

    // Daha önce bu quiz çözülmüş mü?
    const existingResult = await db.UserQuizResult.findOne({
      where: { userId, quizId }
    });

    if (existingResult) {
      return res.status(400).json({
        error: "Bu quiz daha önce tamamlanmış. Sadece bir kez çözebilirsiniz."
      });
    }

    let correctCount = 0;
    const total = answers.length;
    const timestamp = new Date();

    for (const answer of answers) {
      const question = await db.QuizQuestion.findByPk(answer.questionId);
      const isCorrect = question.correctAnswer.trim().toLowerCase() === answer.userAnswer.trim().toLowerCase();

      if (isCorrect) correctCount++;

      await db.UserQuizAnswer.create({
        userId,
        quizId,
        quizQuestionId: answer.questionId,
        userAnswer: answer.userAnswer,
        isCorrect,
        answeredAt: timestamp,
      });
    }

    const percentage = Math.round((correctCount / total) * 100);

    await db.UserQuizResult.create({
      userId,
      quizId,
      score: correctCount,
      totalQuestions: total,
      percentage,
      completedAt: timestamp,
    });

    const awardedFromQuiz = await addUserPoint(userId, "quiz_completed");

    const awardedFromPerfect = percentage === 100
      ? await addUserPoint(userId, "perfect_quiz")
      : [];

    const awardedBadges = [...awardedFromQuiz, ...awardedFromPerfect];

    res.status(201).json({
      message: "Quiz sonucu kaydedildi.",
      correct: correctCount,
      total,
      percentage,
      awardedBadges
    });
  } catch (err) {
    console.error("Quiz sonucu kaydedilemedi:", err);
    res.status(500).json({ error: "Quiz sonucu kaydedilemedi.", detail: err.message });
  }
};


const { Op } = require("sequelize");

exports.getAllQuizzes = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.userId);
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

    // Kullanıcının daha önce tamamladığı quizId'leri al
    const completedResults = await db.UserQuizResult.findAll({
      where: { userId: req.userId },
      attributes: ["quizId"]
    });
    const completedQuizIds = completedResults.map(r => r.quizId);

    // Kullanıcının seviyesine ve hedeflerine uygun, henüz çözmediği quizleri getir
    const quizzes = await db.Quiz.findAll({
      where: {
        id: { [Op.notIn]: completedQuizIds }  //  daha önce çözülenleri çıkar
      },
      include: {
        model: db.Lesson,
        attributes: ["title", "level", "goal"],
        where: {
          level: user.level,
          [Op.or]: [
            { goal: user.goal },
            { goal: null },
            { goal: "" }
          ]
        }
      }
    });

    res.json(quizzes);
  } catch (err) {
    console.error("Quiz listesi alınamadı:", err);
    res.status(500).json({ error: "Quiz listesi alınamadı." });
  }
};

exports.getUserQuizResults = async (req, res) => {
  try {
    const results = await db.UserQuizResult.findAll({
      where: { userId: req.userId },
      include: {
        model: db.Quiz,
        attributes: ["id", "title", "level", "goal"]
      },
      order: [["completedAt", "DESC"]]
    });

    const simplified = results.map(result => ({
      id: result.id,
      quizId: result.quizId,
      title: result.Quiz?.title || 'Quiz',
      level: result.Quiz?.level || null,
      goal: result.Quiz?.goal || null,
      percentage: result.percentage,
      completedAt: result.completedAt
    }));

    res.json(simplified);
  } catch (err) {
    console.error("Quiz sonuçları alınamadı:", err);
    res.status(500).json({ error: "Quiz sonuçları alınamadı." });
  }
};

exports.getUserQuizStatistics = async (req, res) => {
  try {
    const userId = req.userId;

    const results = await db.UserQuizResult.findAll({
      where: { userId },
    });

    const totalQuizzes = results.length;
    const averageScore =
      totalQuizzes === 0
        ? 0
        : results.reduce((sum, r) => sum + r.percentage, 0) / totalQuizzes;

    const bestScore =
      totalQuizzes === 0
        ? 0
        : Math.max(...results.map((r) => r.percentage));

    res.json({
      totalQuizzes,
      averageScore: Math.round(averageScore),
      bestScore,
    });
  } catch (error) {
    console.error("Quiz istatistikleri alınamadı:", error);
    res.status(500).json({ error: "Quiz istatistikleri alınamadı." });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quizId = req.params.quizId;

    const quiz = await db.Quiz.findByPk(quizId, {
      include: {
        model: db.QuizQuestion,
        attributes: ["id", "questionText", "options", "correctAnswer"]
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz bulunamadı." });
    }

    res.json(quiz);
  } catch (err) {
    console.error("Quiz getirilemedi:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};