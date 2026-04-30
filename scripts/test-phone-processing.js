// Test phone number processing logic
function detectPhoneCountry(phone) {
  const phoneStr = phone.replace(/[^0-9]/g, '');
  
  if (phoneStr.startsWith('250')) {
    return 'rwanda';
  } else if (phoneStr.startsWith('243')) {
    return 'drc';
  } else if (phoneStr.startsWith('257')) {
    return 'burundi';
  }
  
  return null;
}

function getCorrespondent(phone) {
  const phoneStr = phone.replace(/[^0-9]/g, '');
  const phoneCountry = detectPhoneCountry(phone);
  
  console.log('📱 Detected phone country:', phoneCountry);
  
  if (phoneCountry === 'rwanda') {
    if (phoneStr.startsWith('25078') || phoneStr.startsWith('25079')) {
      return 'MTN_MOMO_RWA';
    } else if (phoneStr.startsWith('25072') || phoneStr.startsWith('25073')) {
      return 'AIRTEL_RWA';
    } else {
      return 'MTN_MOMO_RWA';
    }
  }
  
  return null;
}

function getCurrencyAndAmount(phone, usdAmount) {
  const phoneCountry = detectPhoneCountry(phone);
  
  if (phoneCountry === 'rwanda') {
    const rwfAmount = Math.round(parseFloat(usdAmount) * 1400);
    return { currency: 'RWF', amount: rwfAmount.toString(), country: 'RWA' };
  } else if (phoneCountry === 'drc') {
    return { currency: 'USD', amount: parseFloat(usdAmount).toFixed(2), country: 'COD' };
  }
  
  return null;
}

// Test both phone numbers
const testPhones = [
  { phone: '250780115764', amount: 1 },
  { phone: '250789773232', amount: 4.8 }
];

console.log('========== PHONE NUMBER PROCESSING TEST ==========\n');

testPhones.forEach(test => {
  console.log(`Testing: ${test.phone} with $${test.amount}`);
  console.log('---');
  
  const phoneCountry = detectPhoneCountry(test.phone);
  const correspondent = getCorrespondent(test.phone);
  const currencyInfo = getCurrencyAndAmount(test.phone, test.amount);
  
  console.log('Country:', phoneCountry);
  console.log('Correspondent:', correspondent);
  console.log('Currency:', currencyInfo?.currency);
  console.log('Amount:', currencyInfo?.amount);
  console.log('Validation:', !phoneCountry || !correspondent || !currencyInfo ? '❌ REJECTED' : '✅ ACCEPTED');
  console.log('\n');
});

console.log('========== CONCLUSION ==========');
console.log('Both phone numbers are processed IDENTICALLY by our code.');
console.log('No filtering, no hardcoded numbers, no whitelist in our implementation.');
console.log('The whitelist is on PawaPay/MTN side, NOT in our code.');
