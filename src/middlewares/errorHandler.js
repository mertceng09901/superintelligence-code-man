// ============================================
// Global Error Handler Middleware
// ============================================
// Tüm controller'larda yakalanmayan hataları burada yakalarız.
// app.js'de en son middleware olarak eklenir.

const errorHandler = (err, req, res, next) => {
    console.error('❌ Hata:', err.stack || err.message);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Sunucu hatası oluştu.';

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
