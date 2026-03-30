const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const db = require("../models");
const { getUserLearningSummary } = require("../utils/userSummary");
const { classifyIntentWithGPT } = require("../utils/classifyIntentWithGPT");
const addUserPoint = require("../utils/addUserPoint");

const userSessionState = {}; // geçici kullanıcı state takibi

const promptFlowMap = {
  vocabulary_practice: {
    askPrompt: `
Kelime pratiğine başlıyoruz.

Kullanıcıya sırayla Türkçe kelimeler sor ve İngilizcesini iste.
Sorular şu yapıda olsun: "Elmanın İngilizcesi nedir?"

İlk soruyla başla: "Armut'un İngilizcesi nedir?"
`.trim(),

    responsePrompt: `
Kullanıcının verdiği İngilizce kelimeyi değerlendir:

1. ✅ Eğer kelime doğruysa şöyle yaz:  
✅ Doğru! Armut → **pear**.

2. ❌ Eğer yanlışsa:
- ❌ Hatalı cevabı göster  
- ✅ Doğru kelimeyi yaz  
- 🔍 1 cümlelik açıklama yap

⚠️ Eğer kullanıcı farklı ama gerçek bir kelime yazdıysa, bu kelimenin anlamını da belirt (örneğin: pearl = inci).

⚠️ Yanlış anlamı doğru olarak onaylama!

Yeni kelime sor: örn: "Ev'in İngilizcesi nedir?"
`.trim().trim()
  },
  translation_check: {
    askPrompt: `
Kullanıcıyla etkileşimli çeviri çalışması yapıyoruz.

1. Kullanıcıya bir cümle ver (İngilizce veya Türkçe olabilir).
2. Ondan karşı dile çevirmesini iste.
3. Cümle çok uzun olmasın. Basit konular içeriyor olsun.

İlk cümleyle başla:
“Ben her sabah kahve içerim.”
Soru: “Bu cümleyi İngilizce’ye çevirir misin?”
`.trim(),

    responsePrompt: `
Kullanıcının verdiği çeviriyi değerlendir.  
Eğer kullanıcı cümleyi doğru çevirmişse sadece ✅ ile onay ver ve yeni bir cümle sor.  
Sakın kullanıcı cevabını tekrar yazma.

- ✅ Doğruysa kısa onay ver (en fazla 1 cümle).
- ❌ Yanlışsa hatayı belirt, ✅ ile doğru hâlini göster.
- 1 cümlelik sade açıklama ekle.

Ardından yeni bir çeviri sor:
Örn: “O her gün kitap okur.” – “Bu cümleyi İngilizce’ye çevirir misin?”
`.trim()
  },
  grammar_check: {
    askPrompt: `
Kullanıcıdan bir İngilizce cümle yazmasını iste.  
Amaç: cümlesini kontrol edeceksin.  

İlk mesaj şöyle olsun:  
"Lütfen bana bir İngilizce cümle yaz, ben de dil bilgisi açısından inceleyeyim."
`.trim(),

    responsePrompt: `
Kullanıcının verdiği İngilizce cümlede hata olup olmadığını kontrol et.

1. ✅ Eğer cümle doğruysa şöyle yaz:
✅ Cümle doğru. Harika iş çıkardın!

2. ❌ Eğer yanlışsa:
- ❌ Hatalı kısmı göster
- ✅ Doğru hâlini yaz
- 🔍 1 cümlelik kısa açıklama ekle

Paragraf yazma. Gerekiyorsa **kalın** ve semboller kullan.

Örnek:
❌ He go to school every day.  
✅ He **goes** to school every day.  
“go” üçüncü tekil özneyle **goes** olmalı.
`.trim()
  },
  coach: {
    askPrompt: `
Kullanıcıya yönlendirici sorular sorarak ne çalışması gerektiğini birlikte belirle.

İlk mesaj:
“Son tamamladığın dersi hatırlıyor musun? Ona göre sıradakini belirleyelim.”
`.trim(),

    responsePrompt: `
Kullanıcının verdiği yanıta göre:
- Tamamladığı ders/quiz varsa sıradakini öner
- Hiçbir şey hatırlamıyorsa sistem geçmişini kullan
- Sadece 1-2 cümlelik yönlendirme yap
- Gerekirse kullanıcıya tekrar soru sor (örn: “Ders mi istersin, quiz mi?”)
`.trim()
  },
  default: `Kullanıcıdan ne istediğini anlayamadıysan kısa ve sade bir şekilde şunu sor: "Hangi konuda yardımcı olmamı istersin?"`
};

exports.chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId;

    const user = await db.User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    const summary = await getUserLearningSummary(userId);

    const baseContext = `
Sen deneyimli bir İngilizce öğretmenisin ve bu sistemde kullanıcıya özel rehberlik sunan bir öğrenme koçusun.

Kullanıcının sistem içi tüm verilerine erişimin var:
- Seviyesi: ${summary.level}
- Öğrenme amacı: ${summary.goal}
- Tamamladığı dersler: ${summary.completedLessons.join(", ") || "Henüz tamamlanan ders yok"}
- Eksik dersler: ${summary.incompleteLessons.join(", ") || "Yok"}
- Tamamladığı quizler: ${summary.completedQuizzes.join(", ") || "Henüz çözülmemiş"}
- Eksik quizler: ${summary.incompleteQuizzes.join(", ") || "Yok"}
- En çok hata yapılan konular: ${Object.entries(summary.commonMistakes || {}).map(([k, v]) => `${k} (${v})`).join(", ") || "Yok"}
- Toplam puanı: ${summary.totalPoints}
- Quiz başarıları: ${summary.quizPerformance?.map(q => `${q.title} (%${q.percentage})`).join(", ") || "Henüz quiz çözülmemiş"}
- Kazandığı rozetler: ${summary.badges.join(", ") || "Yok"}

Genel kurallar:
- Cevapların kısa, net ve görev odaklı olmalı.
- Gerektiğinde ❌, ✅ ve **kalın** vurgularla hata/doğru göster.
- Açıklama gerekiyorsa yalnızca bir cümleyle yap.
- Sadece gerekli bilgiyi ver, sohbeti gereksiz yere uzatma.
`.trim();

    const interactiveIntents = [
      "vocabulary_practice",
      "translation_check",
      "grammar_check",
      "coach"
    ];

 let state = userSessionState[userId] || null;
let incomingIntent = await classifyIntentWithGPT(message);
let intent = incomingIntent;

// Eğer hali hazırda bir mod varsa ve yeni intent default veya coach ise → modda kal
if (
  state?.mode &&
  interactiveIntents.includes(state.mode) &&
  (incomingIntent === "default" || incomingIntent === "coach")
) {
  intent = state.mode;
}

// Eğer mod yoksa veya gerçekten farklı intent geldiyse → yeni moda geç
if (!state || state.mode !== intent) {
  userSessionState[userId] = { mode: intent, step: "response" };
}

// Prompt türünü seç
const taskPrompt =
  userSessionState[userId].step === "response"
    ? promptFlowMap[intent]?.responsePrompt || promptFlowMap.default
    : promptFlowMap[intent]?.askPrompt || promptFlowMap.default;


    const systemPrompt = `${baseContext}\n\nGörev:\n${taskPrompt}`;

    const chatHistory = await db.ChatHistory.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      limit: 10
    });

    const previousMessages = chatHistory.reverse().map(entry => ({
      role: entry.sender === "bot" ? "assistant" : "user",
      content: entry.message
    }));

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...previousMessages,
        { role: "user", content: message }
      ],
      temperature: 0.7
    });

    const botReply = completion.choices[0].message.content;

    await db.ChatHistory.create({ userId, message, sender: "user" });
    await db.ChatHistory.create({ userId, message: botReply, sender: "bot" });

    const totalUserMessages = await db.ChatHistory.count({
  where: { userId, sender: "user" }
});

let awardedBadges = [];

if (totalUserMessages === 1) {
  awardedBadges = await addUserPoint(userId, "chatbot_feedback_used");
} else if (totalUserMessages % 5 === 0) {
  awardedBadges = await addUserPoint(userId, "chatbot_feedback_used");
}

    res.json({ response: botReply, badges: awardedBadges });
    console.log("Intent:", intent, "| Mode:", state?.mode);
  } catch (error) {
    console.error("Chatbot hatası:", error);
    res.status(500).json({ error: "Chatbot cevabı alınamadı." });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.userId;

    const chatRows = await db.ChatHistory.findAll({
      where: { userId },
      order: [["createdAt", "ASC"]],
    });

    const pairedMessages = [];
    for (let i = 0; i < chatRows.length; i += 2) {
      const userMessage = chatRows[i]?.message || "";
      const botResponse = chatRows[i + 1]?.message || "";
      pairedMessages.push({ userMessage, botResponse });
    }

    res.json(pairedMessages);
  } catch (error) {
    console.error("Geçmiş sohbet hatası:", error);
    res.status(500).json({ message: "Sohbet geçmişi alınamadı." });
  }
};
