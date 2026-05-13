// Bu fonksiyon içine aldığı rollere (Örn: 'ADMIN', 'SELLER') izin verir
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // req.user bilgisini bir önceki authMiddleware'den aldık
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Erişim engellendi. Bu işlemi yapmak için yetkiniz yok. (Mevcut Rolünüz: ${req.user ? req.user.role : 'Bilinmiyor'})` 
            });
        }
        next();
    };
};

module.exports = { authorizeRoles };