# 🏠 Temer Properties - PHP cPanel Deployment Guide
## **Complete Step-by-Step Instructions for PHP Version**

*No Node.js required - Works on all cPanel hosting!*

---

## 🎯 **Why PHP Version?**

✅ **Universal Compatibility**: Works on ALL cPanel hosting providers  
✅ **No Node.js Setup**: Pure PHP - just upload and go  
✅ **File-Based Storage**: No database configuration needed  
✅ **Easier Maintenance**: Standard PHP hosting support  
✅ **Lower Cost**: Works on basic shared hosting plans  

---

## 📦 **Pre-Deployment Checklist**

✅ **Files Ready:**
- `temer-properties-php.tar.gz` (Your complete PHP website)
- cPanel hosting account with PHP 7.4+ support
- Basic file manager access

✅ **What's Included:**
- Complete React frontend (built & optimized)
- PHP backend API (all functionality)
- File-based data storage (no database needed)
- Admin dashboard (admin/admin123)
- File upload system
- Contact form handling

---

## 🚀 **STEP 1: Access Your cPanel File Manager**

### **Based on Your Hosting Environment:**

1. **Login to cPanel**
   - Go to your hosting provider's cPanel login
   - Enter your credentials

2. **Open File Manager**
   - Find **"File Manager"** in cPanel home
   - Click to open

3. **Navigate to Domain Folder**
   - Go to: `public_html/temerrealestateasales.com/`
   - Or: `public_html/` (if main domain)

---

## 📁 **STEP 2: Upload & Extract PHP Package**

### **File Upload Process:**

1. **Clear Domain Folder (if needed)**
   - Delete any existing files in your domain folder
   - Ensure clean installation

2. **Upload Package**
   - Click **"Upload"** in file manager
   - Select `temer-properties-php.tar.gz`
   - Wait for upload completion

3. **Extract Files**
   - Right-click on `temer-properties-php.tar.gz`
   - Select **"Extract"**
   - Choose: "Extract Here" or current directory
   - Click **"Extract Files"**

### **Verify File Structure:**

```
public_html/temerrealestateasales.com/
├── api/                    (PHP backend)
│   ├── properties.php     (Property management)
│   ├── slider.php         (Homepage slider)
│   ├── auth.php          (Admin login)
│   ├── upload.php        (File uploads)
│   ├── contact.php       (Contact form)
│   └── settings.php      (App settings)
├── includes/              (PHP configuration)
│   ├── config.php        (Main settings)
│   └── database.php      (Data storage)
├── data/                  (JSON storage - auto-created)
├── uploads/               (Image storage)
│   ├── properties/       (Property images)
│   └── slider/          (Homepage images)
├── assets/               (CSS, JS, images)
├── index.html           (Main website)
└── .htaccess           (URL routing)
```

---

## 🔧 **STEP 3: Set File Permissions**

### **Critical Permission Settings:**

1. **Data Storage Folder**
   - Right-click `data/` folder → **Permissions**
   - Set to: **755** (rwxr-xr-x)
   - ✅ Check **"Recurse into subdirectories"**

2. **Upload Folders**
   - `uploads/` folder: **755**
   - `uploads/properties/`: **755** 
   - `uploads/slider/`: **755**

3. **PHP Files**
   - All `.php` files: **644** (rw-r--r--)
   - `api/` folder: **755**

4. **Other Files**
   - `.htaccess`: **644**
   - `index.html`: **644**

---

## ⚙️ **STEP 4: PHP Configuration Check**

### **Verify PHP Settings:**

1. **Check PHP Version**
   - In cPanel, find **"Select PHP Version"**
   - Ensure PHP 7.4 or higher is selected
   - Enable these extensions:
     - ✅ json
     - ✅ session
     - ✅ fileinfo

2. **PHP Settings (if accessible)**
   ```
   upload_max_filesize = 10M
   post_max_size = 10M
   memory_limit = 128M
   session.auto_start = On
   ```

---

## 🌐 **STEP 5: Test Your Website**

### **Frontend Testing:**

1. **Visit Main Site**
   - Go to: `https://temerrealestateasales.com`
   - Should load homepage with image slider
   - Verify property listings display
   - Test navigation menu

2. **Mobile Testing**
   - Open on mobile device
   - Check responsive design
   - Test all functionality

### **Backend API Testing:**

1. **Test API Endpoints**
   - Visit: `https://temerrealestateasales.com/api/properties.php`
   - Should return JSON with property data
   - Try: `https://temerrealestateasales.com/api/slider.php`

2. **Admin Dashboard Testing**
   - Go to: `https://temerrealestateasales.com/admin`
   - Login: **Username:** `admin` **Password:** `admin123`
   - Test creating a new property
   - Upload a test image

---

## 📊 **STEP 6: How It All Works Together**

### **Frontend ↔ Backend Integration:**

```
Website Request Flow:
═══════════════════════════════════════════════════════════

User visits page → index.html loads → React app starts
                ↓
React needs data → Calls /api/properties.php → PHP returns JSON
                ↓  
User uploads image → /api/upload.php → Saves to /uploads/ folder
                ↓
Admin manages content → PHP updates JSON files in /data/ folder
                ↓
Website auto-refreshes → Shows updated content
```

### **Data Storage (No Database Required):**

```
/data/
├── properties.json    (All property listings)
├── slider.json       (Homepage slider images)  
├── settings.json     (WhatsApp, contact info)
└── contact_messages.log (Contact form submissions)
```

### **URL Routing (.htaccess handles):**

```
temerrealestateasales.com/           → index.html (React app)
temerrealestateasales.com/admin      → index.html (Admin page)
temerrealestateasales.com/api/*      → PHP backend
temerrealestateasales.com/uploads/*  → Static images
```

---

## 🛠️ **STEP 7: Troubleshooting**

### **If Website Doesn't Load:**

1. **Check .htaccess File**
   - Verify `.htaccess` exists in root directory
   - Should contain rewrite rules

2. **Check File Permissions**
   - `data/` folder: 755
   - `.htaccess`: 644
   - All PHP files: 644

3. **Check PHP Version**
   - Must be PHP 7.4 or higher
   - JSON extension enabled

### **If API Returns Errors:**

1. **Check PHP Error Logs**
   - In cPanel: **"Error Logs"**
   - Look for PHP syntax errors

2. **Test Individual API Files**
   - Visit: `yourdomain.com/api/properties.php`
   - Should show JSON, not error page

3. **File Permissions**
   - `api/` folder: 755
   - All `.php` files: 644

### **If Images Don't Upload:**

1. **Upload Folder Permissions**
   - `uploads/`: 755
   - `uploads/properties/`: 755
   - `uploads/slider/`: 755

2. **PHP Upload Settings**
   - Check `upload_max_filesize` in PHP settings
   - Ensure at least 10MB

### **If Admin Login Fails:**

1. **Check Session Support**
   - PHP sessions must be enabled
   - `session.auto_start = On`

2. **Clear Browser Cache**
   - Clear cookies and cache
   - Try incognito/private mode

3. **Default Credentials**
   - Username: `admin`
   - Password: `admin123`

---

## 🎯 **STEP 8: Post-Deployment Setup**

### **SSL Certificate:**

1. **Enable SSL**
   - In cPanel: **"SSL/TLS"**
   - Install Let's Encrypt certificate
   - Enable **"Force HTTPS Redirect"**

### **Contact Form Setup:**

1. **Email Configuration**
   - Edit `api/contact.php`
   - Add your email address for notifications
   - Configure SMTP if needed

### **Content Management:**

1. **Add Your Properties**
   - Login to admin: `/admin`
   - Upload property images
   - Add property details

2. **Customize Slider**
   - Upload hero images for homepage
   - Update slider text and titles

---

## 📞 **Quick Reference**

### **Website URLs:**
- **Main Site:** `https://temerrealestateasales.com`
- **Admin Panel:** `https://temerrealestateasales.com/admin`
- **API Test:** `https://temerrealestateasales.com/api/properties.php`

### **Admin Access:**
- **Username:** `admin`
- **Password:** `admin123`

### **File Locations:**
- **Website:** Root directory (index.html)
- **Backend:** `/api/` folder
- **Images:** `/uploads/` folder
- **Data:** `/data/` folder (auto-created)

### **Key Features:**
✅ **No Database Setup** - Uses JSON file storage  
✅ **No Node.js Required** - Pure PHP backend  
✅ **Auto-Install** - Creates data files automatically  
✅ **Responsive Design** - Works on all devices  
✅ **Admin Dashboard** - Full content management  
✅ **Contact Forms** - Working contact system  
✅ **Image Uploads** - Property and slider images  
✅ **WhatsApp Integration** - Contact notifications  

---

## 🎉 **Deployment Complete!**

**Your PHP-powered Temer Properties website is now:**

✅ **Live & Functional** - All features working perfectly  
✅ **Database-Free** - No complex setup required  
✅ **Admin Ready** - Full content management system  
✅ **Mobile Optimized** - Responsive on all devices  
✅ **Contact Enabled** - Working forms and WhatsApp  
✅ **Upload Ready** - Image management system  
✅ **SEO Optimized** - Search engine friendly  

**Your professional Ethiopian real estate website is ready for customers!** 🚀

---

### **Advantages of PHP Version:**

🔥 **Easier Deployment** - No Node.js configuration  
🔥 **Universal Hosting** - Works on ANY cPanel hosting  
🔥 **Lower Costs** - Compatible with basic shared hosting  
🔥 **Simpler Maintenance** - Standard PHP support  
🔥 **File-Based Storage** - No database management  
🔥 **Instant Backup** - Copy files to backup  

**Perfect for cPanel hosting - Just upload and go!** ⚡

---

**Created:** September 1, 2025  
**For:** temerrealestateasales.com  
**Version:** PHP Production Ready - Universal cPanel Deployment