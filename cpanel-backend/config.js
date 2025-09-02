// cPanel Environment Configuration
export const config = {
  // MongoDB connection - Update with your MongoDB Atlas connection string
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://almeseged:A1l2m3e4s5@jerry.viif47d.mongodb.net/temer-properties',
  
  // Server configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'production',
  
  // WhatsApp configuration  
  WHATSAPP_PHONE_NUMBER: process.env.WHATSAPP_PHONE_NUMBER || '+251975666699',
  
  // Upload directories
  UPLOAD_DIR: './uploads',
  PROPERTY_UPLOAD_DIR: './uploads/properties',
  SLIDER_UPLOAD_DIR: './uploads/slider',
  
  // Session configuration
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-secret-key-here-change-in-production',
  
  // CORS configuration - Update with your domain
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://yourdomain.com',
  
  // File upload limits
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
};