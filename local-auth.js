#!/usr/bin/env node

// Local Authentication for Railway Transfer
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

console.log('🔐 LOCAL AUTHENTICATION FOR RAILWAY');
console.log('This will create session files to upload to Railway');

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "afrique-solution-railway"
  })
});

client.on('qr', (qr) => {
  console.log('\n📱 SCAN THIS QR CODE:');
  qrcode.generate(qr, { small: true });
  console.log('\n✅ Scan with WhatsApp Business app');
});

client.on('authenticated', () => {
  console.log('✅ Authentication successful!');
  console.log('📁 Session files created in .wwebjs_auth folder');
});

client.on('ready', async () => {
  console.log('🎉 WhatsApp Web Client is ready!');
  console.log('📦 Session is now saved locally');
  
  // Create a simple test
  console.log('🧪 Testing bot functionality...');
  
  // Show session info
  const sessionPath = path.join(__dirname, '.wwebjs_auth');
  if (fs.existsSync(sessionPath)) {
    console.log('📁 Session files location:', sessionPath);
    console.log('📋 Files to upload to Railway:');
    
    const files = fs.readdirSync(sessionPath, { recursive: true });
    files.forEach(file => {
      console.log(`   - ${file}`);
    });
  }
  
  console.log('\n🚀 Ready for Railway deployment!');
  console.log('💡 Next: Upload session files to Railway or use Railway CLI');
  
  // Keep running for testing
  console.log('\n⏳ Bot is running... Send a message to test');
  console.log('Press Ctrl+C to stop');
});

client.on('message', async (message) => {
  if (message.fromMe) return;
  
  const contact = await message.getContact();
  console.log(`📨 Test message from ${contact.name || contact.number}: ${message.body}`);
  
  if (message.body.toLowerCase() === 'test') {
    await message.reply('✅ Bot is working! Ready for Railway deployment.');
  }
});

client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
  console.log('📱 Disconnected:', reason);
});

client.initialize();