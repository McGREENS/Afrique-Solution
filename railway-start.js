#!/usr/bin/env node

// Railway WhatsApp Bot Startup Script
const { spawn } = require('child_process');

console.log('🚀 Starting Railway WhatsApp Bot...');

// Start the WhatsApp Web bot
const bot = spawn('node', ['scripts/professional-bot.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production'
  }
});

bot.on('close', (code) => {
  console.log(`Bot process exited with code ${code}`);
  if (code !== 0) {
    console.log('Restarting bot in 5 seconds...');
    setTimeout(() => {
      // Restart the bot
      require('./railway-start.js');
    }, 5000);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  bot.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  bot.kill('SIGINT');
});