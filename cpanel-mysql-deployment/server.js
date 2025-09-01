// cPanel MySQL Deployment Server
// This is the production server file for cPanel hosting with MySQL database

const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const multer = require('multer');
const fs = require('fs').promises;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MySQL Configuration for cPanel
const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'your_cpanel_username',
  password: process.env.DB_PASSWORD || 'your_database_password',
  database: process.env.DB_NAME || 'your_database_name',
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10
};

let pool;

// Initialize MySQL connection
async function connectToMySQL() {
  try {
    pool = mysql.createPool(mysqlConfig);
    console.log('✅ Connected to MySQL successfully');
    await createTables();
    await initializeDefaultData();
  } catch (error) {
    console.error('❌ Failed to connect to MySQL:', error);
    throw error;
  }
}

// Create tables
async function createTables() {
  const connection = await pool.getConnection();
  
  try {
    // Create all tables (same as in mysql-schema.ts)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        isAdmin BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        location VARCHAR(500) NOT NULL,
        propertyType VARCHAR(100) NOT NULL,
        bedrooms INT DEFAULT 0,
        bathrooms INT DEFAULT 0,
        size INT NOT NULL,
        status JSON DEFAULT ('["For Sale"]'),
        imageUrls JSON DEFAULT ('[]'),
        isActive BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS property_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        propertyId INT NOT NULL,
        imageUrl VARCHAR(500) NOT NULL,
        description TEXT,
        isMain BOOLEAN DEFAULT FALSE,
        sortOrder INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS slider_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        imageUrl VARCHAR(500) NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        isActive BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS whatsapp_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phoneNumber VARCHAR(20) NOT NULL DEFAULT '+251975666699',
        isActive BOOLEAN DEFAULT TRUE,
        businessName VARCHAR(255) DEFAULT 'Temer Properties',
        welcomeMessage TEXT DEFAULT 'Hello! Welcome to Temer Properties. How can we assist you today?',
        propertyInquiryTemplate TEXT DEFAULT 'Hello! I''m interested in this property:\\n\\n🏠 *{title}*\\n📍 Location: {location}\\n🛏️ Bedrooms: {bedrooms}\\n🚿 Bathrooms: {bathrooms}\\n📐 Size: {size} m²\\n\\nCould you please provide more information about this property? I would like to schedule a viewing or discuss the details further.\\n\\nThank you!',
        generalInquiryTemplate TEXT DEFAULT 'Hello Temer Properties! 👋\\n\\nI''m interested in learning more about your real estate services. Could you please help me with information about available properties?\\n\\nThank you!',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contact_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone VARCHAR(20) NOT NULL DEFAULT '+251 911 123 456',
        email VARCHAR(255) NOT NULL DEFAULT 'info@temerproperties.com',
        address TEXT NOT NULL DEFAULT 'Bole Road, Addis Ababa, Ethiopia',
        isActive BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        isRead BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ All MySQL tables created successfully');
  } finally {
    connection.release();
  }
}

// Initialize default data
async function initializeDefaultData() {
  const connection = await pool.getConnection();
  
  try {
    // Check if default admin user exists
    const [adminRows] = await connection.execute('SELECT COUNT(*) as count FROM users WHERE username = ?', ['admin']);
    const adminCount = adminRows[0].count;
    
    if (adminCount === 0) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.execute(
        'INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)',
        ['admin', hashedPassword, true]
      );
      console.log('✅ Default admin user created (admin/admin123)');
    }

    // Check if default WhatsApp settings exist
    const [whatsappRows] = await connection.execute('SELECT COUNT(*) as count FROM whatsapp_settings');
    const whatsappCount = whatsappRows[0].count;
    
    if (whatsappCount === 0) {
      await connection.execute(`
        INSERT INTO whatsapp_settings (phoneNumber, businessName, isActive) 
        VALUES ('+251975666699', 'Temer Properties', TRUE)
      `);
      console.log('✅ Default WhatsApp settings created');
    }

    // Check if default contact settings exist
    const [contactRows] = await connection.execute('SELECT COUNT(*) as count FROM contact_settings');
    const contactCount = contactRows[0].count;
    
    if (contactCount === 0) {
      await connection.execute(`
        INSERT INTO contact_settings (phone, email, address, isActive) 
        VALUES ('+251 911 123 456', 'info@temerproperties.com', 'Bole Road, Addis Ababa, Ethiopia', TRUE)
      `);
      console.log('✅ Default contact settings created');
    }
  } finally {
    connection.release();
  }
}

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads', req.path.includes('slider') ? 'slider' : 'properties');
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'));
    }
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes - Copy from your existing routes.ts and convert to work with MySQL
app.get('/api/properties', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM properties WHERE isActive = TRUE ORDER BY createdAt DESC');
    connection.release();
    
    const properties = rows.map(p => ({
      ...p,
      id: p.id.toString(),
      status: typeof p.status === 'string' ? JSON.parse(p.status) : p.status,
      imageUrls: typeof p.imageUrls === 'string' ? JSON.parse(p.imageUrls) : p.imageUrls,
      isActive: Boolean(p.isActive)
    }));
    
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Add other API routes here...
// (You would copy and convert all routes from your routes.ts file)

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectToMySQL();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Visit your website at: http://your-domain.com`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();