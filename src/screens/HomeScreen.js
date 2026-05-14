import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity, StyleSheet,
  TextInput, ActivityIndicator, Animated, StatusBar, RefreshControl, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api.native';
import { COLORS, SHADOWS, SIZES } from '../config/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const BRANDS = ['Tümü', 'Apple', 'Samsung', 'Xiaomi', 'Google', 'OnePlus', 'Huawei'];

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Tümü');
  const [fromCache, setFromCache] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [search, selectedBrand, products]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      const data = response.data;
      setProducts(data.products || []);
      setFromCache(data.fromCache || false);
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    } catch (error) {
      console.log('Ürün yükleme hatası:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterProducts = () => {
    let result = products;
    if (selectedBrand !== 'Tümü') {
      result = result.filter(p => p.brand === selectedBrand);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.model?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR').format(price);
  };

  const renderBrandChip = (brand) => {
    const isActive = selectedBrand === brand;
    return (
      <TouchableOpacity key={brand} onPress={() => setSelectedBrand(brand)} activeOpacity={0.7}>
        {isActive ? (
          <LinearGradient colors={COLORS.gradient} style={styles.chipActive}>
            <Text style={styles.chipTextActive}>{brand}</Text>
          </LinearGradient>
        ) : (
          <View style={styles.chip}>
            <Text style={styles.chipText}>{brand}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderProduct = ({ item, index }) => {
    const animDelay = index * 100;
    return (
      <TouchableOpacity
        style={[styles.productCard, SHADOWS.medium]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.imageUrl || 'https://via.placeholder.com/200' }}
            style={styles.productImage}
          />
          {fromCache && (
            <View style={styles.cacheBadge}>
              <Ionicons name="flash" size={10} color="#FFF" />
              <Text style={styles.cacheBadgeText}>Hızlı</Text>
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.brandLabel}>{item.brand}</Text>
          <Text style={styles.modelText} numberOfLines={2}>{item.model}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>{formatPrice(item.price)} ₺</Text>
          </View>
          <View style={styles.stockRow}>
            <View style={[styles.stockDot, { backgroundColor: item.stock > 0 ? COLORS.success : COLORS.error }]} />
            <Text style={styles.stockText}>
              {item.stock > 0 ? 'Stokta' : 'Tükendi'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Ürünler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={COLORS.gradient} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Superintelligence</Text>
            <Text style={styles.headerSub}>{products.length} ürün listeleniyor</Text>
          </View>
          {fromCache && (
            <View style={styles.cacheIndicator}>
              <Ionicons name="flash" size={14} color={COLORS.warning} />
              <Text style={styles.cacheText}>Redis Cache</Text>
            </View>
          )}
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ürün veya marka ara..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </LinearGradient>

      {/* Brand Filters */}
      <View style={styles.chipContainer}>
        <FlatList
          horizontal
          data={BRANDS}
          renderItem={({ item }) => renderBrandChip(item)}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>

      {/* Products Grid */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          data={filtered}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.productList}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProducts(); }}
              colors={[COLORS.primary]} tintColor={COLORS.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>Ürün bulunamadı</Text>
              <Text style={styles.emptySubtext}>Farklı bir arama deneyin</Text>
            </View>
          }
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  loadingText: { marginTop: 12, color: COLORS.textSecondary, fontSize: 14 },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  cacheIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, gap: 4 },
  cacheText: { fontSize: 11, color: '#FFF', fontWeight: '600' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    borderRadius: SIZES.radiusSm, paddingHorizontal: 14, height: 46, gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text },
  chipContainer: { paddingVertical: 14 },
  chip: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#FFF', marginRight: 8, borderWidth: 1, borderColor: COLORS.border,
  },
  chipActive: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  chipText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  chipTextActive: { fontSize: 13, color: '#FFF', fontWeight: '600' },
  productList: { paddingHorizontal: 16, paddingBottom: 100 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 14 },
  productCard: {
    width: CARD_WIDTH, backgroundColor: '#FFF', borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  imageContainer: {
    backgroundColor: '#F8F9FE', padding: 12, alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  productImage: { width: CARD_WIDTH - 40, height: 120, resizeMode: 'contain' },
  cacheBadge: {
    position: 'absolute', top: 8, right: 8,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.warning, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, gap: 2,
  },
  cacheBadgeText: { fontSize: 9, color: '#FFF', fontWeight: '700' },
  productInfo: { padding: 12 },
  brandLabel: { fontSize: 11, color: COLORS.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  modelText: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginTop: 4, height: 36 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  priceText: { fontSize: 17, fontWeight: '800', color: COLORS.secondary },
  stockRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  stockDot: { width: 6, height: 6, borderRadius: 3 },
  stockText: { fontSize: 11, color: COLORS.textMuted },
  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 18, fontWeight: '600', color: COLORS.text, marginTop: 16 },
  emptySubtext: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
});