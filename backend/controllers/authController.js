const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const database = require('../config/database');
const blindSignatureService = require('../crypto/rsaBlindSignature');

class AuthController {
  // Step 1: Initialize registration (check email availability)
  async registerInit(req, res) {
    try {
      const { email } = req.body;

      console.log(`🔍 Checking email availability: ${email}`);

      // Check if email already exists
      const existingUsers = await database.query(
        'SELECT userId FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }

      console.log('✅ Email available for registration');

      res.json({
        success: true,
        message: 'Email available for registration',
        canProceed: true
      });
    } catch (error) {
      console.error('Register init error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to initialize registration'
      });
    }
  }

  // Step 2: Create blind signature - FIXED VERSION
  async registerBlind(req, res) {
    try {
      const { blindedMessage, sessionId, messageHash, tempUserData } = req.body;

      console.log(`🎭 Processing blind signature request for: ${tempUserData?.email || 'unknown'}`);
      console.log(`📨 Using client session ID: ${sessionId}`);

      // Validate required fields
      if (!blindedMessage || !sessionId || !messageHash) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: blindedMessage, sessionId, messageHash'
        });
      }

      // FIXED: Use the client's session ID instead of creating a new one
      const result = await blindSignatureService.createOrUpdateBlindSession(
        sessionId,           // Use client's session ID
        blindedMessage,
        '', // blindingFactor - handled in the signing process
        messageHash,
        tempUserData
      );

      console.log(`✅ Blind signature created for session: ${sessionId}`);

      res.json({
        success: true,
        sessionId: result.sessionId,  // This should match the client's session ID
        blindSignature: result.blindSignature,
        message: 'Blind signature created successfully'
      });
    } catch (error) {
      console.error('Register blind error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create blind signature'
      });
    }
  }

  // Step 3: Complete registration - UPDATED VERSION
  async registerComplete(req, res) {
    try {
      const {
        firstName,
        lastName,
        email,
        gender,
        birthDate,
        password,
        signature,
        originalMessage,
        sessionId
      } = req.body;

      console.log(`🔐 Completing registration for: ${email}`);
      console.log(`🔍 Using session ID: ${sessionId}`);

      // Validate required fields
      if (!firstName || !lastName || !email || !gender || !birthDate || !password || !signature || !sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required registration fields'
        });
      }

      // Check if email already exists (double-check)
      const existingUsers = await database.query(
        'SELECT userId FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }

      // FIXED: Verify the unblinded signature using the correct session ID
      const verification = await blindSignatureService.verifyUnblindedSignature(
        sessionId,        // This should now match the database session
        signature,
        originalMessage
      );

      if (!verification.isValid) {
        console.log(`❌ Signature verification failed for session: ${sessionId}`);
        return res.status(400).json({
          success: false,
          message: 'Invalid signature verification'
        });
      }

      console.log(`✅ Blind signature verified successfully for session: ${sessionId}`);

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Generate user ID and anonymous ID
      const userId = crypto.randomBytes(16).toString('hex');
      const anonymousId = crypto.randomBytes(16).toString('hex');

      console.log(`👤 Creating user with ID: ${userId}`);

      // Create user record
      await database.query(`
        INSERT INTO users (
          userId, firstName, lastName, email, gender, birthDate,
          password, role, anonymousId, blindSignatureSessionId,
          privacyLevel, status, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PATIENT', ?, ?, 'PSEUDONYMOUS', 'ACTIVE', NOW())
      `, [
        userId, firstName, lastName, email, gender, birthDate,
        hashedPassword, anonymousId, sessionId
      ]);

      // Create patient record
      await database.query(`
        INSERT INTO patients (userId, consentStatus)
        VALUES (?, 'ACTIVE')
      `, [userId]);

      console.log('✅ Patient record created');

      // Log audit trail
      const auditId = crypto.randomBytes(16).toString('hex');
      const auditHash = crypto.createHash('sha256')
        .update(JSON.stringify({ action: 'REGISTER_COMPLETE', userId, timestamp: new Date() }))
        .digest('hex');

      await database.query(`
        INSERT INTO audit_trail (
          auditId, userId, action, entityType, entityId,
          success, auditHash, timestamp
        ) VALUES (?, ?, 'REGISTER_COMPLETE', 'USER', ?, 1, ?, NOW())
      `, [auditId, userId, userId, auditHash]);

      console.log(`🎉 Registration completed successfully for: ${email} with session: ${sessionId}`);

      res.json({
        success: true,
        message: 'Registration completed successfully',
        user: {
          userId,
          firstName,
          lastName,
          email,
          role: 'PATIENT',
          anonymousId,
          privacyLevel: 'PSEUDONYMOUS',
          blindSignatureVerified: true,
          sessionId
        }
      });
    } catch (error) {
      console.error('Register complete error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to complete registration'
      });
    }
  }

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      console.log(`🔑 Login attempt for: ${email}`);

      // Find user
      const users = await database.query(`
        SELECT u.*, p.bloodType, p.allergies
        FROM users u
        LEFT JOIN patients p ON u.userId = p.userId
        WHERE u.email = ? AND u.status = 'ACTIVE'
      `, [email]);

      if (users.length === 0) {
        console.log('❌ User not found or inactive');
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const user = users[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        console.log('❌ Invalid password');
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      console.log('✅ Password verified');

      // Generate tokens
      const tokenPayload = {
        userId: user.userId,
        email: user.email,
        role: user.role,
        anonymousId: user.anonymousId
      };

      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      });

      const refreshToken = jwt.sign(
        { ...tokenPayload, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
      );

      // Create session
      const sessionId = crypto.randomBytes(16).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await database.query(`
        INSERT INTO auth_sessions (
          sessionId, userId, tokenHash, refreshTokenHash,
          expiresAt, loginMethod, ipAddress, userAgent, createdAt
        ) VALUES (?, ?, ?, ?, ?, 'PASSWORD', ?, ?, NOW())
      `, [
        sessionId, user.userId, tokenHash, refreshTokenHash,
        expiresAt, req.ip, req.get('User-Agent')
      ]);

      // Update last login
      await database.query(
        'UPDATE users SET lastLogin = NOW() WHERE userId = ?',
        [user.userId]
      );

      console.log(`🎉 Login successful for user: ${user.userId}`);

      res.json({
        success: true,
        message: 'Login successful',
        token,
        refreshToken,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          anonymousId: user.anonymousId
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed'
      });
    }
  }

  // Get blind signature parameters
  async getBlindSignatureParams(req, res) {
    try {
      console.log('🔐 Getting blind signature parameters...');

      const systemKey = await blindSignatureService.getSystemSigningKey();

      res.json({
        success: true,
        publicKey: systemKey.publicKey,
        keySize: 2048,
        algorithm: 'RSA-BSSA',
        hashAlgorithm: 'SHA-256'
      });
    } catch (error) {
      console.error('Get blind signature params error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get blind signature parameters'
      });
    }
  }

  // Logout
  async logout(req, res) {
    try {
      if (req.session) {
        await database.query(
          'UPDATE auth_sessions SET isActive = 0 WHERE sessionId = ?',
          [req.session.sessionId]
        );
        console.log(`👋 User logged out: ${req.user?.userId}`);
      }

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }

  // Forgot Password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      console.log(`🔑 Forgot password request for: ${email}`);

      // Check if user exists
      const users = await database.query(
        'SELECT userId, firstName, lastName FROM users WHERE email = ? AND status = "ACTIVE"',
        [email]
      );

      if (users.length === 0) {
        // Don't reveal if email exists or not for security
        return res.json({
          success: true,
          message: 'If this email exists, you will receive a verification code shortly'
        });
      }

      const user = users[0];

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP in database (you might want a separate table for this)
      await database.query(`
        UPDATE users
        SET resetOtp = ?, resetOtpExpiry = ?, updatedAt = NOW()
        WHERE userId = ?
      `, [otp, otpExpiry, user.userId]);

      // TODO: Send email with OTP (implement email service)
      console.log(`📧 OTP for ${email}: ${otp} (expires at ${otpExpiry})`);

      // In development, log the OTP
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔐 DEBUG: OTP for ${email} is ${otp}`);
      }

      res.json({
        success: true,
        message: 'Verification code sent to your email'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process forgot password request'
      });
    }
  }

  // Reset Password
  async resetPassword(req, res) {
    try {
      const { email, otp, newPassword } = req.body;

      console.log(`🔑 Reset password attempt for: ${email}`);

      // Find user with valid OTP
      const users = await database.query(`
        SELECT userId, resetOtp, resetOtpExpiry
        FROM users
        WHERE email = ? AND status = "ACTIVE" AND resetOtpExpiry > NOW()
      `, [email]);

      if (users.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification code'
        });
      }

      const user = users[0];

      // Verify OTP
      if (user.resetOtp !== otp) {
        return res.status(400).json({
          success: false,
          message: 'Invalid verification code'
        });
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password and clear OTP
      await database.query(`
        UPDATE users
        SET password = ?, resetOtp = NULL, resetOtpExpiry = NULL, updatedAt = NOW()
        WHERE userId = ?
      `, [hashedPassword, user.userId]);

      console.log(`✅ Password reset successful for user: ${user.userId}`);

      res.json({
        success: true,
        message: 'Password reset successful'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reset password'
      });
    }
  }

  // Refresh Token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      console.log('🔄 Token refresh request');

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

      if (decoded.type !== 'refresh') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token type'
        });
      }

      // Check if refresh token exists in database
      const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

      const sessions = await database.query(`
        SELECT s.*, u.status, u.firstName, u.lastName, u.email, u.role, u.anonymousId
        FROM auth_sessions s
        JOIN users u ON s.userId = u.userId
        WHERE s.refreshTokenHash = ? AND s.isActive = 1
      `, [refreshTokenHash]);

      if (sessions.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
      }

      const session = sessions[0];
      const user = session;

      if (user.status !== 'ACTIVE') {
        return res.status(403).json({
          success: false,
          message: 'Account is not active'
        });
      }

      // Generate new tokens
      const tokenPayload = {
        userId: user.userId,
        email: user.email,
        role: user.role,
        anonymousId: user.anonymousId
      };

      const newToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      });

      const newRefreshToken = jwt.sign(
        { ...tokenPayload, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
      );

      // Update session with new tokens
      const newTokenHash = crypto.createHash('sha256').update(newToken).digest('hex');
      const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
      const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await database.query(`
        UPDATE auth_sessions
        SET tokenHash = ?, refreshTokenHash = ?, expiresAt = ?, lastActivityAt = NOW()
        WHERE sessionId = ?
      `, [newTokenHash, newRefreshTokenHash, newExpiresAt, session.sessionId]);

      console.log(`✅ Token refreshed for user: ${user.userId}`);

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        token: newToken,
        refreshToken: newRefreshToken,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          anonymousId: user.anonymousId
        }
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
  }
}

module.exports = new AuthController();