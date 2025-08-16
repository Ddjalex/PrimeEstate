import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

// User interface and schema
export interface IUser extends Document {
  username: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const UserModel = mongoose.model<IUser>('User', userSchema);

// Property interface and schema
export interface IProperty extends Document {
  title: string;
  description: string;
  location: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  status: string[];
  imageUrls: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  propertyType: { type: String, required: true },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  size: { type: Number, required: true },
  status: { type: [String], default: ['For Sale'] },
  imageUrls: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

propertySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const PropertyModel = mongoose.model<IProperty>('Property', propertySchema);

// Property Image interface and schema
export interface IPropertyImage extends Document {
  propertyId: string;
  imageUrl: string;
  description?: string;
  isMain: boolean;
  sortOrder: number;
  createdAt: Date;
}

const propertyImageSchema = new Schema<IPropertyImage>({
  propertyId: { type: String, required: true, ref: 'Property' },
  imageUrl: { type: String, required: true },
  description: { type: String },
  isMain: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const PropertyImageModel = mongoose.model<IPropertyImage>('PropertyImage', propertyImageSchema);

// Zod validation schemas
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
  isAdmin: z.boolean().optional().default(false)
});

export const insertPropertySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  propertyType: z.string().min(1),
  bedrooms: z.number().optional().default(0),
  bathrooms: z.number().optional().default(0),
  size: z.number().min(1),
  status: z.array(z.string()).optional().default(['For Sale']),
  imageUrls: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true)
});

export const insertPropertyImageSchema = z.object({
  propertyId: z.string().min(1),
  imageUrl: z.string().url(),
  description: z.string().optional(),
  isMain: z.boolean().optional().default(false),
  sortOrder: z.number().optional().default(0)
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = IUser;
export type Property = IProperty;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type PropertyImage = IPropertyImage;
export type InsertPropertyImage = z.infer<typeof insertPropertyImageSchema>;