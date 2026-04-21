# 🚀 Superintelligence Mobile 

**Proje Sahibi:** Mert Acar  

---

# 📱 Superintelligence Mobile - UI/UX ve Backend Eşleşme Raporu

**Proje:** Superintelligence E-Ticaret Mobil Uygulaması  
**Backend Altyapısı:** Node.js, Express, MongoDB  
**Mobil Backend Sorumlusu:** Mert Acar
**Sistem Mimarisi:** React Native (Frontend) + Node.js/Express (Backend) + MongoDB (Database)  
**Backend URL:** `https://superintelligence-code-man.onrender.com`


---

## 1. Üye Olma (Kayıt) Ekranı
*Kullanıcının sisteme dahil olduğu ekran.*

- **API Endpoint:** `POST /api/auth/register`
- **UI Bileşenleri (İstek Gövdesi - req.body):**
  - **Ad & Soyad:** `firstName`, `lastName`
  - **İletişim:** `email`, `phone` (Telefon alanı eklendi!)
  - **Güvenlik:** `password`, Şifre Tekrar.
- **Kritik UI Kuralı:** Eğer backend'den `400 Bad Request` ("Bu e-posta adresi zaten kullanımda.") hatası gelirse, formun altında kırmızı bir uyarı metni çıkmalıdır.
- **Başarı Durumu:** Kayıt başarılıysa dönen `token`, `AsyncStorage` içine kaydedilir.

## 2. Kullanıcı Profil ve Bilgi Güncelleme
*Kullanıcı verilerinin yönetimi (E-posta değiştirilemez).*

- **API Endpoint'leri:** - Görüntüleme: `GET /api/auth/profile` veya `GET /api/users/profile`
  - Güncelleme: `PUT /api/users/profile`
- **UI Bileşenleri:**
  - **Sabit Alan:** E-posta adresi ekranda görünür ancak **düzenlenemez** (Backend kısıtlaması).
  - **Düzenlenebilir Alanlar (req.body):** `firstName`, `lastName`, `phone`.
- **UX Davranışı:** `updateProfile` başarılı olduğunda (200 OK), güncel bilgiler state'e yazılır ve ekranda anında değişir.

## 3. Sepet Yönetimi (Ürün Ekleme, Güncelleme, Silme)
*`Cart.js` modeline tam uyumlu sepet ekranı.*

- **API Endpoint'leri:**
  - Sepeti Getir: `GET /api/cart`
  - Sepete Ekle/Güncelle: `POST /api/cart/add` (veya benzeri)
  - Ürün Çıkar: `DELETE /api/cart/:productId`
- **UI Bileşenleri (Sepete Eklerken req.body):**
  - `productId`: Ürünün ID'si.
  - `quantity`: Seçilen adet (Artı/Eksi butonlarıyla belirlenir).
  - `selectedColor`: Ürünün rengi (Örn: "Titanium" - Dropdown veya renk butonlarından seçilir).
- **UX Davranışı:** - Çöp tenekesi ikonuna basıldığında `DELETE` isteği atılır. `totalAmount` backend'den yeniden döner (populate edilmiş şekilde) ve ekrandaki "Ara Toplam" güncellenir.

## 4. Sipariş ve Ödeme Ekranı (Checkout)
*Siparişi veritabanına yazdırma aşaması.*

- **API Endpoint'leri:**
  - Özet Çekme: `GET /api/orders/checkout-summary`
  - Sipariş Oluşturma: `POST /api/orders`
- **UI Bileşenleri (Sipariş Oluştururken req.body):**
  - `shippingAddress`: Kullanıcının gireceği açık adres input alanı.
  - `paymentMethod`: Ödeme yöntemi seçimi (Kredi Kartı, Havale vb. Radio butonları).
  - **Fatura Özeti:** `getCheckoutSummary`'den dönen `totalAmount` gösterimi.
- **Başarı Durumu:** Sipariş oluştuğunda (201 Created), sepet backend tarafında otomatik temizlendiği için mobil tarafta da sepet state'i sıfırlanır ve "Sipariş Başarılı" ekranına yönlendirilir.