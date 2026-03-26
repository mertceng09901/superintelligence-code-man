const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. KENDİ YAZDIĞIMIZ TOKEN OLUŞTURUCUYU İÇERİ AKTARIYORUZ
const generateToken = require('../utils/generateToken'); 




// -----------------------------------------
// @işlem   Yeni Kullanıcı Kaydı (Register)
// @istek   POST /api/auth/register
// -----------------------------------------
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;

        // 1. Bu e-posta ile daha önce kayıt olunmuş mu kontrol et
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanımda.' });
        }

        // 2. Şifreyi Kriptola (Hash)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Yeni kullanıcıyı veritabanına oluştur
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword, // Şifrenin kriptolu halini kaydediyoruz!
            phone
        });

        // 4. Kayıt başarılıysa kullanıcı bilgilerini ve Token'ı geri döndür
        if (user) {
            res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// -----------------------------------------
// @işlem   Kullanıcı Girişi (Login)
// @istek   POST /api/auth/login
// -----------------------------------------
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Veritabanında bu e-postaya sahip kullanıcıyı bul
        const user = await User.findOne({ email });

        // 2. Kullanıcı varsa VE girdiği şifre veritabanındaki kriptolu şifreyle eşleşiyorsa
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            // Şifre veya e-posta yanlışsa güvenlik gereği hangisinin yanlış olduğunu tam söylemeyiz
            res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};
