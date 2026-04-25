const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.getCheckoutSummary = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id || req.user.id }).populate('items.product', 'brand model price imageUrl');
        if (!cart || cart.items.length === 0) return res.json({ items: [], totalAmount: 0 });
        res.json({ items: cart.items, totalAmount: cart.totalAmount });
    } catch (error) {
        res.status(500).json({ message: 'Ozet getirilemedi', error: error.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        const cart = await Cart.findOne({ user: req.user._id || req.user.id }).populate('items.product');
        if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Sepetiniz bos' });
        const orderItems = cart.items.map(item => ({ product: item.product._id, quantity: item.quantity, priceAtPurchase: item.product.price }));
        const newOrder = await Order.create({ user: req.user._id || req.user.id, orderId: 'ORD-' + Date.now(), items: orderItems, totalAmount: cart.totalAmount, shippingAddress, paymentMethod });
        cart.items = []; cart.totalAmount = 0; await cart.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatasi', error: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id || req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatasi', error: error.message });
    }
};