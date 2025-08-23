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

// WhatsApp Settings table
export const whatsappSettings = pgTable("whatsapp_settings", {
  id: serial("id").primaryKey(),
  phoneNumber: text("phone_number").notNull().default("+251975666699"),
  isActive: boolean("is_active").default(true).notNull(),
  businessName: text("business_name").default("Temer Properties").notNull(),
  welcomeMessage: text("welcome_message").default("Hello! Welcome to Temer Properties. How can we assist you today?").notNull(),
  propertyInquiryTemplate: text("property_inquiry_template").default("Hello! I'm interested in this property:\n\n🏠 *{title}*\n📍 Location: {location}\n🛏️ Bedrooms: {bedrooms}\n🚿 Bathrooms: {bathrooms}\n📐 Size: {size} m²\n\nCould you please provide more information about this property? I would like to schedule a viewing or discuss the details further.\n\nThank you!").notNull(),
  generalInquiryTemplate: text("general_inquiry_template").default("Hello Temer Properties! 👋\n\nI'm interested in learning more about your real estate services. Could you please help me with information about available properties?\n\nThank you!").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWhatsAppSettingsSchema = createInsertSchema(whatsappSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types - Override ID types to use string for MongoDB compatibility
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = Omit<typeof users.$inferSelect, 'id'> & { id: string };
export type Property = Omit<typeof properties.$inferSelect, 'id'> & { id: string };
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type PropertyImage = Omit<typeof propertyImages.$inferSelect, 'id' | 'propertyId'> & { id: string; propertyId: string };
export type InsertPropertyImage = Omit<z.infer<typeof insertPropertyImageSchema>, 'propertyId'> & { propertyId: string };
export type WhatsAppSettings = Omit<typeof whatsappSettings.$inferSelect, 'id'> & { id: string };
export type InsertWhatsAppSettings = z.infer<typeof insertWhatsAppSettingsSchema>;