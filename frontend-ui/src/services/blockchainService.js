// frontend/src/services/blockchainService.js
// This just makes API calls to your backend - NO direct blockchain code

const blockchainService = {
  // Frontend calls your backend API endpoints
  registerWithBlockchain: async (userData) => {
    return fetch('/api/blockchain/register-with-blockchain', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  getTransactionStatus: async (txId) => {
    return fetch(`/api/blockchain/transaction/${txId}`);
  }
};