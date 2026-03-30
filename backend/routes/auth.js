// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('../models');
const e = require('express');
const authenticateToken = require('../middleware/authMiddleware');
require('dotenv').config();

// Kullanıcı Kaydı
router.post('/register', async (req, res) => {
  const { name, email, password, level, goal } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: 'Bu e-posta zaten kayıtlı.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,        
      email,
      password: hashedPassword,
      level: level,
      goal: goal || null // Eğer goal belirtilmemişse null olarak ayarlanır.
    });

    res.status(201).json({
      message: 'Kayıt başarılı!',
      user: { id: newUser.id, email: newUser.email, name: newUser.name, level: newUser.level, goal: newUser.goal }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// Kullanıcı Girişi
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ message: 'Kullanıcı bulunamadı.' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: 'Şifre hatalı.' });

    // isAdmin bilgisi token'a eklendi:
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Giriş başarılı!', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası.', error });
  }
});

// Kullanıcı profilini güncelle
router.put('/profile', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Token'dan alınan kullanıcı ID
    const { name, level, goal } = req.body;
  
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
      }
  
      user.name = name ?? user.name;
      user.level = level ?? user.level;
      user.goal = goal ?? user.goal;
  
      await user.save();
      res.status(200).json({ message: 'Profil güncellendi.', user });
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      res.status(500).json({ message: 'Sunucu hatası.' });
    }
  });

// PUT: Kullanıcı e-posta veya şifre güncelleme
router.put('/update-profile', authenticateToken, async (req, res) => {
  const userId = req.userId;
  const { email, currentPassword, newPassword } = req.body;

  try {
    const user = await db.User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });

    // E-posta güncelle
    if (email) {
      const emailExists = await db.User.findOne({ where: { email, id: { [db.Sequelize.Op.ne]: userId } } });
      if (emailExists) {
        return res.status(400).json({ error: 'Bu e-posta başka bir kullanıcı tarafından kullanılıyor.' });
      }
      user.email = email;
    }

    // Şifre güncelle
    if (currentPassword && newPassword) {
      const isMatch = await user.validPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ error: 'Mevcut şifre hatalı.' });
      }
      user.password = newPassword; // hash işlemi modelde yapılmış olmalı
    }

    await user.save();
    res.json({ message: 'Profil güncellendi.' });
  } catch (err) {
    console.error('Profil güncelleme hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});


// Korumalı route örneği
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Hoş geldin ${req.user.email}, bu korumalı bir alandır.` });
});

module.exports = router;