// File: src/main/java/com/healthcare/service/CordaBlockchainService.java
package com.healthcare.service;

import com.healthcare.flows.PatientRegistrationInitiator;
import com.healthcare.schemas.PatientRegistrationSchemaV1;
import com.healthcare.states.PatientRegistrationState;
import net.corda.client.rpc.CordaRPCClient;
import net.corda.client.rpc.CordaRPCConnection;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.crypto.SecureHash;
import net.corda.core.identity.CordaX500Name;
import net.corda.core.identity.Party;
import net.corda.core.messaging.CordaRPCOps;
import net.corda.core.node.services.Vault;
import net.corda.core.node.services.vault.*;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.utilities.NetworkHostAndPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

/**
 * Real Corda R3 Blockchain Service
 * Replaces simulation with actual Corda network interactions
 */
@Service
public class CordaBlockchainService {

    private static final Logger logger = LoggerFactory.getLogger(CordaBlockchainService.class);

    @Value("${corda.rpc.host:localhost}")
    private String rpcHost;

    @Value("${corda.rpc.port:10006}")
    private int rpcPort;

    @Value("${corda.rpc.username:healthcare}")
    private String rpcUsername;

    @Value("${corda.rpc.password:healthcare123}")
    private String rpcPassword;

    @Value("${corda.patient-registry.name:O=HealthcareNode,L=NewYork,C=US}")
    private String patientRegistryName;

    @Value("${corda.regulator.name:O=HealthcareNode,L=NewYork,C=US}")
    private String regulatorName;

    @Value("${corda.enabled:true}")
    private boolean cordaEnabled;

    private CordaRPCConnection rpcConnection;
    private CordaRPCOps cordaProxy;
    private Party patientRegistryParty;
    private Party regulatoryParty;

    @PostConstruct
    public void initializeCordaConnection() {
        if (!cordaEnabled) {
            logger.info("🚫 Corda is disabled, skipping connection initialization");
            return;
        }

        try {
            logger.info("🔗 Initializing Corda RPC connection to {}:{}", rpcHost, rpcPort);

            // Create RPC connection
            NetworkHostAndPort rpcAddress = NetworkHostAndPort.parse(rpcHost + ":" + rpcPort);
            CordaRPCClient rpcClient = new CordaRPCClient(rpcAddress);

            rpcConnection = rpcClient.start(rpcUsername, rpcPassword);
            cordaProxy = rpcConnection.getProxy();

            logger.info("✅ Connected to Corda node: {}", cordaProxy.nodeInfo().getLegalIdentities().get(0).getName());

            // Get network parties
            initializeNetworkParties();

            logger.info("✅ Corda blockchain service initialized successfully");

        } catch (Exception e) {
            logger.error("❌ Failed to initialize Corda connection", e);
            cordaEnabled = false;
            throw new RuntimeException("Failed to connect to Corda network", e);
        }
    }

    /**
     * Initialize network parties (Patient Registry and Regulator)
     */
    private void initializeNetworkParties() {
        try {
            // In single node setup, use our own node for all parties
            Party ourNode = cordaProxy.nodeInfo().getLegalIdentities().get(0);

            // Set our node as both registry and regulator
            patientRegistryParty = ourNode;
            regulatoryParty = ourNode;

            logger.info("✅ Single node setup - using {} for all roles", ourNode.getName());

        } catch (Exception e) {
            logger.error("❌ Failed to initialize network parties", e);
            throw new RuntimeException("Failed to find required network parties", e);
        }
    }

    /**
     * Creates a real blockchain registration record using Corda flows
     */
    public Map<String, Object> createRegistrationRecord(Map<String, Object> registrationData) {
        if (!cordaEnabled || cordaProxy == null) {
            throw new RuntimeException("Corda service is not available");
        }

        try {
            logger.info("🔗 Creating real Corda blockchain registration for session: {}",
                    registrationData.get("sessionId"));

            // Extract data from registration request
            String sessionId = (String) registrationData.get("sessionId");
            String email = (String) registrationData.get("email");
            String signatureHash = (String) registrationData.get("signatureHash");
            String identityCommitment = (String) registrationData.get("identityCommitment");

            // Generate patient ID (anonymous identifier)
            String patientId = generateAnonymousPatientId(sessionId);

            // Start the patient registration flow (using the correct class name)
            Future<SignedTransaction> future = cordaProxy.startFlowDynamic(
                    PatientRegistrationInitiator.class,
                    patientId,
                    identityCommitment,
                    signatureHash,
                    sessionId,
                    patientRegistryParty,
                    regulatoryParty
            ).getReturnValue();

            // Wait for transaction completion (with timeout)
            SignedTransaction signedTx = future.get(60, TimeUnit.SECONDS);

            logger.info("✅ Corda transaction completed successfully: {}", signedTx.getId());

            // Build response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("blockId", signedTx.getId().toString());
            response.put("cordaTransactionId", signedTx.getId().toString());
            response.put("networkHash", signedTx.getTx().getMerkleTree().getHash().toString());
            response.put("identityCommitment", identityCommitment);
            response.put("blockchainAddress", generateBlockchainAddress(signedTx.getId()));
            response.put("privacyLevel", "PSEUDONYMOUS");
            response.put("complianceProof", "corda_consensus_achieved");
            response.put("immutable", true);
            response.put("chainVerified", true);
            response.put("fallbackMode", false);
            response.put("timestamp", java.time.Instant.now().toString());
            response.put("participants", getParticipantCount());
            response.put("notarized", true);
            response.put("networkStatus", "finalized");

            return response;

        } catch (Exception e) {
            logger.error("❌ Failed to create Corda registration record", e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Corda registration failed: " + e.getMessage());
            errorResponse.put("fallbackMode", false);
            errorResponse.put("cordaError", true);

            return errorResponse;
        }
    }

    /**
     * Verifies a blockchain registration using Corda vault queries
     */
    public Map<String, Object> verifyRegistration(String blockId) {
        if (!cordaEnabled || cordaProxy == null) {
            throw new RuntimeException("Corda service is not available");
        }

        try {
            logger.info("🔍 Verifying Corda registration: {}", blockId);

            Map<String, Object> result = new HashMap<>();

            // Method 1: Try to find by transaction ID
            try {
                SecureHash txHash = SecureHash.parse(blockId);
                SignedTransaction transaction = cordaProxy.internalFindVerifiedTransaction(txHash);

                if (transaction != null) {
                    PatientRegistrationState state = transaction.getTx()
                            .outputsOfType(PatientRegistrationState.class).get(0);

                    result.put("verified", true);
                    result.put("found", true);
                    result.put("exists", true);
                    result.put("blockId", blockId);
                    result.put("message", "Record found and verified on Corda blockchain");
                    result.put("networkStatus", "finalized");
                    result.put("consensusReached", true);
                    result.put("notarized", true);

                    // Add record details
                    Map<String, Object> details = new HashMap<>();
                    details.put("patientId", state.getPatientId());
                    details.put("sessionId", state.getSessionId());
                    details.put("registrationDate", state.getRegistrationTimestamp().toString());
                    details.put("privacyLevel", state.getPrivacyLevel());
                    details.put("verificationMethod", state.getVerificationMethod());
                    details.put("participantCount", state.getParticipants().size());
                    details.put("blockchainVerified", state.isBlockchainVerified());
                    details.put("identityVerified", state.isIdentityVerified());
                    details.put("gdprCompliant", state.isGdprCompliant());

                    result.put("recordDetails", details);
                    result.put("cordaVerified", true);

                    return result;
                }
            } catch (Exception e) {
                logger.debug("Transaction not found by hash, trying vault query: {}", e.getMessage());
            }

            // Method 2: Search vault directly
            Vault.Page<PatientRegistrationState> results = cordaProxy.vaultQuery(PatientRegistrationState.class);

            for (StateAndRef<PatientRegistrationState> stateAndRef : results.getStates()) {
                PatientRegistrationState state = stateAndRef.getState().getData();

                // Check if this matches our blockId (could be sessionId or patientId)
                if (state.getSessionId().equals(blockId) ||
                        state.getPatientId().equals(blockId) ||
                        stateAndRef.getRef().getTxhash().toString().equals(blockId)) {

                    result.put("verified", true);
                    result.put("found", true);
                    result.put("exists", true);
                    result.put("blockId", blockId);
                    result.put("cordaStateRef", stateAndRef.getRef().toString());
                    result.put("message", "Record found in Corda vault");

                    // Add detailed information
                    Map<String, Object> details = new HashMap<>();
                    details.put("patientId", state.getPatientId());
                    details.put("sessionId", state.getSessionId());
                    details.put("registrationDate", state.getRegistrationTimestamp().toString());
                    details.put("registrationStatus", state.getRegistrationStatus());
                    details.put("privacyLevel", state.getPrivacyLevel());
                    details.put("participantCount", state.getParticipants().size());

                    result.put("recordDetails", details);
                    result.put("cordaVerified", true);

                    return result;
                }
            }

            // Not found
            result.put("verified", false);
            result.put("found", false);
            result.put("exists", false);
            result.put("blockId", blockId);
            result.put("message", "No record found in Corda blockchain");
            result.put("searchedMethods", java.util.Arrays.asList("transactionHash", "vaultQuery"));

            return result;

        } catch (Exception e) {
            logger.error("❌ Failed to verify Corda registration", e);

            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("verified", false);
            errorResult.put("found", false);
            errorResult.put("error", "Corda verification failed: " + e.getMessage());
            errorResult.put("blockId", blockId);

            return errorResult;
        }
    }

    /**
     * Gets Corda blockchain statistics
     */
    public Map<String, Object> getBlockchainStats() {
        if (!cordaEnabled || cordaProxy == null) {
            Map<String, Object> stats = new HashMap<>();
            stats.put("enabled", false);
            stats.put("provider", "CORDA_DISCONNECTED");
            return stats;
        }

        try {
            // Query vault for statistics
            Vault.Page<PatientRegistrationState> allRegistrations = cordaProxy.vaultQuery(PatientRegistrationState.class);

            // Get network information
            List<net.corda.core.node.NodeInfo> networkNodes = cordaProxy.networkMapSnapshot();

            Map<String, Object> stats = new HashMap<>();
            stats.put("enabled", true);
            stats.put("provider", "CORDA_R3");
            stats.put("totalRegistrations", allRegistrations.getStates().size());
            stats.put("networkNodes", networkNodes.size());
            stats.put("ourNodeName", cordaProxy.nodeInfo().getLegalIdentities().get(0).getName().toString());
            stats.put("notaryNodes", cordaProxy.notaryIdentities().size());
            stats.put("cordaVersion", cordaProxy.nodeInfo().getPlatformVersion());
            stats.put("vaultSize", allRegistrations.getTotalStatesAvailable());
            stats.put("lastActivity", java.time.Instant.now().toString());

            // Count by status
            long activeRegistrations = allRegistrations.getStates().stream()
                    .mapToLong(state -> state.getState().getData().getRegistrationStatus().equals("ACTIVE") ? 1 : 0)
                    .sum();

            stats.put("activeRegistrations", activeRegistrations);
            stats.put("networkStatus", "operational");
            stats.put("consensusAlgorithm", "notary-based");

            return stats;

        } catch (Exception e) {
            logger.error("❌ Failed to get Corda stats", e);

            Map<String, Object> errorStats = new HashMap<>();
            errorStats.put("enabled", false);
            errorStats.put("error", "Failed to get stats: " + e.getMessage());
            return errorStats;
        }
    }

    /**
     * Checks if Corda service is available and connected
     */
    public boolean isAvailable() {
        return cordaEnabled && cordaProxy != null;
    }

    /**
     * Gets current Corda network information
     */
    public Map<String, Object> getNetworkInfo() {
        if (!isAvailable()) {
            Map<String, Object> info = new HashMap<>();
            info.put("connected", false);
            info.put("error", "Corda service not available");
            return info;
        }

        try {
            Map<String, Object> info = new HashMap<>();
            info.put("connected", true);
            info.put("ourNode", cordaProxy.nodeInfo().getLegalIdentities().get(0).getName().toString());
            info.put("networkNodes", cordaProxy.networkMapSnapshot().size());
            info.put("notaries", cordaProxy.notaryIdentities().size());
            info.put("platformVersion", cordaProxy.nodeInfo().getPlatformVersion());
            info.put("rpcHost", rpcHost);
            info.put("rpcPort", rpcPort);

            return info;
        } catch (Exception e) {
            Map<String, Object> info = new HashMap<>();
            info.put("connected", false);
            info.put("error", e.getMessage());
            return info;
        }
    }

    // Helper methods
    private String generateAnonymousPatientId(String sessionId) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest((sessionId + "_patient").getBytes());
            return bytesToHex(hash).substring(0, 32); // 32 character anonymous ID
        } catch (Exception e) {
            return "patient_" + sessionId.substring(5, 25); // Fallback
        }
    }

    private String generateBlockchainAddress(SecureHash txId) {
        return "0x" + txId.toString().substring(0, 40);
    }

    private int getParticipantCount() {
        int count = 1; // Hospital (us)
        if (patientRegistryParty != null) count++;
        if (regulatoryParty != null) count++;
        return count;
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }

    @PreDestroy
    public void closeCordaConnection() {
        if (rpcConnection != null) {
            try {
                rpcConnection.notifyServerAndClose();
                logger.info("✅ Corda RPC connection closed successfully");
            } catch (Exception e) {
                logger.error("❌ Error closing Corda connection", e);
            }
        }
    }
}