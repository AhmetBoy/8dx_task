<?php
/**
 * Database Configuration and Connection
 * PDO with error handling
 */

class Database {
    private $host = 'localhost';
    private $db_name = '8d_platform';
    private $username = 'root';
    private $password = '';
    private $conn = null;

    public function getConnection() {
        if ($this->conn !== null) {
            return $this->conn;
        }

        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4";

            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database Connection Error: ' . $e->getMessage()
            ]);
            exit();
        }

        return $this->conn;
    }

    public function closeConnection() {
        $this->conn = null;
    }
}
