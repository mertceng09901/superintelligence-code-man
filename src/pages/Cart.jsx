import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// DÜZELTME: Eski Cart.jsx tamamen kırıktı:
// 1. useNavigate, useEffect ve sepettenCikar fonksiyonları component'in DIŞINA yazılmıştı → React kuralı çiğneniyor
// 2. Sepet yükleme (sepetiGetir) component içinde hiç çağrılmıyordu → sepet daima boş görünüyordu
// 3. Home.jsx'teki sepeteEkle localStorage kullanıyordu ama Cart.jsx backend'den okuyordu → uyuşmuyordu
// Tüm bunlar düzeltildi: her şey component içinde, backend API'si kullanılıyor.

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Sepeti backend'den getir
  const sepetiGetir = async () => {
    try {
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Sepet yüklenemedi:', error);
      if (error.response && error.response.status === 401) {
        alert('Oturumunuz sona erdi. Lütfen tekrar giriş yapın.');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  // Sayfa açılınca sepeti getir
  useEffect(() => {
    sepetiGetir();
  }, []);

  // Ürünü sepetten çıkar
  const sepettenCikar = async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`);
      // Silme başarılıysa sepeti yeniden yükle
      sepetiGetir();
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('❌ Ürün silinemedi.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Sepet Yükleniyor...</div>;
  }

  const items = cart?.items || [];

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '2px solid #ddd',
        paddingBottom: '10px',
        marginBottom: '20px'
      }}>
        <h2>🛒 Alışveriş Sepetim</h2>
        <button
          onClick={() => navigate('/home')}
          style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          ← Alışverişe Dön
        </button>
      </div>

      {items.length === 0 ? (
        <p>Sepetiniz şu an boş. Hemen bir şeyler ekleyin!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #eee',
                padding: '15px',
                borderRadius: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img
                  src={item.product?.imageUrl || item.product?.images?.[0] || 'https://via.placeholder.com/80'}
                  alt={item.product?.model}
                  style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #eee' }}
                />
                <div>
                  <h3 style={{ margin: 0 }}>{item.product?.brand} {item.product?.model}</h3>
                  <p style={{ margin: '5px 0', color: '#555' }}>Adet: {item.quantity}</p>
                  <p style={{ margin: 0, color: '#ff6000', fontWeight: 'bold' }}>
                    {item.product?.price
                      ? `${(item.product.price * item.quantity).toLocaleString('tr-TR')} TL`
                      : ''}
                  </p>
                </div>
              </div>

              <button
                onClick={() => sepettenCikar(item.product?._id)}
                style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                🗑️ Sil
              </button>
            </div>
          ))}

          <div style={{ textAlign: 'right', marginTop: '10px', fontSize: '1.2rem', fontWeight: 'bold' }}>
            Toplam: {cart?.totalAmount?.toLocaleString('tr-TR')} TL
          </div>

          <div style={{ textAlign: 'right', marginTop: '10px' }}>
            <button
              onClick={() => navigate('/checkout')}
              style={{ padding: '15px 30px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
            >
              Ödemeye Geç →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
