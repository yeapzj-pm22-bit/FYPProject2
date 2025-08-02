// Browser-Compatible RSA-BSSA Blind Signature Client
// Fixed for browser environment - no Node.js dependencies

class BlindSignatureClient {
  constructor() {
    this.sessions = new Map();
    this.activeSession = null;
    this.systemPublicKey = null;
    this.initialized = false;
  }

  // Initialize blind signature parameters
  async initializeBlindSignature(apiService) {
    try {
      console.log('🔐 Initializing RSA-BSSA blind signature client...');

      // Get system public key and parameters from server
      const response = await apiService.getBlindSignatureParams();

      if (response.success) {
        this.systemPublicKey = response.publicKey;
        this.keySize = response.keySize;
        this.algorithm = response.algorithm;
        this.hashAlgorithm = response.hashAlgorithm || 'SHA-256';
        this.initialized = true;

        console.log('✅ RSA-BSSA client initialized:', {
          algorithm: this.algorithm,
          keySize: this.keySize,
          hashAlgorithm: this.hashAlgorithm
        });
      } else {
        throw new Error('Failed to get blind signature parameters');
      }
    } catch (error) {
      console.error('❌ Failed to initialize blind signature client:', error);
      throw error;
    }
  }

  // Create blinded message for registration (RSA-BSSA)
  async createBlindedMessage(userData) {
    try {
      if (!this.initialized) {
        throw new Error('Blind signature client not initialized');
      }

      const sessionId = this.generateSessionId();
      const messageString = JSON.stringify({
        ...userData,
        timestamp: Date.now(),
        nonce: this.generateNonce()
      });

      console.log('🎭 Creating blinded message for RSA-BSSA...');

      // Generate cryptographically secure blinding factor
      const blindingFactor = this.generateBlindingFactor();

      // Create message hash using Web Crypto API
      const messageHash = await this.hashMessage(messageString);

      // Apply RSA blinding (simplified for demo - in production use proper RSA math)
      const blindedMessage = this.applyRSABlinding(messageHash, blindingFactor);

      // Store session data
      const sessionData = {
        sessionId,
        userData,
        messageString,
        messageHash,
        blindingFactor,
        blindedMessage,
        createdAt: Date.now(),
        status: 'BLINDED',
        algorithm: 'RSA-BSSA'
      };

      this.sessions.set(sessionId, sessionData);
      this.activeSession = sessionId;

      console.log(`✅ RSA-BSSA blinded message created for session: ${sessionId}`);

      return {
        sessionId,
        blindedMessage: this.arrayToHex(blindedMessage),
        messageHash: this.arrayToHex(messageHash),
        blindingFactor: this.arrayToHex(blindingFactor)
      };
    } catch (error) {
      console.error('❌ Error creating blinded message:', error);
      throw error;
    }
  }

  // Process blind signature from server (RSA-BSSA)
  processSignature(blindSignatureHex) {
    try {
      if (!this.activeSession) {
        throw new Error('No active blind signature session');
      }

      const session = this.sessions.get(this.activeSession);
      if (!session) {
        throw new Error('Session data not found');
      }

      console.log('✅ Processing RSA-BSSA blind signature...');

      // Convert hex signature back to Uint8Array
      const blindSignature = this.hexToArray(blindSignatureHex);

      // Remove blinding factor (RSA unblinding)
      const unblindedSignature = this.removeRSABlinding(blindSignature, session.blindingFactor);

      // Store signatures
      session.blindSignature = blindSignature;
      session.unblindedSignature = unblindedSignature;
      session.status = 'COMPLETED';
      session.completedAt = Date.now();

      console.log(`✅ RSA-BSSA signature processed for session: ${this.activeSession}`);

      return {
        sessionId: this.activeSession,
        signature: this.arrayToHex(unblindedSignature),
        originalMessage: session.messageString
      };
    } catch (error) {
      console.error('❌ Error processing blind signature:', error);
      throw error;
    }
  }

  // =====================================================
  // BROWSER-COMPATIBLE CRYPTOGRAPHIC OPERATIONS
  // =====================================================

  // Generate session ID
  generateSessionId() {
    return 'bssa_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16);
  }

  // Generate cryptographically secure nonce
  generateNonce() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return this.arrayToHex(array);
  }

  // Generate cryptographically secure blinding factor
  generateBlindingFactor() {
    const array = new Uint8Array(32); // 256 bits for RSA-2048
    crypto.getRandomValues(array);
    return array;
  }

  // Hash message using Web Crypto API (browser-compatible)
  async hashMessage(message) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      return new Uint8Array(hashBuffer);
    } catch (error) {
      // Fallback for environments without Web Crypto API
      console.warn('Web Crypto API not available, using fallback hash');
      return this.fallbackHash(message);
    }
  }

  // Fallback hash for older browsers
  fallbackHash(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    // Simple hash simulation for demo
    let hash = new Uint8Array(32);
    for (let i = 0; i < data.length; i++) {
      hash[i % 32] ^= data[i];
    }

    return hash;
  }

  // Apply RSA blinding (simplified implementation) - FIXED for browser
  applyRSABlinding(messageHash, blindingFactor) {
    // In production, this would be proper RSA blinding mathematics:
    // blinded = (hash * r^e) mod n
    // For demo purposes, we'll use XOR with expanded blinding factor
    const maxLength = Math.max(messageHash.length, blindingFactor.length);
    const result = new Uint8Array(maxLength);

    for (let i = 0; i < result.length; i++) {
      const hashByte = i < messageHash.length ? messageHash[i] : 0;
      const blindByte = i < blindingFactor.length ? blindingFactor[i] : blindingFactor[i % blindingFactor.length];
      result[i] = hashByte ^ blindByte;
    }

    return result;
  }

  // Remove RSA blinding (simplified implementation) - FIXED for browser
  removeRSABlinding(blindSignature, blindingFactor) {
    // In production, this would be proper RSA unblinding mathematics:
    // unblinded = (signature * r^(-1)) mod n
    // For demo purposes, we'll reverse the XOR operation
    const result = new Uint8Array(blindSignature.length);

    for (let i = 0; i < result.length; i++) {
      const sigByte = blindSignature[i];
      const blindByte = i < blindingFactor.length ? blindingFactor[i] : blindingFactor[i % blindingFactor.length];
      result[i] = sigByte ^ blindByte;
    }

    return result;
  }

  // =====================================================
  // BROWSER-COMPATIBLE UTILITY FUNCTIONS
  // =====================================================

  // Convert Uint8Array to hex string
  arrayToHex(array) {
    return Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Convert hex string to Uint8Array
  hexToArray(hexString) {
    const result = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
      result[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }
    return result;
  }

  // Convert string to Uint8Array
  stringToArray(str) {
    const encoder = new TextEncoder();
    return encoder.encode(str);
  }

  // Convert Uint8Array to string
  arrayToString(array) {
    const decoder = new TextDecoder();
    return decoder.decode(array);
  }

  // =====================================================
  // SESSION MANAGEMENT
  // =====================================================

  // Get session information
  getSessionInfo(sessionId = null) {
    const id = sessionId || this.activeSession;
    if (!id) return null;

    const session = this.sessions.get(id);
    if (!session) return null;

    return {
      sessionId: session.sessionId,
      status: session.status,
      algorithm: session.algorithm,
      createdAt: session.createdAt,
      completedAt: session.completedAt,
      hasBlindSignature: !!session.blindSignature,
      hasUnblindedSignature: !!session.unblindedSignature
    };
  }

  // Clear specific session
  clearSession(sessionId = null) {
    const id = sessionId || this.activeSession;
    if (id) {
      this.sessions.delete(id);
      if (this.activeSession === id) {
        this.activeSession = null;
      }
      console.log(`🗑️ Cleared RSA-BSSA session: ${id}`);
    }
  }

  // Reset all sessions
  reset() {
    this.sessions.clear();
    this.activeSession = null;
    this.initialized = false;
    console.log('🔄 RSA-BSSA blind signature client reset');
  }

  // Get client statistics
  getStatistics() {
    return {
      totalSessions: this.sessions.size,
      activeSessions: Array.from(this.sessions.values()).filter(s => s.status !== 'COMPLETED').length,
      completedSessions: Array.from(this.sessions.values()).filter(s => s.status === 'COMPLETED').length,
      algorithm: this.algorithm,
      keySize: this.keySize,
      initialized: this.initialized
    };
  }

  // =====================================================
  // DEBUGGING AND VERIFICATION HELPERS
  // =====================================================

  // Debug session data (for development)
  debugSession(sessionId = null) {
    const id = sessionId || this.activeSession;
    if (!id) {
      console.log('No active session to debug');
      return null;
    }

    const session = this.sessions.get(id);
    if (!session) {
      console.log('Session not found:', id);
      return null;
    }

    const debugInfo = {
      sessionId: session.sessionId,
      status: session.status,
      algorithm: session.algorithm,
      messageLength: session.messageString?.length || 0,
      hashLength: session.messageHash?.length || 0,
      blindingFactorLength: session.blindingFactor?.length || 0,
      blindedMessageLength: session.blindedMessage?.length || 0,
      hasBlindSignature: !!session.blindSignature,
      hasUnblindedSignature: !!session.unblindedSignature,
      createdAt: new Date(session.createdAt).toISOString(),
      completedAt: session.completedAt ? new Date(session.completedAt).toISOString() : null
    };

    console.log('🔍 Session Debug Info:', debugInfo);
    return debugInfo;
  }

  // Verify client state
  verifyClientState() {
    const state = {
      initialized: this.initialized,
      hasSystemPublicKey: !!this.systemPublicKey,
      totalSessions: this.sessions.size,
      activeSession: this.activeSession,
      webCryptoAvailable: typeof crypto !== 'undefined' && !!crypto.subtle,
      textEncoderAvailable: typeof TextEncoder !== 'undefined',
      randomValuesAvailable: typeof crypto !== 'undefined' && !!crypto.getRandomValues
    };

    console.log('🔍 Client State Verification:', state);
    return state;
  }
}

// Create singleton instance
const blindSignatureClient = new BlindSignatureClient();

export default blindSignatureClient;