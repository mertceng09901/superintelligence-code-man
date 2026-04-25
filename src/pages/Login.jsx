import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [mesaj, setMesaj]       = useState('');
  const navigate = useNavigate();

  const girisYap = async (e) => {
    e.preventDefault();

    // Eski oturum verilerini temizle
    localStorage.clear();

    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;

      // Token ve kullanıcı bilgisini kaydet
      // DÜZELTME: role bilgisi artık localStorage'a kaydediliyor
      // böylece App.jsx route koruması ve Home.jsx yönlendirmesi bunu kullanabilir
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id:       data._id,
        firstName: data.firstName,
        lastName:  data.lastName,
        email:     data.email,
        role:      data.role   // 'USER' | 'SELLER' | 'ADMIN'
      }));

      setMesaj('✅ Giriş Başarılı! Yönlendiriliyorsunuz...');

      // DÜZELTME: Role göre farklı sayfaya yönlendir
      if (data.role === 'ADMIN' || data.role === 'SELLER') {
        navigate('/seller');
      } else {
        navigate('/home');
      }

    } catch (error) {
      setMesaj('❌ Hata: E-posta veya şifre yanlış!');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <div style={{
        display: 'inline-block', padding: '30px',
        border: '1px solid #ddd', borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#ff6000' }}>Giriş Yap</h2>
        <form
          onSubmit={girisYap}
          style={{ display: 'flex', flexDirection: 'column', width: '300px', margin: '0 auto', gap: '15px' }}
        >
          <input
            type="email"
            placeholder="E-posta adresiniz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <input
            type="password"
            placeholder="Şifreniz"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            style={{ padding: '12px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Giriş Yap
          </button>
        </form>

        {mesaj && (
          <p style={{
            marginTop: '20px', fontWeight: 'bold',
            color: mesaj.includes('✅') ? 'green' : 'red',
            backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px'
          }}>
            {mesaj}
          </p>
        )}

        <p style={{ marginTop: '20px' }}>
          Hesabınız yok mu?{' '}
          <Link to="/register" style={{ color: '#007BFF' }}>Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
