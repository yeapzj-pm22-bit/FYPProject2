import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Trash2, Filter, ChevronDown, ChevronUp, FileText, Clock, CheckCircle, AlertCircle, Eye, Download, RefreshCw, X, Shield, Lock, Database, Key } from 'lucide-react';

// Mock API service for demo
const ApiService = {
  createSecureRecord: async (formData) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            recordId: `MR${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
            blockchain: {
              blockHash: `0x${Math.random().toString(16).substr(2, 64)}`,
              transactionId: `tx_${Math.random().toString(16).substr(2, 32)}`
            },
            anonymousAccess: {
              blindSignature: `bs_${Math.random().toString(16).substr(2, 32)}`
            },
            steganography: formData.get('images') ? [
              { extractionKey: `steg_${Math.random().toString(16).substr(2, 16)}` }
            ] : [],
            securityFeatures: {
              anonymous: JSON.parse(formData.get('securityOptions')).useAnonymousAccess,
              steganography: JSON.parse(formData.get('securityOptions')).enableSteganography,
              blockchain: JSON.parse(formData.get('securityOptions')).storeOnBlockchain
            }
          }
        });
      }, 1500);
    });
  },
  verifyRecordIntegrity: async (recordId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          verification: {
            isValid: Math.random() > 0.2, // 80% chance of being valid
            lastModified: new Date().toISOString(),
            blockHeight: Math.floor(Math.random() * 100000)
          }
        });
      }, 1000);
    });
  }
};

const SecureMedicalRecordManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Security-related states
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityOperation, setSecurityOperation] = useState('');
  const [blockchainStatus, setBlockchainStatus] = useState({});
  const [anonymousRecordData, setAnonymousRecordData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Enhanced form states with security features
  const [formData, setFormData] = useState({
    patient: '',
    diagnosis: '',
    prescriptions: [],
    images: [],
    // Security options
    useAnonymousAccess: false,
    enableSteganography: false,
    storeOnBlockchain: true,
    emergencyData: {
      bloodType: '',
      allergies: [],
      emergencyContact: '',
      criticalMedications: []
    }
  });

  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [instruction, setInstruction] = useState('');
  const [refillChecked, setRefillChecked] = useState(false);
  const [refillCount, setRefillCount] = useState('');
  const [timeUnit, setTimeUnit] = useState('');
  const [duration, setDuration] = useState('');
  const [editingPrescriptionIndex, setEditingPrescriptionIndex] = useState(null);
  const [fileList, setFileList] = useState([]);

  const medicineOptions = [
    { label: 'Paracetamol', value: 'paracetamol' },
    { label: 'Ibuprofen', value: 'ibuprofen' },
    { label: 'Amoxicillin', value: 'amoxicillin' },
    { label: 'Metformin', value: 'metformin' },
    { label: 'Aspirin', value: 'aspirin' },
    { label: 'Lisinopril', value: 'lisinopril' },
    { label: 'Simvastatin', value: 'simvastatin' },
    { label: 'Omeprazole', value: 'omeprazole' }
  ];

  const patientOptions = [
    { label: 'John Doe', value: 'john' },
    { label: 'Jane Smith', value: 'jane' },
    { label: 'Ahmad Rahman', value: 'ahmad' },
    { label: 'Sarah Wilson', value: 'sarah' },
    { label: 'Michael Chen', value: 'michael' },
    { label: 'Emily Johnson', value: 'emily' }
  ];

  // Enhanced medical records with blockchain integration
  const [records, setRecords] = useState([
    {
      id: 'MR001',
      recordId: 'MR001',
      patientName: 'Yeap Zi Jia',
      patientId: 'P1234',
      date: '2024-07-27',
      diagnosis: 'Flu with mild symptoms, prescribed Paracetamol for fever and body aches',
      prescriptions: ['Paracetamol 500mg - Take twice daily', 'Vitamin C - Once daily'],
      images: ['https://via.placeholder.com/150x150/f0f0f0/666?text=Medical+Image'],
      status: 'Pending',
      doctorName: 'Dr. Ahmad Rahman',
      createdAt: '2024-07-27',
      lastModified: '2024-07-27',
      // Security metadata
      blockchainHash: 'bc_hash_001',
      isAnonymous: false,
      hasSteganography: false,
      securityLevel: 'Standard'
    },
    {
      id: 'MR002',
      recordId: 'MR002',
      patientName: 'Anonymous Patient',
      patientId: 'ANON_001',
      date: '2024-07-20',
      diagnosis: 'Confidential medical consultation with privacy protection',
      prescriptions: ['Prescribed medications (encrypted)'],
      images: ['https://via.placeholder.com/150x150/4ade80/fff?text=Secured+Image'],
      status: 'Completed',
      doctorName: 'Dr. Confidential',
      createdAt: '2024-07-20',
      lastModified: '2024-07-21',
      // Security metadata
      blockchainHash: 'bc_hash_002',
      isAnonymous: true,
      hasSteganography: true,
      securityLevel: 'High Privacy'
    }
  ]);

  // Enhanced form submission with security features
  const handleSecureSubmitForm = async () => {
    if (!formData.patient || !formData.diagnosis) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🔐 Starting secure medical record creation...');

      // Prepare form data for submission
      const submitFormData = new FormData();

      // Basic record data
      const recordData = {
        recordId: `MR${String(records.length + 1).padStart(3, '0')}`,
        patientId: formData.useAnonymousAccess ?
          `ANON_${Math.floor(Math.random() * 9999)}` :
          `P${Math.floor(Math.random() * 9999)}`,
        patientName: formData.useAnonymousAccess ? 'Anonymous Patient' : formData.patient,
        diagnosis: formData.diagnosis,
        prescriptions: formData.prescriptions.map(p =>
          `${p.medicine?.label || p.medicine} ${p.quantity}${p.instruction ? ' - ' + p.instruction : ''}`
        ),
        doctorId: 'current_doctor_id',
        timestamp: Date.now()
      };

      submitFormData.append('recordData', JSON.stringify(recordData));

      // Security options
      const securityOptions = {
        useAnonymousAccess: formData.useAnonymousAccess,
        enableSteganography: formData.enableSteganography,
        storeOnBlockchain: formData.storeOnBlockchain
      };

      submitFormData.append('securityOptions', JSON.stringify(securityOptions));

      // Emergency data for steganography
      if (formData.enableSteganography) {
        console.log('🖼️ Preparing steganography data...');
        submitFormData.append('emergencyData', JSON.stringify(formData.emergencyData));
      }

      // Add image files
      formData.images.forEach((image, index) => {
        if (image.file) {
          submitFormData.append('images', image.file);
        }
      });

      // Submit to backend
      console.log('📤 Submitting to backend...');
      const response = await ApiService.createSecureRecord(submitFormData);

      if (response.success) {
        // Create new record for UI
        const newRecord = {
          id: response.data.recordId,
          recordId: response.data.recordId,
          patientName: recordData.patientName,
          patientId: recordData.patientId,
          date: new Date().toISOString().split('T')[0],
          diagnosis: formData.diagnosis,
          prescriptions: recordData.prescriptions,
          images: formData.images.map(img => img.src),
          status: 'Pending',
          doctorName: 'Current Doctor',
          createdAt: new Date().toISOString().split('T')[0],
          lastModified: new Date().toISOString().split('T')[0],

          // Security metadata from backend response
          isAnonymous: formData.useAnonymousAccess,
          hasSteganography: formData.enableSteganography,
          blockchainHash: response.data.blockchain?.blockHash,
          blockchainTxId: response.data.blockchain?.transactionId,
          anonymousSignature: response.data.anonymousAccess?.blindSignature,
          steganographyKeys: response.data.steganography?.map(s => s.extractionKey),
          securityLevel: determineSecurityLevel(response.data.securityFeatures)
        };

        // Update records
        if (showEditModal && selectedRecord) {
          setRecords(prev => prev.map(record =>
            record.id === selectedRecord.id ? { ...newRecord, id: selectedRecord.id } : record
          ));
          setShowEditModal(false);
        } else {
          setRecords(prev => [...prev, newRecord]);
          setShowCreateModal(false);
        }

        // Show security summary
        setAnonymousRecordData(newRecord);
        setSecurityOperation('summary');
        setShowSecurityModal(true);

        console.log('✅ Secure medical record created successfully!');

      } else {
        throw new Error(response.message || 'Unknown error occurred');
      }

    } catch (error) {
      console.error('❌ Secure form submission failed:', error);
      alert(`Failed to create secure medical record: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to determine security level
  const determineSecurityLevel = (securityFeatures) => {
    if (securityFeatures?.anonymous && securityFeatures?.steganography) {
      return 'High Privacy';
    } else if (securityFeatures?.anonymous) {
      return 'Anonymous';
    } else if (securityFeatures?.steganography) {
      return 'Steganographic';
    } else if (securityFeatures?.blockchain) {
      return 'Blockchain';
    }
    return 'Standard';
  };

  // Blockchain verification
  const handleBlockchainVerification = async (record) => {
    try {
      console.log('🔍 Verifying blockchain integrity...');
      setSelectedRecord(record);

      const response = await ApiService.verifyRecordIntegrity(record.id);

      setBlockchainStatus(prev => ({
        ...prev,
        [record.id]: response.verification
      }));

      setSecurityOperation('blockchain');
      setShowSecurityModal(true);

    } catch (error) {
      console.error('❌ Blockchain verification failed:', error);
      alert('Blockchain verification failed: ' + error.message);
    }
  };

  // Steganography operation
  const handleSteganographyOperation = async (record) => {
    try {
      console.log('🖼️ Preparing steganography extraction...');
      setSelectedRecord(record);
      setSecurityOperation('steganography');
      setShowSecurityModal(true);
    } catch (error) {
      console.error('❌ Steganography operation failed:', error);
      alert('Steganography operation failed: ' + error.message);
    }
  };

  // Enhanced view record with security verification
  const handleViewSecureRecord = async (record) => {
    setSelectedRecord(record);

    // Verify blockchain integrity if applicable
    if (record.blockchainHash) {
      try {
        const response = await ApiService.verifyRecordIntegrity(record.id);
        setBlockchainStatus(prev => ({
          ...prev,
          [record.id]: response.verification
        }));
      } catch (error) {
        console.error('Blockchain verification failed:', error);
      }
    }

    setShowViewModal(true);
  };

  // Anonymous access
  const handleAnonymousAccess = () => {
    setSecurityOperation('anonymous');
    setShowSecurityModal(true);
  };

  // Get security badge styling
  const getSecurityBadge = (record) => {
    if (record.isAnonymous && record.hasSteganography) {
      return { className: 'security-badge high-privacy', icon: <Shield size={12} />, text: 'High Privacy' };
    } else if (record.isAnonymous) {
      return { className: 'security-badge anonymous', icon: <Eye size={12} />, text: 'Anonymous' };
    } else if (record.hasSteganography) {
      return { className: 'security-badge steganographic', icon: <Lock size={12} />, text: 'Steganographic' };
    } else if (record.blockchainHash) {
      return { className: 'security-badge blockchain', icon: <Database size={12} />, text: 'Blockchain' };
    }
    return { className: 'security-badge standard', icon: <FileText size={12} />, text: 'Standard' };
  };

  // Existing functions (search, filter, sort, etc.)
  const filteredRecords = useMemo(() => {
    let filtered = records.filter(record => {
      const matchesSearch =
        record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.recordId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.doctorName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filters.status === 'all' || record.status === filters.status;

      let matchesDate = true;
      if (filters.dateRange !== 'all') {
        const recordDate = new Date(record.date);
        const today = new Date();
        const daysDiff = Math.floor((today - recordDate) / (1000 * 60 * 60 * 24));

        switch (filters.dateRange) {
          case 'today':
            matchesDate = daysDiff === 0;
            break;
          case 'week':
            matchesDate = daysDiff <= 7;
            break;
          case 'month':
            matchesDate = daysDiff <= 30;
            break;
          default:
            matchesDate = true;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.key === 'date' || sortConfig.key === 'createdAt' || sortConfig.key === 'lastModified') {
          const aDate = new Date(aValue);
          const bDate = new Date(bValue);
          return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
        }

        if (typeof aValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    return filtered;
  }, [records, searchQuery, filters, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectRecord = (recordId) => {
    setSelectedRecords(prev =>
      prev.includes(recordId)
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRecords.length === filteredRecords.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(filteredRecords.map(record => record.id));
    }
  };

  const handleCreateRecord = () => {
    setFormData({
      patient: '',
      diagnosis: '',
      prescriptions: [],
      images: [],
      useAnonymousAccess: false,
      enableSteganography: false,
      storeOnBlockchain: true,
      emergencyData: {
        bloodType: '',
        allergies: [],
        emergencyContact: '',
        criticalMedications: []
      }
    });
    setShowCreateModal(true);
  };

  const handleEditRecord = (record) => {
    setSelectedRecord(record);
    setFormData({
      patient: record.patientName,
      diagnosis: record.diagnosis,
      prescriptions: record.prescriptions.map(p => ({
        medicine: { label: p.split(' ')[0], value: p.split(' ')[0].toLowerCase() },
        quantity: p.split(' ')[1] || '',
        instruction: p.split(' - ')[1] || ''
      })),
      images: record.images.map(img => ({ src: img, description: '' })),
      useAnonymousAccess: record.isAnonymous,
      enableSteganography: record.hasSteganography,
      storeOnBlockchain: !!record.blockchainHash,
      emergencyData: {
        bloodType: '',
        allergies: [],
        emergencyContact: '',
        criticalMedications: []
      }
    });
    setShowEditModal(true);
  };

  const handleDeleteRecord = (recordId) => {
    if (window.confirm('Are you sure you want to delete this medical record?')) {
      setRecords(prev => prev.filter(record => record.id !== recordId));
      setSelectedRecords(prev => prev.filter(id => id !== recordId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedRecords.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedRecords.length} selected records?`)) {
      setRecords(prev => prev.filter(record => !selectedRecords.includes(record.id)));
      setSelectedRecords([]);
    }
  };

  const handleFormChange = (field, value) => {
    if (field.startsWith('emergencyData.')) {
      const emergencyField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyData: {
          ...prev.emergencyData,
          [emergencyField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Prescription handling
  const resetPrescriptionForm = () => {
    setSelectedMedicine(null);
    setQuantity('');
    setInstruction('');
    setRefillChecked(false);
    setRefillCount('');
    setTimeUnit('');
    setDuration('');
    setEditingPrescriptionIndex(null);
  };

  const handleAddPrescription = () => {
    resetPrescriptionForm();
    setShowPrescriptionModal(true);
  };

  const handleEditPrescription = (index) => {
    const prescription = formData.prescriptions[index];
    setSelectedMedicine(prescription.medicine);
    setQuantity(prescription.quantity || '');
    setInstruction(prescription.instruction || '');
    setRefillChecked(prescription.refillChecked || false);
    setRefillCount(prescription.refillCount || '');
    setTimeUnit(prescription.timeUnit || '');
    setDuration(prescription.duration || '');
    setEditingPrescriptionIndex(index);
    setShowPrescriptionModal(true);
  };

  const handleSubmitPrescription = () => {
    if (!selectedMedicine || !quantity) return;

    const newPrescription = {
      medicine: selectedMedicine,
      quantity,
      instruction,
      refillChecked,
      refillCount,
      timeUnit,
      duration,
    };

    const updatedPrescriptions = [...formData.prescriptions];
    if (editingPrescriptionIndex !== null) {
      updatedPrescriptions[editingPrescriptionIndex] = newPrescription;
    } else {
      updatedPrescriptions.push(newPrescription);
    }

    setFormData(prev => ({ ...prev, prescriptions: updatedPrescriptions }));
    setShowPrescriptionModal(false);
    resetPrescriptionForm();
  };

  const removePrescription = (index) => {
    const updatedPrescriptions = formData.prescriptions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, prescriptions: updatedPrescriptions }));
  };

  // Image handling
  const handleAddImages = () => {
    setFileList([]);
    setShowImageModal(true);
  };

  const handleImageUpload = (files) => {
    if (!files || files.length === 0) return;

    const newImages = Array.from(files).map(file => ({
      src: URL.createObjectURL(file),
      description: '',
      file,
      name: file.name
    }));
    setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    setFileList([]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setFileList(files);
  };

  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };

  const updateImageDescription = (index, description) => {
    const updatedImages = [...formData.images];
    updatedImages[index].description = description;
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'medical-badge warning',
      'Completed': 'medical-badge success',
      'Cancelled': 'medical-badge danger'
    };
    return styles[status] || 'medical-badge default';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle size={12} />;
      case 'Cancelled': return <X size={12} />;
      case 'Pending': return <Clock size={12} />;
      default: return <AlertCircle size={12} />;
    }
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setShowPrescriptionModal(false);
    setShowImageModal(false);
    setShowSecurityModal(false);
    setSelectedRecord(null);
    setFormData({
      patient: '',
      diagnosis: '',
      prescriptions: [],
      images: [],
      useAnonymousAccess: false,
      enableSteganography: false,
      storeOnBlockchain: true,
      emergencyData: {
        bloodType: '',
        allergies: [],
        emergencyContact: '',
        criticalMedications: []
      }
    });
    resetPrescriptionForm();
    setFileList([]);
  };

  return (
    <div className="medical-record-container">
      {/* Enhanced Header with Security Features */}
      <div className="medical-record-header">
        <div className="medical-record-title-section">
          <h2>🔐 Secure Medical Record Management</h2>
          <p>Advanced privacy protection with Blockchain, Steganography & Blind Signatures</p>
        </div>
        <div className="medical-record-actions">
          <button className="medical-btn secondary" onClick={handleAnonymousAccess}>
            <Shield size={16} />
            Anonymous Access
          </button>
          <button className="medical-btn secondary" onClick={() => window.location.reload()}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="medical-btn primary" onClick={handleCreateRecord}>
            <Plus size={16} />
            Add Secure Record
          </button>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="medical-stats">
        <div className="medical-stat-card total">
          <div className="medical-stat-icon">
            <FileText size={24} />
          </div>
          <div className="medical-stat-content">
            <h3>{records.length}</h3>
            <p>Total Records</p>
          </div>
        </div>
        <div className="medical-stat-card anonymous">
          <div className="medical-stat-icon">
            <Shield size={24} />
          </div>
          <div className="medical-stat-content">
            <h3>{records.filter(r => r.isAnonymous).length}</h3>
            <p>Anonymous</p>
          </div>
        </div>
        <div className="medical-stat-card steganographic">
          <div className="medical-stat-icon">
            <Lock size={24} />
          </div>
          <div className="medical-stat-content">
            <h3>{records.filter(r => r.hasSteganography).length}</h3>
            <p>Steganographic</p>
          </div>
        </div>
        <div className="medical-stat-card blockchain">
          <div className="medical-stat-icon">
            <Database size={24} />
          </div>
          <div className="medical-stat-content">
            <h3>{records.filter(r => r.blockchainHash).length}</h3>
            <p>On Blockchain</p>
          </div>
        </div>
      </div>

      {/* Enhanced Create/Edit Modal with Security Options */}
      {(showCreateModal || showEditModal) && (
        <>
          <div className="medical-modal-backdrop" onClick={closeModal}></div>
          <div className="medical-modal large">
            <div className="medical-modal-header">
              <h3>{showEditModal ? 'Edit Medical Record' : 'Create Secure Medical Record'}</h3>
              <button className="medical-modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="medical-modal-content">
              <div className="medical-form">
                {/* Security Options Panel */}
                <div className="security-options-panel">
                  <h4>🔐 Security & Privacy Options</h4>
                  <div className="security-toggles">
                    <label className="security-toggle">
                      <input
                        type="checkbox"
                        checked={formData.useAnonymousAccess}
                        onChange={(e) => handleFormChange('useAnonymousAccess', e.target.checked)}
                      />
                      <span className="toggle-text">
                        <Shield size={16} />
                        Anonymous Access (Blind Signatures)
                      </span>
                      <small>Patient identity will be protected using cryptographic blind signatures</small>
                    </label>
                    <label className="security-toggle">
                      <input
                        type="checkbox"
                        checked={formData.enableSteganography}
                        onChange={(e) => handleFormChange('enableSteganography', e.target.checked)}
                      />
                      <span className="toggle-text">
                        <Lock size={16} />
                        Hide Emergency Data in Images
                      </span>
                      <small>Emergency information will be hidden within uploaded medical images</small>
                    </label>
                    <label className="security-toggle">
                      <input
                        type="checkbox"
                        checked={formData.storeOnBlockchain}
                        onChange={(e) => handleFormChange('storeOnBlockchain', e.target.checked)}
                      />
                      <span className="toggle-text">
                        <Database size={16} />
                        Store on Blockchain (Immutable)
                      </span>
                      <small>Record will be stored on blockchain for tamper-proof verification</small>
                    </label>
                  </div>
                </div>

                {/* Emergency Data Section (for Steganography) */}
                {formData.enableSteganography && (
                  <div className="emergency-data-section">
                    <h4>🚨 Emergency Data (Hidden in Images)</h4>
                    <p className="emergency-note">This critical information will be invisibly embedded in your medical images</p>
                    <div className="medical-form-row">
                      <div className="medical-form-group">
                        <label>Blood Type</label>
                        <select
                          value={formData.emergencyData.bloodType}
                          onChange={(e) => handleFormChange('emergencyData.bloodType', e.target.value)}
                          className="medical-form-select"
                        >
                          <option value="">Select Blood Type</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                      <div className="medical-form-group">
                        <label>Emergency Contact</label>
                        <input
                          type="text"
                          value={formData.emergencyData.emergencyContact}
                          onChange={(e) => handleFormChange('emergencyData.emergencyContact', e.target.value)}
                          placeholder="Emergency contact number"
                          className="medical-form-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Basic form fields */}
                <div className="medical-form-row">
                  <div className="medical-form-group">
                    <label>Patient *</label>
                    <select
                      value={formData.patient}
                      onChange={(e) => handleFormChange('patient', e.target.value)}
                      className="medical-form-select"
                      disabled={formData.useAnonymousAccess}
                    >
                      <option value="">-- Select Patient --</option>
                      {patientOptions.map(option => (
                        <option key={option.value} value={option.label}>{option.label}</option>
                      ))}
                    </select>
                    {formData.useAnonymousAccess && (
                      <small className="form-note">Patient selection disabled for anonymous access</small>
                    )}
                  </div>
                </div>

                <div className="medical-form-row">
                  <div className="medical-form-group">
                    <label>Diagnosis *</label>
                    <textarea
                      value={formData.diagnosis}
                      onChange={(e) => handleFormChange('diagnosis', e.target.value)}
                      placeholder="Enter diagnosis and treatment details"
                      className="medical-form-textarea"
                      rows={4}
                    />
                  </div>
                </div>

                <div className="medical-form-row">
                  <div className="medical-form-group">
                    <label>Prescriptions</label>
                    <div className="prescription-tags">
                      {formData.prescriptions.map((prescription, index) => (
                        <div key={index} className="prescription-tag" onClick={() => handleEditPrescription(index)}>
                          <span>{prescription.medicine?.label || prescription.medicine || 'Unknown Medicine'} - {prescription.quantity}</span>
                          {prescription.instruction && <small>{prescription.instruction}</small>}
                          <button
                            type="button"
                            className="prescription-remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              removePrescription(index);
                            }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="prescription-add"
                        onClick={handleAddPrescription}
                      >
                        <Plus size={14} />
                        Add Prescription
                      </button>
                    </div>
                  </div>
                </div>

                <div className="medical-form-row">
                  <div className="medical-form-group">
                    <label>Medical Images {formData.enableSteganography && <span className="steg-note">(Emergency data will be hidden here)</span>}</label>
                    <div className="image-upload-section">
                      <button
                        type="button"
                        className="image-add-btn"
                        onClick={handleAddImages}
                      >
                        <Plus size={16} />
                        Add Images
                      </button>
                      {formData.images.length > 0 && (
                        <div className="image-list">
                          {formData.images.map((image, index) => (
                            <div key={index} className="image-item">
                              <img src={image.src} alt={`Medical ${index + 1}`} />
                              {formData.enableSteganography && (
                                <div className="steg-indicator">🔒 Steganography Enabled</div>
                              )}
                              <button
                                type="button"
                                className="image-remove"
                                onClick={() => removeImage(index)}
                              >
                                <X size={12} />
                              </button>
                              <textarea
                                value={image.description}
                                onChange={(e) => updateImageDescription(index, e.target.value)}
                                placeholder="Image description"
                                className="image-description"
                                rows={2}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="medical-modal-actions">
              <button className="medical-btn secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="medical-btn primary"
                onClick={handleSecureSubmitForm}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} className="spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield size={16} />
                    {showEditModal ? 'Update Secure Record' : 'Create Secure Record'}
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
          <div className="medical-modal-backdrop" onClick={() => setShowPrescriptionModal(false)}></div>
          <div className="medical-modal medium">
            <div className="medical-modal-header">
              <h3>{editingPrescriptionIndex !== null ? 'Edit Prescription' : 'Add Prescription'}</h3>
              <button className="medical-modal-close" onClick={() => setShowPrescriptionModal(false)}>×</button>
            </div>
            <div className="medical-modal-content">
              <div className="medical-form">
                <div className="medical-form-row">
                  <div className="medical-form-group">
                    <label>Medicine *</label>
                    <select
                      value={selectedMedicine?.value || ''}
                      onChange={(e) => {
                        const medicine = medicineOptions.find(m => m.value === e.target.value);
                        setSelectedMedicine(medicine);
                      }}
                      className="medical-form-select"
                    >
                      <option value="">-- Select Medicine --</option>
                      {medicineOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="medical-form-group">
                    <label>Quantity *</label>
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g., 500mg"
                      className="medical-form-input"
                    />
                  </div>
                </div>
                <div className="medical-form-row">
                  <div className="medical-form-group">
                    <label>Instructions</label>
                    <textarea
                      value={instruction}
                      onChange={(e) => setInstruction(e.target.value)}
                      placeholder="e.g., Take twice daily after meals"
                      className="medical-form-textarea"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="medical-form-row">
                  <div className="medical-form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={refillChecked}
                        onChange={(e) => setRefillChecked(e.target.checked)}
                      />
                      Allow Refills
                    </label>
                  </div>
                </div>
                {refillChecked && (
                  <div className="medical-form-row">
                    <div className="medical-form-group">
                      <label>Refill Count</label>
                      <input
                        type="number"
                        value={refillCount}
                        onChange={(e) => setRefillCount(e.target.value)}
                        placeholder="Number of refills"
                        className="medical-form-input"
                      />
                    </div>
                    <div className="medical-form-group">
                      <label>Duration</label>
                      <div className="duration-inputs">
                        <input
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          placeholder="Duration"
                          className="medical-form-input"
                        />
                        <select
                          value={timeUnit}
                          onChange={(e) => setTimeUnit(e.target.value)}
                          className="medical-form-select"
                        >
                          <option value="">Unit</option>
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                          <option value="months">Months</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="medical-modal-actions">
              <button className="medical-btn secondary" onClick={() => setShowPrescriptionModal(false)}>
                Cancel
              </button>
              <button className="medical-btn primary" onClick={handleSubmitPrescription}>
                {editingPrescriptionIndex !== null ? 'Update' : 'Add'} Prescription
              </button>
            </div>
          </div>
        </>
      )}

      {/* Image Upload Modal */}
      {showImageModal && (
        <>
          <div className="medical-modal-backdrop" onClick={() => setShowImageModal(false)}></div>
          <div className="medical-modal medium">
            <div className="medical-modal-header">
              <h3>Upload Medical Images</h3>
              <button className="medical-modal-close" onClick={() => setShowImageModal(false)}>×</button>
            </div>
            <div className="medical-modal-content">
              <div className="file-upload-area">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="file-input"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="file-upload-label">
                  <Plus size={24} />
                  <span>Click to upload medical images</span>
                  <small>PNG, JPG, GIF up to 10MB each (Multiple files supported)</small>
                  {formData.enableSteganography && (
                    <small className="steg-warning">🔒 Emergency data will be hidden in these images</small>
                  )}
                </label>
              </div>
              {fileList.length > 0 && (
                <div className="uploaded-files-preview">
                  <h4>Selected Files:</h4>
                  <div className="file-preview-grid">
                    {Array.from(fileList).map((file, index) => (
                      <div key={index} className="file-preview-item">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="file-preview-image"
                        />
                        <span className="file-name">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="medical-modal-actions">
              <button className="medical-btn secondary" onClick={() => setShowImageModal(false)}>
                Cancel
              </button>
              {fileList.length > 0 && (
                <button className="medical-btn primary" onClick={() => {
                  handleImageUpload(fileList);
                  setShowImageModal(false);
                }}>
                  Add {fileList.length} Image{fileList.length > 1 ? 's' : ''}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Security Operations Modal */}
      {showSecurityModal && (
        <>
          <div className="medical-modal-backdrop" onClick={() => setShowSecurityModal(false)}></div>
          <div className="medical-modal medium">
            <div className="medical-modal-header">
              <h3>
                {securityOperation === 'anonymous' && '🔐 Anonymous Access'}
                {securityOperation === 'steganography' && '🖼️ Hidden Data Extraction'}
                {securityOperation === 'blockchain' && '⛓️ Blockchain Verification'}
                {securityOperation === 'summary' && '✅ Security Summary'}
              </h3>
              <button className="medical-modal-close" onClick={() => setShowSecurityModal(false)}>×</button>
            </div>
            <div className="medical-modal-content">
              {securityOperation === 'summary' && anonymousRecordData && (
                <div className="security-summary">
                  <h4>🎉 Secure Medical Record Created Successfully!</h4>
                  <div className="security-features">
                    <div className={`security-feature ${anonymousRecordData.isAnonymous ? 'enabled' : 'disabled'}`}>
                      <Shield size={20} />
                      <div className="feature-info">
                        <span>Anonymous Access: {anonymousRecordData.isAnonymous ? 'Enabled' : 'Disabled'}</span>
                        {anonymousRecordData.isAnonymous && (
                          <small>Patient identity protected with blind signatures</small>
                        )}
                      </div>
                    </div>
                    <div className={`security-feature ${anonymousRecordData.hasSteganography ? 'enabled' : 'disabled'}`}>
                      <Lock size={20} />
                      <div className="feature-info">
                        <span>Steganography: {anonymousRecordData.hasSteganography ? 'Enabled' : 'Disabled'}</span>
                        {anonymousRecordData.hasSteganography && (
                          <small>Emergency data hidden in medical images</small>
                        )}
                      </div>
                    </div>
                    <div className={`security-feature ${anonymousRecordData.blockchainHash ? 'enabled' : 'disabled'}`}>
                      <Database size={20} />
                      <div className="feature-info">
                        <span>Blockchain Storage: {anonymousRecordData.blockchainHash ? 'Enabled' : 'Disabled'}</span>
                        {anonymousRecordData.blockchainHash && (
                          <small>Record stored on blockchain for tamper-proof verification</small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="security-level">
                    <strong>🛡️ Security Level: {anonymousRecordData.securityLevel}</strong>
                  </div>
                  {anonymousRecordData.blockchainHash && (
                    <div className="blockchain-info">
                      <p><strong>Blockchain Hash:</strong> <code>{anonymousRecordData.blockchainHash}</code></p>
                    </div>
                  )}
                </div>
              )}

              {securityOperation === 'blockchain' && selectedRecord && (
                <div className="blockchain-verification">
                  <h4>⛓️ Blockchain Verification Results</h4>
                  {blockchainStatus[selectedRecord.id] ? (
                    <div className="verification-result">
                      <div className={`verification-status ${blockchainStatus[selectedRecord.id].isValid ? 'valid' : 'invalid'}`}>
                        {blockchainStatus[selectedRecord.id].isValid ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span>{blockchainStatus[selectedRecord.id].isValid ? 'Record Verified ✅' : 'Verification Failed ❌'}</span>
                      </div>
                      <div className="verification-details">
                        <p><strong>Blockchain Hash:</strong> <code>{selectedRecord.blockchainHash}</code></p>
                        <p><strong>Block Height:</strong> {blockchainStatus[selectedRecord.id].blockHeight}</p>
                        <p><strong>Status:</strong> {blockchainStatus[selectedRecord.id].isValid ? 'Integrity Confirmed' : 'Possible Tampering Detected'}</p>
                        <p><strong>Last Verified:</strong> {new Date(blockchainStatus[selectedRecord.id].lastModified).toLocaleString()}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="verification-loading">
                      <RefreshCw size={20} className="spin" />
                      <span>Verifying record integrity on blockchain...</span>
                    </div>
                  )}
                </div>
              )}

              {securityOperation === 'steganography' && selectedRecord && (
                <div className="steganography-extraction">
                  <h4>🖼️ Steganographic Data Extraction</h4>
                  <p>This record contains hidden emergency data embedded in medical images.</p>
                  <div className="extraction-info">
                    <div className="extraction-step">
                      <Lock size={16} />
                      <span>Extraction Key: <code>steg_key_{selectedRecord.id}</code></span>
                    </div>
                    <div className="extraction-step">
                      <Key size={16} />
                      <span>Hidden Data: Emergency contact, blood type, critical medications</span>
                    </div>
                  </div>
                  <button className="medical-btn primary">
                    <Download size={16} />
                    Extract Hidden Data
                  </button>
                </div>
              )}

              {securityOperation === 'anonymous' && (
                <div className="anonymous-access">
                  <h4>🔐 Anonymous Access System</h4>
                  <p>Our system uses cryptographic blind signatures to ensure complete patient anonymity while maintaining medical record integrity.</p>
                  <div className="anonymous-features">
                    <div className="anonymous-feature">
                      <Shield size={16} />
                      <span>Zero-knowledge patient identification</span>
                    </div>
                    <div className="anonymous-feature">
                      <Key size={16} />
                      <span>Cryptographic blind signatures</span>
                    </div>
                    <div className="anonymous-feature">
                      <Lock size={16} />
                      <span>Untraceable medical consultations</span>
                    </div>
                  </div>
                  <button className="medical-btn primary" onClick={handleCreateRecord}>
                    <Plus size={16} />
                    Create Anonymous Record
                  </button>
                </div>
              )}
            </div>
            <div className="medical-modal-actions">
              <button className="medical-btn secondary" onClick={() => setShowSecurityModal(false)}>
                Close
              </button>
            </div>
          </div>
        </>
      )}

      {/* View Modal with Security Info */}
      {showViewModal && selectedRecord && (
        <>
          <div className="medical-modal-backdrop" onClick={() => setShowViewModal(false)}></div>
          <div className="medical-modal large">
            <div className="medical-modal-header">
              <h3>Medical Record Details - {selectedRecord.recordId}</h3>
              <div className="security-level-badge">
                {getSecurityBadge(selectedRecord).icon}
                {selectedRecord.securityLevel || 'Standard'}
              </div>
              <button className="medical-modal-close" onClick={() => setShowViewModal(false)}>×</button>
            </div>
            <div className="medical-modal-content">
              <div className="view-record-content">
                <div className="record-info-grid">
                  <div className="info-item">
                    <label>Patient Name:</label>
                    <span>{selectedRecord.patientName}</span>
                  </div>
                  <div className="info-item">
                    <label>Record ID:</label>
                    <span>{selectedRecord.recordId}</span>
                  </div>
                  <div className="info-item">
                    <label>Date:</label>
                    <span>{new Date(selectedRecord.date).toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <label>Doctor:</label>
                    <span>{selectedRecord.doctorName}</span>
                  </div>
                  <div className="info-item">
                    <label>Status:</label>
                    <span className={getStatusBadge(selectedRecord.status)}>
                      {getStatusIcon(selectedRecord.status)}
                      {selectedRecord.status}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Security Level:</label>
                    <span className={getSecurityBadge(selectedRecord).className}>
                      {getSecurityBadge(selectedRecord).icon}
                      {selectedRecord.securityLevel || 'Standard'}
                    </span>
                  </div>
                </div>

                <div className="diagnosis-section">
                  <label>Diagnosis:</label>
                  <p>{selectedRecord.diagnosis}</p>
                </div>

                {selectedRecord.prescriptions.length > 0 && (
                  <div className="prescriptions-section">
                    <label>Prescriptions:</label>
                    <div className="prescription-list">
                      {selectedRecord.prescriptions.map((prescription, index) => (
                        <div key={index} className="prescription-item">
                          {prescription}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRecord.images.length > 0 && (
                  <div className="images-section">
                    <label>Medical Images:</label>
                    <div className="image-gallery">
                      {selectedRecord.images.map((image, index) => (
                        <div key={index} className="gallery-image-container">
                          <img src={image} alt={`Medical ${index + 1}`} className="gallery-image" />
                          {selectedRecord.hasSteganography && (
                            <div className="steg-overlay">🔒 Contains Hidden Data</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Security Information */}
                {(selectedRecord.blockchainHash || selectedRecord.isAnonymous || selectedRecord.hasSteganography) && (
                  <div className="security-info-section">
                    <label>Security Information:</label>
                    <div className="security-details">
                      {selectedRecord.blockchainHash && (
                        <div className="security-detail">
                          <Database size={16} />
                          <span>Blockchain Hash: <code>{selectedRecord.blockchainHash}</code></span>
                        </div>
                      )}
                      {selectedRecord.isAnonymous && (
                        <div className="security-detail">
                          <Shield size={16} />
                          <span>Anonymous access enabled with blind signatures</span>
                        </div>
                      )}
                      {selectedRecord.hasSteganography && (
                        <div className="security-detail">
                          <Lock size={16} />
                          <span>Emergency data hidden in medical images</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="medical-modal-actions">
              <button className="medical-btn secondary" onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </>
      )}

      {/* Search and Filters */}
      <div className="medical-controls">
        <div className="medical-search-section">
          <div className="medical-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by patient name, record ID, diagnosis, or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="medical-search-input"
            />
          </div>
          <button
            className={`medical-btn secondary ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedRecords.length > 0 && (
          <div className="medical-bulk-actions">
            <span className="medical-selected-count">
              {selectedRecords.length} record{selectedRecords.length > 1 ? 's' : ''} selected
            </span>
            <div className="medical-bulk-buttons">
              <button className="medical-btn danger small" onClick={handleBulkDelete}>
                <Trash2 size={14} />
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="medical-filter-panel">
            <div className="medical-filter-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="medical-filter-group">
              <label>Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <button
              className="medical-btn secondary small"
              onClick={() => setFilters({ status: 'all', dateRange: 'all' })}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Records Table with Security Indicators */}
      <div className="medical-table-container">
        <div className="medical-table-wrapper">
          <table className="medical-table">
            <thead>
              <tr>
                <th className="medical-th checkbox">
                  <input
                    type="checkbox"
                    checked={filteredRecords.length > 0 && selectedRecords.length === filteredRecords.length}
                    onChange={handleSelectAll}
                    className="medical-checkbox"
                  />
                </th>
                <th className="medical-th sortable" onClick={() => handleSort('recordId')}>
                  Record ID
                  {sortConfig.key === 'recordId' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                <th className="medical-th sortable" onClick={() => handleSort('patientName')}>
                  Patient Name
                </th>
                <th className="medical-th sortable" onClick={() => handleSort('date')}>
                  Date
                </th>
                <th className="medical-th">Diagnosis</th>
                <th className="medical-th">Security Level</th>
                <th className="medical-th">Status</th>
                <th className="medical-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => {
                const securityBadge = getSecurityBadge(record);
                return (
                  <tr key={record.id} className={selectedRecords.includes(record.id) ? 'selected' : ''}>
                    <td className="medical-td checkbox">
                      <input
                        type="checkbox"
                        checked={selectedRecords.includes(record.id)}
                        onChange={() => handleSelectRecord(record.id)}
                        className="medical-checkbox"
                      />
                    </td>
                    <td className="medical-td">
                      <span className="medical-record-id">{record.recordId}</span>
                    </td>
                    <td className="medical-td">
                      <div className="patient-cell">
                        <div className="patient-avatar">
                          {record.isAnonymous ? '🔒' : record.patientName.charAt(0).toUpperCase()}
                        </div>
                        <div className="patient-info">
                          <div className="patient-name">{record.patientName}</div>
                          <div className="patient-id">{record.patientId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="medical-td">
                      <span className="medical-date">{new Date(record.date).toLocaleDateString()}</span>
                    </td>
                    <td className="medical-td">
                      <div className="diagnosis-cell" title={record.diagnosis}>
                        {record.diagnosis.length > 50 ?
                          `${record.diagnosis.substring(0, 50)}...` :
                          record.diagnosis
                        }
                      </div>
                    </td>
                    <td className="medical-td">
                      <div className={securityBadge.className}>
                        {securityBadge.icon}
                        <span>{securityBadge.text}</span>
                      </div>
                    </td>
                    <td className="medical-td">
                      <div className={getStatusBadge(record.status)}>
                        {getStatusIcon(record.status)}
                        <span>{record.status}</span>
                      </div>
                    </td>
                    <td className="medical-td actions">
                      <div className="medical-action-buttons">
                        <button
                          className="medical-action-btn view"
                          title="View Record"
                          onClick={() => handleViewSecureRecord(record)}
                        >
                          <Eye size={14} />
                        </button>
                        {record.hasSteganography && (
                          <button
                            className="medical-action-btn steganography"
                            title="Extract Hidden Data"
                            onClick={() => handleSteganographyOperation(record)}
                          >
                            <Lock size={14} />
                          </button>
                        )}
                        {record.blockchainHash && (
                          <button
                            className="medical-action-btn blockchain"
                            title="Verify on Blockchain"
                            onClick={() => handleBlockchainVerification(record)}
                          >
                            <Database size={14} />
                          </button>
                        )}
                        <button
                          className="medical-action-btn edit"
                          title="Edit Record"
                          onClick={() => handleEditRecord(record)}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          className="medical-action-btn delete"
                          title="Delete Record"
                          onClick={() => handleDeleteRecord(record.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredRecords.length === 0 && (
            <div className="medical-no-results">
              <FileText size={48} />
              <p>No medical records found</p>
              <span>Try adjusting your search or filter criteria</span>
            </div>
          )}
        </div>

        <div className="medical-table-footer">
          <div className="medical-table-info">
            Showing {filteredRecords.length} of {records.length} records
          </div>
        </div>
      </div>

      <style jsx>{`
        .medical-record-container {
          padding: 24px 32px;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .medical-record-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .medical-record-title-section h2 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 700;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .medical-record-title-section p {
          margin: 0;
          color: rgba(255,255,255,0.9);
          font-size: 16px;
        }

        .medical-record-actions {
          display: flex;
          gap: 12px;
        }

        .medical-btn {
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

        .medical-btn.small {
          padding: 8px 12px;
          font-size: 12px;
        }

        .medical-btn.primary {
          background: rgba(255, 255, 255, 0.95);
          color: #667eea;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }

        .medical-btn.primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .medical-btn.primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .medical-btn.secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }

        .medical-btn.secondary:hover,
        .medical-btn.secondary.active {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .medical-btn.danger {
          background: #ef4444;
          color: white;
        }

        .medical-btn.danger:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        .medical-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .medical-stat-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }

        .medical-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .medical-stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .medical-stat-card.total .medical-stat-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .medical-stat-card.anonymous .medical-stat-icon {
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        }

        .medical-stat-card.steganographic .medical-stat-icon {
          background: linear-gradient(135deg, #f59e0b 0%, #faad14 100%);
        }

        .medical-stat-card.blockchain .medical-stat-icon {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
        }

        .medical-stat-content h3 {
          margin: 0 0 4px 0;
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }

        .medical-stat-content p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .medical-controls {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }

        .medical-search-section {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .medical-search-box {
          position: relative;
          flex: 1;
          max-width: 600px;
        }

        .medical-search-box svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          z-index: 1;
        }

        .medical-search-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .medical-search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .medical-bulk-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 12px;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .medical-selected-count {
          color: #667eea;
          font-weight: 500;
        }

        .medical-bulk-buttons {
          display: flex;
          gap: 8px;
        }

        .medical-filter-panel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          padding: 16px;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .medical-filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .medical-filter-group label {
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .medical-filter-group select {
          padding: 8px 12px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          cursor: pointer;
        }

        .medical-table-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }

        .medical-table-wrapper {
          overflow-x: auto;
        }

        .medical-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          min-width: 1400px;
        }

        .medical-th {
          background: rgba(248, 250, 252, 0.8);
          padding: 16px 12px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          white-space: nowrap;
          position: relative;
        }

        .medical-th.sortable {
          cursor: pointer;
          user-select: none;
          transition: all 0.2s ease;
        }

        .medical-th.sortable:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .medical-th.sortable svg {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
        }

        .medical-th.checkbox {
          width: 50px;
          text-align: center;
        }

        .medical-th.actions {
          width: 160px;
          text-align: center;
        }

        .medical-td {
          padding: 16px 12px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.3);
          font-size: 14px;
          color: #374151;
        }

        .medical-td.checkbox {
          text-align: center;
        }

        .medical-td.actions {
          text-align: center;
        }

        .medical-table tbody tr {
          transition: all 0.2s ease;
        }

        .medical-table tbody tr:hover {
          background: rgba(102, 126, 234, 0.05);
        }

        .medical-table tbody tr.selected {
          background: rgba(102, 126, 234, 0.1);
        }

        .medical-checkbox {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .medical-record-id {
          font-family: monospace;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .patient-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .patient-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .patient-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .patient-name {
          font-weight: 500;
          color: #1e293b;
        }

        .patient-id {
          font-size: 12px;
          color: #64748b;
          font-family: monospace;
        }

        .medical-date {
          color: #64748b;
          font-size: 13px;
        }

        .diagnosis-cell {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.4;
          color: #374151;
        }

        .security-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
          text-transform: capitalize;
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

        .security-badge.blockchain {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
        }

        .security-badge.standard {
          background: rgba(148, 163, 184, 0.1);
          color: #94a3b8;
        }

        .medical-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .medical-badge.success {
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
        }

        .medical-badge.warning {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .medical-badge.danger {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .medical-badge.default {
          background: rgba(148, 163, 184, 0.1);
          color: #94a3b8;
        }

        .medical-action-buttons {
          display: flex;
          gap: 4px;
          justify-content: center;
        }

        .medical-action-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          background: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .medical-action-btn.view {
          color: #3b82f6;
        }

        .medical-action-btn.view:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .medical-action-btn.steganography {
          color: #f59e0b;
        }

        .medical-action-btn.steganography:hover {
          background: #f59e0b;
          color: white;
          border-color: #f59e0b;
        }

        .medical-action-btn.blockchain {
          color: #16a34a;
        }

        .medical-action-btn.blockchain:hover {
          background: #16a34a;
          color: white;
          border-color: #16a34a;
        }

        .medical-action-btn.edit {
          color: #8b5cf6;
        }

        .medical-action-btn.edit:hover {
          background: #8b5cf6;
          color: white;
          border-color: #8b5cf6;
        }

        .medical-action-btn.delete {
          color: #ef4444;
        }

        .medical-action-btn.delete:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }

        .medical-no-results {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .medical-no-results svg {
          color: #94a3b8;
          margin-bottom: 16px;
        }

        .medical-no-results span {
          color: #94a3b8;
          font-size: 14px;
        }

        .medical-table-footer {
          padding: 16px 24px;
          background: rgba(248, 250, 252, 0.8);
          border-top: 1px solid rgba(226, 232, 240, 0.6);
        }

        .medical-table-info {
          color: #64748b;
          font-size: 14px;
        }

        /* Modal Styles */
        .medical-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .medical-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          max-width: 800px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          z-index: 10000;
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.2);
        }

        .medical-modal.medium {
          max-width: 600px;
        }

        .medical-modal.large {
          max-width: 900px;
        }

        .medical-modal-header {
          padding: 24px 32px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          margin-bottom: 24px;
          padding-bottom: 16px;
        }

        .medical-modal-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }

        .security-level-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          font-size: 12px;
          font-weight: 500;
        }

        .medical-modal-close {
          background: none;
          border: none;
          font-size: 24px;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
          transition: color 0.2s ease;
        }

        .medical-modal-close:hover {
          color: #ef4444;
        }

        .medical-modal-content {
          padding: 0 32px 32px;
        }

        .medical-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 24px 32px;
          border-top: 1px solid rgba(226, 232, 240, 0.6);
          background: rgba(248, 250, 252, 0.5);
        }

        /* Security Options Panel */
        .security-options-panel {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .security-options-panel h4 {
          margin: 0 0 16px 0;
          color: #667eea;
          font-size: 16px;
          font-weight: 600;
        }

        .security-toggles {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .security-toggle {
          display: flex;
          flex-direction: column;
          gap: 6px;
          cursor: pointer;
          padding: 12px;
          border-radius: 8px;
          transition: background 0.2s ease;
        }

        .security-toggle:hover {
          background: rgba(102, 126, 234, 0.05);
        }

        .security-toggle input[type="checkbox"] {
          margin-right: 12px;
        }

        .toggle-text {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          color: #374151;
        }

        .security-toggle small {
          color: #64748b;
          font-size: 12px;
          margin-left: 28px;
        }

        .emergency-data-section {
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .emergency-data-section h4 {
          margin: 0 0 8px 0;
          color: #ef4444;
          font-size: 16px;
          font-weight: 600;
        }

        .emergency-note {
          margin: 0 0 16px 0;
          color: #64748b;
          font-size: 14px;
          font-style: italic;
        }

        /* Form Styles */
        .medical-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .medical-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .medical-form-row:has(.medical-form-group:only-child) {
          grid-template-columns: 1fr;
        }

        .medical-form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .medical-form-group label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        .form-note {
          color: #64748b;
          font-size: 12px;
          font-style: italic;
        }

        .medical-form-input,
        .medical-form-select,
        .medical-form-textarea {
          padding: 12px 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          transition: all 0.2s ease;
          color: #374151;
        }

        .medical-form-input:focus,
        .medical-form-select:focus,
        .medical-form-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .medical-form-select {
          cursor: pointer;
        }

        .medical-form-textarea {
          resize: vertical;
          font-family: inherit;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          width: 16px;
          height: 16px;
        }

        .duration-inputs {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 8px;
        }

        /* Prescription Tags */
        .prescription-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }

        .prescription-tag {
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid rgba(59, 130, 246, 0.2);
          position: relative;
        }

        .prescription-tag:hover {
          background: rgba(59, 130, 246, 0.2);
        }

        .prescription-tag small {
          color: #64748b;
          font-size: 11px;
        }

        .prescription-remove {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #ef4444;
          color: white;
          border: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
        }

        .prescription-add {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 8px 12px;
          border: 1px dashed rgba(102, 126, 234, 0.3);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .prescription-add:hover {
          background: rgba(102, 126, 234, 0.2);
        }

        /* Image Upload */
        .image-upload-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .image-add-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 12px 16px;
          border: 1px dashed rgba(102, 126, 234, 0.3);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .image-add-btn:hover {
          background: rgba(102, 126, 234, 0.2);
        }

        .steg-note {
          color: #f59e0b;
          font-size: 11px;
          font-weight: 400;
        }

        .image-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 16px;
        }

        .image-item {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .image-item img {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .steg-indicator {
          position: absolute;
          top: 4px;
          left: 4px;
          background: rgba(245, 158, 11, 0.9);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
        }

        .image-remove {
          position: absolute;
          top: 4px;
          right: 4px;
          background: #ef4444;
          color: white;
          border: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .image-description {
          width: 100%;
          padding: 6px 8px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 6px;
          font-size: 12px;
          resize: vertical;
          min-height: 40px;
        }

        .file-upload-area {
          border: 2px dashed rgba(102, 126, 234, 0.3);
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          background: rgba(102, 126, 234, 0.05);
        }

        .file-input {
          display: none;
        }

        .file-upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          color: #667eea;
        }

        .file-upload-label span {
          font-weight: 500;
        }

        .file-upload-label small {
          color: #94a3b8;
        }

        .steg-warning {
          color: #f59e0b !important;
          font-weight: 500 !important;
        }

        .uploaded-files-preview {
          margin-top: 20px;
        }

        .uploaded-files-preview h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .file-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 12px;
        }

        .file-preview-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .file-preview-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .file-name {
          font-size: 11px;
          color: #64748b;
          text-align: center;
          word-break: break-all;
          max-width: 80px;
        }

        /* Security Summary Styles */
        .security-summary {
          text-align: center;
          padding: 20px;
        }

        .security-summary h4 {
          margin: 0 0 24px 0;
          color: #16a34a;
          font-size: 18px;
        }

        .security-features {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .security-feature {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid;
        }

        .security-feature.enabled {
          background: rgba(22, 163, 74, 0.1);
          border-color: rgba(22, 163, 74, 0.3);
          color: #16a34a;
        }

        .security-feature.disabled {
          background: rgba(148, 163, 184, 0.1);
          border-color: rgba(148, 163, 184, 0.3);
          color: #94a3b8;
        }

        .feature-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: left;
        }

        .feature-info small {
          color: #64748b;
          font-size: 12px;
        }

        .security-level {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .blockchain-info {
          background: rgba(248, 250, 252, 0.8);
          padding: 16px;
          border-radius: 12px;
          text-align: left;
        }

        .blockchain-info code {
          background: rgba(0, 0, 0, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
          word-break: break-all;
        }

        /* Blockchain Verification Styles */
        .blockchain-verification h4 {
          margin: 0 0 20px 0;
          color: #16a34a;
          font-size: 18px;
        }

        .verification-result {
          text-align: center;
        }

        .verification-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 16px;
          font-weight: 600;
        }

        .verification-status.valid {
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
          border: 1px solid rgba(22, 163, 74, 0.3);
        }

        .verification-status.invalid {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .verification-details {
          background: rgba(248, 250, 252, 0.8);
          padding: 16px;
          border-radius: 12px;
          text-align: left;
        }

        .verification-details p {
          margin: 8px 0;
          font-size: 14px;
        }

        .verification-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 40px;
          color: #64748b;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* View Record Content */
        .view-record-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .record-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-item label {
          font-weight: 500;
          color: #64748b;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-item span {
          color: #1e293b;
          font-size: 14px;
        }

        .diagnosis-section,
        .prescriptions-section,
        .images-section,
        .security-info-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .diagnosis-section label,
        .prescriptions-section label,
        .images-section label,
        .security-info-section label {
          font-weight: 500;
          color: #64748b;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .diagnosis-section p {
          margin: 0;
          color: #1e293b;
          line-height: 1.6;
          background: rgba(248, 250, 252, 0.8);
          padding: 16px;
          border-radius: 8px;
        }

        .prescription-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .prescription-item {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          font-size: 14px;
        }

        .image-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
        }

        .gallery-image-container {
          position: relative;
        }

        .gallery-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .steg-overlay {
          position: absolute;
          top: 4px;
          left: 4px;
          background: rgba(245, 158, 11, 0.9);
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 500;
        }

        .security-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: rgba(248, 250, 252, 0.8);
          padding: 16px;
          border-radius: 12px;
        }

        .security-detail {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #374151;
          font-size: 14px;
        }

        .security-detail code {
          background: rgba(0, 0, 0, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
        }

        /* Steganography Extraction */
        .steganography-extraction {
          text-align: center;
          padding: 20px;
        }

        .steganography-extraction h4 {
          margin: 0 0 16px 0;
          color: #f59e0b;
          font-size: 18px;
        }

        .steganography-extraction p {
          margin: 0 0 20px 0;
          color: #64748b;
        }

        .extraction-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: rgba(248, 250, 252, 0.8);
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .extraction-step {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #374151;
          font-size: 14px;
        }

        .extraction-step code {
          background: rgba(0, 0, 0, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
        }

        /* Anonymous Access */
        .anonymous-access {
          text-align: center;
          padding: 20px;
        }

        .anonymous-access h4 {
          margin: 0 0 16px 0;
          color: #8b5cf6;
          font-size: 18px;
        }

        .anonymous-access p {
          margin: 0 0 20px 0;
          color: #64748b;
          line-height: 1.6;
        }

        .anonymous-features {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: rgba(248, 250, 252, 0.8);
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .anonymous-feature {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #374151;
          font-size: 14px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .medical-record-container {
            padding: 16px;
          }

          .medical-record-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .medical-record-actions {
            justify-content: stretch;
          }

          .medical-record-actions .medical-btn {
            flex: 1;
            justify-content: center;
          }

          .medical-stats {
            grid-template-columns: 1fr;
          }

          .medical-search-section {
            flex-direction: column;
            align-items: stretch;
          }

          .medical-search-box {
            max-width: none;
          }

          .medical-filter-panel {
            grid-template-columns: 1fr;
          }

          .medical-bulk-actions {
            flex-direction: column;
            gap: 12px;
          }

          .medical-table-wrapper {
            font-size: 12px;
          }

          .medical-table {
            min-width: 1200px;
          }

          .medical-th,
          .medical-td {
            padding: 8px 6px;
          }

          .patient-cell {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .patient-avatar {
            width: 32px;
            height: 32px;
            font-size: 12px;
          }

          .medical-modal {
            width: 95%;
            height: 90vh;
            max-height: 90vh;
          }

          .medical-modal-header,
          .medical-modal-content,
          .medical-modal-actions {
            padding-left: 20px;
            padding-right: 20px;
          }

          .medical-form-row {
            grid-template-columns: 1fr;
          }

          .medical-modal-actions {
            flex-direction: column-reverse;
          }

          .medical-modal-actions .medical-btn {
            width: 100%;
            justify-content: center;
          }

          .record-info-grid {
            grid-template-columns: 1fr;
          }

          .image-list {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          }

          .image-gallery {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          }

          .security-features {
            gap: 12px;
          }

          .security-feature {
            flex-direction: column;
            text-align: center;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default SecureMedicalRecordManagement;