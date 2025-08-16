import { 
  users, 
  properties, 
  propertyImages, 
  type User, 
  type InsertUser, 
  type Property, 
  type InsertProperty,
  type PropertyImage,
  type InsertPropertyImage
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

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
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Property operations
  async getAllProperties(): Promise<Property[]> {
    return await db
      .select()
      .from(properties)
      .where(eq(properties.isActive, true))
      .orderBy(desc(properties.createdAt));
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || undefined;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db
      .insert(properties)
      .values({
        ...property,
        updatedAt: new Date()
      })
      .returning();
    return newProperty;
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined> {
    const [updatedProperty] = await db
      .update(properties)
      .set({
        ...property,
        updatedAt: new Date()
      })
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty || undefined;
  }

  async deleteProperty(id: string): Promise<boolean> {
    const result = await db
      .update(properties)
      .set({ isActive: false })
      .where(eq(properties.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Property image operations
  async getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
    return await db
      .select()
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, propertyId))
      .orderBy(desc(propertyImages.isMain), propertyImages.sortOrder);
  }

  async createPropertyImage(image: InsertPropertyImage): Promise<PropertyImage> {
    const [newImage] = await db
      .insert(propertyImages)
      .values(image)
      .returning();
    return newImage;
  }

  async deletePropertyImage(id: string): Promise<boolean> {
    const result = await db.delete(propertyImages).where(eq(propertyImages.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async setMainImage(propertyId: string, imageId: string): Promise<boolean> {
    // First, unset all main images for this property
    await db
      .update(propertyImages)
      .set({ isMain: false })
      .where(eq(propertyImages.propertyId, propertyId));
    
    // Then set the specified image as main
    const result = await db
      .update(propertyImages)
      .set({ isMain: true })
      .where(and(eq(propertyImages.id, imageId), eq(propertyImages.propertyId, propertyId)));
    
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
