import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// MobilCepte — Mobil API İstemcisi
// Her zaman Render'daki canlı backend'e bağlanır
// ============================================
// Local geliştirme ve Docker üzerinden test etmek için makinenizin yerel IP adresi:
const API_BASE_URL = 'http://10.215.149.93:9000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Her isteğe otomatik olarak JWT Token ekle
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Token okunamazsa devam et
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 401 hatasında otomatik logout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['userToken', 'userData']);
    }
    return Promise.reject(error);
  }
);

export default api;
