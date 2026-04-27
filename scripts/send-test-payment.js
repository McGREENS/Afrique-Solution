#!/usr/bin/env node

// Send test payment to 250780115764 - USER WILL APPROVE THIS ONE
async function sendTestPayment() {
  console.log('🧪 SENDING TEST PAYMENT TO 250780115764\n');
  console.log('⚠️  IMPORTANT: APPROVE THIS PAYMENT ON YOUR PHONE!\n');
  console.log('=' .repeat(60));
  
  const token = 'eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjI3NDgiLCJtYXYiOiIxIiwiZXhwIjoyMDkyMjM1MTgxLCJpYXQiOjE3NzY2MTU5ODEsInBtIjoiREFGLFBBRiIsImp0aSI6IjFjZjAwZDZmLWEwNGUtNDg5Ny04ODU0LTg0ZjcyNWM3ZjZkMCJ9.zHM0XXJ4guqPCp8phmGxvEX2MbP5t7ryz60Ak94BrQIeqfhheU3mziBGUHkRpeS3JI3gpNmVaObHpkXwIutNpw';
  
  // Generate proper UUID
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  const depositId = generateUUID();
  
  const testPayment = {
    depositId: depositId,
    amount: '1400', // 1400 RWF = $1 USD
    currency: 'RWF',
    correspondent: 'MTN_MOMO_RWA',
    payer: {
      type: 'MSISDN',
      address: {
        value: '250780115764'
      }
    },
    customerTimestamp: new Date().toISOString(),
    statementDescription: 'Afrique Solution'
  };
  
  console.log('\n📋 Payment Details:');
  console.log(`Amount: 1,400 RWF ($1 USD)`);
  console.log(`Phone: 250780115764`);
  console.log(`Deposit ID: ${depositId}`);
  console.log(`Time: ${new Date().toLocaleString()}`);
  console.log('\n');
  
  try {
    console.log('📤 Sending payment request to PawaPay...\n');
    
    const response = await fetch('https://api.pawapay.io/deposits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testPayment)
    });
    
    const result = await response.json();
    
    console.log('📊 PawaPay Response:');
    console.log(JSON.stringify(result, null, 2));
    console.log('\n');
    
    if (result.status === 'ACCEPTED' || result.status === 'SUBMITTED') {
      console.log('✅ PAYMENT REQUEST SENT SUCCESSFULLY!\n');
      console.log('=' .repeat(60));
      console.log('📱 CHECK YOUR PHONE 250780115764 NOW!');
      console.log('=' .repeat(60));
      console.log('\n');
      console.log('You should receive:');
      console.log('- MTN Mobile Money notification');
      console.log('- USSD prompt to approve 1,400 RWF');
      console.log('\n');
      console.log('⚠️  PLEASE APPROVE THE PAYMENT!\n');
      console.log('Waiting 30 seconds for you to approve...\n');
      
      // Wait 30 seconds
      for (let i = 30; i > 0; i--) {
        process.stdout.write(`\r⏳ ${i} seconds remaining... (Approve the payment on your phone now!)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      console.log('\n\n📊 Checking payment status...\n');
      
      // Check status
      const statusResponse = await fetch(`https://api.pawapay.io/deposits/${depositId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const statusResult = await statusResponse.json();
      
      console.log('📋 Payment Status:');
      console.log(JSON.stringify(statusResult, null, 2));
      console.log('\n');
      
      if (Array.isArray(statusResult) && statusResult.length > 0) {
        const deposit = statusResult[0];
        
        console.log('=' .repeat(60));
        console.log('🎯 FINAL RESULT:');
        console.log('=' .repeat(60));
        console.log(`\nStatus: ${deposit.status}\n`);
        
        if (deposit.status === 'COMPLETED') {
          console.log('🎉🎉🎉 SUCCESS! 🎉🎉🎉\n');
          console.log('✅ Payment was APPROVED and COMPLETED!');
          console.log('✅ PawaPay integration works 100%!');
          console.log('✅ The issue is only the phone whitelist.\n');
          console.log('📞 Next Step: Contact PawaPay to remove whitelist');
          console.log('   and enable ALL Rwanda/DRC numbers.\n');
        } else if (deposit.status === 'FAILED') {
          console.log('❌ Payment FAILED\n');
          console.log(`Reason: ${deposit.failureReason?.failureMessage}`);
          console.log(`Code: ${deposit.failureReason?.failureCode}\n`);
          console.log('Possible reasons:');
          console.log('- Payment was not approved in time');
          console.log('- Insufficient balance');
          console.log('- Network timeout\n');
        } else if (deposit.status === 'SUBMITTED') {
          console.log('⏳ Payment still PROCESSING\n');
          console.log('This means:');
          console.log('- Payment request was sent to MTN');
          console.log('- Waiting for user approval');
          console.log('- May take a few more minutes\n');
          console.log('Check your dashboard in 2-3 minutes.');
        }
        
        console.log('\n📊 Check Dashboard:');
        console.log('https://dashboard.pawapay.io/#/transactions/deposits');
        console.log(`Look for Deposit ID: ${depositId}\n`);
      }
      
    } else if (result.status === 'REJECTED') {
      console.log('❌ PAYMENT REJECTED\n');
      console.log(`Rejection Code: ${result.rejectionReason?.rejectionCode}`);
      console.log(`Rejection Message: ${result.rejectionReason?.rejectionMessage}\n`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

sendTestPayment();
