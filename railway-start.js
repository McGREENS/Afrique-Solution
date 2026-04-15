#!/usr/bin/env node

// Railway WhatsApp Bot Startup Script
console.log('🚀 Starting Railway WhatsApp Bot...');
console.log('📱 Environment:', process.env.NODE_ENV);
console.log('🔗 WhatsApp Number:', process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);

// Set Chrome executable path for Railway
process.env.PUPPETEER_EXECUTABLE_PATH = '/usr/bin/google-chrome-stable';

// Import and run the professional bot directly
try {
  require('./scripts/professional-bot.js');
} catch (error) {
  console.error('❌ Failed to start WhatsApp bot:', error);
  process.exit(1);
}