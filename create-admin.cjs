const { Pool, neonConfig } = require('@neondatabase/serverless');
const bcrypt = require('bcrypt');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

async function createAdminUser() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable not set');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const result = await pool.query(
      'INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING RETURNING id',
      ['admin', hashedPassword, true]
    );
    
    if (result.rows.length > 0) {
      console.log('✓ Admin user created successfully');
      console.log('Username: admin');
      console.log('Password: admin123');
      console.log('URL: /admin/login');
      console.log('Please change the password after first login');
    } else {
      console.log('ℹ Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await pool.end();
  }
}

createAdminUser();