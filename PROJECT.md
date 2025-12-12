# 8D Problem Çözme Platformu (MVP)

## Proje Özeti

8D (Eight Disciplines) Problem Çözme Metodolojisini dijitalleştiren Full Stack web platformu. Üretim hatlarında yaşanan problemlerin takibi ve kök neden analizini sağlar.

**MVP Kapsamı:** D1-D2 (Problem Tanımlama) ve D4-D5 (Kök Neden Analizi) süreçleri

## Tech Stack

### Frontend
- **Framework:** React 18+
- **UI Library:** Siemens iX Design System (ZORUNLU)
  - Dokümantasyon: https://ix.siemens.io
  - Web Components kullanımı
- **Data Grid:** AG-Grid
- **HTTP Client:** Axios / Fetch API

### Backend
- **Dil:** PHP Native (8.x+)
- **API:** RESTful JSON API
- **Mimari:** MVC pattern önerilir
- **CORS:** Frontend ile iletişim için gerekli

### Veritabanı
- **DBMS:** MySQL 8.0+
- **Önemli Özellik:** Recursive/Tree Data (parent-child ilişkileri)

## Veritabanı Şeması

### Tablo: `problems`
```sql
CREATE TABLE problems (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    responsible_team VARCHAR(100) NOT NULL,
    status ENUM('open', 'closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tablo: `root_causes` (Tree Structure)
```sql
CREATE TABLE root_causes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    problem_id INT NOT NULL,
    parent_id INT NULL,
    cause_text TEXT NOT NULL,
    is_root_cause BOOLEAN DEFAULT FALSE,
    permanent_action TEXT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES root_causes(id) ON DELETE CASCADE
);
```

**Tree Data Açıklaması:**
- `parent_id = NULL` → Ana seviye sebep
- `parent_id = X` → X numaralı sebebin alt sebebi
- Sınırsız derinlik (Grand-child, Great-grand-child...)
- `is_root_cause = TRUE` → Kök neden olarak işaretlenmiş

## Proje Yapısı

```
8d-problem-platform/
├── frontend/                    # React Uygulaması
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   │   ├── ProblemList.jsx       # AG-Grid liste
│   │   │   │   └── AddProblemModal.jsx   # iX Modal
│   │   │   ├── RootCauseAnalysis/
│   │   │   │   ├── CauseTree.jsx         # Recursive tree component
│   │   │   │   ├── CauseNode.jsx         # Tek bir sebep node
│   │   │   │   └── ActionInput.jsx       # Kalıcı çözüm input
│   │   │   └── shared/
│   │   ├── services/
│   │   │   └── api.js                    # API çağrıları
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # PHP REST API
│   ├── config/
│   │   └── database.php                  # DB bağlantısı
│   ├── models/
│   │   ├── Problem.php
│   │   └── RootCause.php
│   ├── controllers/
│   │   ├── ProblemController.php
│   │   └── RootCauseController.php
│   ├── api/
│   │   └── index.php                     # Router
│   └── .htaccess                         # URL rewriting
│
├── database/
│   └── schema.sql                        # Tablo oluşturma SQL
│
├── PROJECT.md                            # Bu dosya
└── README.md                             # Kurulum talimatları
```

## Fonksiyonel Gereksinimler

### Bölüm A: Dashboard (D1-D2)

#### 1. Problem Listesi
- **Komponent:** AG-Grid
- **Kolonlar:**
  - ID
  - Başlık
  - Sorumlu Ekip (D1)
  - Durum (Açık/Kapalı)
  - Oluşturma Tarihi
- **İşlevler:**
  - Problemlere tıklayarak detay sayfasına gitme
  - Filtreleme (durum, tarih)
  - Sıralama

#### 2. Yeni Problem Ekleme
- **Komponent:** Siemens iX Modal (ZORUNLU)
- **Form Alanları:**
  - Başlık (required)
  - Detaylı Açıklama / D2 (textarea, required)
  - Sorumlu Ekip / D1 (select/input, required)
- **Validasyon:** Frontend ve backend
- **İşlem:** Kaydetme sonrası listeyi yenileme

### Bölüm B: Kök Neden Analizi (D4-D5) - KRİTİK

#### 1. Dinamik Kök Neden Ağacı (5 Why Analysis)

**Temel Özellikler:**
- Problem altına "Neden?" sorusu ile sebepler ekleme
- Her sebebin altına sınırsız alt sebep ekleme
- Recursive/Tree yapısı

**Örnek Hiyerarşi:**
```
Problem: Makine Durdu
├── Neden 1: Sigorta Attı
│   ├── Neden 1.1: Aşırı Yüklenme
│   │   └── Neden 1.1.1: Bakım Yapılmamış
│   └── Neden 1.2: Hatalı Kablo
└── Neden 2: Operatör Hatası
    └── Neden 2.1: Eğitim Eksikliği
```

**Görselleştirme:**
- Hiyerarşik (girintili) liste
- Siemens iX componentleri kullanılarak
- Her node için:
  - Sebep metni
  - "Alt Sebep Ekle" butonu
  - "Kök Neden Olarak İşaretle" checkbox/button

#### 2. Kök Neden ve Aksiyon Belirleme

- Herhangi bir sebep "Kök Neden" olarak işaretlenebilir
- Kök neden işaretlendiğinde:
  - Input alanı açılır
  - "Kalıcı Çözüm (Permanent Action)" girişi yapılır
  - D5 aşaması tamamlanır

## API Endpoints

### Problems API

#### GET `/api/problems`
- **Açıklama:** Tüm problemleri listele
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Makine Durdu",
      "description": "Üretim hattı 2'de makine beklenmedik şekilde durdu",
      "responsible_team": "Bakım Ekibi",
      "status": "open",
      "created_at": "2025-01-15 10:30:00"
    }
  ]
}
```

#### POST `/api/problems`
- **Açıklama:** Yeni problem oluştur
- **Request Body:**
```json
{
  "title": "Problem Başlığı",
  "description": "Detaylı açıklama",
  "responsible_team": "Ekip Adı"
}
```

#### GET `/api/problems/{id}`
- **Açıklama:** Tek bir problemin detayı

### Root Causes API

#### GET `/api/problems/{problemId}/causes`
- **Açıklama:** Problemin tüm kök neden ağacını getir
- **Response:** (Tree structure)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "problem_id": 1,
      "parent_id": null,
      "cause_text": "Sigorta Attı",
      "is_root_cause": false,
      "permanent_action": null,
      "children": [
        {
          "id": 2,
          "parent_id": 1,
          "cause_text": "Aşırı Yüklenme",
          "is_root_cause": true,
          "permanent_action": "Düzenli bakım planı oluştur",
          "children": []
        }
      ]
    }
  ]
}
```

#### POST `/api/causes`
- **Açıklama:** Yeni sebep ekle
- **Request Body:**
```json
{
  "problem_id": 1,
  "parent_id": null,
  "cause_text": "Sebep açıklaması"
}
```

#### PUT `/api/causes/{id}`
- **Açıklama:** Sebebi güncelle (kök neden işaretle, aksiyon ekle)
- **Request Body:**
```json
{
  "is_root_cause": true,
  "permanent_action": "Çözüm açıklaması"
}
```

#### DELETE `/api/causes/{id}`
- **Açıklama:** Sebebi ve alt sebeplerim sil (CASCADE)

## Teknik Yaklaşım ve Best Practices

### PHP Backend
1. **Tree Data Handling:**
   - Recursive function ile parent-child ilişkilerini JSON'a dönüştür
   - `buildTree()` fonksiyonu örneği

2. **Security:**
   - PDO prepared statements (SQL injection koruması)
   - Input validation
   - CORS headers

3. **Error Handling:**
   - Try-catch blokları
   - Anlamlı HTTP status codes (200, 201, 400, 404, 500)

### React Frontend
1. **Siemens iX Kullanımı:**
   - Official dokümantasyonu takip et: https://ix.siemens.io
   - Web Components → React wrapper kullan
   - Theme ve styling standartları

2. **State Management:**
   - useState/useReducer (küçük MVP için yeterli)
   - Context API (opsiyonel)

3. **Component Structure:**
   - Reusable components
   - Props drilling önlemek için composition
   - Recursive component (CauseTree → CauseNode)

## Değerlendirme Kriterleri

1. **Veri Modeli (PHP):**
   - Tree/Recursive data yapısının doğru modellenmesi
   - parent_id ilişkisinin etkili kullanımı

2. **API Yapısı:**
   - RESTful prensipler
   - Uygun JSON formatı
   - Frontend'in kolayca tüketebileceği yapı

3. **Siemens iX Kullanımı:**
   - Dokümantasyonun doğru okunması
   - Standartlara uygun component kullanımı
   - Modal, Button, Card, Input componentleri

4. **Code Quality:**
   - Clean code
   - Naming conventions
   - Commenting (kritik bölümler için)

## Önemli Notlar

- **Siemens iX Zorunlu:** UI componentleri iX Design System'den kullanılmalı
- **AG-Grid:** Problem listesi için kullanılmalı
- **Recursive Structure:** Kök neden ağacı en kritik bölüm
- **5 Why Visualization:** Hiyerarşik gösterim şart
- **MVP Scope:** Sadece D1, D2, D4, D5 aşamaları

## Kurulum

Detaylı kurulum talimatları için `README.md` dosyasına bakınız.

## Geliştirme Süreci

1. Database schema oluşturma
2. PHP backend API geliştirme
3. React frontend setup (Vite + iX)
4. Dashboard implementation
5. Root Cause Tree implementation
6. Integration testing
7. Documentation

## Kaynaklar

- Siemens iX: https://ix.siemens.io
- AG-Grid: https://www.ag-grid.com
- 8D Methodology: https://en.wikipedia.org/wiki/Eight_Disciplines_Problem_Solving
- Tree Data Structures: Parent-child ilişkileri ve recursive queries

---

**Son Güncelleme:** 2025-12-11
**Proje Durumu:** Development
**MVP Hedef:** Full Stack functional prototype
