import { MessageChannel, MessagePayload, MessageResponse, ChannelProvider } from './channels';
import { WhatsAppProvider } from './whatsapp';

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
  }

  async send(payload: MessagePayload): Promise<MessageResponse> {
    const provider = this.providers.get('whatsapp-business');
    if (provider) {
      return await provider.send({ ...payload, channel: 'whatsapp' });
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