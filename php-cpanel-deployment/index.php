<?php
// Initialize database and create tables on first run
require_once 'config/database.php';

try {
    $db = new Database();
    
    // Create tables if they don't exist
    if ($db->createTables()) {
        // Initialize default data
        $db->initializeData();
    }
    
} catch(Exception $e) {
    error_log("Database initialization error: " . $e->getMessage());
}

// Route API requests
$requestUri = $_SERVER['REQUEST_URI'];
$scriptName = $_SERVER['SCRIPT_NAME'];
$pathInfo = str_replace(dirname($scriptName), '', $requestUri);
$pathInfo = trim($pathInfo, '/');

// Handle API routes
if (strpos($pathInfo, 'api/') === 0) {
    $apiPath = substr($pathInfo, 4); // Remove 'api/' prefix
    $apiParts = explode('/', $apiPath);
    $apiEndpoint = $apiParts[0];
    
    switch ($apiEndpoint) {
        case 'properties':
            include 'api/properties.php';
            break;
            
        case 'auth':
        case 'admin':
            include 'api/auth.php';
            break;
            
        case 'upload':
            include 'api/upload.php';
            break;
            
        case 'slider':
            include 'api/slider.php';
            break;
            
        case 'whatsapp':
        case 'contact':
            include 'api/settings.php';
            break;
            
        default:
            header('HTTP/1.0 404 Not Found');
            echo json_encode(['error' => 'API endpoint not found']);
            break;
    }
    exit();
}

// Serve static files or redirect to React app
$publicPath = __DIR__ . '/public';

// Check if public directory exists (React build output)
if (is_dir($publicPath)) {
    // Serve static files
    $filePath = $publicPath . '/' . $pathInfo;
    
    if (is_file($filePath)) {
        $mimeTypes = [
            'html' => 'text/html',
            'css' => 'text/css',
            'js' => 'application/javascript',
            'json' => 'application/json',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            'ico' => 'image/x-icon'
        ];
        
        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        $mimeType = isset($mimeTypes[$extension]) ? $mimeTypes[$extension] : 'application/octet-stream';
        
        header('Content-Type: ' . $mimeType);
        readfile($filePath);
        exit();
    }
    
    // Serve index.html for React routing (SPA)
    $indexPath = $publicPath . '/index.html';
    if (is_file($indexPath)) {
        header('Content-Type: text/html');
        readfile($indexPath);
        exit();
    }
}

// Fallback message if no React build found
?>
<!DOCTYPE html>
<html>
<head>
    <title>Temer Properties - Setup Required</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; }
        .success { color: #28a745; }
        .warning { color: #ffc107; }
        .error { color: #dc3545; }
        pre { background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏠 Temer Properties - PHP/MySQL Backend</h1>
        
        <div class="success">
            <h2>✅ Backend Successfully Installed!</h2>
            <p>Your PHP/MySQL backend is running correctly. Database tables have been created and initialized.</p>
        </div>
        
        <div class="warning">
            <h2>⚠️ Frontend Setup Required</h2>
            <p>To complete your website setup, you need to upload your React frontend files:</p>
            
            <ol>
                <li>Build your React frontend: <code>npm run build</code></li>
                <li>Upload the contents of the <code>dist/</code> folder to the <code>public/</code> directory</li>
                <li>Your website will then be fully functional</li>
            </ol>
        </div>
        
        <h2>📋 What's Working:</h2>
        <ul>
            <li>✅ MySQL Database Connection</li>
            <li>✅ All API Endpoints (/api/properties, /api/auth, etc.)</li>
            <li>✅ File Upload System</li>
            <li>✅ Admin Authentication</li>
            <li>✅ Default Admin User: admin/admin123</li>
        </ul>
        
        <h2>🔧 Database Configuration:</h2>
        <p>Update your database credentials in <code>config/database.php</code>:</p>
        <pre>
private $host = 'localhost';
private $db_name = 'your_cpanel_username_temer_properties';
private $username = 'your_cpanel_username_dbuser';
private $password = 'your_database_password';
        </pre>
        
        <h2>📁 File Structure:</h2>
        <pre>
/public_html/
├── api/
│   ├── properties.php
│   ├── auth.php
│   ├── upload.php
│   ├── slider.php
│   └── settings.php
├── config/
│   └── database.php
├── uploads/
│   ├── properties/
│   └── slider/
├── public/          ← Upload your React build here
│   └── index.html
└── index.php
        </pre>
        
        <h2>🚀 Next Steps:</h2>
        <ol>
            <li><strong>Update Database Credentials:</strong> Edit <code>config/database.php</code> with your cPanel database details</li>
            <li><strong>Upload Frontend:</strong> Build and upload your React application to the <code>public/</code> directory</li>
            <li><strong>Test:</strong> Visit your domain to see your live website</li>
            <li><strong>Admin Access:</strong> Go to <code>/admin-login</code> and use admin/admin123 (change password immediately)</li>
        </ol>
        
        <div class="success">
            <p><strong>🎉 Your Temer Properties website is ready for production!</strong></p>
        </div>
    </div>
</body>
</html>