const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
const adminKontrol = require('../middlewares/auth'); // Senin yeni yazdığın bekçi

// Ürün Ekleme (Sadece Admin)
router.post('/add', protect, adminKontrol, (req, res) => {
    // Eğer buraya ulaştıysa hem login olmuştur hem de ADMIN'dir
    // Ürün ekleme kodların...
});

// Ürün Silme (Sadece Admin)
router.delete('/delete/:id', protect, adminKontrol, (req, res) => {
    // Ürün silme kodların...
});
// Herkese açık rotalar (Giriş yapmadan görülebilir)
router.get('/', getProducts);
router.get('/:productId', getProductById);

// Sadece ADMIN ve SELLER rollerinin erişebileceği korumalı rotalar
router.post('/', protect, authorizeRoles('ADMIN', 'SELLER'), createProduct);
router.put('/:productId', protect, authorizeRoles('ADMIN', 'SELLER'), updateProduct);
router.delete('/:productId', protect, authorizeRoles('ADMIN', 'SELLER'), deleteProduct);
// SEPETE ÜRÜN EKLEME (Geçici olarak console'a yazar veya veritabanına ekler)
router.post('/cart', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        console.log("Sepete eklenen ürün ID:", productId);
        
        // Şimdilik sadece başarılı mesajı dönüyoruz
        res.status(200).json({ message: "Ürün sepete başarıyla eklendi!" });
    } catch (error) {
        res.status(500).json({ message: "Sepete eklenirken hata oluştu.", error: error.message });
    }
});

module.exports = router;