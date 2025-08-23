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
  type InsertContactSettings
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
  
  // Slider operations
  getSliderImages(): Promise<{ id: string; imageUrl: string; title: string; description: string; isActive: boolean }[]>;
  createSliderImage(image: { imageUrl: string; title: string; description: string }): Promise<{ id: string; imageUrl: string; title: string; description: string; isActive: boolean }>;
  updateSliderImage(id: string, image: { imageUrl?: string; title?: string; description?: string; isActive?: boolean }): Promise<boolean>;
  deleteSliderImage(id: string): Promise<boolean>;
  
  // WhatsApp settings operations
  getWhatsAppSettings(): Promise<WhatsAppSettings | undefined>;
  updateWhatsAppSettings(settings: Partial<InsertWhatsAppSettings>): Promise<WhatsAppSettings | undefined>;
  
  // Contact settings operations
  getContactSettings(): Promise<ContactSettings | undefined>;
  updateContactSettings(settings: Partial<InsertContactSettings>): Promise<ContactSettings | undefined>;
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private properties: Property[] = [];
  private propertyImages: PropertyImage[] = [];
  private sliderImages: { id: number; imageUrl: string; title: string; description: string; isActive: boolean }[] = [];
  private whatsappSettings: WhatsAppSettings | null = null;
  private contactSettings: ContactSettings | null = null;
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
  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(user => String(user.id) === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const newUser = {
      id: this.nextUserId++,
      ...insertUser,
      isAdmin: insertUser.isAdmin ?? false,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return {
      ...newUser,
      id: String(newUser.id)
    };
  }

  // Property operations
  async getAllProperties(): Promise<Property[]> {
    return this.properties
      .filter(property => property.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getProperty(id: string): Promise<Property | undefined> {
    return this.properties.find(property => String(property.id) === id);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const now = new Date();
    const newProperty = {
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
    this.properties.push(newProperty);
    return {
      ...newProperty,
      id: String(newProperty.id)
    };
  }

  async updateProperty(id: string, updates: Partial<InsertProperty>): Promise<Property | undefined> {
    const propertyIndex = this.properties.findIndex(property => String(property.id) === id);
    if (propertyIndex === -1) return undefined;
    
    this.properties[propertyIndex] = {
      ...this.properties[propertyIndex],
      ...updates,
      updatedAt: new Date(),
    };
    
    return this.properties[propertyIndex];
  }

  async deleteProperty(id: string): Promise<boolean> {
    const propertyIndex = this.properties.findIndex(property => String(property.id) === id);
    if (propertyIndex === -1) return false;
    
    this.properties[propertyIndex] = {
      ...this.properties[propertyIndex],
      isActive: false,
    };
    
    return true;
  }

  // Property image operations
  async getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
    return this.propertyImages
      .filter(image => String(image.propertyId) === propertyId)
      .sort((a, b) => {
        if (a.isMain && !b.isMain) return -1;
        if (!a.isMain && b.isMain) return 1;
        return a.sortOrder - b.sortOrder;
      });
  }

  async createPropertyImage(insertImage: InsertPropertyImage): Promise<PropertyImage> {
    const newImage = {
      id: this.nextPropertyImageId++,
      ...insertImage,
      description: insertImage.description ?? null,
      isMain: insertImage.isMain ?? false,
      sortOrder: insertImage.sortOrder ?? 0,
      createdAt: new Date(),
    };
    this.propertyImages.push(newImage);
    return {
      ...newImage,
      id: String(newImage.id),
      propertyId: insertImage.propertyId
    };
  }

  async deletePropertyImage(id: string): Promise<boolean> {
    const imageIndex = this.propertyImages.findIndex(image => String(image.id) === id);
    if (imageIndex === -1) return false;
    
    this.propertyImages.splice(imageIndex, 1);
    return true;
  }

  async setMainImage(propertyId: string, imageId: string): Promise<boolean> {
    // First, unset all main images for this property
    this.propertyImages.forEach(image => {
      if (String(image.propertyId) === propertyId) {
        image.isMain = false;
      }
    });
    
    // Then set the specified image as main
    const image = this.propertyImages.find(img => String(img.id) === imageId && String(img.propertyId) === propertyId);
    if (!image) return false;
    
    image.isMain = true;
    return true;
  }

  // Slider operations
  async getSliderImages() {
    return this.sliderImages.filter(img => img.isActive).map(img => ({
      ...img,
      id: String(img.id)
    }));
  }

  async createSliderImage(insertImage: { imageUrl: string; title: string; description: string }) {
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

  async updateSliderImage(id: string, updates: { imageUrl?: string; title?: string; description?: string; isActive?: boolean }) {
    const imageIndex = this.sliderImages.findIndex(img => String(img.id) === id);
    if (imageIndex === -1) return false;
    
    this.sliderImages[imageIndex] = {
      ...this.sliderImages[imageIndex],
      ...updates
    };
    return true;
  }

  async deleteSliderImage(id: string) {
    const imageIndex = this.sliderImages.findIndex(img => String(img.id) === id);
    if (imageIndex === -1) return false;
    
    this.sliderImages.splice(imageIndex, 1);
    return true;
  }

  // WhatsApp settings operations
  async getWhatsAppSettings(): Promise<WhatsAppSettings | undefined> {
    if (!this.whatsappSettings) {
      // Initialize default settings
      this.whatsappSettings = {
        id: '1',
        phoneNumber: '+251975666699',
        isActive: true,
        businessName: 'Temer Properties',
        welcomeMessage: 'Hello! Welcome to Temer Properties. How can we assist you today?',
        propertyInquiryTemplate: 'Hello! I\'m interested in this property:\n\n🏠 *{title}*\n📍 Location: {location}\n🛏️ Bedrooms: {bedrooms}\n🚿 Bathrooms: {bathrooms}\n📐 Size: {size} m²\n\nCould you please provide more information about this property? I would like to schedule a viewing or discuss the details further.\n\nThank you!',
        generalInquiryTemplate: 'Hello Temer Properties! 👋\n\nI\'m interested in learning more about your real estate services. Could you please help me with information about available properties?\n\nThank you!',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    return this.whatsappSettings;
  }

  async updateWhatsAppSettings(updates: Partial<InsertWhatsAppSettings>): Promise<WhatsAppSettings | undefined> {
    if (!this.whatsappSettings) {
      await this.getWhatsAppSettings(); // Initialize if not exists
    }
    
    if (this.whatsappSettings) {
      this.whatsappSettings = {
        ...this.whatsappSettings,
        ...updates,
        updatedAt: new Date()
      };
    }
    
    return this.whatsappSettings;
  }

  // Contact settings operations
  async getContactSettings(): Promise<ContactSettings | undefined> {
    if (!this.contactSettings) {
      // Initialize default settings
      this.contactSettings = {
        id: '1',
        phone: '+251 911 123 456',
        email: 'info@temerproperties.com',
        address: 'Bole Road, Addis Ababa, Ethiopia',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    return this.contactSettings;
  }

  async updateContactSettings(updates: Partial<InsertContactSettings>): Promise<ContactSettings | undefined> {
    if (!this.contactSettings) {
      await this.getContactSettings(); // Initialize if not exists
    }
    
    if (this.contactSettings) {
      this.contactSettings = {
        ...this.contactSettings,
        ...updates,
        updatedAt: new Date()
      };
    }
    
    return this.contactSettings;
  }
}

import { MongoStorage } from "./mongo-storage";

export const storage = new MongoStorage();