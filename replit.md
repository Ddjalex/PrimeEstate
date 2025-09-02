# Overview

This is a full-stack real estate website for Temer Properties, an Ethiopian real estate company. The application is built as a single-page website featuring property listings, search functionality, company information, and a comprehensive admin dashboard for property management. It's designed to be fully responsive and mobile-optimized, targeting potential buyers looking for apartments and properties in Addis Ababa, Ethiopia.

The project serves as a modern real estate showcase with sections for property search, project listings, construction updates, blog content, contact information, and an admin portal for uploading and managing real estate images with descriptions.

## Recent Changes (September 1, 2025)
- ✅ **COMPLETE CPANEL DEPLOYMENT READY**: Full PHP/MySQL + React frontend package created
- ✅ **PRODUCTION FRONTEND BUILT**: React app optimized and configured for cPanel hosting
- ✅ **PHP BACKEND COMPLETE**: All API endpoints converted to PHP for cPanel compatibility
- ✅ **DEPLOYMENT PACKAGE**: Ready-to-upload cpanel-deployment-package.tar.gz created
- ✅ **DUAL DATABASE SUPPORT**: MongoDB for Replit development, MySQL for production cPanel hosting
- ✅ **PERSISTENT DATA STORAGE**: All property and user data now saved to cloud database: mongodb+srv://almeseged:A1l2m3e4s5@jerry.viif47d.mongodb.net/temer-properties
- ✅ **PROFESSIONAL WEBSITE ENHANCEMENT**: Created stunning homepage with dynamic image slider
- ✅ **HERO SLIDER FUNCTIONALITY**: Implemented professional image slider with auto-play, controls, and indicators
- ✅ **ADMIN SLIDER MANAGEMENT**: Added complete slider management system in admin dashboard
- ✅ **SAMPLE DATA INTEGRATION**: Pre-populated with 3 featured properties and 3 hero slider images
- ✅ **ENHANCED UI/UX**: Professional responsive design with modern animations and statistics section
- ✅ **FIXED PROPERTY CREATION**: Admin dashboard property creation now works perfectly
- ✅ Updated database schema with slider management capabilities
- ✅ Fixed API routes to handle correct ID types (numbers instead of strings)
- ✅ Default admin user automatically created (admin/admin123) with proper authentication

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with a comprehensive design system using CSS variables
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible interface elements
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and data fetching
- **Forms**: React Hook Form with Zod validation through @hookform/resolvers

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Build System**: esbuild for production bundling with platform-specific optimizations

## Data Layer
- **Storage**: In-memory storage implementation using Drizzle ORM schema definitions
- **Schema Management**: Drizzle ORM for type-safe database schema definitions
- **Validation**: Zod schemas with drizzle-zod integration for type-safe operations
- **Data Persistence**: MemStorage class providing full CRUD operations for users, properties, and property images
- **Session Storage**: Memory-based session management for development environment

## Development & Build Tools
- **Type System**: Shared TypeScript configuration across client, server, and shared modules
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)
- **CSS Processing**: PostCSS with Tailwind CSS and Autoprefixer
- **Font Loading**: Google Fonts integration (Inter font family)
- **Icon System**: Font Awesome and Lucide React icons

## Project Structure
The application follows a monorepo structure with clear separation:
- `/client` - React frontend application
- `/server` - Express.js backend API
- `/shared` - Common TypeScript types, schemas, and utilities
- `/attached_assets` - Static assets and project specifications

## Component Architecture
- Modular UI components using shadcn/ui design system
- Reusable form components with consistent validation
- Toast notifications for user feedback
- Mobile-responsive navigation and layout components
- Custom hooks for mobile detection and toast management

## Styling Strategy
- Utility-first CSS with Tailwind
- Custom CSS variables for theming (light/dark mode support)
- Temer Properties brand colors integrated into the design system
- Responsive design breakpoints for mobile optimization

# External Dependencies

## Database & Storage
- **Drizzle ORM**: Type-safe SQL toolkit and schema definitions
- **In-Memory Storage**: Fast, development-friendly storage implementation
- **Schema Validation**: Comprehensive Zod schemas for all data operations

## UI & Design System
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for modern iconography
- **Font Awesome**: Additional icon resources

## Development Tools
- **Vite**: Frontend build tool and development server
- **Replit Integration**: Development environment plugins and error handling
- **TypeScript**: Static type checking across the entire stack
- **ESBuild**: Fast JavaScript/TypeScript bundler for production

## Form & Data Management
- **React Hook Form**: Performant forms with easy validation
- **Zod**: TypeScript-first schema validation
- **TanStack Query**: Data fetching, caching, and synchronization
- **Date-fns**: Date utility library for property listing dates

## Additional Integrations
- **Google Fonts**: Typography (Inter font family)
- **Embla Carousel**: Carousel component for property image galleries
- **Class Variance Authority**: Utility for creating variant-based component APIs
- **CLSX & Tailwind Merge**: Conditional styling utilities