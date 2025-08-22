import { pgTable, text, integer, boolean, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Properties table
export const properties = pgTable("properties", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Property Images table
export const propertyImages = pgTable("property_images", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  isMain: boolean("is_main").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPropertyImageSchema = createInsertSchema(propertyImages).omit({
  id: true,
  createdAt: true,
});

// Types - Override ID types to use string for MongoDB compatibility
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = Omit<typeof users.$inferSelect, 'id'> & { id: string };
export type Property = Omit<typeof properties.$inferSelect, 'id'> & { id: string };
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type PropertyImage = Omit<typeof propertyImages.$inferSelect, 'id' | 'propertyId'> & { id: string; propertyId: string };
export type InsertPropertyImage = Omit<z.infer<typeof insertPropertyImageSchema>, 'propertyId'> & { propertyId: string };