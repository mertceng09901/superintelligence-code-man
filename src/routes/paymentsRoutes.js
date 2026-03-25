const express = require('express');
const router = express.Router();

// 9. Ödeme Ekranı (Mock/Taklit başarılı cevap)
router.post('/create-intent', (req, res) => {
    res.status(200).json({
        message: "Ödeme altyapısı başarıyla başlatıldı.",
        clientSecret: "pi_123456789_secret_0987654321",
        shippingAddress: req.body.shippingAddress
    });
});

module.exports = router;