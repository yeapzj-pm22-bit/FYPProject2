// src/main/java/com/healthcare/service/UnifiedBlockchainService.java
package com.healthcare.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

/**
 * Unified Blockchain Service that automatically detects available blockchain implementations
 * and provides a seamless interface for blind signature + blockchain operations.
 */
@Service
public class UnifiedBlockchainService {

    private static final Logger logger = LoggerFactory.getLogger(UnifiedBlockchainService.class);

    @Value("${blockchain.enabled:true}")
    private boolean blockchainEnabled;

    @Value("${blockchain.mode:simulation}")
    private String blockchainMode;

    @Value("${corda.enabled:false}")
    private boolean cordaEnabled;

    @Autowired
    private SimpleBlockchainService simpleBlockchainService;

    // Removed problematic cordaBlockchainService autowiring
    // Will add proper Corda service when Corda classes are available

    private BlockchainProvider activeProvider;

    public enum BlockchainProvider {
        CORDA, SIMULATION, DISABLED
    }

    @PostConstruct
    public void initialize() {
        if (!blockchainEnabled) {
            activeProvider = BlockchainProvider.DISABLED;
            logger.info("🚫 Blockchain functionality is DISABLED");
            return;
        }

        // For now, always use simulation since Corda classes aren't available yet
        if (cordaEnabled) {
            logger.warn("⚠️ Corda was enabled but Corda service is not available, using simulation");
        }

        activeProvider = BlockchainProvider.SIMULATION;
        logger.info("🔧 Using SIMULATION blockchain provider");

        logger.info("✅ Blockchain service initialized with provider: {}", activeProvider);
    }

    /**
     * Creates a blockchain registration record for blind signature registration
     * This is called from your Node.js backend via /api/blockchain/register
     */
    public Map<String, Object> createRegistrationRecord(Map<String, Object> registrationData) {
        if (!blockchainEnabled) {
            return createDisabledResponse("Blockchain functionality is disabled");
        }

        try {
            logger.info("🔗 Creating blockchain registration record for blind signature process");
            logger.debug("📦 Registration data: email={}, sessionId={}",
                    maskEmail((String) registrationData.get("email")),
                    registrationData.get("sessionId"));

            Map<String, Object> result;

            switch (activeProvider) {
                case CORDA:
                    logger.debug("🔗 Creating Corda registration record");
                    result = createCordaRegistration(registrationData);
                    break;

                case SIMULATION:
                    logger.debug("🔧 Creating simulation registration record");
                    result = simpleBlockchainService.createRegistrationRecord(registrationData);
                    break;

                default:
                    result = createDisabledResponse("No blockchain provider available");
            }

            // Add provider metadata
            result.put("blockchainProvider", activeProvider.toString());
            result.put("serviceMode", blockchainMode);
            result.put("blindSignatureCompatible", true);

            if (result.get("success").equals(true)) {
                logger.info("✅ Blockchain registration successful with provider: {}, blockId: {}",
                        activeProvider, result.get("blockId"));
            }

            return result;

        } catch (Exception e) {
            logger.error("❌ Failed to create registration record with provider: {}", activeProvider, e);

            // Try fallback to simulation if Corda fails
            if (activeProvider == BlockchainProvider.CORDA) {
                logger.info("🔄 Falling back to simulation provider");
                try {
                    Map<String, Object> fallbackResult = simpleBlockchainService.createRegistrationRecord(registrationData);
                    fallbackResult.put("blockchainProvider", "SIMULATION_FALLBACK");
                    fallbackResult.put("originalProvider", "CORDA");
                    fallbackResult.put("fallbackReason", e.getMessage());
                    return fallbackResult;
                } catch (Exception fallbackE) {
                    logger.error("❌ Fallback also failed", fallbackE);
                }
            }

            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Blockchain registration failed: " + e.getMessage());
            error.put("blockchainProvider", activeProvider.toString());
            return error;
        }
    }

    /**
     * Verifies a blockchain registration using the active provider
     */
    public Map<String, Object> verifyRegistration(String blockId) {
        if (!blockchainEnabled) {
            return createDisabledResponse("Blockchain functionality is disabled");
        }

        try {
            logger.info("🔍 Verifying registration: {}", blockId);

            Map<String, Object> result;

            switch (activeProvider) {
                case CORDA:
                    result = verifyCordaRegistration(blockId);
                    break;

                case SIMULATION:
                    result = simpleBlockchainService.verifyRegistration(blockId);
                    break;

                default:
                    Map<String, Object> disabled = new HashMap<>();
                    disabled.put("verified", false);
                    disabled.put("message", "No blockchain provider available");
                    return disabled;
            }

            result.put("blockchainProvider", activeProvider.toString());
            return result;

        } catch (Exception e) {
            logger.error("❌ Failed to verify registration with provider: {}", activeProvider, e);

            Map<String, Object> error = new HashMap<>();
            error.put("verified", false);
            error.put("message", "Verification failed: " + e.getMessage());
            error.put("blockchainProvider", activeProvider.toString());
            return error;
        }
    }

    /**
     * Gets blockchain statistics from the active provider
     */
    public Map<String, Object> getBlockchainStats() {
        if (!blockchainEnabled) {
            Map<String, Object> stats = new HashMap<>();
            stats.put("enabled", false);
            stats.put("provider", "DISABLED");
            return stats;
        }

        try {
            Map<String, Object> stats;

            switch (activeProvider) {
                case CORDA:
                    stats = getCordaStats();
                    break;

                case SIMULATION:
                    stats = simpleBlockchainService.getBlockchainStats();
                    break;

                default:
                    stats = new HashMap<>();
                    stats.put("message", "No blockchain provider available");
            }

            stats.put("blockchainProvider", activeProvider.toString());
            stats.put("enabled", true);
            stats.put("mode", blockchainMode);
            stats.put("blindSignatureSupport", true);

            return stats;

        } catch (Exception e) {
            logger.error("❌ Failed to get blockchain stats", e);

            Map<String, Object> error = new HashMap<>();
            error.put("enabled", false);
            error.put("error", e.getMessage());
            error.put("blockchainProvider", activeProvider.toString());
            return error;
        }
    }

    /**
     * Gets the current blockchain provider information
     */
    public Map<String, Object> getProviderInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("activeProvider", activeProvider.toString());
        info.put("blockchainEnabled", blockchainEnabled);
        info.put("blockchainMode", blockchainMode);
        info.put("cordaEnabled", cordaEnabled);
        info.put("cordaAvailable", false); // Will be true when Corda is properly connected
        info.put("blindSignatureSupport", true);
        info.put("privacyProtection", true);
        info.put("timestamp", System.currentTimeMillis());

        // Add provider-specific details
        switch (activeProvider) {
            case SIMULATION:
                info.put("networkType", "Simulated Healthcare Network");
                info.put("consensus", "Simplified Proof of Authority");
                info.put("description", "Privacy-preserving simulation for development");
                break;
            case CORDA:
                info.put("networkType", "Corda Healthcare Network");
                info.put("consensus", "Notary-based Consensus");
                info.put("description", "Enterprise-grade blockchain with privacy");
                break;
            default:
                info.put("networkType", "Disabled");
                info.put("description", "Blockchain functionality disabled");
        }

        return info;
    }

    /**
     * Checks if blockchain functionality is available and working
     */
    public boolean isBlockchainAvailable() {
        return blockchainEnabled && activeProvider != BlockchainProvider.DISABLED;
    }

    /**
     * Gets the current active provider
     */
    public BlockchainProvider getActiveProvider() {
        return activeProvider;
    }

    /**
     * Forces a switch to simulation mode (useful for testing or fallback)
     */
    public void switchToSimulationMode() {
        if (blockchainEnabled) {
            activeProvider = BlockchainProvider.SIMULATION;
            logger.info("🔄 Switched to simulation blockchain provider");
        }
    }

    /**
     * Attempts to reconnect to Corda if it was previously unavailable
     */
    public boolean reconnectToCorda() {
        if (!cordaEnabled) {
            logger.warn("Corda is not enabled in configuration");
            return false;
        }

        try {
            // TODO: Implement actual Corda connection logic when classes are available
            logger.warn("Corda service not yet implemented");
            return false;
        } catch (Exception e) {
            logger.warn("Failed to reconnect to Corda", e);
            return false;
        }
    }

    // Private helper methods
    private Map<String, Object> createDisabledResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        response.put("blockchainProvider", "DISABLED");
        response.put("enabled", false);
        return response;
    }

    private String maskEmail(String email) {
        if (email == null || email.length() < 3) return "***";
        return email.substring(0, 3) + "***";
    }

    // Placeholder methods for future Corda integration
    private Map<String, Object> createCordaRegistration(Map<String, Object> registrationData) {
        // TODO: Implement when Corda classes are available
        logger.warn("Corda registration not yet implemented, falling back to simulation");
        switchToSimulationMode();
        return simpleBlockchainService.createRegistrationRecord(registrationData);
    }

    private Map<String, Object> verifyCordaRegistration(String blockId) {
        // TODO: Implement when Corda classes are available
        logger.warn("Corda verification not yet implemented, falling back to simulation");
        switchToSimulationMode();
        return simpleBlockchainService.verifyRegistration(blockId);
    }

    private Map<String, Object> getCordaStats() {
        // TODO: Implement when Corda classes are available
        Map<String, Object> stats = new HashMap<>();
        stats.put("provider", "CORDA");
        stats.put("status", "Not yet implemented");
        stats.put("totalBlocks", 0);
        stats.put("registrationBlocks", 0);
        stats.put("networkType", "Corda Healthcare Network");
        return stats;
    }
}