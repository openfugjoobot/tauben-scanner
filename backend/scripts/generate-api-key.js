// scripts/generate-api-key.js - Generate secure API keys
const crypto = require('crypto');

function generateApiKey(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

function main() {
  console.log('=== API Key Generator ===\n');
  
  const key = generateApiKey();
  const shortKey = key.substring(0, 32) + '...';
  
  console.log('Generated API Key:');
  console.log('------------------');
  console.log(key);
  console.log('------------------\n');
  
  console.log('Add this to your .env file:');
  console.log(`API_KEY=${key}\n`);
  
  console.log('Usage with curl:');
  console.log(`curl -H "X-API-Key: ${key}" http://localhost:3000/api/pigeons\n`);
  
  console.log('Usage with Authorization header:');
  console.log(`curl -H "Authorization: Bearer ${key}" http://localhost:3000/api/pigeons\n`);
  
  console.log('Key details:');
  console.log(`- Length: ${key.length} characters`);
  console.log(`- Format: Hex encoded random bytes`);
  console.log(`- Preview: ${shortKey}`);
}

if (require.main === module) {
  main();
}

module.exports = { generateApiKey };
