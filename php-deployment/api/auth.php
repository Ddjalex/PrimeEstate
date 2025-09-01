<?php
require_once '../includes/config.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $action = $_GET['action'] ?? '';
        
        if ($action === 'login') {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input || !isset($input['username']) || !isset($input['password'])) {
                sendError('Username and password required');
            }
            
            if (loginAdmin($input['username'], $input['password'])) {
                sendResponse([
                    'success' => true,
                    'message' => 'Login successful',
                    'user' => ['username' => ADMIN_USERNAME, 'role' => 'admin']
                ]);
            } else {
                sendError('Invalid credentials', 401);
            }
        } elseif ($action === 'logout') {
            logoutAdmin();
            sendResponse(['success' => true, 'message' => 'Logout successful']);
        } else {
            sendError('Invalid action');
        }
        break;
        
    case 'GET':
        if (isAdminLoggedIn()) {
            sendResponse([
                'logged_in' => true,
                'user' => ['username' => ADMIN_USERNAME, 'role' => 'admin']
            ]);
        } else {
            sendResponse(['logged_in' => false]);
        }
        break;
        
    default:
        sendError('Method not allowed', 405);
}
?>