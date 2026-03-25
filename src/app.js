const express = require('express');
const cors = require('cors');

// Rotaları İçeri Aktarıyoruz
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const sellerRoutes = require('./routes/sellerRoutes');

const app = express();

// Middleware'ler
app.use(cors());
app.use(express.json());

// API Yollarını Tanımlıyoruz
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/seller', sellerRoutes);

// Test Uç Noktası
app.get('/', (req, res) => {
    res.send('superintelligence-code-man API Başarıyla Çalışıyor! 🚀');
});

// app nesnesini server.js'de kullanmak üzere dışa aktarıyoruz
module.exports = app;