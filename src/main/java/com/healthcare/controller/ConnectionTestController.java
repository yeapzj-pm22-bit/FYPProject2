// src/main/java/com/healthcare/controller/ConnectionTestController.java
package com.healthcare.controller;

import com.healthcare.service.CordaClientService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class ConnectionTestController {

    private static final Logger logger = LoggerFactory.getLogger(ConnectionTestController.class);

    @Autowired
    private CordaClientService cordaClientService;

    @GetMapping("/corda-status")
    public ResponseEntity<Map<String, Object>> testCordaStatus() {
        Map<String, Object> result = new HashMap<>();

        logger.info("🧪 Testing Corda connection status...");

        try {
            // Basic connection test
            result.put("cordaEnabled", cordaClientService.isCordaEnabled());
            result.put("cordaConnected", cordaClientService.isConnected());
            result.put("lastError", cordaClientService.getLastConnectionError());

            // Port connectivity test
            result.put("portTest", testPortConnectivity());

            // Node information
            result.put("nodeInfo", cordaClientService.getNodeInfo());

            // Network stats
            result.put("networkStats", cordaClientService.getNetworkStats());

            result.put("timestamp", java.time.Instant.now().toString());
            result.put("testStatus", cordaClientService.isConnected() ? "SUCCESS" : "FAILED");

            logger.info("✅ Corda status test completed");
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            logger.error("❌ Corda status test failed", e);

            result.put("testStatus", "ERROR");
            result.put("error", e.getMessage());
            return ResponseEntity.status(500).body(result);
        }
    }

    @PostMapping("/retry-connection")
    public ResponseEntity<Map<String, Object>> retryCordaConnection() {
        Map<String, Object> result = new HashMap<>();

        logger.info("🔄 Manual retry of Corda connection requested");

        try {
            boolean success = cordaClientService.retryConnection();

            result.put("retrySuccess", success);
            result.put("connected", cordaClientService.isConnected());
            result.put("message", success ? "Connection retry successful" : "Connection retry failed");
            result.put("lastError", cordaClientService.getLastConnectionError());
            result.put("timestamp", java.time.Instant.now().toString());

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            logger.error("❌ Connection retry failed", e);

            result.put("retrySuccess", false);
            result.put("error", e.getMessage());
            return ResponseEntity.status(500).body(result);
        }
    }

    @GetMapping("/quick-diagnosis")
    public ResponseEntity<Map<String, Object>> quickDiagnosis() {
        Map<String, Object> diagnosis = new HashMap<>();

        logger.info("🔍 Running quick Corda diagnosis...");

        // Test 1: Configuration check
        diagnosis.put("step1_configuration", checkConfiguration());

        // Test 2: Network connectivity
        diagnosis.put("step2_connectivity", testPortConnectivity());

        // Test 3: Service status
        diagnosis.put("step3_service", checkServiceStatus());

        // Test 4: Overall diagnosis
        diagnosis.put("step4_diagnosis", generateDiagnosis(diagnosis));

        return ResponseEntity.ok(diagnosis);
    }

    private Map<String, Object> checkConfiguration() {
        Map<String, Object> config = new HashMap<>();

        config.put("cordaEnabled", cordaClientService.isCordaEnabled());
        config.put("expectedRpcPort", 10006);
        config.put("expectedUsername", "healthcare");
        config.put("serviceBeanExists", cordaClientService != null);

        return config;
    }

    private Map<String, Object> testPortConnectivity() {
        Map<String, Object> connectivity = new HashMap<>();

        try {
            Socket socket = new Socket();
            socket.connect(new InetSocketAddress("localhost", 10006), 5000);
            socket.close();

            connectivity.put("portReachable", true);
            connectivity.put("host", "localhost");
            connectivity.put("port", 10006);
            connectivity.put("message", "Port 10006 is reachable");

        } catch (Exception e) {
            connectivity.put("portReachable", false);
            connectivity.put("host", "localhost");
            connectivity.put("port", 10006);
            connectivity.put("error", e.getMessage());
            connectivity.put("message", "Port 10006 is NOT reachable - Is Corda running?");
        }

        return connectivity;
    }

    private Map<String, Object> checkServiceStatus() {
        Map<String, Object> service = new HashMap<>();

        service.put("connected", cordaClientService.isConnected());
        service.put("enabled", cordaClientService.isCordaEnabled());
        service.put("lastError", cordaClientService.getLastConnectionError());

        return service;
    }

    private Map<String, Object> generateDiagnosis(Map<String, Object> testResults) {
        Map<String, Object> diagnosis = new HashMap<>();

        @SuppressWarnings("unchecked")
        Map<String, Object> config = (Map<String, Object>) testResults.get("step1_configuration");
        @SuppressWarnings("unchecked")
        Map<String, Object> connectivity = (Map<String, Object>) testResults.get("step2_connectivity");
        @SuppressWarnings("unchecked")
        Map<String, Object> service = (Map<String, Object>) testResults.get("step3_service");

        boolean configOk = (Boolean) config.get("cordaEnabled");
        boolean portOk = (Boolean) connectivity.get("portReachable");
        boolean serviceOk = (Boolean) service.get("connected");

        if (serviceOk) {
            diagnosis.put("status", "✅ HEALTHY");
            diagnosis.put("message", "Corda connection is working properly");
        } else if (!configOk) {
            diagnosis.put("status", "🔧 CONFIG_ISSUE");
            diagnosis.put("message", "Corda is disabled in configuration");
            diagnosis.put("solution", "Set corda.enabled=true in application.properties");
        } else if (!portOk) {
            diagnosis.put("status", "🔌 CONNECTION_ISSUE");
            diagnosis.put("message", "Cannot reach Corda RPC port 10006");
            diagnosis.put("solution", "Start Corda node: cd corda-node && java -jar corda.jar");
        } else {
            diagnosis.put("status", "🔐 AUTH_ISSUE");
            diagnosis.put("message", "Port reachable but authentication failed");
            diagnosis.put("solution", "Check RPC credentials in node.conf");
        }

        return diagnosis;
    }
}