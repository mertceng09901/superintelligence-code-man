import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function SellerDashboard() {
  const [products, setProducts]     = useState([]);
  const [editingId, setEditingId]   = useState(null);
  const [newProduct, setNewProduct] = useState({
    model: '', price: '', stock: '', ram: '', storage: '', imageUrl: ''
  });
  const navigate = useNavigate();

  // Kullanıcı bilgisini localStorage'dan al (rol göstermek için)
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const urunleriGetir = async () => {
    try {
      // DÜZELTME: Eski kod /seller/products kullanıyordu
      // Ama ürün listesi /products endpoint'inden geliyor
      const response = await api.get('/products');
      const data = response.data.products || response.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ürünler getirilemedi:', error);
    }
  };

  useEffect(() => {
    urunleriGetir();
  }, []);

  // Güncelleme modunu aç — formu o ürünün bilgileriyle doldur
  const guncellemeyeBasla = (product) => {
    setEditingId(product._id);
    setNewProduct({
      model:    product.model      || '',
      price:    product.price      || '',
      stock:    product.stock      || '',
      ram:      product.specs?.ram     || '',
      storage:  product.specs?.storage || '',
      imageUrl: product.imageUrl   || ''
    });
    window.scrollTo(0, 0);
  };

  const urunKaydet = async (e) => {
    e.preventDefault();
    const productData = {
      name:    newProduct.model,
      brand:   'Akıllı Telefon',
      model:   newProduct.model,
      price:   Number(newProduct.price),
      stock:   Number(newProduct.stock),
      specs:   { ram: newProduct.ram, storage: newProduct.storage },
      imageUrl: newProduct.imageUrl
    };

    try {
      if (editingId) {
        // DÜZELTME: Güncelleme isteği /seller/products/:id endpoint'ine gidiyor
        await api.put(`/seller/products/${editingId}`, productData);
        alert('✅ Ürün başarıyla güncellendi!');
      } else {
        // DÜZELTME: Ekleme isteği /seller/products endpoint'ine gidiyor
        // Backend bu endpoint'te token + rol kontrolü yapıyor
        await api.post('/seller/products', productData);
        alert('✅ Yeni ürün başarıyla eklendi!');
      }

      // Formu sıfırla
      setEditingId(null);
      setNewProduct({ model: '', price: '', stock: '', ram: '', storage: '', imageUrl: '' });
      urunleriGetir();
    } catch (error) {
      if (error.response?.status === 403) {
        alert('⛔ Bu işlem için yetkiniz yok!');
      } else {
        alert('❌ İşlem sırasında bir hata oluştu: ' + (error.response?.data?.message || ''));
      }
    }
  };

  const urunSil = async (id) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/seller/products/${id}`);
      urunleriGetir();
    } catch (error) {
      if (error.response?.status === 403) {
        alert('⛔ Bu işlem için yetkiniz yok!');
      } else {
        alert('❌ Ürün silinemedi.');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>

      {/* Üst Bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: 'white', padding: '15px 20px', borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '25px'
      }}>
        <div>
          <h2 style={{ margin: 0 }}>🏪 Yönetim Paneli</h2>
          <span style={{
            fontSize: '0.85rem', color: 'white',
            backgroundColor: user.role === 'ADMIN' ? '#dc3545' : '#6f42c1',
            padding: '2px 10px', borderRadius: '12px', fontWeight: 'bold'
          }}>
            {user.role}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/home')}
            style={{ padding: '8px 15px', backgroundColor: '#ff6000', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🛍️ Mağazaya Git
          </button>
          <button
            onClick={() => { localStorage.clear(); navigate('/'); }}
            style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Ürün Ekleme / Güncelleme Formu */}
      <div style={{
        backgroundColor: 'white', padding: '25px', borderRadius: '10px',
        marginBottom: '30px',
        border: editingId ? '2px solid #ffc107' : '1px solid #ddd',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ marginTop: 0 }}>
          {editingId ? '📝 Ürünü Güncelle' : '➕ Yeni Ürün Ekle'}
        </h3>
        <form onSubmit={urunKaydet} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text" placeholder="Model Adı" value={newProduct.model} required
            onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: '1 1 200px' }}
          />
          <input
            type="number" placeholder="Fiyat (TL)" value={newProduct.price} required
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: '1 1 120px' }}
          />
          <input
            type="number" placeholder="Stok Adedi" value={newProduct.stock} required
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: '1 1 120px' }}
          />
          <input
            type="text" placeholder="RAM (örn: 8GB)" value={newProduct.ram}
            onChange={(e) => setNewProduct({ ...newProduct, ram: e.target.value })}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: '1 1 120px' }}
          />
          <input
            type="text" placeholder="Depolama (örn: 256GB)" value={newProduct.storage}
            onChange={(e) => setNewProduct({ ...newProduct, storage: e.target.value })}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: '1 1 120px' }}
          />
          <input
            type="text" placeholder="Resim URL" value={newProduct.imageUrl}
            onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: '1 1 100%' }}
          />

          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <button
              type="submit"
              style={{
                padding: '12px 25px',
                backgroundColor: editingId ? '#ffc107' : '#28a745',
                color: editingId ? 'black' : 'white',
                border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              {editingId ? '💾 Değişiklikleri Kaydet' : '➕ Ürünü Ekle'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setNewProduct({ model: '', price: '', stock: '', ram: '', storage: '', imageUrl: '' });
                }}
                style={{ padding: '12px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                İptal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Ürün Listesi */}
      <h3>📦 Mevcut Ürünler ({products.length} adet)</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {products.map((p) => (
          <div
            key={p._id}
            style={{
              backgroundColor: 'white', border: '1px solid #eee',
              padding: '15px', width: '220px', borderRadius: '10px',
              textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
          >
            <img
              src={p.imageUrl || 'https://placehold.co/200x150?text=Gorsel+Yok'}
              style={{ width: '100%', height: '150px', objectFit: 'contain' }}
              alt={p.model}
            />
            <h4 style={{ margin: '10px 0', fontSize: '0.9rem' }}>{p.model}</h4>
            <p style={{ color: '#ff6000', fontWeight: 'bold', margin: '5px 0' }}>{p.price} TL</p>
            <p style={{ color: '#666', fontSize: '0.8rem', margin: '5px 0' }}>Stok: {p.stock}</p>

            <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
              <button
                onClick={() => guncellemeyeBasla(p)}
                style={{ flex: 1, padding: '8px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✏️ Güncelle
              </button>
              <button
                onClick={() => urunSil(p._id)}
                style={{ flex: 1, padding: '8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🗑️ Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          <p>Henüz ürün yok. Yukarıdan yeni ürün ekleyin.</p>
        </div>
      )}
    </div>
  );
}

export default SellerDashboard;
