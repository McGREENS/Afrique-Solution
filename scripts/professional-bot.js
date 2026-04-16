#!/usr/bin/env node

// Professional WhatsApp Bot for Railway
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('🚀 Starting Railway WhatsApp Bot...');
console.log('📱 Environment:', process.env.NODE_ENV || 'production');
console.log('🔗 WhatsApp Number:', process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+250792593786');
console.log('⏰ Timestamp:', new Date().toISOString());
console.log('🔄 Initializing WhatsApp Web Client...');

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "afrique-solution-railway",
    dataPath: process.env.RAILWAY_VOLUME_MOUNT_PATH || "/tmp/.wwebjs_auth"
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
      '--disable-renderer-backgrounding',
      '--disable-extensions',
      '--disable-default-apps',
      '--disable-sync'
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

client.on('qr', async (qr) => {
  const timestamp = new Date().toLocaleString();
  console.log(`\n\n🔥 RAILWAY QR CODE - ${timestamp}`);
  console.log('⚡ QR CODE AVAILABLE ON WEBSITE');
  console.log('\n🔗 QR STRING:');
  console.log(qr);
  console.log('\n🌐 Visit: https://your-domain.vercel.app/admin/whatsapp-qr');
  console.log('📱 Or scan directly from logs');
  
  // Send QR to website API
  try {
    const response = await fetch('http://localhost:3000/api/whatsapp/qr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrString: qr, status: 'qr_ready' })
    });
    console.log('✅ QR code sent to website');
  } catch (error) {
    console.log('⚠️  Website API not available, use QR string above');
  }
  
  console.log('\n');
});

client.on('authenticated', async () => {
  console.log('✅ WhatsApp authenticated successfully!');
  console.log('🔄 Loading existing session...');
  
  // Update website status
  try {
    await fetch('http://localhost:3000/api/whatsapp/qr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrString: '', status: 'authenticated' })
    });
  } catch (error) {
    console.log('Website API not available');
  }
});

client.on('ready', async () => {
  console.log('🎉 WhatsApp Web Client is ready!');
  console.log('✅ Your business number (+250792593786) is now connected');
  console.log('📞 Customers can message your business number directly');
  console.log('🤖 Professional bot is ready with real pricing!');
  console.log('💰 Services: Canal+, DSTV, Vodacom, Airtel, Orange');
  console.log('🌍 Countries: Rwanda, DR Congo, Burundi');
  console.log('');
  console.log('⏳ Bot is now live 24/7 on Railway!');
  console.log('');
});

client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failed:', msg);
  console.log('💡 Session may have expired. Re-authenticate locally and redeploy.');
});

client.on('disconnected', (reason) => {
  console.log('📱 WhatsApp disconnected:', reason);
  console.log('🔄 Attempting to reconnect...');
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
          
          response = session.language === 'en' 
            ? `*Service Selected: ${serviceNames[services[serviceIndex]]}*\n\nChoose your country:\n\n1. DR Congo\n2. Rwanda\n3. Burundi\n\nReply with the number of your choice.`
            : `*Service choisi : ${serviceNames[services[serviceIndex]]}*\n\nChoisissez votre pays :\n\n1. RD Congo\n2. Rwanda\n3. Burundi\n\nRépondez avec le numéro de votre choix.`;
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
          
          response = session.language === 'en'
            ? `*Country: ${countryNames[regions[regionIndex]]}*\n*Service: ${session.selectedService.toUpperCase()}*\n\nAvailable packages:\n\n${packageList}\nReply with the number of your choice.`
            : `*Pays : ${countryNames[regions[regionIndex]]}*\n*Service : ${session.selectedService.toUpperCase()}*\n\nForfaits disponibles :\n\n${packageList}\nRépondez avec le numéro de votre choix.`;
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
          
          const isTV = session.selectedService === 'canal' || session.selectedService === 'dstv';
          const fieldName = isTV ? (session.language === 'en' ? 'decoder' : 'décodeur') : (session.language === 'en' ? 'phone' : 'téléphone');
          const example = isTV ? '1234567890' : '250781234567';
          
          response = session.language === 'en'
            ? `*Package Selected: ${selectedPackage.name} - $${selectedPackage.price}*\n\nPlease enter your ${fieldName} number:\n\nExample: ${example}`
            : `*Forfait choisi : ${selectedPackage.name} - $${selectedPackage.price}*\n\nVeuillez entrer votre numéro de ${fieldName} :\n\nExemple : ${example}`;
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
            ? `*ORDER CONFIRMATION*\n\nService: ${session.selectedService.toUpperCase()}\nCountry: ${session.selectedRegion.toUpperCase()}\nPackage: ${session.selectedPackageName}\nAmount: $${session.selectedPrice}\nNumber: ${session.decoderNumber}\nOrder ID: ${orderId}\n\n*PAYMENT INSTRUCTIONS*\n\nSend $${session.selectedPrice} via Mobile Money to:\n+250796552804\n\nInclude reference: ${orderId}\n\nYour service will be activated within 30 minutes after payment confirmation.\n\nNeed help? Reply "menu" to restart.`
            : `*CONFIRMATION DE COMMANDE*\n\nService : ${session.selectedService.toUpperCase()}\nPays : ${session.selectedRegion.toUpperCase()}\nForfait : ${session.selectedPackageName}\nMontant : $${session.selectedPrice}\nNuméro : ${session.decoderNumber}\nID Commande : ${orderId}\n\n*INSTRUCTIONS DE PAIEMENT*\n\nEnvoyez $${session.selectedPrice} via Mobile Money à :\n+250796552804\n\nIncluez la référence : ${orderId}\n\nVotre service sera activé dans les 30 minutes après confirmation du paiement.\n\nBesoin d'aide ? Répondez "menu" pour recommencer.`;
        } else {
          response = session.language === 'en' 
            ? 'Please enter a valid number (at least 6 digits)' 
            : 'Veuillez entrer un numéro valide (au moins 6 chiffres)';
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

// Initialize
console.log('🔄 Initializing WhatsApp Web Client...');
client.initialize();