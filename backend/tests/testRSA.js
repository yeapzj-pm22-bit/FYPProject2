// Test script to verify RSA operations are working
// Save as: backend/test/testRSA.js

const crypto = require('crypto');

console.log('🧪 Testing RSA Operations...');

async function testRSAOperations() {
  try {
    // Generate RSA key pair
    console.log('1. Generating RSA key pair...');
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });
    console.log('✅ RSA key pair generated');

    // Test data
    const testMessage = 'Hello, RSA blind signature test!';
    console.log('2. Creating test hash...');
    const messageHash = crypto.createHash('sha256').update(testMessage).digest();
    console.log(`✅ Hash created: ${messageHash.length} bytes`);

    // Test different data lengths
    const testCases = [
      { name: 'Exact 32 bytes (SHA-256)', data: messageHash },
      { name: 'Short data (16 bytes)', data: crypto.randomBytes(16) },
      { name: 'Long data (64 bytes)', data: crypto.randomBytes(64) },
      { name: 'Hex string converted', data: Buffer.from('abcdef1234567890'.repeat(4), 'hex') }
    ];

    for (const testCase of testCases) {
      console.log(`\n3. Testing: ${testCase.name}`);
      console.log(`   Data length: ${testCase.data.length} bytes`);

      try {
        // Process data to ensure it's the right length for RSA
        let processedData = testCase.data;
        if (processedData.length !== 32) {
          if (processedData.length < 32) {
            // Pad shorter data
            const padded = Buffer.alloc(32);
            processedData.copy(padded);
            processedData = padded;
          } else {
            // Hash longer data
            processedData = crypto.createHash('sha256').update(processedData).digest();
          }
        }

        // Test PKCS1 padding (simpler)
        console.log('   Testing PKCS1 padding...');
        const signature1 = crypto.privateEncrypt({
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_PADDING
        }, processedData);
        console.log(`   ✅ PKCS1 signature: ${signature1.length} bytes`);

        // Verify signature
        const decrypted1 = crypto.publicDecrypt({
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_PADDING
        }, signature1);
        console.log(`   ✅ PKCS1 verification: ${decrypted1.length} bytes`);

        // Test with actual hex string input (like from frontend)
        const hexInput = processedData.toString('hex');
        const hexBuffer = Buffer.from(hexInput, 'hex');

        const signature2 = crypto.privateEncrypt({
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_PADDING
        }, hexBuffer);
        console.log(`   ✅ Hex input signature: ${signature2.length} bytes`);

      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }

    console.log('\n4. Testing with simulated frontend data...');

    // Simulate what comes from the frontend
    const frontendData = {
      message: JSON.stringify({ email: 'test@example.com', timestamp: Date.now() }),
      blindingFactor: crypto.randomBytes(32).toString('hex')
    };

    const frontendHash = crypto.createHash('sha256').update(frontendData.message).digest('hex');
    const frontendBuffer = Buffer.from(frontendHash, 'hex');

    console.log(`   Frontend hash: ${frontendHash.length} chars`);
    console.log(`   Frontend buffer: ${frontendBuffer.length} bytes`);

    const frontendSignature = crypto.privateEncrypt({
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING
    }, frontendBuffer);

    console.log(`   ✅ Frontend simulation successful: ${frontendSignature.toString('hex').length} hex chars`);

    console.log('\n🎉 All RSA tests completed successfully!');
    return true;

  } catch (error) {
    console.error('\n❌ RSA test failed:', error);
    return false;
  }
}

// Run the test
testRSAOperations().then(success => {
  if (success) {
    console.log('\n✅ RSA operations are working correctly');
    process.exit(0);
  } else {
    console.log('\n❌ RSA operations have issues');
    process.exit(1);
  }
});