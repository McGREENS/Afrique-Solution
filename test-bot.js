#!/usr/bin/env node

// Test Bot Logic
const { getUser, upsertUser } = require('./lib/db/queries.ts');
const { processMessage } = require('./lib/flow/engine.ts');

async function testBot() {
  console.log('🧪 Testing bot logic...');
  
  const testPhone = '250789550924'; // Use the phone number from your logs
  
  try {
    // Test 1: New user
    console.log('📱 Testing new user flow...');
    let session = await getUser(testPhone);
    
    if (!session) {
      await upsertUser({ phone: testPhone, language: "fr", step: "choose_language" });
      session = await getUser(testPhone);
      console.log('✅ New user created:', session);
    }
    
    // Test 2: Process message
    console.log('💬 Testing message processing...');
    await processMessage(session, 'fr');
    
    console.log('✅ Bot logic test completed successfully!');
    
  } catch (error) {
    console.error('❌ Bot logic test failed:', error);
  }
}

testBot();