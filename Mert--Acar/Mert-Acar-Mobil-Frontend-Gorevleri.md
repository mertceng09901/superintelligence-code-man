# 🎨 Mert Acar'ın Mobil Frontend Görevleri
**Mobile Front-end Demo Videosu:** [Link buraya eklenecek]

# 📱 Superintelligence Mobile - Teknik Uygulama Rehberi 

**Proje:** Superintelligence E-Ticaret Mobil Uygulaması  
**Teknoloji:** React Native, Axios, React Navigation  
**Backend:** Node.js / Render Cloud (`superintelligence-code-man.onrender.com`)

---

## 1. Üye Olma (Kayıt) Ekranı
*Kullanıcının sisteme dahil olduğu ilk nokta.*

- **API Endpoint:** `POST /api/auth/register`
- **UI Bileşenleri (req.body):**
  - **Ad & Soyad:** `firstName`, `lastName`
  - **İletişim:** `email`, `phone` (Telefon alanı backend'de zorunlu!)
  - **Güvenlik:** `password`, `passwordConfirm`
- **Validasyon:**
  - Email format kontrolü (Regex).
  - Şifrelerin birbiriyle eşleşmesi.
- **UX:**
  - Kayıt esnasında `ActivityIndicator` (yükleniyor simgesi).
  - Başarılı kayıt (201 Created) sonrası dönen `token`'ın `AsyncStorage`'a kaydedilmesi.
  - Hata durumunda (400: "Bu e-posta zaten kullanımda") kırmızı uyarı metni.

## 2. Kullanıcı Profil ve Bilgi Güncelleme
*Kullanıcının kendi verilerini yönettiği alan.*

- **API Endpoint:** `GET /api/users/profile` & `PUT /api/users/profile`
- **UI Bileşenleri:**
  - **Görüntüleme:** `firstName`, `lastName`, `email` ve `phone`.
  - **Düzenleme (req.body):** `firstName`, `lastName`, `phone`.
- **UX Özellikleri:**
  - **E-posta Kısıtlaması:** E-posta alanı gösterilir ancak düzenlenemez (Backend kuralı).
  - **Optimistic UI:** "Kaydet"e basınca veri sunucuya giderken ekranda isim anında güncellenir.
  - **Pull-to-Refresh:** Profili aşağı çekince `GET` isteğiyle veriler tazelenir.

## 3. Sepet Yönetimi: Ürün Güncelleme ve Silme
*Alışverişin kalbi olan operasyonel alan.*

- **API Endpoint:**
  - **Listeleme:** `GET /api/cart`
  - **Ekleme/Güncelleme:** `POST /api/cart`
  - **Silme:** `DELETE /api/cart/:productId`
- **İşlevler:**
  - **Ürün Özellikleri:** Sepete eklerken `productId`, `quantity` ve `selectedColor` gönderilir.
  - **Miktar Güncelleme:** `+` ve `-` butonları ile adet değişince `totalAmount` anlık güncellenir.
  - **Ürün Silme:** Çöp kutusu ikonuna basıldığında `productId` üzerinden sepetten çıkarılır.
- **Teknik Detay:** Sepet verileri ve toplam tutar backend ile anlık senkronize edilir.

## 4. Sipariş ve Satın Alma Akışı
*Sepetteki ürünlerin siparişe dönüştüğü an.*

- **API Endpoint:**
  - **Özet:** `GET /api/cart` (sepet verileri üzerinden fatura özeti çıkarılır).
  - **Sipariş Oluşturma:** `POST /api/orders`
- **UI Bileşenleri (Sipariş Oluştururken req.body):**
  - **Teslimat:** `shippingAddress` (Açık adres inputu).
  - **Ödeme:** `paymentMethod` (Kredi Kartı, Havale vb. seçim alanı).
- **Fatura Özeti:** Ara toplam, kargo ve genel toplam net gösterilir.
- **Başarı Durumu:** Sipariş oluşunca (201) kullanıcı "Siparişlerim" ekranına yönlendirilir.