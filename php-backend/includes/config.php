<?php
// Temer Properties PHP Configuration
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database Configuration
define('MONGODB_URI', 'mongodb+srv://almeseged:A1l2m3e4s5@cluster0.t6sz6bo.mongodb.net/temer-properties');
define('DB_NAME', 'temer-properties');

// File Upload Configuration
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png']);

// Admin Configuration
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'admin123');

// WhatsApp Configuration
define('WHATSAPP_PHONE', '+251975666699');

// CORS Headers
function setCorsHeaders() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Content-Type: application/json");
    
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// Response Helper
function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit();
}

// Error Handler
function sendError($message, $status = 400) {
    sendResponse(['error' => $message], $status);
}

// Session Management
session_start();

// Check if admin is logged in
function isAdminLoggedIn() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

// Admin login
function loginAdmin($username, $password) {
    if ($username === ADMIN_USERNAME && $password === ADMIN_PASSWORD) {
        $_SESSION['admin_logged_in'] = true;
        return true;
    }
    return false;
}

// Admin logout
function logoutAdmin() {
    unset($_SESSION['admin_logged_in']);
    session_destroy();
}
?>