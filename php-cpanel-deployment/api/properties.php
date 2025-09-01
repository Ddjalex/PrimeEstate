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

class PropertiesAPI {
    private $db;
    private $conn;
    
    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }
    
    // GET all properties
    public function getProperties() {
        try {
            $query = "SELECT * FROM properties WHERE isActive = 1 ORDER BY createdAt DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            $properties = [];
            while ($row = $stmt->fetch()) {
                $property = [
                    'id' => (string)$row['id'],
                    'title' => $row['title'],
                    'description' => $row['description'],
                    'location' => $row['location'],
                    'propertyType' => $row['propertyType'],
                    'bedrooms' => (int)$row['bedrooms'],
                    'bathrooms' => (int)$row['bathrooms'],
                    'size' => (int)$row['size'],
                    'status' => json_decode($row['status'], true),
                    'imageUrls' => json_decode($row['imageUrls'], true),
                    'isActive' => (bool)$row['isActive'],
                    'createdAt' => $row['createdAt'],
                    'updatedAt' => $row['updatedAt']
                ];
                $properties[] = $property;
            }
            
            return $properties;
        } catch(Exception $e) {
            throw new Exception("Error fetching properties: " . $e->getMessage());
        }
    }
    
    // GET single property
    public function getProperty($id) {
        try {
            $query = "SELECT * FROM properties WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$id]);
            
            $row = $stmt->fetch();
            if (!$row) {
                return null;
            }
            
            $property = [
                'id' => (string)$row['id'],
                'title' => $row['title'],
                'description' => $row['description'],
                'location' => $row['location'],
                'propertyType' => $row['propertyType'],
                'bedrooms' => (int)$row['bedrooms'],
                'bathrooms' => (int)$row['bathrooms'],
                'size' => (int)$row['size'],
                'status' => json_decode($row['status'], true),
                'imageUrls' => json_decode($row['imageUrls'], true),
                'isActive' => (bool)$row['isActive'],
                'createdAt' => $row['createdAt'],
                'updatedAt' => $row['updatedAt']
            ];
            
            return $property;
        } catch(Exception $e) {
            throw new Exception("Error fetching property: " . $e->getMessage());
        }
    }
    
    // POST create property
    public function createProperty($data) {
        try {
            $query = "INSERT INTO properties (title, description, location, propertyType, bedrooms, bathrooms, size, status, imageUrls, isActive) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                $data['title'],
                $data['description'],
                $data['location'],
                $data['propertyType'],
                $data['bedrooms'] ?? 0,
                $data['bathrooms'] ?? 0,
                $data['size'],
                json_encode($data['status'] ?? ['For Sale']),
                json_encode($data['imageUrls'] ?? []),
                $data['isActive'] ?? true
            ]);
            
            $propertyId = $this->conn->lastInsertId();
            return $this->getProperty($propertyId);
        } catch(Exception $e) {
            throw new Exception("Error creating property: " . $e->getMessage());
        }
    }
    
    // PUT update property
    public function updateProperty($id, $data) {
        try {
            $setParts = [];
            $values = [];
            
            foreach ($data as $key => $value) {
                if ($key === 'status' || $key === 'imageUrls') {
                    $setParts[] = "$key = ?";
                    $values[] = json_encode($value);
                } elseif ($key !== 'id' && $key !== 'createdAt') {
                    $setParts[] = "$key = ?";
                    $values[] = $value;
                }
            }
            
            if (empty($setParts)) {
                return $this->getProperty($id);
            }
            
            $values[] = $id;
            $query = "UPDATE properties SET " . implode(', ', $setParts) . " WHERE id = ?";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute($values);
            
            return $this->getProperty($id);
        } catch(Exception $e) {
            throw new Exception("Error updating property: " . $e->getMessage());
        }
    }
    
    // DELETE property
    public function deleteProperty($id) {
        try {
            $query = "DELETE FROM properties WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$id]);
            
            return $stmt->rowCount() > 0;
        } catch(Exception $e) {
            throw new Exception("Error deleting property: " . $e->getMessage());
        }
    }
}

// Handle API requests
try {
    $api = new PropertiesAPI();
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
                $result = $api->getProperty($id);
                if ($result === null) {
                    http_response_code(404);
                    echo json_encode(['error' => 'Property not found']);
                } else {
                    echo json_encode($result);
                }
            } else {
                $result = $api->getProperties();
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
            
            $result = $api->createProperty($input);
            http_response_code(201);
            echo json_encode($result);
            break;
            
        case 'PUT':
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Property ID required']);
                break;
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid JSON data']);
                break;
            }
            
            $result = $api->updateProperty($id, $input);
            echo json_encode($result);
            break;
            
        case 'DELETE':
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Property ID required']);
                break;
            }
            
            $success = $api->deleteProperty($id);
            if ($success) {
                echo json_encode(['message' => 'Property deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Property not found']);
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