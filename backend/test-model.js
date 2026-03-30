const { Sequelize, DataTypes } = require('sequelize');

// Bu kısmı senin config/database.js içeriğine göre ayarla
const sequelize = new Sequelize('dil_egitim_uygulamasi', 'root', '10711453', {
  host: 'localhost',
  dialect: 'mysql'
});

const Lesson = require('./models/Lesson')(sequelize, DataTypes);

async function test() {
  try {
    await sequelize.authenticate();
    console.log('✅ Bağlantı başarılı.');

    console.log("typeof Lesson:", typeof Lesson); // function
    console.log("tableName:", Lesson.tableName); // Lesson veya Lessons

    const all = await Lesson.findAll();
    console.log("📦 Toplam ders sayısı:", all.length);
  } catch (err) {
    console.error("❌ HATA:", err.message);
  } finally {
    await sequelize.close();
  }
}

test();