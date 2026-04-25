const mongoose = require('mongoose');

// Sepetin içindeki tekil ürünlerin yapısı (Alt Şema)
const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId, // Ürünün ID'sini tutarız
        ref: 'Product', // Hangi modelden geleceğini belirtiriz
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Ürün adedi en az 1 olmalıdır'],
        default: 1
    },
    selectedColor: {
        type: String,
        required: false // Örneğin: "Titanium"
    }
}, { _id: false }); // Her sepetteki ürün için gereksiz yere ekstra ID oluşturmasını engelleriz

// Ana Sepet Şeması
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // Sepet hangi kullanıcıya ait?
        ref: 'User',
        required: true,
        unique: true // Her kullanıcının sadece 1 tane aktif sepeti olabilir
    },
    items: [cartItemSchema], // Yukarıda tanımladığımız alt şemayı dizi olarak ekliyoruz
    totalAmount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);