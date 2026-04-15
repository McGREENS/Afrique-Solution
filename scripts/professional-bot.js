#!/usr/bin/env node

// Professional WhatsApp Bot for Railway
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('🚀 Starting Railway WhatsApp Bot...');
console.log('📱 Environment:', process.env.NODE_ENV || 'development');
console.log('🔗 WhatsApp Number:', process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+250792593786');

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "afrique-solution-railway"
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding'
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable'
  }
});

// Store user sessions in memory
const userSessions = new Map();

// Real pricing data
const pricing = {
  canal: {
    rwanda: {
      'acces': { name: 'ACCES', price: 4.8 },
      'evasion': { name: 'EVASION', price: 7.8 },
      'acces_plus': { name: 'ACCES+', price: 15 },
      'tout_canal': { name: 'TOUT CANAL', price: 26 },
      'options_dstv': { name: 'Options DSTV', price: 9 },
      'evasion_dstv': { name: 'EVASION avec DSTV', price: 17 },
      'acces_plus_dstv': { name: 'ACCES+ avec DSTV', price: 23 }
    },
    drc: {
      'acces': { name: 'ACCES', price: 10 },
      'evasion': { name: 'EVASION', price: 20 },
      'acces_plus': { name: 'ACCES+', price: 27 },
      'tout_canal': { name: 'TOUT CANAL', price: 50 },
      'options_dstv': { name: 'Options DSTV', price: 10 },
      'evasion_dstv': { name: 'EVASION avec DSTV', price: 30 },
      'acces_plus_dstv': { name: 'ACCES+ avec DSTV', price: 31 }
    },
    burundi: {
      'acces': { name: 'ACCES', price: 7 },
      'evasion': { name: 'EVASION', price: 13 },
      'acces_plus': { name: 'ACCES+', price: 18 },
      'tout_canal': { name: 'TOUT CANAL', price: 32 },
      'options_dstv': { name: 'Options DSTV', price: 6 },
      'evasion_dstv': { name: 'EVASION avec DSTV', price: 19 },
      'acces_plus_dstv': { name: 'ACCES+ avec DSTV', price: 24 }
    }
  }
};

client.on('qr', (qr) => {
  console.log('📱 SCAN THIS QR CODE WITH YOUR WHATSAPP BUSINESS APP:');
  console.log('');
  qrcode.generate(qr, { small: true });
  console.log('');
  console.log('Steps:');
  console.log('1. Open WhatsApp Business App on your phone');
  console.log('2. Go to Settings > Linked Devices');
  console.log('3. Tap "Link a Device"');
  console.log('4. Scan the QR code above');
  console.log('');
});

client.on('authenticated', () => {
  console.log('✅ WhatsApp authenticated successfully!');
});

client.on('ready', async () => {
  console.log('🎉 WhatsApp Web Client is ready!');
  console.log('✅ Your business number (+250792593786) is now connected');
  console.log('📞 Customers can message your business number directly');
  console.log('🤖 Professional bot is ready with real pricing!');
  console.log('');
  console.log('⏳ Bot is now live 24/7 on Railway!');
  console.log('');
});

client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
  console.log('📱 WhatsApp disconnected:', reason);
});

// Handle incoming messages
client.on('message', async (message) => {
  if (message.fromMe) return;
  
  try {
    const contact = await message.getContact();
    const phone = contact.number;
    const text = message.body.trim();
    
    console.log(`📨 New message from ${contact.name || phone}: ${text}`);
    
    // Get or create user session
    let session = userSessions.get(phone) || {
      phone: phone,
      language: 'fr',
      step: 'choose_language'
    };
    
    let response = '';
    
    // Handle restart commands
    if (text.toLowerCase() === 'menu' || text.toLowerCase() === 'restart') {
      session.step = 'choose_language';
      session.language = 'fr';
      userSessions.set(phone, session);
    }
    
    // Process based on current step
    switch (session.step) {
      case 'choose_language':
        if (text === '1' || text.toLowerCase().includes('english') || text.toLowerCase() === 'en') {
          session.language = 'en';
          session.step = 'choose_service';
          response = `*Welcome to Afrique Solution*\n\nChoose a service:\n\n1. Canal+ (Satellite TV)\n2. DSTV (Satellite TV)\n3. Vodacom (Mobile Data)\n4. Airtel (Mobile Data)\n5. Orange (Mobile Data)\n\nReply with the number of your choice.`;
        } else if (text === '2' || text.toLowerCase().includes('français') || text.toLowerCase().includes('francais') || text.toLowerCase() === 'fr') {
          session.language = 'fr';
          session.step = 'choose_service';
          response = `*Bienvenue chez Afrique Solution*\n\nChoisissez un service :\n\n1. Canal+ (TV Satellite)\n2. DSTV (TV Satellite)\n3. Vodacom (Data Mobile)\n4. Airtel (Data Mobile)\n5. Orange (Data Mobile)\n\nRépondez avec le numéro de votre choix.`;
        } else {
          response = `*Welcome to Afrique Solution*\n*Bienvenue chez Afrique Solution*\n\nPlease choose your language:\nChoisissez votre langue :\n\n1. English\n2. Français\n\nReply with 1 or 2`;
        }
        break;
        
      case 'choose_service':
        if (text === '1') {
          session.selectedService = 'canal';
          session.step = 'choose_region';
          response = session.language === 'en' 
            ? `*Service Selected: Canal+*\n\nChoose your country:\n\n1. DR Congo\n2. Rwanda\n3. Burundi\n\nReply with the number of your choice.`
            : `*Service choisi : Canal+*\n\nChoisissez votre pays :\n\n1. RD Congo\n2. Rwanda\n3. Burundi\n\nRépondez avec le numéro de votre choix.`;
        } else {
          response = session.language === 'en' 
            ? 'Please choose a valid service (1-5)' 
            : 'Veuillez choisir un service valide (1-5)';
        }
        break;
        
      case 'choose_region':
        const regions = ['drc', 'rwanda', 'burundi'];
        const regionIndex = parseInt(text) - 1;
        
        if (regionIndex >= 0 && regionIndex < regions.length) {
          session.selectedRegion = regions[regionIndex];
          session.step = 'choose_package';
          
          // Get Canal+ packages for selected region
          const packages = pricing.canal[session.selectedRegion];
          const packageKeys = Object.keys(packages);
          
          let packageList = '';
          packageKeys.forEach((key, index) => {
            const pkg = packages[key];
            packageList += `${index + 1}. ${pkg.name} - $${pkg.price}\n`;
          });
          
          response = session.language === 'en'
            ? `*Country: ${regions[regionIndex].toUpperCase()}*\n*Service: CANAL+*\n\nAvailable packages:\n\n${packageList}\nReply with the number of your choice.`
            : `*Pays : ${regions[regionIndex].toUpperCase()}*\n*Service : CANAL+*\n\nForfaits disponibles :\n\n${packageList}\nRépondez avec le numéro de votre choix.`;
        } else {
          response = session.language === 'en' 
            ? 'Please choose a valid country (1-3)' 
            : 'Veuillez choisir un pays valide (1-3)';
        }
        break;
        
      case 'choose_package':
        const availablePackages = pricing.canal[session.selectedRegion];
        const packageKeys = Object.keys(availablePackages);
        const packageIndex = parseInt(text) - 1;
        
        if (packageIndex >= 0 && packageIndex < packageKeys.length) {
          const selectedPackageKey = packageKeys[packageIndex];
          const selectedPackage = availablePackages[selectedPackageKey];
          
          session.selectedPackage = selectedPackageKey;
          session.selectedPackageName = selectedPackage.name;
          session.selectedPrice = selectedPackage.price;
          session.step = 'enter_details';
          
          response = session.language === 'en'
            ? `*Package Selected: ${selectedPackage.name} - $${selectedPackage.price}*\n\nPlease enter your decoder number:\n\nExample: 1234567890`
            : `*Forfait choisi : ${selectedPackage.name} - $${selectedPackage.price}*\n\nVeuillez entrer votre numéro de décodeur :\n\nExemple : 1234567890`;
        } else {
          response = session.language === 'en' 
            ? `Please choose a valid package (1-${packageKeys.length})` 
            : `Veuillez choisir un forfait valide (1-${packageKeys.length})`;
        }
        break;
        
      case 'enter_details':
        if (text.length >= 6) {
          session.decoderNumber = text;
          session.step = 'payment_complete';
          
          const orderId = 'AF' + Date.now().toString().slice(-6);
          
          response = session.language === 'en'
            ? `*ORDER CONFIRMATION*\n\nService: CANAL+\nCountry: ${session.selectedRegion.toUpperCase()}\nPackage: ${session.selectedPackageName}\nAmount: $${session.selectedPrice}\nDecoder: ${session.decoderNumber}\nOrder ID: ${orderId}\n\n*PAYMENT INSTRUCTIONS*\n\nSend $${session.selectedPrice} via Mobile Money to:\n+250796552804\n\nInclude reference: ${orderId}\n\nYour service will be activated within 30 minutes after payment confirmation.\n\nNeed help? Reply "menu" to restart.`
            : `*CONFIRMATION DE COMMANDE*\n\nService : CANAL+\nPays : ${session.selectedRegion.toUpperCase()}\nForfait : ${session.selectedPackageName}\nMontant : $${session.selectedPrice}\nDécodeur : ${session.decoderNumber}\nID Commande : ${orderId}\n\n*INSTRUCTIONS DE PAIEMENT*\n\nEnvoyez $${session.selectedPrice} via Mobile Money à :\n+250796552804\n\nIncluez la référence : ${orderId}\n\nVotre service sera activé dans les 30 minutes après confirmation du paiement.\n\nBesoin d'aide ? Répondez "menu" pour recommencer.`;
        } else {
          response = session.language === 'en' 
            ? 'Please enter a valid decoder number (at least 6 digits)' 
            : 'Veuillez entrer un numéro de décodeur valide (au moins 6 chiffres)';
        }
        break;
        
      default:
        response = session.language === 'en' 
          ? 'Type "menu" to start over.' 
          : 'Tapez "menu" pour recommencer.';
    }
    
    // Save session
    userSessions.set(phone, session);
    
    // Send response
    if (response) {
      await message.reply(response);
      console.log('✅ Response sent successfully');
    }
    
  } catch (error) {
    console.error('❌ Error processing message:', error);
    try {
      await message.reply('Sorry, there was an error. Please type "menu" to restart.\nDésolé, il y a eu une erreur. Tapez "menu" pour recommencer.');
    } catch (replyError) {
      console.error('❌ Failed to send error message:', replyError);
    }
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down WhatsApp Bot...');
  await client.destroy();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Shutting down WhatsApp Bot...');
  await client.destroy();
  process.exit(0);
});

// Initialize
console.log('🔄 Initializing WhatsApp Web Client...');
client.initialize();

// Store user sessions in memory
const userSessions = new Map();

// Real pricing data from your tariffs
const pricing = {
  canal: {
    rwanda: {
      'acces': { name: 'ACCES', price: 4.8 },
      'evasion': { name: 'EVASION', price: 7.8 },
      'acces_plus': { name: 'ACCES+', price: 15 },
      'tout_canal': { name: 'TOUT CANAL', price: 26 },
      'options_dstv': { name: 'Options DSTV', price: 9 },
      'evasion_dstv': { name: 'EVASION avec DSTV', price: 17 },
      'acces_plus_dstv': { name: 'ACCES+ avec DSTV', price: 23 }
    },
    drc: {
      'acces': { name: 'ACCES', price: 10 },
      'evasion': { name: 'EVASION', price: 20 },
      'acces_plus': { name: 'ACCES+', price: 27 },
      'tout_canal': { name: 'TOUT CANAL', price: 50 },
      'options_dstv': { name: 'Options DSTV', price: 10 },
      'evasion_dstv': { name: 'EVASION avec DSTV', price: 30 },
      'acces_plus_dstv': { name: 'ACCES+ avec DSTV', price: 31 }
    },
    burundi: {
      'acces': { name: 'ACCES', price: 7 },
      'evasion': { name: 'EVASION', price: 13 },
      'acces_plus': { name: 'ACCES+', price: 18 },
      'tout_canal': { name: 'TOUT CANAL', price: 32 },
      'options_dstv': { name: 'Options DSTV', price: 6 },
      'evasion_dstv': { name: 'EVASION avec DSTV', price: 19 },
      'acces_plus_dstv': { name: 'ACCES+ avec DSTV', price: 24 }
    }
  },
  dstv: {
    rwanda: {
      'compact': { name: 'DStv Compact', price: 15 },
      'compact_plus': { name: 'DStv Compact Plus', price: 25 },
      'premium': { name: 'DStv Premium', price: 45 }
    },
    drc: {
      'compact': { name: 'DStv Compact', price: 18 },
      'compact_plus': { name: 'DStv Compact Plus', price: 30 },
      'premium': { name: 'DStv Premium', price: 55 }
    },
    burundi: {
      'compact': { name: 'DStv Compact', price: 16 },
      'compact_plus': { name: 'DStv Compact Plus', price: 28 },
      'premium': { name: 'DStv Premium', price: 50 }
    }
  },
  vodacom: {
    rwanda: {
      '1gb': { name: '1GB Data', price: 2 },
      '5gb': { name: '5GB Data', price: 8 },
      '10gb': { name: '10GB Data', price: 15 }
    },
    drc: {
      '1gb': { name: '1GB Data', price: 3 },
      '5gb': { name: '5GB Data', price: 12 },
      '10gb': { name: '10GB Data', price: 20 }
    },
    burundi: {
      '1gb': { name: '1GB Data', price: 2.5 },
      '5gb': { name: '5GB Data', price: 10 },
      '10gb': { name: '10GB Data', price: 18 }
    }
  },
  airtel: {
    rwanda: {
      '1gb': { name: '1GB Data', price: 2 },
      '5gb': { name: '5GB Data', price: 8 },
      '10gb': { name: '10GB Data', price: 15 }
    },
    drc: {
      '1gb': { name: '1GB Data', price: 3 },
      '5gb': { name: '5GB Data', price: 12 },
      '10gb': { name: '10GB Data', price: 20 }
    },
    burundi: {
      '1gb': { name: '1GB Data', price: 2.5 },
      '5gb': { name: '5GB Data', price: 10 },
      '10gb': { name: '10GB Data', price: 18 }
    }
  },
  orange: {
    rwanda: {
      '1gb': { name: '1GB Data', price: 2 },
      '5gb': { name: '5GB Data', price: 8 },
      '10gb': { name: '10GB Data', price: 15 }
    },
    drc: {
      '1gb': { name: '1GB Data', price: 3 },
      '5gb': { name: '5GB Data', price: 12 },
      '10gb': { name: '10GB Data', price: 20 }
    },
    burundi: {
      '1gb': { name: '1GB Data', price: 2.5 },
      '5gb': { name: '5GB Data', price: 10 },
      '10gb': { name: '10GB Data', price: 18 }
    }
  }
};

// PawaPay integration
async function initiatePawaPay(amount, phone, orderId, country) {
  try {
    const correspondentMap = {
      'rwanda': 'MTN_MOMO_RWA',
      'drc': 'AIRTEL_MONEY_COD',
      'burundi': 'AIRTEL_MONEY_BDI'
    };

    const response = await fetch('https://api.sandbox.pawapay.io/deposits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjE4NTc2IiwibWF2IjoiMSIsImV4cCI6MjA5MTUzNjE5MCwiaWF0IjoxNzc1OTE2OTkwLCJwbSI6IkRBRixQQUYiLCJqdGkiOiJmY2FmYjc0ZS1hMzZkLTQ2NmItYTQ5My00YTA2MjFjMjdhYjYifQ.-sc3k3rhPUaFlgOV71DtD7X_E9QZAKz5HByLZbchzZTWMIk79uECuFLcMwtnfVAabXNAwqUD5cYx0AhAFtefYQ'
      },
      body: JSON.stringify({
        depositId: orderId,
        amount: amount.toString(),
        currency: 'USD',
        correspondent: correspondentMap[country] || 'MTN_MOMO_RWA',
        payer: {
          type: 'MSISDN',
          address: {
            value: phone
          }
        },
        customerTimestamp: new Date().toISOString(),
        statementDescription: `Afrique Solution - ${orderId}`
      })
    });
    
    const result = await response.json();
    console.log('PawaPay response:', result);
    return result;
  } catch (error) {
    console.error('PawaPay error:', error);
    return null;
  }
}

client.on('qr', (qr) => {
  console.log('📱 SCAN THIS QR CODE WITH YOUR WHATSAPP BUSINESS APP:');
  console.log('');
  qrcode.generate(qr, { small: true });
  console.log('');
  console.log('Steps:');
  console.log('1. Open WhatsApp Business App on your phone');
  console.log('2. Go to Settings > Linked Devices');
  console.log('3. Tap "Link a Device"');
  console.log('4. Scan the QR code above');
  console.log('');
});

client.on('authenticated', () => {
  console.log('✅ WhatsApp authenticated successfully!');
});

client.on('ready', async () => {
  console.log('🎉 WhatsApp Web Client is ready!');
  console.log('✅ Your business number (+250792593786) is now connected');
  console.log('📞 Customers can message your business number directly');
  console.log('🤖 Professional bot is ready with real pricing!');
  console.log('');
  console.log('⏳ Keeping connection alive... (Press Ctrl+C to stop)');
  console.log('');
});

client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failed:', msg);
  console.log('💡 Try running this script again');
});

client.on('disconnected', (reason) => {
  console.log('📱 WhatsApp disconnected:', reason);
  console.log('💡 Run this script again to reconnect');
});

// Handle incoming messages
client.on('message', async (message) => {
  if (message.fromMe) return;
  
  try {
    const contact = await message.getContact();
    const phone = contact.number;
    const text = message.body.trim();
    const messageId = message.id.id;
    
    console.log(`📨 New message from ${contact.name || phone}: ${text}`);
    console.log('🔄 Processing message...');
    
    // Get or create user session
    let session = userSessions.get(phone) || {
      phone: phone,
      language: 'fr',
      step: 'choose_language'
    };
    
    let response = '';
    
    // Handle restart commands
    if (text.toLowerCase() === 'menu' || text.toLowerCase() === 'restart') {
      session.step = 'choose_language';
      session.language = 'fr';
      userSessions.set(phone, session);
    }
    
    // Process based on current step
    switch (session.step) {
      case 'choose_language':
        if (text === '1' || text.toLowerCase().includes('english') || text.toLowerCase() === 'en') {
          session.language = 'en';
          session.step = 'choose_service';
          response = `*Welcome to Afrique Solution*\n\nChoose a service:\n\n1. Canal+ (Satellite TV)\n2. DSTV (Satellite TV)\n3. Vodacom (Mobile Data)\n4. Airtel (Mobile Data)\n5. Orange (Mobile Data)\n\nReply with the number of your choice.`;
        } else if (text === '2' || text.toLowerCase().includes('français') || text.toLowerCase().includes('francais') || text.toLowerCase() === 'fr') {
          session.language = 'fr';
          session.step = 'choose_service';
          response = `*Bienvenue chez Afrique Solution*\n\nChoisissez un service :\n\n1. Canal+ (TV Satellite)\n2. DSTV (TV Satellite)\n3. Vodacom (Data Mobile)\n4. Airtel (Data Mobile)\n5. Orange (Data Mobile)\n\nRépondez avec le numéro de votre choix.`;
        } else {
          response = `*Welcome to Afrique Solution*\n*Bienvenue chez Afrique Solution*\n\nPlease choose your language:\nChoisissez votre langue :\n\n1. English\n2. Français\n\nReply with 1 or 2`;
        }
        break;
        
      case 'choose_service':
        const services = ['canal', 'dstv', 'vodacom', 'airtel', 'orange'];
        const serviceIndex = parseInt(text) - 1;
        
        if (serviceIndex >= 0 && serviceIndex < services.length) {
          session.selectedService = services[serviceIndex];
          session.step = 'choose_region';
          
          const serviceNames = {
            'canal': 'Canal+',
            'dstv': 'DSTV', 
            'vodacom': 'Vodacom',
            'airtel': 'Airtel',
            'orange': 'Orange'
          };
          
          if (session.language === 'en') {
            response = `*Service Selected: ${serviceNames[services[serviceIndex]]}*\n\nChoose your country:\n\n1. DR Congo\n2. Rwanda\n3. Burundi\n\nReply with the number of your choice.`;
          } else {
            response = `*Service choisi : ${serviceNames[services[serviceIndex]]}*\n\nChoisissez votre pays :\n\n1. RD Congo\n2. Rwanda\n3. Burundi\n\nRépondez avec le numéro de votre choix.`;
          }
        } else {
          response = session.language === 'en' 
            ? 'Please choose a valid service (1-5)' 
            : 'Veuillez choisir un service valide (1-5)';
        }
        break;
        
      case 'choose_region':
        const regions = ['drc', 'rwanda', 'burundi'];
        const regionIndex = parseInt(text) - 1;
        
        if (regionIndex >= 0 && regionIndex < regions.length) {
          session.selectedRegion = regions[regionIndex];
          session.step = 'choose_package';
          
          // Get packages for selected service and region
          const packages = pricing[session.selectedService][session.selectedRegion];
          const packageKeys = Object.keys(packages);
          
          let packageList = '';
          packageKeys.forEach((key, index) => {
            const pkg = packages[key];
            packageList += `${index + 1}. ${pkg.name} - $${pkg.price}\n`;
          });
          
          const countryNames = {
            'drc': session.language === 'en' ? 'DR Congo' : 'RD Congo',
            'rwanda': 'Rwanda',
            'burundi': 'Burundi'
          };
          
          if (session.language === 'en') {
            response = `*Country: ${countryNames[regions[regionIndex]]}*\n*Service: ${session.selectedService.toUpperCase()}*\n\nAvailable packages:\n\n${packageList}\nReply with the number of your choice.`;
          } else {
            response = `*Pays : ${countryNames[regions[regionIndex]]}*\n*Service : ${session.selectedService.toUpperCase()}*\n\nForfaits disponibles :\n\n${packageList}\nRépondez avec le numéro de votre choix.`;
          }
        } else {
          response = session.language === 'en' 
            ? 'Please choose a valid country (1-3)' 
            : 'Veuillez choisir un pays valide (1-3)';
        }
        break;
        
      case 'choose_package':
        const availablePackages = pricing[session.selectedService][session.selectedRegion];
        const packageKeys = Object.keys(availablePackages);
        const packageIndex = parseInt(text) - 1;
        
        if (packageIndex >= 0 && packageIndex < packageKeys.length) {
          const selectedPackageKey = packageKeys[packageIndex];
          const selectedPackage = availablePackages[selectedPackageKey];
          
          session.selectedPackage = selectedPackageKey;
          session.selectedPackageName = selectedPackage.name;
          session.selectedPrice = selectedPackage.price;
          session.step = 'enter_details';
          
          if (session.language === 'en') {
            response = `*Package Selected: ${selectedPackage.name} - $${selectedPackage.price}*\n\nPlease enter your ${session.selectedService === 'canal' || session.selectedService === 'dstv' ? 'decoder' : 'phone'} number:\n\nExample: ${session.selectedService === 'canal' || session.selectedService === 'dstv' ? '1234567890' : '250781234567'}`;
          } else {
            response = `*Forfait choisi : ${selectedPackage.name} - $${selectedPackage.price}*\n\nVeuillez entrer votre numéro de ${session.selectedService === 'canal' || session.selectedService === 'dstv' ? 'décodeur' : 'téléphone'} :\n\nExemple : ${session.selectedService === 'canal' || session.selectedService === 'dstv' ? '1234567890' : '250781234567'}`;
          }
        } else {
          response = session.language === 'en' 
            ? `Please choose a valid package (1-${packageKeys.length})` 
            : `Veuillez choisir un forfait valide (1-${packageKeys.length})`;
        }
        break;
        
      case 'enter_details':
        if (text.length >= 6) {
          session.decoderNumber = text;
          session.step = 'confirm_payment';
          
          const orderId = 'AF' + Date.now().toString().slice(-6);
          session.orderId = orderId;
          
          if (session.language === 'en') {
            response = `*ORDER CONFIRMATION*\n\nService: ${session.selectedService.toUpperCase()}\nCountry: ${session.selectedRegion.toUpperCase()}\nPackage: ${session.selectedPackageName}\nAmount: $${session.selectedPrice}\nNumber: ${session.decoderNumber}\nOrder ID: ${orderId}\n\n*PAYMENT OPTIONS*\n\n1. Pay with Mobile Money (Automatic)\n2. Manual Payment Instructions\n\nReply with 1 or 2`;
          } else {
            response = `*CONFIRMATION DE COMMANDE*\n\nService : ${session.selectedService.toUpperCase()}\nPays : ${session.selectedRegion.toUpperCase()}\nForfait : ${session.selectedPackageName}\nMontant : $${session.selectedPrice}\nNuméro : ${session.decoderNumber}\nID Commande : ${orderId}\n\n*OPTIONS DE PAIEMENT*\n\n1. Payer avec Mobile Money (Automatique)\n2. Instructions de paiement manuel\n\nRépondez avec 1 ou 2`;
          }
        } else {
          response = session.language === 'en' 
            ? 'Please enter a valid number (at least 6 digits)' 
            : 'Veuillez entrer un numéro valide (au moins 6 chiffres)';
        }
        break;
        
      case 'confirm_payment':
        if (text === '1') {
          // Automatic payment with PawaPay
          session.step = 'enter_phone';
          response = session.language === 'en'
            ? `*AUTOMATIC PAYMENT*\n\nPlease enter your Mobile Money phone number:\n\nExample: 250781234567\n\nSupported: Airtel Money, MTN MoMo, Orange Money`
            : `*PAIEMENT AUTOMATIQUE*\n\nVeuillez entrer votre numéro de téléphone Mobile Money :\n\nExemple : 250781234567\n\nSupporté : Airtel Money, MTN MoMo, Orange Money`;
        } else if (text === '2') {
          // Manual payment instructions
          session.step = 'payment_complete';
          response = session.language === 'en'
            ? `*MANUAL PAYMENT INSTRUCTIONS*\n\nSend $${session.selectedPrice} via Mobile Money to:\n+250796552804\n\nInclude reference: ${session.orderId}\n\nYour service will be activated within 30 minutes after payment confirmation.\n\nNeed help? Reply "menu" to restart.`
            : `*INSTRUCTIONS DE PAIEMENT MANUEL*\n\nEnvoyez $${session.selectedPrice} via Mobile Money à :\n+250796552804\n\nIncluez la référence : ${session.orderId}\n\nVotre service sera activé dans les 30 minutes après confirmation du paiement.\n\nBesoin d'aide ? Répondez "menu" pour recommencer.`;
        } else {
          response = session.language === 'en'
            ? 'Please choose 1 for automatic payment or 2 for manual payment'
            : 'Veuillez choisir 1 pour le paiement automatique ou 2 pour le paiement manuel';
        }
        break;
        
      case 'enter_phone':
        if (text.length >= 10 && /^\d+$/.test(text.replace(/[+\s-]/g, ''))) {
          const cleanPhone = text.replace(/[+\s-]/g, '');
          session.paymentPhone = cleanPhone;
          
          // Initiate PawaPay payment
          console.log(`Initiating PawaPay payment for ${session.selectedPrice} USD to ${cleanPhone}`);
          
          const paymentResult = await initiatePawaPay(
            session.selectedPrice,
            cleanPhone,
            session.orderId,
            session.selectedRegion
          );
          
          if (paymentResult && paymentResult.status === 'ACCEPTED') {
            session.step = 'payment_processing';
            response = session.language === 'en'
              ? `*PAYMENT INITIATED*\n\nA payment request for $${session.selectedPrice} has been sent to ${cleanPhone}.\n\nPlease check your phone and approve the payment.\n\nOrder ID: ${session.orderId}\n\nYour service will be activated automatically after payment confirmation.`
              : `*PAIEMENT INITIÉ*\n\nUne demande de paiement de $${session.selectedPrice} a été envoyée au ${cleanPhone}.\n\nVeuillez vérifier votre téléphone et approuver le paiement.\n\nID Commande : ${session.orderId}\n\nVotre service sera activé automatiquement après confirmation du paiement.`;
          } else {
            response = session.language === 'en'
              ? `*PAYMENT FAILED*\n\nAutomatic payment could not be initiated. Please use manual payment:\n\nSend $${session.selectedPrice} via Mobile Money to:\n+250796552804\n\nInclude reference: ${session.orderId}`
              : `*ÉCHEC DU PAIEMENT*\n\nLe paiement automatique n'a pas pu être initié. Veuillez utiliser le paiement manuel :\n\nEnvoyez $${session.selectedPrice} via Mobile Money à :\n+250796552804\n\nIncluez la référence : ${session.orderId}`;
          }
        } else {
          response = session.language === 'en'
            ? 'Please enter a valid phone number (10+ digits)'
            : 'Veuillez entrer un numéro de téléphone valide (10+ chiffres)';
        }
        break;
        
      default:
        response = session.language === 'en' 
          ? 'Type "menu" to start over.' 
          : 'Tapez "menu" pour recommencer.';
    }
    
    // Save session
    userSessions.set(phone, session);
    
    // Send response
    if (response) {
      await message.reply(response);
      console.log('✅ Response sent successfully');
    }
    
  } catch (error) {
    console.error('❌ Error processing message:', error);
    try {
      await message.reply('Sorry, there was an error. Please type "menu" to restart.\nDésolé, il y a eu une erreur. Tapez "menu" pour recommencer.');
    } catch (replyError) {
      console.error('❌ Failed to send error message:', replyError);
    }
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('');
  console.log('🛑 Shutting down WhatsApp Bot...');
  await client.destroy();
  process.exit(0);
});

// Initialize
client.initialize();