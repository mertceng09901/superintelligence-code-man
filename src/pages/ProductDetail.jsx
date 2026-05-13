import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mesaj, setMesaj] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/seller/products/${id}`);
        setProduct(res.data);
      } catch (err) { alert("Ürün yüklenemedi"); }
    };
    fetchProduct();
  }, [id]);

  const sepeteEkle = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    setYukleniyor(true);
    setMesaj('');
    try {
      await api.post('/cart/add', {
        productId: product._id,
        quantity: 1,
        selectedColor: product.colors?.[0] || 'Varsayılan'
      });
      setMesaj('✅ Ürün sepete eklendi!');
    } catch (err) {
      setMesaj('❌ Sepete eklenemedi: ' + (err.response?.data?.message || 'Hata oluştu'));
    } finally {
      setYukleniyor(false);
    }
  };

  if (!product) return <h2>Yükleniyor...</h2>;

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', display: 'flex', gap: '60px', padding: '0 20px' }}>
      <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #eee' }}>
        <img src={product.imageUrl} style={{ width: '100%', objectFit: 'contain' }} />
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.9rem' }}>{product.brand || "Teknoloji"}</p>
        <h1 style={{ fontSize: '2.5rem', marginTop: '10px' }}>{product.model}</h1>
        <div style={{ fontSize: '2rem', color: '#ff6000', fontWeight: 'bold', margin: '20px 0' }}>
          {product.price} TL
        </div>
        <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
          <p><b>Stok:</b> {product.stock > 0 ? '✅ Stokta Var' : '❌ Tükendi'}</p>
          <p><b>RAM:</b> {product.specs?.ram}</p>
          <p><b>Depolama:</b> {product.specs?.storage}</p>
        </div>

        <button
          onClick={sepeteEkle}
          disabled={yukleniyor || product.stock === 0}
          style={{
            width: '100%', padding: '20px', backgroundColor: product.stock === 0 ? '#ccc' : '#ff6000',
            color: '#fff', border: 'none', borderRadius: '10px',
            fontSize: '1.2rem', fontWeight: 'bold',
            cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
          }}>
          {yukleniyor ? '⌛ Ekleniyor...' : product.stock === 0 ? 'STOK YOK' : 'SEPETE EKLE'}
        </button>

        {mesaj && (
          <p style={{
            marginTop: '15px', padding: '10px', borderRadius: '8px',
            backgroundColor: '#f9f9f9', fontWeight: 'bold',
            color: mesaj.includes('✅') ? 'green' : 'red'
          }}>{mesaj}</p>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;