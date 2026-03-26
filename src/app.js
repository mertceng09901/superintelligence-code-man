const express = require('express');
const cors = require('cors');

// Rotaları (Routes) İçeri Aktarıyoruz
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const sellerRoutes = require('./routes/sellerRoutes');

const app = express();

// --- Middleware Ayarları ---
// CORS: Frontend'in backend ile konuşabilmesini sağlar
app.use(cors()); 

// JSON Body Parser: Frontend'den gelen (kayıt, giriş, ürün ekleme) JSON verilerini okur
app.use(express.json()); 

// --- API Yollarını (Routes) Tanımlıyoruz ---
// Dikkat: Hepsinin başında /api var, Frontend'den istek atarken buna dikkat etmelisin!
app.use('/api/auth', authRoutes);      // Kayıt ve Giriş işlemleri
app.use('/api/users', userRoutes);     // Kullanıcı profil işlemleri
app.use('/api/products', productRoutes); // Ürün listeleme ve detay
app.use('/api/cart', cartRoutes);      // Sepet işlemleri
app.use('/api/orders', orderRoutes);    // Sipariş işlemleri
app.use('/api/payments', paymentRoutes); // Ödeme işlemleri
app.use('/api/seller', sellerRoutes);   // Satıcı paneli (Ekle, Sil, Güncelle)

// --- Ana Sayfa Test Uç Noktası ---
app.get('/', (req, res) => {
    res.send('🚀 Superintelligence API Yayında ve Sorunsuz Çalışıyor!');
});

// --- Hata Yakalama (Opsiyonel ama Tavsiye Edilir) ---
// Tanımlanmamış bir adrese istek gelirse 404 döndürür
app.use((req, res) => {
    res.status(404).json({ message: "Aradığınız API yolu bulunamadı!" });
});

// app nesnesini server.js'de (veya bin/www) kullanılmak üzere dışa aktarıyoruz
module.exports = app;