# Mert Acar - Video Sunum (İleri Teknolojiler)

Grup üyelerinden Mert Acar'ın projeye entegre ettiği ve bireysel olarak kullanımlarını açıkladığı teknolojilere ait sunum videoları aşağıdadır. 
*(Her grup üyesi için 3 adet video bulunmalıdır. Kullanılmayan teknolojiler için "Kullanılmadı" yazılmıştır.)*

## 1. RabbitMQ / Kafka Entegrasyonu

* **Kullanılan Teknoloji:** RabbitMQ
* **Kullanım Amacı:** Sipariş oluşturulduğunda (`POST /api/orders`), sipariş işleminin asenkron olarak arka planda kuyruğa alınması ve işlenmesi sağlanmıştır. Bu sayede uygulamanın performansının düşmesi engellenmiştir.
* **Kanıt Videosu:** [RabbitMQ Sunum Videosu (Buraya Link Gelecek)]()

## 2. Redis / Memcached Entegrasyonu

* **Kullanılan Teknoloji:** Redis
* **Kullanım Amacı:** Ürün listesi (`GET /api/products`) çekilirken, veritabanına olan yükü azaltmak için ürünler Redis üzerinde önbelleğe (cache) alınmıştır. İlk istekten sonraki istekler milisaniyeler içinde Redis'ten dönmektedir.
* **Kanıt Videosu:** [Redis Sunum Videosu (Buraya Link Gelecek)]()

## 3. Docker + CI/CD Süreçleri

* **Kullanılan Teknoloji:** Docker ve Docker Compose
* **Kullanım Amacı:** Projenin (Frontend, Node.js Backend, MongoDB, Redis, RabbitMQ) Docker Compose ile tek bir komutla (`docker-compose up`) izole ve taşınabilir bir ortamda ayağa kaldırılması sağlanmıştır.
* **Kanıt Videosu:** [Docker + CI/CD Sunum Videosu (Buraya Link Gelecek)]()
