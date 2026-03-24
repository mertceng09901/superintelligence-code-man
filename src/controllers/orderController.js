const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Sipariş Oluşturma
exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        
        // Kullanıcının sepetini bul
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Sepetiniz boş' });
        }

        // Sepetteki ürünleri sipariş formatına çevir (Fiyatı dondur)
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            selectedColor: item.selectedColor,
            priceAtPurchase: item.product.price // O anki fiyatı sabitliyoruz
        }));

        // Yeni sipariş oluştur
        const newOrder = await Order.create({
            user: req.user.id,
            orderId: 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000), // Rastgele sipariş no
            items: orderItems,
            totalAmount: cart.totalAmount,
            shippingAddress,
            paymentMethod
        });

        // Sipariş başarılı olduktan sonra sepeti boşalt
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Kullanıcının Kendi Sipariş Geçmişini Görüntülemesi
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};