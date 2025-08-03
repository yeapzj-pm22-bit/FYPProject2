// File: src/main/java/com/healthcare/contracts/HealthcareContract.java
package com.healthcare.contracts;

import com.healthcare.states.PatientRegistrationState;
import net.corda.core.contracts.*;
import net.corda.core.transactions.LedgerTransaction;
import org.jetbrains.annotations.NotNull;

import java.security.PublicKey;
import java.util.List;

import static net.corda.core.contracts.ContractsDSL.requireSingleCommand;
import static net.corda.core.contracts.ContractsDSL.requireThat;

/**
 * Healthcare Blockchain Smart Contract for Patient Registration with Blind Signatures
 * This contract ensures privacy-preserving patient registration on Corda R3 blockchain
 */
public class HealthcareContract implements Contract {

    public static final String HEALTHCARE_CONTRACT_ID = "com.healthcare.contracts.HealthcareContract";

    @Override
    public void verify(@NotNull LedgerTransaction tx) throws IllegalArgumentException {
        final CommandWithParties<Commands> command = requireSingleCommand(tx.getCommands(), Commands.class);
        final Commands commandData = command.getValue();
        final List<PublicKey> requiredSigners = command.getSigners();

        if (commandData instanceof Commands.RegisterPatient) {
            verifyPatientRegistration(tx, requiredSigners);
        } else if (commandData instanceof Commands.UpdatePatientRecord) {
            verifyPatientUpdate(tx, requiredSigners);
        } else if (commandData instanceof Commands.VerifyIdentity) {
            verifyIdentityVerification(tx, requiredSigners);
        } else {
            throw new IllegalArgumentException("Unrecognised command: " + commandData);
        }
    }

    /**
     * Verifies patient registration transaction with blind signature validation
     */
    private void verifyPatientRegistration(LedgerTransaction tx, List<PublicKey> requiredSigners) {
        requireThat(require -> {
            // Shape constraints
            require.using("No inputs should be consumed when registering a patient.",
                    tx.getInputs().isEmpty());
            require.using("Only one output state should be created when registering a patient.",
                    tx.getOutputs().size() == 1);

            // Content constraints
            final PatientRegistrationState outputState = tx.outputsOfType(PatientRegistrationState.class).get(0);

            require.using("Patient ID cannot be empty.",
                    !outputState.getPatientId().trim().isEmpty());
            require.using("Identity commitment must be exactly 64 characters (SHA-256 hash).",
                    outputState.getIdentityCommitment().length() == 64);
            require.using("Blind signature hash cannot be empty.",
                    !outputState.getBlindSignatureHash().trim().isEmpty());
            require.using("Session ID must follow the correct format.",
                    outputState.getSessionId().startsWith("bssa_"));
            require.using("Registration timestamp cannot be null.",
                    outputState.getRegistrationTimestamp() != null);
            require.using("Privacy level must be PSEUDONYMOUS for blind signature registration.",
                    outputState.getPrivacyLevel().equals("PSEUDONYMOUS"));

            // Signers constraints
            require.using("The hospital and patient registry must sign the registration.",
                    requiredSigners.containsAll(outputState.getParticipants().stream()
                            .map(party -> party.getOwningKey()).collect(java.util.stream.Collectors.toList())));

            // Business logic constraints
            require.using("Registration must be in ACTIVE status.",
                    outputState.getRegistrationStatus().equals("ACTIVE"));
            require.using("Blockchain verification must be enabled.",
                    outputState.isBlockchainVerified());

            return null;
        });
    }

    /**
     * Verifies patient record update transaction
     */
    private void verifyPatientUpdate(LedgerTransaction tx, List<PublicKey> requiredSigners) {
        requireThat(require -> {
            // Shape constraints
            require.using("One input should be consumed when updating a patient record.",
                    tx.getInputs().size() == 1);
            require.using("Only one output state should be created when updating a patient record.",
                    tx.getOutputs().size() == 1);

            // Content constraints
            final PatientRegistrationState inputState = tx.inputsOfType(PatientRegistrationState.class).get(0);
            final PatientRegistrationState outputState = tx.outputsOfType(PatientRegistrationState.class).get(0);

            require.using("Patient ID cannot be changed during update.",
                    inputState.getPatientId().equals(outputState.getPatientId()));
            require.using("Identity commitment cannot be changed during update.",
                    inputState.getIdentityCommitment().equals(outputState.getIdentityCommitment()));

            // Signers constraints
            require.using("All participants must sign the update.",
                    requiredSigners.containsAll(outputState.getParticipants().stream()
                            .map(party -> party.getOwningKey()).collect(java.util.stream.Collectors.toList())));

            return null;
        });
    }

    /**
     * Verifies identity verification transaction
     */
    private void verifyIdentityVerification(LedgerTransaction tx, List<PublicKey> requiredSigners) {
        requireThat(require -> {
            require.using("Identity verification requires exactly one input.",
                    tx.getInputs().size() == 1);
            require.using("Identity verification produces exactly one output.",
                    tx.getOutputs().size() == 1);

            final PatientRegistrationState outputState = tx.outputsOfType(PatientRegistrationState.class).get(0);
            require.using("Identity must be verified.",
                    outputState.isIdentityVerified());

            return null;
        });
    }

    /**
     * Commands supported by this contract
     */
    public interface Commands extends CommandData {

        /**
         * Register a new patient with blind signature privacy protection
         */
        class RegisterPatient implements Commands {}

        /**
         * Update existing patient record (maintaining privacy)
         */
        class UpdatePatientRecord implements Commands {}

        /**
         * Verify patient identity (regulatory compliance)
         */
        class VerifyIdentity implements Commands {}
    }
}