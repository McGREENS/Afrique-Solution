#!/usr/bin/env node

// SerdiPay API Testing Script

const API_ID = 'APIJVFVPHT';
const MERCHANT_CODE = '415826';
const USERNAME = 'christiankikuba11@gmail.com';
const PASSWORD = '$2y$12$5lAPZNULAhkMVfJJvPpmDuQFDINoAWFhnzcKAdNVlYp6PXfKS9Of.';
const PIN = '1234';

// Staging URLs (Testing)
const TOKEN_URL = 'https://api.serdipay.cloud/api/public-api/v1/merchant/get-token';
const C2B_URL = 'https://api.serdipay.cloud/api/public-api/v1/merchant/payment-merchant';

console.log('🔥 Testing SerdiPay API...\n');

// Test 1: Get Token
async function getToken() {
  console.log('📡 Step 1: Getting authentication token...');
  console.log('URL:', TOKEN_URL);
  
  // Try different possible request formats
  const attempts = [
    // Attempt 1: API_ID only
    {
      name: 'API_ID only',
      body: { api_id: API_ID }
    },
    // Attempt 2: API_ID + Merchant Code
    {
      name: 'API_ID + Merchant Code',
      body: { 
        api_id: API_ID,
        merchant_code: MERCHANT_CODE
      }
    },
    // Attempt 3: Full credentials
    {
      name: 'Full credentials',
      body: {
        api_id: API_ID,
        merchant_code: MERCHANT_CODE,
        username: USERNAME,
        password: PASSWORD
      }
    },
    // Attempt 4: With PIN
    {
      name: 'With PIN',
      body: {
        api_id: API_ID,
        merchant_code: MERCHANT_CODE,
        pin: PIN
      }
    }
  ];
  
  for (const attempt of attempts) {
    console.log(`\n🔄 Trying: ${attempt.name}`);
    console.log('Request body:', JSON.stringify(attempt.body, null, 2));
    
    try {
      const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(attempt.body)
      });
      
      const result = await response.json();
      console.log('Status:', response.status);
      console.log('Response:', JSON.stringify(result, null, 2));
      
      if (response.ok && result.token) {
        console.log('\n✅ SUCCESS! Token obtained:', result.token);
        return result.token;
      }
      
      if (response.ok) {
        console.log('\n✅ Request successful but checking response structure...');
        return result;
      }
      
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }
  
  console.log('\n⚠️ All token attempts failed. Need to contact SerdiPay for correct format.');
  return null;
}

// Test 2: Make C2B Payment (once we have token)
async function testC2BPayment(token) {
  console.log('\n\n📡 Step 2: Testing C2B Payment...');
  console.log('URL:', C2B_URL);
  
  // Try different possible payment request formats
  const attempts = [
    // Attempt 1: Basic format
    {
      name: 'Basic format',
      body: {
        merchant_code: MERCHANT_CODE,
        phone: '243978993445',
        amount: 5,
        reference: 'TEST-' + Date.now(),
        description: 'Test payment'
      }
    },
    // Attempt 2: With currency
    {
      name: 'With currency',
      body: {
        merchant_code: MERCHANT_CODE,
        phone: '243978993445',
        amount: 5,
        currency: 'USD',
        reference: 'TEST-' + Date.now(),
        description: 'Test payment'
      }
    },
    // Attempt 3: Different phone format
    {
      name: 'Different phone format',
      body: {
        merchant_code: MERCHANT_CODE,
        msisdn: '243978993445',
        amount: 5,
        order_id: 'TEST-' + Date.now(),
        description: 'Test payment'
      }
    }
  ];
  
  for (const attempt of attempts) {
    console.log(`\n🔄 Trying: ${attempt.name}`);
    console.log('Request body:', JSON.stringify(attempt.body, null, 2));
    
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      // Add token if we have it
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(C2B_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(attempt.body)
      });
      
      const result = await response.json();
      console.log('Status:', response.status);
      console.log('Response:', JSON.stringify(result, null, 2));
      
      if (response.ok) {
        console.log('\n✅ Payment request format accepted!');
        return result;
      }
      
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }
  
  console.log('\n⚠️ All payment attempts failed. Need to contact SerdiPay for correct format.');
  return null;
}

// Run tests
async function runTests() {
  console.log('========================================');
  console.log('SerdiPay API Integration Test');
  console.log('========================================\n');
  
  console.log('Credentials:');
  console.log('- API_ID:', API_ID);
  console.log('- Merchant Code:', MERCHANT_CODE);
  console.log('- Username:', USERNAME);
  console.log('\n');
  
  // Step 1: Get token
  const token = await getToken();
  
  // Step 2: Test payment (even without token, to see error messages)
  await testC2BPayment(token);
  
  console.log('\n========================================');
  console.log('Test Complete');
  console.log('========================================\n');
}

runTests();
