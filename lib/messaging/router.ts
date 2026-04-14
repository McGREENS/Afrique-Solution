import { MessageChannel, MessagePayload, MessageResponse, ChannelProvider } from './channels';
import { WhatsAppProvider } from './whatsapp';
import { TwilioWhatsAppProvider } from './twilio';

export class MessageRouter {
  private providers: Map<string, ChannelProvider> = new Map();

  constructor() {
    // Initialize Twilio WhatsApp provider (Primary)
    try {
      const twilioWhatsAppProvider = new TwilioWhatsAppProvider();
      if (twilioWhatsAppProvider.isAvailable()) {
        this.providers.set('twilio-whatsapp', twilioWhatsAppProvider);
      }
    } catch (error) {
      console.warn('Twilio WhatsApp provider not available:', error);
    }

    // Initialize WhatsApp Business API provider (Fallback)
    try {
      const whatsappProvider = new WhatsAppProvider();
      if (whatsappProvider.isAvailable()) {
        this.providers.set('whatsapp-business', whatsappProvider);
      }
    } catch (error) {
      console.warn('WhatsApp Business API provider not available:', error);
    }
  }

  async send(payload: MessagePayload): Promise<MessageResponse> {
    // Try Twilio WhatsApp first
    const twilioProvider = this.providers.get('twilio-whatsapp');
    if (twilioProvider) {
      const result = await twilioProvider.send({ ...payload, channel: 'whatsapp' });
      if (result.success) {
        return result;
      }
    }

    // Fallback to WhatsApp Business API
    const businessProvider = this.providers.get('whatsapp-business');
    if (businessProvider) {
      const result = await businessProvider.send({ ...payload, channel: 'whatsapp' });
      if (result.success) {
        return result;
      }
    }

    return {
      success: false,
      error: 'No available WhatsApp providers',
      channel: 'whatsapp'
    };
  }

  getAvailableChannels(): MessageChannel[] {
    return this.providers.size > 0 ? ['whatsapp'] : [];
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

// Singleton instance
export const messageRouter = new MessageRouter();