const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const profileRoutes = require("./routes/profile");
const lessonRoutes = require("./routes/lessons");
const userLessonRoutes = require("./routes/userLessons");
const lessonPageRoutes = require("./routes/lessonPages");
const quizRoutes = require("./routes/quiz");
const badgeRoutes = require("./routes/badge");
const userStatsRoutes = require("./routes/userStats");
const userQuizzesRoutes = require("./routes/userQuizzes");
const leaderboardRoutes = require("./routes/leaderboard");
const adminRoutes = require("./routes/admin");
// Ortam değişkenlerini yükle (.env dosyasından)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
 
// Middleware’ler
app.use(cors());
app.use(express.json());

const sequelize = require('./config/database');
const User = require('./models/User');

// Basit bir test endpoint’i
app.get('/', (req, res) => {
  res.send('Dil öğrenme uygulaması sunucusu çalışıyor!');
});

// Kullanıcı yolları
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/chatbot", require("./routes/chatbot"));
app.use("/api/lessons", lessonRoutes);
app.use("/api/user-lessons", userLessonRoutes);
app.use("/api/lesson-pages", lessonPageRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/user-badges", badgeRoutes);
app.use("/api/user-stats", userStatsRoutes);
app.use("/api/user-quizzes", userQuizzesRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/admin", adminRoutes);
// Veritabanı bağlantısı test ediliyor
sequelize.authenticate()
  .then(() => console.log('MySQL bağlantısı başarılı!'))
  .catch(err => console.error('MySQL bağlantı hatası:', err));

  // Veritabanı senkronizasyonu
sequelize.sync({}) // alter: true, mevcut tabloları günceller
  .then(() => console.log('Veritabanı senkronize edildi.'))
  .catch(err => console.error('Veritabanı hatası:', err));

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
