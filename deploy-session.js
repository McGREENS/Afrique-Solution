#!/usr/bin/env node

// Deploy Working Local Session to Railway
const fs = require('fs');
const path = require('path');

console.log('📦 PACKAGING LOCAL SESSION FOR RAILWAY');

// Check if local session exists
const localSessionPath = path.join(__dirname, '.wwebjs_auth', 'session-afrique-solution-railway');

if (fs.existsSync(localSessionPath)) {
  console.log('✅ Found local authenticated session');
  
  // Create deployment package
  const deployPath = path.join(__dirname, 'railway-session');
  
  if (!fs.existsSync(deployPath)) {
    fs.mkdirSync(deployPath, { recursive: true });
  }
  
  // Copy session files
  console.log('📁 Copying session files...');
  
  // Simple copy function
  function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      const files = fs.readdirSync(src);
      files.forEach(file => {
        copyRecursive(path.join(src, file), path.join(dest, file));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  }
  
  copyRecursive(localSessionPath, path.join(deployPath, 'session-afrique-solution-railway'));
  
  console.log('✅ Session packaged successfully!');
  console.log('📤 Now commit and push to Railway:');
  console.log('');
  console.log('git add railway-session/');
  console.log('git commit -m "Add working session files"');
  console.log('git push origin main');
  console.log('');
  
} else {
  console.log('❌ No local session found');
  console.log('💡 Run: node local-auth.js first');
}