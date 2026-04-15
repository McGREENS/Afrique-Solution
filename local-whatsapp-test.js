#!/usr/bin/env node

// Local WhatsApp Test - Run this locally first
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('🧪 LOCAL WHATSAPP TEST');
console.log('Run this locally to test WhatsApp connection first');

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "local-test"
  })
});

client.on('qr', (qr) => {
  console.log('📱 SCAN WITH WHATSAPP BUSINESS:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ WhatsApp connected successfully!');
  console.log('Now you can deploy to Railway');
  process.exit(0);
});

client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failed:', msg);
  process.exit(1);
});

client.initialize();