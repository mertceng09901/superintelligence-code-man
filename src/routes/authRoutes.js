const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Kullanıcı kayıt olma yolu (http://localhost:5000/api/auth/register)
router.post('/register', register);

// Kullanıcı giriş yapma yolu (http://localhost:5000/api/auth/login)
router.post('/login', login);

module.exports = router;