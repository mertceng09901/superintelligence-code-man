import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mesaj, setMesaj] = useState('');
  const navigate = useNavigate();

  const kayitOl = async (e) => {
    e.preventDefault();
    setMesaj('⌛ Kayıt yapılıyor...');
    try {
      await api.post('/auth/register', { firstName, lastName, email, password });
      setMesaj('✅ Kayıt Başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      const hataMesaji = error.response?.data?.message || 'Kayıt olunamadı.';
      setMesaj(`❌ Hata: ${hataMesaji}`);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <div style={{ display: 'inline-block', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#ff6000' }}>Yeni Hesap Oluştur</h2>
        <form onSubmit={kayitOl} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px' }}>
          
          <input type="text" placeholder="Adınız" value={firstName}
            onChange={(e) => setFirstName(e.target.value)} required
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }} />

          <input type="text" placeholder="Soyadınız" value={lastName}
            onChange={(e) => setLastName(e.target.value)} required
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }} />

          <input type="email" placeholder="E-posta adresiniz" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }} />

          <input type="password" placeholder="Şifreniz (min 6 karakter)" value={password}
            onChange={(e) => setPassword(e.target.value)} required
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }} />

          <button type="submit" style={{
            padding: '12px', backgroundColor: '#ff6000', color: 'white',
            border: 'none', borderRadius: '5px', cursor: 'pointer',
            fontWeight: 'bold', fontSize: '1rem'
          }}>Kayıt Ol</button>

        </form>

        {mesaj && <p style={{
          marginTop: '20px', fontWeight: 'bold',
          color: mesaj.includes('✅') ? 'green' : 'red',
          backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px'
        }}>{mesaj}</p>}

        <p style={{ marginTop: '20px' }}>
          Zaten hesabınız var mı? <Link to="/" style={{ color: '#ff6000', fontWeight: 'bold' }}>Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;