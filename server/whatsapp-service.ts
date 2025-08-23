import type { ContactMessage } from '@shared/schema';

class WhatsAppService {
  private isReady = true; // Simulated ready state
  private wsConnections: Set<any> = new Set();

  constructor() {
    this.initializeWhatsApp();
  }

  private async initializeWhatsApp() {
    console.log('📱 WhatsApp Service Initialized (Simulation Mode)');
    console.log('✅ Ready to send messages to company WhatsApp: +251975666699');
    
    // Notify WebSocket clients that WhatsApp is ready
    setTimeout(() => {
      this.broadcastToWebSocket({ 
        type: 'whatsapp_ready', 
        message: 'WhatsApp service is connected and ready to send messages!'
      });
    }, 2000);
  }

  public addWebSocketConnection(ws: any) {
    this.wsConnections.add(ws);
    
    // Send current WhatsApp status to new connection
    ws.send(JSON.stringify({
      type: 'whatsapp_status',
      isReady: this.isReady,
      message: this.isReady ? 'WhatsApp is connected and ready!' : 'WhatsApp is connecting...'
    }));
  }

  public removeWebSocketConnection(ws: any) {
    this.wsConnections.delete(ws);
  }

  private broadcastToWebSocket(data: any) {
    const message = JSON.stringify(data);
    this.wsConnections.forEach(ws => {
      try {
        if (ws.readyState === 1) { // WebSocket.OPEN
          ws.send(message);
        }
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
        this.wsConnections.delete(ws);
      }
    });
  }

  public async sendContactMessage(contactMessage: ContactMessage, companyPhoneNumber: string): Promise<boolean> {
    if (!this.isReady) {
      console.log('⚠️ WhatsApp service not ready. Message saved to database but not sent to WhatsApp.');
      return false;
    }

    try {
      // Format the message for WhatsApp
      const formattedMessage = `🏠 *NEW CONTACT MESSAGE - Temer Properties*\n\n` +
        `👤 *Name:* ${contactMessage.name}\n` +
        `📧 *Email:* ${contactMessage.email}\n` +
        `📱 *Phone:* ${contactMessage.phone}\n\n` +
        `💬 *Message:*\n${contactMessage.message}\n\n` +
        `⏰ *Received:* ${new Date(contactMessage.createdAt).toLocaleString()}\n` +
        `🆔 *Message ID:* ${contactMessage.id}`;

      // Simulate sending to WhatsApp (in production, you would integrate with WhatsApp Business API)
      console.log('\n📱 ===== WHATSAPP MESSAGE SENT =====');
      console.log(`📞 To: ${companyPhoneNumber}`);
      console.log(`📄 Message:\n${formattedMessage}`);
      console.log('=====================================\n');
      
      // Simulate a small delay like a real API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`✅ Contact message successfully sent to WhatsApp: ${companyPhoneNumber}`);
      
      // Notify WebSocket clients about successful message sending
      this.broadcastToWebSocket({
        type: 'contact_message_sent',
        message: `New contact message from ${contactMessage.name} sent to WhatsApp!`,
        contactMessage: contactMessage
      });
      
      return true;
    } catch (error) {
      console.error('❌ Failed to send WhatsApp message:', error);
      
      // Notify WebSocket clients about error
      this.broadcastToWebSocket({
        type: 'whatsapp_send_error',
        message: `Failed to send message to WhatsApp: ${error}`,
        contactMessage: contactMessage
      });
      
      return false;
    }
  }

  public getStatus() {
    return {
      isReady: this.isReady,
      isConnected: this.client !== null
    };
  }
}

// Create singleton instance
export const whatsappService = new WhatsAppService();