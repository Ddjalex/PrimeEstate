<?php
require_once '../includes/config.php';
require_once '../includes/database.php';

setCorsHeaders();

$db = new Database();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $slider = $db->getSliderImages();
        sendResponse($slider);
        break;
        
    case 'POST':
        if (!isAdminLoggedIn()) {
            sendError('Unauthorized', 401);
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['imageUrl'])) {
            sendError('Image URL required');
        }
        
        $sliderImage = $db->createSliderImage($input);
        sendResponse($sliderImage, 201);
        break;
        
    case 'DELETE':
        if (!isAdminLoggedIn()) {
            sendError('Unauthorized', 401);
        }
        
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            sendError('Slider image ID required');
        }
        
        $db->deleteSliderImage($id);
        sendResponse(['message' => 'Slider image deleted successfully']);
        break;
        
    default:
        sendError('Method not allowed', 405);
}
?>