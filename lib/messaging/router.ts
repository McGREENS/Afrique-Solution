import { MessageChannel, MessagePayload, MessageResponse, ChannelProvider } from './channels';
import { WhatsAppProvider } from './whatsapp';
import { TwilioWhatsAppProvider } from './twilio';

export class MessageRouter {
  private providers: Map<string, ChannelProvider> = new Map();

  constructor() {
    // Initialize WhatsApp Business API provider
    try {
      const whatsappProvider = new WhatsAppProvider();
      if (whatsappProvider.isAvailable()) {
        this.providers.set('whatsapp-business', whatsappProvider);
      }
    } catch (error) {
      console.warn('WhatsApp Business API provider not available:', error);
    }

    // Initialize Twilio WhatsApp provider
    try {
      const twilioWhatsAppProvider = new TwilioWhatsAppProvider();
      if (twilioWhatsAppProvider.isAvailable()) {
        this.providers.set('twilio-whatsapp', twilioWhatsAppProvider);
      }
    } catch (error) {
      console.warn('Twilio WhatsApp provider not available:', error);
    }
  }

  async send(payload: MessagePayload): Promise<MessageResponse> {
    const preferredProvider = this.getPreferredProvider();
    
    // Try preferred provider first
    const provider = this.providers.get(preferredProvider);
    if (provider) {
      const result = await provider.send({ ...payload, channel: 'whatsapp' });
      if (result.success) {
        return result;
      }
    }

    // Fallback to other WhatsApp provider
    for (const [providerName, fallbackProvider] of this.providers) {
      if (providerName !== preferredProvider) {
        const result = await fallbackProvider.send({ ...payload, channel: 'whatsapp' });
        if (result.success) {
          return result;
        }
      }
    }

    return {
      success: false,
      error: 'No available WhatsApp providers',
      channel: 'whatsapp'
    };
  }

  private getPreferredProvider(): string {
    // Prefer WhatsApp Business API if available, fallback to Twilio
    return this.providers.has('whatsapp-business') ? 'whatsapp-business' : 'twilio-whatsapp';
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