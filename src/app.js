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
    origin: true, // Tüm originlere izin ver (mobil uygulama, web, Expo)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
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

// --- Sağlık Kontrolü ve Demo Sıfırlama ---
app.get('/api/health', async (req, res) => {
    const { getRedisClient } = require('./config/redisClient');
    const redisClient = getRedisClient();
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        services: {
            api: '🟢 Çalışıyor',
            mongodb: '🟢 Bağlı',
            redis: redisClient ? '🟢 Bağlı' : '🔴 Bağlı Değil (opsiyonel)',
        },
        demoAccounts: [
            { email: 'admin@superintelligence.com', password: 'admin123', role: 'ADMIN' },
            { email: 'user@superintelligence.com', password: 'user123', role: 'USER' }
        ]
    });
});

// Demo hesapları ve ürünleri sıfırlama endpoint'i
app.get('/api/admin/reset-demo', async (req, res) => {
    try {
        const bcrypt = require('bcryptjs');
        const User = require('./models/user');
        const Product = require('./models/Product');

        const results = [];

        // Demo hesapları sıfırla
        const demoAccounts = [
            { firstName: 'Admin', lastName: 'Superintelligence', email: 'admin@superintelligence.com', password: 'admin123', phone: '0532 000 0001', role: 'ADMIN' },
            { firstName: 'Test', lastName: 'Kullanici', email: 'user@superintelligence.com', password: 'user123', phone: '0532 000 0002', role: 'USER' }
        ];

        for (const account of demoAccounts) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(account.password, salt);
            await User.findOneAndUpdate(
                { email: account.email },
                { ...account, password: hashedPassword },
                { upsert: true, new: true, runValidators: false }
            );
            results.push(`✅ ${account.email} [${account.role}] sıfırlandı`);
        }

        // Ürün kontrolü
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            const demoProducts = [
                { brand: 'Apple', model: 'iPhone 15 Pro Max', price: 84999, stock: 25, specs: { ram: '8GB', storage: '256GB' }, imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=400' },
                { brand: 'Apple', model: 'iPhone 15', price: 54999, stock: 40, specs: { ram: '6GB', storage: '128GB' }, imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=400' },
                { brand: 'Samsung', model: 'Galaxy S24 Ultra', price: 74999, stock: 30, specs: { ram: '12GB', storage: '512GB' }, imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/tr/2401/gallery/tr-galaxy-s24-ultra-s928-sm-s928bztdtur-thumb-539573264?$400_400_PNG$' },
                { brand: 'Samsung', model: 'Galaxy S24', price: 44999, stock: 50, specs: { ram: '8GB', storage: '256GB' }, imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/tr/2401/gallery/tr-galaxy-s24-s921-sm-s921bzvdtur-thumb-539573140?$400_400_PNG$' },
                { brand: 'Xiaomi', model: 'Xiaomi 14 Ultra', price: 49999, stock: 20, specs: { ram: '16GB', storage: '512GB' }, imageUrl: 'https://i02.appmifile.com/540_operator_sg/06/03/2024/f5803e5e4e86bdc6f1c0c6edab3a10f1.png?w=400' },
                { brand: 'OnePlus', model: 'OnePlus 12', price: 34999, stock: 35, specs: { ram: '16GB', storage: '256GB' }, imageUrl: 'https://image01.oneplus.net/ebp/202401/08/1-m00-52-5b-rb8lb2waxmeaeulnaay2epmxcqs670.png?w=400' }
            ];
            await Product.insertMany(demoProducts);
            results.push(`📱 ${demoProducts.length} demo ürün eklendi`);
        } else {
            results.push(`📱 ${productCount} ürün zaten mevcut`);
        }

        res.json({ success: true, message: 'Demo veriler sıfırlandı', results });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
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