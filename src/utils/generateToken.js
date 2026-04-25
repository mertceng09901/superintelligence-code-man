const jwt = require('jsonwebtoken');

// Kullanıcının benzersiz ID'sini alıp şifreli bir Token üretir
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token 30 gün boyunca geçerli olacak
    });
};

module.exports = generateToken;