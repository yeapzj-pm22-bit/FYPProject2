// =======================================================
// BACKEND-ONLY CORDA SETUP
// All blockchain logic stays in backend folder
// =======================================================

// 1. backend/config/corda.js
// ============================
const cordaConfig = {
  // Corda Node Connection (BACKEND ONLY)
  rpc: {
    host: process.env.CORDA_RPC_HOST || 'localhost',
    port: process.env.CORDA_RPC_PORT || 10006,
    username: process.env.CORDA_RPC_USERNAME || 'user1',
    password: process.env.CORDA_RPC_PASSWORD || 'password1',
    ssl: process.env.CORDA_RPC_SSL === 'true'
  },

  // Network Configuration (BACKEND ONLY)
  network: {
    nodeAddress: process.env.CORDA_NODE_ADDRESS || 'O=Hospital,L=New York,C=US',
    notaryAddress: process.env.CORDA_NOTARY || 'O=Notary,L=London,C=GB',
    networkMapService: process.env.CORDA_NETWORK_MAP || 'http://localhost:8080'
  },

  // Smart Contract Configuration (BACKEND ONLY)
  contracts: {
    patientRegistry: 'com.healthcare.contracts.PatientContract',
    appointmentManager: 'com.healthcare.contracts.AppointmentContract',
    medicalRecords: 'com.healthcare.contracts.MedicalRecordContract',
    pharmacyDispenser: 'com.healthcare.contracts.PharmacyContract'
  },

  // Flow Names (BACKEND ONLY)
  flows: {
    registerPatient: 'com.healthcare.flows.RegisterPatientFlow',
    createAppointment: 'com.healthcare.flows.CreateAppointmentFlow',
    updateMedicalRecord: 'com.healthcare.flows.UpdateMedicalRecordFlow',
    dispenseMedicine: 'com.healthcare.flows.DispenseMedicineFlow'
  }
};
