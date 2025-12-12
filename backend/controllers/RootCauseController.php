<?php
/**
 * Root Cause Controller
 * Handles HTTP requests for root causes (tree structure)
 */

require_once __DIR__ . '/../models/RootCause.php';
require_once __DIR__ . '/../models/Problem.php';

class RootCauseController {
    private $db;
    private $rootCause;
    private $problem;

    public function __construct($db) {
        $this->db = $db;
        $this->rootCause = new RootCause($db);
        $this->problem = new Problem($db);
    }

    /**
     * GET /api/problems/{problemId}/causes
     * Get all causes for a problem as tree structure
     */
    public function getByProblem($problemId) {
        try {
            // Check if problem exists
            $problem = $this->problem->getById($problemId);
            if (!$problem) {
                $this->sendResponse(404, [
                    'success' => false,
                    'message' => 'Problem not found'
                ]);
                return;
            }

            // Get tree structure
            $tree = $this->rootCause->getTreeByProblemId($problemId);

            $this->sendResponse(200, [
                'success' => true,
                'problem_id' => (int)$problemId,
                'data' => $tree,
                'count' => count($tree)
            ]);

        } catch (Exception $e) {
            $this->sendResponse(500, [
                'success' => false,
                'message' => 'Error fetching causes: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * GET /api/causes/{id}
     * Get single cause
     */
    public function show($id) {
        try {
            $cause = $this->rootCause->getById($id);

            if (!$cause) {
                $this->sendResponse(404, [
                    'success' => false,
                    'message' => 'Cause not found'
                ]);
                return;
            }

            // Convert boolean
            $cause['is_root_cause'] = (bool)$cause['is_root_cause'];

            $this->sendResponse(200, [
                'success' => true,
                'data' => $cause
            ]);

        } catch (Exception $e) {
            $this->sendResponse(500, [
                'success' => false,
                'message' => 'Error fetching cause: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * POST /api/causes
     * Create new cause
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
            $this->rootCause->problem_id = $data['problem_id'] ?? null;
            $this->rootCause->parent_id = $data['parent_id'] ?? null;
            $this->rootCause->cause_text = $data['cause_text'] ?? '';
            $this->rootCause->is_root_cause = isset($data['is_root_cause']) ? (bool)$data['is_root_cause'] : false;
            $this->rootCause->permanent_action = $data['permanent_action'] ?? null;
            $this->rootCause->order_index = $data['order_index'] ?? 0;

            // Validate
            $errors = $this->rootCause->validate();
            if (!empty($errors)) {
                $this->sendResponse(400, [
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $errors
                ]);
                return;
            }

            // Check if problem exists
            $problem = $this->problem->getById($this->rootCause->problem_id);
            if (!$problem) {
                $this->sendResponse(404, [
                    'success' => false,
                    'message' => 'Problem not found'
                ]);
                return;
            }

            // Check if parent exists (if provided)
            if ($this->rootCause->parent_id !== null) {
                $parent = $this->rootCause->getById($this->rootCause->parent_id);
                if (!$parent) {
                    $this->sendResponse(404, [
                        'success' => false,
                        'message' => 'Parent cause not found'
                    ]);
                    return;
                }
            }

            // Create
            if ($this->rootCause->create()) {
                $createdCause = $this->rootCause->getById($this->rootCause->id);
                $createdCause['is_root_cause'] = (bool)$createdCause['is_root_cause'];

                $this->sendResponse(201, [
                    'success' => true,
                    'message' => 'Cause created successfully',
                    'data' => $createdCause
                ]);
            } else {
                $this->sendResponse(500, [
                    'success' => false,
                    'message' => 'Failed to create cause'
                ]);
            }

        } catch (Exception $e) {
            $this->sendResponse(500, [
                'success' => false,
                'message' => 'Error creating cause: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * PUT /api/causes/{id}
     * Update cause (mainly for root cause marking and action)
     */
    public function update($id) {
        try {
            // Check if exists
            $existing = $this->rootCause->getById($id);
            if (!$existing) {
                $this->sendResponse(404, [
                    'success' => false,
                    'message' => 'Cause not found'
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
            $this->rootCause->id = $id;
            $this->rootCause->problem_id = $existing['problem_id'];
            $this->rootCause->cause_text = $data['cause_text'] ?? $existing['cause_text'];
            $this->rootCause->is_root_cause = isset($data['is_root_cause']) ? (bool)$data['is_root_cause'] : (bool)$existing['is_root_cause'];
            $this->rootCause->permanent_action = $data['permanent_action'] ?? $existing['permanent_action'];
            $this->rootCause->order_index = $data['order_index'] ?? $existing['order_index'];

            // Validate
            $errors = $this->rootCause->validate();
            if (!empty($errors)) {
                $this->sendResponse(400, [
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $errors
                ]);
                return;
            }

            // Update
            if ($this->rootCause->update()) {
                $updatedCause = $this->rootCause->getById($id);
                $updatedCause['is_root_cause'] = (bool)$updatedCause['is_root_cause'];

                $this->sendResponse(200, [
                    'success' => true,
                    'message' => 'Cause updated successfully',
                    'data' => $updatedCause
                ]);
            } else {
                $this->sendResponse(500, [
                    'success' => false,
                    'message' => 'Failed to update cause'
                ]);
            }

        } catch (Exception $e) {
            $this->sendResponse(500, [
                'success' => false,
                'message' => 'Error updating cause: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * DELETE /api/causes/{id}
     * Delete cause (CASCADE deletes children)
     */
    public function destroy($id) {
        try {
            $existing = $this->rootCause->getById($id);
            if (!$existing) {
                $this->sendResponse(404, [
                    'success' => false,
                    'message' => 'Cause not found'
                ]);
                return;
            }

            $this->rootCause->id = $id;

            if ($this->rootCause->delete()) {
                $this->sendResponse(200, [
                    'success' => true,
                    'message' => 'Cause deleted successfully (including children)'
                ]);
            } else {
                $this->sendResponse(500, [
                    'success' => false,
                    'message' => 'Failed to delete cause'
                ]);
            }

        } catch (Exception $e) {
            $this->sendResponse(500, [
                'success' => false,
                'message' => 'Error deleting cause: ' . $e->getMessage()
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
