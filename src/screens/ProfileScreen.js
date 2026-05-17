import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, SHADOWS, SIZES } from '../config/theme';

export default function ProfileScreen({ navigation }) {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Oturumunuz kapatılacak. Emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Çıkış Yap', style: 'destructive', onPress: logout },
    ]);
  };

  const initial = user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';
  const roleBadge = {
    ADMIN: { label: 'Yönetici', color: COLORS.error, icon: 'shield-checkmark' },
    SELLER: { label: 'Satıcı', color: COLORS.warning, icon: 'storefront' },
    USER: { label: 'Müşteri', color: COLORS.secondary, icon: 'person' }
  };
  const role = roleBadge[user?.role] || roleBadge.USER;

  const MenuItem = ({ icon, label, onPress, color }) => (
    <TouchableOpacity style={[styles.menuItem, SHADOWS.small]} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIconBg, { backgroundColor: (color || COLORS.primary) + '15' }]}>
        <Ionicons name={icon} size={22} color={color || COLORS.primary} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={COLORS.gradient} style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <View style={[styles.roleBadge, { backgroundColor: role.color + '30' }]}>
          <Ionicons name={role.icon} size={14} color={role.color} />
          <Text style={[styles.roleText, { color: role.color }]}>{role.label}</Text>
        </View>

        {/* Profili Düzenle Butonu — Header içinde */}
        <TouchableOpacity
          style={styles.editProfileBtn}
          onPress={() => navigation.navigate('ProfileEdit')}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={16} color="#FFF" />
          <Text style={styles.editProfileTxt}>Profili Düzenle</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.menuSection}>
          {/* Admin Menüleri */}
          {isAdmin && (
            <>
              <Text style={styles.sectionLabel}>YÖNETİM</Text>
              <MenuItem icon="stats-chart-outline" label="Yönetim Paneli" onPress={() => navigation.navigate('Panel')} color={COLORS.error} />
              <MenuItem icon="list-outline" label="Ürün Yönetimi" onPress={() => navigation.navigate('Ürünler')} color={COLORS.warning} />
            </>
          )}

          {/* Müşteri Menüleri */}
          {!isAdmin && (
            <>
              <Text style={styles.sectionLabel}>ALIŞVERİŞ</Text>
              <MenuItem icon="cube-outline" label="Siparişlerim" onPress={() => navigation.navigate('Siparişlerim')} color={COLORS.info} />
              <MenuItem icon="cart-outline" label="Sepetim" onPress={() => navigation.navigate('Sepet')} color={COLORS.secondary} />
            </>
          )}

          <Text style={styles.sectionLabel}>HESAP</Text>
          <MenuItem
            icon="person-outline"
            label="Profili Düzenle"
            onPress={() => navigation.navigate('ProfileEdit')}
            color={COLORS.primary}
          />
          <MenuItem
            icon="person-circle-outline"
            label="Hesap Bilgileri"
            onPress={() => Alert.alert('Hesap Bilgileri',
              `Ad: ${user?.firstName} ${user?.lastName}\nE-posta: ${user?.email}\nTelefon: ${user?.phone || 'Belirtilmemiş'}\nRol: ${user?.role}`
            )}
            color={COLORS.info}
          />
          <MenuItem
            icon="information-circle-outline"
            label="Uygulama Hakkında"
            onPress={() => Alert.alert('Superintelligence Mobile v1.0',
              'MERN Stack + Redis + RabbitMQ + Docker\n\nGeliştirici: Superintelligence Team'
            )}
            color={COLORS.warning}
          />

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
            <LinearGradient colors={COLORS.gradientDanger} style={styles.logoutGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Ionicons name="log-out-outline" size={20} color="#FFF" />
              <Text style={styles.logoutText}>Çıkış Yap</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingTop: 55, paddingBottom: 30, alignItems: 'center',
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
  },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12, borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: { fontSize: 34, fontWeight: '800', color: '#FFF' },
  userName: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  userEmail: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, marginTop: 10,
  },
  roleText: { fontSize: 13, fontWeight: '700' },
  editProfileBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 14, paddingHorizontal: 18, paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  editProfileTxt: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  menuSection: { padding: 20, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: COLORS.textMuted,
    letterSpacing: 1.2, marginTop: 16, marginBottom: 8, marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    borderRadius: SIZES.radius, padding: 16, marginBottom: 10,
  },
  menuIconBg: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text },
  logoutBtn: { marginTop: 24 },
  logoutGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: SIZES.radiusSm, paddingVertical: 16, gap: 8,
  },
  logoutText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});