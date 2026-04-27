#!/usr/bin/env node

// Check PawaPay deposit status
const depositId = '97c5256e-0f73-4808-89e6-44e09918fbf9';

async function checkDepositStatus() {
  console.log('🔍 Checking deposit status...\n');
  
  const token = 'eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjI3NDgiLCJtYXYiOiIxIiwiZXhwIjoyMDkyMjM1MTgxLCJpYXQiOjE3NzY2MTU5ODEsInBtIjoiREFGLFBBRiIsImp0aSI6IjFjZjAwZDZmLWEwNGUtNDg5Ny04ODU0LTg0ZjcyNWM3ZjZkMCJ9.zHM0XXJ4guqPCp8phmGxvEX2MbP5t7ryz60Ak94BrQIeqfhheU3mziBGUHkRpeS3JI3gpNmVaObHpkXwIutNpw';
  
  try {
    const response = await fetch(`https://api.pawapay.io/deposits/${depositId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    
    console.log('📊 Status Code:', response.status);
    console.log('\n📋 Deposit Details:\n');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.status === 'FAILED') {
      console.log('\n\n❌ FAILURE DETAILS:');
      console.log('Rejection Code:', result.rejectionReason?.rejectionCode);
      console.log('Rejection Message:', result.rejectionReason?.rejectionMessage);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkDepositStatus();
