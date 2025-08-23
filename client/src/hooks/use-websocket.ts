import { useEffect, useState, useRef } from 'react';
import { useToast } from './use-toast';

interface WebSocketMessage {
  type: string;
  message: string;
  timestamp?: string;
  contactMessage?: any;
  qr?: string;
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [whatsappStatus, setWhatsappStatus] = useState<{
    isReady: boolean;
    message: string;
  }>({ isReady: false, message: 'Connecting...' });
  
  const wsRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('🔌 WebSocket connected');
        setIsConnected(true);
        
        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', data);

          switch (data.type) {
            case 'connection_established':
              toast({
                title: "Connected",
                description: "Real-time notifications are now active",
              });
              break;

            case 'contact_message_sent':
              toast({
                title: "WhatsApp Message Sent!",
                description: `Contact message from ${data.contactMessage?.name} was sent to your WhatsApp`,
              });
              break;

            case 'whatsapp_ready':
              setWhatsappStatus({ isReady: true, message: data.message });
              toast({
                title: "WhatsApp Connected",
                description: "Your WhatsApp is now connected and ready to receive messages!",
              });
              break;

            case 'whatsapp_qr':
              setWhatsappStatus({ isReady: false, message: data.message });
              toast({
                title: "WhatsApp Setup Required",
                description: "Please scan the QR code in your server console to connect WhatsApp",
                variant: "default",
              });
              break;

            case 'whatsapp_error':
            case 'whatsapp_send_error':
              toast({
                title: "WhatsApp Error",
                description: data.message,
                variant: "destructive",
              });
              break;

            case 'whatsapp_disconnected':
              setWhatsappStatus({ isReady: false, message: data.message });
              toast({
                title: "WhatsApp Disconnected",
                description: "WhatsApp connection lost. Attempting to reconnect...",
                variant: "destructive",
              });
              break;

            case 'whatsapp_status':
              setWhatsappStatus({ 
                isReady: data.isReady || false, 
                message: data.message || 'Status unknown' 
              });
              break;

            default:
              console.log('Unknown WebSocket message type:', data.type);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        
        // Attempt to reconnect after 3 seconds
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('🔄 Attempting to reconnect WebSocket...');
            connect();
          }, 3000);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return {
    isConnected,
    whatsappStatus,
    sendMessage
  };
}