const redis = require('redis');

let client = null;

const connectRedis = async () => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    client = redis.createClient({ 
      url: redisUrl,
      socket: { reconnectStrategy: false }
    });

    client.on('error', (err) => {
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
    console.error('❌ Redis başlatılamadı:', err.message);
    // Redis opsiyonel — bağlanamazsa uygulama yine de çalışsın
    return null;
  }
};

const getRedisClient = () => client;

module.exports = { connectRedis, getRedisClient };
