#!/usr/bin/env node

// Simple Working WhatsApp Bot
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('🚀 Starting Simple WhatsApp Bot...');
console.log('📱 Make sure you have WhatsApp Business App installed on your phone');
console.log('');

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "afrique-solution"
  }),
  puppeteer: {
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  }
});

// Store user sessions in memory (simple version)
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

// PawaPay integration
async function initiatePawaPay(amount, phone, orderId, country) {
  try {
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
        correspondent: 'MTN_MOMO_RWA', // Adjust based on country
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
  console.log('🤖 Bot is ready to respond to messages!');
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
          response = `🇺🇸 *Welcome to Afrique Solution!*

Choose a service:

1️⃣ Canal+ (TV)
2️⃣ DSTV (TV) 
3️⃣ Vodacom (Mobile)
4️⃣ Airtel (Mobile)
5️⃣ Orange (Mobile)
6️⃣ Internet

Reply with the number of your choice.`;
        } else if (text === '2' || text.toLowerCase().includes('français') || text.toLowerCase().includes('francais') || text.toLowerCase() === 'fr') {
          session.language = 'fr';
          session.step = 'choose_service';
          response = `🇫🇷 *Bienvenue chez Afrique Solution !*

Choisissez un service :

1️⃣ Canal+ (TV)
2️⃣ DSTV (TV)
3️⃣ Vodacom (Mobile)
4️⃣ Airtel (Mobile)
5️⃣ Orange (Mobile)
6️⃣ Internet

Répondez avec le numéro de votre choix.`;
        } else {
          response = `👋 *Welcome to Afrique Solution!*
*Bienvenue chez Afrique Solution !*

Please choose your language / Choisissez votre langue :

1️⃣ English
2️⃣ Français

Reply with 1 or 2 / Répondez avec 1 ou 2`;
        }
        break;
        
      case 'choose_service':
        const services = ['canal', 'dstv', 'vodacom', 'airtel', 'orange', 'internet'];
        const serviceIndex = parseInt(text) - 1;
        
        if (serviceIndex >= 0 && serviceIndex < services.length) {
          session.selectedService = services[serviceIndex];
          session.step = 'choose_region';
          
          if (session.language === 'en') {
            response = `✅ You selected: *${services[serviceIndex].toUpperCase()}*

Choose your country:

1️⃣ 🇨🇩 DR Congo
2️⃣ 🇷🇼 Rwanda  
3️⃣ 🇧🇮 Burundi

Reply with the number of your choice.`;
          } else {
            response = `✅ Vous avez choisi : *${services[serviceIndex].toUpperCase()}*

Choisissez votre pays :

1️⃣ 🇨🇩 RD Congo
2️⃣ 🇷🇼 Rwanda
3️⃣ 🇧🇮 Burundi

Répondez avec le numéro de votre choix.`;
          }
        } else {
          response = session.language === 'en' 
            ? 'Please choose a valid service (1-6)' 
            : 'Veuillez choisir un service valide (1-6)';
        }
        break;
        
      case 'choose_region':
        const regions = ['drc', 'rwanda', 'burundi'];
        const regionIndex = parseInt(text) - 1;
        
        if (regionIndex >= 0 && regionIndex < regions.length) {
          session.selectedRegion = regions[regionIndex];
          session.step = 'choose_package';
          
          if (session.language === 'en') {
            response = `✅ Country: *${regions[regionIndex].toUpperCase()}*
✅ Service: *${session.selectedService.toUpperCase()}*

Available packages:

1️⃣ Basic Package - $5
2️⃣ Standard Package - $10  
3️⃣ Premium Package - $20

Reply with the number of your choice.`;
          } else {
            response = `✅ Pays : *${regions[regionIndex].toUpperCase()}*
✅ Service : *${session.selectedService.toUpperCase()}*

Forfaits disponibles :

1️⃣ Forfait Basic - $5
2️⃣ Forfait Standard - $10
3️⃣ Forfait Premium - $20

Répondez avec le numéro de votre choix.`;
          }
        } else {
          response = session.language === 'en' 
            ? 'Please choose a valid country (1-3)' 
            : 'Veuillez choisir un pays valide (1-3)';
        }
        break;
        
      case 'choose_package':
        const packages = ['basic', 'standard', 'premium'];
        const prices = [5, 10, 20];
        const packageIndex = parseInt(text) - 1;
        
        if (packageIndex >= 0 && packageIndex < packages.length) {
          session.selectedPackage = packages[packageIndex];
          session.selectedPrice = prices[packageIndex];
          session.step = 'enter_details';
          
          if (session.language === 'en') {
            response = `✅ Package: *${packages[packageIndex].toUpperCase()} - $${prices[packageIndex]}*

Please enter your decoder/phone number:

Example: 1234567890`;
          } else {
            response = `✅ Forfait : *${packages[packageIndex].toUpperCase()} - $${prices[packageIndex]}*

Veuillez entrer votre numéro de décodeur/téléphone :

Exemple : 1234567890`;
          }
        } else {
          response = session.language === 'en' 
            ? 'Please choose a valid package (1-3)' 
            : 'Veuillez choisir un forfait valide (1-3)';
        }
        break;
        
      case 'enter_details':
        if (text.length >= 6) {
          session.decoderNumber = text;
          session.step = 'payment';
          
          const orderId = 'AF' + Date.now().toString().slice(-6);
          
          if (session.language === 'en') {
            response = `✅ *Order Summary*

📦 Service: ${session.selectedService.toUpperCase()}
🌍 Country: ${session.selectedRegion.toUpperCase()}  
💰 Package: ${session.selectedPackage.toUpperCase()} - $${session.selectedPrice}
📱 Number: ${session.decoderNumber}
🆔 Order ID: ${orderId}

💳 *Payment Instructions:*

Send *$${session.selectedPrice}* via Mobile Money to:
📞 *+250796552804*

Include reference: *${orderId}*

⏰ Your service will be activated within 30 minutes after payment confirmation.

Need help? Reply "menu" to restart.`;
          } else {
            response = `✅ *Résumé de la commande*

📦 Service : ${session.selectedService.toUpperCase()}
🌍 Pays : ${session.selectedRegion.toUpperCase()}
💰 Forfait : ${session.selectedPackage.toUpperCase()} - $${session.selectedPrice}
📱 Numéro : ${session.decoderNumber}
🆔 ID Commande : ${orderId}

💳 *Instructions de paiement :*

Envoyez *$${session.selectedPrice}* via Mobile Money à :
📞 *+250796552804*

Incluez la référence : *${orderId}*

⏰ Votre service sera activé dans les 30 minutes après confirmation du paiement.

Besoin d'aide ? Répondez "menu" pour recommencer.`;
          }
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
process.on('SIGINT', async () => {
  console.log('');
  console.log('🛑 Shutting down WhatsApp Bot...');
  await client.destroy();
  process.exit(0);
});

// Initialize
client.initialize();