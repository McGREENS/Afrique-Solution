import { WhatsAppWebProvider } from './whatsapp-web';

// Singleton instance - but don't initialize immediately
let _whatsappWebProvider: WhatsAppWebProvider | null = null;

export function getWhatsAppWebProvider(): WhatsAppWebProvider {
  if (!_whatsappWebProvider) {
    _whatsappWebProvider = new WhatsAppWebProvider();
    // Initialize in background
    _whatsappWebProvider.initialize().catch(console.error);
  }
  return _whatsappWebProvider;
}

// Export for backward compatibility
export const whatsappWebProvider = getWhatsAppWebProvider();