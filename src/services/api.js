import axios from 'axios';

// DÜZELTME: Sabit canlı URL yerine ortam değişkeni kullan.
// Local çalışırken: VITE_API_URL tanımlı değilse http://localhost:5000/api kullanır
// Canlıya deploy ederken: .env dosyasına VITE_API_URL=https://superintelligence-code-man.onrender.com/api yaz
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Her isteğe otomatik Token ekle
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
