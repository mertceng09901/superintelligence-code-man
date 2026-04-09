import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useCart } from '../context/CartContext'; // 1. Context'i import et

export default function CartScreen({ navigation }) {
  // 2. Sepet verilerini ve temizleme fonksiyonlarını depodan çek
  const { cartItems, removeFromCart, clearCart } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    Alert.alert("Sipariş Alındı!", "Ödeme başarılı. Bizi tercih ettiğiniz için teşekkürler!");
    clearCart(); // Sipariş sonrası sepeti boşalt
    navigation.navigate('Home');
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price} ₺ x {item.quantity}</Text>
      </View>
      
      {/* Sepetten silme butonu */}
      <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromCart(item._id)}>
        <Text style={styles.removeBtnText}>Sil</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item._id || Math.random().toString()}
            renderItem={renderCartItem}
            contentContainerStyle={styles.listContainer}
          />
          <View style={styles.footer}>
            <Text style={styles.totalText}>Toplam: {calculateTotal()} ₺</Text>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Siparişi Tamamla</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Sepetiniz şu an boş 😔</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.shoppingButton}>
            <Text style={styles.shoppingButtonText}>Alışverişe Başla</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  listContainer: { padding: 15 },
  cartItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2, justifyContent: 'space-between', alignItems: 'center' },
  itemInfo: { flex: 2 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  itemPrice: { fontSize: 16, color: '#28a745', fontWeight: 'bold' },
  removeBtn: { backgroundColor: '#ff4d4f', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 5 },
  removeBtnText: { color: '#fff', fontWeight: 'bold' },
  footer: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee', elevation: 10 },
  totalText: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'center' },
  checkoutButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center' },
  checkoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#666', marginBottom: 20 },
  shoppingButton: { backgroundColor: '#28a745', padding: 12, borderRadius: 8 },
  shoppingButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});