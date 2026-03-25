const express = require('express');
const router = express.Router();

// Satıcı ürünlerini getir, ekle, sil (Basit taklit cevaplar)
router.get('/products', (req, res) => {
    res.status(200).json({ message: "Satıcı paneli ürünleri başarıyla getirildi.", products: [] });
});

router.get('/products/:id', (req, res) => {
    res.status(200).json({ message: "Satıcı ürün detayı getirildi.", productId: req.params.id });
});

router.post('/products', (req, res) => {
    res.status(201).json({ message: "Ürün satıcı paneline başarıyla eklendi." });
});

router.delete('/products/:id', (req, res) => {
    res.status(200).json({ message: "Ürün satıcı panelinden başarıyla silindi." });
});

module.exports = router;