const express = require('express');
const router = express.Router();

// DÜZELTME: Eski kodda register ve login İKİ KEZ import edilmişti → backend crash ediyordu
const { register, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

module.exports = router;
