import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import SellerDashboard from './pages/SellerDashboard';
import SellerProductDetail from './pages/SellerProductDetail';
import ProductDetail from './pages/ProductDetail';

// -------------------------------------------------------
// KORUYUCU ROUTE BİLEŞENLERİ
// -------------------------------------------------------

// Giriş yapmamış kullanıcıları Login sayfasına yönlendirir
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Sadece ADMIN veya SELLER rolüne sahip kullanıcılara izin verir
// Diğerleri Home'a yönlendirilir
function AdminSellerRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.role === 'ADMIN' || user.role === 'SELLER') {
    return children;
  }

  // USER rolündeyse → yetkisiz erişim mesajı ve ana sayfaya yönlendirme
  alert('⛔ Bu sayfaya erişim yetkiniz yok.');
  return <Navigate to="/home" replace />;
}

// -------------------------------------------------------
// ANA UYGULAMA ROUTER'I
// -------------------------------------------------------

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Herkese açık sayfalar */}
        <Route path="/"         element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Giriş yapmış herkese açık sayfalar */}
        <Route path="/home"         element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/cart"         element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/checkout"     element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/profile"      element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/product/:id"  element={<PrivateRoute><ProductDetail /></PrivateRoute>} />

        {/* Sadece ADMIN veya SELLER erişebilir */}
        <Route path="/seller"              element={<AdminSellerRoute><SellerDashboard /></AdminSellerRoute>} />
        <Route path="/seller/product/:id"  element={<AdminSellerRoute><SellerProductDetail /></AdminSellerRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
