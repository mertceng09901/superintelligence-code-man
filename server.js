const express = require('express');
const app = require('./app'); // app.js dosyanı içe aktar
const connectDB = require('./config/db'); // db.js yolun doğru olsun

const PORT = process.env.PORT || 5000;

// ÖNCE veritabanına bağlan, SONRA sunucuyu ayağa kaldır
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Sunucu ${PORT} portunda çalışıyor ve DB bağlı!`);
    });
}).catch((err) => {
    console.log("❌ Sunucu başlatılamadı çünkü DB bağlantısı başarısız.");
});