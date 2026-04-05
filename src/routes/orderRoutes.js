const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getCheckoutSummary } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

// DÜZELTME: checkout-summary rotası eklendi (önce sabit rota, sonra dinamik)
router.get('/checkout-summary', protect, getCheckoutSummary);
router.get('/', protect, getUserOrders);
router.post('/', protect, createOrder);

module.exports = router;
