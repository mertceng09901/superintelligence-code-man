const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { register, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware'); // Bu bekçi çok önemli!

router.post('/register', register);
router.post('/login', login);

// Profil rotası 'protect' middleware'i ile korunmalı
router.get('/profile', protect, getProfile);
router.post('/register', register);
router.post('/login', login);

module.exports = router;