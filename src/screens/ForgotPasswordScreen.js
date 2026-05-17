import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, SIZES } from '../config/theme';

export default function ForgotPasswordScreen({ navigation }) {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    const sanitizedEmail = email.trim().toLowerCase();

    if (!sanitizedEmail) {
      Alert.alert('Uyarı', 'Lütfen e-posta adresinizi girin.');
      return;
    }

    setLoading(true);
    try {
      const result = await forgotPassword(sanitizedEmail);
      
      // Simüle edilmiş SMS/E-posta uyarısı (Demo ortamı için)
      Alert.alert(
        '✅ Şifre Gönderildi',
        `Yeni geçici şifreniz oluşturuldu.\n\nSimüle edilen şifre: ${result.tempPassword}\n\nLütfen bu şifreyi kopyalayarak giriş yapın.`,
        [
          { text: 'Tamam, Giriş Yap', onPress: () => navigation.navigate('Login') }
        ]
      );
    } catch (error) {
      const msg = error.response?.data?.message || 'Şifre sıfırlanamadı. E-posta adresinizi kontrol edin.';
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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Geri Butonu */}
            <TouchableOpacity 
              style={styles.backBtn} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <Ionicons name="lock-closed-outline" size={40} color={COLORS.primary} />
              </View>
              <Text style={styles.title}>Şifremi Unuttum</Text>
              <Text style={styles.subtitle}>
                Kayıtlı e-posta adresinizi girin. Size yeni bir geçici şifre oluşturacağız.
              </Text>
            </View>

            <View style={styles.formCard}>
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

              {/* Reset Button */}
              <TouchableOpacity onPress={handleReset} disabled={loading} activeOpacity={0.8}>
                <LinearGradient colors={COLORS.gradient} style={styles.resetBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  {loading ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <>
                      <Text style={styles.resetBtnText}>Şifre Gönder</Text>
                      <Ionicons name="send" size={18} color="#FFF" />
                    </>
                  )}
                </LinearGradient>
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
  content: { flex: 1, paddingHorizontal: 24 },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 0,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  header: { alignItems: 'center', marginBottom: 32, marginTop: 40 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(108,99,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(108,99,255,0.3)',
  },
  title: { fontSize: 24, fontWeight: '700', color: '#FFF', marginBottom: 10 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.6)', textAlign: 'center', paddingHorizontal: 20, lineHeight: 22 },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: SIZES.radiusLg,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: SIZES.radiusSm,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inputIcon: { paddingLeft: 14 },
  input: { flex: 1, color: '#FFF', fontSize: 15, paddingVertical: 14, paddingHorizontal: 10 },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radiusSm,
    paddingVertical: 15,
    gap: 10,
  },
  resetBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
