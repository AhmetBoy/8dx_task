-- 8D Problem Solving Platform - Database Schema
-- Created: 2025-12-11

-- Drop tables if exist (for clean setup)
DROP TABLE IF EXISTS root_causes;
DROP TABLE IF EXISTS problems;

-- Problems Table (D1-D2: Problem Definition)
CREATE TABLE problems (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    responsible_team VARCHAR(100) NOT NULL,
    status ENUM('open', 'closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Root Causes Table (D4-D5: Root Cause Analysis & Solution)
-- Tree structure with parent_id for recursive relationships
CREATE TABLE root_causes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    problem_id INT NOT NULL,
    parent_id INT NULL,
    cause_text TEXT NOT NULL,
    is_root_cause BOOLEAN DEFAULT FALSE,
    permanent_action TEXT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES root_causes(id) ON DELETE CASCADE,
    INDEX idx_problem_id (problem_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_is_root_cause (is_root_cause)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data for Testing
INSERT INTO problems (title, description, responsible_team, status) VALUES
('Makine Durması - Hat 2', 'Üretim hattı 2''deki CNC makinesi beklenmedik şekilde durdu. Üretim 3 saat durdu.', 'Bakım Ekibi', 'open'),
('Kalite Problemi - Ürün A', 'Ürün A''da yüzey pürüzlülüğü standart değerlerin üzerinde çıkıyor.', 'Kalite Kontrol', 'open'),
('Tedarik Gecikmesi', 'Kritik parça tedarikinde 2 haftalık gecikme yaşandı.', 'Satın Alma', 'closed');

-- Sample root cause tree for Problem 1
-- Tree yapısı:
-- Makine Durdu
--   ├── Sigorta Attı (parent_id=NULL, id=1)
--   │   ├── Aşırı Yüklenme (parent_id=1, id=2)
--   │   │   └── Bakım Yapılmamış (parent_id=2, id=3) [ROOT CAUSE]
--   │   └── Hatalı Kablo (parent_id=1, id=4)
--   └── Operatör Hatası (parent_id=NULL, id=5)

INSERT INTO root_causes (problem_id, parent_id, cause_text, is_root_cause, permanent_action, order_index) VALUES
-- Ana sebepler (parent_id = NULL)
(1, NULL, 'Sigorta attı', FALSE, NULL, 1),
(1, NULL, 'Operatör hatası tespit edildi', FALSE, NULL, 2),

-- Sigorta Attı'nın alt sebepleri
(1, 1, 'Aşırı yüklenme', FALSE, NULL, 1),
(1, 1, 'Hatalı kablo bağlantısı', FALSE, NULL, 2),

-- Aşırı Yüklenme'nin alt sebebi (KÖK NEDEN)
(1, 3, 'Son 6 aydır periyodik bakım yapılmamış', TRUE, 'Aylık preventif bakım planı oluşturulacak ve takip sistemi devreye alınacak', 1),

-- Operatör Hatası'nın alt sebebi
(1, 2, 'Yeni operatör, eğitim almamış', FALSE, NULL, 1);

-- Sample root cause for Problem 2
INSERT INTO root_causes (problem_id, parent_id, cause_text, is_root_cause, permanent_action, order_index) VALUES
(2, NULL, 'Kesici takım ömrünü tamamlamış', TRUE, 'Takım değişim periyotları optimize edilecek', 1);
