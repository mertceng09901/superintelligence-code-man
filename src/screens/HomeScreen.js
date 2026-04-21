import axios from 'axios';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://superintelligence-code-man.onrender.com/api/products');
      if (response.data && response.data.products) {
        setProducts(response.data.products);
      } else {
        console.log("Veri yapısı beklenenden farklı geldi!");
      }
    } catch (error) {
      console.log("Hata:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetail', { productId: item._id })} // ✅ sadece ID
    >
      <Image 
        source={{ uri: item.imageUrl || item.image || 'https://via.placeholder.com/150' }} 
        style={styles.img} 
      />
      <Text style={styles.name} numberOfLines={2}>{item.model}</Text>
      <Text style={styles.price}>{item.price} ₺</Text>
    </TouchableOpacity>
  );

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#007bff" /></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.empty}>Ürünler yüklenemedi, veriyi kontrol et.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 5 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { 
    flex: 1, backgroundColor: '#fff', margin: 5, padding: 10, 
    borderRadius: 12, alignItems: 'center', elevation: 3 
  },
  img: { width: 120, height: 120, borderRadius: 8, resizeMode: 'contain' },
  name: { fontWeight: 'bold', marginTop: 8, textAlign: 'center', fontSize: 14, height: 35 },
  price: { color: '#28a745', fontWeight: 'bold', marginTop: 5, fontSize: 16 },
  empty: { textAlign: 'center', marginTop: 50, color: 'gray' }
});