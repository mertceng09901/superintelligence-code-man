const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');

// -----------------------------------------
// @işlem   Yeni Kullanıcı Kaydı (Register)
// @istek   POST /api/auth/register
// -----------------------------------------
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanımda.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                phone: user.phone || '',
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// -----------------------------------------
// @işlem   Kullanıcı Profil Bilgilerini Getir
// @istek   GET /api/auth/profile
// -----------------------------------------
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                phone: user.phone
            });
        } else {
            res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
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

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                phone: user.phone || '',
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// -----------------------------------------
// @işlem   Şifremi Unuttum
// @istek   POST /api/auth/forgot-password
// -----------------------------------------
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'E-posta adresi zorunludur.' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return res.status(404).json({ message: 'Bu e-posta adresiyle kayıtlı bir hesap bulunamadı.' });
        }

        // Geçici şifre oluştur
        const tempPassword = Math.random().toString(36).slice(-8) + Math.floor(Math.random() * 100);

        // Şifreyi hashle ve kaydet
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(tempPassword, salt);
        await User.updateOne({ _id: user._id }, { password: hashedPassword });

        // Demo ortamında geçici şifreyi response'da döndür
        res.json({
            message: 'Geçici şifreniz oluşturuldu.',
            tempPassword
        });

    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};
