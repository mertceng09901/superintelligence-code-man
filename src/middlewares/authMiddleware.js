const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // 1. İstek başlığında (headers) yetkilendirme (authorization) ve 'Bearer' kelimesi var mı?
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Token'ı 'Bearer <token>' formatından ayırarak sadece şifreli kısmı al
            token = req.headers.authorization.split(' ')[1];

            // 3. Token'ın şifresini çöz ve içindeki kullanıcı ID'sini al
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Veritabanından bu ID'ye sahip kullanıcıyı bul (şifresini hariç tut) 
            // ve req.user içine kaydet ki diğer controller'lar bu bilgiye ulaşabilsin
            req.user = await User.findById(decoded.id).select('-password');

            // 5. Her şey yolundaysa bir sonraki işleme (controller'a) geç
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Yetkisiz erişim, token geçersiz veya süresi dolmuş.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Yetkisiz erişim, token bulunamadı.' });
    }
};

module.exports = { protect };