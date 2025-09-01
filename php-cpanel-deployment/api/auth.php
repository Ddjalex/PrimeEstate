<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

class AuthAPI {
    private $db;
    private $conn;
    
    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }
    
    // Login
    public function login($username, $password) {
        try {
            $query = "SELECT * FROM users WHERE username = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$username]);
            
            $user = $stmt->fetch();
            if (!$user || !password_verify($password, $user['password'])) {
                return ['success' => false, 'message' => 'Invalid credentials'];
            }
            
            // Set session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['is_admin'] = $user['isAdmin'];
            $_SESSION['logged_in'] = true;
            
            return [
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => (string)$user['id'],
                    'username' => $user['username'],
                    'isAdmin' => (bool)$user['isAdmin']
                ]
            ];
        } catch(Exception $e) {
            return ['success' => false, 'message' => 'Login failed: ' . $e->getMessage()];
        }
    }
    
    // Register
    public function register($username, $password, $isAdmin = false) {
        try {
            // Check if user already exists
            $query = "SELECT COUNT(*) as count FROM users WHERE username = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$username]);
            $result = $stmt->fetch();
            
            if ($result['count'] > 0) {
                return ['success' => false, 'message' => 'Username already exists'];
            }
            
            // Create user
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $query = "INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$username, $hashedPassword, $isAdmin]);
            
            $userId = $this->conn->lastInsertId();
            
            return [
                'success' => true,
                'message' => 'User created successfully',
                'user' => [
                    'id' => (string)$userId,
                    'username' => $username,
                    'isAdmin' => (bool)$isAdmin
                ]
            ];
        } catch(Exception $e) {
            return ['success' => false, 'message' => 'Registration failed: ' . $e->getMessage()];
        }
    }
    
    // Logout
    public function logout() {
        session_destroy();
        return ['success' => true, 'message' => 'Logged out successfully'];
    }
    
    // Check if user is logged in
    public function checkAuth() {
        if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
            return [
                'authenticated' => true,
                'user' => [
                    'id' => (string)$_SESSION['user_id'],
                    'username' => $_SESSION['username'],
                    'isAdmin' => (bool)$_SESSION['is_admin']
                ]
            ];
        }
        
        return ['authenticated' => false];
    }
    
    // Middleware to check admin access
    public function requireAdmin() {
        if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in'] || !$_SESSION['is_admin']) {
            http_response_code(403);
            echo json_encode(['error' => 'Admin access required']);
            exit();
        }
    }
}

// Handle API requests
try {
    $api = new AuthAPI();
    $method = $_SERVER['REQUEST_METHOD'];
    $path = $_SERVER['REQUEST_URI'];
    
    // Parse the endpoint
    $pathParts = explode('/', trim($path, '/'));
    $endpoint = end($pathParts);
    
    switch ($method) {
        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            
            if ($endpoint === 'login') {
                if (!isset($input['username']) || !isset($input['password'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Username and password required']);
                    break;
                }
                
                $result = $api->login($input['username'], $input['password']);
                if (!$result['success']) {
                    http_response_code(401);
                }
                echo json_encode($result);
                
            } elseif ($endpoint === 'register') {
                if (!isset($input['username']) || !isset($input['password'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Username and password required']);
                    break;
                }
                
                $isAdmin = isset($input['isAdmin']) ? $input['isAdmin'] : false;
                $result = $api->register($input['username'], $input['password'], $isAdmin);
                if (!$result['success']) {
                    http_response_code(400);
                }
                echo json_encode($result);
                
            } elseif ($endpoint === 'logout') {
                $result = $api->logout();
                echo json_encode($result);
                
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Endpoint not found']);
            }
            break;
            
        case 'GET':
            if ($endpoint === 'check' || $endpoint === 'me') {
                $result = $api->checkAuth();
                echo json_encode($result);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Endpoint not found']);
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