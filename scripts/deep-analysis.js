#!/usr/bin/env node

// DEEP ANALYSIS of PawaPay Configuration
async function deepAnalysis() {
  console.log('🔬 DEEP ANALYSIS OF PAWAPAY ACCOUNT\n');
  console.log('=' .repeat(60));
  
  const token = 'eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjI3NDgiLCJtYXYiOiIxIiwiZXhwIjoyMDkyMjM1MTgxLCJpYXQiOjE3NzY2MTU5ODEsInBtIjoiREFGLFBBRiIsImp0aSI6IjFjZjAwZDZmLWEwNGUtNDg5Ny04ODU0LTg0ZjcyNWM3ZjZkMCJ9.zHM0XXJ4guqPCp8phmGxvEX2MbP5t7ryz60Ak94BrQIeqfhheU3mziBGUHkRpeS3JI3gpNmVaObHpkXwIutNpw';
  
  try {
    // 1. CHECK ACTIVE CONFIGURATIONS
    console.log('\n\n📋 STEP 1: ACTIVE CONFIGURATIONS\n');
    const configResponse = await fetch('https://api.pawapay.io/active-conf', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const config = await configResponse.json();
    console.log(JSON.stringify(config, null, 2));
    
    // Analyze Rwanda configuration
    const rwandaConfig = config.countries?.find(c => c.country === 'RWA');
    const drcConfig = config.countries?.find(c => c.country === 'COD');
    
    console.log('\n\n🇷🇼 RWANDA ANALYSIS:');
    if (rwandaConfig) {
      rwandaConfig.correspondents.forEach(corr => {
        console.log(`\n  Correspondent: ${corr.correspondent}`);
        console.log(`  Currency: ${corr.currency}`);
        console.log(`  Owner: ${corr.ownerName}`);
        console.log(`  Operations:`);
        corr.operationTypes.forEach(op => {
          console.log(`    - ${op.operationType}: ${op.minTransactionLimit} - ${op.maxTransactionLimit}`);
        });
      });
    }
    
    console.log('\n\n🇨🇩 DRC ANALYSIS:');
    if (drcConfig) {
      drcConfig.correspondents.forEach(corr => {
        console.log(`\n  Correspondent: ${corr.correspondent}`);
        console.log(`  Currency: ${corr.currency}`);
        console.log(`  Owner: ${corr.ownerName}`);
        console.log(`  Operations:`);
        corr.operationTypes.forEach(op => {
          console.log(`    - ${op.operationType}: ${op.minTransactionLimit} - ${op.maxTransactionLimit}`);
        });
      });
    }
    
    // 2. CHECK RECENT DEPOSITS (Last 10)
    console.log('\n\n📊 STEP 2: RECENT DEPOSITS (Last 10)\n');
    const depositsResponse = await fetch('https://api.pawapay.io/deposits?limit=10', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const deposits = await depositsResponse.json();
    
    if (Array.isArray(deposits)) {
      console.log(`Total deposits found: ${deposits.length}\n`);
      
      // Group by phone number
      const phoneStats = {};
      deposits.forEach(d => {
        const phone = d.payer?.address?.value;
        if (phone) {
          if (!phoneStats[phone]) {
            phoneStats[phone] = { total: 0, completed: 0, failed: 0, submitted: 0 };
          }
          phoneStats[phone].total++;
          if (d.status === 'COMPLETED') phoneStats[phone].completed++;
          if (d.status === 'FAILED') phoneStats[phone].failed++;
          if (d.status === 'SUBMITTED') phoneStats[phone].submitted++;
        }
      });
      
      console.log('📱 PHONE NUMBER STATISTICS:\n');
      Object.keys(phoneStats).forEach(phone => {
        const stats = phoneStats[phone];
        console.log(`Phone: ${phone}`);
        console.log(`  Total: ${stats.total}`);
        console.log(`  Completed: ${stats.completed}`);
        console.log(`  Failed: ${stats.failed}`);
        console.log(`  Submitted: ${stats.submitted}`);
        console.log('');
      });
      
      // Show detailed deposit info
      console.log('\n📋 DETAILED DEPOSIT HISTORY:\n');
      deposits.forEach((d, i) => {
        console.log(`${i + 1}. Deposit ID: ${d.depositId}`);
        console.log(`   Phone: ${d.payer?.address?.value}`);
        console.log(`   Amount: ${d.requestedAmount} ${d.currency}`);
        console.log(`   Correspondent: ${d.correspondent}`);
        console.log(`   Country: ${d.country}`);
        console.log(`   Status: ${d.status}`);
        if (d.status === 'FAILED') {
          console.log(`   ❌ Failure: ${d.failureReason?.failureCode} - ${d.failureReason?.failureMessage}`);
        }
        console.log('');
      });
    }
    
    // 3. ANALYZE PATTERNS
    console.log('\n\n🔍 STEP 3: PATTERN ANALYSIS\n');
    
    const workingPhone = '250780115764';
    const workingDeposits = deposits.filter(d => d.payer?.address?.value === workingPhone);
    const otherDeposits = deposits.filter(d => d.payer?.address?.value !== workingPhone && d.country === 'RWA');
    
    console.log(`Deposits with ${workingPhone}: ${workingDeposits.length}`);
    console.log(`Deposits with other Rwanda numbers: ${otherDeposits.length}`);
    
    if (otherDeposits.length > 0) {
      console.log('\n📱 OTHER RWANDA NUMBERS TESTED:');
      otherDeposits.forEach(d => {
        console.log(`  Phone: ${d.payer?.address?.value}`);
        console.log(`  Status: ${d.status}`);
        if (d.status === 'FAILED') {
          console.log(`  Reason: ${d.failureReason?.failureMessage}`);
        }
        console.log('');
      });
    }
    
    // 4. CHECK IF THERE'S A WHITELIST
    console.log('\n\n🎯 STEP 4: WHITELIST CHECK\n');
    
    const allRwandaDeposits = deposits.filter(d => d.country === 'RWA');
    const completedRwanda = allRwandaDeposits.filter(d => d.status === 'COMPLETED');
    const failedRwanda = allRwandaDeposits.filter(d => d.status === 'FAILED');
    
    console.log(`Total Rwanda deposits: ${allRwandaDeposits.length}`);
    console.log(`Completed: ${completedRwanda.length}`);
    console.log(`Failed: ${failedRwanda.length}`);
    
    if (completedRwanda.length > 0) {
      console.log('\n✅ SUCCESSFUL RWANDA NUMBERS:');
      const successfulPhones = [...new Set(completedRwanda.map(d => d.payer?.address?.value))];
      successfulPhones.forEach(phone => {
        console.log(`  - ${phone}`);
      });
    }
    
    if (failedRwanda.length > 0) {
      console.log('\n❌ FAILED RWANDA NUMBERS:');
      const failedPhones = [...new Set(failedRwanda.map(d => d.payer?.address?.value))];
      failedPhones.forEach(phone => {
        const deposit = failedRwanda.find(d => d.payer?.address?.value === phone);
        console.log(`  - ${phone}: ${deposit.failureReason?.failureMessage}`);
      });
    }
    
    // 5. FINAL DIAGNOSIS
    console.log('\n\n🏥 STEP 5: DIAGNOSIS\n');
    console.log('=' .repeat(60));
    
    if (completedRwanda.length === 0 && failedRwanda.length > 0) {
      console.log('⚠️  ISSUE: All Rwanda payments are failing');
      console.log('Possible reasons:');
      console.log('1. Account not fully activated for Rwanda');
      console.log('2. KYC/compliance incomplete');
      console.log('3. Test wallet mode (despite production dashboard)');
    } else if (completedRwanda.length > 0 && completedRwanda.every(d => d.payer?.address?.value === workingPhone)) {
      console.log('⚠️  ISSUE: Only one specific number works');
      console.log('This suggests:');
      console.log('1. Phone number whitelist is active');
      console.log('2. Account in limited testing mode');
      console.log('3. Need to request full production activation');
    } else if (completedRwanda.length > 0) {
      console.log('✅ Multiple Rwanda numbers working!');
      console.log('Account appears to be fully activated.');
    }
    
    console.log('\n\n📞 RECOMMENDED ACTION:');
    console.log('Contact PawaPay support with this information:');
    console.log('- Merchant ID: AFRI_SOL_-_LA_DIVINITE_LTD');
    console.log('- Issue: Only specific phone numbers receive payment prompts');
    console.log('- Request: Enable all Rwanda MTN/Airtel numbers for production');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

deepAnalysis();
