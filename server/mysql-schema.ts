import { mysql } from './mysql-config';
import type { Pool } from 'mysql2/promise';

export const createTables = async (pool: Pool) => {
  const connection = await pool.getConnection();
  
  try {
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        isAdmin BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create properties table
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

    // Create property_images table
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

    // Create slider_images table
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

    // Create whatsapp_settings table
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

    // Create contact_settings table
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

    // Create contact_messages table
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
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    connection.release();
  }
};

export const initializeDefaultData = async (pool: Pool) => {
  const connection = await pool.getConnection();
  
  try {
    // Check if default WhatsApp settings exist
    const [whatsappRows] = await connection.execute('SELECT COUNT(*) as count FROM whatsapp_settings');
    const whatsappCount = (whatsappRows as any)[0].count;
    
    if (whatsappCount === 0) {
      await connection.execute(`
        INSERT INTO whatsapp_settings (phoneNumber, businessName, isActive) 
        VALUES ('+251975666699', 'Temer Properties', TRUE)
      `);
      console.log('✅ Default WhatsApp settings created');
    }

    // Check if default contact settings exist
    const [contactRows] = await connection.execute('SELECT COUNT(*) as count FROM contact_settings');
    const contactCount = (contactRows as any)[0].count;
    
    if (contactCount === 0) {
      await connection.execute(`
        INSERT INTO contact_settings (phone, email, address, isActive) 
        VALUES ('+251 911 123 456', 'info@temerproperties.com', 'Bole Road, Addis Ababa, Ethiopia', TRUE)
      `);
      console.log('✅ Default contact settings created');
    }

    console.log('✅ Default data initialization completed');
  } catch (error) {
    console.error('❌ Error initializing default data:', error);
    throw error;
  } finally {
    connection.release();
  }
};