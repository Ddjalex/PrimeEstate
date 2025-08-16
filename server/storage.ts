import { 
  type User, 
  type InsertUser, 
  type Property, 
  type InsertProperty,
  type PropertyImage,
  type InsertPropertyImage
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Property operations
  getAllProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Property image operations
  getPropertyImages(propertyId: number): Promise<PropertyImage[]>;
  createPropertyImage(image: InsertPropertyImage): Promise<PropertyImage>;
  deletePropertyImage(id: number): Promise<boolean>;
  setMainImage(propertyId: number, imageId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private properties: Property[] = [];
  private propertyImages: PropertyImage[] = [];
  private nextUserId = 1;
  private nextPropertyId = 1;
  private nextPropertyImageId = 1;

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextUserId++,
      ...insertUser,
      isAdmin: insertUser.isAdmin ?? false,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  // Property operations
  async getAllProperties(): Promise<Property[]> {
    return this.properties
      .filter(property => property.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.find(property => property.id === id);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const now = new Date();
    const property: Property = {
      id: this.nextPropertyId++,
      ...insertProperty,
      bedrooms: insertProperty.bedrooms ?? 0,
      bathrooms: insertProperty.bathrooms ?? 0,
      status: insertProperty.status ?? ['For Sale'],
      imageUrls: insertProperty.imageUrls ?? [],
      isActive: insertProperty.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.properties.push(property);
    return property;
  }

  async updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property | undefined> {
    const propertyIndex = this.properties.findIndex(property => property.id === id);
    if (propertyIndex === -1) return undefined;
    
    this.properties[propertyIndex] = {
      ...this.properties[propertyIndex],
      ...updates,
      updatedAt: new Date(),
    };
    
    return this.properties[propertyIndex];
  }

  async deleteProperty(id: number): Promise<boolean> {
    const propertyIndex = this.properties.findIndex(property => property.id === id);
    if (propertyIndex === -1) return false;
    
    this.properties[propertyIndex] = {
      ...this.properties[propertyIndex],
      isActive: false,
    };
    
    return true;
  }

  // Property image operations
  async getPropertyImages(propertyId: number): Promise<PropertyImage[]> {
    return this.propertyImages
      .filter(image => image.propertyId === propertyId)
      .sort((a, b) => {
        if (a.isMain && !b.isMain) return -1;
        if (!a.isMain && b.isMain) return 1;
        return a.sortOrder - b.sortOrder;
      });
  }

  async createPropertyImage(insertImage: InsertPropertyImage): Promise<PropertyImage> {
    const image: PropertyImage = {
      id: this.nextPropertyImageId++,
      ...insertImage,
      description: insertImage.description ?? null,
      isMain: insertImage.isMain ?? false,
      sortOrder: insertImage.sortOrder ?? 0,
      createdAt: new Date(),
    };
    this.propertyImages.push(image);
    return image;
  }

  async deletePropertyImage(id: number): Promise<boolean> {
    const imageIndex = this.propertyImages.findIndex(image => image.id === id);
    if (imageIndex === -1) return false;
    
    this.propertyImages.splice(imageIndex, 1);
    return true;
  }

  async setMainImage(propertyId: number, imageId: number): Promise<boolean> {
    // First, unset all main images for this property
    this.propertyImages.forEach(image => {
      if (image.propertyId === propertyId) {
        image.isMain = false;
      }
    });
    
    // Then set the specified image as main
    const image = this.propertyImages.find(img => img.id === imageId && img.propertyId === propertyId);
    if (!image) return false;
    
    image.isMain = true;
    return true;
  }
}

export const storage = new MemStorage();