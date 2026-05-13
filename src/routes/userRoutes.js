const express = require('express');
const router = express.Router();
// Controller'dan gerekli fonksiyonları alıyoruz
const { getProfile, updateProfile, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// 10. GEREKSİNİM: Kullanıcı Profilini Görüntüleme (DİNAMİK YOL)
// 'protect' sayesinde req.user doluyor, 'getProfile' ise veritabanından o kişiyi getiriyor
router.get('/profile', protect, getProfile);

// 11. GEREKSİNİM: Kullanıcı Profilini Güncelleme (DİNAMİK YOL)
router.put('/profile', protect, updateProfile);

// Diğer kullanıcı işlemleri (ID bazlı)
router.get('/:userId', protect, getUser);
router.put('/:userId', protect, updateUser);
router.delete('/:userId', protect, deleteUser);

module.exports = router;