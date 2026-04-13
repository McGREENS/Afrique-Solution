import { ChannelProvider, MessagePayload, MessageResponse } from './channels';
import { sendText } from '../whatsapp/sender';

export class WhatsAppProvider implements ChannelProvider {
  async send(payload: MessagePayload): Promise<MessageResponse> {
    try {
      await sendText(payload.to, payload.message);
      return {
        success: true,
        channel: 'whatsapp'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'WhatsApp send failed',
        channel: 'whatsapp'
      };
    }
  }

  isAvailable(): boolean {
    return !!(process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_TOKEN);
  }
}