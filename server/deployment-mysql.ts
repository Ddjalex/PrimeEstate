// MySQL Deployment Configuration
// This file is for production deployment on cPanel with MySQL

import { initializeMySQL } from './mysql-server';
import { MySQLStorage } from './mysql-storage';

// Environment variable to switch between MongoDB (development) and MySQL (production)
const USE_MYSQL = process.env.USE_MYSQL === 'true' || process.env.NODE_ENV === 'production';

export async function initializeStorage() {
  if (USE_MYSQL) {
    console.log('🔄 Initializing MySQL for production deployment...');
    const { storage } = await initializeMySQL();
    return storage;
  } else {
    console.log('🔄 Using MongoDB for development...');
    const { storage } = await import("./storage");
    return storage.storage;
  }
}

export { USE_MYSQL };