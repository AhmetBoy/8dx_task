# 8D Problem Solving Platform - Deployment Guide

Bu rehber, projenizi InfinityFree ücretsiz hosting servisinde canlıya almanız için adım adım talimatlar içerir.

## Özellikler

- **Birleşik Deployment**: Frontend (React) ve Backend (PHP) aynı sunucuda
- **Environment-Aware**: Local ve production ortamlarında otomatik çalışır
- **Kolay Kurulum**: Tek tıkla build script

---

## Hazırlık Aşaması

### 1. Node.js Bağımlılıklarını Yükleyin

```bash
cd frontend
npm install
cd ..
```

### 2. Local Testleri Yapın

**Backend'i Başlatın:**
```bash
# XAMPP Apache ve MySQL servislerini başlatın
# http://localhost/8dx/backend/api/problems test edin
```

**Frontend'i Başlatın:**
```bash
cd frontend
npm run dev
# http://localhost:3000 açılacak
```

---

## Production Build

### Windows için:

```bash
build-for-production.bat
```

### Linux/Mac için:

```bash
chmod +x build-for-production.sh
./build-for-production.sh
```

Bu script:
1. Önceki build'i temizler
2. Frontend'i build eder (React + Vite)
3. `dist-production` klasörü oluşturur
4. Frontend, backend ve .htaccess dosyalarını kopyalar

---

## InfinityFree Kurulumu

### 1. InfinityFree Hesabı Oluşturun

1. https://www.infinityfree.com adresine gidin
2. "Sign Up" tıklayın
3. Ücretsiz hesap oluşturun
4. Email doğrulaması yapın

### 2. Yeni Bir Hesap (Website) Oluşturun

1. Control Panel'e giriş yapın
2. "Create Account" butonuna tıklayın
3. Subdomain seçin (örn: `mydomain.infinityfreeapp.com`)
4. Hesap oluşturulana kadar bekleyin (2-5 dakika)

### 3. MySQL Database Oluşturun

**Control Panel > MySQL Databases:**

1. "Create Database" tıklayın
2. Database adı: `8dplatform` (veya istediğiniz isim)
3. Database bilgilerini kaydedin:
   - **Hostname**: `sql123.infinityfree.com` (sizinki farklı olabilir)
   - **Database Name**: `epiz_xxxxx_8dplatform`
   - **Username**: `epiz_xxxxx`
   - **Password**: `xxxxxxxxx`

### 4. Database Tablolarını Oluşturun

1. **Control Panel > MySQL Management > phpMyAdmin**
2. Database'inizi seçin
3. "SQL" sekmesine gidin
4. `dist-production/schema.sql` dosyasının içeriğini kopyalayıp yapıştırın
5. "Go" butonuna tıklayın

Alternatif:
```sql
-- schema.sql içeriğini buraya yapıştırın ve çalıştırın
```

### 5. Database Bağlantı Bilgilerini Güncelleyin

**`dist-production/backend/config/database.php` dosyasını açın:**

```php
if ($isProduction) {
    // InfinityFree Production Settings
    $this->host = 'sql123.infinityfree.com';      // ← Buraya InfinityFree hostname
    $this->db_name = 'epiz_xxxxx_8dplatform';     // ← Buraya database adı
    $this->username = 'epiz_xxxxx';                // ← Buraya database username
    $this->password = 'your_actual_password';      // ← Buraya database password
}
```

**ÖNEMLİ:**
- Gerçek bilgilerinizi yazın (yukarıdaki `epiz_xxxxx` ve `sql123` örnektir)
- Sadece production kısmını değiştirin, local kısmına dokunmayın

---

## Dosyaları Yükleme

### Yöntem 1: File Manager (Tavsiye Edilen)

1. **Control Panel > File Manager**
2. `htdocs` klasörüne gidin
3. Varsayılan dosyaları silin (`index.html`, `default.php`, vb.)
4. `dist-production` klasörünün **içindeki tüm dosyaları** seçin ve yükleyin:
   - `index.html`
   - `assets/` klasörü
   - `backend/` klasörü
   - `.htaccess`
   - `schema.sql` (opsiyonel, sadece yedek için)

**DİKKAT:** `dist-production` klasörünün kendisini değil, içindeki dosyaları yükleyin!

### Yöntem 2: FTP

1. **Control Panel > FTP Details** - bilgileri alın
2. FileZilla veya herhangi bir FTP client kullanın:
   - **Host**: `ftpupload.net`
   - **Username**: `epiz_xxxxx`
   - **Password**: Your FTP password
   - **Port**: 21
3. `/htdocs` klasörüne bağlanın
4. `dist-production` içindeki tüm dosyaları yükleyin

---

## Test ve Doğrulama

### 1. Website'inizi Açın

```
http://yourdomain.infinityfreeapp.com
```

### 2. API Test Edin

```
http://yourdomain.infinityfreeapp.com/backend/api/problems
```

Beklenen yanıt:
```json
{
  "success": true,
  "data": []
}
```

### 3. Frontend Test Edin

1. Ana sayfa açılmalı
2. "Yeni Problem Ekle" butonu çalışmalı
3. Problem ekleme modal'ı açılmalı
4. Form submit edince API'ye istek gitmeli

---

## Sorun Giderme

### Beyaz Ekran / 500 Hatası

**Çözüm 1: .htaccess Kontrol**
- `.htaccess` dosyasının yüklendiğinden emin olun
- InfinityFree bazen `.htaccess` dosyalarını gizler, File Manager'dan "Show Hidden Files" aktif edin

**Çözüm 2: PHP Hatalarını Göster**
`backend/api/index.php` başına ekleyin (sadece debug için):
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

### Database Bağlantı Hatası

1. Database bilgilerini tekrar kontrol edin
2. phpMyAdmin'den bağlanabildiğinizi test edin
3. `database.php` dosyasındaki bilgilerin doğru olduğundan emin olun

### API 404 Hatası

1. `.htaccess` dosyasının hem root hem de `backend` klasöründe olduğundan emin olun
2. InfinityFree'de `mod_rewrite` aktif mi kontrol edin (genellikle aktiftir)

### CORS Hatası

- `backend/api/index.php` başındaki CORS headerları kontrol edin
- InfinityFree bazen CORS ayarlarını değiştirebilir

---

## Local ve Production Arasında Geçiş

### Local Development'a Dönme

1. Hiçbir değişiklik yapmadan `npm run dev` ve XAMPP'i başlatın
2. Kod otomatik olarak local ayarları kullanacak

### Production'a Yeni Güncellemeler

1. Değişikliklerinizi yapın
2. `build-for-production.bat` çalıştırın
3. Sadece değişen dosyaları InfinityFree'ye yükleyin

**Dikkat:** `backend/config/database.php` dosyasını her build'de tekrar güncelleyin!

---

## Güvenlik Notları

### Production'da Yapılması Gerekenler

1. **PHP Error Display Kapatın:**
   ```php
   // backend/api/index.php - production'da kaldırın veya comment edin
   // error_reporting(E_ALL);
   // ini_set('display_errors', 1);
   ```

2. **Database Şifresini Güçlendirin:**
   - InfinityFree control panel'den database şifresini değiştirin
   - `database.php` dosyasını güncelleyin

3. **.env Dosyası Kullanın (Gelişmiş):**
   - Hassas bilgileri `.env` dosyasında tutun
   - `.env` dosyasını `.gitignore`'a ekleyin
   - InfinityFree'de `.env` dosyasını manuel yükleyin

---

## Dosya Yapısı (Production)

```
htdocs/
├── index.html              ← React frontend (build edilmiş)
├── .htaccess               ← Frontend routing
├── assets/                 ← React static files (JS, CSS, images)
│   ├── index-xxx.js
│   ├── index-xxx.css
│   └── ...
├── backend/
│   ├── .htaccess           ← Backend routing
│   ├── api/
│   │   └── index.php       ← REST API router
│   ├── config/
│   │   └── database.php    ← DB connection
│   ├── controllers/
│   │   ├── ProblemController.php
│   │   └── RootCauseController.php
│   └── models/
│       ├── Problem.php
│       └── RootCause.php
└── schema.sql              ← Database backup (opsiyonel)
```

---

## Yararlı Linkler

- **InfinityFree Forum**: https://forum.infinityfree.com
- **InfinityFree Knowledge Base**: https://forum.infinityfree.com/docs
- **FTP Troubleshooting**: https://forum.infinityfree.com/docs?topic=49

---

## Destek

Sorun yaşarsanız:

1. InfinityFree Error Logs'u kontrol edin (Control Panel > Error Logs)
2. Browser Console'u kontrol edin (F12 > Console)
3. Network tab'ını kontrol edin (F12 > Network)
4. InfinityFree Forum'da sorun arayın

---

**Başarılar! 🚀**

Projeniz artık canlıda!
