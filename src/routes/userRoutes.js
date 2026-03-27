const express = require('express');
const router = express.Router();
const { getUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
// 10. Kullanıcı Profilini Görüntüleme (Hocanın istediği yol)
router.get('/profile', (req, res) => {
    res.status(200).json({
        id: "12345",
        name: "Mert Acar",
        email: "mert@superintelligence.com",
        role: "ADMIN"
    });
});

// 11. Kullanıcı Profilini Güncelleme
router.put('/profile', (req, res) => {
    res.status(200).json({ 
        message: "Kullanıcı profili başarıyla güncellendi.",
        updatedData: req.body
    });
});

// Tüm kullanıcı işlemleri için giriş yapmış olmak (Token) zorunludur
router.get('/:userId', protect, getUser);
router.put('/:userId', protect, updateUser);
router.delete('/:userId', protect, deleteUser);
// backend/routes/userRoutes.js
router.get('/profile', protect, getProfile);
module.exports = router;