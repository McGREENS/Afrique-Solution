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
      '--disable-sync',
      '--disable-blink-features=AutomationControlled'
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable'
  },
  // Improve connection stability
  webVersionCache: {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
  }
});

// Connection state tracking
let isConnected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 30000; // 30 seconds

// Auto-reconnection function
async function attemptReconnection() {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.log('❌ Max reconnection attempts reached. Manual intervention required.');
    return;
  }
  
  reconnectAttempts++;
  console.log(`🔄 Attempting reconnection ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}...`);
  
  setTimeout(async () => {
    try {
      await client.initialize();
    } catch (error) {
      console.error('❌ Reconnection failed:', error);
      attemptReconnection();
    }
  }, RECONNECT_DELAY);
}

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
  startimes: {
    rwanda: {
      'nova': { name: 'StarTimes Nova', price: 8 },
      'basic': { name: 'StarTimes Basic', price: 12 },
      'smart': { name: 'StarTimes Smart', price: 18 },
      'super': { name: 'StarTimes Super', price: 25 }
    },
    drc: {
      'nova': { name: 'StarTimes Nova', price: 10 },
      'basic': { name: 'StarTimes Basic', price: 15 },
      'smart': { name: 'StarTimes Smart', price: 22 },
      'super': { name: 'StarTimes Super', price: 30 }
    },
    burundi: {
      'nova': { name: 'StarTimes Nova', price: 9 },
      'basic': { name: 'StarTimes Basic', price: 13 },
      'smart': { name: 'StarTimes Smart', price: 20 },
      'super': { name: 'StarTimes Super', price: 28 }
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
      'bulk_units': {
        name: 'Unités Vodacom en gros',
        packages: {
          '1000u': { name: '1000 unités', price: 9.55 },
          '2000u': { name: '2000 unités', price: 19.1 },
          '5000u': { name: '5000 unités', price: 47.75 },
          '10000u': { name: '10000 unités', price: 95.5 },
          '20000u': { name: '20000 unités', price: 191 },
          '50000u': { name: '50000 unités', price: 477.5 }
        }
      },
      'internet_sms': {
        name: 'Internet et SMS',
        packages: {
          '1gb_48h': { name: '1GB 48h', price: 1 },
          '2gb_48h': { name: '2GB 48h', price: 1.2 },
          '18gb_1m': { name: '18GB 1mois', price: 10 },
          '900sms_1m': { name: '900 SMS 1mois', price: 1 }
        }
      },
      'call_minutes': {
        name: 'Minutes d\'appel',
        packages: {
          '16min': { name: '16 minutes', price: 1 },
          '45min_7j': { name: '45min 7j', price: 3 },
          '42min_7j_all': { name: '42min 7j tout réseaux', price: 3 }
        }
      }
    },
    drc: {
      'bulk_units': {
        name: 'Unités Vodacom en gros',
        packages: {
          '1000u': { name: '1000 unités', price: 9.55 },
          '2000u': { name: '2000 unités', price: 19.1 },
          '5000u': { name: '5000 unités', price: 47.75 },
          '10000u': { name: '10000 unités', price: 95.5 },
          '20000u': { name: '20000 unités', price: 191 },
          '50000u': { name: '50000 unités', price: 477.5 }
        }
      },
      'internet_sms': {
        name: 'Internet et SMS',
        packages: {
          '1gb_48h': { name: '1GB 48h', price: 1 },
          '2gb_48h': { name: '2GB 48h', price: 1.2 },
          '18gb_1m': { name: '18GB 1mois', price: 10 },
          '900sms_1m': { name: '900 SMS 1mois', price: 1 }
        }
      },
      'call_minutes': {
        name: 'Minutes d\'appel',
        packages: {
          '16min': { name: '16 minutes', price: 1 },
          '45min_7j': { name: '45min 7j', price: 3 },
          '42min_7j_all': { name: '42min 7j tout réseaux', price: 3 }
        }
      }
    },
    burundi: {
      'bulk_units': {
        name: 'Unités Vodacom en gros',
        packages: {
          '1000u': { name: '1000 unités', price: 9.55 },
          '2000u': { name: '2000 unités', price: 19.1 },
          '5000u': { name: '5000 unités', price: 47.75 },
          '10000u': { name: '10000 unités', price: 95.5 },
          '20000u': { name: '20000 unités', price: 191 },
          '50000u': { name: '50000 unités', price: 477.5 }
        }
      },
      'internet_sms': {
        name: 'Internet et SMS',
        packages: {
          '1gb_48h': { name: '1GB 48h', price: 1 },
          '2gb_48h': { name: '2GB 48h', price: 1.2 },
          '18gb_1m': { name: '18GB 1mois', price: 10 },
          '900sms_1m': { name: '900 SMS 1mois', price: 1 }
        }
      },
      'call_minutes': {
        name: 'Minutes d\'appel',
        packages: {
          '16min': { name: '16 minutes', price: 1 },
          '45min_7j': { name: '45min 7j', price: 3 },
          '42min_7j_all': { name: '42min 7j tout réseaux', price: 3 }
        }
      }
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
      'bulk_units': {
        name: 'Unités Orange en gros',
        packages: {
          '1000u': { name: '1000 unités', price: 9.55 },
          '2000u': { name: '2000 unités', price: 19.1 },
          '5000u': { name: '5000 unités', price: 47.75 },
          '10000u': { name: '10000 unités', price: 95.5 },
          '20000u': { name: '20000 unités', price: 191 },
          '50000u': { name: '50000 unités', price: 477.5 }
        }
      },
      'internet_sms': {
        name: 'Internet et SMS',
        packages: {
          '1gb_48h': { name: '1GB 48h', price: 1 },
          '2gb_48h': { name: '2GB 48h', price: 1.2 },
          '18gb_1m': { name: '18GB 1mois', price: 10 },
          '900sms_1m': { name: '900 SMS 1mois', price: 1 }
        }
      },
      'call_minutes': {
        name: 'Minutes d\'appel',
        packages: {
          '16min': { name: '16 minutes', price: 1 },
          '45min_7j': { name: '45min 7j', price: 3 },
          '42min_7j_all': { name: '42min 7j tout réseaux', price: 3 }
        }
      }
    },
    drc: {
      'bulk_units': {
        name: 'Unités Orange en gros',
        packages: {
          '1000u': { name: '1000 unités', price: 9.55 },
          '2000u': { name: '2000 unités', price: 19.1 },
          '5000u': { name: '5000 unités', price: 47.75 },
          '10000u': { name: '10000 unités', price: 95.5 },
          '20000u': { name: '20000 unités', price: 191 },
          '50000u': { name: '50000 unités', price: 477.5 }
        }
      },
      'internet_sms': {
        name: 'Internet et SMS',
        packages: {
          '1gb_48h': { name: '1GB 48h', price: 1 },
          '2gb_48h': { name: '2GB 48h', price: 1.2 },
          '18gb_1m': { name: '18GB 1mois', price: 10 },
          '900sms_1m': { name: '900 SMS 1mois', price: 1 }
        }
      },
      'call_minutes': {
        name: 'Minutes d\'appel',
        packages: {
          '16min': { name: '16 minutes', price: 1 },
          '45min_7j': { name: '45min 7j', price: 3 },
          '42min_7j_all': { name: '42min 7j tout réseaux', price: 3 }
        }
      }
    },
    burundi: {
      'bulk_units': {
        name: 'Unités Orange en gros',
        packages: {
          '1000u': { name: '1000 unités', price: 9.55 },
          '2000u': { name: '2000 unités', price: 19.1 },
          '5000u': { name: '5000 unités', price: 47.75 },
          '10000u': { name: '10000 unités', price: 95.5 },
          '20000u': { name: '20000 unités', price: 191 },
          '50000u': { name: '50000 unités', price: 477.5 }
        }
      },
      'internet_sms': {
        name: 'Internet et SMS',
        packages: {
          '1gb_48h': { name: '1GB 48h', price: 1 },
          '2gb_48h': { name: '2GB 48h', price: 1.2 },
          '18gb_1m': { name: '18GB 1mois', price: 10 },
          '900sms_1m': { name: '900 SMS 1mois', price: 1 }
        }
      },
      'call_minutes': {
        name: 'Minutes d\'appel',
        packages: {
          '16min': { name: '16 minutes', price: 1 },
          '45min_7j': { name: '45min 7j', price: 3 },
          '42min_7j_all': { name: '42min 7j tout réseaux', price: 3 }
        }
      }
    }
  },
  socode: {
    rwanda: {
      '5000fc': { name: '5,000 FC', price: 5 },
      '10000fc': { name: '10,000 FC', price: 10 },
      '15000fc': { name: '15,000 FC', price: 15 },
      '20000fc': { name: '20,000 FC', price: 20 },
      '50000fc': { name: '50,000 FC', price: 50 },
      '100000fc': { name: '100,000 FC', price: 100 }
    },
    drc: {
      '5000fc': { name: '5,000 FC', price: 5 },
      '10000fc': { name: '10,000 FC', price: 10 },
      '15000fc': { name: '15,000 FC', price: 15 },
      '20000fc': { name: '20,000 FC', price: 20 },
      '50000fc': { name: '50,000 FC', price: 50 },
      '100000fc': { name: '100,000 FC', price: 100 }
    },
    burundi: {
      '5000fc': { name: '5,000 FC', price: 5 },
      '10000fc': { name: '10,000 FC', price: 10 },
      '15000fc': { name: '15,000 FC', price: 15 },
      '20000fc': { name: '20,000 FC', price: 20 },
      '50000fc': { name: '50,000 FC', price: 50 },
      '100000fc': { name: '100,000 FC', price: 100 }
    }
  }
};

client.on('qr', async (qr) => {
  const timestamp = new Date().toLocaleString();
  console.log(`\n\n🔥 RAILWAY QR CODE - ${timestamp}`);
  console.log('⚡ QR CODE AVAILABLE ON WEBSITE');
  console.log('\n🔗 QR STRING:');
  console.log(qr);
  console.log('\n🌐 Visit: https://afriquesolution.site/admin/whatsapp-qr');
  console.log('📱 Or scan directly from logs');
  
  // Send QR to website API
  try {
    const response = await fetch('https://afriquesolution.site/api/whatsapp/qr', {
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
    await fetch('https://afriquesolution.site/api/whatsapp/qr', {
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
  console.log('💰 Services: Canal+, StarTimes, DSTV, Vodacom, Airtel, Orange, SOCODE');
  console.log('🌍 Countries: Rwanda, DR Congo, Burundi');
  console.log('');
  console.log('⏳ Bot is now live 24/7 on Railway!');
  console.log('');
  
  // Reset reconnection counter on successful connection
  isConnected = true;
  reconnectAttempts = 0;
  
  // Update website status
  try {
    await fetch('https://afriquesolution.site/api/whatsapp/qr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrString: '', status: 'connected' })
    });
  } catch (error) {
    console.log('Website API not available');
  }
});

client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failed:', msg);
  console.log('💡 Session may have expired. Re-authenticate locally and redeploy.');
});

client.on('disconnected', async (reason) => {
  console.log('📱 WhatsApp disconnected:', reason);
  isConnected = false;
  
  // Update website status
  try {
    await fetch('https://afriquesolution.site/api/whatsapp/qr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrString: '', status: 'disconnected' })
    });
  } catch (error) {
    console.log('Website API not available');
  }
  
  // Attempt automatic reconnection
  console.log('🔄 Attempting automatic reconnection...');
  attemptReconnection();
});

// Handle incoming messages with enhanced error handling
client.on('message', async (message) => {
  if (message.fromMe) return;
  
  // Check connection status
  if (!isConnected) {
    console.log('⚠️ Message received but WhatsApp not connected. Attempting reconnection...');
    attemptReconnection();
    return;
  }
  
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
          response = `*Welcome to Afrique Solution*\n\nChoose a service:\n\n1. CANAL+\n2. StarTimes\n3. DSTV\n4. VODACOM (units & packages)\n5. Airtel (units & packages)\n6. Orange (units & packages)\n7. SOCODE Electricity\n\nReply with the number of your choice.`;
        } else if (text === '2' || text.toLowerCase().includes('français') || text.toLowerCase().includes('francais') || text.toLowerCase() === 'fr') {
          session.language = 'fr';
          session.step = 'choose_service';
          response = `*Bienvenue chez Afrique Solution*\n\nChoisissez un service :\n\n1. CANAL+\n2. StarTimes\n3. DSTV\n4. VODACOM (unités et forfaits)\n5. Airtel (unités et forfaits)\n6. Orange (unités et forfaits)\n7. Courant SOCODE\n\nRépondez avec le numéro de votre choix.`;
        } else {
          response = `*Welcome to Afrique Solution*\n*Bienvenue chez Afrique Solution*\n\nPlease choose your language:\nChoisissez votre langue :\n\n1. English\n2. Français\n\nReply with 1 or 2`;
        }
        break;
        
      case 'choose_service':
        const services = ['canal', 'startimes', 'dstv', 'vodacom', 'airtel', 'orange', 'socode'];
        const serviceIndex = parseInt(text) - 1;
        
        if (serviceIndex >= 0 && serviceIndex < services.length) {
          session.selectedService = services[serviceIndex];
          session.step = 'choose_region';
          
          const serviceNames = {
            'canal': 'Canal+',
            'startimes': 'StarTimes',
            'dstv': 'DSTV', 
            'vodacom': 'Vodacom',
            'airtel': 'Airtel',
            'orange': 'Orange',
            'socode': 'SOCODE Electricity'
          };
          
          // Handle all services normally
          response = session.language === 'en' 
            ? `*Service Selected: ${serviceNames[services[serviceIndex]]}*\n\nChoose your country:\n\n1. DR Congo\n2. Rwanda\n3. Burundi\n\nReply with the number of your choice.`
            : `*Service choisi : ${serviceNames[services[serviceIndex]]}*\n\nChoisissez votre pays :\n\n1. RD Congo\n2. Rwanda\n3. Burundi\n\nRépondez avec le numéro de votre choix.`;
        } else {
          response = session.language === 'en' 
            ? 'Please choose a valid service (1-7)' 
            : 'Veuillez choisir un service valide (1-7)';
        }
        break;
        
      case 'choose_region':
        const regions = ['drc', 'rwanda', 'burundi'];
        const regionIndex = parseInt(text) - 1;
        
        if (regionIndex >= 0 && regionIndex < regions.length) {
          session.selectedRegion = regions[regionIndex];
          
          // Handle Vodacom and Orange differently (they have categories)
          if (session.selectedService === 'vodacom' || session.selectedService === 'orange') {
            session.step = 'choose_category';
            
            const categoryNames = {
              'bulk_units': session.language === 'en' ? 'Bulk Units' : 'Unités en gros',
              'internet_sms': session.language === 'en' ? 'Internet & SMS' : 'Internet et SMS',
              'call_minutes': session.language === 'en' ? 'Call Minutes' : 'Minutes d\'appel'
            };
            
            const countryNames = {
              'drc': session.language === 'en' ? 'DR Congo' : 'RD Congo',
              'rwanda': 'Rwanda',
              'burundi': 'Burundi'
            };
            
            response = session.language === 'en'
              ? `*Country: ${countryNames[regions[regionIndex]]}*\n*Service: ${session.selectedService.toUpperCase()}*\n\nChoose a category:\n\n1. ${categoryNames.bulk_units}\n2. ${categoryNames.internet_sms}\n3. ${categoryNames.call_minutes}\n\nReply with the number of your choice.`
              : `*Pays : ${countryNames[regions[regionIndex]]}*\n*Service : ${session.selectedService.toUpperCase()}*\n\nChoisissez une catégorie :\n\n1. ${categoryNames.bulk_units}\n2. ${categoryNames.internet_sms}\n3. ${categoryNames.call_minutes}\n\nRépondez avec le numéro de votre choix.`;
          } else {
            // Handle other services normally
            session.step = 'choose_package';
            
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
          }
        } else {
          response = session.language === 'en' 
            ? 'Please choose a valid country (1-3)' 
            : 'Veuillez choisir un pays valide (1-3)';
        }
        break;
        
      case 'choose_category':
        const categories = ['bulk_units', 'internet_sms', 'call_minutes'];
        const categoryIndex = parseInt(text) - 1;
        
        if (categoryIndex >= 0 && categoryIndex < categories.length) {
          session.selectedCategory = categories[categoryIndex];
          session.step = 'choose_package';
          
          const categoryData = pricing[session.selectedService][session.selectedRegion][categories[categoryIndex]];
          const packageKeys = Object.keys(categoryData.packages);
          
          let packageList = '';
          packageKeys.forEach((key, index) => {
            const pkg = categoryData.packages[key];
            packageList += `${index + 1}. ${pkg.name} - $${pkg.price}\n`;
          });
          
          response = session.language === 'en'
            ? `*Category: ${categoryData.name}*\n\nAvailable packages:\n\n${packageList}\nReply with the number of your choice.`
            : `*Catégorie : ${categoryData.name}*\n\nForfaits disponibles :\n\n${packageList}\nRépondez avec le numéro de votre choix.`;
        } else {
          response = session.language === 'en' 
            ? 'Please choose a valid category (1-3)' 
            : 'Veuillez choisir une catégorie valide (1-3)';
        }
        break;
        
      case 'choose_package':
        let availablePackages, packageKeys;
        
        // Handle Vodacom and Orange with categories
        if (session.selectedService === 'vodacom' || session.selectedService === 'orange') {
          availablePackages = pricing[session.selectedService][session.selectedRegion][session.selectedCategory].packages;
        } else {
          availablePackages = pricing[session.selectedService][session.selectedRegion];
        }
        
        packageKeys = Object.keys(availablePackages);
        const packageIndex = parseInt(text) - 1;
        
        if (packageIndex >= 0 && packageIndex < packageKeys.length) {
          const selectedPackageKey = packageKeys[packageIndex];
          const selectedPackage = availablePackages[selectedPackageKey];
          
          session.selectedPackage = selectedPackageKey;
          session.selectedPackageName = selectedPackage.name;
          session.selectedPrice = selectedPackage.price;
          session.step = 'enter_details';
          
          const isTV = session.selectedService === 'canal' || session.selectedService === 'dstv' || session.selectedService === 'startimes';
          const isElectricity = session.selectedService === 'socode';
          let fieldName, example;
          
          if (isElectricity) {
            fieldName = session.language === 'en' ? 'meter' : 'compteur';
            example = '12345678901';
          } else if (isTV) {
            fieldName = session.language === 'en' ? 'decoder' : 'décodeur';
            example = '24510033256001';
          } else {
            fieldName = session.language === 'en' ? 'phone' : 'téléphone';
            example = '250781234567';
          }
          
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
          session.step = 'confirm_payment';
          
          // Generate exactly 36-character UUID for PawaPay (RFC 4122 format)
          function generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              const r = Math.random() * 16 | 0;
              const v = c == 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            });
          }
          const orderId = generateUUID();
          session.orderId = orderId;
          
          response = session.language === 'en'
            ? `*ORDER CONFIRMATION*\n\nService: ${session.selectedService.toUpperCase()}\nCountry: ${session.selectedRegion.toUpperCase()}\nPackage: ${session.selectedPackageName}\nAmount: $${session.selectedPrice}\nNumber: ${session.decoderNumber}\nOrder ID: ${orderId}\n\n*PAYMENT OPTIONS*\n\n1. Pay with Mobile Money (Automatic)\n2. Manual Payment Instructions\n\nReply with 1 or 2`
            : `*CONFIRMATION DE COMMANDE*\n\nService : ${session.selectedService.toUpperCase()}\nPays : ${session.selectedRegion.toUpperCase()}\nForfait : ${session.selectedPackageName}\nMontant : $${session.selectedPrice}\nNuméro : ${session.decoderNumber}\nID Commande : ${orderId}\n\n*OPTIONS DE PAIEMENT*\n\n1. Payer avec Mobile Money (Automatique)\n2. Instructions de paiement manuel\n\nRépondez avec 1 ou 2`;
        } else {
          response = session.language === 'en' 
            ? 'Please enter a valid number (at least 6 digits)' 
            : 'Veuillez entrer un numéro valide (au moins 6 chiffres)';
        }
        break;
        
      case 'confirm_payment':
        if (text === '1') {
          // Automatic PawaPay payment
          session.step = 'enter_phone';
          response = session.language === 'en'
            ? `*AUTOMATIC PAYMENT*\n\nPlease enter your Mobile Money phone number:\n\nExample: 250781234567\n\nMake sure you have $${session.selectedPrice} in your account.`
            : `*PAIEMENT AUTOMATIQUE*\n\nVeuillez entrer votre numéro Mobile Money :\n\nExemple : 250781234567\n\nAssurez-vous d'avoir $${session.selectedPrice} dans votre compte.`;
        } else if (text === '2') {
          // Manual payment instructions
          session.step = 'payment_complete';
          response = session.language === 'en'
            ? `*MANUAL PAYMENT INSTRUCTIONS*\n\nSend $${session.selectedPrice} via Mobile Money to:\n+250796552804\n\nInclude reference: ${session.orderId}\n\nYour service will be activated within 30 minutes after payment confirmation.\n\nNeed help? Reply "menu" to restart.`
            : `*INSTRUCTIONS DE PAIEMENT MANUEL*\n\nEnvoyez $${session.selectedPrice} via Mobile Money à :\n+250796552804\n\nIncluez la référence : ${session.orderId}\n\nVotre service sera activé dans les 30 minutes après confirmation du paiement.\n\nBesoin d'aide ? Répondez "menu" pour recommencer.`;
        } else {
          response = session.language === 'en' 
            ? 'Please choose 1 for automatic payment or 2 for manual payment' 
            : 'Veuillez choisir 1 pour paiement automatique ou 2 pour paiement manuel';
        }
        break;
        
      case 'enter_phone':
        if (text.length >= 10 && text.match(/^[0-9+]+$/)) {
          session.paymentPhone = text;
          session.step = 'processing_payment';
          
          // Show processing message
          response = session.language === 'en'
            ? `*PROCESSING PAYMENT*\n\nInitiating payment request...\nAmount: $${session.selectedPrice}\nPhone: ${session.paymentPhone}\n\nPlease wait...`
            : `*TRAITEMENT DU PAIEMENT*\n\nInitialisation de la demande de paiement...\nMontant : $${session.selectedPrice}\nTéléphone : ${session.paymentPhone}\n\nVeuillez patienter...`;
          
          // Send processing message first
          await message.reply(response);
          
          // Initiate PawaPay payment
          try {
            const paymentResult = await initiatePawaPay(
              session.selectedPrice,
              session.paymentPhone,
              session.orderId,
              session.selectedRegion
            );
            
            if (paymentResult && paymentResult.status === 'ACCEPTED') {
              response = session.language === 'en'
                ? `*PAYMENT REQUEST SENT*\n\n✅ Payment request sent to ${session.paymentPhone}\n\nPlease check your phone and approve the payment of $${session.selectedPrice}\n\nOrder ID: ${session.orderId}\n\nYour service will be activated automatically after payment confirmation.\n\nNeed help? Reply "menu" to restart.`
                : `*DEMANDE DE PAIEMENT ENVOYÉE*\n\n✅ Demande de paiement envoyée à ${session.paymentPhone}\n\nVeuillez vérifier votre téléphone et approuver le paiement de $${session.selectedPrice}\n\nID Commande : ${session.orderId}\n\nVotre service sera activé automatiquement après confirmation du paiement.\n\nBesoin d'aide ? Répondez "menu" pour recommencer.`;
              session.step = 'payment_complete';
            } else {
              response = session.language === 'en'
                ? `*PAYMENT FAILED*\n\n❌ Unable to process automatic payment.\n\nPlease try manual payment:\nSend $${session.selectedPrice} to +250796552804\nReference: ${session.orderId}\n\nNeed help? Reply "menu" to restart.`
                : `*PAIEMENT ÉCHOUÉ*\n\n❌ Impossible de traiter le paiement automatique.\n\nVeuillez essayer le paiement manuel :\nEnvoyez $${session.selectedPrice} à +250796552804\nRéférence : ${session.orderId}\n\nBesoin d'aide ? Répondez "menu" pour recommencer.`;
              session.step = 'payment_complete';
            }
          } catch (error) {
            console.error('Payment processing error:', error);
            response = session.language === 'en'
              ? `*PAYMENT ERROR*\n\n❌ Payment system temporarily unavailable.\n\nPlease use manual payment:\nSend $${session.selectedPrice} to +250796552804\nReference: ${session.orderId}\n\nNeed help? Reply "menu" to restart.`
              : `*ERREUR DE PAIEMENT*\n\n❌ Système de paiement temporairement indisponible.\n\nVeuillez utiliser le paiement manuel :\nEnvoyez $${session.selectedPrice} à +250796552804\nRéférence : ${session.orderId}\n\nBesoin d'aide ? Répondez "menu" pour recommencer.`;
            session.step = 'payment_complete';
          }
        } else {
          response = session.language === 'en' 
            ? 'Please enter a valid phone number (numbers only, at least 10 digits)' 
            : 'Veuillez entrer un numéro de téléphone valide (chiffres uniquement, au moins 10 chiffres)';
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

// PawaPay integration - PRODUCTION READY WITH CURRENCY CONVERSION
async function initiatePawaPay(amount, phone, orderId, country) {
  try {
    console.log('🔥 PawaPay Request Details:');
    console.log('Amount (USD):', amount);
    console.log('Phone:', phone);
    console.log('OrderID:', orderId, 'Length:', orderId.length);
    console.log('Service Country:', country);
    
    // Detect actual country from phone number
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
    
    // Get currency and convert amount based on phone country
    function getCurrencyAndAmount(phone, usdAmount) {
      const phoneCountry = detectPhoneCountry(phone);
      
      if (phoneCountry === 'rwanda') {
        // Rwanda uses RWF - convert USD to RWF (1 USD = 1400 RWF)
        const rwfAmount = Math.round(parseFloat(usdAmount) * 1400);
        return { currency: 'RWF', amount: rwfAmount.toString(), country: 'RWA' };
      } else if (phoneCountry === 'drc') {
        // DRC uses USD
        return { currency: 'USD', amount: parseFloat(usdAmount).toFixed(2), country: 'COD' };
      } else if (phoneCountry === 'burundi') {
        // Burundi - not supported yet, return null
        return null;
      }
      
      return null;
    }
    
    // Smart correspondent selection based on phone number
    function getCorrespondent(phone) {
      const phoneStr = phone.replace(/[^0-9]/g, '');
      const phoneCountry = detectPhoneCountry(phone);
      
      console.log('📱 Detected phone country:', phoneCountry);
      
      if (phoneCountry === 'rwanda') {
        // Rwanda phone prefixes
        if (phoneStr.startsWith('25078') || phoneStr.startsWith('25079')) {
          return 'MTN_MOMO_RWA'; // MTN Mobile Money
        } else if (phoneStr.startsWith('25072') || phoneStr.startsWith('25073')) {
          return 'AIRTEL_RWA'; // Airtel Money
        } else {
          return 'MTN_MOMO_RWA'; // Default to MTN for Rwanda
        }
      } else if (phoneCountry === 'drc') {
        // DRC phone prefixes - comprehensive mapping
        if (phoneStr.startsWith('243970') || phoneStr.startsWith('243971') || 
            phoneStr.startsWith('243972') || phoneStr.startsWith('243973') ||
            phoneStr.startsWith('243975') || phoneStr.startsWith('243976') ||
            phoneStr.startsWith('243977') || phoneStr.startsWith('243978')) {
          return 'VODACOM_MPESA_COD'; // Vodacom M-Pesa
        } else if (phoneStr.startsWith('243974') || phoneStr.startsWith('243979') ||
                   phoneStr.startsWith('243990') || phoneStr.startsWith('243991') ||
                   phoneStr.startsWith('243992') || phoneStr.startsWith('243993') ||
                   phoneStr.startsWith('243994') || phoneStr.startsWith('243995') ||
                   phoneStr.startsWith('243996') || phoneStr.startsWith('243997') ||
                   phoneStr.startsWith('243998') || phoneStr.startsWith('243999')) {
          return 'AIRTEL_COD'; // Airtel Money
        } else if (phoneStr.startsWith('243980') || phoneStr.startsWith('243981') ||
                   phoneStr.startsWith('243982') || phoneStr.startsWith('243983') ||
                   phoneStr.startsWith('243984') || phoneStr.startsWith('243985')) {
          return 'ORANGE_COD'; // Orange Money
        } else {
          return 'VODACOM_MPESA_COD'; // Default to Vodacom for DRC
        }
      }
      
      return null;
    }
    
    const phoneCountry = detectPhoneCountry(phone);
    const correspondent = getCorrespondent(phone);
    const currencyInfo = getCurrencyAndAmount(phone, amount);
    
    if (!phoneCountry || !correspondent || !currencyInfo) {
      console.error('❌ Unable to process payment for phone:', phone);
      return { 
        status: 'FAILED', 
        error: 'Invalid phone number or unsupported country. Please use Rwanda (250) or DRC (243) number.' 
      };
    }
    
    console.log('📱 Phone country:', phoneCountry);
    console.log('💳 Correspondent:', correspondent);
    console.log('💰 Currency:', currencyInfo.currency);
    console.log('💵 Amount:', currencyInfo.amount, currencyInfo.currency);
    if (currencyInfo.currency === 'RWF') {
      console.log('💱 Converted from USD', amount, 'to RWF', currencyInfo.amount, '(rate: 1 USD = 1400 RWF)');
    }
    
    // Build request body
    const requestBody = {
      depositId: orderId,
      amount: currencyInfo.amount,
      currency: currencyInfo.currency,
      correspondent: correspondent,
      payer: {
        type: 'MSISDN',
        address: {
          value: phone.replace(/[^0-9]/g, '')
        }
      },
      customerTimestamp: new Date().toISOString(),
      statementDescription: 'Afrique Solution'
    };
    
    console.log('🔥 PawaPay Request Body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.pawapay.io/deposits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjI3NDgiLCJtYXYiOiIxIiwiZXhwIjoyMDkyMjM1MTgxLCJpYXQiOjE3NzY2MTU5ODEsInBtIjoiREFGLFBBRiIsImp0aSI6IjFjZjAwZDZmLWEwNGUtNDg5Ny04ODU0LTg0ZjcyNWM3ZjZkMCJ9.zHM0XXJ4guqPCp8phmGxvEX2MbP5t7ryz60Ak94BrQIeqfhheU3mziBGUHkRpeS3JI3gpNmVaObHpkXwIutNpw'
      },
      body: JSON.stringify(requestBody)
    });
    
    const result = await response.json();
    console.log('🔥 PawaPay API Response Status:', response.status);
    console.log('🔥 PawaPay API Response:', JSON.stringify(result, null, 2));
    
    if (response.ok && (result.status === 'ACCEPTED' || result.status === 'SUBMITTED')) {
      return { status: 'ACCEPTED', ...result };
    } else {
      console.error('❌ PawaPay API Error:', result);
      return { status: 'FAILED', error: result };
    }
  } catch (error) {
    console.error('❌ PawaPay Network Error:', error);
    return { status: 'FAILED', error: error.message };
  }
}

// Initialize
console.log('🔄 Initializing WhatsApp Web Client...');
client.initialize();