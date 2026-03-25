const express = require('express');
const router = express.Router();
const { getCart, addToCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware'); // Sepet için giriş zorunlu

// Sadece giriş yapmış kullanıcılar (protect) sepete erişebilir
router.get('/', protect, getCart);
router.post('/add', protect, addToCart);

// 6. Sepetten Ürün Kaldırma (Hocanın istediği yeni yol)
router.delete('/remove/:productId', protect, (req, res) => {
    res.status(200).json({ 
        message: "Ürün sepetten başarıyla kaldırıldı.",
        removedProductId: req.params.productId
    });
});

module.exports = router;