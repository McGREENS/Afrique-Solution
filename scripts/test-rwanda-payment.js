#!/usr/bin/env node

// Test Rwanda payment with REAL phone number
async function testRwandaPayment() {
  console.log('🧪 Testing RWANDA Payment with REAL Phone Number...\n');
  
  const token = 'eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjI3NDgiLCJtYXYiOiIxIiwiZXhwIjoyMDkyMjM1MTgxLCJpYXQiOjE3NzY2MTU5ODEsInBtIjoiREFGLFBBRiIsImp0aSI6IjFjZjAwZDZmLWEwNGUtNDg5Ny04ODU0LTg0ZjcyNWM3ZjZkMCJ9.zHM0XXJ4guqPCp8phmGxvEX2MbP5t7ryz60Ak94BrQIeqfhheU3mziBGUHkRpeS3JI3gpNmVaObHpkXwIutNpw';
  
  // Generate proper UUID
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  // Test with REAL Rwanda MTN number
  const testPayment = {
    depositId: generateUUID(),
    amount: '1400', // 1400 RWF = $1 USD
    currency: 'RWF',
    correspondent: 'MTN_MOMO_RWA',
    payer: {
      type: 'MSISDN',
      address: {
        value: '250780115764' // REAL Rwanda MTN number
      }
    },
    customerTimestamp: new Date().toISOString(),
    statementDescription: 'Afrique Solution'
  };
  
  console.log('📋 Test Payment Details:');
  console.log(JSON.stringify(testPayment, null, 2));
  console.log('\n');
  
  try {
    const response = await fetch('https://api.pawapay.io/deposits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testPayment)
    });
    
    const result = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Body:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.status === 'ACCEPTED' || result.status === 'SUBMITTED') {
      console.log('\n✅ RWANDA PAYMENT ACCEPTED!');
      console.log('Deposit ID:', result.depositId);
      console.log('\n⏰ Check your phone 250780115764 for payment prompt...');
      
      // Wait 10 seconds then check status
      console.log('\n⏳ Waiting 10 seconds to check final status...\n');
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Check status
      const statusResponse = await fetch(`https://api.pawapay.io/deposits/${result.depositId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const statusResult = await statusResponse.json();
      console.log('📊 Final Status:');
      console.log(JSON.stringify(statusResult, null, 2));
      
      if (Array.isArray(statusResult) && statusResult.length > 0) {
        const deposit = statusResult[0];
        console.log('\n\n🎯 RESULT:');
        console.log(`Status: ${deposit.status}`);
        
        if (deposit.status === 'COMPLETED') {
          console.log('\n🎉 SUCCESS! RWANDA PAYMENTS WORK 100%!');
          console.log('✅ Payment completed successfully');
          console.log('✅ You can use PawaPay for Rwanda customers');
        } else if (deposit.status === 'FAILED') {
          console.log('\n❌ Payment Failed');
          console.log('Failure Code:', deposit.failureReason?.failureCode);
          console.log('Failure Message:', deposit.failureReason?.failureMessage);
          console.log('\n⚠️  This confirms Rwanda is in TEST MODE');
          console.log('Real phones won\'t receive payment prompts');
        } else if (deposit.status === 'SUBMITTED') {
          console.log('\n⏳ Payment is still processing...');
          console.log('Check your phone 250780115764 for payment prompt');
          console.log('If no prompt arrives in 2 minutes, it confirms TEST MODE');
        }
      }
      
    } else if (result.status === 'REJECTED') {
      console.log('\n❌ RWANDA PAYMENT REJECTED');
      console.log('Rejection Code:', result.rejectionReason?.rejectionCode);
      console.log('Rejection Message:', result.rejectionReason?.rejectionMessage);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\n\n📊 RWANDA CONFIGURATION:');
  console.log('Correspondent: MTN_MOMO_RWA');
  console.log('Currency: RWF (Rwandan Francs)');
  console.log('Owner: pawaPay (TEST WALLET)');
  console.log('Status: ⚠️  Test mode - real phones won\'t receive prompts');
}

testRwandaPayment();
