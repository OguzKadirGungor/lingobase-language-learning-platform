const db = require("../models");

exports.createLesson = async (req, res) => {
  try {
    const { title, description, content, level, goal, isPublished, mainTopic, prerequisiteLessonId} = req.body;

    if (!title || !content || !level) {
      return res.status(400).json({ error: "Zorunlu alanlar eksik." });
    }

    const lesson = await db.Lesson.create({
      title,
      description,
      content,
      level,
      goal: goal || null,
      isPublished: isPublished ?? false,
      mainTopic,
      prerequisiteLessonId
    });

    res.status(201).json(lesson);
  } catch (error) {
    console.error("Ders oluşturulurken hata:", error);
    res.status(500).json({ error: "Ders oluşturulamadı." });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const { title, description, content, level, goal, isPublished,mainTopic, prerequisiteLessonId } = req.body;

    const lesson = await db.Lesson.findByPk(lessonId);
    if (!lesson) {
      return res.status(404).json({ error: "Ders bulunamadı." });
    }

    await lesson.update({
      title,
      description,
      content,
      level,
      goal,
      isPublished,
      mainTopic, 
      prerequisiteLessonId
    });

    res.json({ message: "Ders başarıyla güncellendi.", lesson });
  } catch (error) {
    console.error("Ders güncellenemedi:", error);
    res.status(500).json({ error: "Ders güncellenemedi." });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;

    const lesson = await db.Lesson.findByPk(lessonId);
    if (!lesson) {
      return res.status(404).json({ error: "Ders bulunamadı." });
    }

    await lesson.destroy();

    res.json({ message: "Ders başarıyla silindi." });
  } catch (error) {
    console.error("Ders silinemedi:", error);
    res.status(500).json({ error: "Ders silinemedi." });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const { title, lessonId } = req.body;

    const quiz = await db.Quiz.findByPk(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz bulunamadı." });
    }

    await quiz.update({
      title,
      lessonId,
    });

    res.json({ message: "Quiz başarıyla güncellendi.", quiz });
  } catch (error) {
    console.error("Quiz güncellenemedi:", error);
    res.status(500).json({ error: "Quiz güncellenemedi." });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;

    const quiz = await db.Quiz.findByPk(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz bulunamadı." });
    }

    // İlişkili soruları da sil
    await db.QuizQuestion.destroy({ where: { quizId } });

    await quiz.destroy();

    res.json({ message: "Quiz başarıyla silindi." });
  } catch (error) {
    console.error("Quiz silinemedi:", error);
    res.status(500).json({ error: "Quiz silinemedi." });
  }
};

exports.createQuizForLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { title } = req.body;

    // Zaten varsa tekrar oluşturmasın
    const existing = await db.Quiz.findOne({ where: { lessonId } });
    if (existing) {
      return res.status(400).json({ error: "Bu derse ait zaten bir quiz var." });
    }

    const newQuiz = await db.Quiz.create({
      lessonId,
      title,
    });

    res.status(201).json(newQuiz);
  } catch (err) {
    console.error("Quiz oluşturulamadı:", err);
    res.status(500).json({ error: "Quiz oluşturulamadı." });
  }
};

exports.addQuizQuestion = async (req, res) => {
  try {
    const { quizId, questionText, options, correctAnswer } = req.body;

    const quiz = await db.Quiz.findByPk(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz bulunamadı." });
    }

    const question = await db.QuizQuestion.create({
      quizId,
      questionText,
      options,
      correctAnswer
    });

    res.status(201).json(question);
  } catch (err) {
    console.error("Soru eklenemedi:", err);
    res.status(500).json({ error: "Soru eklenemedi." });
  }
};


exports.createLessonPage = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { pageNumber, type, content } = req.body;

    const newPage = await db.LessonPage.create({
      lessonId,
      pageNumber,
      type,
      content,
    });

    res.status(201).json(newPage);
  } catch (error) {
    console.error("Sayfa oluşturulamadı:", error);
    res.status(500).json({ error: "Sayfa oluşturulamadı" });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await db.Quiz.findAll({
      include: {
        model: db.Lesson,
        attributes: ["title", "level", "goal"]
      },
      order: [["createdAt", "DESC"]]
    });

    res.json(quizzes);
  } catch (error) {
    console.error("Tüm quizler alınamadı:", error);
    res.status(500).json({ error: "Tüm quizler alınamadı." });
  }
};

exports.getQuestionsByQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const questions = await db.QuizQuestion.findAll({
      where: { quizId },
      order: [["id", "ASC"]],
    });

    res.json(questions);
  } catch (error) {
    console.error("Quiz soruları alınamadı:", error);
    res.status(500).json({ error: "Sorular alınamadı." });
  }
};

exports.deleteQuizQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await db.QuizQuestion.findByPk(questionId);
    if (!question) return res.status(404).json({ error: "Soru bulunamadı." });

    await question.destroy();
    res.json({ message: "Soru silindi." });
  } catch (err) {
    console.error("Soru silinemedi:", err);
    res.status(500).json({ error: "Soru silinemedi." });
  }
};