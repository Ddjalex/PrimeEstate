import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertPropertyImageSchema, insertUserSchema, type User } from "@shared/schema";
import * as bcrypt from "bcrypt";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Simple auth middleware for admin routes
const adminAuth = async (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const credentials = Buffer.from(authHeader.slice(6), 'base64').toString();
  const [username, password] = credentials.split(':');

  try {
    const user = await storage.getUserByUsername(username);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Property routes (public)
  app.get('/api/properties', async (req: Request, res: Response) => {
    try {
      const properties = await storage.getAllProperties();
      res.json(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({ error: 'Failed to fetch properties' });
    }
  });

  app.get('/api/properties/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid property ID' });
      }
      
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      const images = await storage.getPropertyImages(id);
      res.json({ ...property, images });
    } catch (error) {
      console.error('Error fetching property:', error);
      res.status(500).json({ error: 'Failed to fetch property' });
    }
  });

  // Admin routes (protected)
  app.post('/api/admin/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
      }

      const user = await storage.getUserByUsername(username);
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
      }

      res.json({ 
        message: 'Login successful', 
        user: { id: user.id, username: user.username, isAdmin: user.isAdmin }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  app.post('/api/admin/register', async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ error: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      res.json({ 
        message: 'Admin user created successfully', 
        user: { id: user.id, username: user.username, isAdmin: user.isAdmin }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  // Protected admin property management routes
  app.post('/api/admin/properties', adminAuth, async (req: Request, res: Response) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(propertyData);
      res.json(property);
    } catch (error) {
      console.error('Error creating property:', error);
      res.status(500).json({ error: 'Failed to create property' });
    }
  });

  app.put('/api/admin/properties/:id', adminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid property ID' });
      }
      
      const propertyData = insertPropertySchema.partial().parse(req.body);
      const property = await storage.updateProperty(id, propertyData);
      
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      res.json(property);
    } catch (error) {
      console.error('Error updating property:', error);
      res.status(500).json({ error: 'Failed to update property' });
    }
  });

  app.delete('/api/admin/properties/:id', adminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid property ID' });
      }
      
      const success = await storage.deleteProperty(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      res.json({ message: 'Property deleted successfully' });
    } catch (error) {
      console.error('Error deleting property:', error);
      res.status(500).json({ error: 'Failed to delete property' });
    }
  });

  // Property image management routes
  app.get('/api/admin/properties/:id/images', adminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid property ID' });
      }
      
      const images = await storage.getPropertyImages(id);
      res.json(images);
    } catch (error) {
      console.error('Error fetching property images:', error);
      res.status(500).json({ error: 'Failed to fetch property images' });
    }
  });

  app.post('/api/admin/properties/:id/images', adminAuth, async (req: Request, res: Response) => {
    try {
      const propertyId = parseInt(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ error: 'Invalid property ID' });
      }
      
      const imageData = insertPropertyImageSchema.parse({
        ...req.body,
        propertyId
      });
      
      const image = await storage.createPropertyImage(imageData);
      res.json(image);
    } catch (error) {
      console.error('Error adding property image:', error);
      res.status(500).json({ error: 'Failed to add property image' });
    }
  });

  app.delete('/api/admin/images/:id', adminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid image ID' });
      }
      
      const success = await storage.deletePropertyImage(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Image not found' });
      }
      
      res.json({ message: 'Image deleted successfully' });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ error: 'Failed to delete image' });
    }
  });

  app.put('/api/admin/images/:id/main', adminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { propertyId } = req.body;
      
      if (isNaN(id) || isNaN(propertyId)) {
        return res.status(400).json({ error: 'Invalid image or property ID' });
      }
      
      const success = await storage.setMainImage(propertyId, id);
      
      if (!success) {
        return res.status(404).json({ error: 'Image not found' });
      }
      
      res.json({ message: 'Main image updated successfully' });
    } catch (error) {
      console.error('Error setting main image:', error);
      res.status(500).json({ error: 'Failed to set main image' });
    }
  });

  // Slider routes
  app.get('/api/slider', async (req: Request, res: Response) => {
    try {
      const images = await storage.getSliderImages();
      res.json(images);
    } catch (error) {
      console.error('Error fetching slider images:', error);
      res.status(500).json({ error: 'Failed to fetch slider images' });
    }
  });

  app.post('/api/admin/slider', adminAuth, async (req: Request, res: Response) => {
    try {
      const { imageUrl, title, description } = req.body;
      
      if (!imageUrl || !title) {
        return res.status(400).json({ error: 'Image URL and title are required' });
      }
      
      const image = await storage.createSliderImage({ imageUrl, title, description: description || '' });
      res.json(image);
    } catch (error) {
      console.error('Error creating slider image:', error);
      res.status(500).json({ error: 'Failed to create slider image' });
    }
  });

  app.put('/api/admin/slider/:id', adminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid slider image ID' });
      }
      
      const success = await storage.updateSliderImage(id, req.body);
      
      if (!success) {
        return res.status(404).json({ error: 'Slider image not found' });
      }
      
      res.json({ message: 'Slider image updated successfully' });
    } catch (error) {
      console.error('Error updating slider image:', error);
      res.status(500).json({ error: 'Failed to update slider image' });
    }
  });

  app.delete('/api/admin/slider/:id', adminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid slider image ID' });
      }
      
      const success = await storage.deleteSliderImage(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Slider image not found' });
      }
      
      res.json({ message: 'Slider image deleted successfully' });
    } catch (error) {
      console.error('Error deleting slider image:', error);
      res.status(500).json({ error: 'Failed to delete slider image' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
