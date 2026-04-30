const { createClient } = require('@libsql/client');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initSchema() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function seedAdmin() {
  try {
    console.log('🌱 Seeding admin user...');
    
    await initSchema();
    console.log('✅ Schema initialized');
    
    const email = process.env.ADMIN_EMAIL || 'admin@afriquesolution.site';
    const password = process.env.ADMIN_PASSWORD || 'Afrique2025!Secure';
    
    const passwordHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
    
    const id = crypto.randomUUID();
    
    const existing = await db.execute({
      sql: 'SELECT * FROM admin_users WHERE email = ?',
      args: [email]
    });
    
    if (existing.rows.length > 0) {
      console.log('⚠️  Admin user already exists, updating password...');
      await db.execute({
        sql: 'UPDATE admin_users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?',
        args: [passwordHash, email]
      });
      console.log('✅ Admin password updated');
    } else {
      await db.execute({
        sql: 'INSERT INTO admin_users (id, email, password_hash, name) VALUES (?, ?, ?, ?)',
        args: [id, email, passwordHash, 'Admin']
      });
      console.log('✅ Admin user created');
    }
    
    console.log('\n📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('\n✅ Seeding complete!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedAdmin();
