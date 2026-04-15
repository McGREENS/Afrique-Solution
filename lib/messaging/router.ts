import { MessageChannel, MessagePayload, MessageResponse, ChannelProvider } from './channels';
import { WhatsAppProvider } from './whatsapp';
import { whatsappWebProvider } from './whatsapp-web-instance';

export class MessageRouter {
  private providers: Map<string, ChannelProvider> = new Map();

  constructor() {
    // Initialize WhatsApp Web provider (primary)
    try {
      if (whatsappWebProvider.isAvailable()) {
        this.providers.set('whatsapp-web', whatsappWebProvider);
      }
    } catch (error) {
      console.warn('WhatsApp Web provider not available:', error);
    }

    // Initialize WhatsApp Business API provider (fallback)
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
    // Try WhatsApp Web first (primary)
    const webProvider = this.providers.get('whatsapp-web');
    if (webProvider && webProvider.isAvailable()) {
      const result = await webProvider.send({ ...payload, channel: 'whatsapp' });
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
      error: 'No WhatsApp providers available',
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