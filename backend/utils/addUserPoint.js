const db = require("../models");
const checkAndAwardBadges = require("./checkAndAwardBadges");

const pointMap = {
  lesson_completed: 15,
  quiz_completed: 20,
  perfect_quiz: 10,
  fill_correct: 1,
  chatbot_feedback_used: 5
};

async function addUserPoint(userId, action) {
  const points = pointMap[action];
  if (!points) return; // Tanımsız action

  const latest = await db.UserPoint.findOne({
    where: { userId },
    order: [["createdAt", "DESC"]]
  });

  const currentTotal = latest ? latest.totalPoints : 0;
  const newTotal = currentTotal + points;

  await db.UserPoint.create({
    userId,
    action,
    points,
    totalPoints: newTotal
  });

  const awarded = await checkAndAwardBadges(userId);
  return awarded;
}

module.exports = addUserPoint;