# Temer Properties - cPanel Deployment Guide

## 🚀 Deployment Instructions

### Step 1: Upload Files
1. Upload all files to your cPanel public_html directory
2. Extract the ZIP file in your hosting file manager

### Step 2: Install Dependencies
In cPanel Terminal or SSH:
```bash
cd public_html
npm install
```

### Step 3: Set Environment Variables
Create a `.env` file with:
```
MONGODB_URI=mongodb+srv://almeseged:A1l2m3e4s5@jerry.viif47d.mongodb.net/temer-properties?retryWrites=true&w=majority&appName=Jerry
NODE_ENV=production
PORT=3000
SESSION_SECRET=your-secure-session-secret
```

### Step 4: Start Application
```bash
npm start
```

### Step 5: Configure cPanel
- Set up Node.js app in cPanel
- Point to server.js as entry point
- Set startup file to server.js

## 📋 Included Files

- ✅ **Built Frontend** - Production-ready React app
- ✅ **Server Bundle** - Optimized Node.js server
- ✅ **Database Config** - Updated Jerry cluster connection
- ✅ **Upload Folders** - All existing property and slider images
- ✅ **Static Assets** - Compressed and optimized
- ✅ **Migration Script** - For data transfer (in database-backup.json)

## 🔧 Database Migration

Your data backup is ready to import to Jerry cluster:
- Admin user: admin/admin123
- 2 Properties with images
- 5 Slider images
- WhatsApp and contact settings

## 📱 Features Ready

✅ Property listings and search
✅ Admin dashboard
✅ Image upload and management
✅ WhatsApp integration
✅ Contact forms
✅ Hero slider management
✅ Responsive design

## 🆘 Support

If you encounter issues:
1. Check MongoDB Atlas network access (0.0.0.0/0)
2. Verify user permissions in Jerry cluster
3. Ensure Node.js version 18+ in cPanel
4. Check error logs in cPanel

Your real estate website is ready for production!