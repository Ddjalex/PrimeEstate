import { connectToMySQL, createMySQLPool } from './mysql-config';
import { createTables, initializeDefaultData } from './mysql-schema';
import { MySQLStorage } from './mysql-storage';

let pool: any = null;
let storage: MySQLStorage | null = null;

export const initializeMySQL = async () => {
  try {
    // Connect to MySQL and create tables
    pool = await connectToMySQL();
    await createTables(pool);
    await initializeDefaultData(pool);
    
    // Initialize storage
    storage = new MySQLStorage(pool);
    
    console.log('✅ MySQL initialized successfully');
    return { pool, storage };
  } catch (error) {
    console.error('❌ Failed to initialize MySQL:', error);
    throw error;
  }
};

export const getMySQLStorage = () => {
  if (!storage) {
    throw new Error('MySQL storage not initialized. Call initializeMySQL() first.');
  }
  return storage;
};

export { storage };