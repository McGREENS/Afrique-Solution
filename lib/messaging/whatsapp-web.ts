import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import { ChannelProvider, MessagePayload, MessageResponse } from './channels';

export class WhatsAppWebProvider implements ChannelProvider {
  private client: Client;
  private isReady: boolean = false;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: "afrique-solution"
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.on('qr', (qr) => {
      console.log('🔗 WhatsApp QR Code generated. Scan with WhatsApp Business App:');
      console.log(qr);
      
      // Also save QR to file for easy access
      const qrcode = require('qrcode-terminal');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('✅ WhatsApp Web Client is ready!');
      this.isReady = true;
    });

    this.client.on('authenticated', () => {
      console.log('🔐 WhatsApp Web Client authenticated');
    });

    this.client.on('auth_failure', (msg) => {
      console.error('❌ WhatsApp authentication failed:', msg);
    });

    this.client.on('disconnected', (reason) => {
      console.log('📱 WhatsApp Client disconnected:', reason);
      this.isReady = false;
    });

    // Handle incoming messages
    this.client.on('message', async (message) => {
      try {
        // Only process messages sent TO us (not from us)
        if (message.fromMe) return;

        const phone = message.from.replace('@c.us', '');
        const text = message.body;

        console.log(`📨 Received message from ${phone}: ${text}`);

        // Forward to your existing webhook logic
        await this.processIncomingMessage(phone, text, message.id.id);
      } catch (error) {
        console.error('Error processing incoming message:', error);
      }
    });
  }

  async initialize() {
    console.log('🚀 Initializing WhatsApp Web Client...');
    await this.client.initialize();
  }

  async send(payload: MessagePayload): Promise<MessageResponse> {
    try {
      if (!this.isReady) {
        return {
          success: false,
          error: 'WhatsApp client not ready',
          channel: 'whatsapp'
        };
      }

      // Format phone number for WhatsApp
      const chatId = payload.to.replace(/\D/g, '') + '@c.us';
      
      await this.client.sendMessage(chatId, payload.message);
      
      return {
        success: true,
        channel: 'whatsapp',
        messageId: `wa-${Date.now()}`
      };
    } catch (error) {
      console.error('WhatsApp Web send error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'WhatsApp Web send failed',
        channel: 'whatsapp'
      };
    }
  }

  async sendButtons(to: string, text: string, buttons: { id: string; title: string }[]) {
    try {
      if (!this.isReady) return false;

      const chatId = to.replace(/\D/g, '') + '@c.us';
      
      // WhatsApp Web doesn't support interactive buttons, so send as text with options
      let message = text + '\n\n';
      buttons.forEach((btn, index) => {
        message += `${index + 1}. ${btn.title}\n`;
      });
      message += '\nReply with the number of your choice.';

      await this.client.sendMessage(chatId, message);
      return true;
    } catch (error) {
      console.error('WhatsApp Web sendButtons error:', error);
      return false;
    }
  }

  async sendList(to: string, text: string, buttonText: string, sections: any[]) {
    try {
      if (!this.isReady) return false;

      const chatId = to.replace(/\D/g, '') + '@c.us';
      
      // Convert list to text format
      let message = text + '\n\n';
      let optionNumber = 1;
      
      sections.forEach(section => {
        message += `*${section.title}*\n`;
        section.rows.forEach((row: any) => {
          message += `${optionNumber}. ${row.title}`;
          if (row.description) message += ` - ${row.description}`;
          message += '\n';
          optionNumber++;
        });
        message += '\n';
      });
      
      message += 'Reply with the number of your choice.';

      await this.client.sendMessage(chatId, message);
      return true;
    } catch (error) {
      console.error('WhatsApp Web sendList error:', error);
      return false;
    }
  }

  private async processIncomingMessage(phone: string, text: string, messageId: string) {
    try {
      console.log(`🔄 Processing message from ${phone}: ${text}`);
      
      // Import required functions
      const { getUser, upsertUser, isMessageProcessed, markMessageProcessed } = await import('@/lib/db/queries');
      const { processMessage } = await import('@/lib/flow/engine');
      const { t } = await import('@/lib/whatsapp/messages');

      // Deduplicate
      if (await isMessageProcessed(messageId)) {
        console.log('📋 Message already processed, skipping');
        return;
      }
      await markMessageProcessed(messageId);

      let session = await getUser(phone);

      if (!session) {
        console.log('👤 New user, creating session');
        await upsertUser({ phone, language: "fr", step: "choose_language" });
        session = await getUser(phone);
        
        // Send welcome message
        await this.sendButtons(phone, t("welcome", "fr"), [
          { id: "en", title: "English" },
          { id: "fr", title: "Français" },
        ]);
        console.log('✅ Welcome message sent');
        return;
      }

      // Allow user to restart
      if (text.toLowerCase() === "menu" || text.toLowerCase() === "restart") {
        await upsertUser({ phone, step: "choose_language" });
        await this.sendButtons(phone, t("welcome", session.language ?? "fr"), [
          { id: "en", title: "English" },
          { id: "fr", title: "Français" },
        ]);
        console.log('🔄 User restarted conversation');
        return;
      }

      // Process message through flow engine
      console.log('⚙️ Processing through flow engine');
      await processMessage(session, text);
      console.log('✅ Message processed successfully');
      
    } catch (error) {
      console.error('❌ Error processing message:', error);
    }
  }

  isAvailable(): boolean {
    return this.isReady;
  }

  async destroy() {
    await this.client.destroy();
  }
}