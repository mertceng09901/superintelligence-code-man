const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// DÜZELTME: Eski sellerRoutes.js'de hiç token/rol kontrolü yoktu.
// Herkes (giriş yapmamış bile) ürün ekleyip silebiliyordu.
// Şimdi tüm yazma işlemleri protect + ADMIN/SELLER rolü gerektiriyor.

// Ürünleri Getir — herkese açık
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Ürünler getirilemedi.' });
    }
});

// Tekil Ürün Detay — herkese açık
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Ürün detayı getirilemedi.' });
    }
});

// Yeni Ürün Ekle — sadece ADMIN veya SELLER
router.post('/products', protect, authorizeRoles('ADMIN', 'SELLER'), async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ message: 'Ürün başarıyla eklendi.', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Ürün eklenemedi.', detay: error.message });
    }
});

// Ürün Güncelle — sadece ADMIN veya SELLER
router.put('/products/:id', protect, authorizeRoles('ADMIN', 'SELLER'), async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Güncelleme başarısız', error: error.message });
    }
});

// Ürün Sil — sadece ADMIN veya SELLER
router.delete('/products/:id', protect, authorizeRoles('ADMIN', 'SELLER'), async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Ürün başarıyla silindi.' });
    } catch (error) {
        res.status(500).json({ message: 'Ürün silinemedi.' });
    }
});

module.exports = router;
