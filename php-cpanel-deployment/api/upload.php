<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';
require_once 'auth.php';

class UploadAPI {
    private $db;
    private $conn;
    private $uploadDir;
    private $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    private $maxFileSize = 5 * 1024 * 1024; // 5MB
    
    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
        
        // Create upload directories
        $this->uploadDir = '../uploads/';
        if (!file_exists($this->uploadDir)) {
            mkdir($this->uploadDir, 0755, true);
        }
        if (!file_exists($this->uploadDir . 'properties/')) {
            mkdir($this->uploadDir . 'properties/', 0755, true);
        }
        if (!file_exists($this->uploadDir . 'slider/')) {
            mkdir($this->uploadDir . 'slider/', 0755, true);
        }
    }
    
    // Upload property image
    public function uploadPropertyImage($propertyId, $file, $description = '', $isMain = false) {
        try {
            // Validate file
            $validation = $this->validateFile($file);
            if (!$validation['valid']) {
                return ['success' => false, 'message' => $validation['message']];
            }
            
            // Generate unique filename
            $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = 'image-' . time() . '-' . rand(10000000, 99999999) . '.' . $fileExtension;
            $targetPath = $this->uploadDir . 'properties/' . $filename;
            
            // Move uploaded file
            if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
                return ['success' => false, 'message' => 'Failed to upload file'];
            }
            
            // Save to database
            $imageUrl = '/uploads/properties/' . $filename;
            $query = "INSERT INTO property_images (propertyId, imageUrl, description, isMain, sortOrder) VALUES (?, ?, ?, ?, ?)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$propertyId, $imageUrl, $description, $isMain, 0]);
            
            $imageId = $this->conn->lastInsertId();
            
            // If this is main image, set others to not main
            if ($isMain) {
                $query = "UPDATE property_images SET isMain = 0 WHERE propertyId = ? AND id != ?";
                $stmt = $this->conn->prepare($query);
                $stmt->execute([$propertyId, $imageId]);
            }
            
            return [
                'success' => true,
                'message' => 'Image uploaded successfully',
                'image' => [
                    'id' => (string)$imageId,
                    'propertyId' => (string)$propertyId,
                    'imageUrl' => $imageUrl,
                    'description' => $description,
                    'isMain' => (bool)$isMain
                ]
            ];
            
        } catch(Exception $e) {
            return ['success' => false, 'message' => 'Upload failed: ' . $e->getMessage()];
        }
    }
    
    // Upload slider image
    public function uploadSliderImage($file, $title, $description) {
        try {
            // Validate file
            $validation = $this->validateFile($file);
            if (!$validation['valid']) {
                return ['success' => false, 'message' => $validation['message']];
            }
            
            // Generate unique filename
            $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = 'image-' . time() . '-' . rand(10000000, 99999999) . '.' . $fileExtension;
            $targetPath = $this->uploadDir . 'slider/' . $filename;
            
            // Move uploaded file
            if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
                return ['success' => false, 'message' => 'Failed to upload file'];
            }
            
            // Save to database
            $imageUrl = '/uploads/slider/' . $filename;
            $query = "INSERT INTO slider_images (imageUrl, title, description, isActive) VALUES (?, ?, ?, ?)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$imageUrl, $title, $description, true]);
            
            $imageId = $this->conn->lastInsertId();
            
            return [
                'success' => true,
                'message' => 'Slider image uploaded successfully',
                'image' => [
                    'id' => (string)$imageId,
                    'imageUrl' => $imageUrl,
                    'title' => $title,
                    'description' => $description,
                    'isActive' => true
                ]
            ];
            
        } catch(Exception $e) {
            return ['success' => false, 'message' => 'Upload failed: ' . $e->getMessage()];
        }
    }
    
    // Validate uploaded file
    private function validateFile($file) {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return ['valid' => false, 'message' => 'Upload error occurred'];
        }
        
        if ($file['size'] > $this->maxFileSize) {
            return ['valid' => false, 'message' => 'File size too large (max 5MB)'];
        }
        
        if (!in_array($file['type'], $this->allowedTypes)) {
            return ['valid' => false, 'message' => 'Invalid file type. Only JPEG, JPG, and PNG allowed'];
        }
        
        return ['valid' => true];
    }
    
    // Delete image file
    public function deleteImageFile($imageUrl) {
        $filePath = '..' . $imageUrl;
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }
}

// Handle API requests
try {
    // Check authentication
    $auth = new AuthAPI();
    $auth->requireAdmin();
    
    $api = new UploadAPI();
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit();
    }
    
    // Determine upload type from URL
    $path = $_SERVER['REQUEST_URI'];
    
    if (strpos($path, 'property') !== false) {
        // Property image upload
        if (!isset($_FILES['image']) || !isset($_POST['propertyId'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Image file and property ID required']);
            exit();
        }
        
        $propertyId = $_POST['propertyId'];
        $description = $_POST['description'] ?? '';
        $isMain = isset($_POST['isMain']) ? (bool)$_POST['isMain'] : false;
        
        $result = $api->uploadPropertyImage($propertyId, $_FILES['image'], $description, $isMain);
        
    } elseif (strpos($path, 'slider') !== false) {
        // Slider image upload
        if (!isset($_FILES['image']) || !isset($_POST['title']) || !isset($_POST['description'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Image file, title, and description required']);
            exit();
        }
        
        $title = $_POST['title'];
        $description = $_POST['description'];
        
        $result = $api->uploadSliderImage($_FILES['image'], $title, $description);
        
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid upload endpoint']);
        exit();
    }
    
    if (!$result['success']) {
        http_response_code(400);
    }
    
    echo json_encode($result);
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>