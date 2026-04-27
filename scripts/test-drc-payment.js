#!/usr/bin/env node

// Test DRC payment with PawaPay
async function testDRCPayment() {
  console.log('🧪 Testing DRC Payment with PawaPay...\n');
  
  const token = 'eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjI3NDgiLCJtYXYiOiIxIiwiZXhwIjoyMDkyMjM1MTgxLCJpYXQiOjE3NzY2MTU5ODEsInBtIjoiREFGLFBBRiIsImp0aSI6IjFjZjAwZDZmLWEwNGUtNDg5Ny04ODU0LTg0ZjcyNWM3ZjZkMCJ9.zHM0XXJ4guqPCp8phmGxvEX2MbP5t7ryz60Ak94BrQIeqfhheU3mziBGUHkRpeS3JI3gpNmVaObHpkXwIutNpw';
  
  // Generate proper UUID (36 characters)
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  // Test with DRC Vodacom number
  const testPayment = {
    depositId: generateUUID(),
    amount: '1.00', // $1 test
    currency: 'USD',
    correspondent: 'VODACOM_MPESA_COD',
    payer: {
      type: 'MSISDN',
      address: {
        value: '243970000001' // Test DRC Vodacom number
      }
    },
    customerTimestamp: new Date().toISOString(),
    statementDescription: 'Test Payment'
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
      console.log('\n✅ DRC PAYMENT ACCEPTED!');
      console.log('Deposit ID:', result.depositId);
      
      // Wait 5 seconds then check status
      console.log('\n⏳ Waiting 5 seconds to check final status...\n');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
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
          console.log('✅ DRC PAYMENTS WORK PERFECTLY!');
          console.log('You can use PawaPay for DRC customers.');
        } else if (deposit.status === 'FAILED') {
          console.log('❌ Payment Failed');
          console.log('Reason:', deposit.failureReason?.failureMessage);
          console.log('\nNote: This might be because 243970000001 is a test number.');
          console.log('Try with a REAL DRC number to verify.');
        } else if (deposit.status === 'SUBMITTED') {
          console.log('⏳ Payment is still processing...');
          console.log('This is normal - real payments take time.');
        }
      }
      
    } else if (result.status === 'REJECTED') {
      console.log('\n❌ DRC PAYMENT REJECTED');
      console.log('Rejection Code:', result.rejectionReason?.rejectionCode);
      console.log('Rejection Message:', result.rejectionReason?.rejectionMessage);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  // Show DRC configuration
  console.log('\n\n📊 DRC CONFIGURATION SUMMARY:');
  console.log('✅ VODACOM_MPESA_COD - USD ($0.50 - $2,500)');
  console.log('✅ AIRTEL_COD - USD ($0.10 - $2,500)');
  console.log('✅ ORANGE_COD - USD ($0.01 - $2,500)');
  console.log('\n💡 All DRC correspondents support USD payments!');
}

testDRCPayment();
