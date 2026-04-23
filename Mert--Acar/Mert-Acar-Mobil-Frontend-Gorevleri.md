# 🎨 Mert Acar - Mobil Frontend Görev Listesi 
**Mobil Front-end demo Videosu:** [Link buraya eklenecek](https://example.com)


**Proje:** Superintelligence Mobile  
**Teknoloji:** React Native, Axios, React Navigation  
**Backend:** `https://superintelligence-code-man.onrender.com`

---

## 1. Üye Olma (Kayıt) Ekranı
**API Endpoint:** `POST /api/auth/register`

### 📋 Görev Tanımı
Kullanıcının sisteme ilk kaydını gerçekleştirecek formun tasarlanması ve backend entegrasyonu.

### 🛠 UI Bileşenleri (req.body)
* **Ad & Soyad:** `firstName` ve `lastName` input alanları.
* **İletişim:** `email` (keyboard: email-address) ve `phone` (Telefon numarası zorunludur).
* **Güvenlik:** `password` ve Şifre Tekrar (secureTextEntry).
* **Aksiyon:** "Kayıt Ol" butonu ve giriş ekranına yönlendirme linki.

### ✅ Validasyon & UX
* **Kontrol:** Email formatı ve şifre eşleşmesi (min 8 karakter, büyük/küçük harf, rakam).
* **Hata Yönetimi:** "Bu e-posta adresi zaten kullanımda" (400) uyarısının gösterilmesi.
* **Başarı:** Kayıt sonrası dönen token'ın `AsyncStorage`'a kaydedilmesi.

---

## 2. Kullanıcı Profil Görüntüleme Ekranı
**API Endpoint:** `GET /api/users/profile`

### 📋 Görev Tanımı
Kullanıcının mevcut bilgilerinin (isim, e-posta, telefon) sunucudan çekilip gösterilmesi.

### 🛠 UI Bileşenleri
* **Başlık:** Profil fotoğrafı (Avatar) ve büyük harflerle Ad Soyad.
* **Bilgiler:** E-posta (düzenlenemez simgesiyle) ve Telefon numarası.
* **Navigasyon:** "Profili Düzenle" ve "Siparişlerim" butonları.

### 🚀 Kullanıcı Deneyimi (UX)
* **Yükleme:** Veri çekilirken `ActivityIndicator` veya Skeleton gösterimi.
* **Yenileme:** Pull-to-refresh (ekranı aşağı çekerek veriyi tazeleme).

---

## 3. Kullanıcı Profil Düzenleme Ekranı
**API Endpoint:** `PUT /api/users/profile`

### 📋 Görev Tanımı
Kullanıcının kişisel bilgilerini güncelleyebileceği interaktif form.

### 🛠 UI Bileşenleri (req.body)
* **Düzenlenebilir Alanlar:** `firstName`, `lastName`, `phone`.
* **Kısıtlama:** Backend kuralı gereği Email adresi değiştirilemez.
* **Butonlar:** "Kaydet" ve "İptal".

### ✅ Validasyon & UX
* **Optimistic Update:** Kaydet'e basıldığında UI'da isim anında güncellenir.
* **Güvenlik:** Değişiklik varken çıkmaya çalışıldığında "Onay Diyaloğu" gösterilir.

---

## 4. Sepet ve Sipariş Yönetimi (Kritik Akış)
**API Endpoint'leri:** `GET /api/cart`, `POST /api/cart`, `DELETE /api/cart/:productId`, `POST /api/orders`

### 📋 Görev Tanımı
Ürün miktarlarını güncelleme, sepetten ürün silme ve siparişi tamamlama sürecinin yönetimi.

### 🛠 İşlevler & UI
* **Miktar Güncelleme (POST):** Sepetteki ürünlerin yanındaki + ve - butonları ile `quantity` değerini güncelleme.
* **Ürün Silme (DELETE):** Çöp kutusu ikonuna basıldığında `productId` üzerinden ürünü sepetten çıkarma.
* **Sipariş Oluşturma (POST):** `shippingAddress` (Adres) ve `paymentMethod` (Ödeme Yöntemi) girilerek siparişi tamamlama.

### 🚀 Kullanıcı Deneyimi (UX)
* **Hesaplama:** Her miktar değişiminde `totalAmount` (toplam tutar) bilgisinin anlık güncellenmesi.
* **Başarı:** Başarılı sipariş sonrası sepetin temizlenmesi ve kullanıcıya başarı mesajı gösterilmesi.