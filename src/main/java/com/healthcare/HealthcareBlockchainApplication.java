// src/main/java/com/healthcare/HealthcareBlockchainApplication.java
package com.healthcare;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

import java.net.InetAddress;
import java.net.UnknownHostException;

@SpringBootApplication
@ComponentScan(basePackages = "com.healthcare")
@EntityScan(basePackages = "com.healthcare.model")
@EnableJpaRepositories(basePackages = "com.healthcare.repository")
public class HealthcareBlockchainApplication {

    private static final Logger logger = LoggerFactory.getLogger(HealthcareBlockchainApplication.class);

    public static void main(String[] args) {
        try {
            ConfigurableApplicationContext context = SpringApplication.run(HealthcareBlockchainApplication.class, args);
            Environment env = context.getEnvironment();

            logApplicationStartup(env);

        } catch (Exception e) {
            logger.error("Failed to start Healthcare Blockchain Application", e);
            System.exit(1);
        }
    }

    private static void logApplicationStartup(Environment env) {
        String protocol = "http";
        if (env.getProperty("server.ssl.key-store") != null) {
            protocol = "https";
        }

        String serverPort = env.getProperty("server.port", "8080");
        String contextPath = env.getProperty("server.servlet.context-path", "/");

        String hostAddress = "localhost";
        try {
            hostAddress = InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            logger.warn("The host name could not be determined, using 'localhost' as fallback");
        }

        String blockchainMode = env.getProperty("blockchain.mode", "simulation");
        String cordaEnabled = env.getProperty("corda.enabled", "false");
        String[] activeProfiles = env.getActiveProfiles();

        logger.info("\n----------------------------------------------------------\n" +
                        "🏥 Healthcare Blockchain Application is running!\n" +
                        "🌐 Access URLs:\n" +
                        "\t Local: \t\t{}://localhost:{}{}\n" +
                        "\t External: \t\t{}://{}:{}{}\n" +
                        "🔗 Blockchain Mode: \t{}\n" +
                        "🔐 Corda Enabled: \t{}\n" +
                        "📊 H2 Console: \t\t{}://localhost:{}/h2-console\n" +
                        "⚕️  Health Check: \t{}://localhost:{}/actuator/health\n" +
                        "📋 API Endpoints:\n" +
                        "\t Patient API: \t\t{}://localhost:{}/api/patients\n" +
                        "\t Blockchain API: \t{}://localhost:{}/api/blockchain\n" +
                        "🔧 Active Profiles: \t{}\n" +
                        "----------------------------------------------------------",
                protocol, serverPort, contextPath,
                protocol, hostAddress, serverPort, contextPath,
                blockchainMode,
                cordaEnabled,
                protocol, serverPort,
                protocol, serverPort,
                protocol, serverPort,
                protocol, serverPort,
                activeProfiles.length == 0 ? "default" : String.join(", ", activeProfiles));

        // Additional startup information
        logger.info("🚀 Application startup completed successfully");
        logger.info("📚 API Documentation: Access the health endpoint to verify the application is running");
        logger.info("🔧 To enable Corda: Set corda.enabled=true and provide Corda node details");
        logger.info("🛡️  Security: Default credentials are admin/healthcare123 (change in production)");
    }
}