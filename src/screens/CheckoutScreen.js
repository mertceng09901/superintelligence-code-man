import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, StatusBar, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api.native';
import { COLORS, SHADOWS, SIZES } from '../config/theme';

export default function CheckoutScreen({ navigation }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');

  // Kredi Kartı State'leri
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handleCardNumberChange = (text) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardNumber(formatted.substring(0, 19));
  };

  const handleExpiryChange = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      setExpiry(`${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`);
    } else {
      setExpiry(cleaned);
    }
  };

  useEffect(() => { fetchSummary(); }, []);

  const fetchSummary = async () => {
    try {
      const res = await api.get('/orders/checkout-summary');
      setSummary(res.data);
    } catch (e) { Alert.alert('Hata', 'Özet yüklenemedi.'); }
    finally { setLoading(false); }
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) { Alert.alert('Uyarı', 'Lütfen teslimat adresini girin.'); return; }
    
    if (paymentMethod === 'CREDIT_CARD') {
      if (!cardName.trim() || !cardNumber.trim() || !expiry.trim() || !cvv.trim()) {
        Alert.alert('Uyarı', 'Lütfen kredi kartı bilgilerini eksiksiz girin.');
        return;
      }
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        Alert.alert('Uyarı', 'Lütfen 16 haneli geçerli bir kart numarası girin.');
        return;
      }
    }

    setPlacing(true);
    try {
      const res = await api.post('/orders', { shippingAddress: address, paymentMethod });
      Alert.alert('🎉 Sipariş Alındı!',
        `No: ${res.data.orderId}\nToplam: ${fmt(res.data.totalAmount)} ₺\n\nRabbitMQ kuyruğuna gönderildi!`,
        [{ text: 'Tamam', onPress: () => navigation.navigate('Mağaza') }]);
    } catch (e) { Alert.alert('Hata', e.response?.data?.message || 'Sipariş oluşturulamadı.'); }
    finally { setPlacing(false); }
  };

  const fmt = (p) => new Intl.NumberFormat('tr-TR').format(p);

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={COLORS.gradientSecondary} style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#FFF" /></TouchableOpacity>
        <Text style={s.headerTitle}>Sipariş Tamamla</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Order Items */}
        <View style={[s.card, SHADOWS.small]}>
          <View style={s.cardHead}><Ionicons name="receipt-outline" size={20} color={COLORS.primary} /><Text style={s.cardTitle}>Sipariş Özeti</Text></View>
          {summary?.items?.map((item, i) => (
            <View key={i} style={s.row}>
              <Image source={{ uri: item.product?.imageUrl || 'https://via.placeholder.com/50' }} style={s.thumb} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.itemName} numberOfLines={1}>{item.product?.brand} {item.product?.model}</Text>
                <Text style={s.itemQty}>Adet: {item.quantity}</Text>
              </View>
              <Text style={s.itemTotal}>{fmt((item.product?.price || 0) * item.quantity)} ₺</Text>
            </View>
          ))}
          <View style={s.divider} />
          <View style={s.totalRow}><Text style={s.totalLbl}>Toplam</Text><Text style={s.totalVal}>{fmt(summary?.totalAmount || 0)} ₺</Text></View>
        </View>

        {/* Address */}
        <View style={[s.card, SHADOWS.small]}>
          <View style={s.cardHead}><Ionicons name="location-outline" size={20} color={COLORS.secondary} /><Text style={s.cardTitle}>Teslimat Adresi</Text></View>
          <TextInput style={s.addrInput} placeholder="Adresinizi girin..." placeholderTextColor={COLORS.textMuted}
            value={address} onChangeText={setAddress} multiline numberOfLines={3} textAlignVertical="top" />
        </View>

        {/* Payment */}
        <View style={[s.card, SHADOWS.small]}>
          <View style={s.cardHead}><Ionicons name="wallet-outline" size={20} color={COLORS.warning} /><Text style={s.cardTitle}>Ödeme</Text></View>
          {[{ id: 'CREDIT_CARD', lbl: 'Kredi Kartı', ic: 'card-outline' }, { id: 'CASH', lbl: 'Kapıda Ödeme', ic: 'cash-outline' }].map(o => (
            <View key={o.id}>
              <TouchableOpacity style={[s.payOpt, paymentMethod === o.id && s.payOptActive]} onPress={() => setPaymentMethod(o.id)}>
                <Ionicons name={o.ic} size={22} color={paymentMethod === o.id ? COLORS.primary : COLORS.textMuted} />
                <Text style={[s.payLbl, paymentMethod === o.id && { color: COLORS.text, fontWeight: '600' }]}>{o.lbl}</Text>
                <View style={[s.radio, paymentMethod === o.id && s.radioA]}>{paymentMethod === o.id && <View style={s.radioDot} />}</View>
              </TouchableOpacity>
              
              {/* Kredi Kartı Formu */}
              {o.id === 'CREDIT_CARD' && paymentMethod === 'CREDIT_CARD' && (
                <View style={s.cardForm}>
                  <TextInput style={s.cardInput} placeholder="Kart Üzerindeki İsim" placeholderTextColor={COLORS.textMuted} value={cardName} onChangeText={setCardName} autoCapitalize="words" />
                  <TextInput style={s.cardInput} placeholder="Kart Numarası" placeholderTextColor={COLORS.textMuted} value={cardNumber} onChangeText={handleCardNumberChange} keyboardType="numeric" maxLength={19} />
                  <View style={s.cardRow}>
                    <TextInput style={[s.cardInput, { flex: 1, marginRight: 8 }]} placeholder="AA/YY" placeholderTextColor={COLORS.textMuted} value={expiry} onChangeText={handleExpiryChange} keyboardType="numeric" maxLength={5} />
                    <TextInput style={[s.cardInput, { flex: 1, marginLeft: 8 }]} placeholder="CVV" placeholderTextColor={COLORS.textMuted} value={cvv} onChangeText={setCvv} keyboardType="numeric" maxLength={3} secureTextEntry />
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={s.infoBox}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.info} />
          <Text style={s.infoTxt}>Sipariş RabbitMQ kuyruğu üzerinden işlenecek ve Redis cache güncellenecektir.</Text>
        </View>
      </ScrollView>

      <View style={[s.bottom, SHADOWS.large]}>
        <TouchableOpacity onPress={handlePlaceOrder} disabled={placing} activeOpacity={0.8} style={{ flex: 1 }}>
          <LinearGradient colors={COLORS.gradientSecondary} style={s.orderBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            {placing ? <ActivityIndicator color="#FFF" /> : <><Ionicons name="checkmark-circle" size={20} color="#FFF" /><Text style={s.orderTxt}>Onayla — {fmt(summary?.totalAmount || 0)} ₺</Text></>}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingBottom: 18, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 14, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  scroll: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: '#FFF', borderRadius: SIZES.radius, padding: 18, marginBottom: 14 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  thumb: { width: 44, height: 44, borderRadius: 10, resizeMode: 'contain', backgroundColor: COLORS.background },
  itemName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  itemQty: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  itemTotal: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalLbl: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  totalVal: { fontSize: 18, fontWeight: '800', color: COLORS.secondary },
  addrInput: { backgroundColor: COLORS.inputBg, borderRadius: SIZES.radiusSm, padding: 14, fontSize: 14, color: COLORS.text, minHeight: 80, borderWidth: 1, borderColor: COLORS.border },
  payOpt: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: SIZES.radiusSm, marginBottom: 8, borderWidth: 1.5, borderColor: COLORS.border },
  payOptActive: { borderColor: COLORS.primary, backgroundColor: 'rgba(108,99,255,0.05)' },
  payLbl: { flex: 1, fontSize: 15, color: COLORS.textSecondary },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  radioA: { borderColor: COLORS.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  cardForm: { backgroundColor: 'rgba(108,99,255,0.03)', padding: 12, borderRadius: SIZES.radiusSm, borderWidth: 1, borderColor: 'rgba(108,99,255,0.1)', marginBottom: 8, marginTop: -4 },
  cardInput: { backgroundColor: '#FFF', borderRadius: SIZES.radiusSm, padding: 12, fontSize: 14, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border, marginBottom: 10 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: 'rgba(59,130,246,0.08)', borderRadius: SIZES.radiusSm, padding: 14, marginBottom: 16 },
  infoTxt: { flex: 1, fontSize: 12, color: COLORS.info, lineHeight: 18 },
  bottom: { paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  orderBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: SIZES.radiusSm, paddingVertical: 16, gap: 8 },
  orderTxt: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
