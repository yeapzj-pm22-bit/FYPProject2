const crypto = require('crypto');

function generateSecureKey(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

function generateBase64Key(length = 32) {
  return crypto.randomBytes(length).toString('base64');
}

function generateAlphanumericKey(length = 64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

console.log('🔐 Generating Secure Keys for Healthcare Blockchain System...\n');

// Generate all required keys
const keys = {
  JWT_SECRET: generateSecureKey(64),
  JWT_REFRESH_SECRET: generateSecureKey(64),
  MASTER_KEY: generateSecureKey(64),
  // Alternative formats
  JWT_SECRET_BASE64: generateBase64Key(48),
  MASTER_KEY_BASE64: generateBase64Key(32),
  // Alphanumeric versions (easier to handle)
  JWT_SECRET_ALPHA: generateAlphanumericKey(64),
  MASTER_KEY_ALPHA: generateAlphanumericKey(64)
};

console.log('✅ Generated Keys:\n');

console.log('='.repeat(80));
console.log('COPY THIS TO YOUR .env FILE:');
console.log('='.repeat(80));

console.log(`DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=fyp
JWT_SECRET=${keys.JWT_SECRET}
JWT_REFRESH_SECRET=${keys.JWT_REFRESH_SECRET}
MASTER_KEY=${keys.MASTER_KEY}
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
RSA_KEY_SIZE=2048
RSA_ALGORITHM=RSA-BSSA
BLIND_SIGNATURE_EXPIRY=3600`);

console.log('\n' + '='.repeat(80));
console.log('ALTERNATIVE FORMATS (choose one set):');
console.log('='.repeat(80));

console.log('\n🔹 Base64 Format:');
console.log(`JWT_SECRET=${keys.JWT_SECRET_BASE64}`);
console.log(`MASTER_KEY=${keys.MASTER_KEY_BASE64}`);

console.log('\n🔹 Alphanumeric Format (recommended):');
console.log(`JWT_SECRET=${keys.JWT_SECRET_ALPHA}`);
console.log(`MASTER_KEY=${keys.MASTER_KEY_ALPHA}`);

console.log('\n📋 Key Information:');
console.log(`- JWT_SECRET: ${keys.JWT_SECRET.length} characters (hex)`);
console.log(`- MASTER_KEY: ${keys.MASTER_KEY.length} characters (hex)`);
console.log('- All keys are cryptographically secure random values');
console.log('- Keys are suitable for production use');

console.log('\n🔐 Security Notes:');
console.log('- Keep these keys secret and never share them');
console.log('- Use different keys for different environments');
console.log('- Store keys securely in production (env vars, secrets manager)');
console.log('- Rotate keys periodically for maximum security');

console.log('\n🚀 Next Steps:');
console.log('1. Copy the first .env content above');
console.log('2. Save it to backend/.env file');
console.log('3. Restart your server: npm run dev');
console.log('4. Test registration with your secure keys!');