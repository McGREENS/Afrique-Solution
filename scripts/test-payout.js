#!/usr/bin/env node

// Test PawaPay Payout

const PAWAPAY_API_TOKEN = 'eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjI3NDgiLCJtYXYiOiIxIiwiZXhwIjoyMDkyMjM1MTgxLCJpYXQiOjE3NzY2MTU5ODEsInBtIjoiREFGLFBBRiIsImp0aSI6IjFjZjAwZDZmLWEwNGUtNDg5Ny04ODU0LTg0ZjcyNWM3ZjZkMCJ9.zHM0XXJ4guqPCp8phmGxvEX2MbP5t7ryz60Ak94BrQIeqfhheU3mziBGUHkRpeS3JI3gpNmVaObHpkXwIutNpw';
const BASE_URL = 'https://api.pawapay.io';

// Test phone number
const TEST_PHONE = '250780115764';
const TEST_AMOUNT_USD = 1; // $1 USD

console.log('💸 Testing PawaPay Payout...\n');
console.log('Phone:', TEST_PHONE);
console.log('Amount:', TEST_AMOUNT_USD, 'USD');
console.log('');

// Detect correspondent from phone
function detectCorrespondent(phone) {
  const phoneStr = phone.replace(/[^0-9]/g, '');
  
  if (phoneStr.startsWith('250')) {
    if (phoneStr.startsWith('25078') || phoneStr.startsWith('25079')) {
      return { correspondent: 'MTN_MOMO_RWA', currency: 'RWF', country: 'Rwanda' };
    } else if (phoneStr.startsWith('25072') || phoneStr.startsWith('25073')) {
      return { correspondent: 'AIRTEL_RWA', currency: 'RWF', country: 'Rwanda' };
    }
    return { correspondent: 'MTN_MOMO_RWA', currency: 'RWF', country: 'Rwanda' };
  }
  
  return null;
}

// Generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function testPayout() {
  const paymentInfo = detectCorrespondent(TEST_PHONE);
  
  if (!paymentInfo) {
    console.log('❌ Invalid phone number');
    return;
  }
  
  console.log('📱 Detected:', paymentInfo.country, '-', paymentInfo.correspondent);
  
  // Convert USD to RWF for Rwanda
  let finalAmount = TEST_AMOUNT_USD;
  if (paymentInfo.currency === 'RWF') {
    finalAmount = Math.round(TEST_AMOUNT_USD * 1400);
    console.log('💱 Converted:', TEST_AMOUNT_USD, 'USD →', finalAmount, 'RWF');
  }
  
  const payoutId = generateUUID();
  console.log('🆔 Payout ID:', payoutId);
  console.log('');
  
  // Prepare request
  const requestBody = {
    payoutId: payoutId,
    amount: finalAmount.toString(),
    currency: paymentInfo.currency,
    correspondent: paymentInfo.correspondent,
    recipient: {
      type: 'MSISDN',
      address: {
        value: TEST_PHONE.replace(/[^0-9]/g, '')
      }
    },
    customerTimestamp: new Date().toISOString(),
    statementDescription: 'Afrique Solution'
  };
  
  console.log('📤 Request Body:');
  console.log(JSON.stringify(requestBody, null, 2));
  console.log('');
  
  try {
    console.log('🚀 Sending payout request...');
    const response = await fetch(`${BASE_URL}/payouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAWAPAY_API_TOKEN}`
      },
      body: JSON.stringify(requestBody)
    });
    
    const result = await response.json();
    
    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Body:');
    console.log(JSON.stringify(result, null, 2));
    console.log('');
    
    if (response.ok && (result.status === 'ACCEPTED' || result.status === 'SUBMITTED')) {
      console.log('✅ SUCCESS! Payout initiated');
      console.log('Status:', result.status);
      console.log('Payout ID:', result.payoutId);
      console.log('');
      console.log('💰 Check your phone', TEST_PHONE, 'for the payout!');
    } else {
      console.log('❌ FAILED');
      console.log('Error:', result.message || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

testPayout();
