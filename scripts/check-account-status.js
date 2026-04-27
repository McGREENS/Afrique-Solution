#!/usr/bin/env node

// Check PawaPay account status and mode
async function checkAccountStatus() {
  console.log('🔍 Checking PawaPay Account Status...\n');
  
  const token = 'eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjI3NDgiLCJtYXYiOiIxIiwiZXhwIjoyMDkyMjM1MTgxLCJpYXQiOjE3NzY2MTU5ODEsInBtIjoiREFGLFBBRiIsImp0aSI6IjFjZjAwZDZmLWEwNGUtNDg5Ny04ODU0LTg0ZjcyNWM3ZjZkMCJ9.zHM0XXJ4guqPCp8phmGxvEX2MbP5t7ryz60Ak94BrQIeqfhheU3mziBGUHkRpeS3JI3gpNmVaObHpkXwIutNpw';
  
  try {
    // Check recent deposits
    console.log('📊 Checking recent deposits...\n');
    const depositsResponse = await fetch('https://api.pawapay.io/deposits?limit=5', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const deposits = await depositsResponse.json();
    console.log('Recent Deposits:');
    console.log(JSON.stringify(deposits, null, 2));
    
    // Analyze the deposits
    if (Array.isArray(deposits) && deposits.length > 0) {
      console.log('\n\n📈 DEPOSIT ANALYSIS:\n');
      deposits.forEach((deposit, index) => {
        console.log(`${index + 1}. Deposit ID: ${deposit.depositId}`);
        console.log(`   Status: ${deposit.status}`);
        console.log(`   Amount: ${deposit.requestedAmount} ${deposit.currency}`);
        console.log(`   Correspondent: ${deposit.correspondent}`);
        console.log(`   Phone: ${deposit.payer?.address?.value}`);
        
        if (deposit.status === 'FAILED') {
          console.log(`   ❌ Failure: ${deposit.failureReason?.failureMessage}`);
          console.log(`   Code: ${deposit.failureReason?.failureCode}`);
        }
        console.log('');
      });
      
      // Check if all are failing
      const allFailed = deposits.every(d => d.status === 'FAILED');
      if (allFailed) {
        console.log('\n⚠️  WARNING: All recent deposits failed!');
        console.log('This suggests one of the following:');
        console.log('1. Account is in TEST mode (not live)');
        console.log('2. MTN integration not fully activated');
        console.log('3. Phone numbers are not valid/registered');
        console.log('4. KYC/Business verification incomplete\n');
      }
    }
    
    // Check active configurations
    console.log('\n\n🔧 Checking active configurations...\n');
    const configResponse = await fetch('https://api.pawapay.io/active-conf', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const config = await configResponse.json();
    
    // Check if MTN Rwanda is properly configured
    const rwandaConfig = config.countries?.find(c => c.country === 'RWA');
    if (rwandaConfig) {
      console.log('✅ Rwanda Configuration Found:');
      rwandaConfig.correspondents.forEach(corr => {
        console.log(`   - ${corr.correspondent} (${corr.currency})`);
        console.log(`     Owner: ${corr.ownerName}`);
        console.log(`     Min: ${corr.operationTypes[0]?.minTransactionLimit}`);
        console.log(`     Max: ${corr.operationTypes[0]?.maxTransactionLimit}`);
      });
      
      // Check if owner is PAWAPAY (test) or your business (live)
      const mtnConfig = rwandaConfig.correspondents.find(c => c.correspondent === 'MTN_MOMO_RWA');
      if (mtnConfig) {
        console.log('\n\n🔍 MTN MOMO RWANDA STATUS:');
        console.log(`Owner: ${mtnConfig.ownerName}`);
        
        if (mtnConfig.ownerName === 'PAWAPAY' || mtnConfig.ownerName === 'pawaPay') {
          console.log('\n⚠️  ISSUE IDENTIFIED:');
          console.log('MTN Mobile Money is owned by "pawaPay" (test account)');
          console.log('This means you are using PawaPay\'s test wallet, not live MTN integration.');
          console.log('\n📞 ACTION REQUIRED:');
          console.log('Contact PawaPay support to:');
          console.log('1. Complete KYC/Business verification');
          console.log('2. Activate LIVE MTN Mobile Money integration');
          console.log('3. Switch from test wallet to production wallet');
        } else {
          console.log('✅ Using production wallet');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAccountStatus();
