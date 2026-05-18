#!/usr/bin/env node

// SerdiPay API Test - Simple Version

const API_ID = 'APIJVFVPHT';
const MERCHANT_CODE = '415826';
const PIN = '1234';

const TOKEN_URL = 'https://serdipay.com/api/public-api/v1/merchant/get-token';

console.log('🔥 Testing SerdiPay API with whitelisted credentials...\n');
console.log('Merchant Code:', MERCHANT_CODE);
console.log('API ID:', API_ID);
console.log('Whitelisted IP (from dashboard):', '216.198.79.1');
console.log('Current test IP: Will be shown in response\n');
console.log('========================================\n');

async function testSerdiPay() {
  // Test 1: Simple token request
  console.log('📡 Test 1: Getting token with API_ID + PIN');
  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        api_id: API_ID,
        merchant_code: MERCHANT_CODE,
        pin: PIN
      })
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (response.ok && result.token) {
      console.log('\n✅ SUCCESS! Token obtained:', result.token);
      return result.token;
    } else {
      console.log('\n❌ Failed to get token');
      return null;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return null;
  }
}

testSerdiPay();
