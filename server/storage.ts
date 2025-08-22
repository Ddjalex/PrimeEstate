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
  
  // Slider operations
  getSliderImages(): Promise<{ id: number; imageUrl: string; title: string; description: string; isActive: boolean }[]>;
  createSliderImage(image: { imageUrl: string; title: string; description: string }): Promise<{ id: number; imageUrl: string; title: string; description: string; isActive: boolean }>;
  updateSliderImage(id: number, image: { imageUrl?: string; title?: string; description?: string; isActive?: boolean }): Promise<boolean>;
  deleteSliderImage(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private properties: Property[] = [];
  private propertyImages: PropertyImage[] = [];
  private sliderImages: { id: number; imageUrl: string; title: string; description: string; isActive: boolean }[] = [];
  private nextUserId = 1;
  private nextPropertyId = 1;
  private nextPropertyImageId = 1;
  private nextSliderImageId = 1;

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample properties for demonstration
    const sampleProperties: Property[] = [
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
        createdAt: new Date('2025-08-15'),
        updatedAt: new Date('2025-08-15')
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
        createdAt: new Date('2025-08-14'),
        updatedAt: new Date('2025-08-14')
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
        createdAt: new Date('2025-08-13'),
        updatedAt: new Date('2025-08-13')
      }
    ];

    this.properties = sampleProperties;

    // Add sample slider images
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

  // Slider operations
  async getSliderImages() {
    return this.sliderImages.filter(img => img.isActive);
  }

  async createSliderImage(insertImage: { imageUrl: string; title: string; description: string }) {
    const image = {
      id: this.nextSliderImageId++,
      ...insertImage,
      isActive: true
    };
    this.sliderImages.push(image);
    return image;
  }

  async updateSliderImage(id: number, updates: { imageUrl?: string; title?: string; description?: string; isActive?: boolean }) {
    const imageIndex = this.sliderImages.findIndex(img => img.id === id);
    if (imageIndex === -1) return false;
    
    this.sliderImages[imageIndex] = {
      ...this.sliderImages[imageIndex],
      ...updates
    };
    return true;
  }

  async deleteSliderImage(id: number) {
    const imageIndex = this.sliderImages.findIndex(img => img.id === id);
    if (imageIndex === -1) return false;
    
    this.sliderImages.splice(imageIndex, 1);
    return true;
  }
}

import { MongoStorage } from "./mongo-storage";

export const storage = new MongoStorage();