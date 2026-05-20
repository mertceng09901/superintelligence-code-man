const redis = require('redis');

let client = null;

const connectRedis = async () => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    client = redis.createClient({ 
      url: redisUrl,
      socket: { reconnectStrategy: false, connectTimeout: 5000 }
    });

    client.on('error', (err) => {
      // Hata logla ama client'ı null yap ki sonraki çağrılar skip etsin
      console.error('❌ Redis Bağlantı Hatası:', err.message);
    });

    client.on('connect', () => {
      console.log('✅ Redis Bağlantısı Başarılı!');
    });

    client.on('ready', () => {
      console.log('🟢 Redis Kullanıma Hazır!');
    });

    await client.connect();
    return client;
  } catch (err) {
    console.error('❌ Redis başlatılamadı (opsiyonel):', err.message);
    client = null; // Bağlanamazsa null olarak işaretle
    return null;
  }
};

// Sadece bağlı ve hazır olan client'ı döndür
const getRedisClient = () => {
  if (client && client.isReady) return client;
  return null;
};

module.exports = { connectRedis, getRedisClient };
