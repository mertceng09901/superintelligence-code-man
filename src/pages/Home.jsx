import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Kullanıcı rolünü localStorage'dan al
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdminOrSeller = user.role === 'ADMIN' || user.role === 'SELLER';

  useEffect(() => {
    const urunleriGetir = async () => {
      try {
        const response = await api.get('/products');
        const data = response.data.products || response.data;
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Ürünler çekilirken hata oluştu:', error);
      }
    };
    urunleriGetir();
  }, []);

  // DÜZELTME: Sepete ekleme artık backend API'sine gidiyor
  // Eski kod localStorage kullanıyordu → Cart.jsx backend'den okuyordu → sepet hep boştu
  const sepeteEkle = async (e, product) => {
    e.stopPropagation();
    try {
      await api.post('/cart/add', { productId: product._id, quantity: 1 });
      alert('🛒 Ürün sepetinize eklendi!');
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Sepete eklemek için giriş yapmanız gerekiyor.');
        navigate('/');
      } else {
        alert('❌ Ürün sepete eklenemedi.');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>

      {/* Üst Navigasyon Barı */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: 'white', padding: '15px 20px', borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#333' }}>📱 Superintelligence Mağaza</h2>
          {/* Kullanıcı adını ve rolünü göster */}
          <span style={{ fontSize: '0.85rem', color: '#666' }}>
            Merhaba, {user.firstName || 'Kullanıcı'} &nbsp;
            <span style={{
              backgroundColor: user.role === 'ADMIN' ? '#dc3545' : user.role === 'SELLER' ? '#6f42c1' : '#28a745',
              color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem'
            }}>
              {user.role || 'USER'}
            </span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {/* DÜZELTME: Satıcı Paneli butonu sadece ADMIN veya SELLER'a göster */}
          {isAdminOrSeller && (
            <button
              onClick={() => navigate('/seller')}
              style={{ padding: '8px 15px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              🏪 Yönetim Paneli
            </button>
          )}
          <button
            onClick={() => navigate('/profile')}
            style={{ padding: '8px 15px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            👤 Profilim
          </button>
          <button
            onClick={() => navigate('/cart')}
            style={{ padding: '8px 15px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🛒 Sepetim
          </button>
          <button
            onClick={() => { localStorage.clear(); navigate('/'); }}
            style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Ürün Izgara */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '25px'
      }}>
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            style={{
              backgroundColor: '#fff', border: '1px solid #f0f0f0',
              padding: '20px', borderRadius: '12px', cursor: 'pointer',
              textAlign: 'center', transition: 'box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{ height: '200px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={product.imageUrl || 'https://placehold.co/400x300?text=Gorsel+Yok'}
                alt={product.model}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </div>
            <h3 style={{ fontSize: '1rem', height: '40px', overflow: 'hidden', color: '#484848' }}>
              {product.model}
            </h3>
            <div style={{ margin: '15px 0' }}>
              <span style={{ color: '#ff6000', fontSize: '1.4rem', fontWeight: 'bold' }}>
                {product.price} TL
              </span>
            </div>
            <button
              onClick={(e) => sepeteEkle(e, product)}
              style={{
                width: '100%', padding: '12px', backgroundColor: '#ff6000',
                color: 'white', border: 'none', borderRadius: '8px',
                cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              Sepete Ekle
            </button>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
          <p>Henüz ürün bulunmuyor.</p>
        </div>
      )}
    </div>
  );
}

export default Home;
