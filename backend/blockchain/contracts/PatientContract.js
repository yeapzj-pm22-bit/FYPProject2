class PatientContractInterface {
  constructor(cordaClient) {
    this.cordaClient = cordaClient;
    this.contractName = 'com.healthcare.contracts.PatientContract';
  }

  // Register patient with blind signature privacy (BACKEND ONLY)
  async registerPatient(patientData) {
    try {
      const flowArgs = {
        anonymousId: patientData.anonymousId,
        encryptedPersonalData: patientData.encryptedData,
        consentHash: patientData.consentHash,
        blindSignatureSessionId: patientData.blindSignatureSessionId,
        registrationTimestamp: new Date().toISOString()
      };

      const result = await this.cordaClient.startFlow(
        'com.healthcare.flows.RegisterPatientFlow',
        flowArgs
      );

      return {
        success: true,
        patientStateRef: result.linearId,
        transactionId: result.transactionId,
        registrationHash: this.generateRegistrationHash(patientData)
      };
    } catch (error) {
      console.error('❌ Patient registration failed:', error);
      throw error;
    }
  }

  // Update patient consent (BACKEND ONLY)
  async updateConsent(patientId, consentData) {
    try {
      const flowArgs = {
        patientLinearId: patientId,
        newConsentHash: this.generateConsentHash(consentData),
        consentTimestamp: new Date().toISOString(),
        consentType: consentData.type
      };

      const result = await this.cordaClient.startFlow(
        'com.healthcare.flows.UpdatePatientConsentFlow',
        flowArgs
      );

      return result;
    } catch (error) {
      console.error('❌ Consent update failed:', error);
      throw error;
    }
  }

  // Query patient by anonymous ID (BACKEND ONLY)
  async getPatientByAnonymousId(anonymousId) {
    try {
      const states = await this.cordaClient.queryVault(
        'com.healthcare.states.PatientState',
        { anonymousId: anonymousId }
      );

      return states.length > 0 ? states[0] : null;
    } catch (error) {
      console.error('❌ Patient query failed:', error);
      throw error;
    }
  }

  // Helper methods (BACKEND ONLY)
  generateRegistrationHash(patientData) {
    const crypto = require('crypto');
    return crypto.createHash('sha256')
      .update(JSON.stringify(patientData))
      .digest('hex');
  }

  generateConsentHash(consentData) {
    const crypto = require('crypto');
    return crypto.createHash('sha256')
      .update(JSON.stringify(consentData))
      .digest('hex');
  }
}

module.exports = PatientContractInterface;