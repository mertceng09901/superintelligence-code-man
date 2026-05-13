import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, StatusBar, RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../config/api.native';
import { COLORS, SHADOWS, SIZES } from '../config/theme';

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [])
  );

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      const data = response.data;
      setCartItems(data.items || []);
      setTotalAmount(data.totalAmount || 0);
    } catch (error) {
      console.log('Sepet yükleme hatası:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    try {
      const response = await api.delete(`/cart/remove/${productId}`);
      setCartItems(response.data.items || []);
      setTotalAmount(response.data.totalAmount || 0);
    } catch (error) {
      Alert.alert('Hata', 'Ürün silinemedi.');
    } finally {
      setRemovingId(null);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('tr-TR').format(price);

  const renderCartItem = ({ item }) => {
    const product = item.product;
    if (!product) return null;

    return (
      <View style={[styles.cartItem, SHADOWS.small]}>
        <Image
          source={{ uri: product.imageUrl || 'https://via.placeholder.com/100' }}
          style={styles.itemImage}
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemBrand}>{product.brand}</Text>
          <Text style={styles.itemModel} numberOfLines={1}>{product.model}</Text>
          <View style={styles.itemPriceRow}>
            <Text style={styles.itemPrice}>{formatPrice(product.price)} ₺</Text>
            <View style={styles.quantityBadge}>
              <Text style={styles.quantityText}>x{item.quantity}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => handleRemove(product._id)}
          disabled={removingId === product._id}
        >
          {removingId === product._id ? (
            <ActivityIndicator size="small" color={COLORS.error} />
          ) : (
            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={COLORS.gradient} style={styles.header}>
        <Text style={styles.headerTitle}>Sepetim</Text>
        <Text style={styles.headerSub}>{cartItems.length} ürün</Text>
      </LinearGradient>

      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item, index) => item.product?._id || index.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCart(); }}
                colors={[COLORS.primary]} />
            }
          />

          {/* Bottom Bar */}
          <View style={[styles.bottomBar, SHADOWS.large]}>
            <View>
              <Text style={styles.totalLabel}>Toplam Tutar</Text>
              <Text style={styles.totalPrice}>{formatPrice(totalAmount)} ₺</Text>
            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Checkout')}>
              <LinearGradient colors={COLORS.gradientSecondary} style={styles.checkoutBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.checkoutText}>Siparişi Tamamla</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconBg}>
            <Ionicons name="cart-outline" size={64} color={COLORS.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Sepetiniz Boş</Text>
          <Text style={styles.emptySub}>Harika ürünlerimizi keşfetmeye başlayın!</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Mağaza')}>
            <LinearGradient colors={COLORS.gradient} style={styles.shopBtn}>
              <Ionicons name="bag-handle-outline" size={18} color="#FFF" />
              <Text style={styles.shopBtnText}>Alışverişe Başla</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  listContent: { padding: 16, paddingBottom: 120 },
  cartItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    borderRadius: SIZES.radius, padding: 12, marginBottom: 12,
  },
  itemImage: { width: 70, height: 70, borderRadius: 12, resizeMode: 'contain', backgroundColor: COLORS.background },
  itemInfo: { flex: 1, marginLeft: 14 },
  itemBrand: { fontSize: 11, color: COLORS.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  itemModel: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginTop: 2 },
  itemPriceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 },
  itemPrice: { fontSize: 16, fontWeight: '800', color: COLORS.secondary },
  quantityBadge: { backgroundColor: COLORS.background, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  quantityText: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
  removeBtn: { padding: 10 },
  bottomBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 18, backgroundColor: '#FFF',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },
  totalLabel: { fontSize: 12, color: COLORS.textMuted },
  totalPrice: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  checkoutBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 14, borderRadius: SIZES.radiusSm, gap: 6,
  },
  checkoutText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyIconBg: {
    width: 120, height: 120, borderRadius: 40, backgroundColor: COLORS.divider,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  emptySub: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginTop: 6, marginBottom: 24 },
  shopBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 28, paddingVertical: 14, borderRadius: SIZES.radiusSm, gap: 8,
  },
  shopBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});