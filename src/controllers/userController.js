const User = require('../models/user');

// 1. GEREKSİNİM: Giriş yapan kullanıcının kendi profilini getirme
exports.getProfile = async (req, res) => {
    try {
        // req.user, protect middleware'inden (authMiddleware.js) geliyor
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Profil getirilirken hata oluştu', error: error.message });
    }
};

// 2. GEREKSİNİM: Kullanıcının kendi profilini güncellemesi
exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { firstName, lastName, phone }, // E-postayı genelde değiştirtmeyiz
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Profil güncellenemedi', error: error.message });
    }
};

// --- Aşağıdakiler Yönetici (Admin) veya ID ile yapılan işlemler ---

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId, 
            req.body, 
            { new: true, runValidators: true }
        ).select('-password');
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(204).json({ message: 'Kullanıcı başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};