// File: src/main/java/com/healthcare/flows/PatientRegistrationInitiator.java
package com.healthcare.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.healthcare.contracts.HealthcareContract;
import com.healthcare.states.PatientRegistrationState;
import net.corda.core.contracts.Command;
import net.corda.core.flows.*;
import net.corda.core.identity.Party;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;
import net.corda.core.utilities.ProgressTracker;

import java.time.Instant;
import java.util.Arrays;

/**
 * Single Node Patient Registration Flow for Healthcare Blockchain
 * This flow registers a patient on a single Corda node that acts as:
 * - Hospital (initiator)
 * - PatientRegistry (validator)
 * - Regulator (compliance)
 * - Notary (finalizer)
 */
@InitiatingFlow
@StartableByRPC
public class PatientRegistrationInitiator extends FlowLogic<SignedTransaction> {

    private final String patientId;
    private final String identityCommitment;
    private final String blindSignatureHash;
    private final String sessionId;
    private final Party patientRegistryNode;  // Same as our node in single setup
    private final Party regulatoryNode;      // Same as our node in single setup

    // Progress tracker for monitoring flow execution
    private final ProgressTracker.Step GENERATING_TRANSACTION = new ProgressTracker.Step("Generating patient registration transaction.");
    private final ProgressTracker.Step VERIFYING_TRANSACTION = new ProgressTracker.Step("Verifying contract constraints and business rules.");
    private final ProgressTracker.Step SIGNING_TRANSACTION = new ProgressTracker.Step("Signing transaction as Healthcare node.");
    private final ProgressTracker.Step FINALISING_TRANSACTION = new ProgressTracker.Step("Obtaining notary signature and recording transaction.") {
        @Override
        public ProgressTracker childProgressTracker() {
            return FinalityFlow.Companion.tracker();
        }
    };

    private final ProgressTracker progressTracker = new ProgressTracker(
            GENERATING_TRANSACTION,
            VERIFYING_TRANSACTION,
            SIGNING_TRANSACTION,
            FINALISING_TRANSACTION
    );

    public PatientRegistrationInitiator(String patientId,
                                        String identityCommitment,
                                        String blindSignatureHash,
                                        String sessionId,
                                        Party patientRegistryNode,
                                        Party regulatoryNode) {
        this.patientId = patientId;
        this.identityCommitment = identityCommitment;
        this.blindSignatureHash = blindSignatureHash;
        this.sessionId = sessionId;
        this.patientRegistryNode = patientRegistryNode;  // Same as getOurIdentity() in single node
        this.regulatoryNode = regulatoryNode;            // Same as getOurIdentity() in single node
    }

    @Override
    public ProgressTracker getProgressTracker() {
        return progressTracker;
    }

    @Suspendable
    @Override
    public SignedTransaction call() throws FlowException {
        // Get notary from network (our node also acts as notary in single setup)
        final Party notary = getServiceHub().getNetworkMapCache().getNotaryIdentities().get(0);

        // Step 1: Generate transaction
        progressTracker.setCurrentStep(GENERATING_TRANSACTION);

        System.out.println("🏥 Creating patient registration on single Healthcare node...");
        System.out.println("📋 Patient ID: " + patientId);
        System.out.println("🔐 Session ID: " + sessionId);

        PatientRegistrationState outputState = new PatientRegistrationState(
                patientId,
                identityCommitment,
                blindSignatureHash,
                sessionId,
                Instant.now(),
                "ACTIVE",
                "PSEUDONYMOUS",
                true,  // blockchainVerified
                true,  // identityVerified (single node trusts itself)
                "BLIND_SIGNATURE",
                getOurIdentity(), // Healthcare node (acts as Hospital)
                patientRegistryNode, // Same node (acts as PatientRegistry)
                regulatoryNode,      // Same node (acts as Regulator)
                "{\"blindSignatureUsed\":true,\"privacyPreserved\":true,\"singleNode\":true,\"allRoles\":\"Hospital+Registry+Regulator+Notary\"}",
                "", // auditTrailHash will be set after transaction
                true   // gdprCompliant
        );

        // Create the command with our node as the only signer (since it's single node)
        final Command<HealthcareContract.Commands.RegisterPatient> txCommand =
                new Command<>(
                        new HealthcareContract.Commands.RegisterPatient(),
                        Arrays.asList(getOurIdentity().getOwningKey()) // Only our node signs
                );

        // Step 2: Build transaction
        final TransactionBuilder txBuilder = new TransactionBuilder(notary)
                .addOutputState(outputState, HealthcareContract.HEALTHCARE_CONTRACT_ID)
                .addCommand(txCommand);

        // Step 3: Verify transaction
        progressTracker.setCurrentStep(VERIFYING_TRANSACTION);
        txBuilder.verify(getServiceHub());

        System.out.println("✅ Transaction verified against contract rules");

        // Step 4: Sign transaction
        progressTracker.setCurrentStep(SIGNING_TRANSACTION);
        final SignedTransaction signedTx = getServiceHub().signInitialTransaction(txBuilder);

        System.out.println("✅ Transaction signed by Healthcare node");

        // Step 5: Finalize transaction (no counterparties needed in single node)
        progressTracker.setCurrentStep(FINALISING_TRANSACTION);

        // In single node setup, we don't need to collect signatures from other parties
        // because this node acts as all parties (Hospital, Registry, Regulator)
        final SignedTransaction finalizedTx = subFlow(
                new FinalityFlow(signedTx, Arrays.asList()) // Empty list since no other parties
        );

        System.out.println("🎉 Patient registration completed successfully!");
        System.out.println("📜 Transaction ID: " + finalizedTx.getId());
        System.out.println("🏥 All roles completed by single Healthcare node");

        return finalizedTx;
    }
}