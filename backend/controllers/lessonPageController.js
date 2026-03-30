const db = require("../models");

exports.getAllPages = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const pages = await db.LessonPage.findAll({
      where: { lessonId },
      order: [["pageNumber", "ASC"]],
    });
    res.json(pages);
  } catch (error) {
    console.error("Sayfalar alınamadı:", error);
    res.status(500).json({ error: "Sayfalar alınamadı" });
  }
};

exports.getPageByNumber = async (req, res) => {
  try {
    const { lessonId, pageNumber } = req.params;
    const page = await db.LessonPage.findOne({
      where: { lessonId, pageNumber },
    });
    if (!page) {
      return res.status(404).json({ error: "Sayfa bulunamadı" });
    }
    res.json(page);
  } catch (error) {
    console.error("Sayfa alınamadı:", error);
    res.status(500).json({ error: "Sayfa alınamadı" });
  }
};

