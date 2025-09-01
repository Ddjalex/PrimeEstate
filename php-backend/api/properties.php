<?php
require_once '../includes/config.php';
require_once '../includes/database.php';

setCorsHeaders();

$db = new Database();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $properties = $db->getProperties();
        sendResponse($properties);
        break;
        
    case 'POST':
        if (!isAdminLoggedIn()) {
            sendError('Unauthorized', 401);
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            sendError('Invalid JSON data');
        }
        
        $required = ['title', 'description', 'price', 'location', 'bedrooms', 'bathrooms', 'area', 'type', 'status'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                sendError("Missing required field: $field");
            }
        }
        
        $property = $db->createProperty($input);
        sendResponse($property, 201);
        break;
        
    case 'PUT':
        if (!isAdminLoggedIn()) {
            sendError('Unauthorized', 401);
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            sendError('Property ID required');
        }
        
        $property = $db->updateProperty($id, $input);
        if (!$property) {
            sendError('Property not found', 404);
        }
        
        sendResponse($property);
        break;
        
    case 'DELETE':
        if (!isAdminLoggedIn()) {
            sendError('Unauthorized', 401);
        }
        
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            sendError('Property ID required');
        }
        
        $db->deleteProperty($id);
        sendResponse(['message' => 'Property deleted successfully']);
        break;
        
    default:
        sendError('Method not allowed', 405);
}
?>