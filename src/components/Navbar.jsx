import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav style={{
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '0 50px', 
      height: '80px',
      backgroundColor: '#fff', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000
    }}>
      <h2 onClick={() => navigate('/home')} style={{ cursor: 'pointer', color: '#ff6000', fontSize: '1.8rem', fontWeight: '800' }}>
        HEPSİBURADA <span style={{color: '#333', fontSize: '1rem'}}>Clone</span>
      </h2>

      <div style={{ flex: 1, margin: '0 40px', maxWidth: '600px' }}>
        <input 
          type="text" 
          placeholder="Ürün, kategori veya marka ara..." 
          style={{ 
            width: '100%', 
            padding: '12px 20px', 
            borderRadius: '8px', 
            border: '1px solid #e6e6e6',
            backgroundColor: '#f3f3f3',
            outline: 'none'
          }} 
        />
      </div>

      <div style={{ display: 'flex', gap: '25px', alignItems: 'center', fontWeight: '600' }}>
        <span onClick={() => navigate('/home')} style={{ cursor: 'pointer', color: '#333' }}>Ana Sayfa</span>
        <div onClick={() => navigate('/cart')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{fontSize: '1.2rem'}}>🛒</span> Sepetim
        </div>
        <button 
          onClick={() => navigate('/seller')} 
          style={{ 
            backgroundColor: '#333', 
            color: '#fff', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
          Satıcı Paneli
        </button>
      </div>
    </nav>
  );
}
export default Navbar;