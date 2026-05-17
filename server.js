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
            const exists = await User.findOne({ email: account.email });
            if (!exists) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(account.password, salt);
                await User.create({ ...account, password: hashedPassword });
                console.log(`✅ Demo hesap oluşturuldu: ${account.email} [${account.role}]`);
            } else {
                // Mevcut hesabın rolünü güncelle (ADMIN olması gerekiyorsa)
                if (exists.role !== account.role) {
                    await User.findByIdAndUpdate(exists._id, { role: account.role });
                    console.log(`🔄 Rol güncellendi: ${account.email} → ${account.role}`);
                } else {
                    console.log(`ℹ️  Hesap zaten mevcut: ${account.email}`);
                }
            }
        }
        console.log('✅ Demo hesap kontrolü tamamlandı.');
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
