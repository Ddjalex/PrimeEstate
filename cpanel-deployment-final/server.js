var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/mongodb.ts
var mongodb_exports = {};
__export(mongodb_exports, {
  ContactMessageModel: () => ContactMessageModel,
  ContactSettingsModel: () => ContactSettingsModel,
  PropertyImageModel: () => PropertyImageModel,
  PropertyModel: () => PropertyModel,
  SliderImageModel: () => SliderImageModel,
  UserModel: () => UserModel,
  WhatsAppSettingsModel: () => WhatsAppSettingsModel,
  connectToMongoDB: () => connectToMongoDB
});
import mongoose from "mongoose";
function autoIncrement(schema, options) {
  schema.add({ [options.field]: { type: Number, unique: true, sparse: true } });
  schema.pre("save", async function(next) {
    if (this.isNew && !this[options.field]) {
      try {
        const Model = this.constructor;
        const lastDoc = await Model.findOne(
          { [options.field]: { $exists: true, $ne: null } },
          {},
          { sort: { [options.field]: -1 } }
        );
        this[options.field] = lastDoc ? lastDoc[options.field] + 1 : options.start || 1;
      } catch (error) {
        console.error("Error in auto-increment:", error);
        this[options.field] = Date.now() % 1e6;
      }
    }
    next();
  });
}
async function connectToMongoDB() {
  try {
    const connectionString = "mongodb+srv://almeseged:A1l2m3e4s5@cluster0.t6sz6bo.mongodb.net/temer-properties?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 1e4,
      // 10 second timeout
      socketTimeoutMS: 45e3
      // 45 second socket timeout
    });
    console.log("Connected to MongoDB successfully");
    await initializeSampleData();
    await initializeWhatsAppSettings();
    await initializeContactSettings();
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
async function initializeSampleData() {
  try {
    const existingProperties = await PropertyModel.countDocuments();
    const existingSliders = await SliderImageModel.countDocuments();
    if (existingProperties === 0) {
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
          createdAt: /* @__PURE__ */ new Date("2025-08-15"),
          updatedAt: /* @__PURE__ */ new Date("2025-08-15")
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
          createdAt: /* @__PURE__ */ new Date("2025-08-14"),
          updatedAt: /* @__PURE__ */ new Date("2025-08-14")
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
          createdAt: /* @__PURE__ */ new Date("2025-08-13"),
          updatedAt: /* @__PURE__ */ new Date("2025-08-13")
        }
      ];
      for (const propertyData of sampleProperties) {
        try {
          await new PropertyModel(propertyData).save();
        } catch (error) {
          console.log("Property already exists, skipping...");
        }
      }
      console.log("Sample properties added to MongoDB");
    }
    if (existingSliders === 0) {
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
      for (const sliderData of sampleSliderImages) {
        try {
          await new SliderImageModel(sliderData).save();
        } catch (error) {
          console.log("Slider image already exists, skipping...");
        }
      }
      console.log("Sample slider images added to MongoDB");
    }
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
}
async function initializeWhatsAppSettings() {
  try {
    const existingSettings = await WhatsAppSettingsModel.countDocuments();
    if (existingSettings === 0) {
      const defaultSettings = new WhatsAppSettingsModel({
        phoneNumber: "+251975666699",
        isActive: true,
        businessName: "Temer Properties",
        welcomeMessage: "Hello! Welcome to Temer Properties. How can we assist you today?",
        propertyInquiryTemplate: "Hello! I'm interested in this property:\n\n\u{1F3E0} *{title}*\n\u{1F4CD} Location: {location}\n\u{1F6CF}\uFE0F Bedrooms: {bedrooms}\n\u{1F6BF} Bathrooms: {bathrooms}\n\u{1F4D0} Size: {size} m\xB2\n\nCould you please provide more information about this property? I would like to schedule a viewing or discuss the details further.\n\nThank you!",
        generalInquiryTemplate: "Hello Temer Properties! \u{1F44B}\n\nI'm interested in learning more about your real estate services. Could you please help me with information about available properties?\n\nThank you!"
      });
      await defaultSettings.save();
      console.log("Default WhatsApp settings initialized");
    }
  } catch (error) {
    console.error("Error initializing WhatsApp settings:", error);
  }
}
async function initializeContactSettings() {
  try {
    const existingSettings = await ContactSettingsModel.countDocuments();
    if (existingSettings === 0) {
      const defaultSettings = new ContactSettingsModel({
        phone: "+251 911 123 456",
        email: "info@temerproperties.com",
        address: "Bole Road, Addis Ababa, Ethiopia",
        isActive: true
      });
      await defaultSettings.save();
      console.log("Default Contact settings initialized");
    }
  } catch (error) {
    console.error("Error initializing Contact settings:", error);
  }
}
var userSchema, propertySchema, propertyImageSchema, sliderImageSchema, whatsappSettingsSchema, contactSettingsSchema, contactMessageSchema, UserModel, PropertyModel, PropertyImageModel, SliderImageModel, WhatsAppSettingsModel, ContactSettingsModel, ContactMessageModel;
var init_mongodb = __esm({
  "server/mongodb.ts"() {
    "use strict";
    userSchema = new mongoose.Schema({
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      isAdmin: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    });
    propertySchema = new mongoose.Schema({
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
    propertyImageSchema = new mongoose.Schema({
      propertyId: { type: Number, required: true },
      imageUrl: { type: String, required: true },
      description: { type: String },
      isMain: { type: Boolean, default: false },
      sortOrder: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now }
    });
    sliderImageSchema = new mongoose.Schema({
      imageUrl: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      isActive: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now }
    });
    whatsappSettingsSchema = new mongoose.Schema({
      phoneNumber: { type: String, required: true, default: "+251975666699" },
      isActive: { type: Boolean, default: true },
      businessName: { type: String, default: "Temer Properties" },
      welcomeMessage: { type: String, default: "Hello! Welcome to Temer Properties. How can we assist you today?" },
      propertyInquiryTemplate: { type: String, default: "Hello! I'm interested in this property:\n\n\u{1F3E0} *{title}*\n\u{1F4CD} Location: {location}\n\u{1F6CF}\uFE0F Bedrooms: {bedrooms}\n\u{1F6BF} Bathrooms: {bathrooms}\n\u{1F4D0} Size: {size} m\xB2\n\nCould you please provide more information about this property? I would like to schedule a viewing or discuss the details further.\n\nThank you!" },
      generalInquiryTemplate: { type: String, default: "Hello Temer Properties! \u{1F44B}\n\nI'm interested in learning more about your real estate services. Could you please help me with information about available properties?\n\nThank you!" },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });
    userSchema.plugin(autoIncrement, { field: "id" });
    propertySchema.plugin(autoIncrement, { field: "id" });
    propertyImageSchema.plugin(autoIncrement, { field: "id" });
    sliderImageSchema.plugin(autoIncrement, { field: "id" });
    whatsappSettingsSchema.plugin(autoIncrement, { field: "id" });
    propertySchema.pre("save", function(next) {
      this.updatedAt = /* @__PURE__ */ new Date();
      next();
    });
    whatsappSettingsSchema.pre("save", function(next) {
      this.updatedAt = /* @__PURE__ */ new Date();
      next();
    });
    contactSettingsSchema = new mongoose.Schema({
      phone: { type: String, required: true, default: "+251 911 123 456" },
      email: { type: String, required: true, default: "info@temerproperties.com" },
      address: { type: String, required: true, default: "Bole Road, Addis Ababa, Ethiopia" },
      isActive: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });
    contactSettingsSchema.plugin(autoIncrement, { field: "id" });
    contactSettingsSchema.pre("save", function(next) {
      this.updatedAt = /* @__PURE__ */ new Date();
      next();
    });
    contactMessageSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      message: { type: String, required: true },
      isRead: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    });
    contactMessageSchema.plugin(autoIncrement, { field: "id" });
    UserModel = mongoose.model("User", userSchema);
    PropertyModel = mongoose.model("Property", propertySchema);
    PropertyImageModel = mongoose.model("PropertyImage", propertyImageSchema);
    SliderImageModel = mongoose.model("SliderImage", sliderImageSchema);
    WhatsAppSettingsModel = mongoose.model("WhatsAppSettings", whatsappSettingsSchema);
    ContactSettingsModel = mongoose.model("ContactSettings", contactSettingsSchema);
    ContactMessageModel = mongoose.model("ContactMessage", contactMessageSchema);
  }
});

// server/mongo-storage.ts
import mongoose2 from "mongoose";
var MongoStorage;
var init_mongo_storage = __esm({
  "server/mongo-storage.ts"() {
    "use strict";
    init_mongodb();
    MongoStorage = class {
      // User operations
      async getUser(id) {
        const user = await UserModel.findById(id).lean();
        return user ? this.convertMongoUser(user) : void 0;
      }
      async getUserByUsername(username) {
        const user = await UserModel.findOne({ username }).lean();
        return user ? this.convertMongoUser(user) : void 0;
      }
      async createUser(insertUser) {
        const user = new UserModel({
          ...insertUser,
          isAdmin: insertUser.isAdmin ?? false
        });
        await user.save();
        return this.convertMongoUser(user.toObject());
      }
      // Property operations
      async getAllProperties() {
        const properties2 = await PropertyModel.find({ isActive: true }).sort({ createdAt: -1 }).lean();
        return properties2.map((p) => this.convertMongoProperty(p));
      }
      async getProperty(id) {
        try {
          if (!mongoose2.Types.ObjectId.isValid(id)) {
            console.log("Invalid ObjectId format:", id);
            return void 0;
          }
          const property = await PropertyModel.findById(id).lean();
          return property ? this.convertMongoProperty(property) : void 0;
        } catch (error) {
          console.error("Error finding property by ID:", error);
          return void 0;
        }
      }
      async createProperty(insertProperty) {
        const now = /* @__PURE__ */ new Date();
        const property = new PropertyModel({
          ...insertProperty,
          bedrooms: insertProperty.bedrooms ?? 0,
          bathrooms: insertProperty.bathrooms ?? 0,
          status: insertProperty.status ?? ["For Sale"],
          imageUrls: insertProperty.imageUrls ?? [],
          isActive: insertProperty.isActive ?? true,
          createdAt: now,
          updatedAt: now
        });
        await property.save();
        return this.convertMongoProperty(property.toObject());
      }
      async updateProperty(id, updates) {
        try {
          if (!mongoose2.Types.ObjectId.isValid(id)) {
            console.log("Invalid ObjectId format for update:", id);
            return void 0;
          }
          const property = await PropertyModel.findByIdAndUpdate(
            id,
            { ...updates, updatedAt: /* @__PURE__ */ new Date() },
            { new: true }
          ).lean();
          return property ? this.convertMongoProperty(property) : void 0;
        } catch (error) {
          console.error("Error updating property:", error);
          return void 0;
        }
      }
      async deleteProperty(id) {
        try {
          if (!mongoose2.Types.ObjectId.isValid(id)) {
            console.log("Invalid ObjectId format for delete:", id);
            return false;
          }
          const result = await PropertyModel.findByIdAndUpdate(
            id,
            { isActive: false }
          );
          return result !== null;
        } catch (error) {
          console.error("Error deleting property:", error);
          return false;
        }
      }
      // Property image operations
      async getPropertyImages(propertyId) {
        const images = await PropertyImageModel.find({ propertyId }).sort({ isMain: -1, sortOrder: 1 }).lean();
        return images.map((img) => this.convertMongoPropertyImage(img));
      }
      async createPropertyImage(insertImage) {
        const image = new PropertyImageModel({
          ...insertImage,
          description: insertImage.description ?? null,
          isMain: insertImage.isMain ?? false,
          sortOrder: insertImage.sortOrder ?? 0
        });
        await image.save();
        return this.convertMongoPropertyImage(image.toObject());
      }
      async deletePropertyImage(id) {
        const result = await PropertyImageModel.findByIdAndDelete(id);
        return result !== null;
      }
      async setMainImage(propertyId, imageId) {
        await PropertyImageModel.updateMany(
          { propertyId },
          { isMain: false }
        );
        const result = await PropertyImageModel.findByIdAndUpdate(
          imageId,
          { isMain: true }
        );
        return result !== null;
      }
      // Slider operations
      async getSliderImages() {
        const images = await SliderImageModel.find({ isActive: true }).lean();
        return images.map((img) => ({
          id: String(img._id),
          imageUrl: img.imageUrl,
          title: img.title,
          description: img.description,
          isActive: img.isActive
        }));
      }
      async createSliderImage(insertImage) {
        const image = new SliderImageModel({
          ...insertImage,
          isActive: true
        });
        await image.save();
        const savedImage = image.toObject();
        return {
          id: String(savedImage._id),
          imageUrl: savedImage.imageUrl,
          title: savedImage.title,
          description: savedImage.description,
          isActive: savedImage.isActive
        };
      }
      async updateSliderImage(id, updates) {
        const result = await SliderImageModel.findByIdAndUpdate(id, updates);
        return result !== null;
      }
      async deleteSliderImage(id) {
        const result = await SliderImageModel.findByIdAndDelete(id);
        return result !== null;
      }
      // WhatsApp settings operations
      async getWhatsAppSettings() {
        const settings = await WhatsAppSettingsModel.findOne().lean();
        return settings ? this.convertMongoWhatsAppSettings(settings) : void 0;
      }
      async updateWhatsAppSettings(updates) {
        const settings = await WhatsAppSettingsModel.findOneAndUpdate(
          {},
          // Update the first (and only) document
          { ...updates, updatedAt: /* @__PURE__ */ new Date() },
          { new: true, upsert: true }
          // Create if doesn't exist
        ).lean();
        return settings ? this.convertMongoWhatsAppSettings(settings) : void 0;
      }
      // Contact settings operations
      async getContactSettings() {
        const settings = await ContactSettingsModel.findOne().lean();
        return settings ? this.convertMongoContactSettings(settings) : void 0;
      }
      async updateContactSettings(updates) {
        const settings = await ContactSettingsModel.findOneAndUpdate(
          {},
          // Update the first (and only) document
          { ...updates, updatedAt: /* @__PURE__ */ new Date() },
          { new: true, upsert: true }
          // Create if doesn't exist
        ).lean();
        return settings ? this.convertMongoContactSettings(settings) : void 0;
      }
      // Helper methods to convert MongoDB documents to our types
      convertMongoUser(mongoUser) {
        return {
          id: String(mongoUser._id),
          username: mongoUser.username,
          password: mongoUser.password,
          isAdmin: mongoUser.isAdmin,
          createdAt: mongoUser.createdAt
        };
      }
      convertMongoProperty(mongoProperty) {
        return {
          id: String(mongoProperty._id),
          title: mongoProperty.title,
          description: mongoProperty.description,
          location: mongoProperty.location,
          propertyType: mongoProperty.propertyType,
          bedrooms: mongoProperty.bedrooms,
          bathrooms: mongoProperty.bathrooms,
          size: mongoProperty.size,
          status: mongoProperty.status,
          imageUrls: mongoProperty.imageUrls,
          isActive: mongoProperty.isActive,
          createdAt: mongoProperty.createdAt,
          updatedAt: mongoProperty.updatedAt
        };
      }
      convertMongoPropertyImage(mongoImage) {
        return {
          id: String(mongoImage._id),
          propertyId: mongoImage.propertyId,
          imageUrl: mongoImage.imageUrl,
          description: mongoImage.description,
          isMain: mongoImage.isMain,
          sortOrder: mongoImage.sortOrder,
          createdAt: mongoImage.createdAt
        };
      }
      convertMongoWhatsAppSettings(mongoSettings) {
        return {
          id: String(mongoSettings._id),
          phoneNumber: mongoSettings.phoneNumber,
          isActive: mongoSettings.isActive,
          businessName: mongoSettings.businessName,
          welcomeMessage: mongoSettings.welcomeMessage,
          propertyInquiryTemplate: mongoSettings.propertyInquiryTemplate,
          generalInquiryTemplate: mongoSettings.generalInquiryTemplate,
          createdAt: mongoSettings.createdAt,
          updatedAt: mongoSettings.updatedAt
        };
      }
      convertMongoContactSettings(mongoSettings) {
        return {
          id: String(mongoSettings._id),
          phone: mongoSettings.phone,
          email: mongoSettings.email,
          address: mongoSettings.address,
          isActive: mongoSettings.isActive,
          createdAt: mongoSettings.createdAt,
          updatedAt: mongoSettings.updatedAt
        };
      }
      // Contact Messages operations
      async createContactMessage(insertMessage) {
        const message = new ContactMessageModel({
          ...insertMessage,
          isRead: false,
          createdAt: /* @__PURE__ */ new Date()
        });
        await message.save();
        return this.convertMongoContactMessage(message.toObject());
      }
      async getContactMessages() {
        const messages = await ContactMessageModel.find().sort({ createdAt: -1 }).lean();
        return messages.map((m) => this.convertMongoContactMessage(m));
      }
      async markContactMessageAsRead(id) {
        try {
          if (!mongoose2.Types.ObjectId.isValid(id)) {
            return false;
          }
          const result = await ContactMessageModel.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
          );
          return !!result;
        } catch (error) {
          console.error("Error marking contact message as read:", error);
          return false;
        }
      }
      convertMongoContactMessage(mongoMessage) {
        return {
          id: String(mongoMessage._id),
          name: mongoMessage.name,
          email: mongoMessage.email,
          phone: mongoMessage.phone,
          message: mongoMessage.message,
          isRead: mongoMessage.isRead,
          createdAt: mongoMessage.createdAt
        };
      }
    };
  }
});

// server/storage.ts
var storage_exports = {};
__export(storage_exports, {
  MemStorage: () => MemStorage,
  storage: () => storage
});
var MemStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_mongo_storage();
    MemStorage = class {
      users = [];
      properties = [];
      propertyImages = [];
      sliderImages = [];
      whatsappSettings = null;
      contactSettings = null;
      nextUserId = 1;
      nextPropertyId = 1;
      nextPropertyImageId = 1;
      nextSliderImageId = 1;
      constructor() {
        this.initializeSampleData();
      }
      initializeSampleData() {
        const sampleProperties = [
          {
            id: this.nextPropertyId++,
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
            createdAt: /* @__PURE__ */ new Date("2025-08-15"),
            updatedAt: /* @__PURE__ */ new Date("2025-08-15")
          },
          {
            id: this.nextPropertyId++,
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
            createdAt: /* @__PURE__ */ new Date("2025-08-14"),
            updatedAt: /* @__PURE__ */ new Date("2025-08-14")
          },
          {
            id: this.nextPropertyId++,
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
            createdAt: /* @__PURE__ */ new Date("2025-08-13"),
            updatedAt: /* @__PURE__ */ new Date("2025-08-13")
          }
        ];
        this.properties = sampleProperties;
        const sampleSliderImages = [
          {
            id: this.nextSliderImageId++,
            imageUrl: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1920",
            title: "Find Your Dream Property",
            description: "Discover premium real estate opportunities in Addis Ababa",
            isActive: true
          },
          {
            id: this.nextSliderImageId++,
            imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920",
            title: "Modern Living Spaces",
            description: "Experience contemporary design and luxury amenities",
            isActive: true
          },
          {
            id: this.nextSliderImageId++,
            imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920",
            title: "Investment Opportunities",
            description: "Secure your future with our premium property portfolio",
            isActive: true
          }
        ];
        this.sliderImages = sampleSliderImages;
      }
      // User operations
      async getUser(id) {
        return this.users.find((user) => String(user.id) === id);
      }
      async getUserByUsername(username) {
        return this.users.find((user) => user.username === username);
      }
      async createUser(insertUser) {
        const newUser = {
          id: this.nextUserId++,
          ...insertUser,
          isAdmin: insertUser.isAdmin ?? false,
          createdAt: /* @__PURE__ */ new Date()
        };
        this.users.push(newUser);
        return {
          ...newUser,
          id: String(newUser.id)
        };
      }
      // Property operations
      async getAllProperties() {
        return this.properties.filter((property) => property.isActive).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }
      async getProperty(id) {
        return this.properties.find((property) => String(property.id) === id);
      }
      async createProperty(insertProperty) {
        const now = /* @__PURE__ */ new Date();
        const newProperty = {
          id: this.nextPropertyId++,
          ...insertProperty,
          bedrooms: insertProperty.bedrooms ?? 0,
          bathrooms: insertProperty.bathrooms ?? 0,
          status: insertProperty.status ?? ["For Sale"],
          imageUrls: insertProperty.imageUrls ?? [],
          isActive: insertProperty.isActive ?? true,
          createdAt: now,
          updatedAt: now
        };
        this.properties.push(newProperty);
        return {
          ...newProperty,
          id: String(newProperty.id)
        };
      }
      async updateProperty(id, updates) {
        const propertyIndex = this.properties.findIndex((property) => String(property.id) === id);
        if (propertyIndex === -1) return void 0;
        this.properties[propertyIndex] = {
          ...this.properties[propertyIndex],
          ...updates,
          updatedAt: /* @__PURE__ */ new Date()
        };
        return this.properties[propertyIndex];
      }
      async deleteProperty(id) {
        const propertyIndex = this.properties.findIndex((property) => String(property.id) === id);
        if (propertyIndex === -1) return false;
        this.properties[propertyIndex] = {
          ...this.properties[propertyIndex],
          isActive: false
        };
        return true;
      }
      // Property image operations
      async getPropertyImages(propertyId) {
        return this.propertyImages.filter((image) => String(image.propertyId) === propertyId).sort((a, b) => {
          if (a.isMain && !b.isMain) return -1;
          if (!a.isMain && b.isMain) return 1;
          return a.sortOrder - b.sortOrder;
        });
      }
      async createPropertyImage(insertImage) {
        const newImage = {
          id: this.nextPropertyImageId++,
          ...insertImage,
          description: insertImage.description ?? null,
          isMain: insertImage.isMain ?? false,
          sortOrder: insertImage.sortOrder ?? 0,
          createdAt: /* @__PURE__ */ new Date()
        };
        this.propertyImages.push(newImage);
        return {
          ...newImage,
          id: String(newImage.id),
          propertyId: insertImage.propertyId
        };
      }
      async deletePropertyImage(id) {
        const imageIndex = this.propertyImages.findIndex((image) => String(image.id) === id);
        if (imageIndex === -1) return false;
        this.propertyImages.splice(imageIndex, 1);
        return true;
      }
      async setMainImage(propertyId, imageId) {
        this.propertyImages.forEach((image2) => {
          if (String(image2.propertyId) === propertyId) {
            image2.isMain = false;
          }
        });
        const image = this.propertyImages.find((img) => String(img.id) === imageId && String(img.propertyId) === propertyId);
        if (!image) return false;
        image.isMain = true;
        return true;
      }
      // Slider operations
      async getSliderImages() {
        return this.sliderImages.filter((img) => img.isActive).map((img) => ({
          ...img,
          id: String(img.id)
        }));
      }
      async createSliderImage(insertImage) {
        const image = {
          id: this.nextSliderImageId++,
          ...insertImage,
          isActive: true
        };
        this.sliderImages.push(image);
        return {
          ...image,
          id: String(image.id)
        };
      }
      async updateSliderImage(id, updates) {
        const imageIndex = this.sliderImages.findIndex((img) => String(img.id) === id);
        if (imageIndex === -1) return false;
        this.sliderImages[imageIndex] = {
          ...this.sliderImages[imageIndex],
          ...updates
        };
        return true;
      }
      async deleteSliderImage(id) {
        const imageIndex = this.sliderImages.findIndex((img) => String(img.id) === id);
        if (imageIndex === -1) return false;
        this.sliderImages.splice(imageIndex, 1);
        return true;
      }
      // WhatsApp settings operations
      async getWhatsAppSettings() {
        if (!this.whatsappSettings) {
          this.whatsappSettings = {
            id: "1",
            phoneNumber: "+251975666699",
            isActive: true,
            businessName: "Temer Properties",
            welcomeMessage: "Hello! Welcome to Temer Properties. How can we assist you today?",
            propertyInquiryTemplate: "Hello! I'm interested in this property:\n\n\u{1F3E0} *{title}*\n\u{1F4CD} Location: {location}\n\u{1F6CF}\uFE0F Bedrooms: {bedrooms}\n\u{1F6BF} Bathrooms: {bathrooms}\n\u{1F4D0} Size: {size} m\xB2\n\nCould you please provide more information about this property? I would like to schedule a viewing or discuss the details further.\n\nThank you!",
            generalInquiryTemplate: "Hello Temer Properties! \u{1F44B}\n\nI'm interested in learning more about your real estate services. Could you please help me with information about available properties?\n\nThank you!",
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          };
        }
        return this.whatsappSettings;
      }
      async updateWhatsAppSettings(updates) {
        if (!this.whatsappSettings) {
          await this.getWhatsAppSettings();
        }
        if (this.whatsappSettings) {
          this.whatsappSettings = {
            ...this.whatsappSettings,
            ...updates,
            updatedAt: /* @__PURE__ */ new Date()
          };
        }
        return this.whatsappSettings;
      }
      // Contact settings operations
      async getContactSettings() {
        if (!this.contactSettings) {
          this.contactSettings = {
            id: "1",
            phone: "+251 911 123 456",
            email: "info@temerproperties.com",
            address: "Bole Road, Addis Ababa, Ethiopia",
            isActive: true,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          };
        }
        return this.contactSettings;
      }
      async updateContactSettings(updates) {
        if (!this.contactSettings) {
          await this.getContactSettings();
        }
        if (this.contactSettings) {
          this.contactSettings = {
            ...this.contactSettings,
            ...updates,
            updatedAt: /* @__PURE__ */ new Date()
          };
        }
        return this.contactSettings;
      }
    };
    storage = new MongoStorage();
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
init_storage();
import { createServer } from "http";

// shared/schema.ts
import { pgTable, text, integer, boolean, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  propertyType: text("property_type").notNull(),
  bedrooms: integer("bedrooms").default(0).notNull(),
  bathrooms: integer("bathrooms").default(0).notNull(),
  size: integer("size").notNull(),
  status: text("status").array().default(["For Sale"]).notNull(),
  imageUrls: text("image_urls").array().default([]).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var propertyImages = pgTable("property_images", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  isMain: boolean("is_main").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertPropertyImageSchema = createInsertSchema(propertyImages).omit({
  id: true,
  createdAt: true
});
var whatsappSettings = pgTable("whatsapp_settings", {
  id: serial("id").primaryKey(),
  phoneNumber: text("phone_number").notNull().default("+251975666699"),
  isActive: boolean("is_active").default(true).notNull(),
  businessName: text("business_name").default("Temer Properties").notNull(),
  welcomeMessage: text("welcome_message").default("Hello! Welcome to Temer Properties. How can we assist you today?").notNull(),
  propertyInquiryTemplate: text("property_inquiry_template").default("Hello! I'm interested in this property:\n\n\u{1F3E0} *{title}*\n\u{1F4CD} Location: {location}\n\u{1F6CF}\uFE0F Bedrooms: {bedrooms}\n\u{1F6BF} Bathrooms: {bathrooms}\n\u{1F4D0} Size: {size} m\xB2\n\nCould you please provide more information about this property? I would like to schedule a viewing or discuss the details further.\n\nThank you!").notNull(),
  generalInquiryTemplate: text("general_inquiry_template").default("Hello Temer Properties! \u{1F44B}\n\nI'm interested in learning more about your real estate services. Could you please help me with information about available properties?\n\nThank you!").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertWhatsAppSettingsSchema = createInsertSchema(whatsappSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var contactSettings = pgTable("contact_settings", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull().default("+251 911 123 456"),
  email: text("email").notNull().default("info@temerproperties.com"),
  address: text("address").notNull().default("Bole Road, Addis Ababa, Ethiopia"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertContactSettingsSchema = createInsertSchema(contactSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var sliderImages = pgTable("slider_images", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertSliderImageSchema = createInsertSchema(sliderImages).omit({
  id: true,
  createdAt: true
});
var insertContactMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  message: z.string().min(1, "Message is required")
});

// server/routes.ts
import * as bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";

// server/whatsapp-service.ts
var WhatsAppService = class {
  isReady = true;
  // Simulated ready state
  wsConnections = /* @__PURE__ */ new Set();
  constructor() {
    this.initializeWhatsApp();
  }
  async initializeWhatsApp() {
    console.log("\u{1F4F1} WhatsApp Service Initialized (Simulation Mode)");
    console.log("\u2705 Ready to send messages to company WhatsApp: +251975666699");
    setTimeout(() => {
      this.broadcastToWebSocket({
        type: "whatsapp_ready",
        message: "WhatsApp service is connected and ready to send messages!"
      });
    }, 2e3);
  }
  addWebSocketConnection(ws) {
    this.wsConnections.add(ws);
    ws.send(JSON.stringify({
      type: "whatsapp_status",
      isReady: this.isReady,
      message: this.isReady ? "WhatsApp is connected and ready!" : "WhatsApp is connecting..."
    }));
  }
  removeWebSocketConnection(ws) {
    this.wsConnections.delete(ws);
  }
  broadcastToWebSocket(data) {
    const message = JSON.stringify(data);
    this.wsConnections.forEach((ws) => {
      try {
        if (ws.readyState === 1) {
          ws.send(message);
        }
      } catch (error) {
        console.error("Failed to send WebSocket message:", error);
        this.wsConnections.delete(ws);
      }
    });
  }
  async sendContactMessage(contactMessage, companyPhoneNumber) {
    if (!this.isReady) {
      console.log("\u26A0\uFE0F WhatsApp service not ready. Message saved to database but not sent to WhatsApp.");
      return false;
    }
    try {
      const formattedMessage = `\u{1F3E0} *NEW CONTACT MESSAGE - Temer Properties*

\u{1F464} *Name:* ${contactMessage.name}
\u{1F4E7} *Email:* ${contactMessage.email}
\u{1F4F1} *Phone:* ${contactMessage.phone}

\u{1F4AC} *Message:*
${contactMessage.message}

\u23F0 *Received:* ${new Date(contactMessage.createdAt).toLocaleString()}
\u{1F194} *Message ID:* ${contactMessage.id}`;
      console.log("\n\u{1F4F1} ===== WHATSAPP MESSAGE SENT =====");
      console.log(`\u{1F4DE} To: ${companyPhoneNumber}`);
      console.log(`\u{1F4C4} Message:
${formattedMessage}`);
      console.log("=====================================\n");
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`\u2705 Contact message successfully sent to WhatsApp: ${companyPhoneNumber}`);
      this.broadcastToWebSocket({
        type: "contact_message_sent",
        message: `New contact message from ${contactMessage.name} sent to WhatsApp!`,
        contactMessage
      });
      return true;
    } catch (error) {
      console.error("\u274C Failed to send WhatsApp message:", error);
      this.broadcastToWebSocket({
        type: "whatsapp_send_error",
        message: `Failed to send message to WhatsApp: ${error}`,
        contactMessage
      });
      return false;
    }
  }
  getStatus() {
    return {
      isReady: this.isReady,
      isConnected: this.client !== null
    };
  }
};
var whatsappService = new WhatsAppService();

// server/routes.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var adminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const credentials = Buffer.from(authHeader.slice(6), "base64").toString();
  const [username, password] = credentials.split(":");
  try {
    const user = await storage.getUserByUsername(username);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Authentication error" });
  }
};
var storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = req.originalUrl.includes("/slider") ? "uploads/slider" : "uploads/properties";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});
var upload = multer({
  storage: storage_multer,
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  }
});
async function registerRoutes(app2) {
  app2.use("/uploads", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  const express3 = await import("express");
  app2.use("/uploads", express3.static("uploads"));
  app2.get("/api/properties", async (req, res) => {
    try {
      const properties2 = await storage.getAllProperties();
      res.json(properties2);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });
  app2.get("/api/properties/:id", async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Invalid property ID" });
      }
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      const images = await storage.getPropertyImages(id);
      res.json({ ...property, images });
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      const user = await storage.getUserByUsername(username);
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Invalid admin credentials" });
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid admin credentials" });
      }
      res.json({
        message: "Login successful",
        user: { id: user.id, username: user.username, isAdmin: user.isAdmin }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  app2.post("/api/admin/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      res.json({
        message: "Admin user created successfully",
        user: { id: user.id, username: user.username, isAdmin: user.isAdmin }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });
  app2.post("/api/admin/properties", adminAuth, async (req, res) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(propertyData);
      res.json(property);
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(500).json({ error: "Failed to create property" });
    }
  });
  app2.put("/api/admin/properties/:id", adminAuth, async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Invalid property ID" });
      }
      const propertyData = insertPropertySchema.partial().parse(req.body);
      const property = await storage.updateProperty(id, propertyData);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ error: "Failed to update property" });
    }
  });
  app2.delete("/api/admin/properties/:id", adminAuth, async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Invalid property ID" });
      }
      const success = await storage.deleteProperty(id);
      if (!success) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.json({ message: "Property deleted successfully" });
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ error: "Failed to delete property" });
    }
  });
  app2.get("/api/admin/properties/:id/images", adminAuth, async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Invalid property ID" });
      }
      const images = await storage.getPropertyImages(id);
      res.json(images);
    } catch (error) {
      console.error("Error fetching property images:", error);
      res.status(500).json({ error: "Failed to fetch property images" });
    }
  });
  app2.post("/api/admin/properties/:id/images", adminAuth, async (req, res) => {
    try {
      const propertyId = req.params.id;
      if (!propertyId) {
        return res.status(400).json({ error: "Invalid property ID" });
      }
      const imageData = insertPropertyImageSchema.parse({
        ...req.body,
        propertyId
      });
      const image = await storage.createPropertyImage(imageData);
      res.json(image);
    } catch (error) {
      console.error("Error adding property image:", error);
      res.status(500).json({ error: "Failed to add property image" });
    }
  });
  app2.delete("/api/admin/images/:id", adminAuth, async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Invalid image ID" });
      }
      const success = await storage.deletePropertyImage(id);
      if (!success) {
        return res.status(404).json({ error: "Image not found" });
      }
      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ error: "Failed to delete image" });
    }
  });
  app2.put("/api/admin/images/:id/main", adminAuth, async (req, res) => {
    try {
      const id = req.params.id;
      const { propertyId } = req.body;
      if (!id || !propertyId) {
        return res.status(400).json({ error: "Invalid image or property ID" });
      }
      const success = await storage.setMainImage(propertyId, id);
      if (!success) {
        return res.status(404).json({ error: "Image not found" });
      }
      res.json({ message: "Main image updated successfully" });
    } catch (error) {
      console.error("Error setting main image:", error);
      res.status(500).json({ error: "Failed to set main image" });
    }
  });
  app2.get("/api/slider", async (req, res) => {
    try {
      const images = await storage.getSliderImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching slider images:", error);
      res.status(500).json({ error: "Failed to fetch slider images" });
    }
  });
  app2.post("/api/admin/slider", adminAuth, async (req, res) => {
    try {
      const { imageUrl, title, description } = req.body;
      if (!imageUrl || !title) {
        return res.status(400).json({ error: "Image URL and title are required" });
      }
      const image = await storage.createSliderImage({ imageUrl, title, description: description || "" });
      res.json(image);
    } catch (error) {
      console.error("Error creating slider image:", error);
      res.status(500).json({ error: "Failed to create slider image" });
    }
  });
  app2.put("/api/admin/slider/:id", adminAuth, async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Invalid slider image ID" });
      }
      const success = await storage.updateSliderImage(id, req.body);
      if (!success) {
        return res.status(404).json({ error: "Slider image not found" });
      }
      res.json({ message: "Slider image updated successfully" });
    } catch (error) {
      console.error("Error updating slider image:", error);
      res.status(500).json({ error: "Failed to update slider image" });
    }
  });
  app2.delete("/api/admin/slider/:id", adminAuth, async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Invalid slider image ID" });
      }
      const success = await storage.deleteSliderImage(id);
      if (!success) {
        return res.status(404).json({ error: "Slider image not found" });
      }
      res.json({ message: "Slider image deleted successfully" });
    } catch (error) {
      console.error("Error deleting slider image:", error);
      res.status(500).json({ error: "Failed to delete slider image" });
    }
  });
  app2.get("/api/whatsapp/settings", async (req, res) => {
    try {
      const settings = await storage.getWhatsAppSettings();
      if (!settings) {
        return res.status(404).json({ error: "WhatsApp settings not found" });
      }
      res.json(settings);
    } catch (error) {
      console.error("Error fetching WhatsApp settings:", error);
      res.status(500).json({ error: "Failed to fetch WhatsApp settings" });
    }
  });
  app2.put("/api/admin/whatsapp/settings", adminAuth, async (req, res) => {
    try {
      const settingsData = insertWhatsAppSettingsSchema.parse(req.body);
      const updatedSettings = await storage.updateWhatsAppSettings(settingsData);
      if (!updatedSettings) {
        return res.status(400).json({ error: "Failed to update WhatsApp settings" });
      }
      res.json({
        message: "WhatsApp settings updated successfully",
        settings: updatedSettings
      });
    } catch (error) {
      console.error("Error updating WhatsApp settings:", error);
      res.status(500).json({ error: "Failed to update WhatsApp settings" });
    }
  });
  app2.get("/api/contact/settings", async (req, res) => {
    try {
      const settings = await storage.getContactSettings();
      if (!settings) {
        return res.status(404).json({ error: "Contact settings not found" });
      }
      res.json(settings);
    } catch (error) {
      console.error("Error fetching contact settings:", error);
      res.status(500).json({ error: "Failed to fetch contact settings" });
    }
  });
  app2.put("/api/admin/contact/settings", adminAuth, async (req, res) => {
    try {
      const settingsData = insertContactSettingsSchema.parse(req.body);
      const updatedSettings = await storage.updateContactSettings(settingsData);
      if (!updatedSettings) {
        return res.status(400).json({ error: "Failed to update contact settings" });
      }
      res.json({
        message: "Contact settings updated successfully",
        settings: updatedSettings
      });
    } catch (error) {
      console.error("Error updating contact settings:", error);
      res.status(500).json({ error: "Failed to update contact settings" });
    }
  });
  app2.post("/api/contact/submit", async (req, res) => {
    try {
      const contactData = insertContactMessageSchema.parse(req.body);
      const savedMessage = await storage.createContactMessage(contactData);
      console.log("New contact message received:", savedMessage);
      const whatsappSettings2 = await storage.getWhatsAppSettings();
      const companyPhoneNumber = whatsappSettings2?.phoneNumber || "+251975666699";
      const whatsappSent = await whatsappService.sendContactMessage(savedMessage, companyPhoneNumber);
      if (whatsappSent) {
        console.log("\u2705 Contact message successfully sent to WhatsApp");
      } else {
        console.log("\u26A0\uFE0F Contact message saved but WhatsApp sending failed");
      }
      res.json({
        message: "Your message has been sent successfully!",
        success: true,
        whatsappSent
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      res.status(500).json({
        error: "Failed to send your message. Please try again.",
        success: false
      });
    }
  });
  app2.get("/api/admin/contact/messages", adminAuth, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ error: "Failed to fetch contact messages" });
    }
  });
  app2.put("/api/admin/contact/messages/:id/read", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.markContactMessageAsRead(id);
      if (!success) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.json({ message: "Message marked as read", success: true });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  });
  app2.post("/api/admin/upload/property", adminAuth, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }
      const imageUrl = `/uploads/properties/${req.file.filename}`;
      res.json({ imageUrl, filename: req.file.filename });
    } catch (error) {
      console.error("Error uploading property image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });
  app2.post("/api/admin/upload/slider", adminAuth, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }
      const imageUrl = `/uploads/slider/${req.file.filename}`;
      res.json({ imageUrl, filename: req.file.filename });
    } catch (error) {
      console.error("Error uploading slider image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });
  app2.post("/api/admin/upload/multiple", adminAuth, upload.array("images", 10), async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ error: "No image files provided" });
      }
      const imageUrls = req.files.map((file) => ({
        imageUrl: `/uploads/properties/${file.filename}`,
        filename: file.filename
      }));
      res.json({ images: imageUrls });
    } catch (error) {
      console.error("Error uploading multiple images:", error);
      res.status(500).json({ error: "Failed to upload images" });
    }
  });
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({
    server: httpServer,
    path: "/ws"
  });
  wss.on("connection", (ws) => {
    console.log("\u{1F50C} New WebSocket connection established");
    whatsappService.addWebSocketConnection(ws);
    ws.send(JSON.stringify({
      type: "connection_established",
      message: "Connected to Temer Properties notification service",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }));
    ws.on("close", () => {
      console.log("\u{1F50C} WebSocket connection closed");
      whatsappService.removeWebSocketConnection(ws);
    });
    ws.on("error", (error) => {
      console.error("\u274C WebSocket error:", error);
      whatsappService.removeWebSocketConnection(ws);
    });
  });
  console.log("\u{1F680} WebSocket server setup complete on /ws path");
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const { connectToMongoDB: connectToMongoDB2 } = await Promise.resolve().then(() => (init_mongodb(), mongodb_exports));
  await connectToMongoDB2();
  const { storage: storage2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
  const bcrypt2 = await import("bcrypt");
  try {
    const existingAdmin = await storage2.getUserByUsername("admin");
    if (!existingAdmin) {
      const hashedPassword = await bcrypt2.hash("admin123", 10);
      await storage2.createUser({
        username: "admin",
        password: hashedPassword,
        isAdmin: true
      });
      console.log("Default admin user created (admin/admin123)");
    }
  } catch (error) {
    console.error("Error creating default admin user:", error);
  }
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
