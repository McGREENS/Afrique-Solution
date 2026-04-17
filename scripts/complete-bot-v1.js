#!/usr/bin/env node

// Complete WhatsApp Bot with All Client Services
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('🚀 Starting Complete WhatsApp Bot...');

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "afrique-solution-complete"
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
      '--disable-gpu'
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable'
  }
});

// Store user sessions
const userSessions = new Map();

// Service menu function
function getServiceMenu(language) {
  if (language === 'en') {
    return `*Welcome to Afrique Solution*

Choose a service:

1. CANAL+
2. StarTimes
3. DSTV
4. VODACOM (units & packages)
5. Airtel (units & packages)
6. Orange (units & packages)
7. SOCODE Electricity

Reply with the number of your choice.`;
  } else {
    return `*Bienvenue chez Afrique Solution*

Choisissez un service :

1. CANAL+
2. StarTimes
3. DSTV
4. VODACOM (unités et forfaits)
5. Airtel (unités et forfaits)
6. Orange (unités et forfaits)
7. Courant SOCODE

Répondez avec le numéro de votre choix.`;
  }
}

client.on('qr', (qr) => {
  console.log('📱 SCAN THIS QR CODE:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ Bot is ready! Customers can message +250792593786');
});

client.on('message', async (message) => {
  if (message.fromMe) return;
  
  try {
    const contact = await message.getContact();
    const phone = contact.number;
    const text = message.body.trim();
    
    console.log(`📨 Message from ${phone}: ${text}`);
    
    let session = userSessions.get(phone) || {
      phone: phone,
      language: 'fr',
      step: 'choose_language'
    };
    
    let response = '';
    
    // Handle restart
    if (text.toLowerCase() === 'menu' || text.toLowerCase() === 'restart') {
      session.step = 'choose_language';
      userSessions.set(phone, session);
    }
    
    // Process message
    switch (session.step) {
      case 'choose_language':
        if (text === '1' || text.toLowerCase().includes('english')) {
          session.language = 'en';
          session.step = 'choose_service';
          response = getServiceMenu('en');
        } else if (text === '2' || text.toLowerCase().includes('français')) {
          session.language = 'fr';
          session.step = 'choose_service';
          response = getServiceMenu('fr');
        } else {
          response = `*Welcome to Afrique Solution*
*Bienvenue chez Afrique Solution*

Choose your language:
Choisissez votre langue :

1. English
2. Français

Reply with 1 or 2`;
        }
        break;
        
      case 'choose_service':
        const serviceIndex = parseInt(text);
        if (serviceIndex >= 1 && serviceIndex <= 7) {
          const services = ['canal', 'startimes', 'dstv', 'vodacom', 'airtel', 'orange', 'socode'];
          session.selectedService = services[serviceIndex - 1];
          
          // Handle different service flows
          if (session.selectedService === 'startimes') {
            session.step = 'choose_startimes_package';
            response = session.language === 'en' 
              ? `*StarTimes Packages:*

1. Basic - $10
2. Super (1 month) - $10
3. Super (1 week) - $4
4. Super (1 day) - $1.5

Reply with your choice.`
              : `*Forfaits StarTimes :*

1. Basic - $10
2. Super (1 mois) - $10
3. Super (1 semaine) - $4
4. Super (1 jour) - $1.5

Répondez avec votre choix.`;
          } else if (['vodacom', 'airtel', 'orange'].includes(session.selectedService)) {
            session.step = 'choose_telecom_type';
            response = session.language === 'en'
              ? `*${session.selectedService.toUpperCase()} Services:*

1. Bulk Units
2. Internet & SMS Packages
3. Call Minutes

Reply with your choice.`
              : `*Services ${session.selectedService.toUpperCase()} :*

1. Unités en gros
2. Forfaits Internet & SMS
3. Minutes d'appel

Répondez avec votre choix.`;
          } else if (session.selectedService === 'socode') {
            session.step = 'enter_meter_number';
            response = session.language === 'en'
              ? `*SOCODE Electricity*

Please enter your meter number:

Example: 12345678`
              : `*Courant SOCODE*

Veuillez entrer votre numéro de compteur :

Exemple : 12345678`;
          } else {
            // Canal+ and DSTV need country selection
            session.step = 'choose_region';
            response = session.language === 'en'
              ? `*Service: ${session.selectedService.toUpperCase()}*

Choose your country:

1. DR Congo
2. Rwanda
3. Burundi

Reply with your choice.`
              : `*Service : ${session.selectedService.toUpperCase()}*

Choisissez votre pays :

1. RD Congo
2. Rwanda
3. Burundi

Répondez avec votre choix.`;
          }
        } else {
          response = session.language === 'en' 
            ? 'Please choose a valid service (1-7)' 
            : 'Veuillez choisir un service valide (1-7)';
        }
        break;
        
      default:
        response = session.language === 'en' 
          ? 'Type "menu" to start over.' 
          : 'Tapez "menu" pour recommencer.';
    }
    
    userSessions.set(phone, session);
    
    if (response) {
      await message.reply(response);
      console.log('✅ Response sent');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
});

client.initialize();