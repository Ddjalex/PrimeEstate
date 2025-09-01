# cPanel MySQL Deployment Guide for Temer Properties

This guide will help you deploy your Temer Properties real estate website to cPanel hosting using MySQL database instead of MongoDB for better compatibility and reliability.

## ✅ Why MySQL for cPanel?

- **Better Compatibility**: MySQL is supported by virtually all cPanel hosting providers
- **Reliability**: More stable and reliable than MongoDB on shared hosting
- **Performance**: Better performance on shared hosting environments
- **Cost-Effective**: Usually included in most hosting plans

## 📋 Prerequisites

- cPanel hosting account with MySQL database support
- Node.js support (or static hosting for frontend-only)
- SSH access (optional but recommended)

## 🔧 Step 1: Database Setup

### 1.1 Create MySQL Database in cPanel

1. Log into your cPanel
2. Find "MySQL Databases" section
3. Create a new database: `your_username_temer_properties`
4. Create a database user with a strong password
5. Assign the user to the database with "All Privileges"

### 1.2 Note Your Database Credentials

Write down these details:
```
Database Host: localhost (usually)
Database Name: your_username_temer_properties
Database User: your_username_dbuser
Database Password: [your secure password]
Database Port: 3306 (default)
```

## 📁 Step 2: File Preparation

### 2.1 Frontend Files

1. Build your React frontend:
   ```bash
   npm run build
   ```

2. Upload the `dist` folder contents to your `public_html` directory

### 2.2 Backend Files (if using Node.js hosting)

1. Copy the `cpanel-mysql-deployment/server.js` file to your server
2. Copy the `package.json` with necessary dependencies
3. Create `uploads/properties` and `uploads/slider` directories

## 🛠️ Step 3: Environment Configuration

Create a `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_USER=your_username_dbuser
DB_PASSWORD=your_secure_password
DB_NAME=your_username_temer_properties
DB_PORT=3306
NODE_ENV=production
PORT=3000
```

## 🚀 Step 4: Deployment Options

### Option A: Full Node.js Deployment (if supported)

1. Upload all files to your hosting
2. Install dependencies: `npm install`
3. Start the server: `node server.js`

### Option B: Static Frontend + PHP Backend (Alternative)

If your host doesn't support Node.js, use the PHP backend version:

1. Upload frontend files to `public_html`
2. Upload PHP backend files to `api` folder
3. Update PHP configuration with your database credentials

## 🔧 Step 5: Database Migration

The application will automatically create tables on first run. If you have existing data:

### 5.1 Export from MongoDB (if migrating)

```javascript
// Use this script to export your MongoDB data
const { MongoClient } = require('mongodb');

async function exportData() {
  const client = new MongoClient('your-mongodb-connection-string');
  await client.connect();
  
  const db = client.db('temer-properties');
  
  // Export each collection
  const properties = await db.collection('properties').find({}).toArray();
  const users = await db.collection('users').find({}).toArray();
  // ... export other collections
  
  // Save to JSON files for import
  console.log('Export complete');
}
```

### 5.2 Import to MySQL

Use phpMyAdmin or SQL commands to import your data into the new MySQL tables.

## 🛡️ Step 6: Security Configuration

### 6.1 Database Security

- Use strong passwords for database users
- Limit database user privileges to only what's needed
- Enable SSL if available

### 6.2 File Permissions

Set proper file permissions:
```bash
chmod 644 *.js
chmod 755 uploads/
chmod 755 uploads/properties/
chmod 755 uploads/slider/
```

## 📊 Step 7: Testing

### 7.1 Test Database Connection

Visit `/api/properties` to verify database connectivity

### 7.2 Test Admin Login

1. Go to `/admin-login`
2. Use credentials: `admin` / `admin123`
3. Change the password immediately after first login

### 7.3 Test File Uploads

1. Login to admin panel
2. Try uploading a property image
3. Verify images appear correctly on the website

## 🔍 Step 8: Monitoring & Maintenance

### 8.1 Database Backup

Set up automatic database backups through cPanel:
1. Go to "Backup" section in cPanel
2. Schedule daily or weekly backups
3. Store backups in a safe location

### 8.2 Performance Monitoring

- Monitor database performance through cPanel
- Check error logs regularly
- Optimize images for web performance

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify database credentials
   - Check if database user has correct privileges
   - Ensure database name is correct

2. **File Upload Issues**
   - Check upload directory permissions
   - Verify file size limits
   - Ensure allowed file types are correct

3. **Images Not Displaying**
   - Check file paths in database
   - Verify upload directory structure
   - Check server permissions

### Database Connection Test

Use this simple test script:

```javascript
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'your_db_user',
      password: 'your_password',
      database: 'your_database'
    });
    
    console.log('✅ Database connection successful');
    await connection.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();
```

## 📞 Support

If you encounter issues:

1. Check cPanel error logs
2. Verify database connectivity
3. Test with minimal configuration first
4. Contact your hosting provider for Node.js or MySQL issues

## 🎉 Success!

Once deployed successfully, your Temer Properties website will be:

- ✅ Running on reliable MySQL database
- ✅ Compatible with most cPanel hosting providers
- ✅ Easy to backup and maintain
- ✅ Ready for production use

Visit your domain to see your live real estate website!

---

**Note**: This deployment uses MySQL instead of MongoDB for better cPanel compatibility. All features remain the same, but with improved reliability on shared hosting.