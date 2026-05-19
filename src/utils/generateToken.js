const jwt = require('jsonwebtoken');

// Kullanıcının ID ve rolünü token'a ekler
const generateToken = (id, role) => {
    return jwt.sign(
        { id, role: role || 'USER' },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

module.exports = generateToken;
