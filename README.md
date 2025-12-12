# 8D Problem Solving Platform - MVP

Full Stack web uygulaması: 8D Problem Çözme Metodolojisinin dijitalleştirilmesi (D1-D2 ve D4-D5 aşamaları)

## Teknolojiler

- **Frontend:** React 18 + Siemens iX Design System + AG-Grid
- **Backend:** PHP Native (RESTful JSON API)
- **Database:** MySQL 8.0+

## Özellikler

### Dashboard (D1-D2)
- Problem listesi (AG-Grid ile)
- Yeni problem ekleme (Siemens iX Modal)
- Filtreleme ve sıralama

### Kök Neden Analizi (D4-D5)
- Dinamik kök neden ağacı (Tree/Recursive yapı)
- 5 Why Analysis görselleştirmesi
- Sınırsız derinlikte sebep ekleme
- Kök neden işaretleme
- Kalıcı çözüm (D5) ekleme

## Kurulum

### 1. Gereksinimler

- Node.js 18+ ve npm
- PHP 8.0+
- MySQL 8.0+
- Web server (XAMPP, WAMP, veya PHP built-in server)

### 2. Database Kurulumu

```bash
# MySQL'e giriş yapın
mysql -u root -p

# Veritabanı oluşturun
CREATE DATABASE 8d_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Database schema'yı import edin
mysql -u root -p 8d_platform < database/schema.sql
```

**Not:** `backend/config/database.php` dosyasında DB bağlantı bilgilerinizi güncelleyin:
```php
private $host = 'localhost';
private $db_name = '8d_platform';
private $username = 'root';
private $password = '';  // Kendi şifrenizi girin
```

### 3. Backend Kurulumu

Backend için web server yapılandırması gereklidir. İki seçenek:

#### Seçenek A: PHP Built-in Server (Development)

```bash
cd backend
php -S localhost:8000
```

API endpoint: `http://localhost:8000/backend/api`

#### Seçenek B: XAMPP/WAMP

1. Proje klasörünü `htdocs` (XAMPP) veya `www` (WAMP) dizinine kopyalayın
2. Apache'yi başlatın
3. API endpoint: `http://localhost/8d-problem-platform/backend/api`

**Önemli:** Frontend'in `src/services/api.js` dosyasındaki `API_BASE_URL`'i sunucunuza göre güncelleyin:

```javascript
const API_BASE_URL = 'http://localhost:8000/backend/api'; // veya XAMPP yolu
```

### 4. Frontend Kurulumu

```bash
cd frontend

# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev
```

Uygulama şu adreste açılacak: `http://localhost:3000`

## API Endpoints

### Problems

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/problems` | Tüm problemleri listele |
| GET | `/api/problems/{id}` | Tek problem getir |
| POST | `/api/problems` | Yeni problem oluştur |
| PUT | `/api/problems/{id}` | Problem güncelle |
| DELETE | `/api/problems/{id}` | Problem sil |

### Root Causes

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/problems/{problemId}/causes` | Problemin kök neden ağacını getir |
| POST | `/api/causes` | Yeni sebep ekle |
| PUT | `/api/causes/{id}` | Sebep güncelle (kök neden işaretle, aksiyon ekle) |
| DELETE | `/api/causes/{id}` | Sebep sil (CASCADE ile alt sebepler de silinir) |

## Proje Yapısı

```
8d-problem-platform/
├── frontend/                 # React uygulaması
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── AddProblemModal.jsx
│   │   │   └── RootCauseAnalysis/
│   │   │       ├── ProblemDetail.jsx
│   │   │       ├── CauseTree.jsx
│   │   │       └── CauseNode.jsx (Recursive!)
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/                  # PHP REST API
│   ├── config/
│   │   └── database.php
│   ├── models/
│   │   ├── Problem.php
│   │   └── RootCause.php (Tree yapısı!)
│   ├── controllers/
│   │   ├── ProblemController.php
│   │   └── RootCauseController.php
│   └── api/
│       └── index.php (Router)
│
├── database/
│   └── schema.sql
│
├── PROJECT.md               # Detaylı proje dokümantasyonu
└── README.md                # Bu dosya
```

## Kullanım

### 1. Problem Ekleme

1. Dashboard'da "Yeni Problem Ekle" butonuna tıklayın
2. Modal açılacak:
   - **Başlık:** Problem başlığı
   - **Detaylı Açıklama (D2):** Problemin detaylı açıklaması
   - **Sorumlu Ekip (D1):** Sorumlu ekip adı
3. "Kaydet" butonuna tıklayın

### 2. Kök Neden Analizi (5 Why)

1. Dashboard'da bir probleme tıklayın
2. "Ana Sebep Ekle" butonuna tıklayın
3. "Neden?" sorusunu sorun ve cevabı girin
4. Her sebebin altına "+ Alt Sebep Ekle (Neden?)" ile devam edin
5. Kök nedeni bulduğunuzda "Kök Neden Olarak İşaretle" checkbox'ını işaretleyin
6. Kalıcı çözüm (D5) alanına çözüm önerinizi yazın ve kaydedin

### Örnek 5 Why Analizi

```
Problem: Makine Durdu
├── Neden 1: Sigorta Attı
│   ├── Neden 1.1: Aşırı Yüklenme
│   │   └── Neden 1.1.1: Bakım Yapılmamış [KÖK NEDEN]
│   │       └── Kalıcı Çözüm: Aylık preventif bakım planı oluştur
│   └── Neden 1.2: Hatalı Kablo
└── Neden 2: Operatör Hatası
```

## Önemli Özellikler

### Recursive Tree Structure
- **Backend:** `RootCause` modelinde `buildTree()` fonksiyonu ile parent-child ilişkileri JSON'a dönüştürülür
- **Frontend:** `CauseNode` componenti kendini recursive olarak render eder

### Siemens iX Kullanımı
- **Modal:** Problem ekleme formu
- **Buttons:** Tüm aksiyonlar için
- **Application Layout:** Ana sayfa layoutu
- **Cards:** İçerik containerları

### AG-Grid
- Filtreleme (text, number, date)
- Sıralama
- Pagination
- Custom cell renderers (durum göstergesi)

## Production Build

### Frontend
```bash
cd frontend
npm run build
```
Build dosyaları `frontend/dist` klasöründe oluşur.

### Backend
PHP dosyalarını production sunucunuza yükleyin ve web server (Apache/Nginx) yapılandırması yapın.

## Troubleshooting

### CORS Hatası
Backend'de CORS headers ayarlanmış durumda. Eğer hala CORS hatası alıyorsanız:
- `backend/api/index.php` dosyasındaki CORS headers'ı kontrol edin
- Web server yapılandırmanızı kontrol edin

### Database Connection Hatası
- `backend/config/database.php` dosyasındaki bağlantı bilgilerini kontrol edin
- MySQL servisinin çalıştığından emin olun

### API 404 Hatası
- `.htaccess` dosyasının backend klasöründe olduğundan emin olun
- Apache'de `mod_rewrite` modülünün aktif olduğunu kontrol edin
- PHP built-in server kullanıyorsanız URL'lerde `/backend/api` prefix'i kullanın

## Geliştirici Notları

### Veri Akışı
1. Frontend → API Request (axios)
2. Backend Router → Controller → Model
3. Model → Database (PDO)
4. Response: Database → Model → Controller → JSON → Frontend

### Güvenlik
- PDO Prepared Statements (SQL Injection koruması)
- Input sanitization (htmlspecialchars)
- CORS headers
- Input validation (frontend + backend)

## Katkıda Bulunma

Bu proje bir MVP (Minimum Viable Product) olarak geliştirilmiştir. İyileştirme önerileri:
- D3, D6, D7, D8 aşamalarının eklenmesi
- Kullanıcı kimlik doğrulama
- Dosya yükleme (görsel, doküman)
- Bildirim sistemi
- Dashboard analytics
- Export (PDF, Excel)

## Lisans

Bu proje eğitim ve case study amaçlı geliştirilmiştir.

## İletişim

Sorularınız için: [Your Email/GitHub]

---

**Geliştirme Tarihi:** 2025-12-11
**Versiyon:** 1.0.0 (MVP)
**Tech Stack:** React + Siemens iX + PHP + MySQL
