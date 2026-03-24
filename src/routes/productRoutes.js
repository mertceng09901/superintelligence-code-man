const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// Herkese açık rotalar (Giriş yapmadan görülebilir)
router.get('/', getProducts);
router.get('/:productId', getProductById);

// Sadece ADMIN ve SELLER rollerinin erişebileceği korumalı rotalar
router.post('/', protect, authorizeRoles('ADMIN', 'SELLER'), createProduct);
router.put('/:productId', protect, authorizeRoles('ADMIN', 'SELLER'), updateProduct);
router.delete('/:productId', protect, authorizeRoles('ADMIN', 'SELLER'), deleteProduct);

module.exports = router;