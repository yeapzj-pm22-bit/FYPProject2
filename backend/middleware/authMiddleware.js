// File: backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const database = require('../config/database');

class AuthMiddleware {
  async authenticateToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access token required'
        });
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if session exists and is active
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

      const sessions = await database.query(`
        SELECT s.*, u.status, u.role, u.firstName, u.lastName, u.email
        FROM auth_sessions s
        JOIN users u ON s.userId = u.userId
        WHERE s.tokenHash = ? AND s.isActive = 1 AND s.expiresAt > NOW()
      `, [tokenHash]);

      if (sessions.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }

      const session = sessions[0];

      if (session.status !== 'ACTIVE') {
        return res.status(403).json({
          success: false,
          message: 'Account is not active'
        });
      }

      // Update last activity
      await database.query(`
        UPDATE auth_sessions
        SET lastActivityAt = NOW()
        WHERE sessionId = ?
      `, [session.sessionId]);

      // Add user info to request
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        firstName: session.firstName,
        lastName: session.lastName,
        anonymousId: decoded.anonymousId
      };
      req.session = session;

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Authentication error'
      });
    }
  }

  // Role-based authorization middleware
  authorize(...roles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      next();
    };
  }

  // Optional authentication (for public endpoints that benefit from user context)
  optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(); // Continue without authentication
    }

    // Try to authenticate, but don't fail if it doesn't work
    this.authenticateToken(req, res, (error) => {
      if (error) {
        // Clear any partial user data and continue
        req.user = null;
        req.session = null;
      }
      next();
    });
  }

  // Refresh token validation
  async validateRefreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token required'
        });
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      if (decoded.type !== 'refresh') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token type'
        });
      }

      // Check if refresh token exists in database
      const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

      const sessions = await database.query(`
        SELECT s.*, u.status
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

      if (session.status !== 'ACTIVE') {
        return res.status(403).json({
          success: false,
          message: 'Account is not active'
        });
      }

      req.user = { userId: decoded.userId };
      req.session = session;

      next();
    } catch (error) {
      console.error('Refresh token validation error:', error);

      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
  }

  // API Key authentication (for system-to-system communication)
  async authenticateApiKey(req, res, next) {
    try {
      const apiKey = req.headers['x-api-key'];

      if (!apiKey) {
        return res.status(401).json({
          success: false,
          message: 'API key required'
        });
      }

      // Validate API key (implement your API key validation logic here)
      // This is a placeholder - implement proper API key validation
      const validApiKeys = (process.env.VALID_API_KEYS || '').split(',');

      if (!validApiKeys.includes(apiKey)) {
        return res.status(401).json({
          success: false,
          message: 'Invalid API key'
        });
      }

      req.apiAuthenticated = true;
      next();
    } catch (error) {
      console.error('API key authentication error:', error);

      return res.status(500).json({
        success: false,
        message: 'API authentication error'
      });
    }
  }

  // Rate limiting for authenticated users
  createAuthRateLimit(options = {}) {
    const rateLimit = require('express-rate-limit');

    return rateLimit({
      windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
      max: options.max || 100, // limit each user to 100 requests per windowMs
      keyGenerator: (req) => {
        // Use user ID for rate limiting if authenticated, otherwise use IP
        return req.user ? req.user.userId : req.ip;
      },
      message: {
        success: false,
        message: 'Too many requests from this user'
      },
      standardHeaders: true,
      legacyHeaders: false
    });
  }

  // Audit logging middleware
  auditLog(action) {
    return async (req, res, next) => {
      const originalSend = res.send;
      const startTime = Date.now();

      res.send = function(body) {
        const duration = Date.now() - startTime;
        const success = res.statusCode < 400;

        // Log the action (implement your audit logging here)
        setImmediate(async () => {
          try {
            const auditId = crypto.randomBytes(16).toString('hex');
            const auditHash = crypto.createHash('sha256')
              .update(JSON.stringify({
                action,
                userId: req.user?.userId,
                timestamp: new Date(),
                success,
                duration
              }))
              .digest('hex');

            await database.query(`
              INSERT INTO audit_trail (
                auditId, userId, action, entityType, entityId,
                ipAddress, userAgent, success, auditHash
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              auditId,
              req.user?.userId || null,
              action,
              'API_CALL',
              req.path,
              req.ip,
              req.get('User-Agent'),
              success ? 1 : 0,
              auditHash
            ]);
          } catch (error) {
            console.error('Audit logging error:', error);
          }
        });

        originalSend.call(this, body);
      };

      next();
    };
  }
}

module.exports = new AuthMiddleware();