const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// Herkese açık
router.get('/', getProducts);
router.get('/:productId', getProductById);

// Sadece ADMIN
router.post('/', protect, authorizeRoles('ADMIN'), createProduct);
router.put('/:productId', protect, authorizeRoles('ADMIN'), updateProduct);
router.delete('/:productId', protect, authorizeRoles('ADMIN'), deleteProduct);

module.exports = router;