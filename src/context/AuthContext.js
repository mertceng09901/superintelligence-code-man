import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api.native';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Uygulama açıldığında kayıtlı oturumu yükle
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedToken && storedUser) {
        const parsed = JSON.parse(storedUser);
        // Role'ü her zaman büyük harfe normalize et
        if (parsed.role) parsed.role = parsed.role.toUpperCase();
        setToken(storedToken);
        setUser(parsed);
      }
    } catch (e) {
      console.log('Oturum yükleme hatası:', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: newToken, ...userData } = response.data;
    // Role'ü büyük harfe normalize et (ADMIN/USER/SELLER)
    if (userData.role) userData.role = userData.role.toUpperCase();
    await AsyncStorage.setItem('userToken', newToken);
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['userToken', 'userData']);
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const response = await api.put('/users/profile', updates);
    const updatedUser = { ...user, ...response.data };
    if (updatedUser.role) updatedUser.role = updatedUser.role.toUpperCase();
    await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  };

  const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  };

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SELLER';

  return (
    <AuthContext.Provider value={{ user, token, loading, isAdmin, login, register, logout, updateProfile, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
