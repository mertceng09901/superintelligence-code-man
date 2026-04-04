const jwt = require('jsonwebtoken');
const User = require('../models/user');

// DÜZELTME: Eski kodda try bloğu içinde next() İKİ KEZ çağrılıyordu.
// Bu "Cannot set headers after they are sent" hatasına yol açıyordu.
// Düzeltilmiş versiyonda next() sadece bir kez, en sonda çağrılıyor.

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Token'ı "Bearer <token>" formatından ayır
            token = req.headers.authorization.split(' ')[1];

            // JWT şifresini çöz
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // decoded.id veya decoded._id her ikisini de kontrol et
            const userId = decoded.id || decoded._id;

            // Kullanıcıyı veritabanından bul (şifre hariç)
            req.user = await User.findById(userId).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Bu tokena ait kullanıcı artık mevcut değil.' });
            }

            // Bir sonraki middleware veya controller'a geç
            next();

        } catch (error) {
            console.error('Token doğrulama hatası:', error);
            return res.status(401).json({ message: 'Yetkisiz erişim, token geçersiz veya süresi dolmuş.' });
        }
    } else {
        return res.status(401).json({ message: 'Yetkisiz erişim, token bulunamadı.' });
    }
};

module.exports = { protect };
