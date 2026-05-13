import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Checkout() {
  const [address, setAddress] = useState('Isparta Merkez, SDU Kampüsü');
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 8. GEREKSİNİM: Sipariş Özeti Sayfasını Görüntüleme
  useEffect(() => {
    const ozetiGetir = async () => {
      try {
        const response = await api.get('/orders/checkout-summary');
        setSummary(response.data);
      } catch (error) {
        console.error("Özet çekilemedi", error);
      }
    };
    ozetiGetir();
  }, []);

  // 9. GEREKSİNİM: Sipariş Oluşturma + Ödeme (Post İşlemi)
  const siparisiTamamla = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Gerçek sipariş oluştur (RabbitMQ'ya mesaj gönderir + Redis cache temizler)
      const orderResponse = await api.post('/orders', {
        shippingAddress: address,
        paymentMethod
      });

      // 2. Mock ödeme onayı al
      await api.post('/payments/create-intent', {
        shippingAddress: address,
        paymentMethod,
        orderId: orderResponse.data.orderId
      });

      alert(`✅ Sipariş başarıyla oluşturuldu!\n\n📦 Sipariş No: ${orderResponse.data.orderId}\n💰 Toplam: ${orderResponse.data.totalAmount?.toLocaleString('tr-TR')} TL\n📍 Adres: ${address}`);
      navigate('/home');
    } catch (error) {
      const msg = error.response?.data?.message || 'Sipariş oluşturulamadı.';
      alert('❌ ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const items = summary?.items || [];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>💳 Sipariş Tamamla</h2>
        <button
          onClick={() => navigate('/cart')}
          style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          ← Sepete Dön
        </button>
      </div>

      {/* Sipariş Özeti */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e9ecef' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>📋 Sipariş Özeti</h4>
        {items.length > 0 ? (
          <>
            {items.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={item.product?.imageUrl || 'https://placehold.co/50x50?text=📱'}
                    alt={item.product?.model}
                    style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '6px' }}
                  />
                  <div>
                    <strong>{item.product?.brand} {item.product?.model}</strong>
                    <div style={{ color: '#666', fontSize: '0.85rem' }}>Adet: {item.quantity}</div>
                  </div>
                </div>
                <div style={{ color: '#ff6000', fontWeight: 'bold' }}>
                  {((item.product?.price || 0) * item.quantity).toLocaleString('tr-TR')} TL
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'right', marginTop: '15px', fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
              Toplam: <span style={{ color: '#ff6000' }}>{summary?.totalAmount?.toLocaleString('tr-TR')} TL</span>
            </div>
          </>
        ) : (
          <p style={{ color: '#888', margin: 0 }}>Sepetiniz boş görünüyor.</p>
        )}
      </div>

      {/* Sipariş Formu */}
      <form onSubmit={siparisiTamamla} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>📍 Teslimat Adresi:</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows={3}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>💳 Ödeme Yöntemi:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', fontFamily: 'inherit' }}
          >
            <option value="CREDIT_CARD">Kredi Kartı</option>
            <option value="BANK_TRANSFER">Havale / EFT</option>
            <option value="CASH_ON_DELIVERY">Kapıda Ödeme</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || items.length === 0}
          style={{
            padding: '18px',
            backgroundColor: items.length === 0 ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: items.length === 0 ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            marginTop: '10px'
          }}
        >
          {loading ? '⌛ İşleniyor...' : '✅ Siparişi Tamamla ve Öde'}
        </button>
      </form>
    </div>
  );
}

export default Checkout;