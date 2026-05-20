const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.getCheckoutSummary = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id || req.user.id })
            .populate('items.product', 'brand model price imageUrl');
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

        // Null urunleri filtrele (silinmis urunler populate edilemez)
        const validItems = cart.items.filter(item => item.product && item.product._id);
        if (validItems.length === 0) {
            return res.status(400).json({ message: 'Sepetinizdeki urunler bulunamadi. Sepeti temizleyip tekrar deneyin.' });
        }

        const orderItems = validItems.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            selectedColor: item.selectedColor || 'Varsayilan',
            priceAtPurchase: item.product.price || 0
        }));

        const totalAmount = orderItems.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);
        const orderId = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 9999);

        const newOrder = await Order.create({
            user: req.user._id || req.user.id,
            orderId,
            items: orderItems,
            totalAmount: totalAmount || cart.totalAmount || 0,
            shippingAddress: shippingAddress ? shippingAddress.trim() : 'Belirtilmedi',
            paymentMethod: paymentMethod || 'CREDIT_CARD',
            status: 'PAYMENT_SUCCESS'
        });

        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(201).json({
            orderId: newOrder.orderId,
            totalAmount: newOrder.totalAmount,
            status: newOrder.status,
            createdAt: newOrder.createdAt,
            _id: newOrder._id
        });
    } catch (error) {
        console.error('Siparis olusturma hatasi:', error);
        res.status(500).json({ message: 'Siparis olusturulamadi: ' + error.message, error: error.message });
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