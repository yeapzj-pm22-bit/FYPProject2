// backend/services/blockchain/blockchainService.js
const crypto = require('crypto');
const fetch = require('node-fetch');

class BlockchainService {
  constructor() {
    this.springBootUrl = process.env.SPRING_BOOT_URL || 'http://localhost:8080';
    this.fallbackMode = process.env.BLOCKCHAIN_FALLBACK_MODE === 'true';
    this.enabled = process.env.BLOCKCHAIN_SERVICE_ENABLED === 'true';
    this.initialized = false;
  }

  // Initialize connection to Spring Boot blockchain service
  async initialize() {
    try {
      console.log('🔗 Initializing blockchain service connection...');

      if (!this.enabled) {
        console.log('🎭 Blockchain service disabled, using simulation mode');
        this.initialized = false;
        return;
      }

      // Test connection to Spring Boot blockchain API
      const response = await fetch(`${this.springBootUrl}/api/blockchain/health`, {
        timeout: 5000 // 5 second timeout
      });

      if (response.ok) {
        const health = await response.json();
        console.log('✅ Connected to Spring Boot blockchain service:', health.service);
        console.log('📊 Corda Available:', health.cordaAvailable);
        console.log('🌐 Network Info:', health.networkInfo);
        this.initialized = true;
      } else {
        throw new Error(`Spring Boot service not available: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Failed to initialize blockchain service:', error.message);
      if (this.fallbackMode) {
        console.log('🎭 Running in fallback simulation mode');
        this.initialized = false;
      } else {
        throw error;
      }
    }
  }

  // Create blockchain registration record
  async createRegistration(registrationData) {
    try {
      // Try Spring Boot service first if available
      if (this.initialized) {
        console.log('🔗 Creating Corda blockchain registration via Spring Boot...');
        return await this.createCordaRegistration(registrationData);
      } else if (this.fallbackMode) {
        console.log('🎭 Using simulated blockchain registration');
        return this.simulateBlockchainRegistration(registrationData);
      } else {
        throw new Error('Blockchain service not available and fallback disabled');
      }
    } catch (error) {
      console.error('❌ Blockchain registration failed:', error);

      if (this.fallbackMode) {
        console.log('🎭 Falling back to simulation mode');
        return this.simulateBlockchainRegistration(registrationData);
      } else {
        return {
          success: false,
          message: error.message,
          error: error.name
        };
      }
    }
  }

  // Create registration via Spring Boot Corda service
  async createCordaRegistration(registrationData) {
    const {
      email,
      sessionId,
      signatureHash,
      identityCommitment,
      registrationType = 'PATIENT_BLIND_SIGNATURE'
    } = registrationData;

    // Prepare blockchain data (privacy-preserving)
    const blockchainData = {
      email,           // Used only for commitment generation, not stored
      sessionId,
      signatureHash,
      identityCommitment,
      registrationType
    };

    console.log('📤 Sending to Spring Boot:', {
      ...blockchainData,
      email: email.substring(0, 3) + '***' // Log safely
    });

    // Call Spring Boot blockchain API
    const response = await fetch(`${this.springBootUrl}/api/blockchain/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blockchainData),
      timeout: 30000 // 30 second timeout for blockchain operations
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    if (result.success) {
      console.log('✅ Corda blockchain registration completed:', {
        blockId: result.blockId,
        cordaAvailable: result.cordaAvailable
      });

      return {
        success: true,
        cordaTransactionId: result.blockId,
        blockId: result.blockId,
        blockHash: result.blockHash,
        identityCommitment: result.identityCommitment,
        blockchainAddress: this.generateBlockchainAddress(result.identityCommitment),
        timestamp: result.timestamp || new Date().toISOString(),
        privacyLevel: result.privacyLevel || 'PSEUDONYMOUS',
        immutable: result.immutable !== false,
        chainVerified: result.chainVerified !== false,
        complianceProof: result.complianceHash || this.generateComplianceProof(sessionId),
        fallbackMode: false
      };
    } else {
      throw new Error(`Corda registration failed: ${result.message}`);
    }
  }

  // Verify registration on blockchain
  async verifyRegistration(blockId) {
    try {
      if (!this.initialized) {
        return this.simulateVerification(blockId);
      }

      console.log('🔍 Verifying Corda registration:', blockId);

      const response = await fetch(`${this.springBootUrl}/api/blockchain/verify/${blockId}`, {
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        verified: result.verified,
        blockId: result.blockId,
        blockHash: result.blockHash,
        timestamp: result.timestamp,
        immutable: result.immutable !== false,
        chainIntegrity: result.chainIntegrity !== false,
        cordaVerified: true
      };

    } catch (error) {
      console.error('❌ Verification failed:', error);

      if (this.fallbackMode) {
        return this.simulateVerification(blockId);
      } else {
        return {
          verified: false,
          message: error.message,
          cordaVerified: false
        };
      }
    }
  }

  // Get registration statistics
  async getRegistrationStats() {
    try {
      if (!this.initialized) {
        return this.simulateStats();
      }

      const response = await fetch(`${this.springBootUrl}/api/blockchain/stats`, {
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const stats = await response.json();

      return {
        success: true,
        totalBlocks: stats.totalBlocks || 0,
        registrationBlocks: stats.registrationBlocks || 0,
        chainIntegrity: stats.chainIntegrity !== false,
        algorithm: stats.algorithm || 'Corda Consensus',
        networkType: stats.networkType || 'Corda Healthcare Network',
        cordaAvailable: true
      };

    } catch (error) {
      console.error('❌ Stats query failed:', error);
      return this.simulateStats();
    }
  }

  // Utility methods
  generateBlockchainAddress(identityCommitment) {
    const hash = crypto.createHash('sha256')
      .update(identityCommitment || Date.now().toString())
      .digest('hex');
    return '0x' + hash.substring(0, 40);
  }

  generateComplianceProof(sessionId) {
    const complianceData = `compliance_${sessionId}_${Date.now()}`;
    return crypto.createHash('sha256').update(complianceData).digest('hex');
  }

  // Fallback simulation methods
  simulateBlockchainRegistration(registrationData) {
    console.log('🎭 Simulating blockchain registration...');

    const mockResult = {
      success: true,
      cordaTransactionId: `sim_corda_${Date.now()}`,
      blockId: `sim_block_${Date.now()}`,
      blockHash: crypto.randomBytes(32).toString('hex'),
      identityCommitment: crypto.createHash('sha256')
        .update(registrationData.email + '_' + Date.now())
        .digest('hex'),
      blockchainAddress: '0x' + crypto.randomBytes(20).toString('hex'),
      timestamp: new Date().toISOString(),
      privacyLevel: 'PSEUDONYMOUS',
      immutable: false, // Simulated
      chainVerified: false, // Simulated
      complianceProof: this.generateComplianceProof(registrationData.sessionId),
      fallbackMode: true
    };

    return mockResult;
  }

  simulateVerification(blockId) {
    return {
      verified: true,
      blockId: blockId,
      blockHash: crypto.randomBytes(32).toString('hex'),
      timestamp: new Date().toISOString(),
      immutable: false,
      chainIntegrity: true,
      cordaVerified: false,
      simulatedMode: true
    };
  }

  simulateStats() {
    return {
      success: true,
      totalBlocks: Math.floor(Math.random() * 100) + 10,
      registrationBlocks: Math.floor(Math.random() * 50) + 5,
      chainIntegrity: true,
      algorithm: 'Simulated Consensus',
      networkType: 'Simulated Healthcare Network',
      cordaAvailable: false
    };
  }

  // Health check
  async healthCheck() {
    const health = {
      service: 'Node.js Blockchain Service',
      timestamp: new Date().toISOString(),
      springBootConnected: this.initialized,
      fallbackMode: this.fallbackMode,
      enabled: this.enabled
    };

    if (this.initialized) {
      try {
        const response = await fetch(`${this.springBootUrl}/api/blockchain/health`, {
          timeout: 5000
        });

        if (response.ok) {
          const springHealth = await response.json();
          health.springBootHealth = springHealth;
        }
      } catch (error) {
        health.springBootError = error.message;
      }
    }

    return health;
  }
}

module.exports = new BlockchainService();