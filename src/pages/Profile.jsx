import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Profile() {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: ''
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const profiliGetir = async () => {
      try {
        // DÜZELTME: Tam URL yerine relative path kullanıyoruz.
        // api.js zaten baseURL'i biliyor ve token'ı otomatik ekliyor.
        // Eski kodda tam URL yazılınca interceptor token ekleyemiyordu → alanlar boş geliyordu.
        const response = await api.get('/users/profile');
        const data = response.data;

        setUserData({
          firstName: data.firstName || '',
          lastName:  data.lastName  || '',
          email:     data.email     || '',
          phone:     data.phone     || '',
          role:      data.role      || 'USER'
        });
        setLoading(false);
      } catch (error) {
        console.error('Profil çekilemedi:', error);
        if (error.response && error.response.status === 401) {
          alert('Oturumunuz sona erdi. Lütfen tekrar giriş yapın.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
        }
        setLoading(false);
      }
    };
    profiliGetir();
  }, [navigate]);

  const profiliGuncelle = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', {
        firstName: userData.firstName,
        lastName:  userData.lastName,
        phone:     userData.phone
      });
      alert('✅ Profil başarıyla güncellendi!');
    } catch (error) {
      alert('❌ Profil güncellenirken hata oluştu.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Profil Bilgileri Yükleniyor...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>👤 Profilim {userData.role ? `(${userData.role})` : ''}</h2>
        <button
          onClick={() => navigate('/home')}
          style={{ padding: '8px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Geri Dön
        </button>
      </div>

      <form onSubmit={profiliGuncelle} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <label>Ad:</label>
        <input
          type="text"
          value={userData.firstName}
          onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          placeholder="Adınız"
        />

        <label>Soyad:</label>
        <input
          type="text"
          value={userData.lastName}
          onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          placeholder="Soyadınız"
        />

        <label>E-Posta (Değiştirilemez):</label>
        <input
          type="email"
          value={userData.email}
          disabled
          style={{ padding: '10px', backgroundColor: '#f9f9f9', cursor: 'not-allowed', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <label>Telefon Numarası:</label>
        <input
          type="text"
          value={userData.phone}
          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          placeholder="Telefon numaranız"
        />

        <button
          type="submit"
          style={{ padding: '12px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Bilgilerimi Güncelle
        </button>
      </form>
    </div>
  );
}

export default Profile;
