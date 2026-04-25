import React, { createContext, useState, useContext } from 'react';

// 1. Context'i (Depoyu) oluşturuyoruz
const CartContext = createContext();

// 2. Bu depoyu diğer sayfalarda kolayca kullanmak için özel bir Hook yapıyoruz
export const useCart = () => useContext(CartContext);

// 3. Provider (Sağlayıcı): Uygulamamızı sarmalayacak olan ana bileşen
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Sepete Ürün Ekleme Fonksiyonu
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Ürün zaten sepette var mı kontrol et
      const existingItem = prevItems.find((item) => item._id === product._id);
      
      if (existingItem) {
        // Varsa sadece miktarını (quantity) 1 artır
        return prevItems.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Yoksa sepete yeni ürün olarak ekle (miktar 1)
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Sepetten Ürün Çıkarma Fonksiyonu
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
  };

  // Sepeti Tamamen Temizleme Fonksiyonu
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    // Depodaki veri ve fonksiyonları tüm uygulamaya (children) açıyoruz
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};