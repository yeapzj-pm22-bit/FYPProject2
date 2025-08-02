const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

// Rate limiting for auth endpoints
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: 'Too many authentication attempts' }
});

const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: 'Too many registration attempts' }
});

const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: { success: false, message: 'Too many password reset attempts' }
});

// Enhanced validation error handler with detailed feedback
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Validation errors:', errors.array());
    console.log('📝 Request body:', req.body);

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
      details: errors.array().map(err => `${err.param}: ${err.msg}`)
    });
  }
  next();
};

// =====================================================
// BLIND SIGNATURE REGISTRATION ROUTES
// =====================================================

// Step 1: Initialize registration (check email availability)
router.post('/register-init',
  registerRateLimit,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email required')
      .isLength({ min: 5, max: 255 })
      .withMessage('Email must be between 5 and 255 characters')
  ],
  handleValidationErrors,
  authController.registerInit
);

// Step 2: Create blind signature (relaxed validation for crypto data)
router.post('/register-blind',
  registerRateLimit,
  [
    body('blindedMessage')
      .notEmpty()
      .withMessage('Blinded message required')
      .isString()
      .withMessage('Blinded message must be a string')
      .isLength({ min: 1, max: 10000 })
      .withMessage('Blinded message invalid length'),

    body('sessionId')
      .notEmpty()
      .withMessage('Session ID required')
      .isString()
      .withMessage('Session ID must be a string'),

    body('messageHash')
      .notEmpty()
      .withMessage('Message hash required')
      .isString()
      .withMessage('Message hash must be a string')
      .isLength({ min: 1, max: 1000 })
      .withMessage('Message hash invalid length'),

    // Optional temp user data validation
    body('tempUserData')
      .optional()
      .isObject()
      .withMessage('Temp user data must be an object'),

    body('tempUserData.email')
      .optional()
      .isEmail()
      .withMessage('Temp email must be valid'),

    body('tempUserData.firstName')
      .optional()
      .isString()
      .isLength({ min: 1, max: 100 })
      .withMessage('Temp first name invalid'),

    body('tempUserData.lastName')
      .optional()
      .isString()
      .isLength({ min: 1, max: 100 })
      .withMessage('Temp last name invalid')
  ],
  handleValidationErrors,
  authController.registerBlind
);

// Step 3: Complete registration (comprehensive validation)
router.post('/register-complete',
  registerRateLimit,
  [
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required')
      .isLength({ min: 1, max: 100 })
      .withMessage('First name must be between 1 and 100 characters')
      .matches(/^[a-zA-Z\s\-'\.]+$/)
      .withMessage('First name contains invalid characters'),

    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required')
      .isLength({ min: 1, max: 100 })
      .withMessage('Last name must be between 1 and 100 characters')
      .matches(/^[a-zA-Z\s\-'\.]+$/)
      .withMessage('Last name contains invalid characters'),

    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email address is required')
      .isLength({ min: 5, max: 255 })
      .withMessage('Email must be between 5 and 255 characters'),

    body('gender')
      .notEmpty()
      .withMessage('Gender is required')
      .isIn(['Male', 'Female', 'Other'])
      .withMessage('Gender must be Male, Female, or Other'),

    body('birthDate')
      .notEmpty()
      .withMessage('Birth date is required')
      .isISO8601({ strict: false })
      .withMessage('Birth date must be a valid date (YYYY-MM-DD)')
      .custom((value) => {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();

        if (age < 13 || age > 120) {
          throw new Error('Age must be between 13 and 120 years');
        }

        if (birthDate > today) {
          throw new Error('Birth date cannot be in the future');
        }

        return true;
      }),

    body('password')
      .isLength({ min: 8, max: 128 })
      .withMessage('Password must be between 8 and 128 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain: lowercase, uppercase, number, and special character (@$!%*?&)'),

    body('signature')
      .notEmpty()
      .withMessage('Digital signature is required')
      .isString()
      .withMessage('Signature must be a string')
      .isLength({ min: 1, max: 10000 })
      .withMessage('Signature invalid length'),

    body('sessionId')
      .notEmpty()
      .withMessage('Session ID is required')
      .isString()
      .withMessage('Session ID must be a string'),

    body('originalMessage')
      .notEmpty()
      .withMessage('Original message is required')
      .isString()
      .withMessage('Original message must be a string')
      .isLength({ min: 1, max: 10000 })
      .withMessage('Original message invalid length')
  ],
  handleValidationErrors,
  authController.registerComplete
);

// =====================================================
// BASIC AUTHENTICATION ROUTES
// =====================================================

// Login
router.post('/login',
  authRateLimit,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email address is required')
      .isLength({ min: 5, max: 255 })
      .withMessage('Email must be between 5 and 255 characters'),

    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 1, max: 128 })
      .withMessage('Password must be between 1 and 128 characters')
  ],
  handleValidationErrors,
  authController.login
);

// Logout
router.post('/logout', authController.logout);

// Get blind signature parameters
router.get('/blind-signature-params', authController.getBlindSignatureParams);

// =====================================================
// PASSWORD RESET ROUTES (ADDED)
// =====================================================

// Forgot password
router.post('/forgot-password',
  passwordResetRateLimit,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email address is required')
      .isLength({ min: 5, max: 255 })
      .withMessage('Email must be between 5 and 255 characters')
  ],
  handleValidationErrors,
  authController.forgotPassword
);

// Reset password
router.post('/reset-password',
  passwordResetRateLimit,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email address is required'),

    body('otp')
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('OTP must be exactly 6 digits'),

    body('newPassword')
      .isLength({ min: 8, max: 128 })
      .withMessage('Password must be between 8 and 128 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain: lowercase, uppercase, number, and special character (@$!%*?&)')
  ],
  handleValidationErrors,
  authController.resetPassword
);

// =====================================================
// TOKEN MANAGEMENT ROUTES (ADDED)
// =====================================================

// Refresh token
router.post('/refresh-token',
  authRateLimit,
  [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required')
      .isString()
      .withMessage('Refresh token must be a string')
  ],
  handleValidationErrors,
  authController.refreshToken
);

// =====================================================
// DEBUG ROUTES (Development only)
// =====================================================

if (process.env.NODE_ENV === 'development') {
  // Debug validation endpoint
  router.post('/debug-validation', (req, res) => {
    console.log('🔍 Debug validation request:');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Body type:', typeof req.body);
    console.log('Body keys:', Object.keys(req.body));

    res.json({
      success: true,
      message: 'Debug info logged to console',
      received: {
        body: req.body,
        bodyType: typeof req.body,
        bodyKeys: Object.keys(req.body),
        contentType: req.get('Content-Type')
      }
    });
  });

  // Test validation endpoint
  router.post('/test-validation',
    [
      body('firstName').trim().isLength({ min: 1, max: 100 }),
      body('lastName').trim().isLength({ min: 1, max: 100 }),
      body('email').isEmail().normalizeEmail(),
      body('gender').isIn(['Male', 'Female', 'Other']),
      body('birthDate').isISO8601(),
      body('password')
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    ],
    handleValidationErrors,
    (req, res) => {
      res.json({
        success: true,
        message: 'Validation passed!',
        data: req.body
      });
    }
  );

  // Session debug endpoint
  router.get('/debug-sessions', async (req, res) => {
    try {
      const blindSignatureService = require('../crypto/rsaBlindSignature');
      const stats = await blindSignatureService.getSessionStats();

      res.json({
        success: true,
        message: 'Session statistics',
        stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });

  // Debug blind signature flow
  router.post('/debug-blind-flow', async (req, res) => {
    try {
      const { sessionId } = req.body;
      const blindSignatureService = require('../crypto/rsaBlindSignature');

      const sessionInfo = blindSignatureService.getSessionInfo ?
        blindSignatureService.getSessionInfo(sessionId) :
        'getSessionInfo method not available';

      res.json({
        success: true,
        message: 'Debug blind signature flow',
        sessionInfo,
        requestBody: req.body
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });
}

module.exports = router;