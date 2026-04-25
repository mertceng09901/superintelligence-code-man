const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Sepeti Görüntüleme
exports.getCart = async (req, res) => {
    try {
        // req.user.id bilgisini middleware'den (token'dan) alacağız
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'brand model price images');
        if (!cart) return res.json({ items: [], totalAmount: 0 });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Sepete Ürün Ekleme
// Sepete Ürün Ekleme (Güncellenmiş)
// Sepete Ürün Ekleme (Tam Doğru Hesaplama)
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity, selectedColor } = req.body;
        const userId = req.user._id || req.user.id;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalAmount: 0 });
        }

        const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += Number(quantity);
        } else {
            cart.items.push({ product: productId, quantity: Number(quantity), selectedColor });
        }

        // --- DOĞRU HESAPLAMA BURASI ---
        // Tüm ürünlerin fiyatlarını görmek için önce sepeti dolduruyoruz (populate)
        await cart.populate('items.product');

        cart.totalAmount = cart.items.reduce((acc, item) => {
            // Her item'ın kendi ürün fiyatını (item.product.price) kullanıyoruz
            return acc + (item.product.price * item.quantity);
        }, 0);

        await cart.save();
        res.json(cart); // Zaten populate edildiği için tekrar findById yapmaya gerek yok

    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};
// Sepetten Ürün Kaldırma
// Sepetten Ürün Kaldırma
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { productId } = req.params; // URL'den gelen ID'yi alıyoruz

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'Sepet bulunamadı' });

        // Filter ile o ürünü diziden çıkarıyoruz
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        // Toplam tutarı yeniden hesaplamak için ürünleri doldur (populate)
        await cart.populate('items.product');
        
        cart.totalAmount = cart.items.reduce((acc, item) => {
            return acc + (item.product.price * item.quantity);
        }, 0);

        await cart.save();
        res.json(cart); // Güncel sepeti frontend'e yolla
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};