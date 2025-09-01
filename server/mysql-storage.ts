import { Pool } from 'mysql2/promise';
import {
  User,
  Property,
  PropertyImage,
  SliderImage,
  WhatsAppSettings,
  ContactSettings,
  ContactMessage,
  InsertUser,
  InsertProperty,
  InsertPropertyImage,
  InsertSliderImage,
  InsertWhatsAppSettings,
  InsertContactSettings,
  InsertContactMessage,
} from "@shared/schema";
import { IStorage } from "./storage";

export class MySQLStorage implements IStorage {
  constructor(private pool: Pool) {}

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
      const users = rows as any[];
      return users.length > 0 ? this.convertUser(users[0]) : undefined;
    } finally {
      connection.release();
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
      const users = rows as any[];
      return users.length > 0 ? this.convertUser(users[0]) : undefined;
    } finally {
      connection.release();
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)',
        [insertUser.username, insertUser.password, insertUser.isAdmin ?? false]
      );
      
      const insertId = (result as any).insertId;
      const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [insertId]);
      const users = rows as any[];
      return this.convertUser(users[0]);
    } finally {
      connection.release();
    }
  }

  // Property operations
  async getAllProperties(): Promise<Property[]> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM properties WHERE isActive = TRUE ORDER BY createdAt DESC'
      );
      const properties = rows as any[];
      return properties.map(p => this.convertProperty(p));
    } finally {
      connection.release();
    }
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM properties WHERE id = ?', [id]);
      const properties = rows as any[];
      return properties.length > 0 ? this.convertProperty(properties[0]) : undefined;
    } finally {
      connection.release();
    }
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.execute(
        `INSERT INTO properties (title, description, location, propertyType, bedrooms, bathrooms, size, status, imageUrls, isActive) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          insertProperty.title,
          insertProperty.description,
          insertProperty.location,
          insertProperty.propertyType,
          insertProperty.bedrooms ?? 0,
          insertProperty.bathrooms ?? 0,
          insertProperty.size,
          JSON.stringify(insertProperty.status ?? ['For Sale']),
          JSON.stringify(insertProperty.imageUrls ?? []),
          insertProperty.isActive ?? true
        ]
      );
      
      const insertId = (result as any).insertId;
      const [rows] = await connection.execute('SELECT * FROM properties WHERE id = ?', [insertId]);
      const properties = rows as any[];
      return this.convertProperty(properties[0]);
    } finally {
      connection.release();
    }
  }

  async updateProperty(id: string, updates: Partial<InsertProperty>): Promise<Property | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const setParts: string[] = [];
      const values: any[] = [];

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'status' || key === 'imageUrls') {
            setParts.push(`${key} = ?`);
            values.push(JSON.stringify(value));
          } else {
            setParts.push(`${key} = ?`);
            values.push(value);
          }
        }
      });

      if (setParts.length === 0) return undefined;

      values.push(id);
      await connection.execute(
        `UPDATE properties SET ${setParts.join(', ')} WHERE id = ?`,
        values
      );

      const [rows] = await connection.execute('SELECT * FROM properties WHERE id = ?', [id]);
      const properties = rows as any[];
      return properties.length > 0 ? this.convertProperty(properties[0]) : undefined;
    } finally {
      connection.release();
    }
  }

  async deleteProperty(id: string): Promise<boolean> {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.execute('DELETE FROM properties WHERE id = ?', [id]);
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  // Property Image operations
  async getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM property_images WHERE propertyId = ? ORDER BY sortOrder, createdAt',
        [propertyId]
      );
      const images = rows as any[];
      return images.map(img => this.convertPropertyImage(img));
    } finally {
      connection.release();
    }
  }

  async createPropertyImage(insertImage: InsertPropertyImage): Promise<PropertyImage> {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO property_images (propertyId, imageUrl, description, isMain, sortOrder) VALUES (?, ?, ?, ?, ?)',
        [
          insertImage.propertyId,
          insertImage.imageUrl,
          insertImage.description || null,
          insertImage.isMain ?? false,
          insertImage.sortOrder ?? 0
        ]
      );
      
      const insertId = (result as any).insertId;
      const [rows] = await connection.execute('SELECT * FROM property_images WHERE id = ?', [insertId]);
      const images = rows as any[];
      return this.convertPropertyImage(images[0]);
    } finally {
      connection.release();
    }
  }

  async deletePropertyImage(id: string): Promise<boolean> {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.execute('DELETE FROM property_images WHERE id = ?', [id]);
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  async setMainImage(propertyId: string, imageId: string): Promise<boolean> {
    const connection = await this.pool.getConnection();
    try {
      // First, set all images for this property to not main
      await connection.execute('UPDATE property_images SET isMain = FALSE WHERE propertyId = ?', [propertyId]);
      
      // Then set the specified image as main
      const [result] = await connection.execute('UPDATE property_images SET isMain = TRUE WHERE id = ? AND propertyId = ?', [imageId, propertyId]);
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  // Slider Image operations
  async getSliderImages(): Promise<{ id: string; imageUrl: string; title: string; description: string; isActive: boolean }[]> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM slider_images WHERE isActive = TRUE ORDER BY createdAt DESC'
      );
      const images = rows as any[];
      return images.map(img => this.convertSliderImageResponse(img));
    } finally {
      connection.release();
    }
  }

  async createSliderImage(image: { imageUrl: string; title: string; description: string }): Promise<{ id: string; imageUrl: string; title: string; description: string; isActive: boolean }> {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO slider_images (imageUrl, title, description, isActive) VALUES (?, ?, ?, ?)',
        [
          image.imageUrl,
          image.title,
          image.description,
          true
        ]
      );
      
      const insertId = (result as any).insertId;
      const [rows] = await connection.execute('SELECT * FROM slider_images WHERE id = ?', [insertId]);
      const images = rows as any[];
      return this.convertSliderImageResponse(images[0]);
    } finally {
      connection.release();
    }
  }

  async deleteSliderImage(id: string): Promise<boolean> {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.execute('DELETE FROM slider_images WHERE id = ?', [id]);
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  async updateSliderImage(id: string, image: { imageUrl?: string; title?: string; description?: string; isActive?: boolean }): Promise<boolean> {
    const connection = await this.pool.getConnection();
    try {
      const setParts: string[] = [];
      const values: any[] = [];

      Object.entries(image).forEach(([key, value]) => {
        if (value !== undefined) {
          setParts.push(`${key} = ?`);
          values.push(value);
        }
      });

      if (setParts.length === 0) return false;

      values.push(id);
      const [result] = await connection.execute(
        `UPDATE slider_images SET ${setParts.join(', ')} WHERE id = ?`,
        values
      );
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  // WhatsApp Settings operations
  async getWhatsAppSettings(): Promise<WhatsAppSettings | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM whatsapp_settings ORDER BY id DESC LIMIT 1');
      const settings = rows as any[];
      return settings.length > 0 ? this.convertWhatsAppSettings(settings[0]) : undefined;
    } finally {
      connection.release();
    }
  }

  async updateWhatsAppSettings(updates: Partial<InsertWhatsAppSettings>): Promise<WhatsAppSettings | undefined> {
    const connection = await this.pool.getConnection();
    try {
      // First, get existing settings or create if none exist
      let [rows] = await connection.execute('SELECT * FROM whatsapp_settings ORDER BY id DESC LIMIT 1');
      let settings = rows as any[];
      
      if (settings.length === 0) {
        // Create new settings
        const [result] = await connection.execute(
          'INSERT INTO whatsapp_settings (phoneNumber, isActive, businessName, welcomeMessage, propertyInquiryTemplate, generalInquiryTemplate) VALUES (?, ?, ?, ?, ?, ?)',
          [
            updates.phoneNumber ?? '+251975666699',
            updates.isActive ?? true,
            updates.businessName ?? 'Temer Properties',
            updates.welcomeMessage ?? 'Hello! Welcome to Temer Properties. How can we assist you today?',
            updates.propertyInquiryTemplate ?? "Hello! I'm interested in this property:\\n\\n🏠 *{title}*\\n📍 Location: {location}\\n🛏️ Bedrooms: {bedrooms}\\n🚿 Bathrooms: {bathrooms}\\n📐 Size: {size} m²\\n\\nCould you please provide more information about this property? I would like to schedule a viewing or discuss the details further.\\n\\nThank you!",
            updates.generalInquiryTemplate ?? "Hello Temer Properties! 👋\\n\\nI'm interested in learning more about your real estate services. Could you please help me with information about available properties?\\n\\nThank you!"
          ]
        );
        
        const insertId = (result as any).insertId;
        [rows] = await connection.execute('SELECT * FROM whatsapp_settings WHERE id = ?', [insertId]);
        settings = rows as any[];
      } else {
        // Update existing settings
        const setParts: string[] = [];
        const values: any[] = [];

        Object.entries(updates).forEach(([key, value]) => {
          if (value !== undefined) {
            setParts.push(`${key} = ?`);
            values.push(value);
          }
        });

        if (setParts.length > 0) {
          values.push(settings[0].id);
          await connection.execute(
            `UPDATE whatsapp_settings SET ${setParts.join(', ')} WHERE id = ?`,
            values
          );
          
          [rows] = await connection.execute('SELECT * FROM whatsapp_settings WHERE id = ?', [settings[0].id]);
          settings = rows as any[];
        }
      }
      
      return this.convertWhatsAppSettings(settings[0]);
    } finally {
      connection.release();
    }
  }

  // Contact Settings operations
  async getContactSettings(): Promise<ContactSettings | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM contact_settings ORDER BY id DESC LIMIT 1');
      const settings = rows as any[];
      return settings.length > 0 ? this.convertContactSettings(settings[0]) : undefined;
    } finally {
      connection.release();
    }
  }

  async updateContactSettings(updates: Partial<InsertContactSettings>): Promise<ContactSettings | undefined> {
    const connection = await this.pool.getConnection();
    try {
      // First, get existing settings or create if none exist
      let [rows] = await connection.execute('SELECT * FROM contact_settings ORDER BY id DESC LIMIT 1');
      let settings = rows as any[];
      
      if (settings.length === 0) {
        // Create new settings
        const [result] = await connection.execute(
          'INSERT INTO contact_settings (phone, email, address, isActive) VALUES (?, ?, ?, ?)',
          [
            updates.phone ?? '+251 911 123 456',
            updates.email ?? 'info@temerproperties.com',
            updates.address ?? 'Bole Road, Addis Ababa, Ethiopia',
            updates.isActive ?? true
          ]
        );
        
        const insertId = (result as any).insertId;
        [rows] = await connection.execute('SELECT * FROM contact_settings WHERE id = ?', [insertId]);
        settings = rows as any[];
      } else {
        // Update existing settings
        const setParts: string[] = [];
        const values: any[] = [];

        Object.entries(updates).forEach(([key, value]) => {
          if (value !== undefined) {
            setParts.push(`${key} = ?`);
            values.push(value);
          }
        });

        if (setParts.length > 0) {
          values.push(settings[0].id);
          await connection.execute(
            `UPDATE contact_settings SET ${setParts.join(', ')} WHERE id = ?`,
            values
          );
          
          [rows] = await connection.execute('SELECT * FROM contact_settings WHERE id = ?', [settings[0].id]);
          settings = rows as any[];
        }
      }
      
      return this.convertContactSettings(settings[0]);
    } finally {
      connection.release();
    }
  }

  // Contact Message operations
  async getContactMessages(): Promise<ContactMessage[]> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM contact_messages ORDER BY createdAt DESC');
      const messages = rows as any[];
      return messages.map(msg => this.convertContactMessage(msg));
    } finally {
      connection.release();
    }
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO contact_messages (name, email, phone, message, isRead) VALUES (?, ?, ?, ?, ?)',
        [
          insertMessage.name,
          insertMessage.email,
          insertMessage.phone,
          insertMessage.message,
          false
        ]
      );
      
      const insertId = (result as any).insertId;
      const [rows] = await connection.execute('SELECT * FROM contact_messages WHERE id = ?', [insertId]);
      const messages = rows as any[];
      return this.convertContactMessage(messages[0]);
    } finally {
      connection.release();
    }
  }

  async markContactMessageAsRead(id: string): Promise<boolean> {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.execute('UPDATE contact_messages SET isRead = TRUE WHERE id = ?', [id]);
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  // Helper methods to convert database rows to our types
  private convertUser(row: any): User {
    return {
      id: row.id.toString(),
      username: row.username,
      password: row.password,
      isAdmin: Boolean(row.isAdmin),
      createdAt: row.createdAt
    };
  }

  private convertProperty(row: any): Property {
    return {
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      location: row.location,
      propertyType: row.propertyType,
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      size: row.size,
      status: typeof row.status === 'string' ? JSON.parse(row.status) : row.status,
      imageUrls: typeof row.imageUrls === 'string' ? JSON.parse(row.imageUrls) : row.imageUrls,
      isActive: Boolean(row.isActive),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  private convertPropertyImage(row: any): PropertyImage {
    return {
      id: row.id.toString(),
      propertyId: row.propertyId,
      imageUrl: row.imageUrl,
      description: row.description,
      isMain: Boolean(row.isMain),
      sortOrder: row.sortOrder,
      createdAt: row.createdAt
    };
  }

  private convertSliderImage(row: any): SliderImage {
    return {
      id: row.id.toString(),
      imageUrl: row.imageUrl,
      title: row.title,
      description: row.description,
      isActive: Boolean(row.isActive),
      createdAt: row.createdAt
    };
  }

  private convertSliderImageResponse(row: any): { id: string; imageUrl: string; title: string; description: string; isActive: boolean } {
    return {
      id: row.id.toString(),
      imageUrl: row.imageUrl,
      title: row.title,
      description: row.description,
      isActive: Boolean(row.isActive)
    };
  }

  private convertWhatsAppSettings(row: any): WhatsAppSettings {
    return {
      id: row.id.toString(),
      phoneNumber: row.phoneNumber,
      isActive: Boolean(row.isActive),
      businessName: row.businessName,
      welcomeMessage: row.welcomeMessage,
      propertyInquiryTemplate: row.propertyInquiryTemplate,
      generalInquiryTemplate: row.generalInquiryTemplate,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  private convertContactSettings(row: any): ContactSettings {
    return {
      id: row.id.toString(),
      phone: row.phone,
      email: row.email,
      address: row.address,
      isActive: Boolean(row.isActive),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  private convertContactMessage(row: any): ContactMessage {
    return {
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      phone: row.phone,
      message: row.message,
      isRead: Boolean(row.isRead),
      createdAt: row.createdAt
    } as ContactMessage;
  }
}