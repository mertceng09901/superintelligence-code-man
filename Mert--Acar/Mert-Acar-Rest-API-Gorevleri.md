# Mert ACAR'ın REST API Metotları

**API Test Videosu:** [Link buraya eklenecek](https://example.com)


**BASE url:**[https://superintelligence-code-man.onrender.com](RENDER LİNKİ)

# Superintelligence Code Man REST API Dokümantasyonu

## 1. Üye Olma

* **Endpoint:** `POST /auth/register`
* **Request Body:**
  ```json
  {
    "email": "kullanici@example.com",
    "password": "Guvenli123!",
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "phone": "+905551234567"
  }
* **Response:** `200 OK` - Giriş başarılı

 ## 2. Giriş Yapma
* **Endpoint:** POST /auth/login

* **Request Body:**

  ```JSON
  {
  "email": "kullanici@example.com",
  "password": "Guvenli123!"
  }

* **Response:** `200 OK` - Giriş başarılı

  ```JSON
  {
  "token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "user": {
    "id": "60d5ec49f1b2c8b1f8e4e1a1",
    "email": "kullanici@example.com",
    "role": "USER"
  }
  }


## 3. Kullanıcı Bilgilerini Görüntüleme
* **Endpoint:** `GET /users/{userId}`

* **Path Parameters:**

    *    `userId` (string, required) - Kullanıcı ID'si

* **Authentication:** Bearer Token gerekli

* **Response:** `200 OK` - Kullanıcı bilgileri başarıyla getirildi


## 4. Kullanıcı Bilgilerini Güncelleme
* **Endpoint:** `PUT /users/{userId}`

* **Path Parameters:**

   *  `userId` (string, required) - Kullanıcı ID'si

* **Request Body:**

  ````JSON
  {
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "yeniemail@example.com",
  "phone": "+905551234567",
  "address": "Örnek Mah. Teknoloji Sok. No:42 Kadıköy/İstanbul"
  }
* **Authentication:** Bearer Token gerekli

* **Response:** `200 OK` - Kullanıcı başarıyla güncellendi


## 5. Kullanıcı Silme
* **Endpoint:** `DELETE /users/{userId}`

* **Path Parameters:**

   *  `userId` (string, required) - Kullanıcı ID'si

* **Authentication:** Bearer Token gerekli (Yönetici yetkisi veya kendi hesabını silme yetkisi)

* **Response:** `204 No Content` - Kullanıcı başarıyla silindi

## 6. Ürünleri Listeleme ve Dinamik Filtreleme
* **Endpoint:** `GET /products`

* **Query Parameters:**

   *  `brand` (string) - Örn: "Apple", "Samsung"

   *  `minPrice, maxPrice` (number) - Fiyat aralığı

   *  `ram, storage` (string) - Donanım özellikleri

  *   `sort` (string) - Sıralama

* **Response:** `200 OK` - Ürün listesi başarıyla getirildi

   ```JSON
   {
     "totalItems": 124,
     "currentPage": 1,
     "products": [
       {
        "id": "60d5ec49f1b2c8b1f8e4e1b1",
        "brand": "Apple",
        "model": "iPhone 15 Pro",
        "price": 65000,
        "specs": { "ram": "8GB", "storage": "256GB" },
        "stock": 45
       }
     ]
    }


## 7. Ürün Detaylarını Görüntüleme
* **Endpoint:** `GET /products/{productId}`

* **Path Parameters:**

   * `productId` (string, required) - Ürün ID'si

* **Response:** `200 OK` - Ürüne ait tüm detaylar başarıyla getirildi


## 8. Yeni Ürün Ekleme
* **Endpoint:** `POST /products`

* **Authentication:** Bearer Token gerekli (Yönetici yetkisi)

* **Request Body:**

  ````JSON
  {
  "brand": "Samsung",
  "model": "Galaxy S24 Ultra",
  "price": 70000,
  "stock": 30,
  "specs": { "ram": "12GB", "storage": "512GB" }
  }

* **Response:** `201 Created` - Ürün başarıyla eklendi

## 9. Ürün Bilgilerini Güncelleme
* **Endpoint:** `PUT /products/{productId}`

* **Path Parameters:**

  *  `productId` (string, required) - Ürün ID'si

* **Authentication:** Bearer Token gerekli (Yönetici yetkisi)

* **Request Body:**

  ````JSON
   {
     "price": 68000,
      "stock": 25
   }

* **Response:** `200 OK` - Ürün bilgileri başarıyla güncellendi


## 10. Ürün Silme
* **Endpoint:** `DELETE /products/{productId}`

* **Path Parameters:**

    * `productId`` (string, required) - Ürün ID'si

* **Authentication:** Bearer Token gerekli (Yönetici yetkisi)

* **Response:** `204 No Content` - Ürün başarıyla silindi


## 11. Sepete Ürün Ekleme
* **Endpoint:** `POST /cart/items`

* **Authentication:** Bearer Token gerekli

* **Request Body:**

   ````JSON
    {
      "productId": "60d5ec49f1b2c8b1f8e4e1b1",
      "quantity": 1,
      "selectedColor": "Titanium"
    }

* **Response:** `200 OK` - Ürün sepete başarıyla eklendi


## 12. Sepeti Görüntüleme
* **Endpoint:** `GET /cart` 

* **Authentication:** Bearer Token gerekli

* **Response:** `200 OK` - Sepet detayları başarıyla getirildi


## 13. Sipariş Oluşturma ve Ödeme
* **Endpoint:** `POST /orders`

* **Authentication:** Bearer Token gerekli

* **Request Body:**

   ````JSON
    {
      "shippingAddressId": "60d5ec49f1b2c8b1f8e4e1b2",
      "paymentMethod": "CREDIT_CARD",
      "paymentToken": "tok_visa_12345" 
    }

* **Response:** `201 Created` - Sipariş başarıyla oluşturuldu

   ````JSON
   {
      "orderId": "ORD-20260307-8912",
      "status": "PAYMENT_SUCCESS",
      "deliveryStatus": "PREPARING",
      "totalAmount": 65000
    }



## 14. Sipariş Geçmişini Görüntüleme
* **Endpoint:** `GET /orders`

* **Authentication:** Bearer Token gerekli

* **Response:** `200 OK` - Sipariş geçmişi başarıyla getirildi

