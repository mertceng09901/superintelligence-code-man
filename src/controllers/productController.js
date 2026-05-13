const Product = require('../models/Product');
const { getRedisClient } = require('../config/redisClient');

// Ürünleri Listeleme ve Dinamik Filtreleme (Redis Cache destekli)
exports.getProducts = async (req, res) => {
    try {
        const { brand, minPrice, maxPrice, sort } = req.query;
        
        // Eğer filtre yoksa ve Redis bağlıysa cache'den oku
        const redisClient = getRedisClient();
        if (!brand && !minPrice && !maxPrice && !sort && redisClient) {
            try {
                const cached = await redisClient.get('products_cache');
                if (cached) {
                    const products = JSON.parse(cached);
                    return res.json({ totalItems: products.length, products, fromCache: true });
                }
            } catch (e) {
                // Redis hatası olursa devam et
            }
        }

        let query = {};

        // Filtreleri Ayarlama
        if (brand) query.brand = brand;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Sıralama Ayarlama
        let sortOption = {};
        if (sort === 'price_asc') sortOption.price = 1; // Ucuzdan pahalıya
        else if (sort === 'price_desc') sortOption.price = -1; // Pahalıdan ucuza
        else sortOption.createdAt = -1; // En yeniler

        const products = await Product.find(query).sort(sortOption);

        // Filtresiz sorguysa Redis'e cache'le (5 dakika TTL)
        if (!brand && !minPrice && !maxPrice && !sort && redisClient) {
            try {
                await redisClient.setEx('products_cache', 300, JSON.stringify(products));
            } catch (e) {
                // Redis hatası olursa devam et
            }
        }

        res.json({ totalItems: products.length, products });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Tekil Ürün Detayı Getirme
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Yeni Ürün Ekleme (Satıcı/Admin için)
exports.createProduct = async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        
        // Redis cache'i temizle (yeni ürün eklendiğinde)
        const redisClient = getRedisClient();
        if (redisClient) {
            try { await redisClient.del('products_cache'); } catch (e) {}
        }
        
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Ürün Güncelleme (Satıcı/Admin için)
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
        
        // Redis cache'i temizle
        const redisClient = getRedisClient();
        if (redisClient) {
            try { await redisClient.del('products_cache'); } catch (e) {}
        }
        
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Ürün Silme (Satıcı/Admin için)
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.productId);
        
        // Redis cache'i temizle
        const redisClient = getRedisClient();
        if (redisClient) {
            try { await redisClient.del('products_cache'); } catch (e) {}
        }
        
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};