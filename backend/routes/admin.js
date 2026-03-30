const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const checkAdmin = require("../middleware/roleMiddleware");
const adminController = require("../controllers/adminController");

//  Ders yönetimi
router.post("/lessons", authenticateToken, checkAdmin , adminController.createLesson);
router.put("/lessons/:id", authenticateToken, checkAdmin , adminController.updateLesson);
router.delete("/lessons/:id", authenticateToken, checkAdmin , adminController.deleteLesson);

// Quiz işlemleri
router.put("/quizzes/:id", authenticateToken, checkAdmin , adminController.updateQuiz);
router.delete("/quizzes/:id", authenticateToken, checkAdmin , adminController.deleteQuiz);
router.post("/quizzes/lesson/:lessonId", authenticateToken, checkAdmin , adminController.createQuizForLesson);
router.post("/quizzes/questions", authenticateToken, checkAdmin , adminController.addQuizQuestion);
router.get("/quizzes", authenticateToken, checkAdmin, adminController.getAllQuizzes);

router.get("/quizzes/:quizId/questions", authenticateToken, checkAdmin, adminController.getQuestionsByQuiz);
router.delete("/quizzes/questions/:questionId", authenticateToken, checkAdmin, adminController.deleteQuizQuestion);

// Sayfa oluşturma 
router.post("/:lessonId/pages", authenticateToken, checkAdmin , adminController.createLessonPage);

module.exports = router;