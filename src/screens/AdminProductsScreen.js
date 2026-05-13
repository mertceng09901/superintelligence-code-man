import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, StatusBar, Image, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../config/api.native';
import { COLORS, SHADOWS, SIZES } from '../config/theme';

export default function AdminProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useFocusEffect(useCallback(() => { fetchProducts(); }, []));

  const fetchProducts = async () => {
    try {
      const res = await api.get('/seller/products');
      setProducts(res.data?.products || []);
    } catch (e) { console.log('Ürün hatası:', e.message); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const handleDelete = (id, name) => {
    Alert.alert('Ürün Sil', `"${name}" silinecek. Emin misiniz?`, [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => deleteProduct(id) },
    ]);
  };

  const deleteProduct = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/seller/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      Alert.alert('✅ Başarılı', 'Ürün silindi.');
    } catch (e) { Alert.alert('Hata', 'Ürün silinemedi.'); }
    finally { setDeletingId(null); }
  };

  const fmt = (p) => new Intl.NumberFormat('tr-TR').format(p);

  const renderProduct = ({ item }) => (
    <View style={[styles.card, SHADOWS.small]}>
      <Image source={{ uri: item.imageUrl || 'https://via.placeholder.com/80' }} style={styles.thumb} />
      <View style={styles.info}>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.model} numberOfLines={1}>{item.model}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.price}>{fmt(item.price)} ₺</Text>
          <View style={[styles.stockBadge, { backgroundColor: item.stock > 0 ? COLORS.success + '18' : COLORS.error + '18' }]}>
            <Text style={[styles.stockText, { color: item.stock > 0 ? COLORS.success : COLORS.error }]}>Stok: {item.stock}</Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('AddEditProduct', { product: item })}>
          <Ionicons name="create-outline" size={18} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item._id, item.model)} disabled={deletingId === item._id}>
          {deletingId === item._id ? <ActivityIndicator size="small" color={COLORS.error} /> : <Ionicons name="trash-outline" size={18} color={COLORS.error} />}
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={COLORS.gradient} style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Ürün Yönetimi</Text>
          <Text style={styles.headerSub}>{products.length} ürün</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddEditProduct', { product: null })}>
          <Ionicons name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </LinearGradient>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProducts(); }} colors={[COLORS.primary]} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="cube-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Henüz ürün yok</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  addBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, paddingBottom: 100 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: SIZES.radius, padding: 12, marginBottom: 10 },
  thumb: { width: 60, height: 60, borderRadius: 12, resizeMode: 'contain', backgroundColor: COLORS.background },
  info: { flex: 1, marginLeft: 12 },
  brand: { fontSize: 11, color: COLORS.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  model: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  price: { fontSize: 15, fontWeight: '800', color: COLORS.secondary },
  stockBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  stockText: { fontSize: 11, fontWeight: '600' },
  actions: { flexDirection: 'column', gap: 6 },
  editBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.primary + '12', justifyContent: 'center', alignItems: 'center' },
  deleteBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.error + '12', justifyContent: 'center', alignItems: 'center' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 18, fontWeight: '600', color: COLORS.textMuted, marginTop: 16 },
});
