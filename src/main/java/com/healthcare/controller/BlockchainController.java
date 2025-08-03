// src/main/java/com/healthcare/controller/BlockchainController.java
package com.healthcare.controller;

import com.healthcare.service.UnifiedBlockchainService;
import com.healthcare.service.CordaClientService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/blockchain")
@CrossOrigin(origins = "*") // Configure properly for production
public class BlockchainController {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    private static final Logger logger = LoggerFactory.getLogger(BlockchainController.class);

    @Autowired
    private UnifiedBlockchainService blockchainService;

    @Autowired(required = false)
    private CordaClientService cordaClientService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerPatient(@RequestBody Map<String, Object> registrationData) {
        logger.info("🔗 Blockchain registration request received");

        try {
            // Validate required fields
            if (!registrationData.containsKey("email") ||
                    !registrationData.containsKey("sessionId") ||
                    !registrationData.containsKey("signatureHash")) {

                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Missing required fields: email, sessionId, signatureHash");
                return ResponseEntity.badRequest().body(error);
            }

            // Create blockchain registration record
            Map<String, Object> result = blockchainService.createRegistrationRecord(registrationData);

            Boolean success = (Boolean) result.get("success");
            if (success != null && success) {
                logger.info("✅ Blockchain registration successful with provider: {}",
                        result.get("blockchainProvider"));
                return ResponseEntity.ok(result);
            } else {
                logger.error("❌ Blockchain registration failed: {}", result.get("message"));
                return ResponseEntity.status(500).body(result);
            }

        } catch (Exception e) {
            logger.error("❌ Blockchain registration error", e);

            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Blockchain registration failed: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/verify/{blockId}")
    public ResponseEntity<Map<String, Object>> verifyRegistration(@PathVariable String blockId) {
        Map<String, Object> result = new HashMap<>();

        try {
            logger.info("🔍 Verifying registration for blockId: {}", blockId);

            if (blockId == null || blockId.trim().isEmpty()) {
                result.put("verified", false);
                result.put("found", false);
                result.put("error", "Block ID is required");
                return ResponseEntity.badRequest().body(result);
            }

            // Check 1: Look in corda_transactions table
            List<Map<String, Object>> cordaRecords = jdbcTemplate.queryForList(
                    "SELECT * FROM corda_transactions WHERE transactionId = ? LIMIT 1",
                    blockId
            );

            // Check 2: Look in users table for registrationTxId
            List<Map<String, Object>> userRecords = jdbcTemplate.queryForList(
                    "SELECT userId, email, registrationTxId, identityCommitment, createdAt, status " +
                            "FROM users WHERE registrationTxId = ? LIMIT 1",
                    blockId
            );

            // Check 3: Look in audit_trail for this transaction
            List<Map<String, Object>> auditRecords = jdbcTemplate.queryForList(
                    "SELECT * FROM audit_trail WHERE complianceFlags LIKE ? LIMIT 1",
                    "%" + blockId + "%"
            );

            boolean recordExists = !cordaRecords.isEmpty() || !userRecords.isEmpty();

            if (recordExists) {
                // Record found!
                logger.info("✅ Record found for blockId: {}", blockId);

                result.put("verified", true);
                result.put("found", true);
                result.put("exists", true);
                result.put("blockId", blockId);
                result.put("message", "Record found and verified in blockchain");

                // Add details about what was found
                Map<String, Object> details = new HashMap<>();
                details.put("cordaRecords", cordaRecords.size());
                details.put("userRecords", userRecords.size());
                details.put("auditRecords", auditRecords.size());

                if (!userRecords.isEmpty()) {
                    Map<String, Object> userRecord = userRecords.get(0);
                    details.put("userId", userRecord.get("userId"));
                    details.put("registrationDate", userRecord.get("createdAt"));
                    details.put("userStatus", userRecord.get("status"));
                    details.put("identityCommitment", userRecord.get("identityCommitment"));
                }

                if (!cordaRecords.isEmpty()) {
                    Map<String, Object> cordaRecord = cordaRecords.get(0);
                    details.put("recordType", cordaRecord.get("recordType"));
                    details.put("networkId", cordaRecord.get("networkId"));
                    details.put("cordaStatus", cordaRecord.get("status"));
                    details.put("timestamp", cordaRecord.get("timestamp"));
                }

                result.put("recordDetails", details);
                result.put("provider", "SIMULATION");
                result.put("networkStatus", "confirmed");

            } else {
                // Record NOT found
                logger.warn("❌ No record found for blockId: {}", blockId);

                result.put("verified", false);
                result.put("found", false);
                result.put("exists", false);
                result.put("blockId", blockId);
                result.put("message", "No record found for this block ID");
                result.put("searchedTables", Arrays.asList("corda_transactions", "users", "audit_trail"));
            }

            result.put("timestamp", new Date().toInstant().toString());
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            logger.error("❌ Error during verification for blockId: {}", blockId, e);

            result.put("verified", false);
            result.put("found", false);
            result.put("exists", false);
            result.put("error", "Verification failed: " + e.getMessage());
            result.put("blockId", blockId);
            return ResponseEntity.status(500).body(result);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getBlockchainStats() {
        logger.info("📊 Blockchain stats request");

        try {
            Map<String, Object> stats = blockchainService.getBlockchainStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("❌ Stats query error", e);

            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Stats query failed: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/provider")
    public ResponseEntity<Map<String, Object>> getProviderInfo() {
        logger.info("🔧 Provider info request");

        try {
            Map<String, Object> info = blockchainService.getProviderInfo();
            return ResponseEntity.ok(info);
        } catch (Exception e) {
            logger.error("❌ Provider info error", e);

            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Provider info failed: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/switch-to-simulation")
    public ResponseEntity<Map<String, Object>> switchToSimulation() {
        logger.info("🔄 Switching to simulation mode");

        try {
            blockchainService.switchToSimulationMode();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Switched to simulation mode");
            response.put("provider", blockchainService.getActiveProvider().toString());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("❌ Failed to switch to simulation", e);

            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to switch to simulation: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/reconnect-corda")
    public ResponseEntity<Map<String, Object>> reconnectToCorda() {
        logger.info("🔗 Attempting to reconnect to Corda");

        try {
            boolean success = blockchainService.reconnectToCorda();

            Map<String, Object> response = new HashMap<>();
            response.put("success", success);
            response.put("message", success ? "Successfully reconnected to Corda" : "Failed to reconnect to Corda");
            response.put("provider", blockchainService.getActiveProvider().toString());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("❌ Failed to reconnect to Corda", e);

            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to reconnect to Corda: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // ENHANCED HEALTH ENDPOINT - This is what your Node.js expects
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        logger.info("🏥 Health check request received");

        Map<String, Object> health = new HashMap<>();

        try {
            // Basic service info
            health.put("success", true);
            health.put("service", "Healthcare Blockchain API");
            health.put("timestamp", java.time.Instant.now().toString());

            // Blockchain availability
            boolean blockchainAvailable = blockchainService.isBlockchainAvailable();
            health.put("blockchainAvailable", blockchainAvailable);

            // Active provider info
            String activeProvider = blockchainService.getActiveProvider().toString();
            health.put("activeProvider", activeProvider);

            // Corda-specific status
            boolean cordaAvailable = false;
            String networkInfo = "Simulation Mode";
            Map<String, Object> cordaDetails = new HashMap<>();

            if (cordaClientService != null) {
                cordaAvailable = cordaClientService.isConnected();
                cordaDetails.put("serviceAvailable", true);
                cordaDetails.put("connected", cordaAvailable);

                if (cordaAvailable) {
                    try {
                        Map<String, Object> nodeInfo = cordaClientService.getNodeInfo();
                        networkInfo = (String) nodeInfo.get("nodeName");
                        cordaDetails.put("nodeInfo", nodeInfo);
                        cordaDetails.put("capabilities", nodeInfo.get("capabilities"));
                    } catch (Exception e) {
                        logger.warn("Failed to get Corda node info: {}", e.getMessage());
                        cordaDetails.put("nodeInfoError", e.getMessage());
                    }
                }
            } else {
                cordaDetails.put("serviceAvailable", false);
                cordaDetails.put("reason", "CordaClientService not configured");
            }

            health.put("cordaAvailable", cordaAvailable);
            health.put("networkInfo", networkInfo);
            health.put("cordaDetails", cordaDetails);

            // Provider-specific info
            try {
                Map<String, Object> providerInfo = blockchainService.getProviderInfo();
                health.put("providerInfo", providerInfo);
            } catch (Exception e) {
                logger.warn("Failed to get provider info: {}", e.getMessage());
                health.put("providerInfoError", e.getMessage());
            }

            // Network type determination
            if (cordaAvailable) {
                health.put("networkType", "Corda R3 Blockchain");
                health.put("mode", "production");
            } else {
                health.put("networkType", "Simulation Mode");
                health.put("mode", "simulation");
            }

            logger.info("✅ Health check completed - Corda: {}, Provider: {}",
                    cordaAvailable, activeProvider);

            return ResponseEntity.ok(health);

        } catch (Exception e) {
            logger.error("❌ Health check failed", e);

            health.put("success", false);
            health.put("service", "Healthcare Blockchain API (Error)");
            health.put("error", e.getMessage());
            health.put("cordaAvailable", false);
            health.put("blockchainAvailable", false);
            health.put("networkInfo", "Service Error");

            return ResponseEntity.status(500).body(health);
        }
    }

    // ALTERNATIVE SIMPLE HEALTH ENDPOINT
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> simpleStatus() {
        Map<String, Object> status = new HashMap<>();

        try {
            status.put("alive", true);
            status.put("service", "Healthcare Blockchain API");
            status.put("timestamp", System.currentTimeMillis());

            boolean cordaConnected = cordaClientService != null && cordaClientService.isConnected();
            status.put("corda", cordaConnected);
            status.put("blockchain", blockchainService.isBlockchainAvailable());

            return ResponseEntity.ok(status);
        } catch (Exception e) {
            status.put("alive", false);
            status.put("error", e.getMessage());
            return ResponseEntity.status(500).body(status);
        }
    }

    @GetMapping("/network-info")
    public ResponseEntity<Map<String, Object>> getNetworkInfo() {
        try {
            Map<String, Object> info = blockchainService.getProviderInfo();

            // Add Corda-specific network info if available
            if (cordaClientService != null && cordaClientService.isConnected()) {
                try {
                    Map<String, Object> cordaStats = cordaClientService.getNetworkStats();
                    info.put("cordaNetworkStats", cordaStats);
                } catch (Exception e) {
                    logger.warn("Failed to get Corda network stats: {}", e.getMessage());
                }
            }

            return ResponseEntity.ok(info);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}