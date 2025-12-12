<?php
/**
 * Root Cause Model
 * Handles tree structure (recursive parent-child relationships)
 * Critical for D4-D5 (Root Cause Analysis & Solutions)
 */

class RootCause {
    private $conn;
    private $table = 'root_causes';

    public $id;
    public $problem_id;
    public $parent_id;
    public $cause_text;
    public $is_root_cause;
    public $permanent_action;
    public $order_index;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Get all root causes for a problem as a tree structure
     * This is the CRITICAL function for recursive data
     */
    public function getTreeByProblemId($problem_id) {
        // First, get all causes for this problem
        $query = "SELECT * FROM " . $this->table . "
                  WHERE problem_id = :problem_id
                  ORDER BY order_index ASC, created_at ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':problem_id', $problem_id, PDO::PARAM_INT);
        $stmt->execute();

        $allCauses = $stmt->fetchAll();

        // Build tree structure
        return $this->buildTree($allCauses);
    }

    /**
     * Recursive function to build tree from flat array
     * Converts parent_id relationships into nested structure
     */
    private function buildTree($elements, $parentId = null) {
        $branch = [];

        foreach ($elements as $element) {
            if ($element['parent_id'] == $parentId) {
                // Get children recursively
                $children = $this->buildTree($elements, $element['id']);

                // Add children if exist
                if ($children) {
                    $element['children'] = $children;
                } else {
                    $element['children'] = [];
                }

                // Convert boolean for JSON
                $element['is_root_cause'] = (bool)$element['is_root_cause'];

                $branch[] = $element;
            }
        }

        return $branch;
    }

    /**
     * Get all causes (flat list) for a problem
     */
    public function getAllByProblemId($problem_id) {
        $query = "SELECT * FROM " . $this->table . "
                  WHERE problem_id = :problem_id
                  ORDER BY order_index ASC, created_at ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':problem_id', $problem_id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    /**
     * Get single cause by ID
     */
    public function getById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * Create new cause
     */
    public function create() {
        $query = "INSERT INTO " . $this->table . "
                  (problem_id, parent_id, cause_text, is_root_cause, permanent_action, order_index)
                  VALUES (:problem_id, :parent_id, :cause_text, :is_root_cause, :permanent_action, :order_index)";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->cause_text = htmlspecialchars(strip_tags($this->cause_text));
        $this->permanent_action = $this->permanent_action ? htmlspecialchars(strip_tags($this->permanent_action)) : null;
        $this->is_root_cause = $this->is_root_cause ?? false;
        $this->order_index = $this->order_index ?? 0;

        // Bind
        $stmt->bindParam(':problem_id', $this->problem_id, PDO::PARAM_INT);
        $stmt->bindParam(':parent_id', $this->parent_id, PDO::PARAM_INT);
        $stmt->bindParam(':cause_text', $this->cause_text);
        $stmt->bindParam(':is_root_cause', $this->is_root_cause, PDO::PARAM_BOOL);
        $stmt->bindParam(':permanent_action', $this->permanent_action);
        $stmt->bindParam(':order_index', $this->order_index, PDO::PARAM_INT);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    /**
     * Update cause (mainly for marking as root cause and adding action)
     */
    public function update() {
        $query = "UPDATE " . $this->table . "
                  SET cause_text = :cause_text,
                      is_root_cause = :is_root_cause,
                      permanent_action = :permanent_action,
                      order_index = :order_index
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->cause_text = htmlspecialchars(strip_tags($this->cause_text));
        $this->permanent_action = $this->permanent_action ? htmlspecialchars(strip_tags($this->permanent_action)) : null;

        // Bind
        $stmt->bindParam(':cause_text', $this->cause_text);
        $stmt->bindParam(':is_root_cause', $this->is_root_cause, PDO::PARAM_BOOL);
        $stmt->bindParam(':permanent_action', $this->permanent_action);
        $stmt->bindParam(':order_index', $this->order_index, PDO::PARAM_INT);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    /**
     * Delete cause (CASCADE will delete children automatically)
     */
    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    /**
     * Validate cause data
     */
    public function validate() {
        $errors = [];

        if (empty($this->problem_id)) {
            $errors[] = 'Problem ID is required';
        }

        if (empty(trim($this->cause_text))) {
            $errors[] = 'Cause text is required';
        }

        // If marked as root cause, permanent action is required
        if ($this->is_root_cause && empty(trim($this->permanent_action))) {
            $errors[] = 'Permanent action is required for root causes';
        }

        return $errors;
    }

    /**
     * Get all root causes (is_root_cause = true) for a problem
     */
    public function getRootCausesByProblemId($problem_id) {
        $query = "SELECT * FROM " . $this->table . "
                  WHERE problem_id = :problem_id AND is_root_cause = 1
                  ORDER BY created_at ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':problem_id', $problem_id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }
}
