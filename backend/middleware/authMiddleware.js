const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Header örneği: "Bearer TOKEN"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token bulunamadı' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token geçersiz' });

    // Doğrulanan kullanıcıyı request nesnesine ekliyoruz
    req.user = decoded;
    req.userId = decoded.id;
    next();
  });
};

module.exports = authenticateToken;