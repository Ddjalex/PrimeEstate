import mysql from 'mysql2/promise';

export interface MySQLConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
  connectionLimit?: number;
}

// Default configuration for development (you can override with environment variables)
const defaultConfig: MySQLConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'temer_properties',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  connectionLimit: 10
};

// Create connection pool
export const createMySQLPool = (config: MySQLConfig = defaultConfig) => {
  return mysql.createPool(config);
};

// Initialize MySQL connection
export const connectToMySQL = async (config: MySQLConfig = defaultConfig) => {
  try {
    const pool = createMySQLPool(config);
    
    // Test connection
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL successfully');
    
    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${config.database}\``);
    await connection.execute(`USE \`${config.database}\``);
    
    connection.release();
    return pool;
  } catch (error) {
    console.error('❌ Failed to connect to MySQL:', error);
    throw error;
  }
};

export { mysql };