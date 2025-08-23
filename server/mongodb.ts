import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Property Schema
const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  propertyType: { type: String, required: true },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  size: { type: Number, required: true },
  status: { type: [String], default: ["For Sale"] },
  imageUrls: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Property Image Schema
const propertyImageSchema = new mongoose.Schema({
  propertyId: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String },
  isMain: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Slider Image Schema
const sliderImageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// WhatsApp Settings Schema
const whatsappSettingsSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, default: '+251975666699' },
  isActive: { type: Boolean, default: true },
  businessName: { type: String, default: 'Temer Properties' },
  welcomeMessage: { type: String, default: 'Hello! Welcome to Temer Properties. How can we assist you today?' },
  propertyInquiryTemplate: { type: String, default: 'Hello! I\'m interested in this property:\n\n🏠 *{title}*\n📍 Location: {location}\n🛏️ Bedrooms: {bedrooms}\n🚿 Bathrooms: {bathrooms}\n📐 Size: {size} m²\n\nCould you please provide more information about this property? I would like to schedule a viewing or discuss the details further.\n\nThank you!' },
  generalInquiryTemplate: { type: String, default: 'Hello Temer Properties! 👋\n\nI\'m interested in learning more about your real estate services. Could you please help me with information about available properties?\n\nThank you!' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-increment plugin for IDs
function autoIncrement(schema: mongoose.Schema, options: { field: string; start?: number }) {
  schema.add({ [options.field]: { type: Number, unique: true } });
  
  schema.pre('save', async function(next) {
    if (this.isNew) {
      const Model = this.constructor as mongoose.Model<any>;
      const lastDoc = await Model.findOne({}, {}, { sort: { [options.field]: -1 } });
      this[options.field] = lastDoc ? lastDoc[options.field] + 1 : (options.start || 1);
    }
    next();
  });
}

// Apply auto-increment
userSchema.plugin(autoIncrement, { field: 'id' });
propertySchema.plugin(autoIncrement, { field: 'id' });
propertyImageSchema.plugin(autoIncrement, { field: 'id' });
sliderImageSchema.plugin(autoIncrement, { field: 'id' });
whatsappSettingsSchema.plugin(autoIncrement, { field: 'id' });

// Update timestamps
propertySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

whatsappSettingsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Contact Settings Schema
const contactSettingsSchema = new mongoose.Schema({
  phone: { type: String, required: true, default: '+251 911 123 456' },
  email: { type: String, required: true, default: 'info@temerproperties.com' },
  address: { type: String, required: true, default: 'Bole Road, Addis Ababa, Ethiopia' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

contactSettingsSchema.plugin(autoIncrement, { field: 'id' });

contactSettingsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Export models
export const UserModel = mongoose.model('User', userSchema);
export const PropertyModel = mongoose.model('Property', propertySchema);
export const PropertyImageModel = mongoose.model('PropertyImage', propertyImageSchema);
export const SliderImageModel = mongoose.model('SliderImage', sliderImageSchema);
export const WhatsAppSettingsModel = mongoose.model('WhatsAppSettings', whatsappSettingsSchema);
export const ContactSettingsModel = mongoose.model('ContactSettings', contactSettingsSchema);

// MongoDB connection
export async function connectToMongoDB() {
  try {
    const connectionString = 'mongodb+srv://almeseged:A1l2m3e4s5@cluster0.t6sz6bo.mongodb.net/temer-properties?retryWrites=true&w=majority&appName=Cluster0';
    
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
    });
    
    console.log('Connected to MongoDB successfully');
    
    // Initialize sample data if database is empty
    await initializeSampleData();
    
    // Initialize WhatsApp settings
    await initializeWhatsAppSettings();
    
    // Initialize Contact settings
    await initializeContactSettings();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

async function initializeSampleData() {
  try {
    // Check if properties already exist
    const existingProperties = await PropertyModel.countDocuments();
    const existingSliders = await SliderImageModel.countDocuments();
    
    if (existingProperties === 0) {
      // Add sample properties one by one to handle auto-increment properly
      const sampleProperties = [
        {
          title: "Luxury 3-Bedroom Apartment in Bole",
          description: "Beautiful modern apartment with stunning city views, fully furnished with high-end finishes. Located in the heart of Bole, close to shopping centers and restaurants.",
          location: "Bole, Addis Ababa",
          propertyType: "apartment",
          bedrooms: 3,
          bathrooms: 2,
          size: 150,
          status: ["For Sale", "Active"],
          imageUrls: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
          isActive: true,
          createdAt: new Date('2025-08-15'),
          updatedAt: new Date('2025-08-15')
        },
        {
          title: "Modern Shop Space in Merkato",
          description: "Prime commercial location with high foot traffic. Perfect for retail business, restaurant, or service provider. Ground floor with excellent visibility.",
          location: "Merkato, Addis Ababa",
          propertyType: "shops",
          bedrooms: 0,
          bathrooms: 1,
          size: 75,
          status: ["For Sale"],
          imageUrls: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800", "https://images.unsplash.com/photo-1560472355-536de3962603?w=800"],
          isActive: true,
          createdAt: new Date('2025-08-14'),
          updatedAt: new Date('2025-08-14')
        },
        {
          title: "Executive 4-Bedroom Villa in CMC",
          description: "Stunning villa with private garden and parking space. High-quality construction with modern amenities. Quiet residential area with 24/7 security.",
          location: "CMC, Addis Ababa",
          propertyType: "apartment",
          bedrooms: 4,
          bathrooms: 3,
          size: 220,
          status: ["New Offer", "Active"],
          imageUrls: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"],
          isActive: true,
          createdAt: new Date('2025-08-13'),
          updatedAt: new Date('2025-08-13')
        }
      ];

      // Insert properties one by one to avoid ID conflicts
      for (const propertyData of sampleProperties) {
        try {
          await new PropertyModel(propertyData).save();
        } catch (error) {
          console.log('Property already exists, skipping...');
        }
      }
      console.log('Sample properties added to MongoDB');
    }

    if (existingSliders === 0) {
      // Add sample slider images
      const sampleSliderImages = [
        {
          imageUrl: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1920",
          title: "Find Your Dream Property",
          description: "Discover premium real estate opportunities in Addis Ababa",
          isActive: true
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920",
          title: "Modern Living Spaces",
          description: "Experience contemporary design and luxury amenities",
          isActive: true
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920",
          title: "Investment Opportunities",
          description: "Secure your future with our premium property portfolio",
          isActive: true
        }
      ];

      // Insert slider images one by one to avoid ID conflicts
      for (const sliderData of sampleSliderImages) {
        try {
          await new SliderImageModel(sliderData).save();
        } catch (error) {
          console.log('Slider image already exists, skipping...');
        }
      }
      console.log('Sample slider images added to MongoDB');
    }

  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
}

async function initializeWhatsAppSettings() {
  try {
    // Check if WhatsApp settings already exist
    const existingSettings = await WhatsAppSettingsModel.countDocuments();
    
    if (existingSettings === 0) {
      // Create default WhatsApp settings
      const defaultSettings = new WhatsAppSettingsModel({
        phoneNumber: '+251975666699',
        isActive: true,
        businessName: 'Temer Properties',
        welcomeMessage: 'Hello! Welcome to Temer Properties. How can we assist you today?',
        propertyInquiryTemplate: 'Hello! I\'m interested in this property:\n\n🏠 *{title}*\n📍 Location: {location}\n🛏️ Bedrooms: {bedrooms}\n🚿 Bathrooms: {bathrooms}\n📐 Size: {size} m²\n\nCould you please provide more information about this property? I would like to schedule a viewing or discuss the details further.\n\nThank you!',
        generalInquiryTemplate: 'Hello Temer Properties! 👋\n\nI\'m interested in learning more about your real estate services. Could you please help me with information about available properties?\n\nThank you!'
      });
      
      await defaultSettings.save();
      console.log('Default WhatsApp settings initialized');
    }
  } catch (error) {
    console.error('Error initializing WhatsApp settings:', error);
  }
}

async function initializeContactSettings() {
  try {
    // Check if Contact settings already exist
    const existingSettings = await ContactSettingsModel.countDocuments();
    
    if (existingSettings === 0) {
      // Create default Contact settings
      const defaultSettings = new ContactSettingsModel({
        phone: '+251 911 123 456',
        email: 'info@temerproperties.com',
        address: 'Bole Road, Addis Ababa, Ethiopia',
        isActive: true
      });
      
      await defaultSettings.save();
      console.log('Default Contact settings initialized');
    }
  } catch (error) {
    console.error('Error initializing Contact settings:', error);
  }
}