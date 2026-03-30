const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function classifyIntentWithGPT(userMessage) {
  const classificationPrompt = `
Aşağıdaki mesajın niyetini analiz et.  
Sadece aşağıdaki etiketlerden birini döndür (etiket dışında başka hiçbir şey yazma):

Etiketler:
- grammar_check (Kullanıcı bir İngilizce cümleyi dilbilgisel olarak doğru mu diye soruyorsa, gramer örneği istiyorsa veya gramer alıştırması istiyorsa)
- translation_check (Çeviri istemi varsa veya cümlelerin çevirisi kontrol ediliyorsa)
- vocabulary_practice (Kelime öğrenme, yeni kelimeler sorma, kelime testi yapılmak isteniyorsa)
- coach (Kullanıcı yönlendirme, öneri, ne çalışmalı gibi şeyler soruyorsa)
- default (Diğer durumlar)

Mesaj: "${userMessage}"  
Etiket:
  `.trim();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: classificationPrompt }],
      temperature: 0,
    });

    const raw = response.choices?.[0]?.message?.content?.trim().toLowerCase() || "";
    const tag = raw.split(/\s+/)[0]; // ilk kelimeyi al (fazla açıklama gelirse kes)

    const validTags = [
      "grammar_check",
      "translation_check",
      "vocabulary_practice",
      "coach",
      "default"
    ];

    return validTags.includes(tag) ? tag : "default";
  } catch (error) {
    console.error("Intent sınıflandırma hatası:", error);
    return "default";
  }
}

module.exports = { classifyIntentWithGPT };