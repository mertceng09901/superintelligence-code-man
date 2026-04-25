const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Bağlantı seçeneklerini ekleyerek Mongoose'u zorluyoruz
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });
    console.log("✅✅ MÜJDE: MongoDB Bağlantısı Başarılı!");
  } catch (err) {
    console.error("❌❌ Bağlantı Hatası:", err.message);
    process.exit(1); 
  }
};

module.exports = connectDB;