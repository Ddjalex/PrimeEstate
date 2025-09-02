// Integrated Deployment Configuration
export const config = {
  // MongoDB connection
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://almeseged:A1l2m3e4s5@jerry.viif47d.mongodb.net/temer-properties',
  
  // Server configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'production',
  
  // Static file serving
  PUBLIC_DIR: './public',
  UPLOAD_DIR: './uploads',
  
  // API configuration
  API_PREFIX: '/api',
  
  // WhatsApp configuration  
  WHATSAPP_PHONE_NUMBER: process.env.WHATSAPP_PHONE_NUMBER || '+251975666699',
  
  // Session configuration
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  
  // File upload settings
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  
  // CORS settings
  ALLOWED_ORIGINS: [
    'https://yourdomain.com',
    'http://localhost:3000',
    'http://localhost:5000'
  ]
};