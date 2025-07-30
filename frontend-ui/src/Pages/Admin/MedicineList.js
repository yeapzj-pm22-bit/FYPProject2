import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Trash2, Filter, ChevronDown, ChevronUp, Pill, AlertTriangle, CheckCircle, XCircle, Eye, Download, RefreshCw, X, Package } from 'lucide-react';
import {
  categoryOptions,
  dosageFormOptions,
  approvedIndicationOptions,
  sideEffectOptions,
  statusOptions,
  dosageFormUnits,
} from './medicineOptions';
const ModernMedicineManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    stockLevel: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    dosageForm: '',
    strength: '',
    unit: '',
    category: '',
    approvedIndication: '',
    sideEffects: [],
    manufacturer: '',
    status: 'active',
    quantity: 0
  });

  // Refill form states
  const [refillData, setRefillData] = useState({
    quantity: 0,
    expiry: '',
    reason: ''
  });


  // Mock medicine options (since user mentioned they have medicineOptions created)


  const reasonOptions = [
    { value: 'high_demand', label: 'High Demand' },
    { value: 'low_stock', label: 'Low Stock' },
    { value: 'seasonal_increase', label: 'Seasonal Increase' },
    { value: 'other', label: 'Other' }
  ];

  // Sample medicines data
  const [medicines, setMedicines] = useState([
    {
      id: 'M001',
      name: 'Paracetamol',
      dosageForm: 'tablet',
      strength: '500',
      unit: 'mg',
      indication: 'pain_relief',
      category: 'analgesics',
      quantity: 25,
      sideEffects: ['nausea', 'dizziness'],
      manufacturer: 'PharmaCorp Ltd',
      status: 'active',
      createdAt: '2024-01-15',
      lastUpdated: '2024-07-20'
    },
    {
      id: 'M002',
      name: 'Metformin',
      dosageForm: 'tablet',
      strength: '850',
      unit: 'mg',
      indication: 'diabetes',
      category: 'hypoglycemics',
      quantity: 60,
      sideEffects: ['nausea', 'stomach_upset', 'diarrhea'],
      manufacturer: 'MediPharm Inc',
      status: 'active',
      createdAt: '2024-02-10',
      lastUpdated: '2024-07-18'
    },
    {
      id: 'M003',
      name: 'Ibuprofen',
      dosageForm: 'tablet',
      strength: '400',
      unit: 'mg',
      indication: 'pain_relief',
      category: 'nsaids',
      quantity: 15,
      sideEffects: ['stomach_upset', 'dizziness'],
      manufacturer: 'HealthGen Ltd',
      status: 'active',
      createdAt: '2024-03-05',
      lastUpdated: '2024-07-25'
    },
    {
      id: 'M004',
      name: 'Amoxicillin',
      dosageForm: 'capsule',
      strength: '250',
      unit: 'mg',
      indication: 'infection',
      category: 'antibiotics',
      quantity: 40,
      sideEffects: ['nausea', 'diarrhea'],
      manufacturer: 'BioMed Solutions',
      status: 'active',
      createdAt: '2024-04-12',
      lastUpdated: '2024-07-22'
    },
    {
      id: 'M005',
      name: 'Aspirin',
      dosageForm: 'tablet',
      strength: '100',
      unit: 'mg',
      indication: 'cardiovascular',
      category: 'antiplatelets',
      quantity: 5,
      sideEffects: ['stomach_upset', 'bleeding'],
      manufacturer: 'CardioPharm',
      status: 'inactive',
      createdAt: '2024-05-18',
      lastUpdated: '2024-07-15'
    }
  ]);

  // Real-time search and filter
  const filteredMedicines = useMemo(() => {
    let filtered = medicines.filter(medicine => {
      const matchesSearch =
        medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filters.status === 'all' || medicine.status === filters.status;
      const matchesCategory = filters.category === 'all' || medicine.category === filters.category;

      let matchesStockLevel = true;
      if (filters.stockLevel !== 'all') {
        switch (filters.stockLevel) {
          case 'low':
            matchesStockLevel = medicine.quantity < 30;
            break;
          case 'medium':
            matchesStockLevel = medicine.quantity >= 30 && medicine.quantity < 100;
            break;
          case 'high':
            matchesStockLevel = medicine.quantity >= 100;
            break;
          default:
            matchesStockLevel = true;
        }
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesStockLevel;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.key === 'createdAt' || sortConfig.key === 'lastUpdated') {
          const aDate = new Date(aValue);
          const bDate = new Date(bValue);
          return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
        }

        if (sortConfig.key === 'quantity') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
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
  }, [medicines, searchQuery, filters, sortConfig]);

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle medicine selection
  const handleSelectMedicine = (medicineId) => {
    setSelectedMedicines(prev =>
      prev.includes(medicineId)
        ? prev.filter(id => id !== medicineId)
        : [...prev, medicineId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMedicines.length === filteredMedicines.length) {
      setSelectedMedicines([]);
    } else {
      setSelectedMedicines(filteredMedicines.map(medicine => medicine.id));
    }
  };

  // Modal handlers
  const handleCreateMedicine = () => {
    setFormData({
      name: '',
      dosageForm: '',
      strength: '',
      unit: '',
      category: '',
      approvedIndication: '',
      sideEffects: [],
      manufacturer: '',
      status: 'active',
      quantity: 0
    });
    setShowCreateModal(true);
  };

  const handleViewMedicine = (medicine) => {
    setSelectedMedicine(medicine);
    setShowViewModal(true);
  };

  const handleEditMedicine = (medicine) => {
    setSelectedMedicine(medicine);
    setFormData({
      name: medicine.name,
      dosageForm: medicine.dosageForm,
      strength: medicine.strength,
      unit: medicine.unit,
      category: medicine.category,
      approvedIndication: medicine.indication,
      sideEffects: medicine.sideEffects,
      manufacturer: medicine.manufacturer,
      status: medicine.status,
      quantity: medicine.quantity
    });
    setShowEditModal(true);
  };

  const handleDeleteMedicine = (medicineId) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      setMedicines(prev => prev.filter(medicine => medicine.id !== medicineId));
      setSelectedMedicines(prev => prev.filter(id => id !== medicineId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedMedicines.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedMedicines.length} selected medicines?`)) {
      setMedicines(prev => prev.filter(medicine => !selectedMedicines.includes(medicine.id)));
      setSelectedMedicines([]);
    }
  };

  const handleRequestRefill = (medicine) => {
    setSelectedMedicine(medicine);
    setRefillData({
      quantity: 0,
      expiry: '',
      reason: ''
    });
    setShowRefillModal(true);
  };

  // Form handlers
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-set unit when dosage form changes
    if (field === 'dosageForm') {
      const unit = dosageFormUnits[value] || '';
      setFormData(prev => ({
        ...prev,
        unit: unit
      }));
    }
  };

  const handleRefillChange = (field, value) => {
    setRefillData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitForm = () => {
    // Validate required fields
    const requiredFields = ['name', 'dosageForm', 'strength', 'category', 'approvedIndication', 'manufacturer'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    const newMedicine = {
      id: `M${String(medicines.length + 1).padStart(3, '0')}`,
      name: formData.name,
      dosageForm: formData.dosageForm,
      strength: formData.strength,
      unit: formData.unit,
      indication: formData.approvedIndication,
      category: formData.category,
      quantity: formData.quantity || 0,
      sideEffects: formData.sideEffects,
      manufacturer: formData.manufacturer,
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    if (showEditModal && selectedMedicine) {
      setMedicines(prev => prev.map(medicine =>
        medicine.id === selectedMedicine.id ? { ...newMedicine, id: selectedMedicine.id } : medicine
      ));
      setShowEditModal(false);
    } else {
      setMedicines(prev => [...prev, newMedicine]);
      setShowCreateModal(false);
    }

    setSelectedMedicine(null);
  };

  const handleSubmitRefill = () => {
    if (!refillData.quantity || !refillData.expiry || !refillData.reason) {
      alert('Please fill in all refill request fields');
      return;
    }

    console.log('Refill request submitted:', {
      medicine: selectedMedicine,
      ...refillData
    });

    setShowRefillModal(false);
    setSelectedMedicine(null);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setShowRefillModal(false);
    setSelectedMedicine(null);
    setFormData({
      name: '',
      dosageForm: '',
      strength: '',
      unit: '',
      category: '',
      approvedIndication: '',
      sideEffects: [],
      manufacturer: '',
      status: 'active',
      quantity: 0
    });
    setRefillData({
      quantity: 0,
      expiry: '',
      reason: ''
    });
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      'active': 'medicine-badge success',
      'inactive': 'medicine-badge warning',
      'discontinued': 'medicine-badge danger'
    };
    return styles[status] || 'medicine-badge default';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle size={12} />;
      case 'inactive': return <AlertTriangle size={12} />;
      case 'discontinued': return <XCircle size={12} />;
      default: return <Package size={12} />;
    }
  };

  const getStockLevelBadge = (quantity) => {
    if (quantity < 30) return 'medicine-badge danger';
    if (quantity < 100) return 'medicine-badge warning';
    return 'medicine-badge success';
  };

  const getStockLevelText = (quantity) => {
    if (quantity < 30) return 'Low Stock';
    if (quantity < 100) return 'Medium Stock';
    return 'High Stock';
  };

  // Get option label by value
  const getOptionLabel = (options, value) => {
    for (const group of options) {
      const option = group.options?.find(opt => opt.value === value) || group.find?.(opt => opt.value === value);
      if (option) return option.label;
    }
    return value;
  };

  return (
    <div className="medicine-management-container">
      {/* Header */}
      <div className="medicine-management-header">
        <div className="medicine-management-title-section">
          <h2>Medicine Management</h2>
          <p>Manage medicine inventory, prescriptions, and stock levels</p>
        </div>
        <div className="medicine-management-actions">
          <button className="medicine-btn secondary" onClick={() => window.location.reload()}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="medicine-btn secondary">
            <Download size={16} />
            Export
          </button>
          <button className="medicine-btn primary" onClick={handleCreateMedicine}>
            <Plus size={16} />
            Add Medicine
          </button>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <>
          <div className="medicine-modal-backdrop" onClick={closeModal}></div>
          <div className="medicine-modal large">
            <div className="medicine-modal-header">
              <h3>{showEditModal ? 'Edit Medicine' : 'Create New Medicine'}</h3>
              <button className="medicine-modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="medicine-modal-content">
              <div className="medicine-form">
                <div className="medicine-form-row">
                  <div className="medicine-form-group">
                    <label>Medicine Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      placeholder="Enter medicine name"
                      className="medicine-form-input"
                    />
                  </div>
                  <div className="medicine-form-group">
                    <label>Dosage Form *</label>
                    <select
                      value={formData.dosageForm}
                      onChange={(e) => handleFormChange('dosageForm', e.target.value)}
                      className="medicine-form-select"
                    >
                      <option value="">-- Select Dosage Form --</option>
                      {dosageFormOptions.map(group => (
                        <optgroup key={group.label} label={group.label}>
                          {group.options.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="medicine-form-row">
                  <div className="medicine-form-group">
                    <label>Strength *</label>
                    <input
                      type="text"
                      value={formData.strength}
                      onChange={(e) => handleFormChange('strength', e.target.value)}
                      placeholder="e.g. 500"
                      className="medicine-form-input"
                    />
                  </div>
                  <div className="medicine-form-group">
                    <label>Unit</label>
                    <input
                      type="text"
                      value={formData.unit}
                      readOnly
                      className="medicine-form-input readonly"
                    />
                  </div>
                </div>

                <div className="medicine-form-row">
                  <div className="medicine-form-group">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="medicine-form-select"
                    >
                      <option value="">-- Select Category --</option>
                      {categoryOptions.map(group => (
                        <optgroup key={group.label} label={group.label}>
                          {group.options.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div className="medicine-form-group">
                    <label>Approved Indication *</label>
                    <select
                      value={formData.approvedIndication}
                      onChange={(e) => handleFormChange('approvedIndication', e.target.value)}
                      className="medicine-form-select"
                    >
                      <option value="">-- Select Indication --</option>
                      {approvedIndicationOptions.map(group => (
                        <optgroup key={group.label} label={group.label}>
                          {group.options.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="medicine-form-row">
                  <div className="medicine-form-group">
                    <label>Side Effects *</label>
                    <div className="multi-select-container">
                      {sideEffectOptions.map(group => (
                        <div key={group.label} className="option-group">
                          <div className="group-label">{group.label}</div>
                          {group.options.map(option => (
                            <label key={option.value} className="checkbox-option">
                              <input
                                type="checkbox"
                                checked={formData.sideEffects.includes(option.value)}
                                onChange={(e) => {
                                  const newSideEffects = e.target.checked
                                    ? [...formData.sideEffects, option.value]
                                    : formData.sideEffects.filter(effect => effect !== option.value);
                                  handleFormChange('sideEffects', newSideEffects);
                                }}
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="medicine-form-group">
                    <label>Manufacturer Name *</label>
                    <input
                      type="text"
                      value={formData.manufacturer}
                      onChange={(e) => handleFormChange('manufacturer', e.target.value)}
                      placeholder="Enter manufacturer name"
                      className="medicine-form-input"
                    />
                  </div>
                </div>

                <div className="medicine-form-row">
                  <div className="medicine-form-group">
                    <label>Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleFormChange('status', e.target.value)}
                      className="medicine-form-select"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="medicine-form-group">
                    <label>Initial Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => handleFormChange('quantity', parseInt(e.target.value) || 0)}
                      placeholder="Enter initial quantity"
                      className="medicine-form-input"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="medicine-modal-actions">
              <button className="medicine-btn secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="medicine-btn primary" onClick={handleSubmitForm}>
                {showEditModal ? 'Update Medicine' : 'Create Medicine'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* View Modal */}
      {showViewModal && selectedMedicine && (
        <>
          <div className="medicine-modal-backdrop" onClick={() => setShowViewModal(false)}></div>
          <div className="medicine-modal large">
            <div className="medicine-modal-header">
              <h3>Medicine Details - {selectedMedicine.name}</h3>
              <button className="medicine-modal-close" onClick={() => setShowViewModal(false)}>×</button>
            </div>
            <div className="medicine-modal-content">
              <div className="view-medicine-content">
                <div className="medicine-info-grid">
                  <div className="info-item">
                    <label>Medicine ID:</label>
                    <span>{selectedMedicine.id}</span>
                  </div>
                  <div className="info-item">
                    <label>Medicine Name:</label>
                    <span>{selectedMedicine.name}</span>
                  </div>
                  <div className="info-item">
                    <label>Dosage Form:</label>
                    <span>{getOptionLabel(dosageFormOptions, selectedMedicine.dosageForm)}</span>
                  </div>
                  <div className="info-item">
                    <label>Strength:</label>
                    <span>{selectedMedicine.strength} {selectedMedicine.unit}</span>
                  </div>
                  <div className="info-item">
                    <label>Category:</label>
                    <span>{getOptionLabel(categoryOptions, selectedMedicine.category)}</span>
                  </div>
                  <div className="info-item">
                    <label>Indication:</label>
                    <span>{getOptionLabel(approvedIndicationOptions, selectedMedicine.indication)}</span>
                  </div>
                  <div className="info-item">
                    <label>Manufacturer:</label>
                    <span>{selectedMedicine.manufacturer}</span>
                  </div>
                  <div className="info-item">
                    <label>Status:</label>
                    <span className={getStatusBadge(selectedMedicine.status)}>
                      {getStatusIcon(selectedMedicine.status)}
                      {selectedMedicine.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Current Stock:</label>
                    <span className={getStockLevelBadge(selectedMedicine.quantity)}>
                      {selectedMedicine.quantity} units - {getStockLevelText(selectedMedicine.quantity)}
                    </span>
                  </div>
                </div>

                {selectedMedicine.sideEffects.length > 0 && (
                  <div className="side-effects-section">
                    <label>Side Effects:</label>
                    <div className="side-effects-list">
                      {selectedMedicine.sideEffects.map((effect, index) => (
                        <span key={index} className="side-effect-tag">
                          {getOptionLabel(sideEffectOptions, effect)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="medicine-dates">
                  <div className="info-item">
                    <label>Created:</label>
                    <span>{new Date(selectedMedicine.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <label>Last Updated:</label>
                    <span>{new Date(selectedMedicine.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="medicine-modal-actions">
              <button className="medicine-btn secondary" onClick={() => setShowViewModal(false)}>
                Close
              </button>
              {selectedMedicine.quantity < 30 && (
                <button className="medicine-btn warning" onClick={() => {
                  setShowViewModal(false);
                  handleRequestRefill(selectedMedicine);
                }}>
                  Request Refill
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Refill Modal */}
      {showRefillModal && selectedMedicine && (
        <>
          <div className="medicine-modal-backdrop" onClick={() => setShowRefillModal(false)}></div>
          <div className="medicine-modal medium">
            <div className="medicine-modal-header">
              <h3>Request Refill - {selectedMedicine.name}</h3>
              <button className="medicine-modal-close" onClick={() => setShowRefillModal(false)}>×</button>
            </div>
            <div className="medicine-modal-content">
              <div className="medicine-form">
                <div className="medicine-form-row">
                  <div className="medicine-form-group">
                    <label>Medicine Name</label>
                    <input
                      type="text"
                      value={selectedMedicine.name}
                      readOnly
                      className="medicine-form-input readonly"
                    />
                  </div>
                  <div className="medicine-form-group">
                    <label>Current Stock</label>
                    <input
                      type="text"
                      value={`${selectedMedicine.quantity} units`}
                      readOnly
                      className="medicine-form-input readonly"
                    />
                  </div>
                </div>
                <div className="medicine-form-row">
                  <div className="medicine-form-group">
                    <label>Quantity to Request *</label>
                    <input
                      type="number"
                      value={refillData.quantity}
                      onChange={(e) => handleRefillChange('quantity', parseInt(e.target.value) || 0)}
                      placeholder="Enter quantity"
                      className="medicine-form-input"
                      min="1"
                    />
                  </div>
                  <div className="medicine-form-group">
                    <label>Expected Expiry Date *</label>
                    <input
                      type="date"
                      value={refillData.expiry}
                      onChange={(e) => handleRefillChange('expiry', e.target.value)}
                      className="medicine-form-input"
                    />
                  </div>
                </div>
                <div className="medicine-form-row">
                  <div className="medicine-form-group">
                    <label>Reason *</label>
                    <select
                      value={refillData.reason}
                      onChange={(e) => handleRefillChange('reason', e.target.value)}
                      className="medicine-form-select"
                    >
                      <option value="">-- Select Reason --</option>
                      {reasonOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="medicine-modal-actions">
              <button className="medicine-btn secondary" onClick={() => setShowRefillModal(false)}>
                Cancel
              </button>
              <button className="medicine-btn primary" onClick={handleSubmitRefill}>
                Submit Request
              </button>
            </div>
          </div>
        </>
      )}

      {/* Stats Cards */}
      <div className="medicine-stats">
        <div className="medicine-stat-card total">
          <div className="medicine-stat-icon">
            <Pill size={24} />
          </div>
          <div className="medicine-stat-content">
            <h3>{medicines.length}</h3>
            <p>Total Medicines</p>
          </div>
        </div>
        <div className="medicine-stat-card active">
          <div className="medicine-stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="medicine-stat-content">
            <h3>{medicines.filter(m => m.status === 'active').length}</h3>
            <p>Active</p>
          </div>
        </div>
        <div className="medicine-stat-card low-stock">
          <div className="medicine-stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="medicine-stat-content">
            <h3>{medicines.filter(m => m.quantity < 30).length}</h3>
            <p>Low Stock</p>
          </div>
        </div>
        <div className="medicine-stat-card inactive">
          <div className="medicine-stat-icon">
            <XCircle size={24} />
          </div>
          <div className="medicine-stat-content">
            <h3>{medicines.filter(m => m.status === 'inactive').length}</h3>
            <p>Inactive</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="medicine-controls">
        <div className="medicine-search-section">
          <div className="medicine-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by name, ID, manufacturer, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="medicine-search-input"
            />
          </div>
          <button
            className={`medicine-btn secondary ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedMedicines.length > 0 && (
          <div className="medicine-bulk-actions">
            <span className="medicine-selected-count">
              {selectedMedicines.length} medicine{selectedMedicines.length > 1 ? 's' : ''} selected
            </span>
            <div className="medicine-bulk-buttons">
              <button className="medicine-btn danger small" onClick={handleBulkDelete}>
                <Trash2 size={14} />
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="medicine-filter-panel">
            <div className="medicine-filter-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
            <div className="medicine-filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="all">All Categories</option>
                {categoryOptions.map(group => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div className="medicine-filter-group">
              <label>Stock Level</label>
              <select
                value={filters.stockLevel}
                onChange={(e) => setFilters(prev => ({ ...prev, stockLevel: e.target.value }))}
              >
                <option value="all">All Levels</option>
                <option value="low">Low Stock (&lt;30)</option>
                <option value="medium">Medium Stock (30-99)</option>
                <option value="high">High Stock (≥100)</option>
              </select>
            </div>
            <button
              className="medicine-btn secondary small"
              onClick={() => setFilters({ status: 'all', category: 'all', stockLevel: 'all' })}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Medicines Table */}
      <div className="medicine-table-container">
        <div className="medicine-table-wrapper">
          <table className="medicine-table">
            <thead>
              <tr>
                <th className="medicine-th checkbox">
                  <input
                    type="checkbox"
                    checked={filteredMedicines.length > 0 && selectedMedicines.length === filteredMedicines.length}
                    onChange={handleSelectAll}
                    className="medicine-checkbox"
                  />
                </th>
                <th className="medicine-th sortable" onClick={() => handleSort('id')}>
                  Medicine ID
                  {sortConfig.key === 'id' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                <th className="medicine-th sortable" onClick={() => handleSort('name')}>
                  Medicine Name
                  {sortConfig.key === 'name' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                <th className="medicine-th">Dosage Form</th>
                <th className="medicine-th">Strength</th>
                <th className="medicine-th">Category</th>
                <th className="medicine-th sortable" onClick={() => handleSort('quantity')}>
                  Stock Level
                  {sortConfig.key === 'quantity' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                <th className="medicine-th">Status</th>
                <th className="medicine-th">Manufacturer</th>
                <th className="medicine-th actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map(medicine => (
                <tr key={medicine.id} className={selectedMedicines.includes(medicine.id) ? 'selected' : ''}>
                  <td className="medicine-td checkbox">
                    <input
                      type="checkbox"
                      checked={selectedMedicines.includes(medicine.id)}
                      onChange={() => handleSelectMedicine(medicine.id)}
                      className="medicine-checkbox"
                    />
                  </td>
                  <td className="medicine-td">
                    <span className="medicine-id">{medicine.id}</span>
                  </td>
                  <td className="medicine-td">
                    <div className="medicine-name-cell">
                      <div className="medicine-avatar">
                        <Pill size={16} />
                      </div>
                      <div className="medicine-info">
                        <div className="medicine-name">{medicine.name}</div>
                        <div className="medicine-indication">{getOptionLabel(approvedIndicationOptions, medicine.indication)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="medicine-td">
                    <span className="dosage-form">{getOptionLabel(dosageFormOptions, medicine.dosageForm)}</span>
                  </td>
                  <td className="medicine-td">
                    <span className="strength">{medicine.strength} {medicine.unit}</span>
                  </td>
                  <td className="medicine-td">
                    <span className="category">{getOptionLabel(categoryOptions, medicine.category)}</span>
                  </td>
                  <td className="medicine-td">
                    <div className="stock-level">
                      <span className={getStockLevelBadge(medicine.quantity)}>
                        {medicine.quantity} units
                      </span>
                      {medicine.quantity < 30 && (
                        <button
                          className="refill-link"
                          onClick={() => handleRequestRefill(medicine)}
                        >
                          Request Refill
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="medicine-td">
                    <div className={getStatusBadge(medicine.status)}>
                      {getStatusIcon(medicine.status)}
                      <span>{medicine.status.toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="medicine-td">
                    <span className="manufacturer">{medicine.manufacturer}</span>
                  </td>
                  <td className="medicine-td actions">
                    <div className="medicine-action-buttons">
                      <button
                        className="medicine-action-btn view"
                        title="View Medicine"
                        onClick={() => handleViewMedicine(medicine)}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="medicine-action-btn edit"
                        title="Edit Medicine"
                        onClick={() => handleEditMedicine(medicine)}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="medicine-action-btn delete"
                        title="Delete Medicine"
                        onClick={() => handleDeleteMedicine(medicine.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredMedicines.length === 0 && (
            <div className="medicine-no-results">
              <Pill size={48} />
              <p>No medicines found</p>
              <span>Try adjusting your search or filter criteria</span>
            </div>
          )}
        </div>

        {/* Table Footer */}
        <div className="medicine-table-footer">
          <div className="medicine-table-info">
            Showing {filteredMedicines.length} of {medicines.length} medicines
          </div>
        </div>
      </div>

      <style jsx>{`
        .medicine-management-container {
          padding: 24px 32px;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .medicine-management-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .medicine-management-title-section h2 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 600;
          color: #1e293b;
        }

        .medicine-management-title-section p {
          margin: 0;
          color: #64748b;
          font-size: 16px;
        }

        .medicine-management-actions {
          display: flex;
          gap: 12px;
        }

        .medicine-btn {
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

        .medicine-btn.small {
          padding: 8px 12px;
          font-size: 12px;
        }

        .medicine-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .medicine-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .medicine-btn.primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .medicine-btn.secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #64748b;
          border: 1px solid rgba(226, 232, 240, 0.8);
          backdrop-filter: blur(10px);
        }

        .medicine-btn.secondary:hover,
        .medicine-btn.secondary.active {
          background: rgba(255, 255, 255, 1);
          border-color: #667eea;
          color: #667eea;
        }

        .medicine-btn.warning {
          background: #f59e0b;
          color: white;
        }

        .medicine-btn.warning:hover {
          background: #d97706;
          transform: translateY(-2px);
        }

        .medicine-btn.danger {
          background: #ef4444;
          color: white;
        }

        .medicine-btn.danger:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        .medicine-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .medicine-stat-card {
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

        .medicine-stat-card:hover {
          transform: translateY(-2px);
        }

        .medicine-stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .medicine-stat-card.total .medicine-stat-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .medicine-stat-card.active .medicine-stat-icon {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
        }

        .medicine-stat-card.low-stock .medicine-stat-icon {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .medicine-stat-card.inactive .medicine-stat-icon {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .medicine-stat-content h3 {
          margin: 0 0 4px 0;
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }

        .medicine-stat-content p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .medicine-controls {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .medicine-search-section {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .medicine-search-box {
          position: relative;
          flex: 1;
          max-width: 600px;
        }

        .medicine-search-box svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          z-index: 1;
        }

        .medicine-search-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .medicine-search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .medicine-bulk-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 12px;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .medicine-selected-count {
          color: #667eea;
          font-weight: 500;
        }

        .medicine-bulk-buttons {
          display: flex;
          gap: 8px;
        }

        .medicine-filter-panel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          padding: 16px;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .medicine-filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .medicine-filter-group label {
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .medicine-filter-group select {
          padding: 8px 12px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          cursor: pointer;
        }

        .medicine-table-container {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          overflow: hidden;
        }

        .medicine-table-wrapper {
          overflow-x: auto;
        }

        .medicine-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          min-width: 1400px;
        }

        .medicine-th {
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

        .medicine-th.sortable {
          cursor: pointer;
          user-select: none;
          transition: all 0.2s ease;
        }

        .medicine-th.sortable:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .medicine-th.sortable svg {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
        }

        .medicine-th.checkbox {
          width: 50px;
          text-align: center;
        }

        .medicine-th.actions {
          width: 120px;
          text-align: center;
        }

        .medicine-td {
          padding: 16px 12px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.3);
          font-size: 14px;
          color: #374151;
        }

        .medicine-td.checkbox {
          text-align: center;
        }

        .medicine-td.actions {
          text-align: center;
        }

        .medicine-table tbody tr {
          transition: all 0.2s ease;
        }

        .medicine-table tbody tr:hover {
          background: rgba(102, 126, 234, 0.05);
        }

        .medicine-table tbody tr.selected {
          background: rgba(102, 126, 234, 0.1);
        }

        .medicine-checkbox {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .medicine-id {
          font-family: monospace;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .medicine-name-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .medicine-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .medicine-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .medicine-name {
          font-weight: 500;
          color: #1e293b;
        }

        .medicine-indication {
          font-size: 12px;
          color: #64748b;
        }

        .dosage-form, .strength, .category, .manufacturer {
          color: #64748b;
          font-size: 13px;
        }

        .stock-level {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .refill-link {
          background: none;
          border: none;
          color: #f59e0b;
          cursor: pointer;
          font-size: 12px;
          text-decoration: underline;
        }

        .refill-link:hover {
          color: #d97706;
        }

        .medicine-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .medicine-badge.success {
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
        }

        .medicine-badge.warning {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .medicine-badge.danger {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .medicine-badge.default {
          background: rgba(148, 163, 184, 0.1);
          color: #94a3b8;
        }

        .medicine-action-buttons {
          display: flex;
          gap: 4px;
          justify-content: center;
        }

        .medicine-action-btn {
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

        .medicine-action-btn.view {
          color: #3b82f6;
        }

        .medicine-action-btn.view:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .medicine-action-btn.edit {
          color: #16a34a;
        }

        .medicine-action-btn.edit:hover {
          background: #16a34a;
          color: white;
          border-color: #16a34a;
        }

        .medicine-action-btn.delete {
          color: #ef4444;
        }

        .medicine-action-btn.delete:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }

        .medicine-no-results {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .medicine-no-results svg {
          color: #94a3b8;
          margin-bottom: 16px;
        }

        .medicine-no-results span {
          color: #94a3b8;
          font-size: 14px;
        }

        .medicine-table-footer {
          padding: 16px 24px;
          background: rgba(248, 250, 252, 0.8);
          border-top: 1px solid rgba(226, 232, 240, 0.6);
        }

        .medicine-table-info {
          color: #64748b;
          font-size: 14px;
        }

        /* Modal Styles */
        .medicine-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .medicine-modal {
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

        .medicine-modal.medium {
          max-width: 600px;
        }

        .medicine-modal.large {
          max-width: 900px;
        }

        .medicine-modal-header {
          padding: 24px 32px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          margin-bottom: 24px;
          padding-bottom: 16px;
        }

        .medicine-modal-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }

        .medicine-modal-close {
          background: none;
          border: none;
          font-size: 24px;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
          transition: color 0.2s ease;
        }

        .medicine-modal-close:hover {
          color: #ef4444;
        }

        .medicine-modal-content {
          padding: 0 32px 32px;
        }

        .medicine-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 24px 32px;
          border-top: 1px solid rgba(226, 232, 240, 0.6);
          background: rgba(248, 250, 252, 0.5);
        }

        /* Form Styles */
        .medicine-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .medicine-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .medicine-form-row:has(.medicine-form-group:only-child) {
          grid-template-columns: 1fr;
        }

        .medicine-form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .medicine-form-group label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        .medicine-form-input,
        .medicine-form-select {
          padding: 12px 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          transition: all 0.2s ease;
          color: #374151;
        }

        .medicine-form-input:focus,
        .medicine-form-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .medicine-form-input.readonly {
          background: rgba(248, 250, 252, 0.8);
          cursor: not-allowed;
        }

        .medicine-form-select {
          cursor: pointer;
        }

        .multi-select-container {
          max-height: 200px;
          overflow-y: auto;
          padding: 12px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
        }

        .option-group {
          margin-bottom: 16px;
        }

        .group-label {
          font-weight: 600;
          color: #374151;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          padding-bottom: 4px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
        }

        .checkbox-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 0;
          cursor: pointer;
        }

        .checkbox-option input[type="checkbox"] {
          width: 16px;
          height: 16px;
        }

        .checkbox-option span {
          font-size: 14px;
          color: #374151;
        }

        /* View Modal Content */
        .view-medicine-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .medicine-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

        .side-effects-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .side-effects-section label {
          font-weight: 500;
          color: #64748b;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .side-effects-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .side-effect-tag {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .medicine-dates {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(226, 232, 240, 0.6);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .medicine-management-container {
            padding: 16px;
          }

          .medicine-management-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .medicine-management-actions {
            justify-content: stretch;
          }

          .medicine-management-actions .medicine-btn {
            flex: 1;
            justify-content: center;
          }

          .medicine-stats {
            grid-template-columns: 1fr;
          }

          .medicine-search-section {
            flex-direction: column;
            align-items: stretch;
          }

          .medicine-search-box {
            max-width: none;
          }

          .medicine-filter-panel {
            grid-template-columns: 1fr;
          }

          .medicine-bulk-actions {
            flex-direction: column;
            gap: 12px;
          }

          .medicine-table-wrapper {
            font-size: 12px;
          }

          .medicine-table {
            min-width: 1200px;
          }

          .medicine-th,
          .medicine-td {
            padding: 8px 6px;
          }

          .medicine-name-cell {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .medicine-avatar {
            width: 32px;
            height: 32px;
          }

          .medicine-modal {
            width: 95%;
            height: 90vh;
            max-height: 90vh;
          }

          .medicine-modal-header,
          .medicine-modal-content,
          .medicine-modal-actions {
            padding-left: 20px;
            padding-right: 20px;
          }

          .medicine-form-row {
            grid-template-columns: 1fr;
          }

          .medicine-modal-actions {
            flex-direction: column-reverse;
          }

          .medicine-modal-actions .medicine-btn {
            width: 100%;
            justify-content: center;
          }

          .medicine-info-grid {
            grid-template-columns: 1fr;
          }

          .medicine-dates {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ModernMedicineManagement;