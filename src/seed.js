// ============================================
// SEED SCRIPT – Veritabanına Başlangıç Verisi Yükleme
// ============================================
// Kullanım: node src/seed.js
// Docker'da: docker exec mobil_backend node src/seed.js

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

        // =============================================
        // 1. SUPERINTELLİGENCE ADMIN KULLANICI
        // =============================================
        const siAdminExists = await User.findOne({ email: 'admin@superintelligence.com' });
        if (!siAdminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            await User.create({
                firstName: 'Admin',
                lastName: 'Superintelligence',
                email: 'admin@superintelligence.com',
                password: hashedPassword,
                phone: '0532 000 0001',
                role: 'ADMIN'
            });
            console.log('👑 Admin kullanıcı oluşturuldu: admin@superintelligence.com / admin123');
        } else {
            console.log('ℹ️  admin@superintelligence.com zaten mevcut.');
        }

        // =============================================
        // 2. SUPERINTELLİGENCE USER KULLANICI
        // =============================================
        const siUserExists = await User.findOne({ email: 'user@superintelligence.com' });
        if (!siUserExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('user123', salt);
            await User.create({
                firstName: 'Test',
                lastName: 'Kullanıcı',
                email: 'user@superintelligence.com',
                password: hashedPassword,
                phone: '0532 000 0002',
                role: 'USER'
            });
            console.log('👤 Kullanıcı oluşturuldu: user@superintelligence.com / user123');
        } else {
            console.log('ℹ️  user@superintelligence.com zaten mevcut.');
        }

        // =============================================
        // 3. MOBİLCEPTE ADMIN (eski - korunuyor)
        // =============================================
        const adminExists = await User.findOne({ email: 'admin@mobilcepte.com' });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            await User.create({
                firstName: 'Admin',
                lastName: 'MobilCepte',
                email: 'admin@mobilcepte.com',
                password: hashedPassword,
                phone: '0532 000 0000',
                role: 'ADMIN'
            });
            console.log('👑 Admin kullanıcı oluşturuldu: admin@mobilcepte.com / admin123');
        } else {
            console.log('ℹ️  admin@mobilcepte.com zaten mevcut.');
        }

        // =============================================
        // 4. MOBİLCEPTE USER (eski - korunuyor)
        // =============================================
        const userExists = await User.findOne({ email: 'user@mobilcepte.com' });
        if (!userExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('user123', salt);
            await User.create({
                firstName: 'Test',
                lastName: 'Kullanıcı',
                email: 'user@mobilcepte.com',
                password: hashedPassword,
                phone: '0532 222 2222',
                role: 'USER'
            });
            console.log('👤 Kullanıcı oluşturuldu: user@mobilcepte.com / user123');
        } else {
            console.log('ℹ️  user@mobilcepte.com zaten mevcut.');
        }

        // =============================================
        // 5. ÖRNEK ÜRÜNLER
        // =============================================
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            const products = [
                {
                    brand: 'Apple',
                    model: 'iPhone 15 Pro Max',
                    price: 84999,
                    stock: 25,
                    specs: { ram: '8GB', storage: '256GB' },
                    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=400'
                },
                {
                    brand: 'Apple',
                    model: 'iPhone 15',
                    price: 54999,
                    stock: 40,
                    specs: { ram: '6GB', storage: '128GB' },
                    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=400'
                },
                {
                    brand: 'Samsung',
                    model: 'Galaxy S24 Ultra',
                    price: 74999,
                    stock: 30,
                    specs: { ram: '12GB', storage: '512GB' },
                    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/tr/2401/gallery/tr-galaxy-s24-ultra-s928-sm-s928bztdtur-thumb-539573264?$400_400_PNG$'
                },
                {
                    brand: 'Samsung',
                    model: 'Galaxy S24',
                    price: 44999,
                    stock: 50,
                    specs: { ram: '8GB', storage: '256GB' },
                    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/tr/2401/gallery/tr-galaxy-s24-s921-sm-s921bzvdtur-thumb-539573140?$400_400_PNG$'
                },
                {
                    brand: 'Xiaomi',
                    model: 'Xiaomi 14 Ultra',
                    price: 49999,
                    stock: 20,
                    specs: { ram: '16GB', storage: '512GB' },
                    imageUrl: 'https://i02.appmifile.com/540_operator_sg/06/03/2024/f5803e5e4e86bdc6f1c0c6edab3a10f1.png?w=400'
                },
                {
                    brand: 'Google',
                    model: 'Pixel 8 Pro',
                    price: 39999,
                    stock: 15,
                    specs: { ram: '12GB', storage: '256GB' },
                    imageUrl: 'https://lh3.googleusercontent.com/GKkIE_2tDzzN6fYLKn8VuE0K-PxI16ElLaJH8WjZdWfH8RO6-CYvqfA5YGv4c6B6B16D4Pk_qKcMFkp3fA=s0-w400'
                },
                {
                    brand: 'OnePlus',
                    model: 'OnePlus 12',
                    price: 34999,
                    stock: 35,
                    specs: { ram: '16GB', storage: '256GB' },
                    imageUrl: 'https://image01.oneplus.net/ebp/202401/08/1-m00-52-5b-rb8lb2waxmeaeulnaay2epmxcqs670.png?w=400'
                },
                {
                    brand: 'Huawei',
                    model: 'Huawei Mate 60 Pro',
                    price: 59999,
                    stock: 10,
                    specs: { ram: '12GB', storage: '512GB' },
                    imageUrl: 'https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/phones/mate60-pro/img/design/huawei-mate60-pro-green-front-back.png'
                }
            ];

            await Product.insertMany(products);
            console.log(`📱 ${products.length} adet örnek ürün oluşturuldu.`);
        } else {
            console.log(`ℹ️  Veritabanında zaten ${productCount} ürün mevcut.`);
        }

        console.log('');
        console.log('═══════════════════════════════════════════');
        console.log('✅ Seed işlemi tamamlandı!');
        console.log('');
        console.log('📋 Giriş Bilgileri:');
        console.log('  👑 Admin  : admin@superintelligence.com / admin123');
        console.log('  👤 Kullanıcı: user@superintelligence.com / user123');
        console.log('═══════════════════════════════════════════');

        process.exit(0);
    } catch (err) {
        console.error('❌ Seed hatası:', err.message);
        process.exit(1);
    }
};

seedData();
