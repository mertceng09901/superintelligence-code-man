# Mert ACAR'ın Web Frontend Görevleri
**Front-end Test Videosu:** [https://www.youtube.com/watch?v=zOVdJno_Owc]

# 🌐 Web Frontend Teknik Gereksinim Dokümantasyonu

**Proje Adı:** Superintelligence Code Man  
**Teknoloji Yığını:** React, Vite, Tailwind CSS / Bootstrap  
**Kapsam:** Full-Stack E-Ticaret Arayüz Yönetimi (15 Temel Gereksinim)

---

## 🔐 Bölüm 1: Kimlik Doğrulama ve Kullanıcı Yönetimi

### 1. Üye Olma (Kayıt) Sayfası
- **API Endpoint:** `POST /api/users/register`
- **UI Bileşenleri:** Ad, Soyad, Email, Şifre, Şifre Tekrar alanları; Loading spinner.
- **Validasyon:** Şifre min 8 karakter; Email regex kontrolü; Boş alan bırakılamaz.
- **UX:** Hatalı alanların altında anlık kırmızı uyarı mesajları (Inline validation).

### 2. Giriş Yapma (Login) Sayfası
- **API Endpoint:** `POST /api/users/login`
- **UI Bileşenleri:** Email ve Şifre inputları; "Şifremi Unuttum" linki.
- **Teknik Detay:** Başarılı girişte `JWT Token`'ın `localStorage`'a kaydedilmesi ve global state güncellemesi.

### 3. Kullanıcı Profil Görüntüleme
- **API Endpoint:** `GET /api/users/profile`
- **UI Bileşenleri:** Kullanıcı avatarı (placeholder), Ad-Soyad, Email ve Üyelik Tarihi kartı.
- **UX:** Veriler çekilirken boş kutu (Skeleton Screen) animasyonu.

### 4. Kullanıcı Profil Düzenleme
- **API Endpoint:** `PUT /api/users/profile`
- **UI Bileşenleri:** Mevcut verilerin inputlarda dolu gelmesi; "Kaydet" ve "İptal" butonları.
- **UX:** Başarılı işlem sonrası sağ üstte "Success Toast" bildirimi.

### 5. Hesap Silme Akışı
- **API Endpoint:** `DELETE /api/users/:id`
- **UI Bileşenleri:** Profil sayfasında "Hesabı Sil" butonu ve ardından açılan Onay Modalı.
- **UX:** Geri dönüşü olmayan işlem için "Danger" (Kırmızı) renk teması.

---

## 🛒 Bölüm 2: Ürün ve Katalog Yönetimi

### 6. Ürün Listeleme (Ana Sayfa)
- **API Endpoint:** `GET /api/products`
- **UI Bileşenleri:** Ürün kartları (Resim, Fiyat, İsim, Sepete Ekle Butonu).
- **UX:** Responsive Grid yapısı (Mobilde 1, Masaüstünde 4 sütun).

### 7. Ürün Detay Sayfası
- **API Endpoint:** `GET /api/products/:id`
- **UI Bileşenleri:** Büyük görsel, detaylı açıklama, stok adedi ve kullanıcı yorumları.
- **UX:** Sayfa içi navigasyon (Breadcrumb) desteği.

### 8. Ürün Arama ve Filtreleme
- **API Endpoint:** `GET /api/products?search=...`
- **UI Bileşenleri:** Header içinde Search Bar; Fiyat ve Kategori bazlı filtreleme paneli.
- **UX:** "Debounce" tekniği ile kullanıcı yazarken anlık sonuç listeleme.

### 9. Stok Durumu Kontrolü
- **Görev:** Backend'den gelen stok verisine göre UI'ın kilitlenmesi.
- **UX:** Stok 0 ise "Tükendi" etiketi ve "Sepete Ekle" butonunun etkisiz (disabled) olması.

---

## 📦 Bölüm 3: Sepet ve Sipariş Süreçleri

### 10. Alışveriş Sepeti Yönetimi
- **State Management:** Context API veya LocalStorage entegrasyonu.
- **UI Bileşenleri:** Ürün listesi, adet seçici (+/-), ürünü sil butonu.
- **UX:** Fiyat toplamının anlık olarak (real-time) güncellenmesi.

### 11. Sipariş Oluşturma (Checkout)
- **API Endpoint:** `POST /api/orders`
- **UI Bileşenleri:** Teslimat adresi formu ve ödeme tipi seçim ekranı (Mockup).
- **UX:** Adım adım ilerleyen (Stepper) ödeme akışı.

### 12. Sipariş Geçmişi
- **API Endpoint:** `GET /api/orders/myorders`
- **UI Bileşenleri:** Geçmiş siparişlerin listelendiği tablo veya kart yapısı.
- **UX:** Sipariş durumu (Hazırlanıyor, Kargoda, Teslim Edildi) takibi.

---

## 👨‍💼 Bölüm 4: Satıcı ve Admin Paneli

### 13. Satıcı Paneli (Dashboard)
- **Görev:** Satıcıya özel istatistiklerin sunulması.
- **UI:** Toplam satış, aktif ürün ve bekleyen sipariş adetlerini gösteren özet kartlar.

### 14. Yeni Ürün Ekleme (Seller Only)
- **API Endpoint:** `POST /api/products`
- **UI Bileşenleri:** Resim URL, Ad, Fiyat, Kategori ve Stok giriş formu.
- **UX:** Resim URL'i girildiğinde anlık "Resim Önizleme" kutusu.

### 15. Ürün Güncelleme ve Silme
- **API Endpoint:** `PUT/DELETE /api/products/:id`
- **UI Bileşenleri:** Ürün yönetim tablosu; her satırda "Düzenle" ve "Sil" ikonları.
- **UX:** Silme işlemi öncesi "Ürün kalıcı olarak silinecek" uyarısı.

---

## ⚙️ Genel Teknik Standartlar
1. **Responsive Design:** Tailwind/Bootstrap ile %100 mobil uyumluluk.
2. **API Katmanı:** Axios Interceptor kullanarak tüm isteklere `Authorization: Bearer <Token>` eklenmesi.
3. **Error Handling:** Global bir hata yakalayıcı ile 404 ve 500 hatalarının kullanıcıya Toast mesajı ile iletilmesi.