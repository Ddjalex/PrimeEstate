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

class SettingsAPI {
    private $db;
    private $conn;
    
    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }
    
    // WhatsApp Settings
    public function getWhatsAppSettings() {
        try {
            $query = "SELECT * FROM whatsapp_settings ORDER BY id DESC LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            $row = $stmt->fetch();
            if (!$row) {
                return null;
            }
            
            return [
                'id' => (string)$row['id'],
                'phoneNumber' => $row['phoneNumber'],
                'isActive' => (bool)$row['isActive'],
                'businessName' => $row['businessName'],
                'welcomeMessage' => $row['welcomeMessage'],
                'propertyInquiryTemplate' => $row['propertyInquiryTemplate'],
                'generalInquiryTemplate' => $row['generalInquiryTemplate'],
                'createdAt' => $row['createdAt'],
                'updatedAt' => $row['updatedAt']
            ];
        } catch(Exception $e) {
            throw new Exception("Error fetching WhatsApp settings: " . $e->getMessage());
        }
    }
    
    public function updateWhatsAppSettings($data) {
        try {
            // Check if settings exist
            $existing = $this->getWhatsAppSettings();
            
            if (!$existing) {
                // Create new settings
                $query = "INSERT INTO whatsapp_settings (phoneNumber, isActive, businessName, welcomeMessage, propertyInquiryTemplate, generalInquiryTemplate) VALUES (?, ?, ?, ?, ?, ?)";
                $stmt = $this->conn->prepare($query);
                $stmt->execute([
                    $data['phoneNumber'] ?? '+251975666699',
                    $data['isActive'] ?? true,
                    $data['businessName'] ?? 'Temer Properties',
                    $data['welcomeMessage'] ?? 'Hello! Welcome to Temer Properties. How can we assist you today?',
                    $data['propertyInquiryTemplate'] ?? "Hello! I'm interested in this property:\n\n🏠 *{title}*\n📍 Location: {location}\n🛏️ Bedrooms: {bedrooms}\n🚿 Bathrooms: {bathrooms}\n📐 Size: {size} m²\n\nCould you please provide more information about this property? I would like to schedule a viewing or discuss the details further.\n\nThank you!",
                    $data['generalInquiryTemplate'] ?? "Hello Temer Properties! 👋\n\nI'm interested in learning more about your real estate services. Could you please help me with information about available properties?\n\nThank you!"
                ]);
            } else {
                // Update existing settings
                $setParts = [];
                $values = [];
                
                foreach ($data as $key => $value) {
                    if ($key !== 'id' && $key !== 'createdAt') {
                        $setParts[] = "$key = ?";
                        $values[] = $value;
                    }
                }
                
                if (!empty($setParts)) {
                    $values[] = $existing['id'];
                    $query = "UPDATE whatsapp_settings SET " . implode(', ', $setParts) . " WHERE id = ?";
                    $stmt = $this->conn->prepare($query);
                    $stmt->execute($values);
                }
            }
            
            return $this->getWhatsAppSettings();
        } catch(Exception $e) {
            throw new Exception("Error updating WhatsApp settings: " . $e->getMessage());
        }
    }
    
    // Contact Settings
    public function getContactSettings() {
        try {
            $query = "SELECT * FROM contact_settings ORDER BY id DESC LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            $row = $stmt->fetch();
            if (!$row) {
                return null;
            }
            
            return [
                'id' => (string)$row['id'],
                'phone' => $row['phone'],
                'email' => $row['email'],
                'address' => $row['address'],
                'isActive' => (bool)$row['isActive'],
                'createdAt' => $row['createdAt'],
                'updatedAt' => $row['updatedAt']
            ];
        } catch(Exception $e) {
            throw new Exception("Error fetching contact settings: " . $e->getMessage());
        }
    }
    
    public function updateContactSettings($data) {
        try {
            // Check if settings exist
            $existing = $this->getContactSettings();
            
            if (!$existing) {
                // Create new settings
                $query = "INSERT INTO contact_settings (phone, email, address, isActive) VALUES (?, ?, ?, ?)";
                $stmt = $this->conn->prepare($query);
                $stmt->execute([
                    $data['phone'] ?? '+251 911 123 456',
                    $data['email'] ?? 'info@temerproperties.com',
                    $data['address'] ?? 'Bole Road, Addis Ababa, Ethiopia',
                    $data['isActive'] ?? true
                ]);
            } else {
                // Update existing settings
                $setParts = [];
                $values = [];
                
                foreach ($data as $key => $value) {
                    if ($key !== 'id' && $key !== 'createdAt') {
                        $setParts[] = "$key = ?";
                        $values[] = $value;
                    }
                }
                
                if (!empty($setParts)) {
                    $values[] = $existing['id'];
                    $query = "UPDATE contact_settings SET " . implode(', ', $setParts) . " WHERE id = ?";
                    $stmt = $this->conn->prepare($query);
                    $stmt->execute($values);
                }
            }
            
            return $this->getContactSettings();
        } catch(Exception $e) {
            throw new Exception("Error updating contact settings: " . $e->getMessage());
        }
    }
    
    // Contact Messages
    public function getContactMessages() {
        try {
            $query = "SELECT * FROM contact_messages ORDER BY createdAt DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            $messages = [];
            while ($row = $stmt->fetch()) {
                $message = [
                    'id' => (string)$row['id'],
                    'name' => $row['name'],
                    'email' => $row['email'],
                    'phone' => $row['phone'],
                    'message' => $row['message'],
                    'isRead' => (bool)$row['isRead'],
                    'createdAt' => $row['createdAt']
                ];
                $messages[] = $message;
            }
            
            return $messages;
        } catch(Exception $e) {
            throw new Exception("Error fetching contact messages: " . $e->getMessage());
        }
    }
    
    public function createContactMessage($data) {
        try {
            $query = "INSERT INTO contact_messages (name, email, phone, message, isRead) VALUES (?, ?, ?, ?, ?)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                $data['name'],
                $data['email'],
                $data['phone'],
                $data['message'],
                false
            ]);
            
            $messageId = $this->conn->lastInsertId();
            
            // Get the created message
            $query = "SELECT * FROM contact_messages WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$messageId]);
            $row = $stmt->fetch();
            
            return [
                'id' => (string)$row['id'],
                'name' => $row['name'],
                'email' => $row['email'],
                'phone' => $row['phone'],
                'message' => $row['message'],
                'isRead' => (bool)$row['isRead'],
                'createdAt' => $row['createdAt']
            ];
        } catch(Exception $e) {
            throw new Exception("Error creating contact message: " . $e->getMessage());
        }
    }
    
    public function markMessageAsRead($id) {
        try {
            $query = "UPDATE contact_messages SET isRead = 1 WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$id]);
            
            return $stmt->rowCount() > 0;
        } catch(Exception $e) {
            throw new Exception("Error marking message as read: " . $e->getMessage());
        }
    }
}

// Handle API requests
try {
    $api = new SettingsAPI();
    $method = $_SERVER['REQUEST_METHOD'];
    $path = $_SERVER['REQUEST_URI'];
    
    // Parse the endpoint
    $pathParts = explode('/', trim($path, '/'));
    $endpoint = end($pathParts);
    
    if (strpos($path, 'whatsapp') !== false) {
        // WhatsApp settings
        switch ($method) {
            case 'GET':
                $result = $api->getWhatsAppSettings();
                echo json_encode($result);
                break;
                
            case 'PUT':
                $input = json_decode(file_get_contents('php://input'), true);
                if (!$input) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid JSON data']);
                    break;
                }
                
                $result = $api->updateWhatsAppSettings($input);
                echo json_encode($result);
                break;
                
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
                break;
        }
        
    } elseif (strpos($path, 'contact') !== false) {
        
        if (strpos($path, 'settings') !== false) {
            // Contact settings
            switch ($method) {
                case 'GET':
                    $result = $api->getContactSettings();
                    echo json_encode($result);
                    break;
                    
                case 'PUT':
                    $input = json_decode(file_get_contents('php://input'), true);
                    if (!$input) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Invalid JSON data']);
                        break;
                    }
                    
                    $result = $api->updateContactSettings($input);
                    echo json_encode($result);
                    break;
                    
                default:
                    http_response_code(405);
                    echo json_encode(['error' => 'Method not allowed']);
                    break;
            }
            
        } elseif (strpos($path, 'messages') !== false) {
            // Contact messages
            switch ($method) {
                case 'GET':
                    $result = $api->getContactMessages();
                    echo json_encode($result);
                    break;
                    
                case 'POST':
                    $input = json_decode(file_get_contents('php://input'), true);
                    if (!$input) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Invalid JSON data']);
                        break;
                    }
                    
                    $result = $api->createContactMessage($input);
                    http_response_code(201);
                    echo json_encode($result);
                    break;
                    
                case 'PUT':
                    // Mark as read
                    $pathParts = explode('/', trim($path, '/'));
                    $id = null;
                    if (end($pathParts) && is_numeric(end($pathParts))) {
                        $id = end($pathParts);
                    }
                    
                    if (!$id) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Message ID required']);
                        break;
                    }
                    
                    $success = $api->markMessageAsRead($id);
                    if ($success) {
                        echo json_encode(['message' => 'Message marked as read']);
                    } else {
                        http_response_code(404);
                        echo json_encode(['error' => 'Message not found']);
                    }
                    break;
                    
                default:
                    http_response_code(405);
                    echo json_encode(['error' => 'Method not allowed']);
                    break;
            }
        }
        
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>