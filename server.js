// ============================================
// Superintelligence Mobile Backend — Ana Sunucu
// ============================================
require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const { connectRedis } = require('./src/config/redisClient');
const { connectRabbitMQ } = require('./src/config/rabbitmq');

const PORT = process.env.PORT || 9000;

// ============================================
// DEMO HESAP OTOMATİK OLUŞTURMA
// Render'a her deploy'da çalışır, hesaplar yoksa oluşturur
// ============================================
const autoSeedDemoAccounts = async () => {
    try {
        const bcrypt = require('bcryptjs');
        const User = require('./src/models/user');
        const Product = require('./src/models/Product');

        const demoAccounts = [
            {
                firstName: 'Admin',
                lastName: 'Superintelligence',
                email: 'admin@superintelligence.com',
                password: 'admin123',
                phone: '0532 000 0001',
                role: 'ADMIN'
            },
            {
                firstName: 'Test',
                lastName: 'Kullanici',
                email: 'user@superintelligence.com',
                password: 'user123',
                phone: '0532 000 0002',
                role: 'USER'
            }
        ];

        for (const account of demoAccounts) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(account.password, salt);

            const exists = await User.findOne({ email: account.email });
            if (!exists) {
                await User.create({ ...account, password: hashedPassword });
                console.log(`✅ Demo hesap oluşturuldu: ${account.email} [${account.role}]`);
            } else {
                // Her zaman şifre + rol güncelle (demo hesaplar her deploy'da sıfırlanır)
                await User.findByIdAndUpdate(exists._id, {
                    password: hashedPassword,
                    role: account.role,
                    firstName: account.firstName,
                    lastName: account.lastName
                });
                console.log(`🔄 Demo hesap güncellendi: ${account.email} [${account.role}]`);
            }
        }

        // Veritabanında hiç ürün yoksa demo ürünler ekle
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            const demoProducts = [
                { brand: 'Apple', model: 'iPhone 15 Pro Max', price: 84999, stock: 25, specs: { ram: '8GB', storage: '256GB' }, imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=400' },
                { brand: 'Apple', model: 'iPhone 15', price: 54999, stock: 40, specs: { ram: '6GB', storage: '128GB' }, imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=400' },
                { brand: 'Samsung', model: 'Galaxy S24 Ultra', price: 74999, stock: 30, specs: { ram: '12GB', storage: '512GB' }, imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/tr/2401/gallery/tr-galaxy-s24-ultra-s928-sm-s928bztdtur-thumb-539573264?$400_400_PNG$' },
                { brand: 'Samsung', model: 'Galaxy S24', price: 44999, stock: 50, specs: { ram: '8GB', storage: '256GB' }, imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/tr/2401/gallery/tr-galaxy-s24-s921-sm-s921bzvdtur-thumb-539573140?$400_400_PNG$' },
                { brand: 'Xiaomi', model: 'Xiaomi 14 Ultra', price: 49999, stock: 20, specs: { ram: '16GB', storage: '512GB' }, imageUrl: 'https://i02.appmifile.com/540_operator_sg/06/03/2024/f5803e5e4e86bdc6f1c0c6edab3a10f1.png?w=400' },
                { brand: 'Google', model: 'Pixel 8 Pro', price: 39999, stock: 15, specs: { ram: '12GB', storage: '256GB' }, imageUrl: 'https://lh3.googleusercontent.com/GKkIE_2tDzzN6fYLKn8VuE0K-PxI16ElLaJH8WjZdWfH8RO6-CYvqfA5YGv4c6B6B16D4Pk_qKcMFkp3fA=s0-w400' },
                { brand: 'OnePlus', model: 'OnePlus 12', price: 34999, stock: 35, specs: { ram: '16GB', storage: '256GB' }, imageUrl: 'https://image01.oneplus.net/ebp/202401/08/1-m00-52-5b-rb8lb2waxmeaeulnaay2epmxcqs670.png?w=400' },
                { brand: 'Huawei', model: 'Mate 60 Pro', price: 59999, stock: 10, specs: { ram: '12GB', storage: '512GB' }, imageUrl: 'https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/phones/mate60-pro/img/design/huawei-mate60-pro-green-front-back.png' }
            ];
            await Product.insertMany(demoProducts);
            console.log(`📱 ${demoProducts.length} demo ürün eklendi.`);
        }

        console.log('✅ Demo hesap ve veri kontrolü tamamlandı.');
    } catch (err) {
        console.error('⚠️ Demo hesap oluşturma hatası (uygulama çalışmaya devam eder):', err.message);
    }
};

// Tüm servislere bağlan ve sunucuyu başlat
const startServer = async () => {
    try {
        // 1. MongoDB'ye bağlan (zorunlu)
        await connectDB();

        // 2. Demo hesapları otomatik oluştur/güncelle
        await autoSeedDemoAccounts();

        // 3. Redis'e bağlan (opsiyonel — hata verirse uygulama yine çalışır)
        await connectRedis();

        // 4. RabbitMQ'ya bağlan (opsiyonel — hata verirse uygulama yine çalışır)
        await connectRabbitMQ();

        // 5. Sunucuyu başlat
        app.listen(PORT, '0.0.0.0', () => {
            console.log('═══════════════════════════════════════════');
            console.log(`🚀 Superintelligence API — Port ${PORT}`);
            console.log(`📍 http://localhost:${PORT}`);
            console.log('👑 admin@superintelligence.com / admin123');
            console.log('👤 user@superintelligence.com / user123');
            console.log('═══════════════════════════════════════════');
        });
    } catch (err) {
        console.error('❌ Sunucu başlatılamadı:', err.message);
        process.exit(1);
    }
};

startServer();
