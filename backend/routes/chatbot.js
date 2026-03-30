const express = require("express");
const router = express.Router();
const { chatWithBot } = require("../chatbot/chatController");
const authenticateToken = require("../middleware/authMiddleware");
const chatController = require("../chatbot/chatController");

router.post("/",authenticateToken, chatWithBot);
router.get("/history", authenticateToken, chatController.getChatHistory);

module.exports = router;