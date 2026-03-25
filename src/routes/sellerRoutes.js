const express = require('express');
const router = express.Router();
// Model dosyanın adının Product.js veya productModel.js olduğuna göre require kısmını ayarla
const Product = require('../models/Product'); // Eğer dosya adın farklıysa burayı düzelt

// 12. GEREKSİNİM: Satıcı Ürünlerini Getir (Gerçek Veritabanından)
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find(); // MongoDB'den tüm ürünleri bul
        res.status(200).json({ message: "Satıcı paneli ürünleri getirildi.", products });
    } catch (error) {
        res.status(500).json({ message: "Ürünler getirilirken hata oluştu." });
    }
});

// 14. GEREKSİNİM: Yeni Ürün Ekle (Gerçek Veritabanına Kayıt)
// 14. GEREKSİNİM: Yeni Ürün Ekle (Gerçek Veritabanına Kayıt)
router.post('/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save(); 
        res.status(201).json({ message: "Ürün başarıyla eklendi.", product: newProduct });
    } catch (error) {
        // HATANIN GERÇEK SEBEBİNİ FRONTEND'E GÖNDERİYORUZ
        res.status(500).json({ message: "Ürün eklenemedi.", detay: error.message });
    }
});

// 15. GEREKSİNİM: Ürün Silme (Gerçek Veritabanından Sil)
router.delete('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Ürün başarıyla silindi." });
    } catch (error) {
        res.status(500).json({ message: "Ürün silinemedi." });
    }
});

// 13. GEREKSİNİM: Ürün Detay
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Ürün detayı getirilemedi." });
    }
});
// TEK BİR ÜRÜNÜ GETİR (Güncelleme ve Detay için lazım)
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(404).json({ message: "Ürün bulunamadı" });
    }
});

// ÜRÜN GÜNCELLE
router.put('/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Güncelleme başarısız", error });
    }
});
module.exports = router;