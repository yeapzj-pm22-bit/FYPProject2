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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Healthcare Blockchain API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    features: {
      blindSignatures: true,
      database: true,
      authentication: true
    }
  });
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

// Start server
async function startServer() {
  try {
    // Test database connection
    console.log('🔍 Testing database connection...');
    await database.testConnection();

    app.listen(PORT, () => {
      console.log(`🎉 Healthcare Blockchain API successfully started!`);
      console.log(`🌐 Server running on: http://localhost:${PORT}`);
      console.log(`🏥 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔐 RSA Key Size: ${process.env.RSA_KEY_SIZE || '2048'}`);
      console.log(`⏰ Blind Signature Expiry: ${process.env.BLIND_SIGNATURE_EXPIRY || '3600'}s`);
      console.log(`📊 Database: ${process.env.DB_NAME || 'fyp'}`);
      console.log('✅ All systems ready!');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();