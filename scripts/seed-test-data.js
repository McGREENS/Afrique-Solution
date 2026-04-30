#!/usr/bin/env node

const { createClient } = require("@libsql/client");
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const db = createClient(
  process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN
    ? {
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }
    : {
        url: "file:local.db",
      }
);

async function seed() {
  console.log('🌱 Seeding test data...');

  try {
    // Add test WhatsApp messages
    const messages = [
      { phone: '250780115764', message: 'Hello', direction: 'incoming' },
      { phone: '250789773232', message: 'Menu', direction: 'incoming' },
      { phone: '250780115764', message: '1', direction: 'incoming' },
      { phone: '243970123456', message: 'Bonjour', direction: 'incoming' },
      { phone: '250789773232', message: '2', direction: 'incoming' },
    ];

    for (const msg of messages) {
      const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await db.execute({
        sql: `INSERT INTO whatsapp_messages (id, phone, message, direction, created_at) VALUES (?, ?, ?, ?, ?)`,
        args: [id, msg.phone, msg.message, msg.direction, new Date().toISOString()]
      });
    }
    console.log(`✅ Added ${messages.length} WhatsApp messages`);

    // Add test website visits
    const visits = [
      { page: '/', ip: '192.168.1.1' },
      { page: '/services', ip: '192.168.1.2' },
      { page: '/about', ip: '192.168.1.1' },
      { page: '/', ip: '192.168.1.3' },
      { page: '/contact', ip: '192.168.1.4' },
      { page: '/', ip: '192.168.1.5' },
      { page: '/services', ip: '192.168.1.6' },
    ];

    for (const visit of visits) {
      const id = `visit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await db.execute({
        sql: `INSERT INTO website_visits (id, page, ip, user_agent, created_at) VALUES (?, ?, ?, ?, ?)`,
        args: [id, visit.page, visit.ip, 'Mozilla/5.0', new Date().toISOString()]
      });
    }
    console.log(`✅ Added ${visits.length} website visits`);

    // Add test manual payments
    const payments = [
      { service: 'Canal+', package_name: 'ACCES', amount: 10, phone: '250780115764' },
      { service: 'StarTimes', package_name: 'Basic', amount: 15, phone: '250789773232' },
      { service: 'Vodacom', package_name: '1GB Data', amount: 3, phone: '243970123456' },
    ];

    for (const payment of payments) {
      const id = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await db.execute({
        sql: `INSERT INTO manual_payments (id, service, package_name, amount, phone, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [id, payment.service, payment.package_name, payment.amount, payment.phone, new Date().toISOString()]
      });
    }
    console.log(`✅ Added ${payments.length} manual payments`);

    console.log('\n🎉 Test data seeded successfully!');
    console.log('\n📊 Dashboard Stats:');
    console.log(`   - ${messages.length} WhatsApp messages`);
    console.log(`   - ${visits.length} website visits`);
    console.log(`   - ${payments.length} payments ($${payments.reduce((sum, p) => sum + p.amount, 0)})`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
