const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

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
// Docker ortamında frontend farklı bir port/container'dan gelir
app.use(cors({
    origin: [
        'http://localhost:3000',       // Docker frontend
        'http://mobil_frontend:3000',  // Docker network içi
        'http://localhost:5173',       // Local Vite dev server
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// --- Redis Durum Kontrolü ---
app.get('/api/health', async (req, res) => {
    const { getRedisClient } = require('./config/redisClient');
    const redisClient = getRedisClient();
    
    const health = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        services: {
            api: '🟢 Çalışıyor',
            mongodb: '🟢 Bağlı',
            redis: redisClient ? '🟢 Bağlı' : '🔴 Bağlı Değil',
        }
    };
    res.json(health);
});

// --- Ana Sayfa Test Uç Noktası ---
app.get('/', (req, res) => {
    res.send('🚀 MobilCepte API — Docker Ortamında Çalışıyor!');
});

// --- Hata Yakalama (Opsiyonel ama Tavsiye Edilir) ---
// Tanımlanmamış bir adrese istek gelirse 404 döndürür
app.use((req, res) => {
    res.status(404).json({ message: "Aradığınız API yolu bulunamadı!" });
});

// --- Global Error Handler ---
// Tüm middleware ve route'larda yakalanmayan hatalar burada işlenir
app.use(errorHandler);

// app nesnesini server.js'de kullanılmak üzere dışa aktarıyoruz
module.exports = app;