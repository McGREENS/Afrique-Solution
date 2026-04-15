#!/usr/bin/env node

// Unified WhatsApp Bot - Connection + Message Processing
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Import your bot logic (we'll need to adjust paths)
let getUser, upsertUser, isMessageProcessed, markMessageProcessed, processMessage, t;

async function loadBotLogic() {
  try {
    // These imports might need adjustment based on your build setup
    const dbQueries = await import('../lib/db/queries.js');
    const flowEngine = await import('../lib/flow/engine.js');
    const messages = await import('../lib/whatsapp/messages.js');
    
    getUser = dbQueries.getUser;
    upsertUser = dbQueries.upsertUser;
    isMessageProcessed = dbQueries.isMessageProcessed;
    markMessageProcessed = dbQueries.markMessageProcessed;
    processMessage = flowEngine.processMessage;
    t = messages.t;
    
    console.log('✅ Bot logic loaded successfully');
  } catch (error) {
    console.error('❌ Failed to load bot logic:', error);
    console.log('💡 Make sure to run "npm run build" first');
  }
}

console.log('🚀 Starting Unified WhatsApp Bot...');
console.log('📱 Make sure you have WhatsApp Business App installed on your phone');
console.log('');

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "afrique-solution"
  }),
  puppeteer: {
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  }
});

client.on('qr', (qr) => {
  console.log('📱 SCAN THIS QR CODE WITH YOUR WHATSAPP BUSINESS APP:');
  console.log('');
  qrcode.generate(qr, { small: true });
  console.log('');
  console.log('Steps:');
  console.log('1. Open WhatsApp Business App on your phone');
  console.log('2. Go to Settings > Linked Devices');
  console.log('3. Tap "Link a Device"');
  console.log('4. Scan the QR code above');
  console.log('');
});

client.on('authenticated', () => {
  console.log('✅ WhatsApp authenticated successfully!');
});

client.on('ready', async () => {
  console.log('🎉 WhatsApp Web Client is ready!');
  console.log('✅ Your business number is now connected');
  console.log('📞 Customers can message your business number directly');
  console.log('');
  
  // Load bot logic after WhatsApp is ready
  await loadBotLogic();
  
  console.log('🤖 Bot is now ready to respond to messages!');
  console.log('⏳ Keeping connection alive... (Press Ctrl+C to stop)');
});

client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failed:', msg);
  console.log('💡 Try running this script again');
});

client.on('disconnected', (reason) => {
  console.log('📱 WhatsApp disconnected:', reason);
  console.log('💡 Run this script again to reconnect');
});

// Handle incoming messages with bot logic
client.on('message', async (message) => {
  if (message.fromMe) return;
  
  try {
    const contact = await message.getContact();
    const phone = contact.number;
    const text = message.body;
    const messageId = message.id.id;
    
    console.log(`📨 New message from ${contact.name || phone}: ${text}`);
    
    // If bot logic isn't loaded yet, just log
    if (!getUser) {
      console.log('⏳ Bot logic not loaded yet, skipping message processing');
      return;
    }
    
    // Process message with bot logic
    console.log('🔄 Processing message...');
    
    // Check for duplicates
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
      const welcomeText = t("welcome", "fr") + "\\n\\n1. English\\n2. Français\\n\\nReply with the number of your choice.";
      await message.reply(welcomeText);
      console.log('✅ Welcome message sent');
      return;
    }
    
    // Handle restart
    if (text.toLowerCase() === "menu" || text.toLowerCase() === "restart") {
      await upsertUser({ phone, step: "choose_language" });
      const welcomeText = t("welcome", session.language ?? "fr") + "\\n\\n1. English\\n2. Français\\n\\nReply with the number of your choice.";
      await message.reply(welcomeText);
      console.log('🔄 User restarted conversation');
      return;
    }
    
    // Process through flow engine
    console.log('⚙️ Processing through flow engine');
    
    // For now, let's create a simple response system
    if (session.step === "choose_language") {
      if (text === "1" || text.toLowerCase().includes("english")) {
        await upsertUser({ phone, language: "en", step: "choose_service" });
        await message.reply("Great! You've selected English. Now choose a service:\\n\\n1. Canal+\\n2. DSTV\\n3. Vodacom\\n4. Airtel\\n5. Orange\\n\\nReply with the number of your choice.");
      } else if (text === "2" || text.toLowerCase().includes("français")) {
        await upsertUser({ phone, language: "fr", step: "choose_service" });
        await message.reply("Parfait! Vous avez choisi le Français. Maintenant choisissez un service:\\n\\n1. Canal+\\n2. DSTV\\n3. Vodacom\\n4. Airtel\\n5. Orange\\n\\nRépondez avec le numéro de votre choix.");
      } else {
        await message.reply("Please choose:\\n1. English\\n2. Français");
      }
    } else {
      // For other steps, use the full flow engine
      await processMessage(session, text);
    }
    
    console.log('✅ Message processed successfully');
    
  } catch (error) {
    console.error('❌ Error processing message:', error);
    try {
      await message.reply("Sorry, there was an error processing your message. Please try again or type 'menu' to restart.");
    } catch (replyError) {
      console.error('❌ Failed to send error message:', replyError);
    }
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('');
  console.log('🛑 Shutting down WhatsApp Bot...');
  await client.destroy();
  process.exit(0);
});

// Initialize
client.initialize();