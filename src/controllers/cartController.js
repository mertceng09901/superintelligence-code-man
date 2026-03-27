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
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity, selectedColor } = req.body;
        // Alttan tireli _id kullanımına dikkat!
        const userId = req.user._id || req.user.id; 

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });

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

        // Toplam tutarı tüm itemlar üzerinden temizce hesapla
        // Bu yöntem manuel eklemeden daha güvenlidir
        cart.totalAmount = cart.items.reduce((acc, item) => {
            // Eğer populate edilmemişse product.price kullanamayız, 
            // o yüzden yukarıda bulduğumuz 'product' değişkenini kullanıyoruz
            return acc + (product.price * item.quantity); 
        }, 0);

        await cart.save();
        
        // Frontend'e giderken ürün bilgilerinin (resim, marka vs.) dolu gitmesi için tekrar populate et
        const updatedCart = await Cart.findById(cart._id).populate('items.product');
        res.json(updatedCart);

    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};
// Sepetten Ürün Kaldırma
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'Sepet bulunamadı' });

        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        // Toplam tutarı güncelle
        await cart.populate('items.product');
        cart.totalAmount = cart.items.reduce((acc, item) => {
            return acc + (item.product.price * item.quantity);
        }, 0);

        await cart.save();
        const updatedCart = await Cart.findById(cart._id).populate('items.product');
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};