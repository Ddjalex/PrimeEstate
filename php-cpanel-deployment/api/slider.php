<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

class SliderAPI {
    private $db;
    private $conn;
    
    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }
    
    // GET all slider images
    public function getSliderImages() {
        try {
            $query = "SELECT * FROM slider_images WHERE isActive = 1 ORDER BY createdAt DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            $images = [];
            while ($row = $stmt->fetch()) {
                $image = [
                    'id' => (string)$row['id'],
                    'imageUrl' => $row['imageUrl'],
                    'title' => $row['title'],
                    'description' => $row['description'],
                    'isActive' => (bool)$row['isActive'],
                    'createdAt' => $row['createdAt']
                ];
                $images[] = $image;
            }
            
            return $images;
        } catch(Exception $e) {
            throw new Exception("Error fetching slider images: " . $e->getMessage());
        }
    }
    
    // GET single slider image
    public function getSliderImage($id) {
        try {
            $query = "SELECT * FROM slider_images WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$id]);
            
            $row = $stmt->fetch();
            if (!$row) {
                return null;
            }
            
            $image = [
                'id' => (string)$row['id'],
                'imageUrl' => $row['imageUrl'],
                'title' => $row['title'],
                'description' => $row['description'],
                'isActive' => (bool)$row['isActive'],
                'createdAt' => $row['createdAt']
            ];
            
            return $image;
        } catch(Exception $e) {
            throw new Exception("Error fetching slider image: " . $e->getMessage());
        }
    }
    
    // POST create slider image
    public function createSliderImage($data) {
        try {
            $query = "INSERT INTO slider_images (imageUrl, title, description, isActive) VALUES (?, ?, ?, ?)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                $data['imageUrl'],
                $data['title'],
                $data['description'],
                $data['isActive'] ?? true
            ]);
            
            $imageId = $this->conn->lastInsertId();
            return $this->getSliderImage($imageId);
        } catch(Exception $e) {
            throw new Exception("Error creating slider image: " . $e->getMessage());
        }
    }
    
    // PUT update slider image
    public function updateSliderImage($id, $data) {
        try {
            $setParts = [];
            $values = [];
            
            foreach ($data as $key => $value) {
                if ($key !== 'id' && $key !== 'createdAt') {
                    $setParts[] = "$key = ?";
                    $values[] = $value;
                }
            }
            
            if (empty($setParts)) {
                return $this->getSliderImage($id);
            }
            
            $values[] = $id;
            $query = "UPDATE slider_images SET " . implode(', ', $setParts) . " WHERE id = ?";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute($values);
            
            return $this->getSliderImage($id);
        } catch(Exception $e) {
            throw new Exception("Error updating slider image: " . $e->getMessage());
        }
    }
    
    // DELETE slider image
    public function deleteSliderImage($id) {
        try {
            // Get image info for file deletion
            $image = $this->getSliderImage($id);
            
            $query = "DELETE FROM slider_images WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$id]);
            
            // Delete physical file
            if ($image && $stmt->rowCount() > 0) {
                $filePath = '..' . $image['imageUrl'];
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }
            
            return $stmt->rowCount() > 0;
        } catch(Exception $e) {
            throw new Exception("Error deleting slider image: " . $e->getMessage());
        }
    }
}

// Handle API requests
try {
    $api = new SliderAPI();
    $method = $_SERVER['REQUEST_METHOD'];
    $path = $_SERVER['REQUEST_URI'];
    
    // Parse the path to get ID if present
    $pathParts = explode('/', trim($path, '/'));
    $id = null;
    if (end($pathParts) && is_numeric(end($pathParts))) {
        $id = end($pathParts);
    }
    
    switch ($method) {
        case 'GET':
            if ($id) {
                $result = $api->getSliderImage($id);
                if ($result === null) {
                    http_response_code(404);
                    echo json_encode(['error' => 'Slider image not found']);
                } else {
                    echo json_encode($result);
                }
            } else {
                $result = $api->getSliderImages();
                echo json_encode($result);
            }
            break;
            
        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid JSON data']);
                break;
            }
            
            $result = $api->createSliderImage($input);
            http_response_code(201);
            echo json_encode($result);
            break;
            
        case 'PUT':
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Slider image ID required']);
                break;
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid JSON data']);
                break;
            }
            
            $result = $api->updateSliderImage($id, $input);
            echo json_encode($result);
            break;
            
        case 'DELETE':
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Slider image ID required']);
                break;
            }
            
            $success = $api->deleteSliderImage($id);
            if ($success) {
                echo json_encode(['message' => 'Slider image deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Slider image not found']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>