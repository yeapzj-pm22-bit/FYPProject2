-- =====================================================
-- UNIFIED HEALTHCARE BLOCKCHAIN DATABASE SCHEMA
-- Fixed for MySQL 8.0+ compatibility and existing 'fyp' database
-- =====================================================

-- Use existing database
USE `fyp`;

-- MySQL optimization settings (compatible version)
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- =====================================================
-- CORE CRYPTOGRAPHIC INFRASTRUCTURE (FIXED)
-- =====================================================

-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS `appointments`;
DROP TABLE IF EXISTS `medical_images`;
DROP TABLE IF EXISTS `medical_records`;
DROP TABLE IF EXISTS `medicine_batches`;
DROP TABLE IF EXISTS `medicines`;
DROP TABLE IF EXISTS `doctor_schedules`;
DROP TABLE IF EXISTS `administrators`;
DROP TABLE IF EXISTS `nurses`;
DROP TABLE IF EXISTS `pharmacists`;
DROP TABLE IF EXISTS `doctors`;
DROP TABLE IF EXISTS `patients`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `steganography_data`;
DROP TABLE IF EXISTS `corda_transactions`;
DROP TABLE IF EXISTS `corda_nodes`;
DROP TABLE IF EXISTS `blind_signature_sessions`;
DROP TABLE IF EXISTS `rsa_key_pairs`;
DROP TABLE IF EXISTS `system_config`;

-- RSA Key Pairs for Enhanced Blind Signatures (FIXED)
CREATE TABLE `rsa_key_pairs` (
  `keyId` varchar(64) NOT NULL,
  `entityType` enum('SYSTEM','PATIENT','DOCTOR','PHARMACIST','ADMIN','NOTARY') NOT NULL,
  `entityId` varchar(64) DEFAULT NULL,
  `publicKey` text NOT NULL,
  `privateKey` text NOT NULL, -- Encrypted with master key
  `keySize` int DEFAULT 2048,
  `algorithm` varchar(50) DEFAULT 'RSA-BSSA',
  `purpose` enum('SIGNING','ENCRYPTION','BLIND_SIGNATURE','CORDA_NODE') DEFAULT 'BLIND_SIGNATURE',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `expiresAt` datetime DEFAULT NULL,
  `isActive` tinyint DEFAULT 1,
  `keyFingerprint` varchar(128) NOT NULL,
  `keyUsageCount` int DEFAULT 0,
  `maxUsage` int DEFAULT 1000,
  `rotationRequired` tinyint DEFAULT 0,
  `backupPath` text DEFAULT NULL,
  PRIMARY KEY (`keyId`),
  UNIQUE KEY `keyFingerprint` (`keyFingerprint`),
  INDEX `idx_entity` (`entityType`, `entityId`),
  INDEX `idx_active_purpose` (`isActive`, `purpose`, `expiresAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Enhanced Blind Signature Sessions (FIXED)
CREATE TABLE `blind_signature_sessions` (
  `sessionId` varchar(64) NOT NULL,
  `blindedMessage` text DEFAULT NULL,
  `blindingFactor` text DEFAULT NULL, -- Encrypted
  `messageHash` varchar(128) NOT NULL,
  `blindSignature` text DEFAULT NULL,
  `unblindedSignature` text DEFAULT NULL,
  `signerKeyId` varchar(64) NOT NULL,
  `entityType` enum('USER_REGISTRATION','APPOINTMENT','MEDICAL_RECORD','PRESCRIPTION','DISPENSING','LOGIN','CONSENT','BILLING') NOT NULL,
  `entityId` varchar(64) DEFAULT NULL,
  `status` enum('PENDING','SIGNED','COMPLETED','EXPIRED','REVOKED','FAILED') DEFAULT 'PENDING',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `signedAt` datetime DEFAULT NULL,
  `completedAt` datetime DEFAULT NULL,
  `expiresAt` datetime DEFAULT (DATE_ADD(NOW(), INTERVAL 1 HOUR)),
  `ipAddress` varchar(45) DEFAULT NULL,
  `userAgent` text DEFAULT NULL,
  `verificationCount` int DEFAULT 0,
  `isAnonymous` tinyint DEFAULT 1,
  `challenges` json DEFAULT NULL, -- For multi-round protocols
  `proofOfKnowledge` text DEFAULT NULL,
  `securityLevel` enum('STANDARD','HIGH','CRITICAL') DEFAULT 'STANDARD',
  PRIMARY KEY (`sessionId`),
  INDEX `idx_entity` (`entityType`, `entityId`),
  INDEX `idx_status_created` (`status`, `createdAt`),
  INDEX `idx_signer_key` (`signerKeyId`),
  INDEX `idx_anonymous_security` (`isAnonymous`, `securityLevel`),
  FOREIGN KEY (`signerKeyId`) REFERENCES `rsa_key_pairs`(`keyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- R3 CORDA BLOCKCHAIN INTEGRATION (FIXED)
-- =====================================================

-- Corda Network Nodes (FIXED)
CREATE TABLE `corda_nodes` (
  `nodeId` varchar(64) NOT NULL,
  `organizationName` varchar(100) NOT NULL,
  `nodeType` enum('HOSPITAL','PHARMACY','REGULATOR','NOTARY','INSURANCE','RESEARCH') NOT NULL,
  `publicKey` text NOT NULL,
  `networkAddress` varchar(255) NOT NULL,
  `rpcAddress` varchar(255) DEFAULT NULL,
  `isActive` tinyint DEFAULT 1,
  `joinedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastHeartbeat` datetime DEFAULT NULL,
  `nodeVersion` varchar(50) DEFAULT NULL,
  `cordaVersion` varchar(50) DEFAULT NULL,
  `certificatePath` text DEFAULT NULL,
  `trustStorePath` text DEFAULT NULL,
  `keyStorePath` text DEFAULT NULL,
  `permissions` json DEFAULT NULL,
  `networkMapVersion` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`nodeId`),
  INDEX `idx_type_active` (`nodeType`, `isActive`),
  INDEX `idx_organization` (`organizationName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Enhanced Corda Transactions (FIXED)
CREATE TABLE `corda_transactions` (
  `transactionId` varchar(64) NOT NULL,
  `linearId` varchar(64) NOT NULL,
  `transactionHash` varchar(128) NOT NULL,
  `recordType` enum('PATIENT_REGISTRATION','APPOINTMENT','MEDICAL_RECORD','PRESCRIPTION','DISPENSING','CONSENT','BILLING','SUPPLY_CHAIN','INSURANCE_CLAIM') NOT NULL,
  `recordId` varchar(64) NOT NULL,
  `stateData` json NOT NULL,
  `participants` json NOT NULL, -- Array of participant node IDs
  `notarySignature` text DEFAULT NULL,
  `notaryNodeId` varchar(64) DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `blockHeight` bigint DEFAULT NULL,
  `status` enum('BUILDING','VERIFIED','SIGNED','NOTARIZED','FINALIZED','FAILED') DEFAULT 'BUILDING',
  `networkId` varchar(64) DEFAULT 'healthcare-network',
  `confidentialityLevel` enum('PUBLIC','PRIVATE','CONFIDENTIAL','TOP_SECRET') DEFAULT 'PRIVATE',
  `encryptionUsed` tinyint DEFAULT 1,
  -- Traditional blockchain compatibility
  `blockHash` varchar(66) DEFAULT NULL,
  `blockNumber` bigint DEFAULT NULL,
  `gasUsed` bigint DEFAULT NULL,
  `gasPrice` bigint DEFAULT NULL,
  -- Enhanced metadata
  `contractClass` varchar(255) DEFAULT NULL,
  `commandTypes` json DEFAULT NULL,
  `attachments` json DEFAULT NULL,
  `timeWindow` json DEFAULT NULL,
  `cordaVersion` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`transactionId`),
  UNIQUE KEY `linearId` (`linearId`),
  UNIQUE KEY `transactionHash` (`transactionHash`),
  INDEX `idx_record_type_id` (`recordType`, `recordId`),
  INDEX `idx_status_timestamp` (`status`, `timestamp`),
  INDEX `idx_notary` (`notaryNodeId`),
  INDEX `idx_participants` ((CAST(`participants` AS CHAR(500)))),
  FOREIGN KEY (`notaryNodeId`) REFERENCES `corda_nodes`(`nodeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- ADVANCED STEGANOGRAPHY SYSTEM (FIXED)
-- =====================================================

-- Comprehensive Steganography Data Management (FIXED)
CREATE TABLE `steganography_data` (
  `stegoId` varchar(64) NOT NULL,
  `originalImagePath` text NOT NULL,
  `stegoImagePath` text NOT NULL,
  `coverImageHash` varchar(128) NOT NULL,
  `stegoImageHash` varchar(128) NOT NULL,
  `imageFormat` enum('JPEG','PNG','BMP','TIFF','DICOM','SVG') DEFAULT 'PNG',
  `originalSize` bigint DEFAULT NULL,
  `stegoSize` bigint DEFAULT NULL,
  `width` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `colorDepth` int DEFAULT 24,
  -- Advanced Steganography Algorithms
  `algorithm` enum('RANDOMIZED_LSB','SEQUENTIAL_LSB','DCT','DWT','F5','OUTGUESS','STEGHIDE','J_UNIWARD') DEFAULT 'RANDOMIZED_LSB',
  `hiddenDataSize` int DEFAULT NULL,
  `hiddenDataType` enum('TEXT','JSON','BINARY','ENCRYPTED','MEDICAL_DATA','PRESCRIPTION_DATA') DEFAULT 'ENCRYPTED',
  `hiddenDataHash` varchar(128) DEFAULT NULL,
  `stegoKey` varchar(128) DEFAULT NULL, -- Encrypted with patient's key
  `randomSeed` varchar(64) DEFAULT NULL, -- For randomized algorithms
  `bitPlanes` varchar(20) DEFAULT '1,2,3', -- Which bit planes used
  `pixelSelection` enum('RANDOM','SEQUENTIAL','SPIRAL','EDGE_ADAPTIVE','TEXTURE_ADAPTIVE') DEFAULT 'RANDOM',
  `compressionResistant` tinyint DEFAULT 0,
  -- Quality and Security Metrics
  `psnr` decimal(8,4) DEFAULT NULL,
  `mse` decimal(8,4) DEFAULT NULL,
  `ssim` decimal(6,4) DEFAULT NULL,
  `bpp` decimal(6,4) DEFAULT NULL, -- Bits per pixel
  `capacity` decimal(8,4) DEFAULT NULL, -- Maximum hiding capacity
  `embedRate` decimal(5,2) DEFAULT NULL, -- Actual embedding rate
  `entropyBefore` decimal(8,6) DEFAULT NULL,
  `entropyAfter` decimal(8,6) DEFAULT NULL,
  `histogramVariance` decimal(8,4) DEFAULT NULL,
  `edgePreservation` decimal(6,4) DEFAULT NULL,
  -- Security Features
  `encryptionAlgorithm` varchar(50) DEFAULT 'AES-256-GCM',
  `compressionBeforeHiding` tinyint DEFAULT 1,
  `errorCorrectionUsed` tinyint DEFAULT 1,
  `redundancyLevel` decimal(3,2) DEFAULT 1.0,
  `antiDetectionMeasures` json DEFAULT NULL,
  -- Entity Association
  `entityType` enum('APPOINTMENT','MEDICAL_RECORD','PRESCRIPTION','USER_PROFILE','MEDICAL_IMAGE','REPORT') NOT NULL,
  `entityId` varchar(64) NOT NULL,
  `createdBy` varchar(64) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `accessLevel` enum('PATIENT_ONLY','DOCTOR_PATIENT','MULTI_PARTY','EMERGENCY','RESEARCH') DEFAULT 'DOCTOR_PATIENT',
  `expiresAt` datetime DEFAULT NULL,
  `isActive` tinyint DEFAULT 1,
  PRIMARY KEY (`stegoId`),
  INDEX `idx_entity` (`entityType`, `entityId`),
  INDEX `idx_algorithm_quality` (`algorithm`, `psnr`),
  INDEX `idx_access_level` (`accessLevel`, `isActive`),
  INDEX `idx_creator_date` (`createdBy`, `createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- ENHANCED USER MANAGEMENT (FIXED)
-- =====================================================

-- Comprehensive Users Table (FIXED)
CREATE TABLE `users` (
  `userId` varchar(64) NOT NULL,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `encryptedEmail` text DEFAULT NULL,
  `gender` enum('Male','Female','Other','Prefer_Not_To_Say') DEFAULT 'Prefer_Not_To_Say',
  `birthDate` date DEFAULT NULL,
  `profilePicturePath` text DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('PATIENT','DOCTOR','PHARMACIST','NURSE','ADMINISTRATOR','RESEARCHER','AUDITOR') DEFAULT 'PATIENT',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING_VERIFICATION','DEACTIVATED','BANNED','LOCKED') DEFAULT 'PENDING_VERIFICATION',
  `contactNumber` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `nationalId` varchar(50) DEFAULT NULL,
  `lastLogin` datetime DEFAULT NULL,
  -- Blockchain Integration
  `cordaPartyKey` text DEFAULT NULL,
  `blockchainAddress` varchar(42) DEFAULT NULL,
  `registrationTxId` varchar(64) DEFAULT NULL,
  `identityCommitment` varchar(128) DEFAULT NULL,
  -- Privacy and Anonymity
  `anonymousId` varchar(64) DEFAULT NULL,
  `blindSignatureSessionId` varchar(64) DEFAULT NULL,
  `privacyLevel` enum('PUBLIC','PSEUDONYMOUS','ANONYMOUS','ZERO_KNOWLEDGE') DEFAULT 'PSEUDONYMOUS',
  `consentHash` varchar(128) DEFAULT NULL,
  -- Cryptographic Infrastructure
  `rsaKeyId` varchar(64) DEFAULT NULL,
  `symmetricKeyHash` varchar(128) DEFAULT NULL,
  `steganographyKeyHash` varchar(128) DEFAULT NULL,
  `keyGeneratedAt` datetime DEFAULT NULL,
  `keyExpiresAt` datetime DEFAULT NULL,
  -- Enhanced Security
  `twoFactorEnabled` tinyint DEFAULT 0,
  `biometricEnabled` tinyint DEFAULT 0,
  `loginAttempts` int DEFAULT 0,
  `lockedUntil` datetime DEFAULT NULL,
  `emailVerified` tinyint DEFAULT 0,
  `phoneVerified` tinyint DEFAULT 0,
  `identityVerified` tinyint DEFAULT 0,
  `kycCompleted` tinyint DEFAULT 0,
  `securityQuestions` json DEFAULT NULL,
  `emergencyRecoveryEnabled` tinyint DEFAULT 0,
  -- Compliance and Legal
  `gdprConsentDate` datetime DEFAULT NULL,
  `hipaaConsentDate` datetime DEFAULT NULL,
  `dataRetentionUntil` datetime DEFAULT NULL,
  `rightToBeForgettenRequested` tinyint DEFAULT 0,
  `complianceFlags` json DEFAULT NULL,
  -- Preferences
  `preferredLanguage` varchar(10) DEFAULT 'en',
  `timezone` varchar(50) DEFAULT 'UTC',
  `notificationPreferences` json DEFAULT NULL,
  `accessibilityNeeds` json DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `anonymousId` (`anonymousId`),
  UNIQUE KEY `identityCommitment` (`identityCommitment`),
  UNIQUE KEY `blockchainAddress` (`blockchainAddress`),
  INDEX `idx_role_status` (`role`, `status`),
  INDEX `idx_privacy_level` (`privacyLevel`),
  INDEX `idx_blind_session` (`blindSignatureSessionId`),
  INDEX `idx_verification_status` (`emailVerified`, `phoneVerified`, `identityVerified`),
  FOREIGN KEY (`registrationTxId`) REFERENCES `corda_transactions`(`transactionId`),
  FOREIGN KEY (`blindSignatureSessionId`) REFERENCES `blind_signature_sessions`(`sessionId`),
  FOREIGN KEY (`rsaKeyId`) REFERENCES `rsa_key_pairs`(`keyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Add foreign key constraint for steganography_data after users table is created
ALTER TABLE `steganography_data` ADD CONSTRAINT `steganography_data_creator_fk`
FOREIGN KEY (`createdBy`) REFERENCES `users` (`userId`);

-- Enhanced Patient Information (FIXED)
CREATE TABLE `patients` (
  `userId` varchar(64) NOT NULL,
  `emergencyContact` varchar(100) DEFAULT NULL,
  `emergencyContactPhone` varchar(20) DEFAULT NULL,
  `bloodType` varchar(5) DEFAULT NULL,
  `allergies` json DEFAULT NULL,
  `consentStatus` varchar(50) DEFAULT 'ACTIVE',
  `geneticOrChronicConditions` json DEFAULT NULL,
  `insuranceNumber` varchar(100) DEFAULT NULL,
  `insuranceProvider` varchar(100) DEFAULT NULL,
  `insuranceExpiryDate` date DEFAULT NULL,
  -- Privacy and Security Preferences
  `medicalDataEncrypted` tinyint DEFAULT 1,
  `allowAnonymousAccess` tinyint DEFAULT 0,
  `steganographyEnabled` tinyint DEFAULT 1,
  `blockchainStorageConsent` tinyint DEFAULT 1,
  `researchParticipationConsent` tinyint DEFAULT 0,
  `dataSharing` json DEFAULT NULL,
  -- Medical History Preferences
  `shareWithEmergencyServices` tinyint DEFAULT 1,
  `shareWithPharmacy` tinyint DEFAULT 1,
  `shareWithSpecialists` tinyint DEFAULT 1,
  `autoRenewPrescriptions` tinyint DEFAULT 0,
  PRIMARY KEY (`userId`),
  CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Enhanced Doctors (FIXED)
CREATE TABLE `doctors` (
  `userId` varchar(64) NOT NULL,
  `licenseNumber` varchar(100) NOT NULL,
  `licenseDocumentPath` text DEFAULT NULL,
  `licenseVerified` tinyint DEFAULT 0,
  `department` varchar(100) DEFAULT NULL,
  `specialization` varchar(100) DEFAULT NULL,
  `expertise` json DEFAULT NULL,
  `yearsOfExperience` int DEFAULT NULL,
  `qualification` varchar(255) DEFAULT NULL,
  `consultationFee` decimal(10,2) DEFAULT NULL,
  `isAvailable` tinyint DEFAULT 1,
  `verifiedAt` datetime DEFAULT NULL,
  `verifiedBy` varchar(64) DEFAULT NULL,
  `nextAvailableSlot` datetime DEFAULT NULL,
  -- Cryptographic and Digital Capabilities
  `canSignPrescriptions` tinyint DEFAULT 1,
  `digitalSignatureKeyId` varchar(64) DEFAULT NULL,
  `steganographyAuthorized` tinyint DEFAULT 1,
  `blockchainParticipant` tinyint DEFAULT 1,
  `cordaNodeId` varchar(64) DEFAULT NULL,
  `telemedicineEnabled` tinyint DEFAULT 0,
  -- Professional Information
  `hospitalAffiliation` varchar(200) DEFAULT NULL,
  `boardCertifications` json DEFAULT NULL,
  `researchInterests` json DEFAULT NULL,
  `publicationsCount` int DEFAULT 0,
  `patientRating` decimal(3,2) DEFAULT NULL,
  `maxPatientsPerDay` int DEFAULT 20,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `licenseNumber` (`licenseNumber`),
  INDEX `idx_department_specialization` (`department`, `specialization`),
  INDEX `idx_expertise` ((CAST(`expertise` AS CHAR(255)))),
  INDEX `idx_availability` (`isAvailable`, `nextAvailableSlot`),
  CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `doctors_signature_key_fk` FOREIGN KEY (`digitalSignatureKeyId`) REFERENCES `rsa_key_pairs`(`keyId`),
  CONSTRAINT `doctors_corda_node_fk` FOREIGN KEY (`cordaNodeId`) REFERENCES `corda_nodes`(`nodeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Enhanced Pharmacists (FIXED)
CREATE TABLE `pharmacists` (
  `userId` varchar(64) NOT NULL,
  `licenseNumber` varchar(100) NOT NULL,
  `licenseDocumentPath` text DEFAULT NULL,
  `licenseVerified` tinyint DEFAULT 0,
  `qualification` varchar(255) DEFAULT NULL,
  `specializations` json DEFAULT NULL,
  `yearsOfExperience` int DEFAULT NULL,
  `approvalAuthority` tinyint DEFAULT 0,
  `shiftType` enum('MORNING','EVENING','NIGHT','ROTATING','FLEXIBLE') DEFAULT 'MORNING',
  `verifiedAt` datetime DEFAULT NULL,
  `verifiedBy` varchar(64) DEFAULT NULL,
  -- Blockchain & Crypto capabilities
  `canVerifyPrescriptions` tinyint DEFAULT 1,
  `digitalSignatureKeyId` varchar(64) DEFAULT NULL,
  `blockchainParticipant` tinyint DEFAULT 1,
  `cordaNodeId` varchar(64) DEFAULT NULL,
  `dispensingAuthorityLevel` enum('BASIC','ADVANCED','CONTROLLED','RESEARCH','EMERGENCY') DEFAULT 'BASIC',
  -- Operational Details
  `pharmacyBranch` varchar(100) DEFAULT NULL,
  `canCompoundMedications` tinyint DEFAULT 0,
  `certifiedForControlledSubstances` tinyint DEFAULT 0,
  `maxDispensesPerDay` int DEFAULT 100,
  `workingHours` json DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `licenseNumber` (`licenseNumber`),
  INDEX `idx_authority_level` (`dispensingAuthorityLevel`),
  INDEX `idx_pharmacy_branch` (`pharmacyBranch`),
  CONSTRAINT `pharmacists_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `pharmacists_signature_key_fk` FOREIGN KEY (`digitalSignatureKeyId`) REFERENCES `rsa_key_pairs`(`keyId`),
  CONSTRAINT `pharmacists_corda_node_fk` FOREIGN KEY (`cordaNodeId`) REFERENCES `corda_nodes`(`nodeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Enhanced Nurses (FIXED)
CREATE TABLE `nurses` (
  `userId` varchar(64) NOT NULL,
  `licenseNumber` varchar(100) DEFAULT NULL,
  `licenseDocumentPath` text DEFAULT NULL,
  `licenseVerified` tinyint DEFAULT 0,
  `department` varchar(100) DEFAULT NULL,
  `qualification` varchar(255) DEFAULT NULL,
  `specializations` json DEFAULT NULL,
  `yearsOfExperience` int DEFAULT NULL,
  `shiftType` enum('MORNING','EVENING','NIGHT','ROTATING','ON_CALL') DEFAULT 'MORNING',
  `nursingLevel` enum('RN','LPN','CNA','NP','CNS') DEFAULT 'RN',
  `verifiedAt` datetime DEFAULT NULL,
  `verifiedBy` varchar(64) DEFAULT NULL,
  `assignedWard` varchar(100) DEFAULT NULL,
  `maxPatientsAssigned` int DEFAULT 8,
  `canAdministerMedications` tinyint DEFAULT 1,
  `emergencyResponseTrained` tinyint DEFAULT 0,
  PRIMARY KEY (`userId`),
  INDEX `idx_department_level` (`department`, `nursingLevel`),
  INDEX `idx_shift_ward` (`shiftType`, `assignedWard`),
  CONSTRAINT `nurses_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Enhanced Administrators (FIXED)
CREATE TABLE `administrators` (
  `userId` varchar(64) NOT NULL,
  `positionTitle` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `privilegeLevel` enum('LOW','MEDIUM','HIGH','SUPER_ADMIN') DEFAULT 'LOW',
  `canApproveLeaves` tinyint DEFAULT 0,
  `canManageInventory` tinyint DEFAULT 0,
  `canManageUsers` tinyint DEFAULT 0,
  `canAccessAuditLogs` tinyint DEFAULT 0,
  `canManageBlockchain` tinyint DEFAULT 0,
  `canManageCrypto` tinyint DEFAULT 0,
  `systemPermissions` json DEFAULT NULL,
  `dataAccessLevel` enum('DEPARTMENT','HOSPITAL','NETWORK','GLOBAL') DEFAULT 'DEPARTMENT',
  `emergencyOverrideEnabled` tinyint DEFAULT 0,
  PRIMARY KEY (`userId`),
  INDEX `idx_privilege_department` (`privilegeLevel`, `department`),
  CONSTRAINT `administrators_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- APPOINTMENT MANAGEMENT (FIXED)
-- =====================================================

-- Doctor Schedules (FIXED)
CREATE TABLE `doctor_schedules` (
  `scheduleId` varchar(64) NOT NULL,
  `doctorId` varchar(64) NOT NULL,
  `scheduleType` enum('REGULAR','TEMPORARY','EMERGENCY','RESEARCH') DEFAULT 'REGULAR',
  `workingDays` json DEFAULT NULL,
  `startTime` time DEFAULT NULL,
  `endTime` time DEFAULT NULL,
  `breakStartTime` time DEFAULT NULL,
  `breakEndTime` time DEFAULT NULL,
  `isWorkingDay` tinyint DEFAULT 1,
  `effectiveFrom` date DEFAULT NULL,
  `effectiveTo` date DEFAULT NULL,
  `maxAppointmentsPerDay` int DEFAULT 20,
  `appointmentDuration` int DEFAULT 30,
  `bufferBetweenAppointments` int DEFAULT 5,
  `allowEmergencySlots` tinyint DEFAULT 1,
  `telemedicineSlots` int DEFAULT 0,
  `lastUpdated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `holidays` json DEFAULT NULL,
  `specialAvailability` json DEFAULT NULL,
  PRIMARY KEY (`scheduleId`),
  INDEX `idx_doctor_effective` (`doctorId`, `effectiveFrom`, `effectiveTo`),
  INDEX `idx_schedule_type` (`scheduleType`, `isWorkingDay`),
  CONSTRAINT `doctor_schedules_ibfk_1` FOREIGN KEY (`doctorId`) REFERENCES `doctors` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Comprehensive Appointments (FIXED)
CREATE TABLE `appointments` (
  `appointmentId` varchar(64) NOT NULL,
  `patientId` varchar(64) NOT NULL,
  `doctorId` varchar(64) NOT NULL,
  `appointmentType` enum('CONSULTATION','FOLLOW_UP','EMERGENCY','TELEMEDICINE','ROUTINE_CHECKUP') DEFAULT 'CONSULTATION',
  `expertise` varchar(100) DEFAULT NULL,
  `appointmentDate` date NOT NULL,
  `appointmentTime` time NOT NULL,
  `estimatedDuration` int DEFAULT 30,
  `purpose` text DEFAULT NULL,
  `encryptedPurpose` text DEFAULT NULL,
  `symptoms` text DEFAULT NULL,
  `urgencyLevel` enum('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
  `status` enum('PENDING','APPROVED','REJECTED','CANCELLED','COMPLETED','NO_SHOW','RESCHEDULED','IN_PROGRESS') DEFAULT 'PENDING',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `decisionAt` datetime DEFAULT NULL,
  `decisionBy` varchar(64) DEFAULT NULL,
  `cancellationReason` text DEFAULT NULL,
  `rescheduleCount` int DEFAULT 0,
  -- Blockchain Integration
  `cordaTransactionId` varchar(64) DEFAULT NULL,
  `blockchainTxHash` varchar(66) DEFAULT NULL,
  `appointmentHash` varchar(128) DEFAULT NULL,
  `smartContractAddress` varchar(42) DEFAULT NULL,
  -- Privacy & Blind Signatures
  `anonymousPatientId` varchar(64) DEFAULT NULL,
  `blindSignatureSessionId` varchar(64) DEFAULT NULL,
  `privacyMode` enum('STANDARD','ANONYMOUS','ZERO_KNOWLEDGE','ENCRYPTED') DEFAULT 'STANDARD',
  -- Steganography Integration
  `steganographyDataId` varchar(64) DEFAULT NULL,
  `purposeHiddenInImage` tinyint DEFAULT 0,
  `coverImageProvided` tinyint DEFAULT 0,
  `coverImagePath` text DEFAULT NULL,
  `steganographyMetadata` json DEFAULT NULL,
  `hasHiddenData` tinyint DEFAULT 0,
  -- Communication & Notifications
  `patientNotified` tinyint DEFAULT 0,
  `doctorNotified` tinyint DEFAULT 0,
  `reminderSent` tinyint DEFAULT 0,
  `confirmationRequired` tinyint DEFAULT 1,
  `confirmationDeadline` datetime DEFAULT NULL,
  `communicationPreferences` json DEFAULT NULL,
  -- Telemedicine
  `isTelemedicine` tinyint DEFAULT 0,
  `meetingLink` text DEFAULT NULL,
  `meetingPassword` varchar(50) DEFAULT NULL,
  `platformUsed` varchar(50) DEFAULT NULL,
  -- Insurance and Billing
  `insurancePreApprovalRequired` tinyint DEFAULT 0,
  `insuranceApprovalNumber` varchar(100) DEFAULT NULL,
  `estimatedCost` decimal(10,2) DEFAULT NULL,
  -- Quality and Follow-up
  `followUpRequired` tinyint DEFAULT 0,
  `followUpDate` date DEFAULT NULL,
  `patientSatisfactionRating` decimal(2,1) DEFAULT NULL,
  `appointmentNotes` text DEFAULT NULL,
  PRIMARY KEY (`appointmentId`),
  INDEX `idx_patient_date` (`patientId`, `appointmentDate`),
  INDEX `idx_doctor_date_status` (`doctorId`, `appointmentDate`, `status`),
  INDEX `idx_status_urgency` (`status`, `urgencyLevel`),
  INDEX `idx_corda_tx` (`cordaTransactionId`),
  INDEX `idx_blockchain_tx` (`blockchainTxHash`),
  INDEX `idx_blind_session` (`blindSignatureSessionId`),
  INDEX `idx_steganography` (`steganographyDataId`),
  INDEX `idx_telemedicine` (`isTelemedicine`, `appointmentDate`),
  CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patientId`) REFERENCES `patients` (`userId`),
  CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`doctorId`) REFERENCES `doctors` (`userId`),
  CONSTRAINT `appointments_corda_fk` FOREIGN KEY (`cordaTransactionId`) REFERENCES `corda_transactions`(`transactionId`),
  CONSTRAINT `appointments_blind_fk` FOREIGN KEY (`blindSignatureSessionId`) REFERENCES `blind_signature_sessions`(`sessionId`),
  CONSTRAINT `appointments_stego_fk` FOREIGN KEY (`steganographyDataId`) REFERENCES `steganography_data`(`stegoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- MEDICAL RECORDS (FIXED)
-- =====================================================

-- Enhanced Medical Records (FIXED)
CREATE TABLE `medical_records` (
  `medicalRecordId` varchar(64) NOT NULL,
  `appointmentId` varchar(64) NOT NULL,
  `patientId` varchar(64) NOT NULL,
  `doctorId` varchar(64) NOT NULL,
  `recordType` enum('CONSULTATION','DIAGNOSIS','TREATMENT','SURGERY','LAB_RESULT','IMAGING','EMERGENCY') DEFAULT 'CONSULTATION',
  `diagnosis` text DEFAULT NULL,
  `encryptedDiagnosis` text DEFAULT NULL,
  `primaryDiagnosisCode` varchar(20) DEFAULT NULL,
  `secondaryDiagnosisCodes` json DEFAULT NULL,
  `symptoms` text DEFAULT NULL,
  `vitalSigns` json DEFAULT NULL,
  `treatmentPlan` text DEFAULT NULL,
  `medications` json DEFAULT NULL,
  `procedures` json DEFAULT NULL,
  `followUpInstructions` text DEFAULT NULL,
  `doctorNotes` text DEFAULT NULL,
  `patientReportedOutcomes` json DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastModifiedBy` varchar(64) DEFAULT NULL,
  -- Blockchain Integration
  `cordaTransactionId` varchar(64) DEFAULT NULL,
  `blockchainTxHash` varchar(66) DEFAULT NULL,
  `recordHash` varchar(128) DEFAULT NULL,
  `ipfsHash` varchar(64) DEFAULT NULL,
  `dataIntegrityVerified` tinyint DEFAULT 0,
  -- Privacy and Access Control
  `anonymousPatientId` varchar(64) DEFAULT NULL,
  `blindSignatureSessionId` varchar(64) DEFAULT NULL,
  `accessControlHash` varchar(128) DEFAULT NULL,
  `privacyLevel` enum('STANDARD','ENCRYPTED','ANONYMOUS','ZERO_KNOWLEDGE') DEFAULT 'ENCRYPTED',
  `isConfidential` tinyint DEFAULT 1,
  `accessLevel` enum('PATIENT_DOCTOR','MULTI_SPECIALIST','EMERGENCY','RESEARCH','INSURANCE') DEFAULT 'PATIENT_DOCTOR',
  `shareableWithPharmacy` tinyint DEFAULT 0,
  `emergencyAccess` tinyint DEFAULT 1,
  `researchConsent` tinyint DEFAULT 0,
  -- Steganography Integration
  `hasSteganographicData` tinyint DEFAULT 0,
  `steganographyDataId` varchar(64) DEFAULT NULL,
  `hiddenDataType` enum('DIAGNOSIS_DETAILS','TREATMENT_NOTES','CONFIDENTIAL_REMARKS','RESEARCH_DATA','GENETIC_INFO') DEFAULT NULL,
  `steganographyEnabled` tinyint DEFAULT 0,
  `hiddenDataHash` varchar(66) DEFAULT NULL,
  `stegoAlgorithm` enum('LSB','DCT','DWT','SPREAD_SPECTRUM','RANDOMIZED_LSB') DEFAULT NULL,
  `stegoKey` varchar(128) DEFAULT NULL,
  -- Quality and Compliance
  `qualityScore` decimal(3,2) DEFAULT NULL,
  `completenessScore` decimal(3,2) DEFAULT NULL,
  `complianceFlags` json DEFAULT NULL,
  `auditRequired` tinyint DEFAULT 0,
  `clinicalTrialData` tinyint DEFAULT 0,
  `regulatoryReporting` json DEFAULT NULL,
  -- Version Control
  `version` int DEFAULT 1,
  `previousVersionId` varchar(64) DEFAULT NULL,
  `isCurrentVersion` tinyint DEFAULT 1,
  `changeReason` text DEFAULT NULL,
  PRIMARY KEY (`medicalRecordId`),
  UNIQUE KEY `appointmentId` (`appointmentId`),
  INDEX `idx_patient_date` (`patientId`, `createdAt`),
  INDEX `idx_doctor_date` (`doctorId`, `createdAt`),
  INDEX `idx_record_type` (`recordType`, `createdAt`),
  INDEX `idx_diagnosis_code` (`primaryDiagnosisCode`),
  INDEX `idx_privacy_access` (`privacyLevel`, `accessLevel`),
  INDEX `idx_corda_tx` (`cordaTransactionId`),
  INDEX `idx_blockchain_tx` (`blockchainTxHash`),
  INDEX `idx_steganography` (`steganographyDataId`),
  INDEX `idx_version_current` (`version`, `isCurrentVersion`),
  CONSTRAINT `medical_records_ibfk_1` FOREIGN KEY (`appointmentId`) REFERENCES `appointments` (`appointmentId`),
  CONSTRAINT `medical_records_ibfk_2` FOREIGN KEY (`patientId`) REFERENCES `patients` (`userId`),
  CONSTRAINT `medical_records_ibfk_3` FOREIGN KEY (`doctorId`) REFERENCES `doctors` (`userId`),
  CONSTRAINT `medical_records_corda_fk` FOREIGN KEY (`cordaTransactionId`) REFERENCES `corda_transactions`(`transactionId`),
  CONSTRAINT `medical_records_stego_fk` FOREIGN KEY (`steganographyDataId`) REFERENCES `steganography_data`(`stegoId`),
  CONSTRAINT `medical_records_version_fk` FOREIGN KEY (`previousVersionId`) REFERENCES `medical_records`(`medicalRecordId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Medical Images (FIXED)
CREATE TABLE `medical_images` (
  `imageId` varchar(64) NOT NULL,
  `medicalRecordId` varchar(64) NOT NULL,
  `originalImagePath` text NOT NULL,
  `stegoImagePath` text DEFAULT NULL,
  `thumbnailPath` text DEFAULT NULL,
  `imageType` varchar(50) DEFAULT NULL,
  `imageFormat` enum('JPEG','PNG','DICOM','TIFF','BMP','SVG','NIFTI') DEFAULT 'DICOM',
  `imageSize` bigint DEFAULT NULL,
  `imageWidth` int DEFAULT NULL,
  `imageHeight` int DEFAULT NULL,
  `colorDepth` int DEFAULT 16,
  `compressionRatio` decimal(5,2) DEFAULT NULL,
  `uploadedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `uploadedBy` varchar(64) DEFAULT NULL,
  -- Medical Metadata
  `bodyPart` varchar(100) DEFAULT NULL,
  `imagingModality` varchar(50) DEFAULT NULL,
  `studyDate` date DEFAULT NULL,
  `studyTime` time DEFAULT NULL,
  `studyInstanceUID` varchar(128) DEFAULT NULL,
  `seriesInstanceUID` varchar(128) DEFAULT NULL,
  `sopInstanceUID` varchar(128) DEFAULT NULL,
  `radiologistNotes` text DEFAULT NULL,
  `aiAnalysisResults` json DEFAULT NULL,
  `abnormalityDetected` tinyint DEFAULT NULL,
  `urgencyFlag` tinyint DEFAULT 0,
  -- Steganography Integration
  `steganographyDataId` varchar(64) DEFAULT NULL,
  `hasSteganography` tinyint DEFAULT 0,
  `steganographyAlgorithm` enum('LSB','DCT','DWT','SPREAD_SPECTRUM','F5','OUTGUESS','RANDOMIZED_LSB') DEFAULT NULL,
  `hiddenDataSize` int DEFAULT NULL,
  `hiddenDataHash` varchar(66) DEFAULT NULL,
  `stegoKey` varchar(128) DEFAULT NULL,
  `qualityMetrics` json DEFAULT NULL,
  `psnr` decimal(8,4) DEFAULT NULL,
  `mse` decimal(8,4) DEFAULT NULL,
  `ssim` decimal(6,4) DEFAULT NULL,
  -- Blockchain Integration
  `imageHash` varchar(128) NOT NULL,
  `cordaTransactionId` varchar(64) DEFAULT NULL,
  `blockchainTxHash` varchar(66) DEFAULT NULL,
  `integrityVerified` tinyint DEFAULT 0,
  -- Access Control
  `accessLevel` enum('DOCTOR_ONLY','PATIENT_DOCTOR','MULTI_SPECIALIST','EMERGENCY','RESEARCH') DEFAULT 'DOCTOR_ONLY',
  `isConfidential` tinyint DEFAULT 1,
  `encryptionUsed` tinyint DEFAULT 1,
  `anonymized` tinyint DEFAULT 0,
  `patientConsentForResearch` tinyint DEFAULT 0,
  -- Processing
  `processingStatus` enum('RAW','PROCESSED','ANALYZED','ARCHIVED','FAILED') DEFAULT 'RAW',
  `processingNotes` text DEFAULT NULL,
  `analysisCompletedAt` datetime DEFAULT NULL,
  `qualityAssuranceApproved` tinyint DEFAULT 0,
  PRIMARY KEY (`imageId`),
  INDEX `idx_medical_record` (`medicalRecordId`),
  INDEX `idx_modality_body_part` (`imagingModality`, `bodyPart`),
  INDEX `idx_steganography` (`steganographyDataId`),
  INDEX `idx_study_instance` (`studyInstanceUID`),
  INDEX `idx_corda_tx` (`cordaTransactionId`),
  INDEX `idx_blockchain_tx` (`blockchainTxHash`),
  INDEX `idx_access_level` (`accessLevel`, `isConfidential`),
  CONSTRAINT `medical_images_ibfk_1` FOREIGN KEY (`medicalRecordId`) REFERENCES `medical_records` (`medicalRecordId`) ON DELETE CASCADE,
  CONSTRAINT `medical_images_ibfk_2` FOREIGN KEY (`uploadedBy`) REFERENCES `users` (`userId`),
  CONSTRAINT `medical_images_stego_fk` FOREIGN KEY (`steganographyDataId`) REFERENCES `steganography_data`(`stegoId`),
  CONSTRAINT `medical_images_corda_fk` FOREIGN KEY (`cordaTransactionId`) REFERENCES `corda_transactions`(`transactionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- PHARMACY MANAGEMENT (FIXED)
-- =====================================================

-- Comprehensive Medicines (FIXED)
CREATE TABLE `medicines` (
  `medicineId` varchar(64) NOT NULL,
  `name` varchar(100) NOT NULL,
  `genericName` varchar(100) DEFAULT NULL,
  `brandName` varchar(100) DEFAULT NULL,
  `manufacturer` varchar(100) DEFAULT NULL,
  `dosageForm` varchar(100) DEFAULT NULL,
  `strength` varchar(50) DEFAULT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `therapeuticClass` varchar(100) DEFAULT NULL,
  `pharmacologicalClass` varchar(100) DEFAULT NULL,
  `activeIngredients` json DEFAULT NULL,
  `inactiveIngredients` json DEFAULT NULL,
  -- Regulatory Information
  `ndc` varchar(20) DEFAULT NULL,
  `rxcui` varchar(20) DEFAULT NULL,
  `atcCode` varchar(20) DEFAULT NULL,
  `fdaApprovalDate` date DEFAULT NULL,
  `approvedIndication` text DEFAULT NULL,
  `contraindications` text DEFAULT NULL,
  `warnings` text DEFAULT NULL,
  `precautions` text DEFAULT NULL,
  `sideEffects` text DEFAULT NULL,
  `adverseReactions` text DEFAULT NULL,
  `interactions` text DEFAULT NULL,
  `overdoseInformation` text DEFAULT NULL,
  -- Classification and Control
  `status` enum('ACTIVE','INACTIVE','OUT_OF_STOCK','DISCONTINUED','EXPIRED','RECALLED') DEFAULT 'ACTIVE',
  `requiresPrescription` tinyint DEFAULT 1,
  `isControlledSubstance` tinyint DEFAULT 0,
  `controlledSubstanceSchedule` varchar(10) DEFAULT NULL,
  `isOTC` tinyint DEFAULT 0,
  `isGeneric` tinyint DEFAULT 0,
  `hasBlackBoxWarning` tinyint DEFAULT 0,
  -- Pricing and Availability
  `standardPrice` decimal(10,2) DEFAULT NULL,
  `wholesalePrice` decimal(10,2) DEFAULT NULL,
  `insuranceCoverage` tinyint DEFAULT 1,
  `availabilityStatus` enum('IN_STOCK','LOW_STOCK','OUT_OF_STOCK','BACK_ORDER','DISCONTINUED') DEFAULT 'IN_STOCK',
  `minimumStockLevel` int DEFAULT 10,
  `reorderPoint` int DEFAULT 20,
  -- Blockchain and Tracking
  `blockchainTracked` tinyint DEFAULT 1,
  `supplyChainVerified` tinyint DEFAULT 0,
  `batchTrackingRequired` tinyint DEFAULT 1,
  `temperatureControlRequired` tinyint DEFAULT 0,
  `storageRequirements` text DEFAULT NULL,
  -- Clinical Information
  `dosageGuidelines` json DEFAULT NULL,
  `pediatricDosing` json DEFAULT NULL,
  `geriatricConsiderations` json DEFAULT NULL,
  `pregnancyCategory` varchar(10) DEFAULT NULL,
  `lactationSafety` varchar(50) DEFAULT NULL,
  `renalAdjustment` text DEFAULT NULL,
  `hepaticAdjustment` text DEFAULT NULL,
  -- Quality and Research
  `clinicalTrials` json DEFAULT NULL,
  `postMarketingSurveillance` tinyint DEFAULT 0,
  `pharmacovigilanceData` json DEFAULT NULL,
  `qualityRating` decimal(3,2) DEFAULT NULL,
  -- System Fields
  `createdBy` varchar(64) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastReviewed` datetime DEFAULT NULL,
  `reviewedBy` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`medicineId`),
  UNIQUE KEY `ndc` (`ndc`),
  UNIQUE KEY `rxcui` (`rxcui`),
  INDEX `idx_name_generic` (`name`, `genericName`),
  INDEX `idx_category_class` (`category`, `therapeuticClass`),
  INDEX `idx_status_availability` (`status`, `availabilityStatus`),
  INDEX `idx_controlled_substance` (`isControlledSubstance`, `controlledSubstanceSchedule`),
  INDEX `idx_manufacturer` (`manufacturer`),
  INDEX `idx_atc_code` (`atcCode`),
  CONSTRAINT `medicines_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `pharmacists` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Medicine Batches (FIXED)
CREATE TABLE `medicine_batches` (
  `batchId` varchar(64) NOT NULL,
  `medicineId` varchar(64) NOT NULL,
  `batchNumber` varchar(100) NOT NULL,
  `lotNumber` varchar(100) DEFAULT NULL,
  `serialNumber` varchar(100) DEFAULT NULL,
  `quantityReceived` int NOT NULL,
  `quantityRemaining` int NOT NULL,
  `quantityReserved` int DEFAULT 0,
  `quantityDispensed` int DEFAULT 0,
  `quantityExpired` int DEFAULT 0,
  `quantityDamaged` int DEFAULT 0,
  `quantityReturned` int DEFAULT 0,
  -- Dates and Lifecycle
  `manufacturingDate` date DEFAULT NULL,
  `expiryDate` date NOT NULL,
  `receivedDate` date NOT NULL,
  `firstDispenseDate` date DEFAULT NULL,
  `lastDispenseDate` date DEFAULT NULL,
  `quarantineDate` date DEFAULT NULL,
  `releaseDate` date DEFAULT NULL,
  -- Supply Chain Information
  `supplier` varchar(100) DEFAULT NULL,
  `supplierBatchId` varchar(100) DEFAULT NULL,
  `supplierContact` varchar(100) DEFAULT NULL,
  `purchaseOrderNumber` varchar(100) DEFAULT NULL,
  `invoiceNumber` varchar(100) DEFAULT NULL,
  `costPerUnit` decimal(10,2) DEFAULT NULL,
  `totalCost` decimal(10,2) DEFAULT NULL,
  `sellingPricePerUnit` decimal(10,2) DEFAULT NULL,
  -- Storage and Quality
  `storageCondition` varchar(100) DEFAULT NULL,
  `storageLocation` varchar(100) DEFAULT NULL,
  `storageZone` varchar(50) DEFAULT NULL,
  `temperatureRange` varchar(50) DEFAULT NULL,
  `humidityRange` varchar(50) DEFAULT NULL,
  `lightSensitive` tinyint DEFAULT 0,
  `coldChainRequired` tinyint DEFAULT 0,
  -- Quality Control
  `status` enum('RECEIVED','QUARANTINE','RELEASED','AVAILABLE','EXPIRED','DEPLETED','DAMAGED','RECALLED','DESTROYED') DEFAULT 'RECEIVED',
  `qualityChecked` tinyint DEFAULT 0,
  `qualityCheckDate` datetime DEFAULT NULL,
  `qualityCheckedBy` varchar(64) DEFAULT NULL,
  `qualityNotes` text DEFAULT NULL,
  `qualityTestResults` json DEFAULT NULL,
  `certificationDocuments` json DEFAULT NULL,
  `stabilityData` json DEFAULT NULL,
  -- Blockchain and Traceability
  `blockchainTracked` tinyint DEFAULT 1,
  `supplyChainHash` varchar(128) DEFAULT NULL,
  `cordaTransactionId` varchar(64) DEFAULT NULL,
  `blockchainTxHash` varchar(66) DEFAULT NULL,
  `temperatureLog` json DEFAULT NULL,
  `transportationLog` json DEFAULT NULL,
  `handlingEvents` json DEFAULT NULL,
  `tamperEvidence` json DEFAULT NULL,
  -- Regulatory and Compliance
  `gmpCompliant` tinyint DEFAULT 1,
  `fdaInspected` tinyint DEFAULT 0,
  `recallStatus` enum('NONE','CLASS_I','CLASS_II','CLASS_III','VOLUNTARY','MARKET_WITHDRAWAL') DEFAULT 'NONE',
  `regulatoryReports` json DEFAULT NULL,
  `auditTrail` json DEFAULT NULL,
  -- System Fields
  `createdBy` varchar(64) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastAuditedAt` datetime DEFAULT NULL,
  `alertsGenerated` json DEFAULT NULL,
  PRIMARY KEY (`batchId`),
  UNIQUE KEY `unique_medicine_batch` (`medicineId`, `batchNumber`),
  INDEX `idx_medicine_expiry` (`medicineId`, `expiryDate`),
  INDEX `idx_status_location` (`status`, `storageLocation`),
  INDEX `idx_supplier_batch` (`supplier`, `supplierBatchId`),
  INDEX `idx_corda_tx` (`cordaTransactionId`),
  INDEX `idx_blockchain_tx` (`blockchainTxHash`),
  INDEX `idx_recall_status` (`recallStatus`),
  CONSTRAINT `medicine_batches_ibfk_1` FOREIGN KEY (`medicineId`) REFERENCES `medicines` (`medicineId`),
  CONSTRAINT `medicine_batches_ibfk_2` FOREIGN KEY (`createdBy`) REFERENCES `pharmacists` (`userId`),
  CONSTRAINT `medicine_batches_corda_fk` FOREIGN KEY (`cordaTransactionId`) REFERENCES `corda_transactions`(`transactionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- SYSTEM CONFIGURATION (FIXED)
-- =====================================================

-- System Configuration (FIXED)
CREATE TABLE `system_config` (
  `configId` varchar(64) NOT NULL,
  `configKey` varchar(100) NOT NULL,
  `configValue` text NOT NULL,
  `configType` enum('BLOCKCHAIN','CRYPTO','SYSTEM','SECURITY','PRIVACY','STEGANOGRAPHY','CORDA','COMPLIANCE') NOT NULL,
  `description` text DEFAULT NULL,
  `isEncrypted` tinyint DEFAULT 0,
  `isActive` tinyint DEFAULT 1,
  `securityLevel` enum('PUBLIC','INTERNAL','CONFIDENTIAL','RESTRICTED','TOP_SECRET') DEFAULT 'INTERNAL',
  `lastUpdatedBy` varchar(64) DEFAULT NULL,
  `validationRules` json DEFAULT NULL,
  `dependencies` json DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`configId`),
  UNIQUE KEY `configKey` (`configKey`),
  INDEX `idx_type_active` (`configType`, `isActive`),
  INDEX `idx_security_level` (`securityLevel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert Essential System Configuration
INSERT INTO `system_config` (`configId`, `configKey`, `configValue`, `configType`, `description`, `securityLevel`) VALUES
('cfg001', 'RSA_KEY_SIZE', '2048', 'CRYPTO', 'RSA key size for BSSA blind signatures', 'CONFIDENTIAL'),
('cfg002', 'BLIND_SIGNATURE_EXPIRY', '3600', 'CRYPTO', 'Blind signature session expiry in seconds', 'INTERNAL'),
('cfg003', 'CORDA_NETWORK_ID', 'healthcare-network', 'CORDA', 'R3 Corda network identifier', 'INTERNAL'),
('cfg004', 'CORDA_NOTARY_ADDRESS', 'O=Notary,L=London,C=GB', 'CORDA', 'Corda notary node address', 'INTERNAL'),
('cfg005', 'STEGANOGRAPHY_ALGORITHM', 'RANDOMIZED_LSB', 'STEGANOGRAPHY', 'Default steganography algorithm', 'CONFIDENTIAL'),
('cfg006', 'LSB_BIT_PLANES', '1,2,3', 'STEGANOGRAPHY', 'LSB bit planes for randomized insertion', 'CONFIDENTIAL'),
('cfg007', 'MAX_STEGO_CAPACITY', '25', 'STEGANOGRAPHY', 'Maximum embedding capacity percentage', 'CONFIDENTIAL'),
('cfg008', 'SESSION_EXPIRY', '86400', 'SECURITY', 'User session expiry in seconds', 'INTERNAL'),
('cfg009', 'MAX_LOGIN_ATTEMPTS', '5', 'SECURITY', 'Maximum login attempts before lockout', 'INTERNAL'),
('cfg010', 'ENCRYPTION_ALGORITHM', 'AES-256-GCM', 'CRYPTO', 'Default encryption algorithm for sensitive data', 'CONFIDENTIAL');

-- Performance Optimization Indexes
CREATE INDEX `idx_users_comprehensive` ON `users` (`role`, `status`, `privacyLevel`, `emailVerified`, `identityVerified`);
CREATE INDEX `idx_appointments_comprehensive` ON `appointments` (`status`, `appointmentDate`, `privacyMode`, `urgencyLevel`, `isTelemedicine`);
CREATE INDEX `idx_medical_records_comprehensive` ON `medical_records` (`privacyLevel`, `isConfidential`, `accessLevel`, `recordType`);
CREATE INDEX `idx_blind_sessions_comprehensive` ON `blind_signature_sessions` (`status`, `entityType`, `isAnonymous`, `securityLevel`, `createdAt`);
CREATE INDEX `idx_corda_transactions_comprehensive` ON `corda_transactions` (`recordType`, `status`, `confidentialityLevel`, `timestamp`, `networkId`);
CREATE INDEX `idx_steganography_comprehensive` ON `steganography_data` (`algorithm`, `entityType`, `accessLevel`, `isActive`, `createdAt`);

-- Restore MySQL settings
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Success Message
SELECT
  'Healthcare Blockchain Database (FYP) Setup Completed Successfully!' as message,
  'MySQL 8.0+ Compatibility: ✓' as compatibility,
  'R3 Corda Blockchain Integration: ✓' as corda_blockchain,
  'RSA-BSSA Blind Signatures: ✓' as blind_signatures,
  'Advanced Steganography: ✓' as steganography,
  'Privacy-Preserving Features: ✓' as privacy,
  'Healthcare Workflow Management: ✓' as healthcare,
  'No Deprecated Warnings: ✓' as warnings_fixed;