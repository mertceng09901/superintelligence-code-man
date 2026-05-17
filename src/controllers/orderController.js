const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { publishToQueue } = require('../config/rabbitmq');
const { getRedisClient } = require('../config/redisClient');

exports.getCheckoutSummary = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id || req.user.id })
            .populate('items.product', 'brand model price imageUrl');
        if (!cart || cart.items.length === 0) {
            return res.json({ items: [], totalAmount: 0 });
        }
        res.json({ items: cart.items, totalAmount: cart.totalAmount });
    } catch (error) {
        res.status(500).json({ message: 'Ozet getirilemedi', error: error.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        if (!shippingAddress) {
            return res.status(400).json({ message: 'Teslimat adresi zorunludur.' });
        }

        const cart = await Cart.findOne({ user: req.user._id || req.user.id })
            .populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Sepetiniz bos, önce ürün ekleyin.' });
        }

        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            selectedColor: item.selectedColor || 'Varsayilan',
            priceAtPurchase: item.product.price
        }));

        const newOrder = await Order.create({
            user: req.user._id || req.user.id,
            orderId: 'ORD-' + Date.now(),
            items: orderItems,
            totalAmount: cart.totalAmount,
            shippingAddress,
            paymentMethod: paymentMethod || 'CREDIT_CARD'
        });

        // Sepeti temizle
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        // RabbitMQ'ya sipariş mesajı gönder (OPSIYONEL — hata olsa bile sipariş oluşur)
        try {
            await publishToQueue('order_queue', {
                orderId: newOrder.orderId,
                userId: req.user._id || req.user.id,
                totalAmount: newOrder.totalAmount,
                itemCount: orderItems.length,
                createdAt: new Date().toISOString()
            });
        } catch (mqError) {
            console.warn('⚠️ RabbitMQ mesaj gönderilemedi (sipariş yine de oluşturuldu):', mqError.message);
        }

        // Redis cache'i temizle (OPSIYONEL — hata olsa bile sipariş oluşur)
        try {
            const redisClient = getRedisClient();
            if (redisClient) {
                await redisClient.del('products_cache');
            }
        } catch (redisError) {
            console.warn('⚠️ Redis cache temizlenemedi:', redisError.message);
        }

        res.status(201).json({
            orderId: newOrder.orderId,
            totalAmount: newOrder.totalAmount,
            status: newOrder.status,
            createdAt: newOrder.createdAt,
            _id: newOrder._id
        });

    } catch (error) {
        console.error('Siparis olusturma hatasi:', error.message);
        res.status(500).json({ message: 'Siparis olusturulamadi.', error: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id || req.user.id })
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Siparisler getirilemedi.', error: error.message });
    }
};