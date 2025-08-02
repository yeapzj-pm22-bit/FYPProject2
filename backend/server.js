// IMPORTANT: Load environment variables FIRST before anything else
require('dotenv').config();

// Now check environment variables AFTER loading .env file
console.log('🔍 Environment check - MASTER_KEY:', process.env.MASTER_KEY ? 'SET' : 'NOT SET');
console.log('🔍 Environment check - JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const database = require('./config/database');
const authRoutes = require('./routes/authRoutes');

// ADD THIS: Import fetch for blockchain service calls
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Starting Healthcare Blockchain API...');

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// ADD THIS: Blockchain service status tracking
let blockchainServiceStatus = {
  connected: false,
  lastChecked: null,
  error: null,
  cordaAvailable: false
};

// ADD THIS: Function to test blockchain service connection
async function testBlockchainConnection() {
  if (process.env.BLOCKCHAIN_SERVICE_ENABLED !== 'true') {
    blockchainServiceStatus = {
      connected: false,
      lastChecked: new Date().toISOString(),
      error: 'Blockchain service disabled in configuration',
      cordaAvailable: false
    };
    return false;
  }

  try {
    const springBootUrl = process.env.SPRING_BOOT_URL || 'http://localhost:8080';
    console.log(`🔗 Testing blockchain service connection: ${springBootUrl}`);

    // Use axios instead of fetch
    const response = await axios.get(`${springBootUrl}/api/blockchain/health`, {
      timeout: 5000,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.status === 200 && response.data) {
      const health = response.data;
      blockchainServiceStatus = {
        connected: true,
        lastChecked: new Date().toISOString(),
        error: null,
        cordaAvailable: health.cordaAvailable || false,
        networkInfo: health.networkInfo || 'Unknown',
        service: health.service || 'Healthcare Blockchain API'
      };

      console.log('✅ Blockchain service connected:', health.service);
      console.log('🔗 Corda available:', health.cordaAvailable ? 'Yes' : 'No');
      return true;
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    blockchainServiceStatus = {
      connected: false,
      lastChecked: new Date().toISOString(),
      error: error.message,
      cordaAvailable: false
    };

    console.log('⚠️ Blockchain service not available:', error.message);
    if (process.env.BLOCKCHAIN_FALLBACK_MODE === 'true') {
      console.log('🎭 Fallback mode enabled - service will continue without blockchain');
    }
    return false;
  }
}

// MODIFIED: Enhanced health check with blockchain status
app.get('/api/health', async (req, res) => {
  // Quick blockchain status check (non-blocking)
  if (process.env.BLOCKCHAIN_SERVICE_ENABLED === 'true') {
    const timeSinceLastCheck = blockchainServiceStatus.lastChecked
      ? Date.now() - new Date(blockchainServiceStatus.lastChecked).getTime()
      : Infinity;

    // Re-check if it's been more than 1 minute since last check
    if (timeSinceLastCheck > 60000) {
      testBlockchainConnection().catch(console.error);
    }
  }

  res.json({
    success: true,
    message: 'Healthcare Blockchain API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    features: {
      blindSignatures: true,
      database: true,
      authentication: true,
      blockchain: process.env.BLOCKCHAIN_SERVICE_ENABLED === 'true'
    },
    blockchain: {
      enabled: process.env.BLOCKCHAIN_SERVICE_ENABLED === 'true',
      connected: blockchainServiceStatus.connected,
      lastChecked: blockchainServiceStatus.lastChecked,
      cordaAvailable: blockchainServiceStatus.cordaAvailable,
      fallbackMode: process.env.BLOCKCHAIN_FALLBACK_MODE === 'true',
      error: blockchainServiceStatus.error
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      rsaKeySize: process.env.RSA_KEY_SIZE || '2048',
      blindSignatureExpiry: process.env.BLIND_SIGNATURE_EXPIRY || '3600',
      database: process.env.DB_NAME || 'fyp',
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
    }
  });
});

// ADD THIS: Dedicated blockchain health endpoint
app.get('/api/blockchain/status', async (req, res) => {
  try {
    await testBlockchainConnection();
    res.json({
      success: true,
      blockchain: blockchainServiceStatus,
      springBootUrl: process.env.SPRING_BOOT_URL || 'http://localhost:8080'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check blockchain status',
      error: error.message,
      blockchain: blockchainServiceStatus
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// MODIFIED: Enhanced startup function with blockchain initialization
async function startServer() {
  try {
    // Test database connection
    console.log('🔍 Testing database connection...');
    await database.testConnection();

    // Initialize blockchain service if enabled
    if (process.env.BLOCKCHAIN_SERVICE_ENABLED === 'true') {
      console.log('🔗 Initializing blockchain service...');
      await testBlockchainConnection();

      if (blockchainServiceStatus.connected) {
        console.log('✅ Blockchain service initialized successfully');
      } else {
        if (process.env.BLOCKCHAIN_FALLBACK_MODE === 'true') {
          console.log('🎭 Blockchain service unavailable - running in fallback mode');
        } else {
          console.log('⚠️ Blockchain service unavailable and fallback disabled');
        }
      }
    } else {
      console.log('🔐 Blockchain service disabled in configuration');
    }

    app.listen(PORT, () => {
      console.log(`🎉 Healthcare Blockchain API successfully started!`);
      console.log(`🌐 Server running on: http://localhost:${PORT}`);
      console.log(`🏥 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔐 RSA Key Size: ${process.env.RSA_KEY_SIZE || '2048'}`);
      console.log(`⏰ Blind Signature Expiry: ${process.env.BLIND_SIGNATURE_EXPIRY || '3600'}s`);
      console.log(`📊 Database: ${process.env.DB_NAME || 'fyp'}`);

      // Enhanced blockchain status logging
      if (process.env.BLOCKCHAIN_SERVICE_ENABLED === 'true') {
        console.log(`🔗 Blockchain Service: ${blockchainServiceStatus.connected ? 'Connected' : 'Disconnected'}`);
        console.log(`🎭 Fallback Mode: ${process.env.BLOCKCHAIN_FALLBACK_MODE === 'true' ? 'Enabled' : 'Disabled'}`);
        if (blockchainServiceStatus.connected) {
          console.log(`⛓️ Corda Available: ${blockchainServiceStatus.cordaAvailable ? 'Yes' : 'No'}`);
        }
      }

      console.log('✅ All systems ready!');
      console.log('📋 Available endpoints:');
      console.log('   • GET  /api/health - General health check');
      console.log('   • GET  /api/blockchain/status - Blockchain status');
      console.log('   • POST /api/auth/* - Authentication endpoints');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// ADD THIS: Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

startServer();