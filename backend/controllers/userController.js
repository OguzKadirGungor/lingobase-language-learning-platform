// Kayıt işlemi
const registerUser = (req, res) => {
    // Şimdilik sadece gelen veriyi yazdıralım
    console.log(req.body);
    res.json({ message: 'Kullanıcı kaydı başarıyla alındı!' });
  };
  
  // Giriş işlemi
  const loginUser = (req, res) => {
    res.json({ message: 'Kullanıcı giriş isteği alındı!' });
  };
  
  module.exports = {
    registerUser,
    loginUser,
  };