# Video Sunum

## Sunum Videosu

> **Video Linki:** [https://www.youtube.com/watch?v=zOVdJno_Owc](Youtube linki)

---

## Sunum Yapısı

# 🎙️ Sunum Planı: Superintelligence Code Man

**Proje Sahibi:** Mert (Solo Developer)  
**Sunum Süresi:** ~10 Dakika  
**Canlı Link (Frontend):** [superintelligence-code-man.vercel.app](https://superintelligence-code-man.vercel.app)  
**Canlı Link (API):** [superintelligence-code-man.onrender.com/api](https://superintelligence-code-man.onrender.com/api)

---

## 1. Giriş ve Vizyon (2 Dakika)
* **Selamlama:** "Merhaba, ben Mert. Bugün sizlere tek başıma geliştirdiğim Full-Stack e-ticaret projem 'Superintelligence Code Man'i sunacağım."
* **Problem/Çözüm:** "Amacım; kullanıcıların hızlıca üye olabildiği, güvenli bir şekilde profil yönetebildiği ve backend-frontend haberleşmesinin kusursuz olduğu bir platform oluşturmaktı."
* **Kapsam:** Sunum boyunca Backend (Node.js/Express), Frontend (React/Vite) ve Veritabanı (MongoDB) entegrasyonunu canlı demolarla göstereceğim.

---

## 2. Teknik Altyapı ve Mimari (2 Dakika)
* **Frontend:** React + Vite (Vercel üzerinde host edildi).
* **Backend:** Node.js + Express.js (Render üzerinde host edildi).
* **Database:** MongoDB Atlas (Cloud veritabanı).
* **Bağlantı:** REST API mimarisi ve Axios kullanılarak kurulan dinamik köprü.

---

## 3. Gereksinim Sunumu ve Canlı Demo (8-10 Dakika)

### A. Üyelik ve Kimlik Doğrulama (Auth)
* **Gereksinim:** Yeni kullanıcı kaydı.
* **API:** `POST /api/users/register`
* **Demo Akışı:** 1. Vercel üzerindeki sitede "Kayıt Ol" sayfasına gidilir.
    2. Yeni bir test kullanıcısı oluşturulur.
    3. Kayıt başarılı mesajı gösterilir.
    4. **Kanıt:** MongoDB Atlas arayüzü açılarak yeni kullanıcının 'users' koleksiyonuna düştüğü gösterilir.

### B. Kullanıcı Profili ve Yönetimi
* **Gereksinim:** Profil Görüntüleme ve Güncelleme.
* **API:** `GET /api/users/:id` ve `PUT /api/users/:id`
* **Demo Akışı:**
    1. Oluşturulan kullanıcı ile giriş yapılır.
    2. Profil bilgilerinin backend'den çekilerek ekrana basıldığı gösterilir.
    3. Bilgiler güncellenir ve veritabanında anlık değişimi ispatlanır.

### C. API Güvenliği ve Hata Yönetimi
* **Gereksinim:** 404 Sayfaları ve Hatalı İsteklerin Yakalanması.
* **Demo:** Mevcut olmayan bir API yoluna gidildiğinde backend'in döndürdüğü özel JSON hata mesajı gösterilir.

---

## 4. Sonuç ve Gelecek Hedefler (1 Dakika)
* **Özet:** "Bu projede bir web uygulamasının tüm katmanlarını (Full-Stack) tek başıma kurguladım ve canlıya aldım."
* **Gelecek:** "Sepet sistemi, ödeme entegrasyonu ve admin panelini bir sonraki aşamada eklemeyi planlıyorum."
* **Kapanış:** "Dinlediğiniz için teşekkür ederim. Sorularınız varsa cevaplamaktan mutluluk duyarım."

---

