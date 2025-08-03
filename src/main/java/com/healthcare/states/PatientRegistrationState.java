// File: src/main/java/com/healthcare/states/PatientRegistrationState.java
package com.healthcare.states;

import com.healthcare.contracts.HealthcareContract;
import com.healthcare.schemas.PatientRegistrationSchemaV1;
import net.corda.core.contracts.BelongsToContract;
import net.corda.core.contracts.ContractState;
import net.corda.core.identity.AbstractParty;
import net.corda.core.identity.Party;
import net.corda.core.schemas.MappedSchema;
import net.corda.core.schemas.PersistentState;
import net.corda.core.schemas.QueryableState;
import net.corda.core.serialization.CordaSerializable;
import org.jetbrains.annotations.NotNull;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

/**
 * Corda State representing a privacy-preserving patient registration on the blockchain
 * Uses blind signatures to maintain patient privacy while ensuring regulatory compliance
 */
@BelongsToContract(HealthcareContract.class)
@CordaSerializable
public class PatientRegistrationState implements ContractState, QueryableState {

    // Privacy-preserving identifiers
    private final String patientId;                    // Anonymous patient identifier
    private final String identityCommitment;          // SHA-256 hash of patient identity
    private final String blindSignatureHash;          // Hash of the blind signature
    private final String sessionId;                   // Blind signature session ID

    // Registration metadata
    private final Instant registrationTimestamp;      // When registration occurred
    private final String registrationStatus;          // ACTIVE, SUSPENDED, REVOKED
    private final String privacyLevel;               // PSEUDONYMOUS, ANONYMOUS, IDENTIFIED

    // Blockchain verification
    private final boolean blockchainVerified;         // True if verified on blockchain
    private final boolean identityVerified;           // True if identity was verified
    private final String verificationMethod;          // BLIND_SIGNATURE, TRADITIONAL, HYBRID

    // Network participants
    private final Party hospitalNode;                 // Hospital that registered the patient
    private final Party patientRegistryNode;          // Patient registry authority
    private final Party regulatoryNode;               // Healthcare regulatory authority (optional)

    // Compliance and audit
    private final String complianceFlags;             // JSON string of compliance markers
    private final String auditTrailHash;              // Hash of the audit trail
    private final boolean gdprCompliant;              // GDPR compliance flag

    /**
     * Constructor for creating a new patient registration state
     */
    public PatientRegistrationState(String patientId,
                                    String identityCommitment,
                                    String blindSignatureHash,
                                    String sessionId,
                                    Instant registrationTimestamp,
                                    String registrationStatus,
                                    String privacyLevel,
                                    boolean blockchainVerified,
                                    boolean identityVerified,
                                    String verificationMethod,
                                    Party hospitalNode,
                                    Party patientRegistryNode,
                                    Party regulatoryNode,
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

    /**
     * Returns the participants in this state (who must sign transactions involving this state)
     */
    @NotNull
    @Override
    public List<AbstractParty> getParticipants() {
        if (regulatoryNode != null) {
            return Arrays.asList(hospitalNode, patientRegistryNode, regulatoryNode);
        } else {
            return Arrays.asList(hospitalNode, patientRegistryNode);
        }
    }

    /**
     * For database mapping - allows the state to be queried
     */
    @NotNull
    @Override
    public PersistentState generateMappedObject(@NotNull MappedSchema schema) {
        if (schema instanceof PatientRegistrationSchemaV1) {
            return new PatientRegistrationSchemaV1.PersistentPatientRegistration(
                    this.patientId,
                    this.identityCommitment,
                    this.blindSignatureHash,
                    this.sessionId,
                    this.registrationTimestamp,
                    this.registrationStatus,
                    this.privacyLevel,
                    this.blockchainVerified,
                    this.identityVerified,
                    this.verificationMethod,
                    this.hospitalNode.getName().toString(),
                    this.patientRegistryNode.getName().toString(),
                    this.regulatoryNode != null ? this.regulatoryNode.getName().toString() : null,
                    this.complianceFlags,
                    this.auditTrailHash,
                    this.gdprCompliant
            );
        } else {
            throw new IllegalArgumentException("Unrecognised schema $schema");
        }
    }

    /**
     * Supported database schemas for this state
     */
    @NotNull
    @Override
    public Iterable<MappedSchema> supportedSchemas() {
        return Arrays.asList(new PatientRegistrationSchemaV1());
    }

    /**
     * Creates a copy of this state with updated verification status
     */
    public PatientRegistrationState withVerifiedIdentity(boolean identityVerified) {
        return new PatientRegistrationState(
                this.patientId,
                this.identityCommitment,
                this.blindSignatureHash,
                this.sessionId,
                this.registrationTimestamp,
                this.registrationStatus,
                this.privacyLevel,
                this.blockchainVerified,
                identityVerified,
                this.verificationMethod,
                this.hospitalNode,
                this.patientRegistryNode,
                this.regulatoryNode,
                this.complianceFlags,
                this.auditTrailHash,
                this.gdprCompliant
        );
    }

    /**
     * Creates a copy of this state with updated registration status
     */
    public PatientRegistrationState withUpdatedStatus(String newStatus) {
        return new PatientRegistrationState(
                this.patientId,
                this.identityCommitment,
                this.blindSignatureHash,
                this.sessionId,
                this.registrationTimestamp,
                newStatus,
                this.privacyLevel,
                this.blockchainVerified,
                this.identityVerified,
                this.verificationMethod,
                this.hospitalNode,
                this.patientRegistryNode,
                this.regulatoryNode,
                this.complianceFlags,
                this.auditTrailHash,
                this.gdprCompliant
        );
    }

    // Getters
    public String getPatientId() { return patientId; }
    public String getIdentityCommitment() { return identityCommitment; }
    public String getBlindSignatureHash() { return blindSignatureHash; }
    public String getSessionId() { return sessionId; }
    public Instant getRegistrationTimestamp() { return registrationTimestamp; }
    public String getRegistrationStatus() { return registrationStatus; }
    public String getPrivacyLevel() { return privacyLevel; }
    public boolean isBlockchainVerified() { return blockchainVerified; }
    public boolean isIdentityVerified() { return identityVerified; }
    public String getVerificationMethod() { return verificationMethod; }
    public Party getHospitalNode() { return hospitalNode; }
    public Party getPatientRegistryNode() { return patientRegistryNode; }
    public Party getRegulatoryNode() { return regulatoryNode; }
    public String getComplianceFlags() { return complianceFlags; }
    public String getAuditTrailHash() { return auditTrailHash; }
    public boolean isGdprCompliant() { return gdprCompliant; }

    // equals, hashCode, toString
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PatientRegistrationState that = (PatientRegistrationState) o;
        return Objects.equals(patientId, that.patientId) &&
                Objects.equals(identityCommitment, that.identityCommitment) &&
                Objects.equals(sessionId, that.sessionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(patientId, identityCommitment, sessionId);
    }

    @Override
    public String toString() {
        return "PatientRegistrationState{" +
                "patientId='" + patientId + '\'' +
                ", identityCommitment='" + identityCommitment.substring(0, 8) + "...'" +
                ", sessionId='" + sessionId + '\'' +
                ", registrationTimestamp=" + registrationTimestamp +
                ", registrationStatus='" + registrationStatus + '\'' +
                ", privacyLevel='" + privacyLevel + '\'' +
                ", blockchainVerified=" + blockchainVerified +
                ", verificationMethod='" + verificationMethod + '\'' +
                ", participants=" + getParticipants().size() +
                '}';
    }
}