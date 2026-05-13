import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../config/api.native';
import { COLORS, SHADOWS, SIZES } from '../config/theme';

const STATUS_MAP = {
  PENDING: { label: 'Beklemede', color: COLORS.warning, icon: 'time-outline' },
  PAYMENT_SUCCESS: { label: 'Ödendi', color: COLORS.success, icon: 'checkmark-circle-outline' },
  PAYMENT_FAILED: { label: 'Başarısız', color: COLORS.error, icon: 'close-circle-outline' },
};
const DELIVERY_MAP = {
  PREPARING: { label: 'Hazırlanıyor', color: COLORS.info },
  SHIPPED: { label: 'Kargoda', color: COLORS.warning },
  DELIVERED: { label: 'Teslim Edildi', color: COLORS.success },
  CANCELLED: { label: 'İptal', color: COLORS.error },
};

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(useCallback(() => { fetchOrders(); }, []));

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data || []);
    } catch (e) { console.log('Sipariş hatası:', e.message); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const fmt = (p) => new Intl.NumberFormat('tr-TR').format(p);
  const fmtDate = (d) => new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const renderOrder = ({ item }) => {
    const st = STATUS_MAP[item.status] || STATUS_MAP.PENDING;
    const dl = DELIVERY_MAP[item.deliveryStatus] || DELIVERY_MAP.PREPARING;
    return (
      <View style={[styles.card, SHADOWS.small]}>
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.orderId}>{item.orderId}</Text>
            <Text style={styles.orderDate}>{fmtDate(item.createdAt)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: st.color + '18' }]}>
            <Ionicons name={st.icon} size={14} color={st.color} />
            <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.cardBottom}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Ürün</Text>
            <Text style={styles.infoValue}>{item.items?.length || 0} adet</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Teslimat</Text>
            <Text style={[styles.infoValue, { color: dl.color }]}>{dl.label}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Toplam</Text>
            <Text style={[styles.infoValue, { color: COLORS.secondary, fontWeight: '800' }]}>{fmt(item.totalAmount)} ₺</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={COLORS.gradient} style={styles.header}>
        <Text style={styles.headerTitle}>Siparişlerim</Text>
        <Text style={styles.headerSub}>{orders.length} sipariş</Text>
      </LinearGradient>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchOrders(); }} colors={[COLORS.primary]} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="cube-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>Henüz sipariş yok</Text>
            <Text style={styles.emptySub}>Alışveriş yaptıkça siparişleriniz burada görünecek.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  list: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: '#FFF', borderRadius: SIZES.radius, padding: 18, marginBottom: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  orderDate: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '600' },
  divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: 14 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  infoCol: { alignItems: 'center' },
  infoLabel: { fontSize: 11, color: COLORS.textMuted, marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  empty: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginTop: 16 },
  emptySub: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginTop: 6 },
});
