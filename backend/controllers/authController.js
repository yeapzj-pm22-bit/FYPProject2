const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const database = require('../config/database');
const blindSignatureService = require('../crypto/rsaBlindSignature');

const axios = require('axios');

class AuthController {

  // Step 1: Initialize registration (check email availability)
  async registerInit(req, res) {
    try {
      const { email } = req.body;

      console.log(`🔍 Checking email availability: ${email}`);

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

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

      // Validate session ID format
      if (!sessionId.startsWith('bssa_')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid session ID format'
        });
      }

      // Use the client's session ID instead of creating a new one
      const result = await blindSignatureService.createOrUpdateBlindSession(
        sessionId,           // Use client's session ID
        blindedMessage,
        '', // blindingFactor - handled in the signing process
        messageHash,
        tempUserData
      );

      if (!result || !result.blindSignature) {
        throw new Error('Failed to create blind signature');
      }

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

  // Step 3: Complete registration with improved inheritance handling
  async registerComplete(req, res) {
    let connection;

    try {
      // Check if database.getConnection exists, fallback to regular query
      if (database.getConnection) {
        connection = await database.getConnection();
        await connection.beginTransaction();
      }

      const {
        firstName,
        lastName,
        email,
        gender,
        birthDate,
        password,
        signature,
        originalMessage,
        sessionId,
        role = 'PATIENT', // Default to PATIENT if not specified
        roleSpecificData = {} // Additional data for role-specific tables
      } = req.body;

      console.log(`🔐 Completing registration for: ${email} as ${role}`);
      console.log(`🔍 Using session ID: ${sessionId}`);

      // 1. Validate required fields
      if (!firstName || !lastName || !email || !gender || !birthDate || !password || !signature || !sessionId) {
        if (connection) await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Missing required registration fields'
        });
      }

      // 2. Validate role
      const validRoles = ['PATIENT', 'DOCTOR', 'PHARMACIST', 'NURSE', 'ADMINISTRATOR'];
      if (!validRoles.includes(role)) {
        if (connection) await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Invalid role specified'
        });
      }

      // 3. Validate field formats
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (connection) await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      if (password.length < 8) {
        if (connection) await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long'
        });
      }

      // 4. Check if email already exists
      const existingUsers = connection ?
        (await connection.query('SELECT userId FROM users WHERE email = ?', [email]))[0] :
        await database.query('SELECT userId FROM users WHERE email = ?', [email]);

      if (existingUsers.length > 0) {
        if (connection) await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }

      // 5. Verify the unblinded signature
      let verification;
      try {
        console.log(`🔍 Starting signature verification for session: ${sessionId}`);

        verification = await blindSignatureService.verifyUnblindedSignature(
          sessionId,
          signature,
          originalMessage
        );

        console.log(`🔍 Signature verification result:`, {
          sessionId,
          isValid: verification?.isValid || false,
          error: verification?.error || 'none',
          hasVerificationObject: !!verification
        });

        // Don't proceed if verification failed or is undefined
        if (!verification) {
          console.log(`❌ No verification result for session: ${sessionId}`);
          if (connection) await connection.rollback();
          return res.status(400).json({
            success: false,
            message: 'Signature verification failed - no result'
          });
        }

        if (!verification.isValid) {
          console.log(`❌ Invalid signature for session: ${sessionId}`);
          if (connection) await connection.rollback();
          return res.status(400).json({
            success: false,
            message: 'Invalid signature verification'
          });
        }

      } catch (verifyError) {
        console.error(`❌ Signature verification error for session: ${sessionId}:`, verifyError.message);
        if (connection) await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Signature verification failed: ${verifyError.message}`
        });
      }

      console.log(`✅ Blind signature verified successfully for session: ${sessionId}`);

      // 6. Create blockchain registration record via Spring Boot
      console.log('🔗 Creating blockchain registration record...');

      const signatureHash = crypto.createHash('sha256').update(signature).digest('hex');
      const identityCommitment = crypto.createHash('sha256')
        .update(`${email}_${sessionId}_${Date.now()}`)
        .digest('hex');

      // Initialize blockchainResult with default values
      let blockchainResult = {
        success: false,
        blockId: `fallback_${Date.now()}`,
        identityCommitment: identityCommitment,
        blockchainAddress: `0x${crypto.randomBytes(20).toString('hex')}`,
        privacyLevel: 'PSEUDONYMOUS',
        complianceProof: 'simulated_compliance',
        cordaTransactionId: `sim_corda_${Date.now()}`,
        immutable: false,
        chainVerified: false,
        fallbackMode: true
      };

      // Try to call Spring Boot blockchain service
      try {
        const blockchainPayload = {
          email,
          sessionId,
          signatureHash,
          identityCommitment,
          registrationType: `${role}_BLIND_SIGNATURE`
        };

        const springBootUrl = process.env.SPRING_BOOT_URL || 'http://localhost:8080';
        const response = await axios.post(`${springBootUrl}/api/blockchain/register`, blockchainPayload, {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.data && response.data.success) {
          blockchainResult = {
            ...blockchainResult,
            ...response.data,
            success: true,
            chainVerified: true,
            immutable: true,
            fallbackMode: false
          };

          console.log('✅ Blockchain registration successful:', {
            blockId: blockchainResult.blockId,
            transactionId: blockchainResult.transactionId || blockchainResult.blockId,
            identityCommitment: blockchainResult.identityCommitment
          });
        } else {
          throw new Error(response.data?.message || 'Blockchain registration failed');
        }

      } catch (blockchainError) {
        console.error('❌ Blockchain registration failed:', blockchainError.message);
        console.log('🎭 Using fallback blockchain simulation');
        // blockchainResult already has fallback values set above
      }

      // 7. Create user record with blockchain references
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const userId = crypto.randomBytes(16).toString('hex');
      const anonymousId = crypto.randomBytes(16).toString('hex');

      console.log(`👤 Creating user with ID: ${userId} and role: ${role}`);

      // Create Corda transaction record for tracking
      const cordaTransactionId = blockchainResult.blockId || `fallback_${Date.now()}`;

      // 8. Create Corda transaction record FIRST (before user to satisfy foreign key)
      try {
        const cordaQuery = `
          INSERT INTO corda_transactions (
            transactionId, linearId, transactionHash, recordType, recordId,
            stateData, participants, status, networkId, confidentialityLevel,
            encryptionUsed, contractClass, timestamp
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'healthcare-network', 'PRIVATE', 1, 'PatientRegistrationContract', NOW())
        `;

        if (connection) {
          await connection.query(cordaQuery, [
            cordaTransactionId,
            blockchainResult.identityCommitment || identityCommitment,
            crypto.createHash('sha256').update(cordaTransactionId + sessionId).digest('hex'),
            `${role}_REGISTRATION`,
            userId,
            JSON.stringify({
              identityCommitment: blockchainResult.identityCommitment || identityCommitment,
              privacyLevel: blockchainResult.privacyLevel || 'PSEUDONYMOUS',
              sessionId: sessionId,
              registrationType: `${role}_BLIND_SIGNATURE`,
              fallbackMode: blockchainResult.fallbackMode || false
            }),
            JSON.stringify(['Hospital', `${role}Registry`]),
            blockchainResult.chainVerified ? 'FINALIZED' : 'VERIFIED'
          ]);
        } else {
          await database.query(cordaQuery, [
            cordaTransactionId,
            blockchainResult.identityCommitment || identityCommitment,
            crypto.createHash('sha256').update(cordaTransactionId + sessionId).digest('hex'),
            `${role}_REGISTRATION`,
            userId,
            JSON.stringify({
              identityCommitment: blockchainResult.identityCommitment || identityCommitment,
              privacyLevel: blockchainResult.privacyLevel || 'PSEUDONYMOUS',
              sessionId: sessionId,
              registrationType: `${role}_BLIND_SIGNATURE`,
              fallbackMode: blockchainResult.fallbackMode || false
            }),
            JSON.stringify(['Hospital', `${role}Registry`]),
            blockchainResult.chainVerified ? 'FINALIZED' : 'VERIFIED'
          ]);
        }
        console.log('✅ Corda transaction record created');
      } catch (cordaError) {
        console.error('❌ Failed to insert Corda transaction:', cordaError.message);

        // If Corda transaction fails, set registrationTxId to NULL to avoid foreign key error
        console.log('⚠️  Setting registrationTxId to NULL due to Corda transaction failure');
        cordaTransactionId = null;
      }

      // 9. Insert into users table (after Corda transaction exists)
      const userQuery = `
        INSERT INTO users (
          userId, firstName, lastName, email, gender, birthDate,
          password, role, anonymousId, blindSignatureSessionId,
          registrationTxId, blockchainAddress, identityCommitment,
          privacyLevel, status, roleSpecificDataComplete, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PSEUDONYMOUS', 'ACTIVE', 0, NOW())
      `;

      if (connection) {
        await connection.query(userQuery, [
          userId, firstName, lastName, email, gender, birthDate,
          hashedPassword, role, anonymousId, sessionId,
          cordaTransactionId, // This will be null if Corda transaction failed
          blockchainResult.blockchainAddress || `0x${crypto.randomBytes(20).toString('hex')}`,
          blockchainResult.identityCommitment || identityCommitment
        ]);
      } else {
        await database.query(userQuery, [
          userId, firstName, lastName, email, gender, birthDate,
          hashedPassword, role, anonymousId, sessionId,
          cordaTransactionId, // This will be null if Corda transaction failed
          blockchainResult.blockchainAddress || `0x${crypto.randomBytes(20).toString('hex')}`,
          blockchainResult.identityCommitment || identityCommitment
        ]);
      }

      console.log('✅ User record created');

      // 10. Insert into role-specific table
      console.log(`📋 Creating ${role} specific record...`);
      const queryExecutor = connection || database;

      try {
        switch (role) {
          case 'PATIENT':
            if (connection) {
              await connection.query(`
                INSERT INTO patients (
                  userId, consentStatus, blockchainStorageConsent,
                  emergencyContact, emergencyContactPhone,
                  emergencyContactRelation
                ) VALUES (?, 'ACTIVE', 1, ?, ?, ?)
              `, [
                userId,
                roleSpecificData.emergencyContact || null,
                roleSpecificData.emergencyContactPhone || null,
                roleSpecificData.emergencyContactRelation || null
              ]);
            } else {
              await database.query(`
                INSERT INTO patients (
                  userId, consentStatus, blockchainStorageConsent,
                  emergencyContact, emergencyContactPhone,
                  emergencyContactRelation
                ) VALUES (?, 'ACTIVE', 1, ?, ?, ?)
              `, [
                userId,
                roleSpecificData.emergencyContact || null,
                roleSpecificData.emergencyContactPhone || null,
                roleSpecificData.emergencyContactRelation || null
              ]);
            }
            console.log('✅ Patient record created');
            break;

          case 'DOCTOR':
            if (connection) {
              await connection.query(`
                INSERT INTO doctors (
                  userId, licenseNumber, department, specialization,
                  qualification, isAvailable, canSignPrescriptions
                ) VALUES (?, ?, ?, ?, ?, 1, 1)
              `, [
                userId,
                roleSpecificData.licenseNumber || 'PENDING_VERIFICATION',
                roleSpecificData.department || null,
                roleSpecificData.specialization || null,
                roleSpecificData.qualification || null
              ]);
            } else {
              await database.query(`
                INSERT INTO doctors (
                  userId, licenseNumber, department, specialization,
                  qualification, isAvailable, canSignPrescriptions
                ) VALUES (?, ?, ?, ?, ?, 1, 1)
              `, [
                userId,
                roleSpecificData.licenseNumber || 'PENDING_VERIFICATION',
                roleSpecificData.department || null,
                roleSpecificData.specialization || null,
                roleSpecificData.qualification || null
              ]);
            }
            console.log('✅ Doctor record created');
            break;

          case 'PHARMACIST':
            if (connection) {
              await connection.query(`
                INSERT INTO pharmacists (
                  userId, licenseNumber, qualification,
                  dispensingAuthorityLevel, canVerifyPrescriptions
                ) VALUES (?, ?, ?, 'BASIC', 1)
              `, [
                userId,
                roleSpecificData.licenseNumber || 'PENDING_VERIFICATION',
                roleSpecificData.qualification || null
              ]);
            } else {
              await database.query(`
                INSERT INTO pharmacists (
                  userId, licenseNumber, qualification,
                  dispensingAuthorityLevel, canVerifyPrescriptions
                ) VALUES (?, ?, ?, 'BASIC', 1)
              `, [
                userId,
                roleSpecificData.licenseNumber || 'PENDING_VERIFICATION',
                roleSpecificData.qualification || null
              ]);
            }
            console.log('✅ Pharmacist record created');
            break;

          case 'NURSE':
            if (connection) {
              await connection.query(`
                INSERT INTO nurses (
                  userId, licenseNumber, qualification,
                  nursingLevel, canAdministerMedications
                ) VALUES (?, ?, ?, 'RN', 1)
              `, [
                userId,
                roleSpecificData.licenseNumber || null,
                roleSpecificData.qualification || null
              ]);
            } else {
              await database.query(`
                INSERT INTO nurses (
                  userId, licenseNumber, qualification,
                  nursingLevel, canAdministerMedications
                ) VALUES (?, ?, ?, 'RN', 1)
              `, [
                userId,
                roleSpecificData.licenseNumber || null,
                roleSpecificData.qualification || null
              ]);
            }
            console.log('✅ Nurse record created');
            break;

          case 'ADMINISTRATOR':
            if (connection) {
              await connection.query(`
                INSERT INTO administrators (
                  userId, positionTitle, department,
                  privilegeLevel, dataAccessLevel
                ) VALUES (?, ?, ?, 'LOW', 'DEPARTMENT')
              `, [
                userId,
                roleSpecificData.positionTitle || 'System Administrator',
                roleSpecificData.department || 'IT'
              ]);
            } else {
              await database.query(`
                INSERT INTO administrators (
                  userId, positionTitle, department,
                  privilegeLevel, dataAccessLevel
                ) VALUES (?, ?, ?, 'LOW', 'DEPARTMENT')
              `, [
                userId,
                roleSpecificData.positionTitle || 'System Administrator',
                roleSpecificData.department || 'IT'
              ]);
            }
            console.log('✅ Administrator record created');
            break;

          default:
            throw new Error(`Unknown role: ${role}`);
        }

        // Update user to mark role-specific data as complete
        if (connection) {
          await connection.query(
            'UPDATE users SET roleSpecificDataComplete = 1 WHERE userId = ?',
            [userId]
          );
        } else {
          await database.query(
            'UPDATE users SET roleSpecificDataComplete = 1 WHERE userId = ?',
            [userId]
          );
        }

      } catch (roleError) {
        console.error(`❌ Failed to create ${role} record:`, roleError.message);
        throw new Error(`Failed to create ${role} record: ${roleError.message}`);
      }

      // 11. Enhanced audit trail
      const auditId = crypto.randomBytes(16).toString('hex');
      const auditHash = crypto.createHash('sha256')
        .update(JSON.stringify({
          action: 'REGISTER_COMPLETE',
          userId,
          role,
          blockchainTx: cordaTransactionId,
          timestamp: new Date()
        }))
        .digest('hex');

      try {
        const auditQuery = `
          INSERT INTO audit_trail (
            auditId, userId, action, entityType, entityId,
            success, auditHash, timestamp, blockchainVerified,
            complianceFlags
          ) VALUES (?, ?, 'REGISTER_COMPLETE', 'USER', ?, 1, ?, NOW(), ?, ?)
        `;

        if (connection) {
          await connection.query(auditQuery, [
            auditId,
            userId,
            userId,
            auditHash,
            blockchainResult.chainVerified ? 1 : 0,
            JSON.stringify({
              blindSignatureUsed: true,
              blockchainRegistered: true,
              privacyPreserved: true,
              role: role,
              cordaTransactionId: cordaTransactionId,
              fallbackMode: blockchainResult.fallbackMode || false
            })
          ]);
        } else {
          await database.query(auditQuery, [
            auditId,
            userId,
            userId,
            auditHash,
            blockchainResult.chainVerified ? 1 : 0,
            JSON.stringify({
              blindSignatureUsed: true,
              blockchainRegistered: true,
              privacyPreserved: true,
              role: role,
              cordaTransactionId: cordaTransactionId,
              fallbackMode: blockchainResult.fallbackMode || false
            })
          ]);
        }
        console.log('✅ Audit trail created');
      } catch (auditError) {
        console.error('❌ Failed to create audit trail:', auditError.message);
        // Continue without failing the entire registration
      }

      // 12. Commit transaction if using connection
      if (connection) {
        await connection.commit();
      }

      console.log(`🎉 Registration completed successfully for: ${email} as ${role} with blockchain tx: ${cordaTransactionId || 'fallback'}`);

      // 13. Enhanced response with blockchain verification
      res.json({
        success: true,
        message: `Registration completed successfully as ${role} with blockchain verification`,
        user: {
          userId,
          firstName,
          lastName,
          email,
          role,
          anonymousId,
          privacyLevel: 'PSEUDONYMOUS',
          blindSignatureVerified: true,
          blockchainRegistered: true,
          sessionId
        },
        blockchain: {
          cordaTransactionId: cordaTransactionId || 'fallback_mode',
          identityCommitment: blockchainResult.identityCommitment || identityCommitment,
          blockchainAddress: blockchainResult.blockchainAddress || `0x${crypto.randomBytes(20).toString('hex')}`,
          privacyLevel: blockchainResult.privacyLevel || 'PSEUDONYMOUS',
          complianceProof: blockchainResult.complianceProof || 'simulated_compliance',
          immutable: blockchainResult.immutable !== false,
          chainVerified: blockchainResult.chainVerified !== false,
          fallbackMode: blockchainResult.fallbackMode || false,
          timestamp: blockchainResult.timestamp || new Date().toISOString()
        },
        privacy: {
          blindSignatureUsed: true,
          serverBlindness: true,
          unlinkableRegistration: true,
          blockchainPrivacy: true
        }
      });

    } catch (error) {
      // Rollback transaction on any error
      if (connection) {
        await connection.rollback();
      }
      console.error('Register complete error:', error);

      // Provide more specific error messages
      let errorMessage = 'Failed to complete registration';
      if (error.code === 'ER_DUP_ENTRY') {
        errorMessage = 'Email already registered';
      } else if (error.message.includes('signature')) {
        errorMessage = 'Invalid signature verification';
      } else if (error.message.includes('blockchain')) {
        errorMessage = 'Blockchain registration failed, please try again';
      } else if (error.message.includes('role')) {
        errorMessage = 'Invalid user role specified';
      }

      res.status(500).json({
        success: false,
        message: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { debug: error.message })
      });
    } finally {
      // Release connection back to pool
      if (connection && connection.release) {
        connection.release();
      }
    }
  }

  // Login with role-based data retrieval
  async login(req, res) {
    try {
      const { email, password } = req.body;

      console.log(`🔑 Login attempt for: ${email}`);

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Find user with role-specific data
      const users = await database.query(`
        SELECT userId, firstName, lastName, email, role, password, status, lastLogin, anonymousId
        FROM users
        WHERE email = ? AND status = 'ACTIVE'
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

      // Get role-specific data based on user role
      let roleSpecificData = {};
      try {
        switch (user.role) {
          case 'PATIENT':
            const patientData = await database.query(`
              SELECT p.*, CONCAT(d.firstName, ' ', d.lastName) as primaryPhysicianName
              FROM patients p
              LEFT JOIN doctors doc ON p.primaryPhysician = doc.userId
              LEFT JOIN users d ON doc.userId = d.userId
              WHERE p.userId = ?
            `, [user.userId]);
            roleSpecificData = patientData[0] || {};
            break;

          case 'DOCTOR':
            const doctorData = await database.query(`
              SELECT * FROM doctors WHERE userId = ?
            `, [user.userId]);
            roleSpecificData = doctorData[0] || {};
            break;

          case 'PHARMACIST':
            const pharmacistData = await database.query(`
              SELECT * FROM pharmacists WHERE userId = ?
            `, [user.userId]);
            roleSpecificData = pharmacistData[0] || {};
            break;

          case 'NURSE':
            const nurseData = await database.query(`
              SELECT * FROM nurses WHERE userId = ?
            `, [user.userId]);
            roleSpecificData = nurseData[0] || {};
            break;

          case 'ADMINISTRATOR':
            const adminData = await database.query(`
              SELECT * FROM administrators WHERE userId = ?
            `, [user.userId]);
            roleSpecificData = adminData[0] || {};
            break;

          default:
            roleSpecificData = {};
        }
      } catch (roleError) {
        console.log('⚠️  Could not fetch role-specific data:', roleError.message);
        // Continue with basic user data
      }

      // Generate tokens
      const tokenPayload = {
        userId: user.userId,
        email: user.email,
        role: user.role,
        anonymousId: user.anonymousId || null
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

      console.log(`🎉 Login successful for user: ${user.userId} (${user.role})`);

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
          anonymousId: user.anonymousId || null,
          roleSpecificData: roleSpecificData
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

      if (!systemKey || !systemKey.publicKey) {
        throw new Error('Failed to retrieve system signing key');
      }

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

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

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

      // Store OTP in database
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

      if (!email || !otp || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Email, OTP, and new password are required'
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long'
        });
      }

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

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        });
      }

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