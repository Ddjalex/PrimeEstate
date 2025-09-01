<?php
// Database configuration for cPanel MySQL
class Database {
    // Database credentials - UPDATE THESE WITH YOUR CPANEL DETAILS
    private $host = 'localhost';
    private $db_name = 'your_cpanel_username_temer_properties'; // Replace with your actual database name
    private $username = 'your_cpanel_username_dbuser'; // Replace with your database username  
    private $password = 'your_database_password'; // Replace with your database password
    private $port = '3306';
    
    public $conn;
    
    // Get database connection
    public function getConnection() {
        $this->conn = null;
        
        try {
            $dsn = "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $exception) {
            error_log("Connection error: " . $exception->getMessage());
            throw new Exception("Database connection failed");
        }
        
        return $this->conn;
    }
    
    // Create all required tables
    public function createTables() {
        try {
            $connection = $this->getConnection();
            
            // Users table
            $sql = "CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                isAdmin BOOLEAN DEFAULT FALSE,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )";
            $connection->exec($sql);
            
            // Properties table
            $sql = "CREATE TABLE IF NOT EXISTS properties (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(500) NOT NULL,
                description TEXT NOT NULL,
                location VARCHAR(500) NOT NULL,
                propertyType VARCHAR(100) NOT NULL,
                bedrooms INT DEFAULT 0,
                bathrooms INT DEFAULT 0,
                size INT NOT NULL,
                status JSON DEFAULT ('[\"For Sale\"]'),
                imageUrls JSON DEFAULT ('[]'),
                isActive BOOLEAN DEFAULT TRUE,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )";
            $connection->exec($sql);
            
            // Property Images table
            $sql = "CREATE TABLE IF NOT EXISTS property_images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                propertyId INT NOT NULL,
                imageUrl VARCHAR(500) NOT NULL,
                description TEXT,
                isMain BOOLEAN DEFAULT FALSE,
                sortOrder INT DEFAULT 0,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE
            )";
            $connection->exec($sql);
            
            // Slider Images table
            $sql = "CREATE TABLE IF NOT EXISTS slider_images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                imageUrl VARCHAR(500) NOT NULL,
                title VARCHAR(500) NOT NULL,
                description TEXT NOT NULL,
                isActive BOOLEAN DEFAULT TRUE,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )";
            $connection->exec($sql);
            
            // WhatsApp Settings table
            $sql = "CREATE TABLE IF NOT EXISTS whatsapp_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                phoneNumber VARCHAR(20) NOT NULL DEFAULT '+251975666699',
                isActive BOOLEAN DEFAULT TRUE,
                businessName VARCHAR(255) DEFAULT 'Temer Properties',
                welcomeMessage TEXT DEFAULT 'Hello! Welcome to Temer Properties. How can we assist you today?',
                propertyInquiryTemplate TEXT DEFAULT 'Hello! I\\'m interested in this property:\\n\\n🏠 *{title}*\\n📍 Location: {location}\\n🛏️ Bedrooms: {bedrooms}\\n🚿 Bathrooms: {bathrooms}\\n📐 Size: {size} m²\\n\\nCould you please provide more information about this property? I would like to schedule a viewing or discuss the details further.\\n\\nThank you!',
                generalInquiryTemplate TEXT DEFAULT 'Hello Temer Properties! 👋\\n\\nI\\'m interested in learning more about your real estate services. Could you please help me with information about available properties?\\n\\nThank you!',
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )";
            $connection->exec($sql);
            
            // Contact Settings table
            $sql = "CREATE TABLE IF NOT EXISTS contact_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                phone VARCHAR(20) NOT NULL DEFAULT '+251 911 123 456',
                email VARCHAR(255) NOT NULL DEFAULT 'info@temerproperties.com',
                address TEXT NOT NULL DEFAULT 'Bole Road, Addis Ababa, Ethiopia',
                isActive BOOLEAN DEFAULT TRUE,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )";
            $connection->exec($sql);
            
            // Contact Messages table
            $sql = "CREATE TABLE IF NOT EXISTS contact_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                message TEXT NOT NULL,
                isRead BOOLEAN DEFAULT FALSE,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )";
            $connection->exec($sql);
            
            return true;
        } catch(Exception $e) {
            error_log("Error creating tables: " . $e->getMessage());
            return false;
        }
    }
    
    // Initialize default data
    public function initializeData() {
        try {
            $connection = $this->getConnection();
            
            // Create default admin user
            $stmt = $connection->prepare("SELECT COUNT(*) as count FROM users WHERE username = ?");
            $stmt->execute(['admin']);
            $result = $stmt->fetch();
            
            if ($result['count'] == 0) {
                $hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);
                $stmt = $connection->prepare("INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)");
                $stmt->execute(['admin', $hashedPassword, 1]);
            }
            
            // Create default WhatsApp settings
            $stmt = $connection->prepare("SELECT COUNT(*) as count FROM whatsapp_settings");
            $stmt->execute();
            $result = $stmt->fetch();
            
            if ($result['count'] == 0) {
                $stmt = $connection->prepare("INSERT INTO whatsapp_settings (phoneNumber, businessName, isActive) VALUES (?, ?, ?)");
                $stmt->execute(['+251975666699', 'Temer Properties', 1]);
            }
            
            // Create default contact settings
            $stmt = $connection->prepare("SELECT COUNT(*) as count FROM contact_settings");
            $stmt->execute();
            $result = $stmt->fetch();
            
            if ($result['count'] == 0) {
                $stmt = $connection->prepare("INSERT INTO contact_settings (phone, email, address, isActive) VALUES (?, ?, ?, ?)");
                $stmt->execute(['+251 911 123 456', 'info@temerproperties.com', 'Bole Road, Addis Ababa, Ethiopia', 1]);
            }
            
            return true;
        } catch(Exception $e) {
            error_log("Error initializing data: " . $e->getMessage());
            return false;
        }
    }
}
?>