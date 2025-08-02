-- =====================================================
-- MISSING AUDIT TRAIL TABLE FOR FYP DATABASE
-- =====================================================

USE `fyp`;

-- Create the missing audit_trail table
CREATE TABLE `audit_trail` (
  `auditId` varchar(64) NOT NULL,
  `userId` varchar(64) DEFAULT NULL,
  `sessionId` varchar(64) DEFAULT NULL,
  `action` enum(
    'LOGIN','LOGOUT','REGISTER_INIT','REGISTER_COMPLETE','PASSWORD_RESET',
    'APPOINTMENT_CREATE','APPOINTMENT_UPDATE','APPOINTMENT_CANCEL',
    'MEDICAL_RECORD_CREATE','MEDICAL_RECORD_UPDATE','MEDICAL_RECORD_VIEW',
    'PRESCRIPTION_CREATE','PRESCRIPTION_DISPENSE',
    'USER_CREATE','USER_UPDATE','USER_DELETE',
    'SYSTEM_CONFIG_CHANGE','KEY_GENERATION','BLIND_SIGNATURE_REQUEST',
    'DATA_ACCESS','DATA_EXPORT','EMERGENCY_ACCESS',
    'ADMIN_ACTION','SECURITY_EVENT','COMPLIANCE_CHECK'
  ) NOT NULL,
  `entityType` enum(
    'USER','PATIENT','DOCTOR','PHARMACIST','ADMINISTRATOR',
    'APPOINTMENT','MEDICAL_RECORD','PRESCRIPTION','MEDICINE',
    'SYSTEM','AUDIT','BLOCKCHAIN','STEGANOGRAPHY','CORDA_TRANSACTION'
  ) NOT NULL,
  `entityId` varchar(64) DEFAULT NULL,
  `oldValue` json DEFAULT NULL,
  `newValue` json DEFAULT NULL,
  `success` tinyint DEFAULT 1,
  `errorMessage` text DEFAULT NULL,
  `ipAddress` varchar(45) DEFAULT NULL,
  `userAgent` text DEFAULT NULL,
  `requestMethod` varchar(10) DEFAULT NULL,
  `requestPath` varchar(255) DEFAULT NULL,
  `responseCode` int DEFAULT NULL,
  `processingTime` int DEFAULT NULL, -- milliseconds
  `auditHash` varchar(128) DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `severity` enum('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
  `category` enum('AUTHENTICATION','AUTHORIZATION','DATA_ACCESS','SYSTEM','SECURITY','COMPLIANCE','BLOCKCHAIN','PRIVACY') DEFAULT 'SYSTEM',
  `complianceFlags` json DEFAULT NULL,
  `blockchainVerified` tinyint DEFAULT 0,
  `dataClassification` enum('PUBLIC','INTERNAL','CONFIDENTIAL','RESTRICTED','TOP_SECRET') DEFAULT 'INTERNAL',
  `retentionPeriod` int DEFAULT 2555, -- days (7 years default for healthcare)
  `isArchived` tinyint DEFAULT 0,
  `archivedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`auditId`),
  INDEX `idx_user_action` (`userId`, `action`),
  INDEX `idx_entity` (`entityType`, `entityId`),
  INDEX `idx_timestamp_severity` (`timestamp`, `severity`),
  INDEX `idx_action_success` (`action`, `success`),
  INDEX `idx_category_classification` (`category`, `dataClassification`),
  INDEX `idx_session_action` (`sessionId`, `action`),
  INDEX `idx_ip_timestamp` (`ipAddress`, `timestamp`),
  INDEX `idx_compliance_archived` (`complianceFlags`, `isArchived`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create additional tables that might be referenced
CREATE TABLE IF NOT EXISTS `auth_sessions` (
  `sessionId` varchar(64) NOT NULL,
  `userId` varchar(64) NOT NULL,
  `tokenHash` varchar(128) NOT NULL,
  `refreshTokenHash` varchar(128) DEFAULT NULL,
  `ipAddress` varchar(45) DEFAULT NULL,
  `userAgent` text DEFAULT NULL,
  `loginMethod` enum('PASSWORD','2FA','BIOMETRIC','SSO','EMERGENCY') DEFAULT 'PASSWORD',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `expiresAt` datetime NOT NULL,
  `lastActivityAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` tinyint DEFAULT 1,
  `logoutAt` datetime DEFAULT NULL,
  `deviceFingerprint` varchar(128) DEFAULT NULL,
  `locationData` json DEFAULT NULL,
  `securityFlags` json DEFAULT NULL,
  PRIMARY KEY (`sessionId`),
  INDEX `idx_user_active` (`userId`, `isActive`),
  INDEX `idx_token_hash` (`tokenHash`),
  INDEX `idx_expires_active` (`expiresAt`, `isActive`),
  INDEX `idx_device_fingerprint` (`deviceFingerprint`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create password reset tokens table if needed
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `tokenId` varchar(64) NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `tokenHash` varchar(128) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `expiresAt` datetime NOT NULL,
  `usedAt` datetime DEFAULT NULL,
  `isUsed` tinyint DEFAULT 0,
  `ipAddress` varchar(45) DEFAULT NULL,
  `userAgent` text DEFAULT NULL,
  `attempts` int DEFAULT 0,
  `maxAttempts` int DEFAULT 3,
  PRIMARY KEY (`tokenId`),
  UNIQUE KEY `email_active` (`email`, `isUsed`),
  INDEX `idx_otp_expires` (`otp`, `expiresAt`),
  INDEX `idx_email_used` (`email`, `isUsed`),
  INDEX `idx_expires_used` (`expiresAt`, `isUsed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Add resetOtp and resetOtpExpiry columns to users table if they don't exist
ALTER TABLE `users`
ADD COLUMN IF NOT EXISTS `resetOtp` varchar(6) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS `resetOtpExpiry` datetime DEFAULT NULL,
ADD COLUMN IF NOT EXISTS `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS `idx_reset_otp` ON `users` (`resetOtp`, `resetOtpExpiry`);

-- Insert a test audit log entry to verify the table works
INSERT INTO `audit_trail` (
  `auditId`,
  `action`,
  `entityType`,
  `entityId`,
  `success`,
  `auditHash`,
  `severity`,
  `category`
) VALUES (
  'audit_test_001',
  'SYSTEM_CONFIG_CHANGE',
  'SYSTEM',
  'audit_trail_table_created',
  1,
  SHA2('audit_trail_table_created', 256),
  'MEDIUM',
  'SYSTEM'
);

-- Verify the table was created successfully
SELECT
  'Audit Trail Table Created Successfully!' as message,
  COUNT(*) as initial_records
FROM `audit_trail`;

-- Show table structure
DESCRIBE `audit_trail`;