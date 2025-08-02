const axios = require('axios');
const cordaConfig = require('../../config/corda');

class CordaClient {
  constructor() {
    this.config = cordaConfig;
    this.baseURL = `http://${this.config.rpc.host}:${this.config.rpc.port}`;
    this.isConnected = false;

    // Create authenticated HTTP client (BACKEND ONLY)
    this.client = axios.create({
      baseURL: this.baseURL,
      auth: {
        username: this.config.rpc.username,
        password: this.config.rpc.password
      },
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Initialize connection (BACKEND ONLY)
  async initialize() {
    try {
      console.log('🔗 Connecting to Corda node...');

      // Test connection
      const response = await this.client.get('/api/rest/flows');

      if (response.status === 200) {
        this.isConnected = true;
        console.log('✅ Successfully connected to Corda node');
        return true;
      }
    } catch (error) {
      console.error('❌ Failed to connect to Corda node:', error.message);
      this.isConnected = false;
      throw error;
    }
  }

  // Start a Corda flow (BACKEND ONLY)
  async startFlow(flowName, flowArgs = {}) {
    if (!this.isConnected) {
      await this.initialize();
    }

    try {
      console.log(`🚀 Starting Corda flow: ${flowName}`);

      const response = await this.client.post('/api/rest/flows', {
        flowName: flowName,
        flowArgs: flowArgs
      });

      console.log(`✅ Flow ${flowName} completed successfully`);

      return {
        success: true,
        transactionId: response.data.transactionId,
        linearId: response.data.linearId,
        result: response.data.result
      };
    } catch (error) {
      console.error(`❌ Flow ${flowName} failed:`, error.message);
      throw error;
    }
  }

  // Query Corda vault (BACKEND ONLY)
  async queryVault(contractStateType, criteria = {}) {
    if (!this.isConnected) {
      await this.initialize();
    }

    try {
      const response = await this.client.post('/api/rest/vault/query', {
        contractStateType: contractStateType,
        criteria: criteria
      });

      return response.data.states || [];
    } catch (error) {
      console.error('❌ Vault query failed:', error.message);
      throw error;
    }
  }

  // Get transaction by ID (BACKEND ONLY)
  async getTransaction(transactionId) {
    if (!this.isConnected) {
      await this.initialize();
    }

    try {
      const response = await this.client.get(`/api/rest/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Transaction query failed:', error.message);
      throw error;
    }
  }

  // Check node status (BACKEND ONLY)
  async getNodeInfo() {
    if (!this.isConnected) {
      await this.initialize();
    }

    try {
      const response = await this.client.get('/api/rest/network/nodes/self');
      return response.data;
    } catch (error) {
      console.error('❌ Node info query failed:', error.message);
      throw error;
    }
  }
}

module.exports = CordaClient;