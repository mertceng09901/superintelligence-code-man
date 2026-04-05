const Order = require('../models/Order');
const Cart  = require('../models/Cart');

// Sipariş Özeti — Checkout sayfası için sepet bilgisini döndürür
// DÜZELTME: Eski kodda /orders/checkout-summary endpoint'i hiç yoktu → 404 hatası veriyordu
exports.getCheckoutSummary = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id || req.user.id })
            .populate('items.product', 'brand model price imageUrl');

        if (!cart || cart.items.length === 0) {
            return res.json({ items: [], totalAmount: 0 });
        }

        res.json({
            items: cart.items,
            totalAmount: cart.totalAmount
        });
    } catch (error) {
        res.status(500).json({ message: 'Özet getirilemedi', error: error.message });
    }
};

// Sipariş Oluşturma
exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        const cart = await Cart.findOne({ user: req.user._id || req.user.id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Sepetiniz boş' });
        }

        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            selectedColor: item.selectedColor,
            priceAtPurchase: item.product.price
        }));

        const newOrder = await Order.create({
            user: req.user._id || req.user.id,
            orderId: 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            items: orderItems,
            totalAmount: cart.totalAmount,
            shippingAddress,
            paymentMethod
        });

        // Siparişten sonra sepeti boşalt
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Kullanıcının Sipariş Geçmişi
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id || req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};
