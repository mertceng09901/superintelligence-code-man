const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const app = require('./src/app'); // 1. Bütün ayarları yaptığımız app.js'i çağırdık


// .env dosyasını oku
dotenv.config();

// 2. Veritabanına Bağlan
connectDB();

const PORT = process.env.PORT || 5000;

// 3. Sunucuyu Başlat
app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda başarıyla ayağa kalktı!`);
});
app.use(express.json()); // Bu satır yoksa gönderdiğin veriler sunucuda "undefined" görünür.