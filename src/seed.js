// ============================================
// SEED SCRIPT – Veritabanına Başlangıç Verisi Yükleme
// ============================================
// Kullanım: node src/seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mobilcepte';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB bağlantısı kuruldu.');

        const siAdminExists = await User.findOne({ email: 'admin@superintelligence.com' });
        if (!siAdminExists) {
            const hash = await bcrypt.hash('admin123', 10);
            await User.create({ firstName: 'Admin', lastName: 'Superintelligence', email: 'admin@superintelligence.com', password: hash, phone: '0532 000 0001', role: 'ADMIN' });
            console.log('👑 Admin: admin@superintelligence.com / admin123');
        }

        const siUserExists = await User.findOne({ email: 'user@superintelligence.com' });
        if (!siUserExists) {
            const hash = await bcrypt.hash('user123', 10);
            await User.create({ firstName: 'Test', lastName: 'Kullanıcı', email: 'user@superintelligence.com', password: hash, phone: '0532 000 0002', role: 'USER' });
            console.log('👤 User: user@superintelligence.com / user123');
        }

        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            const products = [
                {
                    brand: 'Apple', model: 'iPhone 15 Pro Max', price: 84999, stock: 25,
                    specs: { ram: '8GB', storage: '256GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-max-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-max-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-max-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-max-3.jpg',
                    ]
                },
                {
                    brand: 'Apple', model: 'iPhone 15 Pro', price: 69999, stock: 30,
                    specs: { ram: '8GB', storage: '128GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-3.jpg',
                    ]
                },
                {
                    brand: 'Apple', model: 'iPhone 15', price: 54999, stock: 40,
                    specs: { ram: '6GB', storage: '128GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-3.jpg',
                    ]
                },
                {
                    brand: 'Apple', model: 'iPhone 14 Pro Max', price: 64999, stock: 20,
                    specs: { ram: '6GB', storage: '256GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-max-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-max-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-max-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-max-3.jpg',
                    ]
                },
                {
                    brand: 'Apple', model: 'iPhone SE (2024)', price: 29999, stock: 60,
                    specs: { ram: '4GB', storage: '128GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-se-2022-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-se-2022-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-se-2022-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-se-2022-3.jpg',
                    ]
                },
                {
                    brand: 'Apple', model: 'iPhone 13', price: 39999, stock: 45,
                    specs: { ram: '4GB', storage: '128GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-13-01.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-13-01.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-13-02.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-13-03.jpg',
                    ]
                },
                {
                    brand: 'Samsung', model: 'Galaxy S24 Ultra', price: 74999, stock: 30,
                    specs: { ram: '12GB', storage: '512GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-ultra-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-ultra-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-ultra-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-ultra-3.jpg',
                    ]
                },
                {
                    brand: 'Samsung', model: 'Galaxy S24+', price: 57999, stock: 25,
                    specs: { ram: '12GB', storage: '256GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24plus-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24plus-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24plus-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24plus-3.jpg',
                    ]
                },
                {
                    brand: 'Samsung', model: 'Galaxy S24', price: 44999, stock: 50,
                    specs: { ram: '8GB', storage: '256GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-3.jpg',
                    ]
                },
                {
                    brand: 'Samsung', model: 'Galaxy Z Fold 5', price: 89999, stock: 10,
                    specs: { ram: '12GB', storage: '256GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-fold5-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-fold5-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-fold5-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-fold5-3.jpg',
                    ]
                },
                {
                    brand: 'Samsung', model: 'Galaxy Z Flip 5', price: 54999, stock: 18,
                    specs: { ram: '8GB', storage: '256GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-flip5-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-flip5-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-flip5-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-flip5-3.jpg',
                    ]
                },
                {
                    brand: 'Samsung', model: 'Galaxy A55', price: 19999, stock: 70,
                    specs: { ram: '8GB', storage: '256GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a55-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a55-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a55-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a55-3.jpg',
                    ]
                },
                {
                    brand: 'Samsung', model: 'Galaxy S23 FE', price: 29999, stock: 38,
                    specs: { ram: '8GB', storage: '256GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-fe-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-fe-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-fe-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-fe-3.jpg',
                    ]
                },
                {
                    brand: 'Xiaomi', model: 'Xiaomi 14 Ultra', price: 49999, stock: 20,
                    specs: { ram: '16GB', storage: '512GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-ultra-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-ultra-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-ultra-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-ultra-3.jpg',
                    ]
                },
                {
                    brand: 'Xiaomi', model: 'Xiaomi 14', price: 34999, stock: 35,
                    specs: { ram: '12GB', storage: '256GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-3.jpg',
                    ]
                },
                {
                    brand: 'Xiaomi', model: 'Xiaomi 13T Pro', price: 27999, stock: 40,
                    specs: { ram: '12GB', storage: '256GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-13t-pro-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-13t-pro-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-13t-pro-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-13t-pro-3.jpg',
                    ]
                },
                {
                    brand: 'Xiaomi', model: 'Redmi Note 13 Pro+', price: 18999, stock: 80,
                    specs: { ram: '12GB', storage: '256GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-13-pro-plus-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-13-pro-plus-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-13-pro-plus-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-13-pro-plus-3.jpg',
                    ]
                },
                {
                    brand: 'Xiaomi', model: 'POCO X6 Pro', price: 14999, stock: 55,
                    specs: { ram: '8GB', storage: '256GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-x6-pro-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-x6-pro-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-x6-pro-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-x6-pro-3.jpg',
                    ]
                },
                {
                    brand: 'Xiaomi', model: 'Redmi 13C', price: 7999, stock: 100,
                    specs: { ram: '4GB', storage: '128GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-13c-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-13c-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-13c-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-13c-3.jpg',
                    ]
                },
                {
                    brand: 'Google', model: 'Pixel 8 Pro', price: 39999, stock: 15,
                    specs: { ram: '12GB', storage: '256GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-3.jpg',
                    ]
                },
                {
                    brand: 'Google', model: 'Pixel 8', price: 29999, stock: 22,
                    specs: { ram: '8GB', storage: '128GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-3.jpg',
                    ]
                },
                {
                    brand: 'Google', model: 'Pixel 7a', price: 21999, stock: 28,
                    specs: { ram: '8GB', storage: '128GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-7a-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-7a-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-7a-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-7a-3.jpg',
                    ]
                },
                {
                    brand: 'OnePlus', model: 'OnePlus 12', price: 34999, stock: 35,
                    specs: { ram: '16GB', storage: '256GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12-3.jpg',
                    ]
                },
                {
                    brand: 'OnePlus', model: 'OnePlus 12R', price: 24999, stock: 45,
                    specs: { ram: '8GB', storage: '128GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12r-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12r-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12r-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12r-3.jpg',
                    ]
                },
                {
                    brand: 'OnePlus', model: 'OnePlus Nord 4', price: 17999, stock: 55,
                    specs: { ram: '8GB', storage: '128GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-nord-4-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-nord-4-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-nord-4-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-nord-4-3.jpg',
                    ]
                },
                {
                    brand: 'Huawei', model: 'Huawei Mate 60 Pro', price: 59999, stock: 10,
                    specs: { ram: '12GB', storage: '512GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/huawei/huawei-mate-60-pro-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/huawei/huawei-mate-60-pro-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/huawei/huawei-mate-60-pro-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/huawei/huawei-mate-60-pro-3.jpg',
                    ]
                },
                {
                    brand: 'Huawei', model: 'Huawei P60 Pro', price: 44999, stock: 12,
                    specs: { ram: '8GB', storage: '256GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/huawei/huawei-p60-pro-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/huawei/huawei-p60-pro-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/huawei/huawei-p60-pro-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/huawei/huawei-p60-pro-3.jpg',
                    ]
                },
                {
                    brand: 'Huawei', model: 'Huawei Nova 12 Pro', price: 23999, stock: 20,
                    specs: { ram: '8GB', storage: '256GB' },
                    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/huawei/huawei-nova-12-pro-1.jpg',
                    images: [
                        'https://fdn2.gsmarena.com/vv/pics/huawei/huawei-nova-12-pro-1.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/huawei/huawei-nova-12-pro-2.jpg',
                        'https://fdn2.gsmarena.com/vv/pics/huawei/huawei-nova-12-pro-3.jpg',
                    ]
                },
            ];

            await Product.insertMany(products);
            console.log(`📱 ${products.length} adet örnek ürün oluşturuldu.`);
        } else {
            console.log(`ℹ️  Veritabanında zaten ${productCount} ürün mevcut.`);
        }

        console.log('');
        console.log('═══════════════════════════════════════════');
        console.log('✅ Seed işlemi tamamlandı!');
        console.log('  👑 Admin  : admin@superintelligence.com / admin123');
        console.log('  👤 User   : user@superintelligence.com / user123');
        console.log('═══════════════════════════════════════════');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed hatası:', err.message);
        process.exit(1);
    }
};

seedData();
