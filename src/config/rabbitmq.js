const amqp = require('amqplib');

let channel = null;
let connection = null;

const connectRabbitMQ = async () => {
  try {
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    
    connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();

    // Sipariş kuyruğunu oluştur (yoksa)
    await channel.assertQueue('order_queue', { durable: true });
    // Bildirim kuyruğunu oluştur (yoksa)
    await channel.assertQueue('notification_queue', { durable: true });

    console.log('✅ RabbitMQ Bağlantısı Başarılı!');
    console.log('🟢 Kuyruklar hazır: order_queue, notification_queue');

    // Bağlantı kapandığında log yazdır
    connection.on('close', () => {
      console.log('⚠️ RabbitMQ bağlantısı kapandı.');
    });

    return channel;
  } catch (err) {
    console.error('❌ RabbitMQ başlatılamadı:', err.message);
    // RabbitMQ opsiyonel — bağlanamazsa uygulama yine de çalışsın
    return null;
  }
};

// Kuyruğa mesaj gönder
const publishToQueue = async (queueName, message) => {
  try {
    if (!channel) {
      console.warn('⚠️ RabbitMQ channel mevcut değil, mesaj gönderilemedi.');
      return false;
    }
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true // Mesajlar sunucu restart'ında kaybolmasın
    });
    console.log(`📨 Mesaj kuyruğa gönderildi: ${queueName}`);
    return true;
  } catch (err) {
    console.error('❌ Mesaj gönderilemedi:', err.message);
    return false;
  }
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, publishToQueue, getChannel };
