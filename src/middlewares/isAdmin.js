// middleware/isAdmin.js
// ✅ Düzeltilmiş
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Bu işlem için admin yetkisi gerekiyor!" });
    }
};

module.exports = isAdmin; 