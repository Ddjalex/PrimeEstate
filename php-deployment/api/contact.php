<?php
require_once '../includes/config.php';
require_once '../includes/database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    sendError('Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    sendError('Invalid JSON data');
}

$required = ['name', 'email', 'message'];
foreach ($required as $field) {
    if (!isset($input[$field]) || empty(trim($input[$field]))) {
        sendError("Missing required field: $field");
    }
}

// Sanitize input
$name = htmlspecialchars(trim($input['name']));
$email = filter_var(trim($input['email']), FILTER_VALIDATE_EMAIL);
$phone = isset($input['phone']) ? htmlspecialchars(trim($input['phone'])) : '';
$subject = isset($input['subject']) ? htmlspecialchars(trim($input['subject'])) : 'Website Contact Form';
$message = htmlspecialchars(trim($input['message']));

if (!$email) {
    sendError('Invalid email address');
}

// Get contact settings
$db = new Database();
$contactSettings = $db->getSettings('contact');

// Create email message
$emailBody = "
New contact form submission from Temer Properties website:

Name: $name
Email: $email
Phone: $phone
Subject: $subject

Message:
$message

---
Sent from temerrealestateasales.com
Time: " . date('Y-m-d H:i:s');

// For demonstration, we'll log the message
// In production, you would send actual email
$logDir = __DIR__ . '/../data/';
if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}

$logFile = $logDir . 'contact_messages.log';
$logEntry = date('Y-m-d H:i:s') . " - Contact from $name ($email): $message\n";
file_put_contents($logFile, $logEntry, FILE_APPEND);

// Simulate WhatsApp notification
$whatsappMessage = "New contact from website: $name ($email) - $message";

sendResponse([
    'success' => true,
    'message' => 'Thank you for your message! We will get back to you soon.',
    'whatsapp_sent' => true,
    'whatsapp_number' => WHATSAPP_PHONE
]);
?>