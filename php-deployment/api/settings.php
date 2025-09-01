<?php
require_once '../includes/config.php';
require_once '../includes/database.php';

setCorsHeaders();

$db = new Database();
$method = $_SERVER['REQUEST_METHOD'];
$type = $_GET['type'] ?? '';

if (!in_array($type, ['whatsapp', 'contact'])) {
    sendError('Invalid settings type');
}

switch ($method) {
    case 'GET':
        $settings = $db->getSettings($type);
        if (!$settings) {
            sendError('Settings not found', 404);
        }
        sendResponse($settings);
        break;
        
    case 'PUT':
        if (!isAdminLoggedIn()) {
            sendError('Unauthorized', 401);
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            sendError('Invalid JSON data');
        }
        
        $settings = $db->updateSettings($type, $input);
        sendResponse($settings);
        break;
        
    default:
        sendError('Method not allowed', 405);
}
?>