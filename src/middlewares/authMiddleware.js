const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
    let token;

    // 1. İstek başlığında (headers) yetkilendirme (authorization) ve 'Bearer' kelimesi var mı?
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Token'ı 'Bearer <token>' formatından ayırarak sadece şifreli kısmı al
            token = req.headers.authorization.split(' ')[1];
// ... (üst kısımlar aynı)
            // 3. Şifreyi çöz
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. DÜZELTME: Hem 'id' hem '_id' ihtimalini kontrol et
            // decoded.id veya decoded._id hangisini kullandıysan onu alır
            const userId = decoded.id || decoded._id;

            req.user = await User.findById(userId).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Bu tokena ait kullanıcı artık mevcut değil.' });
            }

            next();
// ... (alt kısımlar aynı)
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