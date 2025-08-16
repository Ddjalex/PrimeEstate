import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for admin authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Properties table for real estate listings
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  propertyType: text("property_type").notNull(), // apartment, shops
  bedrooms: integer("bedrooms").default(0),
  bathrooms: integer("bathrooms").default(0),
  size: integer("size").notNull(), // in square meters
  status: text("status").array().notNull().default(sql`ARRAY['For Sale']`),
  imageUrls: text("image_urls").array().notNull().default(sql`ARRAY[]::text[]`),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Property images table for multiple images per property
export const propertyImages = pgTable("property_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").references(() => properties.id, { onDelete: 'cascade' }).notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  isMain: boolean("is_main").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schema validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
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

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type PropertyImage = typeof propertyImages.$inferSelect;
export type InsertPropertyImage = z.infer<typeof insertPropertyImageSchema>;
