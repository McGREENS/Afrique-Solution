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
          response = `*Welcome to Afrique Solution*\n\nChoose a service:\n\n1. CANAL+\n2. StarTimes\n3. DSTV\n4. VODACOM (units & packages)\n5. Airtel (units & packages)\n6. Orange (units & packages)\n7. SOCODE Electricity\n\nReply with the number of your choice.`;
        } else if (text === '2' || text.toLowerCase().includes('français')) {
          session.language = 'fr';
          session.step = 'choose_service';
          response = `*Bienvenue chez Afrique Solution*\n\nChoisissez un service :\n\n1. CANAL+\n2. StarTimes\n3. DSTV\n4. VODACOM (unités et forfaits)\n5. Airtel (unités et forfaits)\n6. Orange (unités et forfaits)\n7. Courant SOCODE\n\nRépondez avec le numéro de votre choix.`;
        } else {
          response = `*Welcome to Afrique Solution*\n*Bienvenue chez Afrique Solution*\n\nChoose your language:\nChoisissez votre langue :\n\n1. English\n2. Français\n\nReply with 1 or 2`;
        }
        break;
        
      case 'choose_service':
        const serviceIndex = parseInt(text);
        if (serviceIndex >= 1 && serviceIndex <= 7) {
          const services = ['canal', 'startimes', 'dstv', 'vodacom', 'airtel', 'orange', 'socode'];
          session.selectedService = services[serviceIndex - 1];
          
          if (session.selectedService === 'startimes') {
            session.step = 'choose_startimes_package';
            response = session.language === 'en' 
              ? `*StarTimes Packages:*\n\n1. Basic $10\n2. Super $10/month\n3. Super $4/week\n4. Super $1.5/day\n\nReply with your choice.`
              : `*StarTimes*\n\n1. Basic $10\n2. Super $10/mois\n3. Super $4/semaine\n4. Super $1.5/jour\n\nRépondez avec votre choix.`;
          } else if (['vodacom', 'airtel', 'orange'].includes(session.selectedService)) {
            session.step = 'choose_telecom_type';
            response = session.language === 'en'
              ? `*${session.selectedService.toUpperCase()} Services:*\n\n1. Bulk Units\n2. Internet & SMS Packages\n3. Call Minutes\n\nReply with your choice.`
              : `*${session.selectedService.toUpperCase()}*\n\n1. Unités en gros\n2. Forfaits unité (internet, minutes, SMS)\n\nRépondez avec votre choix.`;
          } else if (session.selectedService === 'socode') {
            session.step = 'enter_meter_number';
            response = session.language === 'en'
              ? `*SOCODE Electricity*\n\nPlease enter your meter number:\n\nExample: 12345678`
              : `*Courant SOCODE*\n\nVeuillez entrer votre numéro de compteur :\n\nExemple : 12345678`;
          } else {
            // Canal+ and DSTV need country selection
            session.step = 'choose_region';
            response = session.language === 'en'
              ? `*Service: ${session.selectedService.toUpperCase()}*\n\nChoose your country:\n\n1. DR Congo\n2. Rwanda\n3. Burundi\n\nReply with your choice.`
              : `*Service : ${session.selectedService.toUpperCase()}*\n\nChoisissez votre pays :\n\n1. RD Congo\n2. Rwanda\n3. Burundi\n\nRépondez avec votre choix.`;
          }
        } else {
          response = session.language === 'en' 
            ? 'Please choose a valid service (1-7)' 
            : 'Veuillez choisir un service valide (1-7)';
        }
        break;
        
      case 'choose_telecom_type':
        if (text === '1') {
          session.step = 'choose_bulk_units';
          response = session.language === 'en'
            ? `*${session.selectedService.toUpperCase()} Bulk Units:*\n\n1. 1000 units $9.55\n2. 2000 units $19.1\n3. 5000 units $47.75\n4. 10000 units $95.5\n5. 20000 units $191\n6. 50000 units $477.5\n\nReply with your choice.`
            : `*Unités ${session.selectedService.toUpperCase()} en gros*\n\n1. 1000 unités $9.55\n2. 2000 unités $19.1\n3. 5000 unités $47.75\n4. 10000 unités $95.5\n5. 20000 unités $191\n6. 50000 unités $477.5\n\nRépondez avec votre choix.`;
        } else if (text === '2') {
          session.step = 'choose_package_type';
          response = session.language === 'en'
            ? `*${session.selectedService.toUpperCase()} Packages:*\n\n1. Internet & SMS\n2. Call Minutes\n\nReply with your choice.`
            : `*Forfaits ${session.selectedService.toUpperCase()}*\n\n1. Internet et SMS\n2. Minutes d'appel\n\nRépondez avec votre choix.`;
        } else {
          response = session.language === 'en' 
            ? 'Please choose 1 or 2' 
            : 'Veuillez choisir 1 ou 2';
        }
        break;
        
      case 'choose_package_type':
        if (text === '1') {
          session.step = 'choose_internet_package';
          response = session.language === 'en'
            ? `*Internet & SMS Packages:*\n\n1. 1GB 48h $1\n2. 2GB 48h $1.2\n3. 18GB 1 month $10\n4. 900 SMS 1 month $1\n\nReply with your choice.`
            : `*Internet et SMS*\n\n1. 1GB 48h $1\n2. 2GB 48h $1.2\n3. 18GB 1 mois $10\n4. 900 SMS 1 mois $1\n\nRépondez avec votre choix.`;
        } else if (text === '2') {
          session.step = 'choose_minutes_package';
          response = session.language === 'en'
            ? `*Call Minutes:*\n\n1. 16 minutes $1\n2. 45 minutes 7 days $3\n3. 42 minutes 7 days (all networks) $3\n\nReply with your choice.`
            : `*Minutes d'appel*\n\n1. 16 minutes $1\n2. 45 minutes 7 jours $3\n3. 42 minutes 7 jours (tous réseaux) $3\n\nRépondez avec votre choix.`;
        } else {
          response = session.language === 'en' 
            ? 'Please choose 1 or 2' 
            : 'Veuillez choisir 1 ou 2';
        }
        break;
        
      case 'enter_meter_number':
        if (text.length >= 6) {
          session.meterNumber = text;
          session.step = 'choose_socode_amount';
          response = session.language === 'en'
            ? `*SOCODE Electricity*\n*Meter: ${text}*\n\nChoose amount:\n\n1. 5000 FC\n2. 10000 FC\n3. 15000 FC\n4. 20000 FC\n5. 50000 FC\n6. 100000 FC\n\nReply with your choice.`
            : `*Courant SOCODE*\n*Compteur : ${text}*\n\nChoisissez le montant :\n\n1. 5000 FC\n2. 10000 FC\n3. 15000 FC\n4. 20000 FC\n5. 50000 FC\n6. 100000 FC\n\nRépondez avec votre choix.`;
        } else {
          response = session.language === 'en'
            ? 'Please enter a valid meter number (at least 6 digits)'
            : 'Veuillez entrer un numéro de compteur valide (au moins 6 chiffres)';
        }
        break;
        
      default:
        // Handle all package selections and create orders
        const orderId = 'AF' + Date.now().toString().slice(-6);
        response = session.language === 'en'
          ? `*ORDER CONFIRMED*\n\nOrder ID: ${orderId}\n\nPayment Instructions:\nSend payment via Mobile Money to:\n+250796552804\n\nInclude reference: ${orderId}\n\nYour service will be activated within 30 minutes.`
          : `*COMMANDE CONFIRMÉE*\n\nID Commande : ${orderId}\n\nInstructions de paiement :\nEnvoyez le paiement via Mobile Money à :\n+250796552804\n\nIncluez la référence : ${orderId}\n\nVotre service sera activé dans les 30 minutes.`;
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