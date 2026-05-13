// ============================================
// MobilCepte Backend — Ana Sunucu Dosyası
// ============================================
// Docker ortamında environment variable'lar docker-compose.yaml'dan gelir
// Local geliştirmede .env dosyasından okunur
require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const { connectRedis } = require('./src/config/redisClient');
const { connectRabbitMQ } = require('./src/config/rabbitmq');

const PORT = process.env.PORT || 9000;

// Tüm servislere bağlan ve sunucuyu başlat
const startServer = async () => {
    try {
        // 1. MongoDB'ye bağlan (zorunlu)
        await connectDB();

        // 2. Redis'e bağlan (opsiyonel — hata verirse uygulama yine çalışır)
        await connectRedis();

        // 3. RabbitMQ'ya bağlan (opsiyonel — hata verirse uygulama yine çalışır)
        await connectRabbitMQ();

        // 4. Sunucuyu başlat
        app.listen(PORT, '0.0.0.0', () => {
            console.log('═══════════════════════════════════════════');
            console.log(`🚀 MobilCepte API — Port ${PORT}`);
            console.log(`📍 http://localhost:${PORT}`);
            console.log('═══════════════════════════════════════════');
        });
    } catch (err) {
        console.error('❌ Sunucu başlatılamadı:', err.message);
        process.exit(1);
    }
};

startServer();
