const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Model yolunun doğru olduğundan emin ol

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Gelen verileri kontrol et (Terminalde gör)
        console.log("Kayıt isteği geldi:", name, email);

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Lütfen tüm alanları doldurun." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Bu e-posta zaten kullanımda." });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: "Kayıt başarılı!" });
    } catch (error) {
        console.error("Kayıt Hatası Detayı:", error); // Bu satır Render loglarında hatayı görmeni sağlar
        res.status(500).json({ message: "Sunucu hatası oluştu.", error: error.message });
    }
});

module.exports = router;