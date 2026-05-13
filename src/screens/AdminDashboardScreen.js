import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, StatusBar, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import api from '../config/api.native';
import { COLORS, SHADOWS, SIZES } from '../config/theme';

export default function AdminDashboardScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [health, setHealth] = useState(null);

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const loadData = async () => {
    try {
      const [prodRes, healthRes] = await Promise.all([
        api.get('/products'),
        api.get('/health').catch(() => null),
      ]);
      setStats({ products: prodRes.data?.products?.length || 0, orders: 0 });
      if (healthRes) setHealth(healthRes.data);
    } catch (e) { console.log('Dashboard hatası:', e.message); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const StatCard = ({ icon, label, value, colors }) => (
    <LinearGradient colors={colors} style={styles.statCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <View style={styles.statIconBg}><Ionicons name={icon} size={24} color="#FFF" /></View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </LinearGradient>
  );

  const ServiceBadge = ({ name, status }) => {
    const isUp = status && status.includes('🟢');
    return (
      <View style={styles.serviceBadge}>
        <View style={[styles.serviceDot, { backgroundColor: isUp ? COLORS.success : COLORS.error }]} />
        <Text style={styles.serviceName}>{name}</Text>
        <Text style={[styles.serviceStatus, { color: isUp ? COLORS.success : COLORS.error }]}>{isUp ? 'Aktif' : 'Kapalı'}</Text>
      </View>
    );
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={COLORS.gradientDark} style={styles.header}>
        <View style={styles.welcomeRow}>
          <View>
            <Text style={styles.welcomeText}>Merhaba, {user?.firstName} 👋</Text>
            <Text style={styles.welcomeSub}>Yönetim Paneli</Text>
          </View>
          <View style={styles.adminBadge}>
            <Ionicons name="shield-checkmark" size={14} color={COLORS.error} />
            <Text style={styles.adminText}>ADMIN</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} colors={[COLORS.primary]} />}>

        {/* Stats */}
        <Text style={styles.sectionTitle}>Genel Bakış</Text>
        <View style={styles.statsRow}>
          <StatCard icon="phone-portrait-outline" label="Ürünler" value={stats.products} colors={COLORS.gradient} />
          <StatCard icon="cube-outline" label="Siparişler" value={stats.orders} colors={COLORS.gradientSecondary} />
        </View>

        {/* Services Health */}
        {health && (
          <>
            <Text style={styles.sectionTitle}>Servis Durumu</Text>
            <View style={[styles.healthCard, SHADOWS.small]}>
              <ServiceBadge name="API Sunucusu" status={health.services?.api} />
              <View style={styles.hDivider} />
              <ServiceBadge name="MongoDB" status={health.services?.mongodb} />
              <View style={styles.hDivider} />
              <ServiceBadge name="Redis Cache" status={health.services?.redis} />
            </View>
          </>
        )}

        {/* Tech Stack Info */}
        <Text style={styles.sectionTitle}>Teknoloji Altyapısı</Text>
        <View style={[styles.techCard, SHADOWS.small]}>
          {[
            { icon: 'server-outline', label: 'Backend', value: 'Node.js + Express', color: COLORS.success },
            { icon: 'leaf-outline', label: 'Veritabanı', value: 'MongoDB', color: COLORS.secondary },
            { icon: 'flash-outline', label: 'Cache', value: 'Redis', color: COLORS.error },
            { icon: 'mail-outline', label: 'Message Queue', value: 'RabbitMQ', color: COLORS.warning },
            { icon: 'cube-outline', label: 'Container', value: 'Docker', color: COLORS.info },
          ].map((t, i) => (
            <View key={i} style={styles.techRow}>
              <View style={[styles.techIconBg, { backgroundColor: t.color + '15' }]}>
                <Ionicons name={t.icon} size={18} color={t.color} />
              </View>
              <Text style={styles.techLabel}>{t.label}</Text>
              <Text style={styles.techValue}>{t.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  header: { paddingTop: 55, paddingBottom: 25, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  welcomeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcomeText: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  welcomeSub: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  adminBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(239,68,68,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  adminText: { fontSize: 11, fontWeight: '700', color: COLORS.error },
  scroll: { padding: 16, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 12, marginTop: 8 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  statCard: { flex: 1, borderRadius: SIZES.radius, padding: 18, alignItems: 'flex-start' },
  statIconBg: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 28, fontWeight: '800', color: '#FFF' },
  statLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  healthCard: { backgroundColor: '#FFF', borderRadius: SIZES.radius, padding: 16, marginBottom: 8 },
  serviceBadge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  serviceDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  serviceName: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.text },
  serviceStatus: { fontSize: 13, fontWeight: '600' },
  hDivider: { height: 1, backgroundColor: COLORS.divider },
  techCard: { backgroundColor: '#FFF', borderRadius: SIZES.radius, padding: 16, marginBottom: 8 },
  techRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  techIconBg: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  techLabel: { flex: 1, fontSize: 14, color: COLORS.textSecondary },
  techValue: { fontSize: 14, fontWeight: '600', color: COLORS.text },
});
