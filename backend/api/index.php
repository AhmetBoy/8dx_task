<?php
/**
 * REST API Router
 * Handles all API requests with RESTful routing
 */

// CORS Headers - MUST be set before any output
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    exit(0);
}

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/ProblemController.php';
require_once __DIR__ . '/../controllers/RootCauseController.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Get request method and URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove base path - Environment-aware
// Local: /8dx/backend/api
// Production: /backend/api
$isLocal = in_array($_SERVER['HTTP_HOST'], ['localhost', '127.0.0.1', 'localhost:8000']);
$basePath = $isLocal ? '/8dx/backend/api' : '/backend/api';
$uri = str_replace($basePath, '', $uri);
$uri = trim($uri, '/');

// Split URI into segments
$segments = array_filter(explode('/', $uri));
$segments = array_values($segments); // Re-index array

try {
    // Route: /api/problems
    if (count($segments) === 1 && $segments[0] === 'problems') {
        $controller = new ProblemController($db);

        switch ($method) {
            case 'GET':
                $controller->index();
                break;
            case 'POST':
                $controller->store();
                break;
            default:
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        }
    }

    // Route: /api/problems/{id}
    elseif (count($segments) === 2 && $segments[0] === 'problems' && is_numeric($segments[1])) {
        $controller = new ProblemController($db);
        $id = (int)$segments[1];

        switch ($method) {
            case 'GET':
                $controller->show($id);
                break;
            case 'PUT':
                $controller->update($id);
                break;
            case 'DELETE':
                $controller->destroy($id);
                break;
            default:
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        }
    }

    // Route: /api/problems/{problemId}/causes
    elseif (count($segments) === 3 && $segments[0] === 'problems' && is_numeric($segments[1]) && $segments[2] === 'causes') {
        $controller = new RootCauseController($db);
        $problemId = (int)$segments[1];

        switch ($method) {
            case 'GET':
                $controller->getByProblem($problemId);
                break;
            default:
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        }
    }

    // Route: /api/causes
    elseif (count($segments) === 1 && $segments[0] === 'causes') {
        $controller = new RootCauseController($db);

        switch ($method) {
            case 'POST':
                $controller->store();
                break;
            default:
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        }
    }

    // Route: /api/causes/{id}
    elseif (count($segments) === 2 && $segments[0] === 'causes' && is_numeric($segments[1])) {
        $controller = new RootCauseController($db);
        $id = (int)$segments[1];

        switch ($method) {
            case 'GET':
                $controller->show($id);
                break;
            case 'PUT':
                $controller->update($id);
                break;
            case 'DELETE':
                $controller->destroy($id);
                break;
            default:
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        }
    }

    // No route matched
    else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Endpoint not found',
            'requested_uri' => $uri,
            'available_endpoints' => [
                'GET /api/problems',
                'POST /api/problems',
                'GET /api/problems/{id}',
                'PUT /api/problems/{id}',
                'DELETE /api/problems/{id}',
                'GET /api/problems/{problemId}/causes',
                'POST /api/causes',
                'GET /api/causes/{id}',
                'PUT /api/causes/{id}',
                'DELETE /api/causes/{id}'
            ]
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error: ' . $e->getMessage()
    ]);
}
