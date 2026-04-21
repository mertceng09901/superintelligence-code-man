import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `https://superintelligence-code-man.onrender.com/api/products/${productId}`
      );
      // Backend { product: {...} } veya direkt {...} dönebilir, ikisini de handle ediyoruz
      setProduct(response.data.product || response.data);
    } catch (error) {
      console.log('Ürün detayı yüklenemedi:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Ürün bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: product.imageUrl || product.image || 'https://via.placeholder.com/300' }}
        style={styles.image}
      />

      <View style={styles.infoBox}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.model}>{product.model}</Text>
        <Text style={styles.price}>{product.price} ₺</Text>

        {product.specs && (
          <View style={styles.specs}>
            <Text style={styles.specsTitle}>Özellikler</Text>
            <Text style={styles.specItem}>💾 RAM: {product.specs.ram}</Text>
            <Text style={styles.specItem}>📦 Depolama: {product.specs.storage}</Text>
          </View>
        )}

        <Text style={styles.stock}>
          {product.stock > 0 ? `✅ Stokta: ${product.stock} adet` : '❌ Stok yok'}
        </Text>

        <TouchableOpacity style={styles.addToCart}>
          <Text style={styles.addToCartText}>Sepete Ekle</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 300, resizeMode: 'contain', backgroundColor: '#fff' },
  infoBox: { backgroundColor: '#fff', margin: 10, borderRadius: 12, padding: 16, elevation: 2 },
  brand: { fontSize: 14, color: '#888', marginBottom: 4 },
  model: { fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 8 },
  price: { fontSize: 26, fontWeight: 'bold', color: '#28a745', marginBottom: 16 },
  specs: { backgroundColor: '#f0f4ff', borderRadius: 8, padding: 12, marginBottom: 16 },
  specsTitle: { fontWeight: 'bold', fontSize: 15, marginBottom: 8, color: '#333' },
  specItem: { fontSize: 14, color: '#555', marginBottom: 4 },
  stock: { fontSize: 14, color: '#555', marginBottom: 20 },
  addToCart: {
    backgroundColor: '#007bff', borderRadius: 10,
    paddingVertical: 14, alignItems: 'center'
  },
  addToCartText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { fontSize: 16, color: 'gray' },
});