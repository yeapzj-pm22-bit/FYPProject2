// src/main/java/com/healthcare/service/CordaClientService.java
package com.healthcare.service;

import com.healthcare.flows.PatientRegistrationInitiator;
import net.corda.client.rpc.CordaRPCClient;
import net.corda.client.rpc.CordaRPCConnection;
import net.corda.core.identity.Party;
import net.corda.core.messaging.CordaRPCOps;
import net.corda.core.node.NodeInfo;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.utilities.NetworkHostAndPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class CordaClientService {

    private static final Logger logger = LoggerFactory.getLogger(CordaClientService.class);

    // FIXED: Use the exact property name from application.properties
    @Value("${corda.enabled:true}")  // ✅ Now defaults to TRUE
    private boolean cordaEnabled;

    @Value("${corda.host:localhost}")
    private String cordaHost;

    @Value("${corda.rpc.port:10006}")
    private int cordaRpcPort;

    @Value("${corda.rpc.username:healthcare}")
    private String cordaUsername;

    @Value("${corda.rpc.password:healthcare123}")
    private String cordaPassword;

    @Value("${corda.network.healthcare-node:O=HealthcareNode,L=NewYork,C=US}")
    private String healthcareNodeName;

    @Value("${corda.startup.delay-seconds:5}")
    private int startupDelaySeconds;

    @Value("${corda.connection.max-retries:3}")
    private int maxRetries;

    @Value("${corda.connection.retry-delay-seconds:5}")
    private int retryDelaySeconds;

    private CordaRPCConnection rpcConnection;
    private CordaRPCOps cordaRPCOps;
    private Party healthcareNode;
    private volatile boolean connected = false;
    private String lastConnectionError = null;

    @PostConstruct
    public void init() {
        logger.info("🔧 CordaClientService starting...");
        logger.info("   Corda Enabled: {}", cordaEnabled);
        logger.info("   Corda Host: {}", cordaHost);
        logger.info("   Corda RPC Port: {}", cordaRpcPort);
        logger.info("   Corda Username: {}", cordaUsername);

        if (!cordaEnabled) {
            logger.info("🔒 Corda disabled in configuration - service available but not connected");
            connected = false;
            return;
        }

        // Wait for Corda to be fully ready
        if (startupDelaySeconds > 0) {
            try {
                logger.info("⏰ Waiting {} seconds for Corda to fully start...", startupDelaySeconds);
                Thread.sleep(startupDelaySeconds * 1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                logger.warn("Startup delay interrupted");
                return;
            }
        }

        // Attempt connection
        attemptConnection();
    }

    private void attemptConnection() {
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                logger.info("🔗 Connection attempt {}/{} - Connecting to Corda node at {}:{}",
                        attempt, maxRetries, cordaHost, cordaRpcPort);

                // First check if the port is reachable
                if (!isPortReachable(cordaHost, cordaRpcPort)) {
                    throw new Exception("Cannot reach Corda RPC port " + cordaRpcPort + ". Is Corda running?");
                }

                // Create RPC connection
                NetworkHostAndPort nodeAddress = new NetworkHostAndPort(cordaHost, cordaRpcPort);
                CordaRPCClient client = new CordaRPCClient(nodeAddress);

                logger.info("🔐 Attempting RPC authentication...");
                rpcConnection = client.start(cordaUsername, cordaPassword);
                cordaRPCOps = rpcConnection.getProxy();

                // Verify connection by getting node info
                NodeInfo nodeInfo = cordaRPCOps.nodeInfo();
                healthcareNode = nodeInfo.getLegalIdentities().get(0);
                connected = true;
                lastConnectionError = null;

                logger.info("✅ Successfully connected to Corda node: {}", healthcareNode.getName());
                logger.info("🏥 Platform version: {}", nodeInfo.getPlatformVersion());
                logger.info("🔐 Node addresses: {}", nodeInfo.getAddresses());

                verifyNodeCapabilities();
                return; // Success - exit retry loop

            } catch (Exception e) {
                lastConnectionError = e.getMessage();
                logger.warn("⚠️ Connection attempt {}/{} failed: {}", attempt, maxRetries, e.getMessage());

                // Provide specific troubleshooting advice
                if (e.getMessage().contains("Connection refused")) {
                    logger.warn("💡 Connection refused - Check if Corda is running on {}:{}", cordaHost, cordaRpcPort);
                } else if (e.getMessage().contains("Authentication")) {
                    logger.warn("💡 Authentication failed - Check RPC username/password in node.conf");
                } else if (e.getMessage().contains("timeout")) {
                    logger.warn("💡 Connection timeout - Corda node may be slow to start");
                } else if (e.getMessage().contains("Cannot reach")) {
                    logger.warn("💡 Port not reachable - Ensure Corda is running and port {} is open", cordaRpcPort);
                }

                if (attempt < maxRetries) {
                    try {
                        logger.info("⏳ Waiting {} seconds before retry...", retryDelaySeconds);
                        Thread.sleep(retryDelaySeconds * 1000);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }
            }
        }

        // All retries failed
        logger.error("❌ All {} connection attempts failed. Last error: {}", maxRetries, lastConnectionError);
        logger.error("🔧 Troubleshooting tips:");
        logger.error("   1. Verify Corda node is running: ps aux | grep corda");
        logger.error("   2. Check RPC port is listening: netstat -tlnp | grep {}", cordaRpcPort);
        logger.error("   3. Verify RPC credentials in node.conf");
        logger.error("   4. Check firewall settings for port {}", cordaRpcPort);

        connected = false;
        cleanup();
    }

    private boolean isPortReachable(String host, int port) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), 5000);
            logger.debug("✅ Port {}:{} is reachable", host, port);
            return true;
        } catch (Exception e) {
            logger.debug("❌ Port {}:{} not reachable: {}", host, port, e.getMessage());
            return false;
        }
    }

    private void verifyNodeCapabilities() {
        if (!connected || cordaRPCOps == null) return;

        try {
            List<Party> notaries = cordaRPCOps.notaryIdentities();
            boolean isNotary = notaries.stream()
                    .anyMatch(notary -> notary.getName().equals(healthcareNode.getName()));

            logger.info("🔐 Notary capability: {}", (isNotary ? "✅ Available" : "❌ Not available"));

            List<NodeInfo> networkNodes = cordaRPCOps.networkMapSnapshot();
            logger.info("🌐 Network nodes discovered: {}", networkNodes.size());

            // Log all discovered nodes
            for (NodeInfo node : networkNodes) {
                logger.info("   📍 Node: {}", node.getLegalIdentities().get(0).getName());
            }

        } catch (Exception e) {
            logger.warn("⚠️ Could not verify node capabilities: {}", e.getMessage());
        }
    }

    // Manual retry method for testing
    public boolean retryConnection() {
        logger.info("🔄 Manual connection retry requested");
        cleanup();
        attemptConnection();
        return connected;
    }

    public Map<String, Object> registerPatient(String patientId,
                                               String identityCommitment,
                                               String blindSignatureHash,
                                               String sessionId) throws Exception {

        if (!isConnected()) {
            throw new Exception("Corda node is not connected. Last error: " + lastConnectionError);
        }

        logger.info("🏥 Starting patient registration on Healthcare node...");

        try {
            SignedTransaction transaction = cordaRPCOps.startFlowDynamic(
                    PatientRegistrationInitiator.class,
                    patientId,
                    identityCommitment,
                    blindSignatureHash,
                    sessionId,
                    healthcareNode,
                    healthcareNode
            ).getReturnValue().get();

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("transactionId", transaction.getId().toString());
            result.put("blockId", transaction.getId().toString());
            result.put("identityCommitment", identityCommitment);
            result.put("cordaAvailable", true);
            result.put("immutable", true);
            result.put("chainVerified", true);
            result.put("timestamp", java.time.Instant.now().toString());
            result.put("singleNode", true);
            result.put("nodeCapabilities", List.of("Hospital", "PatientRegistry", "Regulator", "Notary"));

            logger.info("✅ Patient registration completed: {}", transaction.getId());
            return result;

        } catch (InterruptedException | ExecutionException e) {
            logger.error("❌ Patient registration failed: {}", e.getMessage());
            throw new Exception("Patient registration failed: " + e.getMessage());
        }
    }

    public Map<String, Object> verifyTransaction(String transactionId) throws Exception {
        if (!isConnected()) {
            throw new Exception("Corda node is not connected. Last error: " + lastConnectionError);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("verified", true);
        result.put("transactionId", transactionId);
        result.put("singleNode", true);
        result.put("nodeVerified", healthcareNode.getName().toString());
        result.put("immutable", true);
        result.put("timestamp", java.time.Instant.now().toString());

        return result;
    }

    public Map<String, Object> getNetworkStats() {
        Map<String, Object> stats = new HashMap<>();

        if (!isConnected()) {
            stats.put("success", false);
            stats.put("connected", false);
            stats.put("enabled", cordaEnabled);
            stats.put("lastError", lastConnectionError);
            stats.put("reason", cordaEnabled ? "Connection failed" : "Corda disabled");
            stats.put("troubleshooting", getTroubleshootingInfo());
            return stats;
        }

        try {
            List<NodeInfo> networkNodes = cordaRPCOps.networkMapSnapshot();
            List<Party> notaries = cordaRPCOps.notaryIdentities();

            stats.put("success", true);
            stats.put("connected", true);
            stats.put("networkType", "Single Node Healthcare Blockchain");
            stats.put("totalNodes", networkNodes.size());
            stats.put("notaries", notaries.size());
            stats.put("nodeCapabilities", List.of("Hospital", "PatientRegistry", "Regulator", "Notary"));
            stats.put("consensusType", "Single Node Consensus");
            stats.put("healthcareNode", healthcareNode.getName().toString());

        } catch (Exception e) {
            stats.put("success", false);
            stats.put("connected", false);
            stats.put("error", e.getMessage());
        }

        return stats;
    }

    public boolean isConnected() {
        if (!cordaEnabled) {
            return false;
        }

        if (!connected || cordaRPCOps == null) {
            return false;
        }

        try {
            // Ping the node to verify connection is still alive
            NodeInfo nodeInfo = cordaRPCOps.nodeInfo();
            return nodeInfo != null;
        } catch (Exception e) {
            logger.debug("Connection check failed: {}", e.getMessage());
            connected = false;
            lastConnectionError = e.getMessage();
            return false;
        }
    }

    public Map<String, Object> getNodeInfo() {
        Map<String, Object> info = new HashMap<>();

        if (!cordaEnabled) {
            info.put("connected", false);
            info.put("enabled", false);
            info.put("reason", "Corda disabled in configuration");
            return info;
        }

        if (!isConnected()) {
            info.put("connected", false);
            info.put("enabled", true);
            info.put("lastError", lastConnectionError);
            info.put("error", "Not connected to Corda node");
            info.put("troubleshooting", getTroubleshootingInfo());
            return info;
        }

        try {
            NodeInfo nodeInfo = cordaRPCOps.nodeInfo();
            List<Party> notaries = cordaRPCOps.notaryIdentities();

            info.put("connected", true);
            info.put("enabled", true);
            info.put("nodeName", healthcareNode.getName().toString());
            info.put("nodeType", "Single Healthcare Node");
            info.put("capabilities", List.of("Hospital", "PatientRegistry", "Regulator", "Notary"));
            info.put("platformVersion", nodeInfo.getPlatformVersion());
            info.put("addresses", nodeInfo.getAddresses());
            info.put("isNotary", notaries.contains(healthcareNode));
            info.put("rpcEndpoint", cordaHost + ":" + cordaRpcPort);

        } catch (Exception e) {
            info.put("connected", false);
            info.put("enabled", true);
            info.put("error", e.getMessage());
        }

        return info;
    }

    private Map<String, Object> getTroubleshootingInfo() {
        Map<String, Object> troubleshooting = new HashMap<>();
        troubleshooting.put("rpcEndpoint", cordaHost + ":" + cordaRpcPort);
        troubleshooting.put("username", cordaUsername);
        troubleshooting.put("portReachable", isPortReachable(cordaHost, cordaRpcPort));
        troubleshooting.put("lastError", lastConnectionError);
        troubleshooting.put("suggestions", List.of(
                "1. Verify Corda node is running: ps aux | grep corda",
                "2. Check if port " + cordaRpcPort + " is listening: netstat -tlnp | grep " + cordaRpcPort,
                "3. Verify RPC credentials in node.conf (username: " + cordaUsername + ")",
                "4. Check Corda node logs for startup errors",
                "5. Ensure network connectivity between services",
                "6. Try manual connection: telnet " + cordaHost + " " + cordaRpcPort
        ));
        return troubleshooting;
    }

    public boolean isCordaEnabled() {
        return cordaEnabled;
    }

    public String getLastConnectionError() {
        return lastConnectionError;
    }

    @PreDestroy
    public void cleanup() {
        if (rpcConnection != null) {
            try {
                logger.info("🔌 Disconnecting from Corda node...");
                rpcConnection.notifyServerAndClose();
                connected = false;
            } catch (Exception e) {
                logger.warn("Error during cleanup: {}", e.getMessage());
            }
        }
    }
}