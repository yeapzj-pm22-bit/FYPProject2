const CordaClient = require('../../blockchain/corda/cordaClient');
const PatientContractInterface = require('../../blockchain/contracts/PatientContract');

class CordaService {
  constructor() {
    this.cordaClient = new CordaClient();
    this.patientContract = new PatientContractInterface(this.cordaClient);
    this.isInitialized = false;
  }

  // Initialize service (BACKEND ONLY)
  async initialize() {
    try {
      await this.cordaClient.initialize();
      this.isInitialized = true;
      console.log('✅ Corda service initialized');
    } catch (error) {
      console.error('❌ Corda service initialization failed:', error);
      throw error;
    }
  }

  // Register patient with blockchain + blind signatures (BACKEND ONLY)
  async registerPatientWithPrivacy(userData, blindSignatureSessionId) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Encrypt sensitive data before blockchain storage
      const encryptedData = await this.encryptSensitiveData(userData);

      const patientData = {
        anonymousId: userData.anonymousId,
        encryptedData: encryptedData,
        consentHash: this.generateConsentHash(userData.consent),
        blindSignatureSessionId: blindSignatureSessionId
      };

      // Register on blockchain
      const result = await this.patientContract.registerPatient(patientData);

      return {
        success: true,
        blockchainTransactionId: result.transactionId,
        patientStateRef: result.patientStateRef,
        privacyProtected: true,
        blindSignatureUsed: true
      };
    } catch (error) {
      console.error('❌ Blockchain patient registration failed:', error);
      throw error;
    }
  }

  // Helper method for encryption (BACKEND ONLY)
  async encryptSensitiveData(data) {
    const crypto = require('crypto');
    const algorithm = 'aes-256-gcm';
    const key = process.env.ENCRYPTION_KEY; // 32 bytes key
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipher(algorithm, key, iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
      encrypted: encrypted,
      iv: iv.toString('hex')
    };
  }

  // Generate consent hash (BACKEND ONLY)
  generateConsentHash(consentData) {
    const crypto = require('crypto');
    return crypto.createHash('sha256')
      .update(JSON.stringify(consentData))
      .digest('hex');
  }
}

module.exports = CordaService;
