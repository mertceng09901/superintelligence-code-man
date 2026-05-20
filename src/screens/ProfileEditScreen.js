import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, StatusBar, ScrollView,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, SHADOWS, SIZES } from '../config/theme';

// ✅ Bileşen dışında tanımlandı — her render'da yeniden oluşmaz, klavye kapanmaz
const Field = ({ icon, label, value, onChangeText, keyboardType, autoCapitalize }) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      <Ionicons name={icon} size={18} color={COLORS.primary} style={styles.fieldIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={autoCapitalize || 'sentences'}
        placeholderTextColor={COLORS.textMuted}
        placeholder={label}
      />
    </View>
  </View>
);

export default function ProfileEditScreen({ navigation }) {
  const { user, updateProfile } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Uyarı', 'Ad ve soyad alanları zorunludur.');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ firstName: firstName.trim(), lastName: lastName.trim(), phone: phone.trim() });
      Alert.alert('✅ Başarılı', 'Profil bilgileriniz güncellendi.', [
        { text: 'Tamam', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert('Hata', e.response?.data?.message || 'Profil güncellenemedi. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={COLORS.gradient} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profili Düzenle</Text>
        <View style={{ width: 44 }} />
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <LinearGradient colors={COLORS.gradient} style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {firstName ? firstName.charAt(0).toUpperCase() : 'U'}
              </Text>
            </LinearGradient>
            <Text style={styles.avatarName}>{firstName} {lastName}</Text>
            <Text style={styles.avatarEmail}>{user?.email}</Text>
          </View>

          {/* Form */}
          <View style={[styles.card, SHADOWS.small]}>
            <View style={styles.cardHead}>
              <Ionicons name="person-outline" size={20} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Kişisel Bilgiler</Text>
            </View>

            <Field
              icon="person-outline"
              label="Ad"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
            <Field
              icon="person-outline"
              label="Soyad"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
            <Field
              icon="call-outline"
              label="Telefon"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoCapitalize="none"
            />

            {/* E-posta — düzenlenemez */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>E-posta</Text>
              <View style={[styles.inputWrapper, styles.inputDisabled]}>
                <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} style={styles.fieldIcon} />
                <Text style={styles.inputText}>{user?.email}</Text>
                <Ionicons name="lock-closed-outline" size={14} color={COLORS.textMuted} style={{ marginRight: 12 }} />
              </View>
              <Text style={styles.helperText}>E-posta adresi değiştirilemez</Text>
            </View>
          </View>

          {/* Kaydet Butonu */}
          <TouchableOpacity onPress={handleSave} disabled={saving} activeOpacity={0.85} style={styles.saveBtn}>
            <LinearGradient colors={COLORS.gradient} style={styles.saveGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              {saving
                ? <ActivityIndicator color="#FFF" />
                : <>
                    <Ionicons name="checkmark-circle-outline" size={22} color="#FFF" />
                    <Text style={styles.saveTxt}>Değişiklikleri Kaydet</Text>
                  </>
              }
            </LinearGradient>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingTop: 50, paddingBottom: 18, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  scroll: { padding: 16, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', paddingVertical: 24 },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 34, fontWeight: '800', color: '#FFF' },
  avatarName: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  avatarEmail: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  card: {
    backgroundColor: '#FFF', borderRadius: SIZES.radius,
    padding: 18, marginBottom: 16,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6 },
  fieldIcon: { marginLeft: 12 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.inputBg, borderRadius: SIZES.radiusSm,
    borderWidth: 1, borderColor: COLORS.border,
  },
  inputDisabled: { backgroundColor: '#F0F0F5', borderColor: '#E0E0E8' },
  input: {
    flex: 1, fontSize: 14, color: COLORS.text,
    paddingVertical: 13, paddingHorizontal: 10,
  },
  inputText: { flex: 1, fontSize: 14, color: COLORS.textMuted, paddingVertical: 13, paddingHorizontal: 10 },
  helperText: { fontSize: 11, color: COLORS.textMuted, marginTop: 4, marginLeft: 4 },
  saveBtn: { marginTop: 8 },
  saveGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: SIZES.radiusSm, paddingVertical: 16, gap: 10,
  },
  saveTxt: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
