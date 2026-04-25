# Web Frontend Görev Dağılımı

**Web Frontend Adresi:** [https://superintelligence-code-man.vercel.app](https://superintelligence-code-man.vercel.app)  
# 🌐 Web Frontend Geliştirme ve Görev Dokümantasyonu

**Proje Adı:** Superintelligence Code Man  
**Web Frontend Adresi:** [https://superintelligence-code-man.vercel.app](https://superintelligence-code-man.vercel.app)  
**Geliştirici:** Mert (Solo Developer)

Bu doküman, uygulamanın kullanıcı arayüzü (UI) ve kullanıcı deneyimi (UX) standartlarını, teknik prensiplerini ve tek kişilik geliştirme sürecindeki görev takvimini listeler.

---

## 👤 Geliştirici Sorumluluk Alanları (Solo Geliştirme)

Proje tek kişi tarafından yürütüldüğü için tüm süreçler aşağıdaki fazlara ayrılmıştır:

1. **UI/UX Tasarım ve Prototipleme:** Sayfa düzenlerinin responsive (uyumlu) tasarlanması.
2. **Frontend Mimari:** React + Vite yapısının kurulması ve klasör düzeni.
3. **API Entegrasyonu:** Render üzerindeki Node.js backend ile Axios köprüsünün kurulması.
4. **State Management:** Kullanıcı oturum ve sepet verilerinin yönetimi (Context API/Zustand).
5. **Deployment & Optimization:** Vercel üzerinde canlıya alma ve performans iyileştirmeleri.

---

## 🛠 Genel Web Frontend Prensipleri

### 1. Responsive Tasarım
* **Mobile-First Approach:** Tasarımlar önce mobil cihazlar için optimize edilir.
* **Breakpoints:** * Mobile: < 768px | Tablet: 768px - 1024px | Desktop: > 1024px
* **Layout:** CSS Flexbox ve Grid sistemleri ile esnek yapı.

### 2. Tasarım Sistemi
* **Framework:** Tailwind CSS / Bootstrap.
* **Renk Paleti:** Proje genelinde tutarlı CSS değişkenleri.
* **İkonografi:** Lucide-React / FontAwesome.

### 3. Performans Optimizasyonu
* **Lazy Loading:** Sayfa bazlı (Route-based) kod bölme.
* **Asset Management:** Görsellerin WebP formatında optimize edilmesi.
* **Vite Build:** Hızlı derleme ve küçük bundle boyutu.

### 4. API Entegrasyonu (Kritik)
* **Base URL:** `import.meta.env.VITE_API_URL` üzerinden Render backend bağlantısı.
* **Interceptor:** Her istekte `localStorage` üzerinden Token kontrolü ve Authorization Header enjeksiyonu.
* **Loading States:** Tüm API isteklerinde kullanıcıya "Yükleniyor" bildirimi.

### 5. SEO ve Erişilebilirlik
* **Semantic HTML:** `main`, `section`, `nav`, `footer` etiketlerinin doğru kullanımı.
* **Meta Tags:** Her sayfa için dinamik `title` ve `description`.
* **Alt Text:** Tüm görseller için erişilebilirlik açıklamaları.

---

## 🚀 Build ve Deployment Süreci

* **Build Tool:** Vite
* **Platform:** Vercel
* **Environment Değişkenleri:**
    * `VITE_API_URL`: `https://superintelligence-code-man.onrender.com/api`
* **CI/CD:** GitHub `main` veya `frontend-yapi` dalına yapılan her push işlemi sonrası otomatik deployment.

---

