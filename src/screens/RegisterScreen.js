import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const sanitizedEmail = email.trim().toLowerCase();

    if (!firstName || !lastName || !sanitizedEmail || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      // YOL GÜNCELLENDİ: api/auth/register
      await axios.post('https://superintelligence-code-man.onrender.com/api/auth/register', {
        firstName,
        lastName,
        email: sanitizedEmail,
        password,
      });

      Alert.alert('Başarılı', 'Kayıt tamamlandı, şimdi giriş yapabilirsiniz.');
      navigation.navigate('Login');
    } catch (error) {
      console.log("Kayıt Hatası:", error.response?.data || error.message);
      Alert.alert('Hata', 'Kayıt yapılamadı. Bilgileri kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      <TextInput style={styles.input} placeholder="Ad" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Soyad" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Şifre" value={password} onChangeText={setPassword} secureTextEntry />
      
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Kaydı Tamamla</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});