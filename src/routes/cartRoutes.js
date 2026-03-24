const express = require('express');
const router = express.Router();
const { getCart, addToCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware'); // Sepet için giriş zorunlu

// Sadece giriş yapmış kullanıcılar (protect) sepete erişebilir
router.get('/', protect, getCart);
router.post('/add', protect, addToCart);

module.exports = router;