const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: { type: Number, required: true },
    selectedColor: { type: String, required: true },
    priceAtPurchase: { 
        type: Number, 
        required: true // Ürünün sipariş verildiği andaki fiyatını buraya donduruyoruz
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: { // "ORD-20260307-8912" gibi kullanıcıya gösterilecek takip numarası
        type: String,
        required: true,
        unique: true
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: String, // İleride ayrı bir Address modeli yapılabilir, şimdilik metin tutalım
        required: true
    },
    paymentMethod: {
        type: String,
        default: 'CREDIT_CARD'
    },
    status: {
        type: String,
        enum: ['PENDING', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED'],
        default: 'PENDING' // Beklemede
    },
    deliveryStatus: {
        type: String,
        enum: ['PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'PREPARING' // Hazırlanıyor
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);