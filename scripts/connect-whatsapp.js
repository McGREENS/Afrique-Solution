#!/usr/bin/env node

// WhatsApp Web Connection Script
// Run this to connect your WhatsApp Business App

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('🚀 Starting WhatsApp Web Connection...');
console.log('📱 Make sure you have WhatsApp Business App installed on your phone');
console.log('');

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "afrique-solution"
  }),
  puppeteer: {
    headless: false, // Show browser for first setup
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

client.on('ready', () => {
  console.log('🎉 WhatsApp Web Client is ready!');
  console.log('✅ Your business number is now connected');
  console.log('📞 Customers can message your business number directly');
  console.log('');
  console.log('🔄 You can now close this window and start your Next.js app');
  console.log('💡 Run: npm run dev');
  console.log('');
  
  // Keep the connection alive
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

// Handle incoming messages (for testing)
client.on('message', async (message) => {
  if (message.fromMe) return;
  
  const contact = await message.getContact();
  console.log(`📨 New message from ${contact.name || contact.number}: ${message.body}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('');
  console.log('🛑 Shutting down WhatsApp Web connection...');
  await client.destroy();
  process.exit(0);
});

// Initialize
client.initialize();