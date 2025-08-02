import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, User, Shield, Lock, Database, Eye, EyeOff,
  AlertTriangle, CheckCircle, Info, Download, RefreshCw, X,
  FileText, Image, Key, Activity, Bell, Settings, LogOut,
  ChevronRight, ChevronDown, Search, Filter, MoreHorizontal,
  Unlock, Fingerprint, Scan, UserCheck, AlertCircle,Plus
} from 'lucide-react';

const SecureDoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showStegExtractor, setShowStegExtractor] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showCredentialModal, setShowCredentialModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [extractingData, setExtractingData] = useState(false);
  const [verifyingCredential, setVerifyingCredential] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [credentialVerified, setCredentialVerified] = useState(false);

  // Consultation completion states
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showStegEmbedModal, setShowStegEmbedModal] = useState(false);
  const [consultationData, setConsultationData] = useState({
    diagnosis: '',
    symptoms: '',
    treatmentPlan: '',
    followUpRequired: false,
    followUpDate: '',
    prescriptions: [],
    attachedImages: [],
    patientConsent: {
      dataStorage: false,
      blockchainRecording: false,
      imageEmbedding: false
    }
  });
  const [currentPrescription, setCurrentPrescription] = useState({
    medicine: null,
    quantity: '',
    dosage: '',
    frequency: '',
    instructions: '',
    duration: ''
  });
  const [selectedImageForSteg, setSelectedImageForSteg] = useState(null);
  const [stegContent, setStegContent] = useState('');
  const [embeddingInProgress, setEmbeddingInProgress] = useState(false);
  const [creatingRecord, setCreatingRecord] = useState(false);

  // Mock medicine database
  const medicineDatabase = [
    { id: 'MED_001', name: 'Paracetamol', category: 'Analgesic', commonDosages: ['500mg', '650mg', '1000mg'] },
    { id: 'MED_002', name: 'Ibuprofen', category: 'NSAID', commonDosages: ['200mg', '400mg', '600mg'] },
    { id: 'MED_003', name: 'Amoxicillin', category: 'Antibiotic', commonDosages: ['250mg', '500mg', '875mg'] },
    { id: 'MED_004', name: 'Metformin', category: 'Antidiabetic', commonDosages: ['500mg', '850mg', '1000mg'] },
    { id: 'MED_005', name: 'Aspirin', category: 'Anticoagulant', commonDosages: ['75mg', '100mg', '325mg'] },
    { id: 'MED_006', name: 'Lisinopril', category: 'ACE Inhibitor', commonDosages: ['5mg', '10mg', '20mg'] },
    { id: 'MED_007', name: 'Atorvastatin', category: 'Statin', commonDosages: ['10mg', '20mg', '40mg'] },
    { id: 'MED_008', name: 'Omeprazole', category: 'PPI', commonDosages: ['20mg', '40mg'] },
    { id: 'MED_009', name: 'Amlodipine', category: 'Calcium Channel Blocker', commonDosages: ['2.5mg', '5mg', '10mg'] },
    { id: 'MED_010', name: 'Ciprofloxacin', category: 'Antibiotic', commonDosages: ['250mg', '500mg', '750mg'] }
  ];
  const doctorInfo = {
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiology',
    licenseId: 'MD-2024-001',
    blockchainAddress: '0x742d35Cc6639C0532fCb5d9CC24db8D2...32F8',
    verificationLevel: 'LEVEL_3_CERTIFIED'
  };

  // Mock appointments with security features
  const [appointments, setAppointments] = useState([
    {
      id: 'APT_001',
      appointmentId: 'APT_BS_4f8a92',
      patientName: 'Anonymous Patient',
      anonymousId: 'ANON_BS_a7b8c9d2',
      date: '2024-08-02',
      time: '09:00',
      duration: 30,
      purpose: 'Cardiac consultation with chest pain symptoms',
      urgencyLevel: 'URGENT',
      securityLevel: 'HIGH_PRIVACY',
      status: 'CONFIRMED',
      hasStegData: true,
      hasEmergencyAccess: true,
      blockchainTxId: 'tx_4a8b7c9d2e1f3g4h',
      verificationStatus: 'VERIFIED',
      patientImage: 'https://via.placeholder.com/400x300/f0f0f0/666?text=Steganographic+Image',
      emergencyData: {
        bloodType: 'A+',
        allergies: ['Penicillin', 'Shellfish'],
        emergencyContact: '+1-555-0123',
        currentMedications: ['Metformin 850mg', 'Aspirin 100mg'],
        chronicConditions: ['Type 2 Diabetes', 'Hypertension']
      }
    },
    {
      id: 'APT_002',
      appointmentId: 'APT_STD_5g9h1i',
      patientName: 'John Smith',
      anonymousId: null,
      date: '2024-08-02',
      time: '10:30',
      duration: 30,
      purpose: 'Regular checkup and blood pressure monitoring',
      urgencyLevel: 'ROUTINE',
      securityLevel: 'STANDARD',
      status: 'CONFIRMED',
      hasStegData: false,
      hasEmergencyAccess: false,
      blockchainTxId: 'tx_5g9h1i2j3k4l5m6n',
      verificationStatus: 'VERIFIED',
      patientImage: null,
      emergencyData: null
    },
    {
      id: 'APT_003',
      appointmentId: 'APT_BS_6j2k3l',
      patientName: 'Anonymous Patient',
      anonymousId: 'ANON_BS_x1y2z3a4',
      date: '2024-08-02',
      time: '14:00',
      duration: 45,
      purpose: 'Confidential cardiac evaluation',
      urgencyLevel: 'URGENT',
      securityLevel: 'ANONYMOUS',
      status: 'PENDING_VERIFICATION',
      hasStegData: true,
      hasEmergencyAccess: true,
      blockchainTxId: 'tx_6j2k3l4m5n6o7p8q',
      verificationStatus: 'PENDING',
      patientImage: 'https://via.placeholder.com/400x300/e8f4f8/4a90a4?text=Medical+History+Hidden',
      emergencyData: {
        bloodType: 'O-',
        allergies: ['Latex'],
        emergencyContact: '+1-555-0456',
        currentMedications: ['Warfarin 5mg'],
        chronicConditions: ['Atrial Fibrillation']
      }
    }
  ]);

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         apt.appointmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         apt.purpose.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Get security level badge
  const getSecurityBadge = (level) => {
    const styles = {
      'HIGH_PRIVACY': 'security-badge high-privacy',
      'ANONYMOUS': 'security-badge anonymous',
      'STEGANOGRAPHIC': 'security-badge steganographic',
      'STANDARD': 'security-badge standard'
    };
    return styles[level] || 'security-badge standard';
  };

  const getSecurityIcon = (level) => {
    switch (level) {
      case 'HIGH_PRIVACY': return <Shield size={12} />;
      case 'ANONYMOUS': return <EyeOff size={12} />;
      case 'STEGANOGRAPHIC': return <Lock size={12} />;
      default: return <Key size={12} />;
    }
  };

  const getUrgencyBadge = (urgency) => {
    const styles = {
      'EMERGENCY': 'urgency-badge emergency',
      'URGENT': 'urgency-badge urgent',
      'ROUTINE': 'urgency-badge routine'
    };
    return styles[urgency] || 'urgency-badge routine';
  };

  const getStatusBadge = (status) => {
    const styles = {
      'CONFIRMED': 'status-badge confirmed',
      'PENDING_VERIFICATION': 'status-badge pending',
      'IN_PROGRESS': 'status-badge progress',
      'COMPLETED': 'status-badge completed'
    };
    return styles[status] || 'status-badge confirmed';
  };

  // Handle steganographic data extraction
  const handleExtractStegData = async (appointment) => {
    setExtractingData(true);
    setSelectedAppointment(appointment);

    try {
      console.log('🔍 Starting steganographic data extraction...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockExtractedData = {
        patientId: 'P_STEG_' + Math.random().toString(16).substr(2, 8),
        medicalHistory: [
          'Previous MI in 2019 - fully recovered',
          'Family history of cardiovascular disease',
          'Previous allergic reaction to Penicillin',
          'Current medications: Metformin, Aspirin',
          'Recent ECG shows minor irregularities'
        ],
        vitalSigns: {
          bloodPressure: '140/90',
          heartRate: '82 bpm',
          temperature: '98.6°F',
          weight: '75 kg',
          height: '170 cm'
        },
        labResults: {
          cholesterol: '220 mg/dL',
          glucose: '110 mg/dL',
          hemoglobin: '14.2 g/dL'
        },
        extractionHash: 'steg_' + Math.random().toString(16).substr(2, 16),
        extractionTimestamp: new Date().toISOString()
      };

      setExtractedData(mockExtractedData);
      setShowStegExtractor(true);
      console.log('✅ Steganographic data extracted successfully!');

    } catch (error) {
      console.error('❌ Extraction failed:', error);
    }

    setExtractingData(false);
  };

  // Handle credential verification
  const handleVerifyCredential = async (appointment) => {
    setVerifyingCredential(true);
    setSelectedAppointment(appointment);

    try {
      console.log('🔐 Verifying anonymous credential...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Update appointment status
      setAppointments(prev => prev.map(apt =>
        apt.id === appointment.id
          ? { ...apt, verificationStatus: 'VERIFIED', status: 'CONFIRMED' }
          : apt
      ));

      setCredentialVerified(true);
      setShowCredentialModal(true);
      console.log('✅ Anonymous credential verified successfully!');

    } catch (error) {
      console.error('❌ Credential verification failed:', error);
    }

    setVerifyingCredential(false);
  };

  // Handle emergency access
  const handleEmergencyAccess = (appointment) => {
    setSelectedAppointment(appointment);
    setShowEmergencyModal(true);
  };

  // Handle consultation completion
  const handleStartConsultation = (appointment) => {
    setSelectedAppointment(appointment);
    setConsultationData({
      diagnosis: '',
      symptoms: '',
      treatmentPlan: '',
      followUpRequired: false,
      followUpDate: '',
      prescriptions: [],
      attachedImages: [],
      patientConsent: {
        dataStorage: false,
        blockchainRecording: false,
        imageEmbedding: false
      }
    });
    setShowConsultationModal(true);
  };

  // Handle prescription management
  const handleAddPrescription = () => {
    setCurrentPrescription({
      medicine: null,
      quantity: '',
      dosage: '',
      frequency: '',
      instructions: '',
      duration: ''
    });
    setShowPrescriptionModal(true);
  };

  const handleSavePrescription = () => {
    if (!currentPrescription.medicine || !currentPrescription.quantity) {
      alert('Please select medicine and enter quantity');
      return;
    }

    const prescription = {
      id: Date.now(),
      medicine: currentPrescription.medicine,
      quantity: currentPrescription.quantity,
      dosage: currentPrescription.dosage,
      frequency: currentPrescription.frequency,
      instructions: currentPrescription.instructions,
      duration: currentPrescription.duration,
      timestamp: new Date().toISOString()
    };

    setConsultationData(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, prescription]
    }));

    setShowPrescriptionModal(false);
  };

  const handleRemovePrescription = (prescriptionId) => {
    setConsultationData(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.filter(p => p.id !== prescriptionId)
    }));
  };

  // Handle image attachment and steganographic embedding
  const handleImageAttachment = (files) => {
    const newImages = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      hasEmbeddedData: false,
      embeddedDataHash: null,
      timestamp: new Date().toISOString()
    }));

    setConsultationData(prev => ({
      ...prev,
      attachedImages: [...prev.attachedImages, ...newImages]
    }));
  };

  const handleStegEmbedding = (image) => {
    setSelectedImageForSteg(image);
    setStegContent('');
    setShowStegEmbedModal(true);
  };

  const handleEmbedContent = async () => {
    if (!stegContent.trim()) {
      alert('Please enter content to embed');
      return;
    }

    setEmbeddingInProgress(true);

    try {
      console.log('🔐 Starting steganographic embedding...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      const embeddedDataHash = 'steg_embed_' + Math.random().toString(16).substr(2, 16);

      // Update the image with embedded data info
      setConsultationData(prev => ({
        ...prev,
        attachedImages: prev.attachedImages.map(img =>
          img.id === selectedImageForSteg.id
            ? {
                ...img,
                hasEmbeddedData: true,
                embeddedDataHash,
                embeddedContent: stegContent,
                embeddedAt: new Date().toISOString()
              }
            : img
        )
      }));

      console.log('✅ Content successfully embedded in image!');
      setShowStegEmbedModal(false);

    } catch (error) {
      console.error('❌ Embedding failed:', error);
    }

    setEmbeddingInProgress(false);
  };

  // Handle medical record creation
  const handleCreateMedicalRecord = async () => {
    if (!consultationData.diagnosis.trim()) {
      alert('Please enter a diagnosis');
      return;
    }

    if (!consultationData.patientConsent.dataStorage) {
      alert('Patient consent for data storage is required');
      return;
    }

    setCreatingRecord(true);

    try {
      console.log('📝 Creating secure medical record...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (consultationData.patientConsent.blockchainRecording) {
        console.log('⛓️ Recording consultation on blockchain...');
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      if (consultationData.attachedImages.some(img => img.hasEmbeddedData)) {
        console.log('🖼️ Processing steganographic images...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Create new medical record
      const newRecord = {
        id: 'MR_' + Date.now(),
        recordId: 'MR_' + Date.now().toString().substr(-6),
        patientName: selectedAppointment.patientName,
        anonymousId: selectedAppointment.anonymousId,
        appointmentId: selectedAppointment.appointmentId,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().substr(0, 5),
        diagnosis: consultationData.diagnosis,
        symptoms: consultationData.symptoms,
        treatmentPlan: consultationData.treatmentPlan,
        prescriptions: consultationData.prescriptions,
        attachedImages: consultationData.attachedImages,
        followUpRequired: consultationData.followUpRequired,
        followUpDate: consultationData.followUpDate,
        doctorName: doctorInfo.name,
        securityLevel: selectedAppointment.securityLevel,
        blockchainTxId: 'tx_mr_' + Math.random().toString(16).substr(2, 16),
        patientConsent: consultationData.patientConsent,
        createdAt: new Date().toISOString(),
        status: 'COMPLETED'
      };

      // Update appointment status
      setAppointments(prev => prev.map(apt =>
        apt.id === selectedAppointment.id
          ? { ...apt, status: 'COMPLETED' }
          : apt
      ));

      console.log('✅ Medical record created successfully!');
      alert('Medical record created and securely stored!');
      setShowConsultationModal(false);

    } catch (error) {
      console.error('❌ Failed to create medical record:', error);
      alert('Failed to create medical record. Please try again.');
    }

    setCreatingRecord(false);
  };

  // Stats calculation
  const stats = {
    totalAppointments: appointments.length,
    anonymousAppointments: appointments.filter(a => a.securityLevel === 'HIGH_PRIVACY' || a.securityLevel === 'ANONYMOUS').length,
    stegDataCount: appointments.filter(a => a.hasStegData).length,
    emergencyAccessCount: appointments.filter(a => a.hasEmergencyAccess).length
  };

  return (
    <div className="doctor-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="doctor-info">
          <div className="doctor-avatar">
            {doctorInfo.name.charAt(3)}{doctorInfo.name.charAt(4)}
          </div>
          <div className="doctor-details">
            <h2>{doctorInfo.name}</h2>
            <p>{doctorInfo.specialization}</p>
            <div className="verification-badge">
              <CheckCircle size={14} />
              {doctorInfo.verificationLevel}
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button className="header-btn">
            <Bell size={16} />
          </button>
          <button className="header-btn">
            <Settings size={16} />
          </button>
          <button className="header-btn danger">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          <Calendar size={16} />
          Appointments
        </button>
        <button
          className={`tab-btn ${activeTab === 'blockchain' ? 'active' : ''}`}
          onClick={() => setActiveTab('blockchain')}
        >
          <Database size={16} />
          Blockchain
        </button>
        <button
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Shield size={16} />
          Security Center
        </button>
      </div>

      {/* Steganographic Data Extractor Modal */}
      {showStegExtractor && extractedData && (
        <>
          <div className="modal-backdrop" onClick={() => setShowStegExtractor(false)}></div>
          <div className="modal large">
            <div className="modal-header">
              <h3>Steganographic Medical Data</h3>
              <button className="modal-close" onClick={() => setShowStegExtractor(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="extraction-info">
                <div className="extraction-meta">
                  <div className="meta-item">
                    <label>Patient ID (Extracted):</label>
                    <span className="mono">{extractedData.patientId}</span>
                  </div>
                  <div className="meta-item">
                    <label>Extraction Hash:</label>
                    <span className="mono">{extractedData.extractionHash}</span>
                  </div>
                  <div className="meta-item">
                    <label>Extracted At:</label>
                    <span>{new Date(extractedData.extractionTimestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="medical-data-sections">
                  <div className="data-section">
                    <h4>Medical History</h4>
                    <ul className="history-list">
                      {extractedData.medicalHistory.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="data-section">
                    <h4>Current Vital Signs</h4>
                    <div className="vitals-grid">
                      {Object.entries(extractedData.vitalSigns).map(([key, value]) => (
                        <div key={key} className="vital-item">
                          <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</label>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="data-section">
                    <h4>Laboratory Results</h4>
                    <div className="lab-grid">
                      {Object.entries(extractedData.labResults).map(([key, value]) => (
                        <div key={key} className="lab-item">
                          <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setShowStegExtractor(false)}>
                Close
              </button>
              <button className="btn primary">
                <Download size={16} />
                Save to Secure Record
              </button>
            </div>
          </div>
        </>
      )}

      {/* Consultation Completion Modal */}
      {showConsultationModal && selectedAppointment && (
        <>
          <div className="modal-backdrop" onClick={() => setShowConsultationModal(false)}></div>
          <div className="modal extra-large">
            <div className="modal-header">
              <h3>Complete Consultation - {selectedAppointment.patientName}</h3>
              <button className="modal-close" onClick={() => setShowConsultationModal(false)}>×</button>
            </div>
            <div className="modal-content">
              {/* Patient Consent Section */}
              <div className="consent-section">
                <h4>Patient Consent & Privacy</h4>
                <div className="consent-grid">
                  <label className="consent-item">
                    <input
                      type="checkbox"
                      checked={consultationData.patientConsent.dataStorage}
                      onChange={(e) => setConsultationData(prev => ({
                        ...prev,
                        patientConsent: { ...prev.patientConsent, dataStorage: e.target.checked }
                      }))}
                    />
                    <div className="consent-details">
                      <span className="consent-title">Data Storage Consent *</span>
                      <span className="consent-desc">Patient consents to storing medical record data</span>
                    </div>
                  </label>

                  <label className="consent-item">
                    <input
                      type="checkbox"
                      checked={consultationData.patientConsent.blockchainRecording}
                      onChange={(e) => setConsultationData(prev => ({
                        ...prev,
                        patientConsent: { ...prev.patientConsent, blockchainRecording: e.target.checked }
                      }))}
                    />
                    <div className="consent-details">
                      <span className="consent-title">Blockchain Recording</span>
                      <span className="consent-desc">Record consultation hash on blockchain for verification</span>
                    </div>
                  </label>

                  <label className="consent-item">
                    <input
                      type="checkbox"
                      checked={consultationData.patientConsent.imageEmbedding}
                      onChange={(e) => setConsultationData(prev => ({
                        ...prev,
                        patientConsent: { ...prev.patientConsent, imageEmbedding: e.target.checked }
                      }))}
                    />
                    <div className="consent-details">
                      <span className="consent-title">Steganographic Embedding</span>
                      <span className="consent-desc">Allow hiding medical data in attached images</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Consultation Details */}
              <div className="consultation-form">
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Diagnosis *</label>
                    <textarea
                      value={consultationData.diagnosis}
                      onChange={(e) => setConsultationData(prev => ({ ...prev, diagnosis: e.target.value }))}
                      placeholder="Enter primary diagnosis and any secondary conditions..."
                      className="form-textarea"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Symptoms Observed</label>
                    <textarea
                      value={consultationData.symptoms}
                      onChange={(e) => setConsultationData(prev => ({ ...prev, symptoms: e.target.value }))}
                      placeholder="Document observed symptoms and patient complaints..."
                      className="form-textarea"
                      rows={2}
                    />
                  </div>
                  <div className="form-group">
                    <label>Treatment Plan</label>
                    <textarea
                      value={consultationData.treatmentPlan}
                      onChange={(e) => setConsultationData(prev => ({ ...prev, treatmentPlan: e.target.value }))}
                      placeholder="Recommended treatment approach and care plan..."
                      className="form-textarea"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Follow-up Section */}
                <div className="followup-section">
                  <label className="followup-checkbox">
                    <input
                      type="checkbox"
                      checked={consultationData.followUpRequired}
                      onChange={(e) => setConsultationData(prev => ({ ...prev, followUpRequired: e.target.checked }))}
                    />
                    <span>Follow-up appointment required</span>
                  </label>

                  {consultationData.followUpRequired && (
                    <div className="followup-date">
                      <label>Recommended Follow-up Date</label>
                      <input
                        type="date"
                        value={consultationData.followUpDate}
                        onChange={(e) => setConsultationData(prev => ({ ...prev, followUpDate: e.target.value }))}
                        className="form-input"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  )}
                </div>

                {/* Prescriptions Section */}
                <div className="prescriptions-section">
                  <div className="section-header">
                    <h4>Prescriptions</h4>
                    <button
                      type="button"
                      className="btn secondary small"
                      onClick={handleAddPrescription}
                    >
                      <Plus size={16} />
                      Add Medicine
                    </button>
                  </div>

                  {consultationData.prescriptions.length > 0 ? (
                    <div className="prescriptions-list">
                      {consultationData.prescriptions.map(prescription => (
                        <div key={prescription.id} className="prescription-card">
                          <div className="prescription-info">
                            <div className="medicine-name">{prescription.medicine.name}</div>
                            <div className="prescription-details">
                              <span>{prescription.dosage} - {prescription.quantity}</span>
                              <span>Frequency: {prescription.frequency}</span>
                              {prescription.duration && <span>Duration: {prescription.duration}</span>}
                            </div>
                            {prescription.instructions && (
                              <div className="prescription-instructions">
                                Instructions: {prescription.instructions}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            className="remove-prescription"
                            onClick={() => handleRemovePrescription(prescription.id)}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-prescriptions">
                      <FileText size={24} />
                      <span>No prescriptions added yet</span>
                    </div>
                  )}
                </div>

                {/* Medical Images Section */}
                <div className="images-section">
                  <div className="section-header">
                    <h4>Medical Images</h4>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageAttachment(e.target.files)}
                      className="hidden-input"
                      id="medical-images-upload"
                    />
                    <label htmlFor="medical-images-upload" className="btn secondary small">
                      <Image size={16} />
                      Attach Images
                    </label>
                  </div>

                  {consultationData.attachedImages.length > 0 ? (
                    <div className="images-grid">
                      {consultationData.attachedImages.map(image => (
                        <div key={image.id} className="image-card">
                          <img src={image.url} alt={image.name} />
                          <div className="image-info">
                            <span className="image-name">{image.name}</span>
                            {image.hasEmbeddedData ? (
                              <div className="embedded-indicator">
                                <Lock size={12} />
                                <span>Data Embedded</span>
                              </div>
                            ) : (
                              consultationData.patientConsent.imageEmbedding && (
                                <button
                                  type="button"
                                  className="embed-btn"
                                  onClick={() => handleStegEmbedding(image)}
                                >
                                  <Lock size={12} />
                                  Embed Data
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-images">
                      <Image size={24} />
                      <span>No medical images attached yet</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setShowConsultationModal(false)}>
                Cancel
              </button>
              <button
                className="btn primary"
                onClick={handleCreateMedicalRecord}
                disabled={creatingRecord || !consultationData.diagnosis.trim() || !consultationData.patientConsent.dataStorage}
              >
                {creatingRecord ? (
                  <>
                    <div className="spinner" />
                    Creating Record...
                  </>
                ) : (
                  <>
                    <FileText size={16} />
                    Create Medical Record
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <>
          <div className="modal-backdrop" onClick={() => setShowPrescriptionModal(false)}></div>
          <div className="modal medium">
            <div className="modal-header">
              <h3>Add Prescription</h3>
              <button className="modal-close" onClick={() => setShowPrescriptionModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="prescription-form">
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Medicine *</label>
                    <select
                      value={currentPrescription.medicine?.id || ''}
                      onChange={(e) => {
                        const medicine = medicineDatabase.find(m => m.id === e.target.value);
                        setCurrentPrescription(prev => ({ ...prev, medicine }));
                      }}
                      className="form-select"
                    >
                      <option value="">Select Medicine</option>
                      {medicineDatabase.map(medicine => (
                        <option key={medicine.id} value={medicine.id}>
                          {medicine.name} ({medicine.category})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Dosage *</label>
                    <select
                      value={currentPrescription.dosage}
                      onChange={(e) => setCurrentPrescription(prev => ({ ...prev, dosage: e.target.value }))}
                      className="form-select"
                      disabled={!currentPrescription.medicine}
                    >
                      <option value="">Select Dosage</option>
                      {currentPrescription.medicine?.commonDosages.map(dosage => (
                        <option key={dosage} value={dosage}>{dosage}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Quantity *</label>
                    <input
                      type="text"
                      value={currentPrescription.quantity}
                      onChange={(e) => setCurrentPrescription(prev => ({ ...prev, quantity: e.target.value }))}
                      placeholder="e.g., 30 tablets"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Frequency</label>
                    <select
                      value={currentPrescription.frequency}
                      onChange={(e) => setCurrentPrescription(prev => ({ ...prev, frequency: e.target.value }))}
                      className="form-select"
                    >
                      <option value="">Select Frequency</option>
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">Three times daily</option>
                      <option value="Four times daily">Four times daily</option>
                      <option value="As needed">As needed</option>
                      <option value="Every 4 hours">Every 4 hours</option>
                      <option value="Every 6 hours">Every 6 hours</option>
                      <option value="Every 8 hours">Every 8 hours</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Duration</label>
                    <select
                      value={currentPrescription.duration}
                      onChange={(e) => setCurrentPrescription(prev => ({ ...prev, duration: e.target.value }))}
                      className="form-select"
                    >
                      <option value="">Select Duration</option>
                      <option value="3 days">3 days</option>
                      <option value="5 days">5 days</option>
                      <option value="7 days">7 days</option>
                      <option value="10 days">10 days</option>
                      <option value="14 days">14 days</option>
                      <option value="30 days">30 days</option>
                      <option value="60 days">60 days</option>
                      <option value="90 days">90 days</option>
                      <option value="Ongoing">Ongoing</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Special Instructions</label>
                    <textarea
                      value={currentPrescription.instructions}
                      onChange={(e) => setCurrentPrescription(prev => ({ ...prev, instructions: e.target.value }))}
                      placeholder="e.g., Take with food, avoid alcohol, etc."
                      className="form-textarea"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setShowPrescriptionModal(false)}>
                Cancel
              </button>
              <button className="btn primary" onClick={handleSavePrescription}>
                Add Prescription
              </button>
            </div>
          </div>
        </>
      )}

      {/* Steganographic Embedding Modal */}
      {showStegEmbedModal && selectedImageForSteg && (
        <>
          <div className="modal-backdrop" onClick={() => setShowStegEmbedModal(false)}></div>
          <div className="modal large">
            <div className="modal-header">
              <h3>Embed Medical Data in Image</h3>
              <button className="modal-close" onClick={() => setShowStegEmbedModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="steg-embed-content">
                <div className="image-preview">
                  <img src={selectedImageForSteg.url} alt="Selected for embedding" />
                  <div className="image-details">
                    <span className="image-name">{selectedImageForSteg.name}</span>
                    <span className="file-size">{(selectedImageForSteg.file.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>

                <div className="embed-form">
                  <div className="security-notice">
                    <Lock size={20} />
                    <div>
                      <h4>Secure Steganographic Embedding</h4>
                      <p>Medical data will be encrypted and hidden within the image pixels. Only authorized medical staff can extract this information.</p>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Medical Content to Embed</label>
                    <textarea
                      value={stegContent}
                      onChange={(e) => setStegContent(e.target.value)}
                      placeholder="Enter sensitive medical information to hide in this image (e.g., additional symptoms, patient history, lab results, etc.)"
                      className="form-textarea"
                      rows={6}
                    />
                  </div>

                  <div className="content-stats">
                    <div className="stat-item">
                      <label>Characters:</label>
                      <span>{stegContent.length}/2000</span>
                    </div>
                    <div className="stat-item">
                      <label>Encryption:</label>
                      <span className="encryption-badge">AES-256</span>
                    </div>
                    <div className="stat-item">
                      <label>Steganography:</label>
                      <span className="steg-badge">LSB Algorithm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setShowStegEmbedModal(false)}>
                Cancel
              </button>
              <button
                className="btn primary"
                onClick={handleEmbedContent}
                disabled={embeddingInProgress || !stegContent.trim()}
              >
                {embeddingInProgress ? (
                  <>
                    <div className="spinner" />
                    Embedding...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Embed Content
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Credential Verification Modal */}
      {showCredentialModal && (
        <>
          <div className="modal-backdrop" onClick={() => setShowCredentialModal(false)}></div>
          <div className="modal medium">
            <div className="modal-header">
              <h3>Anonymous Credential Verification</h3>
              <button className="modal-close" onClick={() => setShowCredentialModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="verification-result">
                <CheckCircle size={48} className="success-icon" />
                <h4>Credential Successfully Verified</h4>
                <p>The anonymous credential has been cryptographically verified using blind signature protocols.</p>

                <div className="verification-details">
                  <div className="detail-item">
                    <label>Anonymous ID:</label>
                    <span className="mono">{selectedAppointment?.anonymousId}</span>
                  </div>
                  <div className="detail-item">
                    <label>Verification Method:</label>
                    <span>Blind Signature RSA-2048</span>
                  </div>
                  <div className="detail-item">
                    <label>Trust Level:</label>
                    <span className="trust-level high">HIGH TRUST</span>
                  </div>
                  <div className="detail-item">
                    <label>Blockchain TX:</label>
                    <span className="mono">{selectedAppointment?.blockchainTxId}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn primary" onClick={() => setShowCredentialModal(false)}>
                Proceed with Appointment
              </button>
            </div>
          </div>
        </>
      )}

      {/* Emergency Access Modal */}
      {showEmergencyModal && selectedAppointment?.emergencyData && (
        <>
          <div className="modal-backdrop" onClick={() => setShowEmergencyModal(false)}></div>
          <div className="modal large emergency">
            <div className="modal-header emergency-header">
              <h3>
                <AlertTriangle size={20} />
                Emergency Medical Access
              </h3>
              <button className="modal-close" onClick={() => setShowEmergencyModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="emergency-warning">
                <AlertTriangle size={24} />
                <p>This information is only accessible during medical emergencies when patient consent cannot be obtained.</p>
              </div>

              <div className="emergency-data">
                <div className="emergency-section">
                  <h4>Critical Information</h4>
                  <div className="emergency-grid">
                    <div className="emergency-item critical">
                      <label>Blood Type:</label>
                      <span>{selectedAppointment.emergencyData.bloodType}</span>
                    </div>
                    <div className="emergency-item critical">
                      <label>Emergency Contact:</label>
                      <span>{selectedAppointment.emergencyData.emergencyContact}</span>
                    </div>
                  </div>
                </div>

                <div className="emergency-section">
                  <h4>Known Allergies</h4>
                  <div className="allergy-list">
                    {selectedAppointment.emergencyData.allergies.map((allergy, index) => (
                      <span key={index} className="allergy-tag">{allergy}</span>
                    ))}
                  </div>
                </div>

                <div className="emergency-section">
                  <h4>Current Medications</h4>
                  <div className="medication-list">
                    {selectedAppointment.emergencyData.currentMedications.map((med, index) => (
                      <div key={index} className="medication-item">{med}</div>
                    ))}
                  </div>
                </div>

                <div className="emergency-section">
                  <h4>Chronic Conditions</h4>
                  <div className="condition-list">
                    {selectedAppointment.emergencyData.chronicConditions.map((condition, index) => (
                      <div key={index} className="condition-item">{condition}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setShowEmergencyModal(false)}>
                Close
              </button>
              <button className="btn danger">
                <AlertTriangle size={16} />
                Log Emergency Access
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === 'appointments' && (
        <div className="appointments-section">
          {/* Security Stats */}
          <div className="security-stats">
            <div className="stat-card total">
              <div className="stat-icon">
                <Calendar size={24} />
              </div>
              <div className="stat-content">
                <h3>{stats.totalAppointments}</h3>
                <p>Total Appointments</p>
              </div>
            </div>
            <div className="stat-card anonymous">
              <div className="stat-icon">
                <EyeOff size={24} />
              </div>
              <div className="stat-content">
                <h3>{stats.anonymousAppointments}</h3>
                <p>Anonymous Patients</p>
              </div>
            </div>
            <div className="stat-card steganographic">
              <div className="stat-icon">
                <Lock size={24} />
              </div>
              <div className="stat-content">
                <h3>{stats.stegDataCount}</h3>
                <p>Steganographic Data</p>
              </div>
            </div>
            <div className="stat-card emergency">
              <div className="stat-icon">
                <AlertTriangle size={24} />
              </div>
              <div className="stat-content">
                <h3>{stats.emergencyAccessCount}</h3>
                <p>Emergency Access</p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="appointments-controls">
            <div className="search-section">
              <div className="search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search appointments, patient names, or IDs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PENDING_VERIFICATION">Pending Verification</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          {/* Appointments List */}
          <div className="appointments-list">
            {filteredAppointments.map(appointment => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-header">
                  <div className="appointment-time">
                    <Clock size={16} />
                    <span>{appointment.time}</span>
                    <span className="duration">({appointment.duration}min)</span>
                  </div>
                  <div className="appointment-badges">
                    <div className={getSecurityBadge(appointment.securityLevel)}>
                      {getSecurityIcon(appointment.securityLevel)}
                      <span>{appointment.securityLevel.replace('_', ' ')}</span>
                    </div>
                    <div className={getUrgencyBadge(appointment.urgencyLevel)}>
                      {appointment.urgencyLevel}
                    </div>
                    <div className={getStatusBadge(appointment.status)}>
                      {appointment.status.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <div className="appointment-content">
                  <div className="patient-info">
                    <div className="patient-details">
                      <h4>{appointment.patientName}</h4>
                      {appointment.anonymousId && (
                        <p className="anonymous-id">ID: {appointment.anonymousId}</p>
                      )}
                      <p className="appointment-purpose">{appointment.purpose}</p>
                    </div>

                    {appointment.patientImage && (
                      <div className="patient-image-preview">
                        <img src={appointment.patientImage} alt="Patient provided image" />
                        {appointment.hasStegData && (
                          <div className="steg-indicator">
                            <Lock size={12} />
                            Hidden Data
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="appointment-actions">
                    {appointment.verificationStatus === 'PENDING' && (
                      <button
                        className="action-btn verify"
                        onClick={() => handleVerifyCredential(appointment)}
                        disabled={verifyingCredential}
                      >
                        {verifyingCredential ? (
                          <div className="spinner" />
                        ) : (
                          <UserCheck size={16} />
                        )}
                        Verify Credential
                      </button>
                    )}

                    {appointment.hasStegData && (
                      <button
                        className="action-btn extract"
                        onClick={() => handleExtractStegData(appointment)}
                        disabled={extractingData}
                      >
                        {extractingData ? (
                          <div className="spinner" />
                        ) : (
                          <Scan size={16} />
                        )}
                        Extract Data
                      </button>
                    )}

                    {appointment.hasEmergencyAccess && (
                      <button
                        className="action-btn emergency"
                        onClick={() => handleEmergencyAccess(appointment)}
                      >
                        <AlertTriangle size={16} />
                        Emergency Access
                      </button>
                    )}

                    <button
                      className="action-btn primary"
                      onClick={() => handleStartConsultation(appointment)}
                    >
                      <Activity size={16} />
                      Start Consultation
                    </button>
                  </div>
                </div>

                <div className="appointment-footer">
                  <div className="blockchain-info">
                    <Database size={12} />
                    <span>TX: {appointment.blockchainTxId}</span>
                    <div className={`verification-status ${appointment.verificationStatus.toLowerCase()}`}>
                      {appointment.verificationStatus === 'VERIFIED' ?
                        <CheckCircle size={12} /> :
                        <Clock size={12} />
                      }
                      {appointment.verificationStatus}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredAppointments.length === 0 && (
              <div className="no-appointments">
                <Calendar size={48} />
                <p>No appointments found</p>
                <span>Try adjusting your search or filter criteria</span>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'blockchain' && (
        <div className="blockchain-section">
          <div className="blockchain-header">
            <h3>Blockchain Transaction Monitor</h3>
            <button className="btn secondary">
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          <div className="blockchain-stats">
            <div className="blockchain-card">
              <h4>Doctor Verification</h4>
              <div className="verification-item">
                <label>License ID:</label>
                <span className="mono">{doctorInfo.licenseId}</span>
              </div>
              <div className="verification-item">
                <label>Blockchain Address:</label>
                <span className="mono">{doctorInfo.blockchainAddress}</span>
              </div>
              <div className="verification-item">
                <label>Verification Level:</label>
                <span className="verification-badge">{doctorInfo.verificationLevel}</span>
              </div>
            </div>
          </div>

          <div className="transaction-list">
            <h4>Recent Transactions</h4>
            {appointments.map(apt => (
              <div key={apt.id} className="transaction-item">
                <div className="tx-info">
                  <span className="tx-id">{apt.blockchainTxId}</span>
                  <span className="tx-type">Appointment Booking</span>
                </div>
                <div className="tx-details">
                  <span>{apt.date} {apt.time}</span>
                  <div className={`tx-status ${apt.verificationStatus.toLowerCase()}`}>
                    {apt.verificationStatus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="security-section">
          <div className="security-header">
            <h3>Security Center</h3>
            <div className="security-status">
              <CheckCircle size={16} />
              All Systems Secure
            </div>
          </div>

          <div className="security-features">
            <div className="feature-card">
              <div className="feature-icon">
                <EyeOff size={24} />
              </div>
              <div className="feature-content">
                <h4>Anonymous Patient System</h4>
                <p>Blind signature verification for complete patient anonymity</p>
                <div className="feature-stats">
                  <span>{stats.anonymousAppointments} active anonymous patients</span>
                </div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Lock size={24} />
              </div>
              <div className="feature-content">
                <h4>Steganographic Data Storage</h4>
                <p>Medical history hidden in patient-provided images</p>
                <div className="feature-stats">
                  <span>{stats.stegDataCount} records with hidden data</span>
                </div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Database size={24} />
              </div>
              <div className="feature-content">
                <h4>Blockchain Verification</h4>
                <p>R3 Corda blockchain for immutable appointment records</p>
                <div className="feature-stats">
                  <span>100% of appointments blockchain-verified</span>
                </div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <AlertTriangle size={24} />
              </div>
              <div className="feature-content">
                <h4>Emergency Access Protocol</h4>
                <p>Critical patient information for emergency situations</p>
                <div className="feature-stats">
                  <span>{stats.emergencyAccessCount} patients with emergency data</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .doctor-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .dashboard-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          padding: 24px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .doctor-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .doctor-avatar {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 18px;
        }

        .doctor-details h2 {
          margin: 0 0 4px 0;
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
        }

        .doctor-details p {
          margin: 0 0 8px 0;
          color: #64748b;
          font-size: 16px;
        }

        .verification-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .header-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          background: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          color: #64748b;
        }

        .header-btn:hover {
          background: rgba(255, 255, 255, 1);
          border-color: #667eea;
          color: #667eea;
        }

        .header-btn.danger:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        .dashboard-tabs {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          padding: 0 32px;
          display: flex;
          gap: 8px;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 20px;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .tab-btn:hover {
          color: #667eea;
        }

        .tab-btn.active {
          color: #667eea;
          border-bottom-color: #667eea;
        }

        .appointments-section {
          padding: 32px;
        }

        .security-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: transform 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-card.total .stat-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .stat-card.anonymous .stat-icon {
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        }

        .stat-card.steganographic .stat-icon {
          background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
        }

        .stat-card.emergency .stat-icon {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .stat-content h3 {
          margin: 0 0 4px 0;
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }

        .stat-content p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .appointments-controls {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .search-section {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .search-box {
          position: relative;
          flex: 1;
          max-width: 500px;
        }

        .search-box svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }

        .search-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .filter-select {
          padding: 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          cursor: pointer;
        }

        .appointments-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .appointment-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.2s ease;
        }

        .appointment-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .appointment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .appointment-time {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-weight: 500;
        }

        .duration {
          color: #94a3b8;
          font-size: 12px;
        }

        .appointment-badges {
          display: flex;
          gap: 8px;
        }

        .security-badge,
        .urgency-badge,
        .status-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .security-badge.high-privacy {
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          color: white;
        }

        .security-badge.anonymous {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
        }

        .security-badge.steganographic {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .security-badge.standard {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .urgency-badge.emergency {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .urgency-badge.urgent {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .urgency-badge.routine {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
        }

        .status-badge.confirmed {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
        }

        .status-badge.pending {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .status-badge.progress {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .status-badge.completed {
          background: rgba(148, 163, 184, 0.1);
          color: #94a3b8;
        }

        .appointment-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 20px;
        }

        .patient-info {
          display: flex;
          gap: 20px;
          flex: 1;
        }

        .patient-details h4 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .anonymous-id {
          margin: 0 0 8px 0;
          font-family: monospace;
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          display: inline-block;
        }

        .appointment-purpose {
          margin: 0;
          color: #64748b;
          line-height: 1.5;
        }

        .patient-image-preview {
          position: relative;
          width: 120px;
          height: 90px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .patient-image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .steg-indicator {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(245, 158, 11, 0.9);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .appointment-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          font-size: 13px;
          white-space: nowrap;
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .action-btn.primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .action-btn.verify {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .action-btn.verify:hover:not(:disabled) {
          background: #3b82f6;
          color: white;
        }

        .action-btn.extract {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .action-btn.extract:hover:not(:disabled) {
          background: #f59e0b;
          color: white;
        }

        .action-btn.emergency {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .action-btn.emergency:hover:not(:disabled) {
          background: #ef4444;
          color: white;
        }

        .appointment-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid rgba(226, 232, 240, 0.6);
        }

        .blockchain-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 12px;
        }

        .blockchain-info span {
          font-family: monospace;
        }

        .verification-status {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 500;
        }

        .verification-status.verified {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
        }

        .verification-status.pending {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .no-appointments {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .no-appointments svg {
          color: #94a3b8;
          margin-bottom: 16px;
        }

        .no-appointments span {
          color: #94a3b8;
          font-size: 14px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 2px solid currentColor;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Modal Styles */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          z-index: 10000;
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.2);
        }

        .modal.medium {
          max-width: 500px;
        }

        .modal.large {
          max-width: 800px;
        }

        .modal.extra-large {
          max-width: 1000px;
        }

        .modal.emergency {
          border-color: rgba(239, 68, 68, 0.3);
        }

        .modal-header {
          padding: 24px 32px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          margin-bottom: 24px;
          padding-bottom: 16px;
        }

        .modal-header.emergency-header {
          border-color: rgba(239, 68, 68, 0.3);
        }

        .modal-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
          transition: color 0.2s ease;
        }

        .modal-close:hover {
          color: #ef4444;
        }

        .modal-content {
          padding: 0 32px 32px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 24px 32px;
          border-top: 1px solid rgba(226, 232, 240, 0.6);
          background: rgba(248, 250, 252, 0.5);
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          font-size: 14px;
        }

        .btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn.secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #64748b;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .btn.secondary:hover {
          background: rgba(255, 255, 255, 1);
          border-color: #667eea;
          color: #667eea;
        }

        .btn.danger {
          background: #ef4444;
          color: white;
        }

        .btn.danger:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        /* Extraction Modal Styles */
        .extraction-info {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .extraction-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .meta-item label {
          font-weight: 500;
          color: #64748b;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mono {
          font-family: monospace;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 4px 6px;
          border-radius: 4px;
          font-size: 12px;
        }

        .medical-data-sections {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .data-section {
          background: rgba(248, 250, 252, 0.8);
          border-radius: 12px;
          padding: 20px;
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .data-section h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .history-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .history-list li {
          padding: 8px 0;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          color: #374151;
        }

        .history-list li:last-child {
          border-bottom: none;
        }

        .vitals-grid,
        .lab-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
        }

        .vital-item,
        .lab-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .vital-item label,
        .lab-item label {
          font-weight: 500;
          color: #64748b;
          font-size: 12px;
        }

        .vital-item span,
        .lab-item span {
          color: #1e293b;
          font-weight: 500;
        }

        /* Verification Modal Styles */
        .verification-result {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .success-icon {
          color: #16a34a;
          margin: 0 auto;
        }

        .verification-result h4 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .verification-result p {
          margin: 0;
          color: #64748b;
          line-height: 1.6;
        }

        .verification-details {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          text-align: left;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 8px;
        }

        .detail-item label {
          font-weight: 500;
          color: #64748b;
        }

        .trust-level.high {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 500;
          font-size: 12px;
        }

        /* Emergency Modal Styles */
        .emergency-warning {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid rgba(239, 68, 68, 0.2);
          margin-bottom: 24px;
        }

        .emergency-data {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .emergency-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .emergency-section h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .emergency-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .emergency-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 8px;
        }

        .emergency-item.critical {
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .emergency-item label {
          font-weight: 500;
          color: #64748b;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .emergency-item span {
          color: #1e293b;
          font-weight: 500;
        }

        .allergy-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .allergy-tag {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .medication-list,
        .condition-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .medication-item,
        .condition-item {
          background: rgba(248, 250, 252, 0.8);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        /* Blockchain Section */
        .blockchain-section {
          padding: 32px;
        }

        .blockchain-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .blockchain-header h3 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
        }

        .blockchain-stats {
          margin-bottom: 32px;
        }

        .blockchain-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 24px;
        }

        .blockchain-card h4 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .verification-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
        }

        .verification-item:last-child {
          border-bottom: none;
        }

        .verification-item label {
          font-weight: 500;
          color: #64748b;
        }

        .verification-badge {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .transaction-list {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 24px;
        }

        .transaction-list h4 {
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .transaction-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
        }

        .transaction-item:last-child {
          border-bottom: none;
        }

        .tx-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .tx-id {
          font-family: monospace;
          font-size: 12px;
          color: #667eea;
          font-weight: 500;
        }

        .tx-type {
          color: #64748b;
          font-size: 14px;
        }

        .tx-details {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .tx-status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .tx-status.verified {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
        }

        .tx-status.pending {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        /* Security Section */
        .security-section {
          padding: 32px;
        }

        .security-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .security-header h3 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
        }

        .security-status {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 500;
        }

        .security-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          gap: 16px;
          transition: transform 0.2s ease;
        }

        .feature-card:hover {
          transform: translateY(-2px);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .feature-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .feature-content h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .feature-content p {
          margin: 0;
          color: #64748b;
          line-height: 1.5;
        }

        .feature-stats {
          margin-top: 8px;
        }

        .feature-stats span {
          color: #667eea;
          font-size: 12px;
          font-weight: 500;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .dashboard-header {
            padding: 16px;
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .dashboard-tabs {
            padding: 0 16px;
            overflow-x: auto;
          }

          .appointments-section,
          .blockchain-section,
          .security-section {
            padding: 16px;
          }

          .security-stats {
            grid-template-columns: 1fr;
          }

          .search-section {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            max-width: none;
          }

          .appointment-content {
            flex-direction: column;
            gap: 16px;
          }

          .patient-info {
            flex-direction: column;
            gap: 12px;
          }

          .appointment-actions {
            justify-content: stretch;
          }

          .action-btn {
            flex: 1;
            justify-content: center;
          }

          .appointment-footer {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .modal {
            width: 95%;
            height: 90vh;
            max-height: 90vh;
          }

          .modal-header,
          .modal-content,
          .modal-actions {
            padding-left: 20px;
            padding-right: 20px;
          }

          .modal-actions {
            flex-direction: column-reverse;
          }

          .modal-actions .btn {
            width: 100%;
            justify-content: center;
          }

          .security-features {
            grid-template-columns: 1fr;
          }

          .extraction-meta,
          .emergency-grid,
          .vitals-grid,
          .lab-grid {
            grid-template-columns: 1fr;
          }

          .consent-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .prescriptions-list {
            grid-template-columns: 1fr;
          }

          .images-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }

          .steg-embed-content {
            flex-direction: column;
          }

          .image-preview img {
            max-width: 100%;
          }
        }

        /* Consultation Modal Styles */
        .consent-section {
          background: rgba(59, 130, 246, 0.05);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
        }

        .consent-section h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .consent-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }

        .consent-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          padding: 16px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 8px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          transition: all 0.2s ease;
        }

        .consent-item:hover {
          background: rgba(255, 255, 255, 1);
          border-color: #3b82f6;
        }

        .consent-item input[type="checkbox"] {
          margin-top: 2px;
          width: 16px;
          height: 16px;
        }

        .consent-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .consent-title {
          font-weight: 500;
          color: #1e293b;
          font-size: 14px;
        }

        .consent-desc {
          color: #64748b;
          font-size: 12px;
          line-height: 1.4;
        }

        .consultation-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        .form-input, .form-select, .form-textarea {
          padding: 12px 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .followup-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 20px;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 8px;
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .followup-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 500;
          color: #374151;
        }

        .followup-checkbox input[type="checkbox"] {
          width: 16px;
          height: 16px;
        }

        .followup-date {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-width: 300px;
        }

        .followup-date label {
          font-weight: 500;
          color: #64748b;
          font-size: 13px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .prescriptions-section {
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.5);
        }

        .prescriptions-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }

        .prescription-card {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 8px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .prescription-info {
          flex: 1;
        }

        .medicine-name {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .prescription-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 8px;
        }

        .prescription-details span {
          color: #64748b;
          font-size: 13px;
        }

        .prescription-instructions {
          color: #374151;
          font-size: 12px;
          font-style: italic;
          background: rgba(248, 250, 252, 0.8);
          padding: 8px;
          border-radius: 4px;
        }

        .remove-prescription {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .remove-prescription:hover {
          background: #ef4444;
          color: white;
        }

        .no-prescriptions, .no-images {
          text-align: center;
          padding: 40px 20px;
          color: #64748b;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .no-prescriptions svg, .no-images svg {
          color: #94a3b8;
        }

        .images-section {
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.5);
        }

        .images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .image-card {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.2s ease;
        }

        .image-card:hover {
          transform: translateY(-2px);
        }

        .image-card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }

        .image-info {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .image-name {
          font-size: 12px;
          color: #64748b;
          word-break: break-all;
        }

        .embedded-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
        }

        .embed-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          border: 1px solid rgba(102, 126, 234, 0.2);
          padding: 6px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .embed-btn:hover {
          background: #667eea;
          color: white;
        }

        .hidden-input {
          display: none;
        }

        /* Prescription Modal Styles */
        .prescription-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Steganographic Embedding Modal Styles */
        .steg-embed-content {
          display: flex;
          gap: 24px;
        }

        .image-preview {
          flex: 1;
          max-width: 300px;
        }

        .image-preview img {
          width: 100%;
          border-radius: 8px;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .image-details {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .image-name {
          font-weight: 500;
          color: #1e293b;
          font-size: 14px;
        }

        .file-size {
          color: #64748b;
          font-size: 12px;
        }

        .embed-form {
          flex: 2;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .security-notice {
          display: flex;
          gap: 12px;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 8px;
          padding: 16px;
          color: #f59e0b;
        }

        .security-notice h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: #f59e0b;
        }

        .security-notice p {
          margin: 0;
          font-size: 12px;
          line-height: 1.4;
          color: #92400e;
        }

        .content-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 8px;
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .stat-item label {
          font-size: 11px;
          color: #64748b;
          font-weight: 500;
        }

        .stat-item span {
          font-size: 12px;
          font-weight: 500;
          color: #1e293b;
        }

        .encryption-badge {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .steg-badge {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          padding: 2px 6px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default SecureDoctorDashboard;