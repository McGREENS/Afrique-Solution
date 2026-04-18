#!/usr/bin/env node

// FINAL WhatsApp Bot with ALL 7 Services - April 2026
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('🚀 FINAL BOT STARTING - 7 SERVICES INCLUDED');
console.log('📅 Version: April 2026 - Complete');

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "afrique-final-bot-2026"
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

const userSessions = new Map();

client.on('qr', (qr) => {
  console.log('📱 SCAN QR CODE FOR FINAL BOT:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ FINAL BOT READY - 7 SERVICES ACTIVE');
});

client.on('message', async (message) => {
  if (message.fromMe) return;
  
  try {
    const contact = await message.getContact();
    const phone = contact.number;
    const text = message.body.trim();
    
    console.log(`📨 FINAL BOT - Message from ${phone}: ${text}`);
    
    let session = userSessions.get(phone) || {
      phone: phone,
      language: 'fr',
      step: 'choose_language'
    };
    
    let response = '';
    
    if (text.toLowerCase() === 'menu' || text.toLowerCase() === 'restart') {
      session.step = 'choose_language';
      userSessions.set(phone, session);
    }
    
    switch (session.step) {
      case 'choose_language':
        if (text === '1' || text.toLowerCase().includes('english')) {
          session.language = 'en';
          session.step = 'choose_service';
          response = `*Welcome to Afrique Solution*

Choose a service:

1. CANAL+
2. StarTimes
3. DSTV
4. VODACOM (units & packages)
5. Airtel (units & packages)
6. Orange (units & packages)
7. SOCODE Electricity

Reply with the number of your choice.`;
        } else if (text === '2' || text.toLowerCase().includes('français')) {
          session.language = 'fr';
          session.step = 'choose_service';
          response = `*Bienvenue chez Afrique Solution*

Choisissez un service :

1. CANAL+
2. StarTimes
3. DSTV
4. VODACOM (unités et forfaits)
5. Airtel (unités et forfaits)
6. Orange (unités et forfaits)
7. Courant SOCODE

Répondez avec le numéro de votre choix.`;
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
          
          if (session.selectedService === 'startimes') {
            session.step = 'choose_startimes_package';
            response = session.language === 'en' 
              ? `*StarTimes Packages:*

1. Basic $10
2. Super $10/month
3. Super $4/week
4. Super $1.5/day

Reply with your choice.`
              : `*StarTimes*

1. Basic $10
2. Super $10/mois
3. Super $4/semaine
4. Super $1.5/jour

Répondez avec votre choix.`;
          } else if (['vodacom', 'airtel', 'orange'].includes(session.selectedService)) {
            session.step = 'choose_telecom_type';
            response = session.language === 'en'
              ? `*${session.selectedService.toUpperCase()} Services:*

1. Bulk Units
2. Internet & SMS Packages

Reply with your choice.`
              : `*${session.selectedService.toUpperCase()}*

1. Unités en gros
2. Forfaits unité (internet, minutes, SMS)

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
        
      case 'choose_telecom_type':
        if (text === '1') {
          session.step = 'choose_bulk_units';
          response = session.language === 'en'
            ? `*${session.selectedService.toUpperCase()} Bulk Units:*

1. 1000 units $9.55
2. 2000 units $19.1
3. 5000 units $47.75
4. 10000 units $95.5
5. 20000 units $191
6. 50000 units $477.5

Reply with your choice.`
            : `*Unités ${session.selectedService.toUpperCase()} en gros*

1. 1000 unités $9.55
2. 2000 unités $19.1
3. 5000 unités $47.75
4. 10000 unités $95.5
5. 20000 unités $191
6. 50000 unités $477.5

Répondez avec votre choix.`;
        } else if (text === '2') {
          session.step = 'choose_package_type';
          response = session.language === 'en'
            ? `*${session.selectedService.toUpperCase()} Packages:*

1. Internet & SMS
2. Call Minutes

Reply with your choice.`
            : `*Forfaits ${session.selectedService.toUpperCase()}*

1. Internet et SMS
2. Minutes d'appel

Répondez avec votre choix.`;
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
            ? `*Internet & SMS Packages:*

1. 1GB 48h $1
2. 2GB 48h $1.2
3. 18GB 1 month $10
4. 900 SMS 1 month $1

Reply with your choice.`
            : `*Internet et SMS*

1. 1GB 48h $1
2. 2GB 48h $1.2
3. 18GB 1 mois $10
4. 900 SMS 1 mois $1

Répondez avec votre choix.`;
        } else if (text === '2') {
          session.step = 'choose_minutes_package';
          response = session.language === 'en'
            ? `*Call Minutes:*

1. 16 minutes $1
2. 45 minutes 7 days $3
3. 42 minutes 7 days (all networks) $3

Reply with your choice.`
            : `*Minutes d'appel*

1. 16 minutes $1
2. 45 minutes 7 jours $3
3. 42 minutes 7 jours (tous réseaux) $3

Répondez avec votre choix.`;
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
            ? `*SOCODE Electricity*
*Meter: ${text}*

Choose amount:

1. 5000 FC
2. 10000 FC
3. 15000 FC
4. 20000 FC
5. 50000 FC
6. 100000 FC

Reply with your choice.`
            : `*Courant SOCODE*
*Compteur : ${text}*

Choisissez le montant :

1. 5000 FC
2. 10000 FC
3. 15000 FC
4. 20000 FC
5. 50000 FC
6. 100000 FC

Répondez avec votre choix.`;
        } else {
          response = session.language === 'en'
            ? 'Please enter a valid meter number (at least 6 digits)'
            : 'Veuillez entrer un numéro de compteur valide (au moins 6 chiffres)';
        }
        break;
        
      default:
        const orderId = 'AF' + Date.now().toString().slice(-6);
        response = session.language === 'en'
          ? `*ORDER CONFIRMED*

Order ID: ${orderId}

Payment Instructions:
Send payment via Mobile Money to:
+250796552804

Include reference: ${orderId}

Your service will be activated within 30 minutes.`
          : `*COMMANDE CONFIRMÉE*

ID Commande : ${orderId}

Instructions de paiement :
Envoyez le paiement via Mobile Money à :
+250796552804

Incluez la référence : ${orderId}

Votre service sera activé dans les 30 minutes.`;
    }
    
    userSessions.set(phone, session);
    
    if (response) {
      await message.reply(response);
      console.log('✅ FINAL BOT - Response sent');
    }
    
  } catch (error) {
    console.error('❌ FINAL BOT Error:', error);
  }
});

client.initialize();