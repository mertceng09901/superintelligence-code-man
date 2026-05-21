// DUZELTME: .env dosyasini okumak icin dotenv EN BASTA yuklenmeli.
require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// ============================================
// DEMO HESAP + URUN OTOMATIK OLUSTURMA
// Render'a her deploy'da calisir
// ============================================
const autoSeedDemo = async () => {
    try {
        const bcrypt = require('bcryptjs');
        const User = require('./src/models/user');
        const Product = require('./src/models/Product');

        const demoAccounts = [
            { firstName: 'Admin', lastName: 'Superintelligence', email: 'admin@superintelligence.com', password: 'admin123', phone: '0532 000 0001', role: 'ADMIN' },
            { firstName: 'Test', lastName: 'Kullanici', email: 'user@superintelligence.com', password: 'user123', phone: '0532 000 0002', role: 'USER' }
        ];

        for (const account of demoAccounts) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(account.password, salt);
            const exists = await User.findOne({ email: account.email });
            if (!exists) {
                await User.create({ ...account, password: hashedPassword });
                console.log(`Hesap olusturuldu: ${account.email} [${account.role}]`);
            } else {
                // Her restart'ta sifre ve rol guncelle (demo hesaplar her zaman calissin)
                await User.findByIdAndUpdate(exists._id, {
                    password: hashedPassword,
                    role: account.role,
                    firstName: account.firstName,
                    lastName: account.lastName,
                    phone: account.phone
                });
                console.log(`Demo hesap guncellendi: ${account.email} [${account.role}]`);
            }
        }

        // Urun yoksa demo urunler ekle
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            const demoProducts = [
                { brand: 'Apple', model: 'iPhone 15 Pro Max', price: 84999, stock: 25, specs: { ram: '8GB', storage: '256GB' }, imageUrl: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-max-1.jpg', images: ['https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-max-1.jpg','https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-max-2.jpg','https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-max-3.jpg'] },
                { brand: 'Apple', model: 'iPhone 15', price: 54999, stock: 40, specs: { ram: '6GB', storage: '128GB' }, imageUrl: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-1.jpg', images: ['https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-1.jpg','https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-2.jpg','https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-3.jpg'] },
                { brand: 'Apple', model: 'iPhone 14 Pro Max', price: 64999, stock: 20, specs: { ram: '6GB', storage: '256GB' }, imageUrl: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-max-1.jpg', images: ['https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-max-1.jpg','https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-max-2.jpg','https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-max-3.jpg'] },
                { brand: 'Samsung', model: 'Galaxy S24 Ultra', price: 74999, stock: 30, specs: { ram: '12GB', storage: '512GB' }, imageUrl: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-ultra-1.jpg', images: ['https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-ultra-1.jpg','https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-ultra-2.jpg','https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-ultra-3.jpg'] },
                { brand: 'Samsung', model: 'Galaxy S24', price: 44999, stock: 50, specs: { ram: '8GB', storage: '256GB' }, imageUrl: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-1.jpg', images: ['https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-1.jpg','https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-2.jpg','https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-3.jpg'] },
                { brand: 'Xiaomi', model: 'Xiaomi 14 Ultra', price: 49999, stock: 20, specs: { ram: '16GB', storage: '512GB' }, imageUrl: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-ultra-1.jpg', images: ['https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-ultra-1.jpg','https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-ultra-2.jpg','https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-ultra-3.jpg'] },
                { brand: 'Google', model: 'Pixel 8 Pro', price: 39999, stock: 15, specs: { ram: '12GB', storage: '256GB' }, imageUrl: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-1.jpg', images: ['https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-1.jpg','https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-2.jpg','https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-3.jpg'] },
                { brand: 'OnePlus', model: 'OnePlus 12', price: 34999, stock: 35, specs: { ram: '16GB', storage: '256GB' }, imageUrl: 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12-1.jpg', images: ['https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12-1.jpg','https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12-2.jpg','https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12-3.jpg'] },
                { brand: 'Huawei', model: 'Huawei Mate 60 Pro', price: 59999, stock: 10, specs: { ram: '12GB', storage: '512GB' }, imageUrl: 'https://fdn2.gsmarena.com/vv/pics/huawei/huawei-mate-60-pro-1.jpg', images: ['https://fdn2.gsmarena.com/vv/pics/huawei/huawei-mate-60-pro-1.jpg','https://fdn2.gsmarena.com/vv/pics/huawei/huawei-mate-60-pro-2.jpg','https://fdn2.gsmarena.com/vv/pics/huawei/huawei-mate-60-pro-3.jpg'] },
            ];
            await Product.insertMany(demoProducts);
            console.log(`${demoProducts.length} demo urun eklendi.`);
        }

        console.log('Demo veri kontrolu tamamlandi.');
        console.log('admin@superintelligence.com / admin123');
        console.log('user@superintelligence.com / user123');
    } catch (err) {
        console.error('Demo seed hatasi (uygulama calisir):', err.message);
    }
};

connectDB().then(async () => {
    await autoSeedDemo();
    app.listen(PORT, () => {
        console.log(`Sunucu ${PORT} portunda calisiyor!`);
    });
}).catch((err) => {
    console.log('Sunucu baslanamadi: DB baglantisi basarisiz.', err.message);
});
