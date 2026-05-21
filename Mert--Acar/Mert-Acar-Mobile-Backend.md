# 🚀 Mert Acar — Mobil Backend Görevleri ve Kanıtları

**Proje:** Superintelligence E-Ticaret Mobil Uygulaması  
**Backend Stack:** Node.js, Express.js, MongoDB (Mongoose), Redis, JWT  
**Deployment:** Render Cloud — `https://superintelligence-code-man.onrender.com`  
**Grup Üyesi:** Mert Acar  
**Sistem Mimarisi:** React Native (Frontend) ↔ Node.js/Express (Backend) ↔ MongoDB Atlas (Database)

---

## 🗂️ Backend Proje Yapısı

```
superintelligence-code-man-backend/
├── server.js                      # Express uygulama giriş noktası
├── src/
│   ├── app.js                     # Middleware, route kayıtları
│   ├── models/
│   │   ├── user.js                # User şeması (role: USER/ADMIN)
│   │   ├── Product.js             # Ürün şeması (images[] dizisi)
│   │   ├── Cart.js                # Sepet şeması
│   │   └── Order.js               # Sipariş şeması
│   ├── controllers/
│   │   ├── authController.js      # Kayıt, giriş, profil, şifre sıfırlama
│   │   ├── productController.js   # CRUD + filtreleme
│   │   ├── cartController.js      # Sepet yönetimi
│   │   ├── orderController.js     # Sipariş oluşturma
│   │   └── userController.js      # Kullanıcı yönetimi
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── userRoutes.js
│   │   └── sellerRoutes.js
│   ├── middlewares/
│   │   └── authMiddleware.js      # JWT doğrulama, admin kontrol
│   ├── utils/                     # Redis cache yardımcıları
│   └── seed.js                    # 28 ürün + kullanıcı seed scripti
└── .env                           # MONGO_URI, JWT_SECRET, REDIS_URL
```

---

## 📡 REST API Endpoint Listesi

### 🔐 Auth (Kimlik Doğrulama)

| Metot | Endpoint | Açıklama | Auth |
|-------|----------|----------|------|
| `POST` | `/api/auth/register` | Yeni kullanıcı kaydı | ❌ |
| `POST` | `/api/auth/login` | Giriş, JWT döner | ❌ |
| `GET` | `/api/auth/profile` | Oturum açık kullanıcı bilgisi | ✅ Token |
| `POST` | `/api/auth/forgot-password` | Şifre sıfırlama isteği | ❌ |

---

### 📦 Ürünler

| Metot | Endpoint | Açıklama | Auth |
|-------|----------|----------|------|
| `GET` | `/api/products` | Ürün listesi (filtre + sıralama) | ❌ |
| `GET` | `/api/products/:productId` | Tekil ürün detayı | ❌ |
| `POST` | `/api/products` | Yeni ürün ekle | ✅ Admin |
| `PUT` | `/api/products/:productId` | Ürün güncelle | ✅ Admin |
| `DELETE` | `/api/products/:productId` | Ürün sil | ✅ Admin |

**Query Parametreleri (`GET /api/products`):**
```
?brand=Apple
?minPrice=10000&maxPrice=50000
?sort=price_asc | price_desc
```

**Ürün Modeli (MongoDB):**
```json
{
  "brand": "Apple",
  "model": "iPhone 15 Pro Max",
  "price": 84999,
  "stock": 25,
  "specs": { "ram": "8GB", "storage": "256GB" },
  "imageUrl": "https://...",
  "images": ["https://...1.jpg", "https://...2.jpg", "https://...3.jpg"]
}
```

---

### 🛒 Sepet

| Metot | Endpoint | Açıklama | Auth |
|-------|----------|----------|------|
| `GET` | `/api/cart` | Kullanıcının sepetini getir | ✅ Token |
| `POST` | `/api/cart/add` | Sepete ürün ekle | ✅ Token |
| `DELETE` | `/api/cart/remove/:productId` | Sepetten ürün çıkar | ✅ Token |

**Sepete Ekle (req.body):**
```json
{
  "productId": "60d5ec49...",
  "quantity": 2,
  "selectedColor": "Standart"
}
```

---

### 📋 Siparişler

| Metot | Endpoint | Açıklama | Auth |
|-------|----------|----------|------|
| `GET` | `/api/orders` | Kullanıcının siparişleri | ✅ Token |
| `POST` | `/api/orders` | Yeni sipariş oluştur | ✅ Token |
| `GET` | `/api/orders/checkout-summary` | Ödeme özeti | ✅ Token |

**Sipariş Oluştur (req.body):**
```json
{
  "shippingAddress": "Örnek Mah. No:42 İstanbul",
  "paymentMethod": "Kredi Kartı"
}
```

**Sipariş Yanıtı (201 Created):**
```json
{
  "orderId": "...",
  "status": "PAYMENT_SUCCESS",
  "totalAmount": 84999
}
```

---

### 👤 Kullanıcılar

| Metot | Endpoint | Açıklama | Auth |
|-------|----------|----------|------|
| `GET` | `/api/users/profile` | Profil bilgilerini getir | ✅ Token |
| `PUT` | `/api/users/profile` | Profil güncelle (ad, soyad, telefon) | ✅ Token |
| `GET` | `/api/users` | Tüm kullanıcılar | ✅ Admin |
| `DELETE` | `/api/users/:userId` | Kullanıcı sil | ✅ Admin |

---

### 👑 Admin / Seller Paneli

| Metot | Endpoint | Açıklama | Auth |
|-------|----------|----------|------|
| `GET` | `/api/seller/products` | Admin ürün listesi | ✅ Admin |
| `GET` | `/api/seller/products/:id` | Admin ürün detayı | ✅ Admin |
| `POST` | `/api/seller/products` | Admin ürün ekle | ✅ Admin |
| `DELETE` | `/api/seller/products/:id` | Admin ürün sil | ✅ Admin |

---

## 🔑 JWT Kimlik Doğrulama Akışı

```
1. POST /api/auth/login  →  { token, user }
2. Mobil: AsyncStorage.setItem('userToken', token)
3. Her istek: Authorization: Bearer <token>
4. Backend: authMiddleware → jwt.verify() → req.user
5. 401 hatası → AsyncStorage temizlenir → Login ekranı
```

**Kullanıcı Rolleri:**
- `USER` → Normal alışveriş işlemleri
- `ADMIN` → Ürün yönetimi + kullanıcı yönetimi + dashboard

---

## ⚡ Redis Cache Entegrasyonu

- Ürün listesi (`GET /api/products`) Redis'te önbelleğe alınır
- Cache hit → `fromCache: true` döner → Mobilde ⚡ rozeti gösterilir
- Cache süresi: 5 dakika

---

## 🌱 Seed Verisi

28 adet telefon ürünü ile veritabanı başlangıç verisi:

```bash
node src/seed.js
```

**Markalar:** Apple (6), Samsung (7), Xiaomi (6), Google (3), OnePlus (3), Huawei (3)  
**Her ürün:** `imageUrl` + `images[3]` (çoklu resim carousel desteği)

**Test Hesapları:**
| Rol | E-posta | Şifre |
|-----|---------|-------|
| Admin | `admin@superintelligence.com` | `admin123` |
| User | `user@superintelligence.com` | `user123` |

---

## 🚀 Deployment

- **Platform:** Render Cloud (Free Tier)
- **URL:** `https://superintelligence-code-man.onrender.com`
- **Database:** MongoDB Atlas
- **Ortam Değişkenleri:** `MONGO_URI`, `JWT_SECRET`, `REDIS_URL`

---

## 🔗 Bağlantılar

- **Backend URL:** [https://superintelligence-code-man.onrender.com](https://superintelligence-code-man.onrender.com)
- **API Test Videosu:** [YouTube](https://www.youtube.com/watch?v=zOVdJno_Owc)
- **Postman Koleksiyonu:** `Mert--Acar/superintelligence-code-man.postman_collection.json`
