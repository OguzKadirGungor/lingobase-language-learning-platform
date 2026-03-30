const db = require("../models");

async function checkAndAwardBadges(userId) {
  const now = new Date();
  const newBadges = [];

  const userPoints = await db.UserPoint.findAll({ where: { userId } });
  const existingBadges = await db.UserBadge.findAll({ where: { userId } });

  const actionCount = action =>
    userPoints.filter(p => p.action === action).length;

  const badgeConditions = [
    {
      code: "lesson_master",
      condition: () => actionCount("lesson_completed") >= 3
    },
    {
      code: "first_lesson_done",
      condition: async () => {
        const count = await db.UserLesson.count({
          where: { userId, isCompleted: true }
        });
        return count >= 1;
      }
    },
    {
      code: "quiz_master",
      condition: () => actionCount("quiz_completed") >= 3
    },
    {
      code: "perfect_3",
      condition: () => actionCount("perfect_quiz") >= 1
    },
    {
      code: "first_quiz_done",
      condition: () => actionCount("quiz_completed") >= 1
    },
    {
      code: "chatbot_first_use",
      condition: async () => {
        const count = await db.ChatHistory.count({ where: { userId } });
        return count >= 1;
      }
    },
    {
      code: "chatbot_talker",
      condition: async () => {
        const count = await db.ChatHistory.count({
          where: { userId, sender: "user" }
        });
        return count >= 5;
      }
    }
  ];

  for (const badgeRule of badgeConditions) {
    const badge = await db.Badge.findOne({ where: { code: badgeRule.code } });
    if (!badge) continue;

    const already = existingBadges.find(b => b.badgeId === badge.id);
    const qualifies = await badgeRule.condition();

    if (!already && qualifies) {
      await db.UserBadge.create({
        userId,
        badgeId: badge.id,
        awardedAt: now
      });
      newBadges.push({
        title: badge.title,
        description: badge.description,
        icon: badge.icon || "🏅"
      });
    }
  }

  return newBadges;
}

module.exports = checkAndAwardBadges;
