// File: src/main/java/com/healthcare/flows/PatientQueryFlow.java
package com.healthcare.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.healthcare.states.PatientRegistrationState;
import net.corda.core.flows.*;

import java.util.List;

/**
 * Query Flow to retrieve patient registration information
 */
@InitiatingFlow
@StartableByRPC
public class PatientQueryFlow extends FlowLogic<List<PatientRegistrationState>> {

    private final String patientId;

    public PatientQueryFlow(String patientId) {
        this.patientId = patientId;
    }

    @Suspendable
    @Override
    public List<PatientRegistrationState> call() throws FlowException {
        System.out.println("🔍 Querying patient records on single Healthcare node...");
        System.out.println("📋 Patient ID: " + patientId);

        // Query the vault for patient registration states
        // In single node, all data is stored locally

        try {
            List<PatientRegistrationState> results = getServiceHub().getVaultService()
                    .queryBy(PatientRegistrationState.class)
                    .getStates()
                    .stream()
                    .map(stateAndRef -> stateAndRef.getState().getData())
                    .filter(state -> state.getPatientId().equals(patientId))
                    .collect(java.util.stream.Collectors.toList());

            System.out.println("✅ Found " + results.size() + " records for patient: " + patientId);
            return results;

        } catch (Exception e) {
            System.err.println("❌ Patient query failed: " + e.getMessage());
            throw new FlowException("Patient query failed: " + e.getMessage());
        }
    }
}