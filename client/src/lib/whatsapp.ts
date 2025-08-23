/**
 * WhatsApp integration utilities for Temer Properties
 */

interface PropertyDetails {
  title: string;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  size: number;
  price?: string;
}

interface WhatsAppSettings {
  id: string;
  phoneNumber: string;
  isActive: boolean;
  businessName: string;
  welcomeMessage: string;
  propertyInquiryTemplate: string;
  generalInquiryTemplate: string;
  createdAt: Date;
  updatedAt: Date;
}

// Cache for WhatsApp settings
let cachedSettings: WhatsAppSettings | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch WhatsApp settings from API
async function getWhatsAppSettings(): Promise<WhatsAppSettings> {
  const now = Date.now();
  
  // Return cached settings if still valid
  if (cachedSettings && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedSettings;
  }
  
  try {
    const response = await fetch('/api/whatsapp/settings');
    if (response.ok) {
      const settings = await response.json();
      cachedSettings = settings;
      lastFetchTime = now;
      return settings;
    }
  } catch (error) {
    console.error('Failed to fetch WhatsApp settings:', error);
  }
  
  // Fallback to default settings
  const fallbackSettings: WhatsAppSettings = {
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
  
  return fallbackSettings;
}

/**
 * Generate WhatsApp URL for property inquiries
 */
export async function generatePropertyWhatsAppUrl(property: PropertyDetails): Promise<string> {
  const settings = await getWhatsAppSettings();
  
  let message = settings.propertyInquiryTemplate
    .replace('{title}', property.title)
    .replace('{location}', property.location)
    .replace('{bedrooms}', String(property.bedrooms || 0))
    .replace('{bathrooms}', String(property.bathrooms || 0))
    .replace('{size}', String(property.size));
    
  if (property.price) {
    message += `\n💰 Price: ${property.price}`;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${settings.phoneNumber.replace('+', '')}?text=${encodedMessage}`;
}

/**
 * Generate WhatsApp URL for general inquiries
 */
export async function generateGeneralWhatsAppUrl(): Promise<string> {
  const settings = await getWhatsAppSettings();
  const encodedMessage = encodeURIComponent(settings.generalInquiryTemplate);
  return `https://wa.me/${settings.phoneNumber.replace('+', '')}?text=${encodedMessage}`;
}

/**
 * Open WhatsApp with property details
 */
export async function contactViaWhatsApp(property: PropertyDetails): Promise<void> {
  try {
    const url = await generatePropertyWhatsAppUrl(property);
    window.open(url, '_blank');
  } catch (error) {
    console.error('Failed to open WhatsApp:', error);
    // Fallback: show error or use default number
    alert('Unable to open WhatsApp. Please contact us directly at +251975666699');
  }
}

/**
 * Open WhatsApp for general inquiry
 */
export async function contactGeneralWhatsApp(): Promise<void> {
  try {
    const url = await generateGeneralWhatsAppUrl();
    window.open(url, '_blank');
  } catch (error) {
    console.error('Failed to open WhatsApp:', error);
    // Fallback: show error or use default number
    alert('Unable to open WhatsApp. Please contact us directly at +251975666699');
  }
}

/**
 * Clear cached settings (useful when admin updates settings)
 */
export function clearWhatsAppCache(): void {
  cachedSettings = null;
  lastFetchTime = 0;
}