const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: [true, 'Lütfen ürün markasını giriniz (Örn: Apple, Samsung)']
    },
    model: {
        type: String,
        required: [true, 'Lütfen ürün modelini giriniz (Örn: iPhone 15 Pro)']
    },
    price: {
        type: Number,
        required: [true, 'Lütfen ürün fiyatını giriniz'],
        min: [0, 'Fiyat 0 dan küçük olamaz']
    },
    stock: {
        type: Number,
        required: [true, 'Lütfen stok miktarını giriniz'],
        default: 0
    },
    specs: {
        ram: { type: String, required: true },
        storage: { type: String, required: true }
    },
    imageUrl: { type: String, required: false },
    // Birden fazla resim için URL dizisi (kaydırmalı galeri)
    images: [
        { type: String }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);