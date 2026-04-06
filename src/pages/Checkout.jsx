import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Checkout() {
  const [address, setAddress] = useState('Isparta Merkez, SDU Kampüsü');
  const [paymentMethod, setPaymentMethod] = useState('Kredi Kartı');
  const [summary, setSummary] = useState(null);
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

  // 9. GEREKSİNİM: Ödeme Ekranı (Post İşlemi)
  const odemeYap = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/payments/create-intent', { shippingAddress: address, paymentMethod });
      alert('✅ ' + (response.data.message || 'Ödeme başarıyla alındı!'));
      navigate('/home'); // Ödeme bitince ana sayfaya dön
    } catch (error) {
      alert('❌ Ödeme işlemi başarısız oldu.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      <h2>💳 Ödeme Ekranı</h2>
      
      {/* Sipariş Özeti Bilgisi */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Sipariş Özeti (Backend'den Gelen)</h4>
        <p style={{ margin: 0, color: '#555' }}>
          {summary ? "Özet bilgileri başarıyla yüklendi." : "Özet bilgisi yükleniyor..."}
        </p>
      </div>

      <form onSubmit={odemeYap} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label>Teslimat Adresi:</label>
        <input 
          type="text" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />

        <label>Ödeme Yöntemi:</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ padding: '10px' }}>
          <option value="Kredi Kartı">Kredi Kartı</option>
          <option value="Havale/EFT">Havale / EFT</option>
          <option value="Kapıda Ödeme">Kapıda Ödeme</option>
        </select>

        <button type="submit" style={{ padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          Siparişi Tamamla ve Öde
        </button>
      </form>
    </div>
  );
}

export default Checkout;