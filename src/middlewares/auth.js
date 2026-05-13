const adminKontrol = (req, res, next) => {
    // Veritabanında "ADMIN" yazdığı için burada da büyük harf kontrolü yapmalısın
    if (req.user && req.user.role === 'ADMIN') {
        next(); 
    } else {
        res.status(403).json({ message: "Erişim reddedildi! Bu işlem için ADMIN yetkisi gerekiyor." });
    }
};

module.exports = adminKontrol;