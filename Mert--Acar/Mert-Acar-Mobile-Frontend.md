# 📱 Mert Acar — Mobil Frontend Görevleri ve Kanıtları

**Proje:** Superintelligence E-Ticaret Mobil Uygulaması  
**Teknoloji Stack:** React Native (Expo), Axios, React Navigation, AsyncStorage, expo-linear-gradient  
**Backend URL:** `https://superintelligence-code-man.onrender.com/api`  
**Grup Üyesi:** Mert Acar  
**Çalışılan Branch:** `master`

---

## 🎯 Sorumlu Olunan Ekranlar ve Bileşenler

| Ekran | Dosya | Açıklama |
|-------|-------|----------|
| Ana Sayfa (Ürün Listesi) | `HomeScreen.js` | Marka filtresi, arama, 2 sütun grid |
| Ürün Detayı | `ProductDetailScreen.js` | Çoklu resim carousel, adet seçici |
| Kayıt Ekranı | `RegisterScreen.js` | Form validasyonu, JWT kayıt |
| Giriş Ekranı | `LoginScreen.js` | JWT login, AsyncStorage |
| Şifremi Unuttum | `ForgotPasswordScreen.js` | E-posta ile şifre sıfırlama |
| Sepet Ekranı | `CartScreen.js` | Ürün silme/güncelleme, toplam |
| Ödeme Ekranı | `CheckoutScreen.js` | Kredi kartı formu, sipariş oluşturma |
| Kullanıcı Profili | `ProfileScreen.js` | Bilgi görüntüleme, sipariş geçmişi |
| Profil Güncelleme | `ProfileEditScreen.js` | firstName, lastName, phone düzenleme |
| Siparişlerim | `OrdersScreen.js` | Sipariş listesi ve durumları |
| Admin Dashboard | `AdminDashboardScreen.js` | Kullanıcı/ürün/sipariş istatistikleri |
| Admin Ürün Paneli | `AdminProductsScreen.js` | Ürün listeleme, silme |
| Ürün Ekle/Düzenle | `AddEditProductScreen.js` | Admin ürün yönetimi formu |

---

## 1. 🏠 Ana Sayfa — Ürün Listeleme Ekranı (`HomeScreen.js`)

- **API Endpoint:** `GET /api/products`
- **Özellikler:**
  - Marka filtresi: `Tümü`, `Apple`, `Samsung`, `Xiaomi`, `Google`, `OnePlus`, `Huawei`
  - Arama çubuğu (model/marka üzerinden anlık filtreleme)
  - 2 sütunlu ürün grid görünümü (`FlatList numColumns={2}`)
  - Pull-to-Refresh desteği
  - Redis Cache göstergesi (⚡ Hızlı rozeti)
  - Fade-in animasyonu ile ürün yükleme
- **UI Bileşenleri:** `LinearGradient` header, `TextInput` arama, marka chip'leri, ürün kartları

---

## 2. 📦 Ürün Detay Ekranı (`ProductDetailScreen.js`)

- **API Endpoint:** `GET /api/products/:productId`
- **🆕 Çoklu Resim Carousel:**
  - Her ürün için 3 adet resim desteklenir (`images[]` dizisi)
  - `FlatList` + `pagingEnabled` ile yatay kaydırma (swipe)
  - Dot göstergeleri (tıklanabilir, aktif dot genişler)
  - Sağ üstte `1/3` formatında resim sayacı
  - Eski ürünlerde `imageUrl` alanı tek resim olarak gösterilir (geriye dönük uyumlu)
- **UI Bileşenleri:**
  - Marka gradient rozeti
  - Stok durumu (yeşil/kırmızı badge)
  - Teknik özellikler kartı (RAM, Depolama)
  - `+` / `-` adet seçici
  - Alt çubuk: Toplam fiyat + "Sepete Ekle" gradient butonu

---

## 3. 📝 Kayıt Ekranı (`RegisterScreen.js`)

- **API Endpoint:** `POST /api/auth/register`
- **Form Alanları (req.body):** `firstName`, `lastName`, `email`, `phone`, `password`, `passwordConfirm`
- **Validasyonlar:**
  - Tüm alanlar dolu mu kontrolü
  - Şifre eşleşme kontrolü
  - Backend `400` hatası → kırmızı uyarı mesajı
- **Başarı:** Dönen JWT token `AsyncStorage`'a kaydedilir, otomatik giriş yapılır

---

## 4. 🔐 Giriş Ekranı (`LoginScreen.js`)

- **API Endpoint:** `POST /api/auth/login`
- **Form Alanları (req.body):** `email`, `password`
- **Özellikler:**
  - JWT token + kullanıcı verisi `AsyncStorage`'a kaydedilir
  - Role bazlı yönlendirme: `ADMIN` → AdminDashboard, `USER` → UserHome
  - Şifre göster/gizle toggle
  - "Şifremi Unuttum" → `ForgotPasswordScreen`'e yönlendirme

---

## 5. 🔑 Şifremi Unuttum Ekranı (`ForgotPasswordScreen.js`)

- **API Endpoint:** `POST /api/auth/forgot-password`
- **Form Alanları:** `email`
- **Özellikler:** E-posta doğrulama, SMS/e-posta bildirimi simülasyonu

---

## 6. 🛒 Sepet Ekranı (`CartScreen.js`)

- **API Endpoint'leri:**
  - Sepeti Getir: `GET /api/cart`
  - Ürün Sil: `DELETE /api/cart/remove/:productId`
- **Özellikler:**
  - Ürün listesi, adet ve fiyat gösterimi
  - Çöp kutusu ile ürün silme
  - Toplam tutar otomatik güncelleme
  - Boş sepet durumu görsel feedback
  - "Ödemeye Geç" → `CheckoutScreen`

---

## 7. 💳 Ödeme Ekranı (`CheckoutScreen.js`)

- **API Endpoint'leri:**
  - Sipariş Oluştur: `POST /api/orders`
- **Form Alanları (req.body):** `shippingAddress`, `paymentMethod`, kredi kartı bilgileri
- **Özellikler:**
  - Kredi kartı numarası formatlama (xxxx xxxx xxxx xxxx)
  - Son kullanma tarihi formatı (MM/YY)
  - Sipariş başarılı → sepet sıfırlanır, "Siparişlerim" ekranına yönlendirme

---

## 8. 👤 Profil Ekranı (`ProfileScreen.js`)

- **API Endpoint:** `GET /api/users/profile`
- **Gösterilen Alanlar:** `firstName`, `lastName`, `email`, `phone`, `role`
- **Özellikler:**
  - Sipariş özeti (son siparişler)
  - "Profili Düzenle" → `ProfileEditScreen`
  - Çıkış yap → AsyncStorage temizlenir

---

## 9. ✏️ Profil Güncelleme Ekranı (`ProfileEditScreen.js`)

- **API Endpoint:** `PUT /api/users/profile`
- **Düzenlenebilir Alanlar (req.body):** `firstName`, `lastName`, `phone`
- **Kısıtlama:** E-posta alanı görünür ama düzenlenemez (backend kuralı)

---

## 10. 📋 Siparişlerim Ekranı (`OrdersScreen.js`)

- **API Endpoint:** `GET /api/orders`
- **Gösterilen Bilgiler:** Sipariş ID, tarih, tutar, durum, ürün listesi

---

## 11. 👑 Admin Dashboard (`AdminDashboardScreen.js`)

- **API Endpoint'leri:** `GET /api/users` (kullanıcı istatistikleri), `GET /api/products`, `GET /api/orders`
- **Özellikler:** Toplam kullanıcı/ürün/sipariş sayıları, hızlı yönetim linkleri

---

## 12. 🛠️ Admin Ürün Paneli (`AdminProductsScreen.js` & `AddEditProductScreen.js`)

- **API Endpoint'leri:**
  - Listele: `GET /api/products`
  - Ekle: `POST /api/products`
  - Güncelle: `PUT /api/products/:productId`
  - Sil: `DELETE /api/products/:productId`
- **Form Alanları:** `brand`, `model`, `price`, `stock`, `specs.ram`, `specs.storage`, `imageUrl`, `images[]`
- **🆕 Çoklu resim desteği:** `images` dizisine URL ekleme/çıkarma arayüzü

---

## 🗂️ Proje Dosya Yapısı

```
superintelligence-code-man-mobile-version/
├── src/
│   ├── app.js                     # Ana navigasyon (Stack + Tab)
│   ├── screens/
│   │   ├── HomeScreen.js          # Ürün listesi
│   │   ├── ProductDetailScreen.js # Ürün detayı + carousel
│   │   ├── LoginScreen.js         # Giriş
│   │   ├── RegisterScreen.js      # Kayıt
│   │   ├── ForgotPasswordScreen.js# Şifre sıfırlama
│   │   ├── CartScreen.js          # Sepet
│   │   ├── CheckoutScreen.js      # Ödeme
│   │   ├── ProfileScreen.js       # Profil
│   │   ├── ProfileEditScreen.js   # Profil düzenleme
│   │   ├── OrdersScreen.js        # Siparişler
│   │   ├── AdminDashboardScreen.js# Admin panel
│   │   ├── AdminProductsScreen.js # Admin ürün listesi
│   │   └── AddEditProductScreen.js# Admin ürün ekle/düzenle
│   ├── config/
│   │   ├── api.native.js          # Axios + JWT interceptor
│   │   └── theme.js               # Renkler, gölgeler, boyutlar
│   ├── context/
│   │   └── AuthContext.js         # Global auth state
│   └── seed.js                    # 28 örnek ürün seed scripti
├── app.json                       # Expo konfigürasyonu
└── eas.json                       # EAS Build konfigürasyonu
```

---

## 🎨 Tasarım Sistemi

| Token | Değer |
|-------|-------|
| Primary Gradient | `#667eea → #764ba2` |
| Background | `#F0F2F5` |
| Card Shadow | `elevation: 4` |
| Border Radius | `16px` (kart), `8px` (buton) |
| Font | Sistem font (React Native default) |

---

## 🔗 Bağlantılar

- **Backend URL:** [https://superintelligence-code-man.onrender.com](https://superintelligence-code-man.onrender.com)
- **API Test Videosu:** [YouTube](https://www.youtube.com/watch?v=zOVdJno_Owc)
- **APK:** EAS Build (`com.superintelligence.mobile`) — Expo Project ID: `fd9aa8a6-93ae-4552-a5b9-e9b3e7ba3a2e`
