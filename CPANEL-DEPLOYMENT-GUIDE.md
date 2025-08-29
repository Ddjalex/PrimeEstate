# 🚀 Temer Properties - cPanel Deployment Guide

## 📦 Deployment Packages Created

Your project has been separated into two deployment packages:

1. **`temer-properties-frontend.tar.gz`** - Website files (React app)
2. **`temer-properties-backend.tar.gz`** - API server files (Node.js app)

## 🔧 cPanel Deployment Steps

### Step 1: Deploy Frontend (Website)

1. **Extract `temer-properties-frontend.tar.gz`**
2. **Upload to your domain's `public_html` folder** (or subdomain folder)
3. **Files will include:**
   - `index.html` - Main website page
   - `assets/` - CSS, JS, and images
   - `.htaccess` - URL routing configuration

### Step 2: Deploy Backend (API Server)

1. **Extract `temer-properties-backend.tar.gz`**
2. **Upload to a separate folder** (e.g., `api/` or `backend/`)
3. **Files include:**
   - `index.js` - Main server file
   - `package.json` - Dependencies
   - `config.js` - Configuration settings
   - `shared/` - Database schemas
   - `uploads/` - Image storage
   - `.htaccess` - API routing

### Step 3: Configure Environment

1. **Edit `config.js` in backend folder:**
   ```javascript
   MONGODB_URI: 'your-mongodb-atlas-connection-string'
   FRONTEND_URL: 'https://yourdomain.com'
   SESSION_SECRET: 'your-secret-key'
   ```

2. **Install Node.js dependencies:**
   ```bash
   cd backend-folder
   npm install
   ```

### Step 4: Set up Domain Structure

#### Option A: Subdomain Setup (Recommended)
- **Frontend:** `https://yourdomain.com` (main domain)
- **Backend API:** `https://api.yourdomain.com` (subdomain)

#### Option B: Folder Setup  
- **Frontend:** `https://yourdomain.com`
- **Backend API:** `https://yourdomain.com/api`

### Step 5: Database Setup

1. **MongoDB Atlas** (Already configured)
   - Connection string: `mongodb+srv://almeseged:A1l2m3e4s5@cluster0.t6sz6bo.mongodb.net/temer-properties`
   - All data is already in the database

2. **Admin Login:**
   - Username: `admin`
   - Password: `admin123`

### Step 6: Start Backend Server

**cPanel Node.js App:**
1. Go to **Node.js Apps** in cPanel
2. Create new Node.js app
3. Set **Startup File:** `index.js`
4. Set **Application Root:** path to backend folder
5. Click **Create**

### Step 7: Update API URLs

If using different domain structure, update API URLs in frontend:

**Find and replace in website files:**
- From: `/api/`
- To: `https://api.yourdomain.com/api/` (or your API URL)

## 📋 File Structure After Deployment

```
yourdomain.com/
├── public_html/           (Frontend files)
│   ├── index.html
│   ├── assets/
│   └── .htaccess
│
└── api/ (or subdomain)    (Backend files)
    ├── index.js
    ├── package.json
    ├── config.js
    ├── uploads/
    │   ├── properties/
    │   └── slider/
    └── .htaccess
```

## ✅ Features Working After Deployment

- ✅ **Property Listings** - All properties from database
- ✅ **Admin Dashboard** - Property management
- ✅ **Image Upload** - Property and slider images
- ✅ **Contact Forms** - WhatsApp integration
- ✅ **Mobile Responsive** - All devices supported
- ✅ **Search Functionality** - Property filtering
- ✅ **Slider Management** - Homepage banners

## 🔐 Admin Access

After deployment, access admin panel at:
`https://yourdomain.com/admin`

- **Username:** admin
- **Password:** admin123

## 🆘 Troubleshooting

**If website doesn't load:**
- Check `.htaccess` files are uploaded
- Verify file permissions (755 for folders, 644 for files)

**If API doesn't work:**
- Check Node.js app is running in cPanel
- Verify MongoDB connection string
- Check CORS settings in config.js

**If images don't upload:**
- Create `uploads/properties/` and `uploads/slider/` folders
- Set folder permissions to 755

## 📞 Support

Your Temer Properties website is ready for production deployment!

All your existing data (properties, slider images, settings) will work immediately after deployment.