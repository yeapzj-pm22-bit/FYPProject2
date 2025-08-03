// File: src/main/java/com/healthcare/service/UnifiedBlockchainService.java
package com.healthcare.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UnifiedBlockchainService {

    private static final Logger logger = LoggerFactory.getLogger(UnifiedBlockchainService.class);

    @Autowired
    private CordaClientService cordaClientService;

    // Simulation variables for fallback mode
    private boolean cordaAvailable = true;
    private List<Map<String, Object>> simulatedTransactions = new ArrayList<>();

    public Map<String, Object> createRegistrationRecord(Map<String, Object> registrationData) {
        try {
            String email = (String) registrationData.get("email");
            String sessionId = (String) registrationData.get("sessionId");
            String signatureHash = (String) registrationData.get("signatureHash");
            String identityCommitment = (String) registrationData.get("identityCommitment");

            // Generate patient ID from email hash
            String patientId = generatePatientId(email);

            if (cordaClientService.isConnected()) {
                // Register on real Corda blockchain
                Map<String, Object> cordaResult = cordaClientService.registerPatient(
                        patientId,
                        identityCommitment,
                        signatureHash,
                        sessionId
                );
                return cordaResult;
            } else {
                // Fallback to simulation mode
                return createSimulatedRegistration(patientId, identityCommitment, signatureHash, sessionId);
            }

        } catch (Exception e) {
            logger.error("Registration failed: " + e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Registration failed: " + e.getMessage());
            return error;
        }
    }

    private Map<String, Object> createSimulatedRegistration(String patientId, String identityCommitment, String signatureHash, String sessionId) {
        Map<String, Object> simulation = new HashMap<>();
        simulation.put("patientId", patientId);
        simulation.put("identityCommitment", identityCommitment);
        simulation.put("signatureHash", signatureHash);
        simulation.put("sessionId", sessionId);
        simulation.put("timestamp", Instant.now().toString());
        simulation.put("blockId", "sim_" + System.currentTimeMillis());

        simulatedTransactions.add(simulation);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("transactionId", simulation.get("blockId"));
        result.put("blockId", simulation.get("blockId"));
        result.put("identityCommitment", identityCommitment);
        result.put("cordaAvailable", false);
        result.put("simulationMode", true);
        result.put("immutable", false);
        result.put("chainVerified", false);
        result.put("timestamp", simulation.get("timestamp"));

        return result;
    }

    private String generatePatientId(String email) {
        try {
            return java.security.MessageDigest.getInstance("SHA-256")
                    .digest(email.getBytes())
                    .toString().substring(0, 16);
        } catch (Exception e) {
            return "patient_" + System.currentTimeMillis();
        }
    }

    public boolean isBlockchainAvailable() {
        return cordaClientService.isConnected();
    }

    public String getActiveProvider() {
        return cordaClientService.isConnected() ? "CORDA_REAL" : "SIMULATION";
    }

    public Map<String, Object> getProviderInfo() {
        Map<String, Object> info = new HashMap<>();
        if (cordaClientService.isConnected()) {
            info.put("provider", "Corda R3 Blockchain");
            info.put("connected", true);
            info.put("network", "Healthcare Consortium");
            info.put("consensus", "Corda Consensus");
        } else {
            info.put("provider", "Simulation Mode");
            info.put("connected", false);
            info.put("network", "Local Simulation");
            info.put("consensus", "None");
        }
        return info;
    }

    /**
     * Get blockchain statistics and status
     */
    public Map<String, Object> getBlockchainStats() {
        Map<String, Object> stats = new HashMap<>();

        try {
            if (cordaClientService.isConnected()) {
                // Real Corda blockchain stats
                stats = cordaClientService.getNetworkStats();
                stats.put("mode", "REAL_CORDA");
                stats.put("type", "Real Corda R3 Blockchain");
            } else {
                // Simulation mode stats
                stats.put("success", true);
                stats.put("mode", "SIMULATION");
                stats.put("type", "Simulated Blockchain");
                stats.put("totalTransactions", simulatedTransactions.size());
                stats.put("status", "Available");
            }

            stats.put("timestamp", Instant.now().toString());

        } catch (Exception e) {
            stats.put("success", false);
            stats.put("error", e.getMessage());
            stats.put("mode", "ERROR");
        }

        return stats;
    }

    /**
     * Switch to simulation mode (disable Corda)
     */
    public void switchToSimulationMode() {
        logger.info("🔄 Switching to simulation mode...");
        this.cordaAvailable = false;
        logger.info("✅ Now using simulation mode for blockchain operations");
    }

    /**
     * Attempt to reconnect to Corda
     */
    public boolean reconnectToCorda() {
        try {
            logger.info("🔄 Attempting to reconnect to Corda...");

            // Check if Corda client service can connect
            if (cordaClientService.isConnected()) {
                this.cordaAvailable = true;
                logger.info("✅ Successfully reconnected to Corda");
                return true;
            } else {
                logger.warn("❌ Failed to reconnect to Corda - staying in simulation mode");
                this.cordaAvailable = false;
                return false;
            }

        } catch (Exception e) {
            logger.error("❌ Error reconnecting to Corda: " + e.getMessage());
            this.cordaAvailable = false;
            return false;
        }
    }
}