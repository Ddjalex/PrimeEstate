import { 
  type User, 
  type InsertUser, 
  type Property, 
  type InsertProperty,
  type PropertyImage,
  type InsertPropertyImage,
  type WhatsAppSettings,
  type InsertWhatsAppSettings,
  type ContactSettings,
  type InsertContactSettings,
  type ContactMessage,
  type InsertContactMessage
} from "@shared/schema";
import { IStorage } from "./storage";
import { UserModel, PropertyModel, PropertyImageModel, SliderImageModel, WhatsAppSettingsModel, ContactSettingsModel, ContactMessageModel } from "./mongodb";
import mongoose from "mongoose";

export class MongoStorage implements IStorage {
  
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const user = await UserModel.findById(id).lean();
    return user ? this.convertMongoUser(user) : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ username }).lean();
    return user ? this.convertMongoUser(user) : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = new UserModel({
      ...insertUser,
      isAdmin: insertUser.isAdmin ?? false,
    });
    await user.save();
    return this.convertMongoUser(user.toObject());
  }

  // Property operations
  async getAllProperties(): Promise<Property[]> {
    const properties = await PropertyModel.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    return properties.map(p => this.convertMongoProperty(p));
  }

  async getProperty(id: string): Promise<Property | undefined> {
    try {
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid ObjectId format:', id);
        return undefined;
      }
      const property = await PropertyModel.findById(id).lean();
      return property ? this.convertMongoProperty(property) : undefined;
    } catch (error) {
      console.error('Error finding property by ID:', error);
      return undefined;
    }
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const now = new Date();
    const property = new PropertyModel({
      ...insertProperty,
      bedrooms: insertProperty.bedrooms ?? 0,
      bathrooms: insertProperty.bathrooms ?? 0,
      status: insertProperty.status ?? ['For Sale'],
      imageUrls: insertProperty.imageUrls ?? [],
      isActive: insertProperty.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });
    await property.save();
    return this.convertMongoProperty(property.toObject());
  }

  async updateProperty(id: string, updates: Partial<InsertProperty>): Promise<Property | undefined> {
    try {
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid ObjectId format for update:', id);
        return undefined;
      }
      const property = await PropertyModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean();
      return property ? this.convertMongoProperty(property) : undefined;
    } catch (error) {
      console.error('Error updating property:', error);
      return undefined;
    }
  }

  async deleteProperty(id: string): Promise<boolean> {
    try {
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid ObjectId format for delete:', id);
        return false;
      }
      const result = await PropertyModel.findByIdAndUpdate(
        id,
        { isActive: false }
      );
      return result !== null;
    } catch (error) {
      console.error('Error deleting property:', error);
      return false;
    }
  }

  // Property image operations
  async getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
    const images = await PropertyImageModel.find({ propertyId })
      .sort({ isMain: -1, sortOrder: 1 })
      .lean();
    return images.map(img => this.convertMongoPropertyImage(img));
  }

  async createPropertyImage(insertImage: InsertPropertyImage): Promise<PropertyImage> {
    const image = new PropertyImageModel({
      ...insertImage,
      description: insertImage.description ?? null,
      isMain: insertImage.isMain ?? false,
      sortOrder: insertImage.sortOrder ?? 0,
    });
    await image.save();
    return this.convertMongoPropertyImage(image.toObject());
  }

  async deletePropertyImage(id: string): Promise<boolean> {
    const result = await PropertyImageModel.findByIdAndDelete(id);
    return result !== null;
  }

  async setMainImage(propertyId: string, imageId: string): Promise<boolean> {
    // First, unset all main images for this property
    await PropertyImageModel.updateMany(
      { propertyId },
      { isMain: false }
    );
    
    // Then set the specified image as main
    const result = await PropertyImageModel.findByIdAndUpdate(
      imageId,
      { isMain: true }
    );
    
    return result !== null;
  }

  // Slider operations
  async getSliderImages() {
    const images = await SliderImageModel.find({ isActive: true }).lean();
    return images.map(img => ({
      id: String((img as any)._id),
      imageUrl: img.imageUrl,
      title: img.title,
      description: img.description,
      isActive: img.isActive
    }));
  }

  async createSliderImage(insertImage: { imageUrl: string; title: string; description: string }) {
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

  async updateSliderImage(id: string, updates: { imageUrl?: string; title?: string; description?: string; isActive?: boolean }) {
    const result = await SliderImageModel.findByIdAndUpdate(id, updates);
    return result !== null;
  }

  async deleteSliderImage(id: string) {
    const result = await SliderImageModel.findByIdAndDelete(id);
    return result !== null;
  }

  // WhatsApp settings operations
  async getWhatsAppSettings(): Promise<WhatsAppSettings | undefined> {
    const settings = await WhatsAppSettingsModel.findOne().lean();
    return settings ? this.convertMongoWhatsAppSettings(settings) : undefined;
  }

  async updateWhatsAppSettings(updates: Partial<InsertWhatsAppSettings>): Promise<WhatsAppSettings | undefined> {
    const settings = await WhatsAppSettingsModel.findOneAndUpdate(
      {}, // Update the first (and only) document
      { ...updates, updatedAt: new Date() },
      { new: true, upsert: true } // Create if doesn't exist
    ).lean();
    return settings ? this.convertMongoWhatsAppSettings(settings) : undefined;
  }

  // Contact settings operations
  async getContactSettings(): Promise<ContactSettings | undefined> {
    const settings = await ContactSettingsModel.findOne().lean();
    return settings ? this.convertMongoContactSettings(settings) : undefined;
  }

  async updateContactSettings(updates: Partial<InsertContactSettings>): Promise<ContactSettings | undefined> {
    const settings = await ContactSettingsModel.findOneAndUpdate(
      {}, // Update the first (and only) document
      { ...updates, updatedAt: new Date() },
      { new: true, upsert: true } // Create if doesn't exist
    ).lean();
    return settings ? this.convertMongoContactSettings(settings) : undefined;
  }

  // Helper methods to convert MongoDB documents to our types
  private convertMongoUser(mongoUser: any): User {
    return {
      id: String(mongoUser._id),
      username: mongoUser.username,
      password: mongoUser.password,
      isAdmin: mongoUser.isAdmin,
      createdAt: mongoUser.createdAt
    };
  }

  private convertMongoProperty(mongoProperty: any): Property {
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

  private convertMongoPropertyImage(mongoImage: any): PropertyImage {
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

  private convertMongoWhatsAppSettings(mongoSettings: any): WhatsAppSettings {
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

  private convertMongoContactSettings(mongoSettings: any): ContactSettings {
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
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const message = new ContactMessageModel({
      ...insertMessage,
      isRead: false,
      createdAt: new Date()
    });
    await message.save();
    return this.convertMongoContactMessage(message.toObject());
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    const messages = await ContactMessageModel.find()
      .sort({ createdAt: -1 })
      .lean();
    return messages.map(m => this.convertMongoContactMessage(m));
  }

  async markContactMessageAsRead(id: string): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
      }
      const result = await ContactMessageModel.findByIdAndUpdate(
        id,
        { isRead: true },
        { new: true }
      );
      return !!result;
    } catch (error) {
      console.error('Error marking contact message as read:', error);
      return false;
    }
  }

  private convertMongoContactMessage(mongoMessage: any): ContactMessage {
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
}