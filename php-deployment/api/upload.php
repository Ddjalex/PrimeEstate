<?php
require_once '../includes/config.php';

setCorsHeaders();

if (!isAdminLoggedIn()) {
    sendError('Unauthorized', 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$type = $_POST['type'] ?? 'properties'; // 'properties' or 'slider'

if (!in_array($type, ['properties', 'slider'])) {
    sendError('Invalid upload type');
}

if (!isset($_FILES['file'])) {
    sendError('No file uploaded');
}

$file = $_FILES['file'];

// Check for upload errors
if ($file['error'] !== UPLOAD_ERR_OK) {
    sendError('File upload error: ' . $file['error']);
}

// Check file size
if ($file['size'] > MAX_FILE_SIZE) {
    sendError('File too large. Maximum size: ' . (MAX_FILE_SIZE / 1024 / 1024) . 'MB');
}

// Check file extension
$extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($extension, ALLOWED_EXTENSIONS)) {
    sendError('Invalid file type. Allowed: ' . implode(', ', ALLOWED_EXTENSIONS));
}

// Generate unique filename
$filename = uniqid() . '_' . time() . '.' . $extension;
$uploadDir = UPLOAD_DIR . $type . '/';

// Create directory if it doesn't exist
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$filepath = $uploadDir . $filename;

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $filepath)) {
    $url = '/uploads/' . $type . '/' . $filename;
    sendResponse([
        'success' => true,
        'url' => $url,
        'filename' => $filename,
        'type' => $type
    ]);
} else {
    sendError('Failed to save file');
}
?>