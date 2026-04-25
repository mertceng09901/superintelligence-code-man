# Gereksinimler


1. ## Giriş Yapma (Mert Acar)

**Açıklama:** Kayıtlı kullanıcıların e-posta ve şifrelerini kullanarak sisteme güvenli bir şekilde erişmesini sağlar.

**API Metodu:** POST /api/auth/login
,


2. ## Kayıt Olma (Mert Acar)

**Açıklama:** Yeni ziyaretçilerin platformda bir hesap oluşturarak üye olmalarını sağlar.

**API Metodu:** POST /api/auth/register



3. ## Ürünleri Görüntüleme (Mert Acar)

**Açıklama:** Kullanıcıların platformda satışta olan tüm telefonları liste halinde görmesini ve filtrelemesini sağlar.

**API Metodu:** GET /api/products



4. ## Ürün Detaylarını Görüntüleme (Mert Acar)

**Açıklama:** Kullanıcıların seçtikleri belirli bir telefonun donanım özelliklerini, fiyatını ve görsellerini detaylı olarak incelemesini sağlar.

**API Metodu:** GET /api/products/:id



5. ## Sepete Ürün Ekleme (Mert Acar)

**Açıklama:** Kullanıcıların satın almak istedikleri telefonları alışveriş sepetlerine dahil etmesini sağlar.

**API Metodu:** POST /api/cart/add



6. ## Sepetten Ürün Kaldırma (Mert Acar)

**Açıklama:** Kullanıcıların alışveriş sepetlerine ekledikleri ürünleri veya iptal etmek istedikleri siparişleri sepetten çıkarmasını sağlar.

**API Metodu:** DELETE /api/cart/remove/:productId



7. ## Alışveriş Sepetini Görüntüleme (Mert Acar)

**Açıklama:** Kullanıcıların sepete ekledikleri tüm ürünleri, sipariş adetlerini ve ödenecek toplam tutarı bir arada görmesini sağlar.

**API Metodu:** GET /api/cart



8. ## Sipariş Özeti Sayfasını Görüntüleme (Mert Acar)

**Açıklama:** Kullanıcıların satın alma işlemini tamamlamadan önce teslimat adresi, kargo bilgileri ve sipariş tutarı gibi detayları son kez kontrol etmesini sağlar.

**API Metodu:** GET /api/orders/checkout-summary



9. ## Ödeme Ekranını Görüntüleme (Mert Acar)

**Açıklama:** Kullanıcıların siparişlerini onaylayıp tamamlamak için ödeme bilgilerini girebilecekleri güvenli arayüzü başlatır.

**API Metodu:** POST /api/payments/create-intent



10. ## Kullanıcı Profilini Görüntüleme (Mert Acar)

**Açıklama:** Üyelerin kendi hesap bilgilerini, geçmiş siparişlerini ve kayıtlı adreslerini görüntülemesini sağlar.

**API Metodu:** GET /api/users/profile



11. ## Kullanıcı Profilini Güncelleme (Mert Acar)

**Açıklama:** Üyelerin ad, soyad, şifre veya iletişim bilgileri gibi kişisel hesap verilerini değiştirmesini sağlar.

**API Metodu:** PUT /api/users/profile



12. ## Satıcı Ürün Panelini Görüntüleme (Mert Acar)

**Açıklama:** Satıcı veya yönetici yetkisine sahip kullanıcıların, platforma ekledikleri tüm telefonları yönetebilecekleri kontrol panelini açar.

**API Metodu:** GET /api/seller/products



13. ## Satıcı Ürün Detaylarını Görüntüleme (Mert Acar)

**Açıklama:** Satıcıların, kendi ekledikleri belirli bir telefonun stok durumu, güncel fiyatı ve teknik detaylarına bakmasını sağlar.

**API Metodu:** GET /api/seller/products/:id



14. ## Satıcı Paneline Ürün Ekleme (Mert Acar)

**Açıklama:** Satıcıların platformda satılmak üzere yeni bir telefon modeli, markası, fiyatı ve görselleriyle birlikte sisteme yüklemesini sağlar.

**API Metodu:** POST /api/seller/products



15. ## Satıcı Panelinden Ürün Silme (Mert Acar)

**Açıklama:** Satıcıların artık satışta olmayan, stokları tükenen veya hatalı eklenen bir telefonu sistemden tamamen kaldırmasını sağlar.

**API Metodu:** DELETE /api/seller/products/:id

