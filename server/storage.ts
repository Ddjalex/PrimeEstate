import { 
  UserModel, 
  PropertyModel, 
  PropertyImageModel,
  type User, 
  type InsertUser, 
  type Property, 
  type InsertProperty,
  type PropertyImage,
  type InsertPropertyImage
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Property operations
  getAllProperties(): Promise<Property[]>;
  getProperty(id: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: string): Promise<boolean>;
  
  // Property image operations
  getPropertyImages(propertyId: string): Promise<PropertyImage[]>;
  createPropertyImage(image: InsertPropertyImage): Promise<PropertyImage>;
  deletePropertyImage(id: string): Promise<boolean>;
  setMainImage(propertyId: string, imageId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findById(id);
      return user || undefined;
    } catch (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ username });
      return user || undefined;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const user = new UserModel(insertUser);
      await user.save();
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Property operations
  async getAllProperties(): Promise<Property[]> {
    try {
      return await PropertyModel.find({ isActive: true })
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error fetching properties:', error);
      return [];
    }
  }

  async getProperty(id: string): Promise<Property | undefined> {
    try {
      const property = await PropertyModel.findById(id);
      return property || undefined;
    } catch (error) {
      console.error('Error fetching property:', error);
      return undefined;
    }
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    try {
      const newProperty = new PropertyModel(property);
      await newProperty.save();
      return newProperty;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined> {
    try {
      const updatedProperty = await PropertyModel.findByIdAndUpdate(
        id,
        { ...property, updatedAt: new Date() },
        { new: true }
      );
      return updatedProperty || undefined;
    } catch (error) {
      console.error('Error updating property:', error);
      return undefined;
    }
  }

  async deleteProperty(id: string): Promise<boolean> {
    try {
      const result = await PropertyModel.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );
      return !!result;
    } catch (error) {
      console.error('Error deleting property:', error);
      return false;
    }
  }

  // Property image operations
  async getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
    try {
      return await PropertyImageModel.find({ propertyId })
        .sort({ isMain: -1, sortOrder: 1 });
    } catch (error) {
      console.error('Error fetching property images:', error);
      return [];
    }
  }

  async createPropertyImage(image: InsertPropertyImage): Promise<PropertyImage> {
    try {
      const newImage = new PropertyImageModel(image);
      await newImage.save();
      return newImage;
    } catch (error) {
      console.error('Error creating property image:', error);
      throw error;
    }
  }

  async deletePropertyImage(id: string): Promise<boolean> {
    try {
      const result = await PropertyImageModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting property image:', error);
      return false;
    }
  }

  async setMainImage(propertyId: string, imageId: string): Promise<boolean> {
    try {
      // First, unset all main images for this property
      await PropertyImageModel.updateMany(
        { propertyId },
        { isMain: false }
      );
      
      // Then set the specified image as main
      const result = await PropertyImageModel.findOneAndUpdate(
        { _id: imageId, propertyId },
        { isMain: true },
        { new: true }
      );
      
      return !!result;
    } catch (error) {
      console.error('Error setting main image:', error);
      return false;
    }
  }
}

export const storage = new DatabaseStorage();