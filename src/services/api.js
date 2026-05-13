import axios from 'axios';

// Docker ortamında: VITE_API_URL=http://localhost:9000/api (docker-compose'dan gelir)
// Local çalışırken: tanımlı değilse http://localhost:9000/api kullanır
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:9000/api',
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
