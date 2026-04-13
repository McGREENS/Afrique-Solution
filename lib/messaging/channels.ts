export type MessageChannel = 'whatsapp' | 'sms' | 'voice';

export interface MessagePayload {
  to: string;
  message: string;
  channel?: MessageChannel;
  mediaUrl?: string;
}

export interface MessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  channel: MessageChannel;
}

export interface ChannelProvider {
  send(payload: MessagePayload): Promise<MessageResponse>;
  isAvailable(): boolean;
}

// User session types
export interface User {
  id?: number;
  phone: string;
  language?: string;
  step?: string;
  created_at?: string;
  updated_at?: string;
}

// Payment types
export interface PaymentRequest {
  amount: string;
  currency: string;
  correspondent: string;
  payer: {
    type: string;
    address: {
      value: string;
    };
  };
  customerTimestamp: string;
  statementDescription: string;
}

// Service types
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}