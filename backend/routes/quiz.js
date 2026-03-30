const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const {
  getQuizByLesson,
  submitQuizResult,
  createQuizForLesson,
  addQuizQuestion,
  getAllQuizzes,
  getUserQuizResults,
  getUserQuizStatistics,
  getQuizById
} = require("../controllers/quizController");


// Quiz ve sorularını getir
router.get("/lesson/:lessonId", authenticateToken, getQuizByLesson);

// Quiz sonucunu kaydet
router.post("/results", authenticateToken, submitQuizResult);



router.get("/", authenticateToken, getAllQuizzes);

router.get("/results/me", authenticateToken, getUserQuizResults);

router.get("/statistics", authenticateToken, getUserQuizStatistics);

router.get("/:quizId", authenticateToken, getQuizById);



module.exports = router;