// middleware/isAdmin.js
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // Admin ise devam et
    } else {
        res.status(403).json({ message: "Bu işlem için admin yetkisi gerekiyor!" });
    }
};