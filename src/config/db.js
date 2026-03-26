const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("⏳ MongoDB'ye bağlanılmaya çalışılıyor...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // 5 saniye içinde bağlanamazsan hata ver
    });
    console.log("✅ MongoDB Bağlantısı Başarılı!");
  } catch (err) {
    console.error("❌ MongoDB Bağlantı Hatası:", err.message);
    process.exit(1); // Bağlantı yoksa uygulamayı durdur ki hatayı görelim
  }
};

connectDB();
module.exports = connectDB;