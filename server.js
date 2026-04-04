// DÜZELTME: .env dosyasını okumak için dotenv EN BAŞTA yüklenmeli.
// Bu satır olmadan process.env.MONGO_URI "undefined" gelir → MongoDB bağlanamaz.
require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Sunucu ${PORT} portunda çalışıyor ve DB bağlı!`);
    });
}).catch((err) => {
    console.log('❌ Sunucu başlatılamadı çünkü DB bağlantısı başarısız.');
});
