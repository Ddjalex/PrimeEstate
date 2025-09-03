#!/usr/bin/env node

import mongoose from 'mongoose';
import fs from 'fs';

// Your Jerry cluster connection
const DB_URL = 'mongodb+srv://almeseged:A1l2m3e4s5@jerry.viif47d.mongodb.net/temer-properties?retryWrites=true&w=majority&appName=Jerry';

// Schemas (same as your app)
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: Boolean,
  createdAt: Date
});

const propertySchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  location: String,
  propertyType: String,
  bedrooms: Number,
  bathrooms: Number,
  size: Number,
  status: [String],
  imageUrls: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
});

const sliderImageSchema = new mongoose.Schema({
  id: Number,
  imageUrl: String,
  title: String,
  description: String,
  isActive: Boolean,
  createdAt: Date
});

const whatsappSettingsSchema = new mongoose.Schema({
  id: Number,
  phoneNumber: String,
  isActive: Boolean,
  businessName: String,
  welcomeMessage: String,
  propertyInquiryTemplate: String,
  generalInquiryTemplate: String,
  createdAt: Date,
  updatedAt: Date
});

const contactSettingsSchema = new mongoose.Schema({
  id: Number,
  phone: String,
  email: String,
  address: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
});

const contactMessageSchema = new mongoose.Schema({
  id: Number,
  name: String,
  email: String,
  phone: String,
  message: String,
  isRead: Boolean,
  createdAt: Date
});

async function restoreDatabase() {
  try {
    console.log('🔄 Connecting to Jerry cluster...');
    await mongoose.connect(DB_URL, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to Jerry cluster successfully');

    // Create models
    const User = mongoose.model('User', userSchema);
    const Property = mongoose.model('Property', propertySchema);
    const SliderImage = mongoose.model('SliderImage', sliderImageSchema);
    const WhatsAppSettings = mongoose.model('WhatsAppSettings', whatsappSettingsSchema);
    const ContactSettings = mongoose.model('ContactSettings', contactSettingsSchema);
    const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

    // Read backup data
    console.log('📖 Reading backup data...');
    const backupData = JSON.parse(fs.readFileSync('./database-backup.json', 'utf8'));

    // Import data
    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await SliderImage.deleteMany({});
    await WhatsAppSettings.deleteMany({});
    await ContactSettings.deleteMany({});
    await ContactMessage.deleteMany({});

    console.log('📥 Importing data...');
    
    if (backupData.users.length > 0) {
      await User.insertMany(backupData.users);
      console.log(`✅ Imported ${backupData.users.length} users`);
    }

    if (backupData.properties.length > 0) {
      await Property.insertMany(backupData.properties);
      console.log(`✅ Imported ${backupData.properties.length} properties`);
    }

    if (backupData.sliderImages.length > 0) {
      await SliderImage.insertMany(backupData.sliderImages);
      console.log(`✅ Imported ${backupData.sliderImages.length} slider images`);
    }

    if (backupData.whatsappSettings.length > 0) {
      await WhatsAppSettings.insertMany(backupData.whatsappSettings);
      console.log(`✅ Imported ${backupData.whatsappSettings.length} WhatsApp settings`);
    }

    if (backupData.contactSettings.length > 0) {
      await ContactSettings.insertMany(backupData.contactSettings);
      console.log(`✅ Imported ${backupData.contactSettings.length} contact settings`);
    }

    if (backupData.contactMessages.length > 0) {
      await ContactMessage.insertMany(backupData.contactMessages);
      console.log(`✅ Imported ${backupData.contactMessages.length} contact messages`);
    }

    console.log('🎉 Database restore completed successfully!');
    console.log('🔐 Admin login: admin / admin123');
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Restore failed:', error.message);
    process.exit(1);
  }
}

restoreDatabase();