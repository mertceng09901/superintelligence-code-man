const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// DÜZELTME: Sabit rotalar (/profile) dinamik rotalardan (/:userId) ÖNCE tanımlanmalı.
// Aksi halde Express, PUT /profile isteğini görünce /:userId rotasıyla eşleştirir
// ve "profile" string'ini MongoDB ID olarak kullanmaya çalışır → hata verir.

// Önce sabit rotalar
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Sonra dinamik rotalar
router.get('/:userId',    protect, getUser);
router.put('/:userId',    protect, updateUser);
router.delete('/:userId', protect, deleteUser);

module.exports = router;
