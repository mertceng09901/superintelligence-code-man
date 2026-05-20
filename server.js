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
                { brand: 'Apple', model: 'iPhone 15 Pro Max', price: 84999, stock: 25, specs: { ram: '8GB', storage: '256GB' }, imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=400' },
                { brand: 'Apple', model: 'iPhone 15', price: 54999, stock: 40, specs: { ram: '6GB', storage: '128GB' }, imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=400' },
                { brand: 'Samsung', model: 'Galaxy S24 Ultra', price: 74999, stock: 30, specs: { ram: '12GB', storage: '512GB' }, imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/tr/2401/gallery/tr-galaxy-s24-ultra-s928-sm-s928bztdtur-thumb-539573264?$400_400_PNG$' },
                { brand: 'Samsung', model: 'Galaxy S24', price: 44999, stock: 50, specs: { ram: '8GB', storage: '256GB' }, imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/tr/2401/gallery/tr-galaxy-s24-s921-sm-s921bzvdtur-thumb-539573140?$400_400_PNG$' },
                { brand: 'Xiaomi', model: 'Xiaomi 14 Ultra', price: 49999, stock: 20, specs: { ram: '16GB', storage: '512GB' }, imageUrl: 'https://i02.appmifile.com/540_operator_sg/06/03/2024/f5803e5e4e86bdc6f1c0c6edab3a10f1.png?w=400' },
                { brand: 'Google', model: 'Pixel 8 Pro', price: 39999, stock: 15, specs: { ram: '12GB', storage: '256GB' }, imageUrl: 'https://lh3.googleusercontent.com/GKkIE_2tDzzN6fYLKn8VuE0K-PxI16ElLaJH8WjZdWfH8RO6-CYvqfA5YGv4c6B6B16D4Pk_qKcMFkp3fA=s0-w400' },
                { brand: 'OnePlus', model: 'OnePlus 12', price: 34999, stock: 35, specs: { ram: '16GB', storage: '256GB' }, imageUrl: 'https://image01.oneplus.net/ebp/202401/08/1-m00-52-5b-rb8lb2waxmeaeulnaay2epmxcqs670.png?w=400' }
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
