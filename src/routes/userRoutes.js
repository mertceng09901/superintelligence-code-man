const express = require('express');
const router = express.Router();
const { getUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// Tüm kullanıcı işlemleri için giriş yapmış olmak (Token) zorunludur
router.get('/:userId', protect, getUser);
router.put('/:userId', protect, updateUser);
router.delete('/:userId', protect, deleteUser);

module.exports = router;