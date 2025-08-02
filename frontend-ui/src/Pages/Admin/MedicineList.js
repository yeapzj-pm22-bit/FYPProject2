import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Trash2, Filter, ChevronDown, ChevronUp, Pill, AlertTriangle, CheckCircle, XCircle, Eye, Download, RefreshCw, X, Package } from 'lucide-react';
import "./css/MedicineList.css";
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


    </div>
  );
};

export default ModernMedicineManagement;