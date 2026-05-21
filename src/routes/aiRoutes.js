const express = require('express');
const router = express.Router();
const { sellerChat } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/seller-chat', protect, sellerChat);

module.exports = router;
