const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Sepeti Görüntüleme
exports.getCart = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        let cart = await Cart.findOne({ user: userId }).populate('items.product', 'brand model price imageUrl images');

        if (!cart) return res.json({ items: [], totalAmount: 0 });

        // Silinmiş ürünlere referans eden item'ları temizle
        const originalCount = cart.items.length;
        cart.items = cart.items.filter(item => item.product !== null && item.product !== undefined);

        if (cart.items.length !== originalCount) {
            // Bozuk item temizlendiyse totalAmount'u yeniden hesapla ve kaydet
            cart.totalAmount = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
            await cart.save();
        }

        res.json(cart);
    } catch (error) {
        console.error('getCart hatası:', error.message);
        res.status(500).json({ message: 'Sepet yüklenemedi', error: error.message });
    }
};

// Sepete Ürün Ekleme
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity, selectedColor } = req.body;
        const userId = req.user._id || req.user.id;

        // Ürünün gerçekten var olup olmadığını kontrol et
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı veya artık mevcut değil.' });
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalAmount: 0 });
        }

        // Silinmiş ürünlere referans eden eski item'ları populate ederek temizle
        await cart.populate('items.product');
        cart.items = cart.items.filter(item => item.product !== null && item.product !== undefined);

        const itemIndex = cart.items.findIndex(p => p.product._id.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += Number(quantity);
        } else {
            // Populate edilmiş cart için product objesini doğrudan ekle
            cart.items.push({ product: product._id, quantity: Number(quantity), selectedColor: selectedColor || 'Standart' });
        }

        // Toplam tutarı hesapla (populate'den gelen fiyatlar + yeni eklenen ürün)
        cart.totalAmount = cart.items.reduce((acc, item) => {
            const price = item.product.price !== undefined ? item.product.price : product.price;
            return acc + (price * item.quantity);
        }, 0);

        await cart.save();

        // Temiz ve dolu veriyi dön
        const updatedCart = await Cart.findById(cart._id).populate('items.product', 'brand model price imageUrl images');
        res.json(updatedCart);

    } catch (error) {
        console.error('addToCart hatası:', error.message);
        res.status(500).json({ message: 'Sepete eklenemedi', error: error.message });
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

        // Toplam tutarı yeniden hesapla
        await cart.populate('items.product');
        cart.items = cart.items.filter(item => item.product !== null && item.product !== undefined);
        cart.totalAmount = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate('items.product', 'brand model price imageUrl images');
        res.json(updatedCart);
    } catch (error) {
        console.error('removeFromCart hatası:', error.message);
        res.status(500).json({ message: 'Ürün sepetten kaldırılamadı', error: error.message });
    }
};