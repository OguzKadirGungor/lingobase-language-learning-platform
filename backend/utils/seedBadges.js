const db = require("../models");

async function seedBadges() {
  const badges = [
    {
      code: "lesson_master",
      title: "Ders Ustası",
      description: "3 ders tamamladın 🎓",
      icon: "📘"
    },
    {
      code: "quiz_master",
      title: "Quiz Ustası",
      description: "3 quiz tamamladın 🧠",
      icon: "📊"
    },
    {
      code: "perfect_quiz",
      title: "Mükemmeliyetçi",
      description: "1 quizde %100 başarı sağladın 💯",
      icon: "🏆"
    },
    {
      code: "first_quiz_done",
      title: "İlk Quiz Rozeti",
      description: "İlk quizini tamamladın 🎉",
      icon: "🎯"
    },
    {
      code: "chatbot_first_use",
      title: "Sohbet Başlangıcı",
      description: "İlk kez chatbot ile mesajlaştın 💬",
      icon: "💬"
    },
    {
      code: "chatbot_talker",
      title: "Sohbet Ustası",
      description: "5 kez chatbot ile mesajlaştın 🗣️",
      icon: "🗣️"
    },
    {
      code: "first_lesson_done",
      title: "İlk Ders Rozeti",
      description: "İlk dersini başarıyla tamamladın 📖",
      icon: "📖"
    }
  ];

  for (const badge of badges) {
    const exists = await db.Badge.findOne({ where: { code: badge.code } });
    if (!exists) {
      await db.Badge.create(badge);
      console.log(`✅ Eklendi: ${badge.title}`);
    } else {
      console.log(`⏩ Zaten var: ${badge.title}`);
    }
  }

  process.exit();
}

seedBadges();