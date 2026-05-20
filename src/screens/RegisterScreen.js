import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, Animated, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, SIZES } from '../config/theme';

// ✅ Bileşen dışında tanımlandı — her render'da yeniden oluşmaz, klavye kapanmaz
const InputField = ({ icon, placeholder, value, onChangeText, secureTextEntry, keyboardType, autoCapitalize, rightElement }) => (
  <View style={styles.inputWrapper}>
    {icon && <Ionicons name={icon} size={20} color={COLORS.textMuted} style={styles.inputIcon} />}
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={COLORS.textMuted}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType || 'default'}
      autoCapitalize={autoCapitalize || 'none'}
    />
    {rightElement}
  </View>
);

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    const sanitizedEmail = email.trim().toLowerCase();
    if (!firstName || !lastName || !sanitizedEmail || !password) {
      Alert.alert('Uyarı', 'Lütfen zorunlu alanları doldurun.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Uyarı', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setLoading(true);
    try {
      await register({ firstName, lastName, email: sanitizedEmail, password, phone });
      // AuthContext register artık otomatik giriş yapıyor
      // Navigation, user state değişimiyle otomatik ana sayfaya yönlendirir
      Alert.alert('🎉 Başarılı', 'Hesabınız oluşturuldu ve giriş yapıldı!');
    } catch (error) {
      const msg = error.response?.data?.message || 'Kayıt yapılamadı.';
      Alert.alert('Hata', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={COLORS.gradientDark} style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Geri Butonu */}
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>

            <Animated.View style={[styles.headerSection, { opacity: fadeAnim }]}>
              <LinearGradient colors={COLORS.gradientSecondary} style={styles.iconCircle}>
                <Ionicons name="person-add-outline" size={36} color="#FFF" />
              </LinearGradient>
              <Text style={styles.title}>Hesap Oluştur</Text>
              <Text style={styles.subtitle}>Superintelligence'a katılın</Text>
            </Animated.View>

            {/* Form */}
            <Animated.View style={[styles.formCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

              {/* Ad - Soyad yan yana */}
              <View style={styles.nameRow}>
                <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
                  <Ionicons name="person-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ad"
                    placeholderTextColor={COLORS.textMuted}
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                  />
                </View>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <TextInput
                    style={[styles.input, { paddingLeft: 14 }]}
                    placeholder="Soyad"
                    placeholderTextColor={COLORS.textMuted}
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* E-posta */}
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="E-posta"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Telefon */}
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Telefon (opsiyonel)"
                  placeholderTextColor={COLORS.textMuted}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Şifre */}
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Şifre (min 6 karakter)"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={handleRegister} disabled={loading} activeOpacity={0.8}>
                <LinearGradient colors={COLORS.gradientSecondary} style={styles.registerBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Text style={styles.registerBtnText}>Kaydı Tamamla</Text>
                      <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Giriş Yapın</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  backBtn: { alignSelf: 'flex-start', padding: 4, marginBottom: 8 },
  headerSection: { alignItems: 'center', marginBottom: 28, marginTop: 20 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#FFF' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: SIZES.radiusLg,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  nameRow: { flexDirection: 'row', marginBottom: 0 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: SIZES.radiusSm,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inputIcon: { paddingLeft: 14 },
  input: { flex: 1, color: '#FFF', fontSize: 15, paddingVertical: 13, paddingHorizontal: 10 },
  eyeBtn: { padding: 14 },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radiusSm,
    paddingVertical: 15,
    marginTop: 4,
    gap: 8,
  },
  registerBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  loginText: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  loginLink: { color: COLORS.secondary, fontSize: 14, fontWeight: '700' },
});
