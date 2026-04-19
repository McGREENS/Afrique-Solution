#!/usr/bin/env node

// Test script to check available PawaPay correspondents

async function checkAvailableCorrespondents() {
  console.log('🔍 Checking available PawaPay correspondents...\n');
  
  const token = 'eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjI3NDgiLCJtYXYiOiIxIiwiZXhwIjoyMDkyMjM1MTgxLCJpYXQiOjE3NzY2MTU5ODEsInBtIjoiREFGLFBBRiIsImp0aSI6IjFjZjAwZDZmLWEwNGUtNDg5Ny04ODU0LTg0ZjcyNWM3ZjZkMCJ9.zHM0XXJ4guqPCp8phmGxvEX2MbP5t7ryz60Ak94BrQIeqfhheU3mziBGUHkRpeS3JI3gpNmVaObHpkXwIutNpw';
  
  try {
    // Get active configurations
    const response = await fetch('https://api.pawapay.io/active-conf', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    
    console.log('📊 PawaPay API Response Status:', response.status);
    console.log('\n📋 Available Correspondents:\n');
    console.log(JSON.stringify(result, null, 2));
    
    if (result && Array.isArray(result)) {
      console.log('\n\n✅ ACTIVE CORRESPONDENTS SUMMARY:\n');
      result.forEach((config, index) => {
        console.log(`${index + 1}. ${config.correspondent} - ${config.country} - ${config.currency}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAvailableCorrespondents();
