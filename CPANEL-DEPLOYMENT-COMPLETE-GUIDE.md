# 📋 Temer Properties - Complete cPanel Deployment Guide

## 🎯 Overview
This guide will walk you through deploying your Temer Properties website on cPanel hosting with integrated frontend and backend using the file manager and Node.js setup.

---

## 📦 Pre-Deployment Checklist

✅ **Files Ready:**
- `temer-properties-integrated.tar.gz` (Your complete website package)
- MongoDB Atlas database connection string
- Admin credentials: `admin/admin123`

✅ **cPanel Requirements:**
- cPanel hosting account with Node.js support
- File Manager access
- Node.js App manager
- Domain name configured

---

## 🚀 Step-by-Step Deployment Process

### **STEP 1: Access cPanel File Manager**

1. **Login to your cPanel account**
   - Go to your hosting provider's cPanel login page
   - Enter your username and password

2. **Open File Manager**
   - In cPanel home, click **"File Manager"**
   - Select **"Web Root (public_html/yourdomain.com)"**
   - Click **"Go"**

3. **Navigate to your domain folder**
   - If main domain: Go to `public_html/`
   - If subdomain: Go to `public_html/subdomain/`

---

### **STEP 2: Upload Project Files**

1. **Upload the integrated package**
   - In File Manager, click **"Upload"** button
   - Select `temer-properties-integrated.tar.gz`
   - Wait for upload to complete

2. **Extract the package**
   - Right-click on `temer-properties-integrated.tar.gz`
   - Select **"Extract"**
   - Choose extraction destination (current folder)
   - Click **"Extract Files"**

3. **Verify file structure**
   ```
   public_html/yourdomain.com/
   ├── public/              (Frontend files)
   │   ├── index.html
   │   └── assets/
   ├── uploads/             (Image storage)
   │   ├── properties/
   │   └── slider/
   ├── shared/              (Database schemas)
   ├── server.js            (Backend server)
   ├── package.json         (Dependencies)
   ├── config.js            (Configuration)
   └── .htaccess            (URL routing)
   ```

---

### **STEP 3: Set File Permissions**

1. **Set folder permissions to 755:**
   - Select `uploads/` folder
   - Click **"Permissions"**
   - Set to **755** (rwxr-xr-x)
   - Check **"Recurse into subdirectories"**

2. **Set file permissions to 644:**
   - Select all `.js`, `.html`, `.css` files
   - Set permissions to **644** (rw-r--r--)

3. **Set executable permission for server.js:**
   - Select `server.js`
   - Set permission to **755**

---

### **STEP 4: Configure Node.js Application**

1. **Access Node.js Apps**
   - In cPanel home, find **"Node.js Apps"**
   - Click to open Node.js manager

2. **Create New Application**
   - Click **"Create Application"**
   - Fill in the form:
     ```
     Node.js Version: 18.x or higher
     Application Mode: Production
     Application Root: /public_html/yourdomain.com
     Application URL: yourdomain.com
     Application Startup File: server.js
     ```

3. **Set Environment Variables**
   - In the Node.js app settings, add:
     ```
     NODE_ENV=production
     PORT=3000
     MONGODB_URI=mongodb+srv://almeseged:A1l2m3e4s5@cluster0.t6sz6bo.mongodb.net/temer-properties
     ```

4. **Install Dependencies**
   - Click **"Run NPM Install"**
   - Wait for packages to install
   - Verify installation completed successfully

---

### **STEP 5: Configure Database Connection**

1. **Update MongoDB Connection**
   - In File Manager, edit `config.js`
   - Update the MongoDB URI:
     ```javascript
     MONGODB_URI: 'mongodb+srv://almeseged:A1l2m3e4s5@cluster0.t6sz6bo.mongodb.net/temer-properties'
     ```

2. **Test Database Connection**
   - Your MongoDB Atlas database is already set up
   - All existing properties and images will work immediately
   - No additional database setup needed

---

### **STEP 6: Start the Application**

1. **Start Node.js App**
   - In Node.js Apps manager
   - Find your application
   - Click **"Start"** button
   - Wait for status to show **"Running"**

2. **Verify Application Status**
   - Check that application shows "Running" status
   - Note the assigned port number
   - Verify no errors in the logs

---

### **STEP 7: Test Your Website**

1. **Test Frontend**
   - Visit `https://yourdomain.com`
   - Verify homepage loads with slider
   - Check property listings display
   - Test navigation menu

2. **Test Admin Dashboard**
   - Go to `https://yourdomain.com/admin`
   - Login with: `admin / admin123`
   - Test property creation and editing
   - Upload test images

3. **Test API Endpoints**
   - Check `https://yourdomain.com/api/properties`
   - Verify JSON data returns
   - Test other API routes

---

### **STEP 8: Configure Domain and SSL**

1. **Domain Configuration**
   - Ensure your domain points to your hosting server
   - Update nameservers if needed
   - Wait for DNS propagation (up to 24 hours)

2. **SSL Certificate**
   - In cPanel, go to **"SSL/TLS"**
   - Install **Let's Encrypt** certificate
   - Enable **"Force HTTPS Redirect"**

---

## 🔧 **Integration Details**

### **How Frontend & Backend Connect:**

1. **Same Domain Integration:**
   ```
   Website Request → .htaccess → Routes to:
   ├── /api/* → server.js (Backend API)
   ├── /uploads/* → Static files
   └── /* → public/index.html (Frontend)
   ```

2. **API Communication:**
   ```javascript
   // Frontend automatically calls:
   fetch('/api/properties')        → Backend responds with data
   fetch('/api/admin/login')       → Authentication
   fetch('/api/contact/submit')    → Contact forms
   ```

3. **Real-time Updates:**
   - Admin updates property → Database saves → Website refreshes automatically
   - Uses React Query for cache management
   - WebSocket for live notifications

---

## 🛠️ **Troubleshooting**

### **If website doesn't load:**
1. Check Node.js app is **"Running"**
2. Verify `.htaccess` file exists and is readable
3. Check file permissions (755 for folders, 644 for files)
4. Look at Node.js app error logs

### **If API doesn't work:**
1. Test API directly: `yourdomain.com/api/properties`
2. Check MongoDB connection string in `config.js`
3. Verify CORS settings
4. Check Node.js app logs for errors

### **If admin login fails:**
1. Verify database connection
2. Check admin user exists in MongoDB
3. Test with: `admin / admin123`

### **If images don't upload:**
1. Check `uploads/` folder permissions (755)
2. Verify `uploads/properties/` and `uploads/slider/` exist
3. Check file upload limits in hosting

---

## 📞 **Support Information**

**Admin Access:**
- URL: `https://yourdomain.com/admin`
- Username: `admin`
- Password: `admin123`

**Database:**
- MongoDB Atlas (already configured)
- All existing properties and images included

**File Structure:**
```
yourdomain.com/
├── public/              (Website files)
├── uploads/             (Images)
├── server.js            (API server)
├── package.json         (Dependencies)
├── config.js            (Settings)
└── .htaccess           (URL routing)
```

---

## ✅ **Deployment Complete!**

Your Temer Properties website is now:
- ✅ **Fully integrated** frontend and backend
- ✅ **Production optimized** with compressed files
- ✅ **Database connected** to MongoDB Atlas
- ✅ **Admin panel ready** for content management
- ✅ **Mobile responsive** for all devices
- ✅ **SSL ready** for secure connections

**Next Steps:**
1. Upload `temer-properties-integrated.tar.gz`
2. Extract files in cPanel File Manager
3. Set up Node.js app pointing to `server.js`
4. Start the application
5. Visit your website!

Your professional real estate website is ready for production! 🎉

---

**Created by:** Replit Agent for Temer Properties
**Date:** August 29, 2025
**Version:** 1.0 - Production Ready