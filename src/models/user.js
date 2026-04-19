const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Lütfen adınızı giriniz']
    },
    lastName: {
        type: String,
        required: [true, 'Lütfen soyadınızı giriniz']
    },
    email: {
        type: String,
        required: [true, 'Lütfen e-posta adresinizi giriniz'],
        unique: true, // Aynı e-posta ile iki kişi kaydolamaz
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Lütfen bir şifre belirleyiniz'],
        minlength: [6, 'Şifreniz en az 6 karakter olmalıdır']
    },
    phone: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ['USER', 'SELLER', 'ADMIN'], // Sadece bu 3 rolden biri olabilir
        default: 'USER' // Varsayılan olarak herkes normal kullanıcı (USER) olarak kaydolur
    }
}, { timestamps: true }); // timestamps: Kullanıcının ne zaman kayıt olduğunu (createdAt) otomatik tutar

module.exports = mongoose.model('User', userSchema);