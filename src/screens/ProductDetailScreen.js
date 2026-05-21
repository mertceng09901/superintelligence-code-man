import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet,
  TouchableOpacity, Alert, ActivityIndicator, StatusBar,
  Dimensions, FlatList, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api.native';
import { COLORS, SHADOWS, SIZES } from '../config/theme';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

// ─── Yıldız Bileşeni ───────────────────────────────────────────────────────
function StarRow({ rating, size = 18, interactive = false, onSelect }) {
  return (
    <View style={{ flexDirection: 'row', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <TouchableOpacity key={i} onPress={() => interactive && onSelect && onSelect(i)} disabled={!interactive}>
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={size}
            color={i <= rating ? '#F59E0B' : '#D1D5DB'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Resim Carousel ────────────────────────────────────────────────────────
function ImageCarousel({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  if (!images || images.length === 0) return null;
  const onScroll = (e) => setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={carousel.slide}>
            <Image source={{ uri: item }} style={carousel.image} resizeMode="contain" />
          </View>
        )}
      />
      <View style={carousel.dots}>
        {images.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => { flatListRef.current?.scrollToIndex({ index: i, animated: true }); setActiveIndex(i); }}>
            <View style={[carousel.dot, i === activeIndex && carousel.dotActive]} />
          </TouchableOpacity>
        ))}
      </View>
      <View style={carousel.counter}>
        <Text style={carousel.counterText}>{activeIndex + 1} / {images.length}</Text>
      </View>
    </View>
  );
}
const carousel = StyleSheet.create({
  slide: { width, backgroundColor: '#FFF', paddingVertical: 40, paddingTop: 90, alignItems: 'center' },
  image: { width: width * 0.7, height: 260 },
  dots: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 16, gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#D1D5DB' },
  dotActive: { width: 20, backgroundColor: COLORS.primary },
  counter: { position: 'absolute', top: 56, right: 16, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  counterText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
});

// ─── Ana Ekran ─────────────────────────────────────────────────────────────
export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();

  // Yorumlar
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  // AI Sohbet
  const [chatMessages, setChatMessages] = useState([
    { from: 'seller', text: 'Merhaba! 👋 Bu ürün hakkında merak ettiklerinizi sorabilirsiniz. Size yardımcı olmaktan memnuniyet duyarım.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const chatScrollRef = useRef(null);

  useEffect(() => { fetchProduct(); }, []);
  useEffect(() => { if (productId) fetchReviews(); }, [productId]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${productId}`);
      setProduct(res.data.product || res.data);
    } catch (e) { console.log('Ürün yüklenemedi:', e.message); }
    finally { setLoading(false); }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/${productId}`);
      setReviews(res.data.reviews || []);
      setAvgRating(res.data.avgRating || 0);
      setTotalReviews(res.data.totalReviews || 0);
    } catch (e) { console.log('Yorumlar yüklenemedi:', e.message); }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await api.post('/cart/add', { productId: product._id, quantity, selectedColor: 'Standart' });
      Alert.alert('✅ Başarılı', `${product.model} sepete eklendi!`, [
        { text: 'Alışverişe Devam', style: 'cancel' },
        { text: 'Sepete Git', onPress: () => navigation.navigate('UserHome', { screen: 'Sepet' }) },
      ]);
    } catch (e) {
      Alert.alert('Hata', e.response?.data?.message || 'Sepete eklenemedi.');
    } finally { setAddingToCart(false); }
  };

  const handleSubmitReview = async () => {
    if (!myRating) return Alert.alert('Uyarı', 'Lütfen bir puan seçin.');
    if (!myComment.trim()) return Alert.alert('Uyarı', 'Lütfen bir yorum yazın.');
    setSubmittingReview(true);
    try {
      if (editingReviewId) {
        await api.put(`/reviews/${editingReviewId}`, { rating: myRating, comment: myComment });
        Alert.alert('✅', 'Yorumunuz güncellendi!');
      } else {
        await api.post(`/reviews/${productId}`, { rating: myRating, comment: myComment });
        Alert.alert('✅', 'Yorumunuz eklendi!');
      }
      setMyRating(0);
      setMyComment('');
      setEditingReviewId(null);
      setShowReviewForm(false);
      await fetchReviews();
    } catch (e) {
      Alert.alert('Hata', e.response?.data?.message || 'İşlem başarısız.');
    } finally { setSubmittingReview(false); }
  };

  const handleEditReview = (r) => {
    setMyRating(r.rating);
    setMyComment(r.comment);
    setEditingReviewId(r._id);
    setShowReviewForm(true);
  };

  const handleDeleteReview = (reviewId) => {
    Alert.alert('Emin misiniz?', 'Yorumunuzu silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/reviews/${reviewId}`);
            Alert.alert('✅', 'Yorum silindi.');
            await fetchReviews();
          } catch (e) {
            Alert.alert('Hata', 'Silinirken hata oluştu.');
          }
      }}
    ]);
  };

  const handleSendChat = async () => {
    const msg = chatInput.trim();
    if (!msg || aiLoading) return;
    setChatInput('');
    setChatMessages(prev => [...prev, { from: 'user', text: msg }]);
    setAiLoading(true);
    try {
      const res = await api.post('/ai/seller-chat', {
        message: msg,
        productName: product?.model,
        productBrand: product?.brand,
        productPrice: product?.price,
        productSpecs: product?.specs,
      });
      setChatMessages(prev => [...prev, { from: 'seller', text: res.data.reply }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { from: 'seller', text: 'Şu an cevap veremiyorum, lütfen daha sonra tekrar deneyin.' }]);
    } finally {
      setAiLoading(false);
      setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 200);
    }
  };

  const formatPrice = (p) => new Intl.NumberFormat('tr-TR').format(p);

  if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  if (!product) return (
    <View style={styles.loadingContainer}>
      <Ionicons name="alert-circle-outline" size={64} color={COLORS.textMuted} />
      <Text style={styles.errorText}>Ürün bulunamadı</Text>
    </View>
  );

  const images = product.images?.length > 0 ? product.images : product.imageUrl ? [product.imageUrl] : [];

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Geri Butonu */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <View style={styles.backBtnCircle}>
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </View>
        </TouchableOpacity>

        {/* Carousel */}
        <View style={styles.imageSection}>
          <ImageCarousel images={images} />
        </View>

        {/* Ürün Bilgileri */}
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

          {/* Ortalama Puan */}
          {totalReviews > 0 && (
            <View style={styles.ratingRow}>
              <StarRow rating={Math.round(avgRating)} size={16} />
              <Text style={styles.ratingText}>{avgRating} ({totalReviews} yorum)</Text>
            </View>
          )}

          <Text style={styles.priceText}>{formatPrice(product.price)} ₺</Text>

          {/* Teknik Özellikler */}
          {product.specs && (
            <View style={styles.specsCard}>
              <Text style={styles.specsTitle}>Teknik Özellikler</Text>
              <View style={styles.specsGrid}>
                <View style={styles.specItem}>
                  <View style={styles.specIconBg}><Ionicons name="hardware-chip-outline" size={20} color={COLORS.primary} /></View>
                  <View><Text style={styles.specLabel}>RAM</Text><Text style={styles.specValue}>{product.specs.ram}</Text></View>
                </View>
                <View style={styles.specItem}>
                  <View style={styles.specIconBg}><Ionicons name="server-outline" size={20} color={COLORS.secondary} /></View>
                  <View><Text style={styles.specLabel}>Depolama</Text><Text style={styles.specValue}>{product.specs.storage}</Text></View>
                </View>
              </View>
            </View>
          )}

          {/* Adet */}
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

          {/* ── SATICIYLA SOHBET ── */}
          <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowChat(v => !v)}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.aiIconBg}>
                <Ionicons name="chatbubbles" size={20} color="#FFF" />
              </View>
              <Text style={styles.sectionHeaderText}>Satıcıya Sor</Text>
            </View>
            <Ionicons name={showChat ? 'chevron-up' : 'chevron-down'} size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          {showChat && (
            <View style={styles.chatContainer}>
              <ScrollView ref={chatScrollRef} style={styles.chatScroll} showsVerticalScrollIndicator={false} onContentSizeChange={() => chatScrollRef.current?.scrollToEnd({ animated: true })}>
                {chatMessages.map((msg, i) => (
                  <View key={i} style={[styles.chatBubble, msg.from === 'user' ? styles.chatUser : styles.chatSeller]}>
                    {msg.from === 'seller' && (
                      <View style={styles.sellerAvatar}>
                        <Ionicons name="storefront" size={14} color={COLORS.primary} />
                      </View>
                    )}
                    <View style={[styles.bubbleBox, msg.from === 'user' ? styles.bubbleUser : styles.bubbleSeller]}>
                      <Text style={[styles.bubbleText, msg.from === 'user' && { color: '#FFF' }]}>{msg.text}</Text>
                    </View>
                  </View>
                ))}
                {aiLoading && (
                  <View style={[styles.chatBubble, styles.chatSeller]}>
                    <View style={styles.sellerAvatar}><Ionicons name="storefront" size={14} color={COLORS.primary} /></View>
                    <View style={styles.bubbleSeller}>
                      <ActivityIndicator size="small" color={COLORS.primary} />
                    </View>
                  </View>
                )}
              </ScrollView>
              <View style={styles.chatInputRow}>
                <TextInput
                  style={styles.chatInput}
                  placeholder="Bir soru sorun..."
                  placeholderTextColor={COLORS.textMuted}
                  value={chatInput}
                  onChangeText={setChatInput}
                  onSubmitEditing={handleSendChat}
                  returnKeyType="send"
                />
                <TouchableOpacity style={styles.chatSendBtn} onPress={handleSendChat} disabled={aiLoading}>
                  <LinearGradient colors={COLORS.gradient} style={styles.chatSendGradient}>
                    <Ionicons name="send" size={18} color="#FFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ── YORUMLAR ── */}
          <TouchableOpacity style={[styles.sectionHeader, { marginTop: 8 }]} onPress={() => setShowReviewForm(v => !v)}>
            <View style={styles.sectionHeaderLeft}>
              <View style={[styles.aiIconBg, { backgroundColor: '#F59E0B' }]}>
                <Ionicons name="star" size={18} color="#FFF" />
              </View>
              <Text style={styles.sectionHeaderText}>Değerlendirme Yap</Text>
            </View>
            <Ionicons name={showReviewForm ? 'chevron-up' : 'chevron-down'} size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          {showReviewForm && (
            <View style={styles.reviewFormCard}>
              <Text style={styles.reviewFormLabel}>Puanınız</Text>
              <StarRow rating={myRating} size={32} interactive onSelect={setMyRating} />
              <TextInput
                style={styles.reviewInput}
                placeholder="Ürün hakkında düşüncelerinizi yazın..."
                placeholderTextColor={COLORS.textMuted}
                value={myComment}
                onChangeText={setMyComment}
                multiline
                numberOfLines={3}
                maxLength={500}
              />
              <TouchableOpacity onPress={handleSubmitReview} disabled={submittingReview} activeOpacity={0.8}>
                <LinearGradient colors={COLORS.gradient} style={styles.reviewSubmitBtn}>
                  {submittingReview
                    ? <ActivityIndicator color="#FFF" />
                    : <Text style={styles.reviewSubmitText}>Yorumu Gönder</Text>}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Yorum Listesi */}
          {reviews.length > 0 && (
            <View style={styles.reviewsSection}>
              <Text style={styles.reviewsTitle}>Kullanıcı Yorumları ({totalReviews})</Text>
              {reviews.map((r, i) => {
                const isMyReview = user?._id === r.user;
                const isAdmin = user?.role === 'ADMIN';
                return (
                  <View key={i} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewAvatar}>
                        <Text style={styles.reviewAvatarText}>{r.userName?.charAt(0)?.toUpperCase()}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.reviewName}>{r.userName}</Text>
                        <StarRow rating={r.rating} size={13} />
                      </View>
                      <Text style={styles.reviewDate}>{new Date(r.createdAt).toLocaleDateString('tr-TR')}</Text>
                    </View>
                    <Text style={styles.reviewComment}>{r.comment}</Text>
                    
                    {(isMyReview || isAdmin) && (
                      <View style={styles.reviewActions}>
                        {isMyReview && (
                          <TouchableOpacity style={styles.reviewActionBtn} onPress={() => handleEditReview(r)}>
                            <Ionicons name="pencil-outline" size={16} color={COLORS.primary} />
                            <Text style={[styles.reviewActionText, { color: COLORS.primary }]}>Düzenle</Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity style={styles.reviewActionBtn} onPress={() => handleDeleteReview(r._id)}>
                          <Ionicons name="trash-outline" size={16} color={COLORS.error} />
                          <Text style={[styles.reviewActionText, { color: COLORS.error }]}>Sil</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Alt Çubuk */}
      <View style={[styles.bottomBar, SHADOWS.large]}>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Toplam</Text>
          <Text style={styles.totalPrice}>{formatPrice(product.price * quantity)} ₺</Text>
        </View>
        <TouchableOpacity onPress={handleAddToCart} disabled={addingToCart || product.stock === 0} activeOpacity={0.8} style={{ flex: 1 }}>
          <LinearGradient
            colors={product.stock > 0 ? COLORS.gradient : ['#D1D5DB', '#9CA3AF']}
            style={styles.addToCartBtn}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            {addingToCart ? <ActivityIndicator color="#FFF" /> : (
              <><Ionicons name="cart-outline" size={20} color="#FFF" /><Text style={styles.addToCartText}>Sepete Ekle</Text></>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  errorText: { fontSize: 16, color: COLORS.textMuted, marginTop: 12 },
  backBtn: { position: 'absolute', top: 50, left: 16, zIndex: 10 },
  backBtnCircle: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
  imageSection: { backgroundColor: '#FFF', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, ...SHADOWS.small, overflow: 'hidden' },
  infoSection: { padding: 20 },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  brandBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  brandText: { color: '#FFF', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  stockBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 4 },
  stockDot: { width: 6, height: 6, borderRadius: 3 },
  stockText: { fontSize: 12, fontWeight: '600' },
  modelTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  ratingText: { fontSize: 13, color: COLORS.textMuted },
  priceText: { fontSize: 30, fontWeight: '800', color: COLORS.secondary, marginBottom: 20 },
  specsCard: { backgroundColor: '#FFF', borderRadius: SIZES.radius, padding: 18, marginBottom: 16, ...SHADOWS.small },
  specsTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 14 },
  specsGrid: { flexDirection: 'row', gap: 16 },
  specItem: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  specIconBg: { width: 42, height: 42, borderRadius: 12, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  specLabel: { fontSize: 12, color: COLORS.textMuted },
  specValue: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  quantitySection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderRadius: SIZES.radius, padding: 18, ...SHADOWS.small, marginBottom: 16 },
  quantityLabel: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  quantitySelector: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  qtyBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  qtyText: { fontSize: 18, fontWeight: '700', color: COLORS.text, minWidth: 24, textAlign: 'center' },
  // Section Headers
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderRadius: SIZES.radius, padding: 16, marginBottom: 8, ...SHADOWS.small },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sectionHeaderText: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  aiIconBg: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  // Chat
  chatContainer: { backgroundColor: '#FFF', borderRadius: SIZES.radius, marginBottom: 12, ...SHADOWS.small, overflow: 'hidden' },
  chatScroll: { maxHeight: 280, padding: 12 },
  chatBubble: { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-end' },
  chatUser: { justifyContent: 'flex-end' },
  chatSeller: { justifyContent: 'flex-start' },
  sellerAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#EDE9FE', justifyContent: 'center', alignItems: 'center', marginRight: 6 },
  bubbleBox: { maxWidth: width * 0.65 },
  bubbleSeller: { backgroundColor: '#F3F4F6', borderRadius: 16, borderBottomLeftRadius: 4, padding: 10 },
  bubbleUser: { backgroundColor: COLORS.primary, borderRadius: 16, borderBottomRightRadius: 4, padding: 10 },
  bubbleText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  chatInputRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F3F4F6', padding: 10, gap: 8 },
  chatInput: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, fontSize: 14, color: COLORS.text },
  chatSendBtn: { borderRadius: 20 },
  chatSendGradient: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
  // Review Form
  reviewFormCard: { backgroundColor: '#FFF', borderRadius: SIZES.radius, padding: 16, marginBottom: 12, ...SHADOWS.small, gap: 12 },
  reviewFormLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  reviewInput: { backgroundColor: COLORS.background, borderRadius: 12, padding: 12, fontSize: 14, color: COLORS.text, minHeight: 80, textAlignVertical: 'top' },
  reviewSubmitBtn: { borderRadius: SIZES.radiusSm, paddingVertical: 13, alignItems: 'center' },
  reviewSubmitText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  // Review List
  reviewsSection: { marginBottom: 12 },
  reviewsTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  reviewCard: { backgroundColor: '#FFF', borderRadius: SIZES.radius, padding: 14, marginBottom: 10, ...SHADOWS.small },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  reviewAvatarText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  reviewName: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  reviewDate: { fontSize: 11, color: COLORS.textMuted },
  reviewComment: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  reviewActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 16, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  reviewActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  reviewActionText: { fontSize: 13, fontWeight: '600' },
  // Bottom Bar
  bottomBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, gap: 16 },
  totalSection: {},
  totalLabel: { fontSize: 12, color: COLORS.textMuted },
  totalPrice: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  addToCartBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: SIZES.radiusSm, paddingVertical: 15, gap: 8 },
  addToCartText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});