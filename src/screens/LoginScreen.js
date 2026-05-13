import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
  Animated, StatusBar, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, SHADOWS, SIZES } from '../config/theme';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animasyonlar
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedPassword = password.trim();

    if (!sanitizedEmail || !sanitizedPassword) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      await login(sanitizedEmail, sanitizedPassword);
    } catch (error) {
      const msg = error.response?.data?.message || 'E-posta veya şifre hatalı.';
      Alert.alert('Giriş Başarısız', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={COLORS.gradientDark} style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          {/* Logo */}
          <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
            <LinearGradient colors={COLORS.gradient} style={styles.logoCircle}>
              <Ionicons name="phone-portrait-outline" size={48} color="#FFF" />
            </LinearGradient>
            <Text style={styles.logoTitle}>MobilCepte</Text>
            <Text style={styles.logoSubtitle}>Premium Cep Telefonu Mağazası</Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View style={[
            styles.formCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}>
            <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
            <Text style={styles.welcomeSub}>Hesabınıza giriş yapın</Text>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="E-posta adresiniz"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Şifreniz"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
              <LinearGradient colors={COLORS.gradient} style={styles.loginBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {loading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.loginBtnText}>Giriş Yap</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Demo Credentials */}
            <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>Demo Hesaplar</Text>
              <TouchableOpacity onPress={() => { setEmail('user@mobilcepte.com'); setPassword('user123'); }}>
                <Text style={styles.demoCredential}>👤 user@mobilcepte.com / user123</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setEmail('admin@mobilcepte.com'); setPassword('admin123'); }}>
                <Text style={styles.demoCredential}>👑 admin@mobilcepte.com / admin123</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Register Link */}
          <Animated.View style={[styles.registerRow, { opacity: fadeAnim }]}>
            <Text style={styles.registerText}>Hesabınız yok mu? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Kayıt Olun</Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 90, height: 90, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  logoTitle: { fontSize: 32, fontWeight: '800', color: '#FFF', letterSpacing: 1 },
  logoSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: SIZES.radiusLg,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  welcomeText: { fontSize: 22, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  welcomeSub: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: SIZES.radiusSm,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inputIcon: { paddingLeft: 14 },
  input: { flex: 1, color: '#FFF', fontSize: 15, paddingVertical: 14, paddingHorizontal: 10 },
  eyeBtn: { padding: 14 },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radiusSm,
    paddingVertical: 15,
    marginTop: 6,
    gap: 8,
  },
  loginBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  demoBox: {
    marginTop: 20,
    padding: 14,
    backgroundColor: 'rgba(108,99,255,0.15)',
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    borderColor: 'rgba(108,99,255,0.2)',
  },
  demoTitle: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textAlign: 'center' },
  demoCredential: { fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 4 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  registerText: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  registerLink: { color: COLORS.primary, fontSize: 14, fontWeight: '700' },
});