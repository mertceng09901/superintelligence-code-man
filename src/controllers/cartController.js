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
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity, selectedColor } = req.body;
        const product = await Product.findById(productId);
        
        if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            // Kullanıcının sepeti yoksa yeni oluştur
            cart = new Cart({ user: req.user.id, items: [], totalAmount: 0 });
        }

        // Ürün zaten sepette var mı kontrol et
        const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

        if (itemIndex > -1) {
            // Varsa miktarını artır
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Yoksa sepete yeni ürün olarak ekle
            cart.items.push({ product: productId, quantity, selectedColor });
        }

        // Toplam tutarı güncelle
        cart.totalAmount += product.price * quantity;
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};