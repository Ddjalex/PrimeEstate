import { 
  type User, 
  type InsertUser, 
  type Property, 
  type InsertProperty,
  type PropertyImage,
  type InsertPropertyImage
} from "@shared/schema";
import { IStorage } from "./storage";
import { UserModel, PropertyModel, PropertyImageModel, SliderImageModel } from "./mongodb";

export class MongoStorage implements IStorage {
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const user = await UserModel.findOne({ id }).lean();
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

  async getProperty(id: number): Promise<Property | undefined> {
    const property = await PropertyModel.findOne({ id }).lean();
    return property ? this.convertMongoProperty(property) : undefined;
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

  async updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property | undefined> {
    const property = await PropertyModel.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).lean();
    return property ? this.convertMongoProperty(property) : undefined;
  }

  async deleteProperty(id: number): Promise<boolean> {
    const result = await PropertyModel.updateOne(
      { id },
      { isActive: false }
    );
    return result.modifiedCount > 0;
  }

  // Property image operations
  async getPropertyImages(propertyId: number): Promise<PropertyImage[]> {
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

  async deletePropertyImage(id: number): Promise<boolean> {
    const result = await PropertyImageModel.deleteOne({ id });
    return result.deletedCount > 0;
  }

  async setMainImage(propertyId: number, imageId: number): Promise<boolean> {
    // First, unset all main images for this property
    await PropertyImageModel.updateMany(
      { propertyId },
      { isMain: false }
    );
    
    // Then set the specified image as main
    const result = await PropertyImageModel.updateOne(
      { id: imageId, propertyId },
      { isMain: true }
    );
    
    return result.modifiedCount > 0;
  }

  // Slider operations
  async getSliderImages() {
    const images = await SliderImageModel.find({ isActive: true }).lean();
    return images.map(img => ({
      id: (img as any).id || (img as any)._id,
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
      id: savedImage.id || savedImage._id,
      imageUrl: savedImage.imageUrl,
      title: savedImage.title,
      description: savedImage.description,
      isActive: savedImage.isActive
    };
  }

  async updateSliderImage(id: number, updates: { imageUrl?: string; title?: string; description?: string; isActive?: boolean }) {
    const result = await SliderImageModel.updateOne({ id }, updates);
    return result.modifiedCount > 0;
  }

  async deleteSliderImage(id: number) {
    const result = await SliderImageModel.deleteOne({ id });
    return result.deletedCount > 0;
  }

  // Helper methods to convert MongoDB documents to our types
  private convertMongoUser(mongoUser: any): User {
    return {
      id: mongoUser.id || mongoUser._id,
      username: mongoUser.username,
      password: mongoUser.password,
      isAdmin: mongoUser.isAdmin,
      createdAt: mongoUser.createdAt
    };
  }

  private convertMongoProperty(mongoProperty: any): Property {
    return {
      id: mongoProperty.id || mongoProperty._id,
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
      id: mongoImage.id || mongoImage._id,
      propertyId: mongoImage.propertyId,
      imageUrl: mongoImage.imageUrl,
      description: mongoImage.description,
      isMain: mongoImage.isMain,
      sortOrder: mongoImage.sortOrder,
      createdAt: mongoImage.createdAt
    };
  }
}