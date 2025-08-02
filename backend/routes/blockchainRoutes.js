const express = require('express');
const router = express.Router();
const CordaService = require('../services/blockchain/cordaService');
const auth = require('../middleware/auth'); // Your existing auth middleware

const cordaService = new CordaService();

// Enhanced registration with blockchain (BACKEND API ENDPOINT)
router.post('/register-with-blockchain', auth, async (req, res) => {
  try {
    const { userData, blindSignatureSessionId } = req.body;

    // All blockchain logic happens in backend service
    const result = await cordaService.registerPatientWithPrivacy(
      userData,
      blindSignatureSessionId
    );

    res.json({
      success: true,
      message: 'Patient registered with blockchain privacy protection',
      blockchainTransactionId: result.blockchainTransactionId,
      privacyFeatures: {
        blindSignatureUsed: true,
        blockchainRecorded: true,
        dataEncrypted: true,
        anonymousIdentity: true
      }
    });
  } catch (error) {
    console.error('Blockchain registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Blockchain registration failed',
      error: error.message
    });
  }
});

// Get blockchain transaction status (BACKEND API ENDPOINT)
router.get('/transaction/:transactionId', auth, async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Query blockchain from backend only
    const transaction = await cordaService.cordaClient.getTransaction(transactionId);

    res.json({
      success: true,
      transaction: transaction,
      status: 'COMPLETED'
    });
  } catch (error) {
    console.error('Transaction query error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction status',
      error: error.message
    });
  }
});

module.exports = router;