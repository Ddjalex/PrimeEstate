#!/usr/bin/env node

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Original and new database connection strings
const OLD_DB_URL = 'mongodb+srv://almeseged:A1l2m3e4s5@cluster0.t6sz6bo.mongodb.net/temer-properties?retryWrites=true&w=majority&appName=Cluster0';
let NEW_DB_URL = ''; // You'll need to set this

// Define schemas (simplified versions for migration)
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: Boolean,
  createdAt: Date
}, { collection: 'users' });

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
}, { collection: 'properties' });

const sliderImageSchema = new mongoose.Schema({
  id: Number,
  imageUrl: String,
  title: String,
  description: String,
  isActive: Boolean,
  createdAt: Date
}, { collection: 'sliderimages' });

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
}, { collection: 'whatsappsettings' });

const contactSettingsSchema = new mongoose.Schema({
  id: Number,
  phone: String,
  email: String,
  address: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}, { collection: 'contactsettings' });

const contactMessageSchema = new mongoose.Schema({
  id: Number,
  name: String,
  email: String,
  phone: String,
  message: String,
  isRead: Boolean,
  createdAt: Date
}, { collection: 'contactmessages' });

async function exportData() {
  console.log('🔄 Starting data export from old database...');
  
  try {
    // Connect to old database
    const oldConnection = await mongoose.createConnection(OLD_DB_URL);
    console.log('✅ Connected to old database');

    // Create models
    const OldUser = oldConnection.model('User', userSchema);
    const OldProperty = oldConnection.model('Property', propertySchema);
    const OldSliderImage = oldConnection.model('SliderImage', sliderImageSchema);
    const OldWhatsAppSettings = oldConnection.model('WhatsAppSettings', whatsappSettingsSchema);
    const OldContactSettings = oldConnection.model('ContactSettings', contactSettingsSchema);
    const OldContactMessage = oldConnection.model('ContactMessage', contactMessageSchema);

    // Export data
    const exportData = {
      users: await OldUser.find({}).lean(),
      properties: await OldProperty.find({}).lean(),
      sliderImages: await OldSliderImage.find({}).lean(),
      whatsappSettings: await OldWhatsAppSettings.find({}).lean(),
      contactSettings: await OldContactSettings.find({}).lean(),
      contactMessages: await OldContactMessage.find({}).lean(),
      exportDate: new Date().toISOString()
    };

    // Save to file
    const exportFile = path.join(__dirname, 'database-backup.json');
    fs.writeFileSync(exportFile, JSON.stringify(exportData, null, 2));
    
    console.log('✅ Data exported successfully!');
    console.log(`📊 Export Summary:`);
    console.log(`   - Users: ${exportData.users.length}`);
    console.log(`   - Properties: ${exportData.properties.length}`);
    console.log(`   - Slider Images: ${exportData.sliderImages.length}`);
    console.log(`   - WhatsApp Settings: ${exportData.whatsappSettings.length}`);
    console.log(`   - Contact Settings: ${exportData.contactSettings.length}`);
    console.log(`   - Contact Messages: ${exportData.contactMessages.length}`);
    console.log(`📁 Backup saved to: ${exportFile}`);

    await oldConnection.close();
    return exportData;
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    throw error;
  }
}

async function importData(newDbUrl) {
  console.log('🔄 Starting data import to new database...');
  
  try {
    // Read exported data
    const exportFile = path.join(__dirname, 'database-backup.json');
    if (!fs.existsSync(exportFile)) {
      throw new Error('Backup file not found. Please run export first.');
    }
    
    const importData = JSON.parse(fs.readFileSync(exportFile, 'utf8'));
    
    // Connect to new database
    const newConnection = await mongoose.createConnection(newDbUrl);
    console.log('✅ Connected to new database');

    // Create models
    const NewUser = newConnection.model('User', userSchema);
    const NewProperty = newConnection.model('Property', propertySchema);
    const NewSliderImage = newConnection.model('SliderImage', sliderImageSchema);
    const NewWhatsAppSettings = newConnection.model('WhatsAppSettings', whatsappSettingsSchema);
    const NewContactSettings = newConnection.model('ContactSettings', contactSettingsSchema);
    const NewContactMessage = newConnection.model('ContactMessage', contactMessageSchema);

    // Clear existing data (optional - comment out if you want to keep existing data)
    await NewUser.deleteMany({});
    await NewProperty.deleteMany({});
    await NewSliderImage.deleteMany({});
    await NewWhatsAppSettings.deleteMany({});
    await NewContactSettings.deleteMany({});
    await NewContactMessage.deleteMany({});
    console.log('🗑️ Cleared existing data in new database');

    // Import data
    if (importData.users.length > 0) {
      await NewUser.insertMany(importData.users);
      console.log(`✅ Imported ${importData.users.length} users`);
    }

    if (importData.properties.length > 0) {
      await NewProperty.insertMany(importData.properties);
      console.log(`✅ Imported ${importData.properties.length} properties`);
    }

    if (importData.sliderImages.length > 0) {
      await NewSliderImage.insertMany(importData.sliderImages);
      console.log(`✅ Imported ${importData.sliderImages.length} slider images`);
    }

    if (importData.whatsappSettings.length > 0) {
      await NewWhatsAppSettings.insertMany(importData.whatsappSettings);
      console.log(`✅ Imported ${importData.whatsappSettings.length} WhatsApp settings`);
    }

    if (importData.contactSettings.length > 0) {
      await NewContactSettings.insertMany(importData.contactSettings);
      console.log(`✅ Imported ${importData.contactSettings.length} contact settings`);
    }

    if (importData.contactMessages.length > 0) {
      await NewContactMessage.insertMany(importData.contactMessages);
      console.log(`✅ Imported ${importData.contactMessages.length} contact messages`);
    }

    console.log('🎉 Data import completed successfully!');
    await newConnection.close();
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    throw error;
  }
}

async function validateMigration(newDbUrl) {
  console.log('🔍 Validating migration...');
  
  try {
    const newConnection = await mongoose.createConnection(newDbUrl);
    
    const NewUser = newConnection.model('User', userSchema);
    const NewProperty = newConnection.model('Property', propertySchema);
    const NewSliderImage = newConnection.model('SliderImage', sliderImageSchema);
    
    const userCount = await NewUser.countDocuments();
    const propertyCount = await NewProperty.countDocuments();
    const sliderCount = await NewSliderImage.countDocuments();
    
    console.log('📊 New Database Summary:');
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Properties: ${propertyCount}`);
    console.log(`   - Slider Images: ${sliderCount}`);
    
    // Test admin user
    const adminUser = await NewUser.findOne({ username: 'admin' });
    if (adminUser) {
      console.log('✅ Admin user found in new database');
    } else {
      console.log('⚠️ Admin user not found - will be created on first run');
    }
    
    await newConnection.close();
    console.log('✅ Validation completed');
    
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    throw error;
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'export') {
    await exportData();
  } else if (command === 'import') {
    const newDbUrl = args[1];
    if (!newDbUrl) {
      console.error('❌ Please provide new database URL: node migrate-database.js import "your-new-connection-string"');
      process.exit(1);
    }
    await importData(newDbUrl);
  } else if (command === 'validate') {
    const newDbUrl = args[1];
    if (!newDbUrl) {
      console.error('❌ Please provide new database URL: node migrate-database.js validate "your-new-connection-string"');
      process.exit(1);
    }
    await validateMigration(newDbUrl);
  } else if (command === 'migrate') {
    const newDbUrl = args[1];
    if (!newDbUrl) {
      console.error('❌ Please provide new database URL: node migrate-database.js migrate "your-new-connection-string"');
      process.exit(1);
    }
    await exportData();
    await importData(newDbUrl);
    await validateMigration(newDbUrl);
    console.log('🎉 Complete migration finished successfully!');
  } else {
    console.log('📖 Database Migration Tool');
    console.log('');
    console.log('Usage:');
    console.log('  node migrate-database.js export                           # Export data from old database');
    console.log('  node migrate-database.js import "new-connection-string"   # Import data to new database');
    console.log('  node migrate-database.js validate "new-connection-string" # Validate migration');
    console.log('  node migrate-database.js migrate "new-connection-string"  # Complete migration (export + import + validate)');
    console.log('');
    console.log('Example:');
    console.log('  node migrate-database.js migrate "mongodb+srv://user:pass@cluster.mongodb.net/database"');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Migration failed:', error.message);
    process.exit(1);
  });
}