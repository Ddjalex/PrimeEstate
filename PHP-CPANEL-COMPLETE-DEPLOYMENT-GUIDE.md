# Complete PHP/MySQL cPanel Deployment Guide
## Temer Properties Real Estate Website

This is the **COMPLETE PHP VERSION** for cPanel hosting - no Node.js required! 🎉

## 📦 What You Get

✅ **Complete PHP Backend** - All API endpoints in PHP  
✅ **MySQL Database** - Fully compatible with cPanel hosting  
✅ **File Upload System** - Property & slider image uploads  
✅ **Admin Authentication** - Secure login system  
✅ **Auto Database Setup** - Creates tables automatically  
✅ **Ready for Production** - Optimized for cPanel hosting  

## 🚀 Quick Deployment Steps

### Step 1: Prepare Your Files

1. **Copy PHP files** from `php-cpanel-deployment/` folder:
   ```
   /public_html/
   ├── api/           ← All PHP API files
   ├── config/        ← Database configuration  
   ├── uploads/       ← Image upload directories
   └── index.php     ← Main entry point
   ```

2. **Build React frontend**:
   ```bash
   npm run build
   ```

3. **Upload frontend** to `/public_html/public/` directory

### Step 2: Database Setup

1. **Create MySQL Database** in cPanel:
   - Database name: `your_username_temer_properties`
   - Username: `your_username_dbuser`
   - Password: `[secure password]`

2. **Update database credentials** in `config/database.php`:
   ```php
   private $host = 'localhost';
   private $db_name = 'your_username_temer_properties';
   private $username = 'your_username_dbuser';
   private $password = 'your_secure_password';
   ```

### Step 3: Set Permissions

```bash
chmod 755 uploads/
chmod 755 uploads/properties/
chmod 755 uploads/slider/
chmod 644 *.php
chmod 644 api/*.php
chmod 644 config/*.php
```

### Step 4: Test Installation

1. Visit your domain - you should see a setup success page
2. Go to `/api/properties` - should return empty array `[]`
3. Go to `/admin-login` - should show login form
4. Login with: `admin` / `admin123`

## 📋 Complete File Structure

```
/public_html/
├── api/
│   ├── properties.php    ← Property CRUD operations
│   ├── auth.php         ← Login/register/sessions
│   ├── upload.php       ← File upload handling
│   ├── slider.php       ← Slider image management
│   └── settings.php     ← WhatsApp/contact settings
├── config/
│   └── database.php     ← MySQL connection & setup
├── uploads/
│   ├── properties/      ← Property images
│   └── slider/          ← Hero slider images  
├── public/              ← React frontend (build output)
│   ├── index.html
│   ├── assets/
│   └── [other React files]
└── index.php           ← Main router & setup
```

## 🔌 API Endpoints

All endpoints work exactly like your Node.js version:

### Properties
- `GET /api/properties` - List all properties
- `POST /api/properties` - Create property
- `PUT /api/properties/{id}` - Update property
- `DELETE /api/properties/{id}` - Delete property

### Authentication  
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create user
- `POST /api/auth/logout` - Logout
- `GET /api/auth/check` - Check login status

### File Uploads
- `POST /api/upload/property` - Upload property image
- `POST /api/upload/slider` - Upload slider image

### Slider Management
- `GET /api/slider` - List slider images
- `POST /api/slider` - Create slider image
- `PUT /api/slider/{id}` - Update slider image
- `DELETE /api/slider/{id}` - Delete slider image

### Settings
- `GET /api/whatsapp/settings` - Get WhatsApp settings
- `PUT /api/whatsapp/settings` - Update WhatsApp settings
- `GET /api/contact/settings` - Get contact settings
- `PUT /api/contact/settings` - Update contact settings
- `GET /api/contact/messages` - Get contact messages
- `POST /api/contact/messages` - Create contact message

## 🔧 Configuration Options

### Database Configuration
Edit `config/database.php`:
```php
private $host = 'localhost';        // Usually localhost for cPanel
private $db_name = 'your_db_name';  // Your cPanel database name
private $username = 'your_db_user'; // Your database username
private $password = 'your_password';// Your database password
private $port = '3306';             // Default MySQL port
```

### Upload Settings
Edit `api/upload.php` to customize:
```php
private $maxFileSize = 5 * 1024 * 1024; // 5MB limit
private $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
```

## 🛡️ Security Features

✅ **SQL Injection Protection** - All queries use prepared statements  
✅ **File Upload Validation** - Type and size restrictions  
✅ **Session Management** - Secure PHP sessions  
✅ **Password Hashing** - Uses PHP's password_hash()  
✅ **Admin Authentication** - Protected admin routes  
✅ **CORS Headers** - Proper cross-origin handling  

## 🚨 Troubleshooting

### Database Connection Issues
1. Verify database credentials in `config/database.php`
2. Check that database user has all privileges
3. Ensure database name includes your cPanel username prefix

### File Upload Problems
1. Check upload directory permissions (755)
2. Verify PHP upload limits in cPanel
3. Ensure upload directories exist and are writable

### API Not Working
1. Check if mod_rewrite is enabled
2. Verify .htaccess file if using custom routing
3. Check PHP error logs in cPanel

### Frontend Not Loading
1. Ensure React build is in `/public/` directory
2. Check that `index.html` exists in `/public/`
3. Verify all assets are uploaded correctly

## 📊 Default Data

The system automatically creates:

### Default Admin User
- **Username:** `admin`
- **Password:** `admin123`
- **⚠️ Change this immediately after first login!**

### Default Settings
- **WhatsApp:** +251975666699
- **Email:** info@temerproperties.com
- **Phone:** +251 911 123 456
- **Address:** Bole Road, Addis Ababa, Ethiopia

## 🔄 Migration from Node.js

If migrating from the Node.js version:

1. **Export your MongoDB data** to JSON
2. **Convert and import** to MySQL using phpMyAdmin
3. **Update your frontend** API calls (same endpoints, no changes needed)
4. **Upload images** to the new upload directories

## 🎯 Production Checklist

- [ ] Database credentials updated
- [ ] Default admin password changed
- [ ] File permissions set correctly
- [ ] Frontend build uploaded
- [ ] Test all API endpoints
- [ ] Test file uploads
- [ ] Test admin login
- [ ] SSL certificate installed
- [ ] Backup system configured

## 🌟 Advantages of PHP Version

✅ **Universal Compatibility** - Works on 99% of cPanel hosts  
✅ **No Special Requirements** - Just PHP + MySQL  
✅ **Better Performance** - Optimized for shared hosting  
✅ **Easy Maintenance** - Standard PHP hosting stack  
✅ **Cost Effective** - Works with basic hosting plans  

## 📞 Support

Your complete PHP/MySQL Temer Properties website is now ready for production! 

**Files included:**
- ✅ Complete PHP backend with all features
- ✅ MySQL database schema and setup
- ✅ File upload system
- ✅ Admin authentication
- ✅ All API endpoints
- ✅ Production-ready configuration

**🎉 Deploy and enjoy your professional real estate website!**