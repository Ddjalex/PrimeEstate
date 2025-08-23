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

const WHATSAPP_NUMBER = '+251975666699';

/**
 * Generate WhatsApp URL for property inquiries
 */
export function generatePropertyWhatsAppUrl(property: PropertyDetails): string {
  const message = `Hello! I'm interested in this property:

🏠 *${property.title}*
📍 Location: ${property.location}
${property.bedrooms ? `🛏️ Bedrooms: ${property.bedrooms}` : ''}
${property.bathrooms ? `🚿 Bathrooms: ${property.bathrooms}` : ''}
📐 Size: ${property.size} m²
${property.price ? `💰 Price: ${property.price}` : ''}

Could you please provide more information about this property? I would like to schedule a viewing or discuss the details further.

Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodedMessage}`;
}

/**
 * Generate WhatsApp URL for general inquiries
 */
export function generateGeneralWhatsAppUrl(): string {
  const message = `Hello Temer Properties! 👋

I'm interested in learning more about your real estate services. Could you please help me with information about available properties?

Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodedMessage}`;
}

/**
 * Open WhatsApp with property details
 */
export function contactViaWhatsApp(property: PropertyDetails): void {
  const url = generatePropertyWhatsAppUrl(property);
  window.open(url, '_blank');
}

/**
 * Open WhatsApp for general inquiry
 */
export function contactGeneralWhatsApp(): void {
  const url = generateGeneralWhatsAppUrl();
  window.open(url, '_blank');
}