import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // 1. Giriş yaparken kaydettiğimiz Token'ı alıyoruz
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert("Hata", "Oturum bulunamadı, lütfen tekrar giriş yapın.");
        navigation.replace('Login');
        return;
      }

      // 2. Token ile Backend'e soruyoruz: "Ben kimim?"
      // NOT: Eğer API yolunu api/auth/profile yaptıysan burayı ona göre değiştir.
      const response = await axios.get('https://superintelligence-code-man.onrender.com/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserData(response.data);
    } catch (error) {
      console.log("Profil çekme hatası:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      Alert.alert("Başarılı", "Çıkış yapıldı.");
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      Alert.alert("Hata", "Çıkış yapılamadı.");
    }
  };
  // ProfileScreen.js içine eklenecek güncelleme mantığı
const handleUpdateProfile = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.put(
      'https://superintelligence-code-man.onrender.com/api/users/profile',
      { firstName, lastName, email }, // State'den gelen yeni bilgiler
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUserData(response.data);
    Alert.alert("Başarılı", "Profiliniz güncellendi!");
  } catch (error) {
    Alert.alert("Hata", "Güncelleme yapılamadı.");
  }
};

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          {/* İsim yoksa 'U' (User) harfini gösterir */}
          <Text style={styles.avatarText}>
            {userData?.firstName ? userData.firstName.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        
        {/* Backend'den gelen gerçek isim ve email */}
        <Text style={styles.name}>
          {userData?.firstName} {userData?.lastName}
        </Text>
        <Text style={styles.email}>{userData?.email}</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.menuText}>🛒 Siparişlerim</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: { backgroundColor: '#007bff', padding: 30, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatar: { width: 80, height: 80, backgroundColor: '#fff', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#007bff' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  email: { fontSize: 16, color: '#e0e0e0' },
  menuContainer: { padding: 20, marginTop: 20 },
  menuItem: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 15, elevation: 2 },
  menuText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  logoutButton: { backgroundColor: '#dc3545', marginTop: 30 },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: '#fff', textAlign: 'center' }
});