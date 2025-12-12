<?php
/**
 * Problem Controller
 * Handles HTTP requests for problems
 */

require_once __DIR__ . '/../models/Problem.php';

class ProblemController {
    private $db;
    private $problem;

    public function __construct($db) {
        $this->db = $db;
        $this->problem = new Problem($db);
    }

    /**
     * GET /api/problems
     * Get all problems
     */
    public function index() {
        try {
            $problems = $this->problem->getAll();

            $this->sendResponse(200, [
                'success' => true,
                'data' => $problems,
                'count' => count($problems)
            ]);

        } catch (Exception $e) {
            $this->sendResponse(500, [
                'success' => false,
                'message' => 'Error fetching problems: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * GET /api/problems/{id}
     * Get single problem
     */
    public function show($id) {
        try {
            $problem = $this->problem->getById($id);

            if (!$problem) {
                $this->sendResponse(404, [
                    'success' => false,
                    'message' => 'Problem not found'
                ]);
                return;
            }

            $this->sendResponse(200, [
                'success' => true,
                'data' => $problem
            ]);

        } catch (Exception $e) {
            $this->sendResponse(500, [
                'success' => false,
                'message' => 'Error fetching problem: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * POST /api/problems
     * Create new problem
     */
    public function store() {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            if (!$data) {
                $this->sendResponse(400, [
                    'success' => false,
                    'message' => 'Invalid JSON data'
                ]);
                return;
            }

            // Set properties
            $this->problem->title = $data['title'] ?? '';
            $this->problem->description = $data['description'] ?? '';
            $this->problem->responsible_team = $data['responsible_team'] ?? '';
            $this->problem->status = $data['status'] ?? 'open';

            // Validate
            $errors = $this->problem->validate();
            if (!empty($errors)) {
                $this->sendResponse(400, [
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $errors
                ]);
                return;
            }

            // Create
            if ($this->problem->create()) {
                $createdProblem = $this->problem->getById($this->problem->id);

                $this->sendResponse(201, [
                    'success' => true,
                    'message' => 'Problem created successfully',
                    'data' => $createdProblem
                ]);
            } else {
                $this->sendResponse(500, [
                    'success' => false,
                    'message' => 'Failed to create problem'
                ]);
            }

        } catch (Exception $e) {
            $this->sendResponse(500, [
                'success' => false,
                'message' => 'Error creating problem: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * PUT /api/problems/{id}
     * Update problem
     */
    public function update($id) {
        try {
            // Check if exists
            $existing = $this->problem->getById($id);
            if (!$existing) {
                $this->sendResponse(404, [
                    'success' => false,
                    'message' => 'Problem not found'
                ]);
                return;
            }

            $data = json_decode(file_get_contents("php://input"), true);

            if (!$data) {
                $this->sendResponse(400, [
                    'success' => false,
                    'message' => 'Invalid JSON data'
                ]);
                return;
            }

            // Set properties
            $this->problem->id = $id;
            $this->problem->title = $data['title'] ?? '';
            $this->problem->description = $data['description'] ?? '';
            $this->problem->responsible_team = $data['responsible_team'] ?? '';
            $this->problem->status = $data['status'] ?? 'open';

            // Validate
            $errors = $this->problem->validate();
            if (!empty($errors)) {
                $this->sendResponse(400, [
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $errors
                ]);
                return;
            }

            // Update
            if ($this->problem->update()) {
                $updatedProblem = $this->problem->getById($id);

                $this->sendResponse(200, [
                    'success' => true,
                    'message' => 'Problem updated successfully',
                    'data' => $updatedProblem
                ]);
            } else {
                $this->sendResponse(500, [
                    'success' => false,
                    'message' => 'Failed to update problem'
                ]);
            }

        } catch (Exception $e) {
            $this->sendResponse(500, [
                'success' => false,
                'message' => 'Error updating problem: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * DELETE /api/problems/{id}
     * Delete problem
     */
    public function destroy($id) {
        try {
            $existing = $this->problem->getById($id);
            if (!$existing) {
                $this->sendResponse(404, [
                    'success' => false,
                    'message' => 'Problem not found'
                ]);
                return;
            }

            $this->problem->id = $id;

            if ($this->problem->delete()) {
                $this->sendResponse(200, [
                    'success' => true,
                    'message' => 'Problem deleted successfully'
                ]);
            } else {
                $this->sendResponse(500, [
                    'success' => false,
                    'message' => 'Failed to delete problem'
                ]);
            }

        } catch (Exception $e) {
            $this->sendResponse(500, [
                'success' => false,
                'message' => 'Error deleting problem: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Send JSON response
     */
    private function sendResponse($statusCode, $data) {
        http_response_code($statusCode);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit();
    }
}
