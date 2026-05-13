import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet,
  TouchableOpacity, Alert, ActivityIndicator, StatusBar, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api.native';
import { COLORS, SHADOWS, SIZES } from '../config/theme';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${productId}`);
      setProduct(response.data.product || response.data);
    } catch (error) {
      console.log('Ürün detayı yüklenemedi:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await api.post('/cart/add', {
        productId: product._id,
        quantity,
        selectedColor: 'Standart'
      });
      Alert.alert('✅ Başarılı', `${product.model} sepete eklendi!`, [
        { text: 'Alışverişe Devam', style: 'cancel' },
        { text: 'Sepete Git', onPress: () => navigation.navigate('Sepet') },
      ]);
    } catch (error) {
      const msg = error.response?.data?.message || 'Sepete eklenemedi.';
      Alert.alert('Hata', msg);
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('tr-TR').format(price);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.textMuted} />
        <Text style={styles.errorText}>Ürün bulunamadı</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <View style={styles.backBtnCircle}>
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </View>
        </TouchableOpacity>

        {/* Product Image */}
        <View style={styles.imageSection}>
          <Image
            source={{ uri: product.imageUrl || 'https://via.placeholder.com/400' }}
            style={styles.productImage}
          />
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <View style={styles.brandRow}>
            <LinearGradient colors={COLORS.gradient} style={styles.brandBadge}>
              <Text style={styles.brandText}>{product.brand}</Text>
            </LinearGradient>
            <View style={[styles.stockBadge, { backgroundColor: product.stock > 0 ? '#ECFDF5' : '#FEF2F2' }]}>
              <View style={[styles.stockDot, { backgroundColor: product.stock > 0 ? COLORS.success : COLORS.error }]} />
              <Text style={[styles.stockText, { color: product.stock > 0 ? COLORS.success : COLORS.error }]}>
                {product.stock > 0 ? `${product.stock} adet stokta` : 'Stok tükendi'}
              </Text>
            </View>
          </View>

          <Text style={styles.modelTitle}>{product.model}</Text>

          <Text style={styles.priceText}>{formatPrice(product.price)} ₺</Text>

          {/* Specs */}
          {product.specs && (
            <View style={styles.specsCard}>
              <Text style={styles.specsTitle}>Teknik Özellikler</Text>
              <View style={styles.specsGrid}>
                <View style={styles.specItem}>
                  <View style={styles.specIconBg}>
                    <Ionicons name="hardware-chip-outline" size={20} color={COLORS.primary} />
                  </View>
                  <View>
                    <Text style={styles.specLabel}>RAM</Text>
                    <Text style={styles.specValue}>{product.specs.ram}</Text>
                  </View>
                </View>
                <View style={styles.specItem}>
                  <View style={styles.specIconBg}>
                    <Ionicons name="server-outline" size={20} color={COLORS.secondary} />
                  </View>
                  <View>
                    <Text style={styles.specLabel}>Depolama</Text>
                    <Text style={styles.specValue}>{product.specs.storage}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Adet</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                <Ionicons name="remove" size={20} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(quantity + 1)}>
                <Ionicons name="add" size={20} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomBar, SHADOWS.large]}>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Toplam</Text>
          <Text style={styles.totalPrice}>{formatPrice(product.price * quantity)} ₺</Text>
        </View>
        <TouchableOpacity
          onPress={handleAddToCart}
          disabled={addingToCart || product.stock === 0}
          activeOpacity={0.8}
          style={{ flex: 1 }}
        >
          <LinearGradient
            colors={product.stock > 0 ? COLORS.gradient : ['#D1D5DB', '#9CA3AF']}
            style={styles.addToCartBtn}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            {addingToCart ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="cart-outline" size={20} color="#FFF" />
                <Text style={styles.addToCartText}>Sepete Ekle</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  errorText: { fontSize: 16, color: COLORS.textMuted, marginTop: 12 },
  backBtn: { position: 'absolute', top: 50, left: 16, zIndex: 10 },
  backBtnCircle: {
    width: 40, height: 40, borderRadius: 14, backgroundColor: '#FFF',
    justifyContent: 'center', alignItems: 'center', ...SHADOWS.small,
  },
  imageSection: {
    backgroundColor: '#FFF', paddingVertical: 40, paddingTop: 80, alignItems: 'center',
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32, ...SHADOWS.small,
  },
  productImage: { width: width * 0.65, height: 260, resizeMode: 'contain' },
  infoSection: { padding: 20 },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  brandBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  brandText: { color: '#FFF', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  stockBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 4 },
  stockDot: { width: 6, height: 6, borderRadius: 3 },
  stockText: { fontSize: 12, fontWeight: '600' },
  modelTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  priceText: { fontSize: 30, fontWeight: '800', color: COLORS.secondary, marginBottom: 20 },
  specsCard: {
    backgroundColor: '#FFF', borderRadius: SIZES.radius, padding: 18,
    marginBottom: 16, ...SHADOWS.small,
  },
  specsTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 14 },
  specsGrid: { flexDirection: 'row', gap: 16 },
  specItem: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  specIconBg: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: COLORS.background,
    justifyContent: 'center', alignItems: 'center',
  },
  specLabel: { fontSize: 12, color: COLORS.textMuted },
  specValue: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  quantitySection: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: SIZES.radius, padding: 18, ...SHADOWS.small,
  },
  quantityLabel: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  quantitySelector: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  qtyBtn: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.background,
    justifyContent: 'center', alignItems: 'center',
  },
  qtyText: { fontSize: 18, fontWeight: '700', color: COLORS.text, minWidth: 24, textAlign: 'center' },
  bottomBar: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20,
    paddingVertical: 16, backgroundColor: '#FFF',
    borderTopLeftRadius: 24, borderTopRightRadius: 24, gap: 16,
  },
  totalSection: {},
  totalLabel: { fontSize: 12, color: COLORS.textMuted },
  totalPrice: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  addToCartBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: SIZES.radiusSm, paddingVertical: 15, gap: 8,
  },
  addToCartText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});