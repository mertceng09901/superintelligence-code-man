# API Tasarımı 
**OpenAPI Spesifikasyon Dosyası:** [lamine.yaml](./lamine.yaml)


## OpenAPI Specification

```yaml

openapi: 3.0.3
info:
  title: Superintelligence Code Man API
  description: |
    Akıllı telefon satış platformu için modern ve güvenli RESTful API.
    
    ## Özellikler
    - JWT tabanlı kimlik doğrulama
    - Kullanıcı ve adres yönetimi
    - Marka, model ve donanım özelliklerine göre detaylı ürün filtreleme
    - Gelişmiş sepet (Cart) yönetimi
    - Sipariş ve ödeme işlemleri
  version: 1.0.0
  contact:
    name: API Destek
    email: api-support@superintelligence-code-man.com
  license:
    name: MIT

servers:
  - url: https://api.superintelligence-code-man.com/v1
    description: Production server
  - url: http://localhost:3000/v1
    description: Development server

tags:
  - name: auth
    description: Kimlik doğrulama işlemleri
  - name: users
    description: Kullanıcı yönetimi işlemleri
  - name: products
    description: Akıllı telefon katalog ve filtreleme işlemleri
  - name: cart
    description: Sepet işlemleri
  - name: orders
    description: Sipariş ve ödeme işlemleri

paths:
  /auth/register:
    post:
      tags:
        - auth
      summary: Yeni kullanıcı kaydı
      operationId: registerUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserRegistration'
      responses:
        '201':
          description: Kullanıcı başarıyla oluşturuldu

  /auth/login:
    post:
      tags:
        - auth
      summary: Kullanıcı girişi
      operationId: loginUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginCredentials'
      responses:
        '200':
          description: Giriş başarılı

  /users/{userId}:
    get:
      tags:
        - users
      summary: Kullanıcı detayı
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/UserIdParam'
      responses:
        '200':
          description: Başarılı
    
    put:
      tags:
        - users
      summary: Kullanıcı güncelle
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/UserIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserUpdate'
      responses:
        '200':
          description: Kullanıcı başarıyla güncellendi
    
    delete:
      tags:
        - users
      summary: Kullanıcı sil
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/UserIdParam'
      responses:
        '204':
          description: Kullanıcı başarıyla silindi

  /products:
    get:
      tags:
        - products
      summary: Telefonları listeleme ve filtreleme
      parameters:
        - name: brand
          in: query
          schema:
            type: string
        - name: minPrice
          in: query
          schema:
            type: number
        - name: maxPrice
          in: query
          schema:
            type: number
      responses:
        '200':
          description: Başarılı
    
    post:
      tags:
        - products
      summary: Yeni telefon ekle (Admin)
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductCreate'
      responses:
        '201':
          description: Ürün eklendi

  /products/{productId}:
    get:
      tags:
        - products
      summary: Telefon detayı
      parameters:
        - $ref: '#/components/parameters/ProductIdParam'
      responses:
        '200':
          description: Başarılı

  /cart:
    get:
      tags:
        - cart
      summary: Sepeti görüntüle
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Sepet getirildi

  /cart/items:
    post:
      tags:
        - cart
      summary: Sepete telefon ekle
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CartItemInput'
      responses:
        '200':
          description: Ürün sepete eklendi

  /orders:
    get:
      tags:
        - orders
      summary: Sipariş geçmişi
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Başarılı
    
    post:
      tags:
        - orders
      summary: Yeni sipariş oluştur ve öde
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OrderCreate'
      responses:
        '201':
          description: Sipariş oluşturuldu

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  parameters:
    UserIdParam:
      name: userId
      in: path
      required: true
      schema:
        type: string
    
    ProductIdParam:
      name: productId
      in: path
      required: true
      schema:
        type: string

  schemas:
    UserRegistration:
      type: object
      properties:
        email:
          type: string
        password:
          type: string
        firstName:
          type: string
        lastName:
          type: string
        phone:
          type: string

    LoginCredentials:
      type: object
      properties:
        email:
          type: string
        password:
          type: string

    UserUpdate:
      type: object
      properties:
        firstName:
          type: string
        lastName:
          type: string
        email:
          type: string
        phone:
          type: string
        address:
          type: string

    ProductCreate:
      type: object
      properties:
        brand:
          type: string
        model:
          type: string
        price:
          type: number
        stock:
          type: integer

    CartItemInput:
      type: object
      properties:
        productId:
          type: string
        quantity:
          type: integer

    OrderCreate:
      type: object
      properties:
        shippingAddressId:
          type: string
        paymentMethod:
          type: string
        paymentToken:
          type: string