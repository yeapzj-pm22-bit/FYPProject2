// File: src/main/java/com/healthcare/schemas/PatientRegistrationSchemaV1.java
package com.healthcare.schemas;

import net.corda.core.schemas.MappedSchema;
import net.corda.core.schemas.PersistentState;
import net.corda.core.serialization.CordaSerializable;

import javax.persistence.*;
import java.time.Instant;
import java.util.Arrays;

/**
 * Database schema for Patient Registration State in Corda vault
 * Allows querying and persistence of patient registration data on the blockchain
 */
public class PatientRegistrationSchemaV1 extends MappedSchema {

    public PatientRegistrationSchemaV1() {
        super(PatientRegistrationSchemaV1.class, 1, Arrays.asList(PersistentPatientRegistration.class));
    }

    /**
     * JPA Entity for persisting PatientRegistrationState in the Corda vault database
     */
    @Entity
    @Table(name = "patient_registrations", indexes = {
            @Index(name = "idx_patient_id", columnList = "patient_id"),
            @Index(name = "idx_identity_commitment", columnList = "identity_commitment"),
            @Index(name = "idx_session_id", columnList = "session_id"),
            @Index(name = "idx_registration_timestamp", columnList = "registration_timestamp"),
            @Index(name = "idx_registration_status", columnList = "registration_status")
    })
    @CordaSerializable
    public static class PersistentPatientRegistration extends PersistentState {

        // Privacy-preserving identifiers
        @Column(name = "patient_id", nullable = false, length = 64)
        private String patientId;

        @Column(name = "identity_commitment", nullable = false, length = 64)
        private String identityCommitment;

        @Column(name = "blind_signature_hash", nullable = false, length = 128)
        private String blindSignatureHash;

        @Column(name = "session_id", nullable = false, length = 64)
        private String sessionId;

        // Registration metadata
        @Column(name = "registration_timestamp", nullable = false)
        private Instant registrationTimestamp;

        @Column(name = "registration_status", nullable = false, length = 20)
        private String registrationStatus;

        @Column(name = "privacy_level", nullable = false, length = 20)
        private String privacyLevel;

        // Blockchain verification
        @Column(name = "blockchain_verified", nullable = false)
        private boolean blockchainVerified;

        @Column(name = "identity_verified", nullable = false)
        private boolean identityVerified;

        @Column(name = "verification_method", length = 30)
        private String verificationMethod;

        // Network participants
        @Column(name = "hospital_node", nullable = false, length = 255)
        private String hospitalNode;

        @Column(name = "patient_registry_node", nullable = false, length = 255)
        private String patientRegistryNode;

        @Column(name = "regulatory_node", length = 255)
        private String regulatoryNode;

        // Compliance and audit
        @Column(name = "compliance_flags", columnDefinition = "TEXT")
        private String complianceFlags;

        @Column(name = "audit_trail_hash", length = 64)
        private String auditTrailHash;

        @Column(name = "gdpr_compliant", nullable = false)
        private boolean gdprCompliant;

        // Default constructor for JPA
        public PersistentPatientRegistration() {}

        /**
         * Constructor for creating persistent state from Corda state
         */
        public PersistentPatientRegistration(String patientId,
                                             String identityCommitment,
                                             String blindSignatureHash,
                                             String sessionId,
                                             Instant registrationTimestamp,
                                             String registrationStatus,
                                             String privacyLevel,
                                             boolean blockchainVerified,
                                             boolean identityVerified,
                                             String verificationMethod,
                                             String hospitalNode,
                                             String patientRegistryNode,
                                             String regulatoryNode,
                                             String complianceFlags,
                                             String auditTrailHash,
                                             boolean gdprCompliant) {
            this.patientId = patientId;
            this.identityCommitment = identityCommitment;
            this.blindSignatureHash = blindSignatureHash;
            this.sessionId = sessionId;
            this.registrationTimestamp = registrationTimestamp;
            this.registrationStatus = registrationStatus;
            this.privacyLevel = privacyLevel;
            this.blockchainVerified = blockchainVerified;
            this.identityVerified = identityVerified;
            this.verificationMethod = verificationMethod;
            this.hospitalNode = hospitalNode;
            this.patientRegistryNode = patientRegistryNode;
            this.regulatoryNode = regulatoryNode;
            this.complianceFlags = complianceFlags;
            this.auditTrailHash = auditTrailHash;
            this.gdprCompliant = gdprCompliant;
        }

        // Getters and Setters
        public String getPatientId() { return patientId; }
        public void setPatientId(String patientId) { this.patientId = patientId; }

        public String getIdentityCommitment() { return identityCommitment; }
        public void setIdentityCommitment(String identityCommitment) { this.identityCommitment = identityCommitment; }

        public String getBlindSignatureHash() { return blindSignatureHash; }
        public void setBlindSignatureHash(String blindSignatureHash) { this.blindSignatureHash = blindSignatureHash; }

        public String getSessionId() { return sessionId; }
        public void setSessionId(String sessionId) { this.sessionId = sessionId; }

        public Instant getRegistrationTimestamp() { return registrationTimestamp; }
        public void setRegistrationTimestamp(Instant registrationTimestamp) { this.registrationTimestamp = registrationTimestamp; }

        public String getRegistrationStatus() { return registrationStatus; }
        public void setRegistrationStatus(String registrationStatus) { this.registrationStatus = registrationStatus; }

        public String getPrivacyLevel() { return privacyLevel; }
        public void setPrivacyLevel(String privacyLevel) { this.privacyLevel = privacyLevel; }

        public boolean isBlockchainVerified() { return blockchainVerified; }
        public void setBlockchainVerified(boolean blockchainVerified) { this.blockchainVerified = blockchainVerified; }

        public boolean isIdentityVerified() { return identityVerified; }
        public void setIdentityVerified(boolean identityVerified) { this.identityVerified = identityVerified; }

        public String getVerificationMethod() { return verificationMethod; }
        public void setVerificationMethod(String verificationMethod) { this.verificationMethod = verificationMethod; }

        public String getHospitalNode() { return hospitalNode; }
        public void setHospitalNode(String hospitalNode) { this.hospitalNode = hospitalNode; }

        public String getPatientRegistryNode() { return patientRegistryNode; }
        public void setPatientRegistryNode(String patientRegistryNode) { this.patientRegistryNode = patientRegistryNode; }

        public String getRegulatoryNode() { return regulatoryNode; }
        public void setRegulatoryNode(String regulatoryNode) { this.regulatoryNode = regulatoryNode; }

        public String getComplianceFlags() { return complianceFlags; }
        public void setComplianceFlags(String complianceFlags) { this.complianceFlags = complianceFlags; }

        public String getAuditTrailHash() { return auditTrailHash; }
        public void setAuditTrailHash(String auditTrailHash) { this.auditTrailHash = auditTrailHash; }

        public boolean isGdprCompliant() { return gdprCompliant; }
        public void setGdprCompliant(boolean gdprCompliant) { this.gdprCompliant = gdprCompliant; }
    }
}