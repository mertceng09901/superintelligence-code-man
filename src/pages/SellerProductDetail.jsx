import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function SellerProductDetail() {
  const { id } = useParams(); // Linkteki ürün ID'sini yakalar
  const [productDetail, setProductDetail] = useState(null);
  const navigate = useNavigate();

  // 13. GEREKSİNİM: Satıcı Ürün Detaylarını Görüntüleme
  useEffect(() => {
    const urunDetayiGetir = async () => {
      try {
        const response = await api.get(`/seller/products/${id}`);
        setProductDetail(response.data);
      } catch (error) {
        console.error("Ürün detayı çekilemedi", error);
      }
    };
    urunDetayiGetir();
  }, [id]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '500px', margin: '0 auto', marginTop: '50px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>📦 Ürün Detayı</h2>
      
      {productDetail ? (
        <div>
          <p><strong>Sistem Mesajı:</strong> {productDetail.message}</p>
          <p><strong>İncelenen Ürün ID:</strong> {productDetail.productId || id}</p>
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
            <em>(Backend'den detaylı bilgiler geldiğinde burada sergilenecektir.)</em>
          </div>
        </div>
      ) : (
        <p>Detaylar yükleniyor...</p>
      )}

      <button onClick={() => navigate('/seller')} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        ← Satıcı Paneline Dön
      </button>
    </div>
  );
}

export default SellerProductDetail;