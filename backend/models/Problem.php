<?php
/**
 * Problem Model
 * Handles CRUD operations for problems table
 */

class Problem {
    private $conn;
    private $table = 'problems';

    public $id;
    public $title;
    public $description;
    public $responsible_team;
    public $status;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Get all problems
     */
    public function getAll() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Get single problem by ID
     */
    public function getById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * Create new problem
     */
    public function create() {
        $query = "INSERT INTO " . $this->table . "
                  (title, description, responsible_team, status)
                  VALUES (:title, :description, :responsible_team, :status)";

        $stmt = $this->conn->prepare($query);

        // Sanitize inputs
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->responsible_team = htmlspecialchars(strip_tags($this->responsible_team));
        $this->status = $this->status ?? 'open';

        // Bind parameters
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':responsible_team', $this->responsible_team);
        $stmt->bindParam(':status', $this->status);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    /**
     * Update problem
     */
    public function update() {
        $query = "UPDATE " . $this->table . "
                  SET title = :title,
                      description = :description,
                      responsible_team = :responsible_team,
                      status = :status
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->responsible_team = htmlspecialchars(strip_tags($this->responsible_team));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':responsible_team', $this->responsible_team);
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    /**
     * Delete problem
     */
    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    /**
     * Validate problem data
     */
    public function validate() {
        $errors = [];

        if (empty(trim($this->title))) {
            $errors[] = 'Title is required';
        }

        if (empty(trim($this->description))) {
            $errors[] = 'Description is required';
        }

        if (empty(trim($this->responsible_team))) {
            $errors[] = 'Responsible team is required';
        }

        if (!in_array($this->status, ['open', 'closed'])) {
            $errors[] = 'Invalid status value';
        }

        return $errors;
    }
}
