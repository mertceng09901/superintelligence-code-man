import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useCart } from '../context/CartContext'; // 1. Context'i import et

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart } = useCart(); // 2. Depodaki addToCart fonksiyonunu çek

  const handleAddToCart = () => {
    addToCart(product); // 3. Ürünü depoya gönder
    Alert.alert("Başarılı", `${product.name} sepete eklendi!`);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image || 'https://via.placeholder.com/400' }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>{product.price} ₺</Text>
        <Text style={styles.descriptionHeader}>Ürün Açıklaması</Text>
        <Text style={styles.description}>{product.description || "Bu ürün için henüz bir açıklama girilmemiştir."}</Text>

        {/* 4. Butona tıklayınca handleAddToCart çalışsın */}
        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>Sepete Ekle</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ... styles kısmı aynı kalacak ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 350, resizeMode: 'cover' },
  detailsContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  price: { fontSize: 28, color: '#28a745', fontWeight: 'bold', marginBottom: 20 },
  descriptionHeader: { fontSize: 18, fontWeight: 'bold', color: '#555', marginBottom: 10 },
  description: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 30 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});