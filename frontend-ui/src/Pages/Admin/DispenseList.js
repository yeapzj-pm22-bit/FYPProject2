import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Eye, Filter, ChevronDown, ChevronUp, Package, Clock, CheckCircle, AlertCircle, Users, Download, RefreshCw, Pill, X } from 'lucide-react';
import "./css/DispenseList.css";
const ModernDispenseList = () => {
  const [activeTab, setActiveTab] = useState('dispense');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDispenses, setSelectedDispenses] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    status: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showDispenseModal, setShowDispenseModal] = useState(false);
  const [selectedDispense, setSelectedDispense] = useState(null);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [selectedRefillStatus, setSelectedRefillStatus] = useState('Pending');

  // Sample dispense data
  const [dispenseRecords] = useState([
    {
      id: 'D001',
      patientName: 'John Doe',
      patientId: 'P001',
      dispenseDate: '2024-07-29',
      totalMedicines: 2,
      medicines: [
        { id: 'M001', name: 'Amoxicillin', quantity: 15, dosage: '500mg', instructions: 'Take with food' },
        { id: 'M002', name: 'Paracetamol', quantity: 10, dosage: '650mg', instructions: 'As needed for pain' },
      ],
      status: 'Active',
      dispensedBy: 'Dr. Sarah Wilson',
      createdAt: '2024-07-29',
      notes: 'Patient allergic to penicillin alternatives'
    },
    {
      id: 'D002',
      patientName: 'Jane Smith',
      patientId: 'P002',
      dispenseDate: '2024-07-28',
      totalMedicines: 1,
      medicines: [
        { id: 'M003', name: 'Ibuprofen', quantity: 20, dosage: '400mg', instructions: 'Take after meals' },
      ],
      status: 'Completed',
      dispensedBy: 'Dr. Michael Chen',
      createdAt: '2024-07-28',
      notes: 'Follow-up required in 2 weeks'
    },
    {
      id: 'D003',
      patientName: 'Alice Johnson',
      patientId: 'P003',
      dispenseDate: '2024-07-27',
      totalMedicines: 3,
      medicines: [
        { id: 'M004', name: 'Metformin', quantity: 30, dosage: '500mg', instructions: 'Twice daily with meals' },
        { id: 'M005', name: 'Lisinopril', quantity: 30, dosage: '10mg', instructions: 'Once daily in morning' },
        { id: 'M006', name: 'Atorvastatin', quantity: 30, dosage: '20mg', instructions: 'Once daily in evening' },
      ],
      status: 'Pending',
      dispensedBy: 'Dr. Emma Johnson',
      createdAt: '2024-07-27',
      notes: 'Monitor blood pressure regularly'
    },
    {
      id: 'D004',
      patientName: 'Robert Brown',
      patientId: 'P004',
      dispenseDate: '2024-07-26',
      totalMedicines: 2,
      medicines: [
        { id: 'M007', name: 'Omeprazole', quantity: 14, dosage: '20mg', instructions: 'Once daily before breakfast' },
        { id: 'M008', name: 'Simethicone', quantity: 20, dosage: '40mg', instructions: 'After meals and at bedtime' },
      ],
      status: 'Completed',
      dispensedBy: 'Dr. Sarah Wilson',
      createdAt: '2024-07-26',
      notes: 'Complete course as prescribed'
    }
  ]);

  // Sample refill request data
  const [refillRequests, setRefillRequests] = useState([
    {
      id: 'R001',
      patientName: 'John Doe',
      patientId: 'P001',
      requestDate: '2024-07-30',
      totalMedicines: 2,
      medicines: [
        { id: 'M001', name: 'Amoxicillin', quantity: 15, dosage: '500mg', instructions: 'Take with food' },
        { id: 'M002', name: 'Paracetamol', quantity: 10, dosage: '650mg', instructions: 'As needed for pain' },
      ],
      status: 'Pending',
      requestedBy: 'Patient',
      createdAt: '2024-07-30',
      notes: 'Patient reports good response to current medication'
    },
    {
      id: 'R002',
      patientName: 'Jane Smith',
      patientId: 'P002',
      requestDate: '2024-07-29',
      totalMedicines: 1,
      medicines: [
        { id: 'M003', name: 'Ibuprofen', quantity: 20, dosage: '400mg', instructions: 'Take after meals' },
      ],
      status: 'Approved',
      requestedBy: 'Patient',
      createdAt: '2024-07-29',
      notes: 'Previous prescription completed successfully'
    },
    {
      id: 'R003',
      patientName: 'Alice Johnson',
      patientId: 'P003',
      requestDate: '2024-07-28',
      totalMedicines: 1,
      medicines: [
        { id: 'M004', name: 'Metformin', quantity: 30, dosage: '500mg', instructions: 'Twice daily with meals' },
      ],
      status: 'Rejected',
      requestedBy: 'Patient',
      createdAt: '2024-07-28',
      notes: 'Requires doctor consultation before refill'
    }
  ]);

  // Filter and search records based on active tab
  const filteredRecords = useMemo(() => {
    const currentData = activeTab === 'dispense' ? dispenseRecords : refillRequests;

    let filtered = currentData.filter(record => {
      const searchField = activeTab === 'dispense' ? 'dispenseDate' : 'requestDate';
      const matchesSearch =
        record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.patientId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (activeTab === 'dispense' && record.dispensedBy?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        record.medicines.some(med =>
          med.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesStatus = filters.status === 'all' || record.status === filters.status;

      return matchesSearch && matchesStatus;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.key === 'dispenseDate' || sortConfig.key === 'requestDate' || sortConfig.key === 'createdAt') {
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
  }, [dispenseRecords, refillRequests, searchQuery, filters, sortConfig, activeTab]);

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle record selection
  const handleSelectDispense = (recordId) => {
    setSelectedDispenses(prev =>
      prev.includes(recordId)
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDispenses.length === filteredRecords.length) {
      setSelectedDispenses([]);
    } else {
      setSelectedDispenses(filteredRecords.map(record => record.id));
    }
  };

  // Handle modal
  const handleOpenDispenseModal = (record) => {
    setSelectedDispense(record);
    if (activeTab === 'dispense') {
      setSelectedMedicines([]);
    } else {
      setSelectedMedicines(record.medicines.map(med => med.id)); // Pre-select all for refill
      setSelectedRefillStatus(record.status);
    }
    setShowDispenseModal(true);
  };

  const handleMedicineToggle = (medicineId) => {
    setSelectedMedicines(prev =>
      prev.includes(medicineId)
        ? prev.filter(id => id !== medicineId)
        : [...prev, medicineId]
    );
  };

  const handleSelectAllMedicines = () => {
    if (selectedMedicines.length === selectedDispense?.medicines.length) {
      setSelectedMedicines([]);
    } else {
      setSelectedMedicines(selectedDispense?.medicines.map(med => med.id) || []);
    }
  };

  const handleDispenseSubmit = () => {
    if (activeTab === 'dispense') {
      // Handle dispense logic here
      console.log('Selected medicines for dispense:', selectedMedicines);
    } else {
      // Handle refill request status update
      setRefillRequests(prev => prev.map(request =>
        request.id === selectedDispense.id
          ? { ...request, status: selectedRefillStatus }
          : request
      ));
    }
    setShowDispenseModal(false);
  };

  const closeModal = () => {
    setShowDispenseModal(false);
    setSelectedDispense(null);
    setSelectedMedicines([]);
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      'Active': 'dispense-badge active',
      'Completed': 'dispense-badge completed',
      'Pending': 'dispense-badge pending',
      'Cancelled': 'dispense-badge cancelled',
      'Approved': 'dispense-badge completed',
      'Rejected': 'dispense-badge cancelled'
    };
    return styles[status] || 'dispense-badge default';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <Clock size={14} />;
      case 'Completed': return <CheckCircle size={14} />;
      case 'Pending': return <AlertCircle size={14} />;
      case 'Approved': return <CheckCircle size={14} />;
      case 'Rejected': return <X size={14} />;
      default: return <Package size={14} />;
    }
  };

  return (
    <div className="dispense-list-container">
      {/* Header */}
      <div className="dispense-list-header">
        <div className="dispense-list-title-section">
          <h2>Dispense Management</h2>
          <p>Manage medicine dispensing records and refill requests</p>
        </div>
        <div className="dispense-list-actions">
          <button className="dispense-btn secondary" onClick={() => window.location.reload()}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="dispense-btn secondary">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="dispense-tabs">
        <button
          className={`dispense-tab ${activeTab === 'dispense' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('dispense');
            setSelectedDispenses([]);
            setFilters({ status: 'all' });
          }}
        >
          <Package size={16} />
          Dispense Records
        </button>
        <button
          className={`dispense-tab ${activeTab === 'refill' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('refill');
            setSelectedDispenses([]);
            setFilters({ status: 'all' });
          }}
        >
          <Clock size={16} />
          Refill Requests
        </button>
      </div>

      {/* Stats Cards */}
      <div className="dispense-stats">
        <div className="dispense-stat-card total">
          <div className="dispense-stat-icon">
            <Package size={24} />
          </div>
          <div className="dispense-stat-content">
            <h3>{activeTab === 'dispense' ? dispenseRecords.length : refillRequests.length}</h3>
            <p>Total {activeTab === 'dispense' ? 'Dispenses' : 'Requests'}</p>
          </div>
        </div>
        <div className="dispense-stat-card active">
          <div className="dispense-stat-icon">
            {activeTab === 'dispense' ? <Clock size={24} /> : <AlertCircle size={24} />}
          </div>
          <div className="dispense-stat-content">
            <h3>
              {activeTab === 'dispense'
                ? dispenseRecords.filter(d => d.status === 'Active').length
                : refillRequests.filter(r => r.status === 'Pending').length
              }
            </h3>
            <p>{activeTab === 'dispense' ? 'Active' : 'Pending'}</p>
          </div>
        </div>
        <div className="dispense-stat-card completed">
          <div className="dispense-stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="dispense-stat-content">
            <h3>
              {activeTab === 'dispense'
                ? dispenseRecords.filter(d => d.status === 'Completed').length
                : refillRequests.filter(r => r.status === 'Approved').length
              }
            </h3>
            <p>{activeTab === 'dispense' ? 'Completed' : 'Approved'}</p>
          </div>
        </div>
        <div className="dispense-stat-card pending">
          <div className="dispense-stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="dispense-stat-content">
            <h3>
              {activeTab === 'dispense'
                ? dispenseRecords.filter(d => d.status === 'Pending').length
                : refillRequests.filter(r => r.status === 'Rejected').length
              }
            </h3>
            <p>{activeTab === 'dispense' ? 'Pending' : 'Rejected'}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="dispense-controls">
        <div className="dispense-search-section">
          <div className="dispense-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder={activeTab === 'dispense'
                ? "Search by patient name, dispense ID, medicine, or doctor..."
                : "Search by patient name, refill ID, or medicine..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="dispense-search-input"
            />
          </div>
          <button
            className={`dispense-btn secondary ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedDispenses.length > 0 && (
          <div className="dispense-bulk-actions">
            <span className="dispense-selected-count">
              {selectedDispenses.length} {activeTab === 'dispense' ? 'dispense' : 'request'}{selectedDispenses.length > 1 ? 's' : ''} selected
            </span>
            <div className="dispense-bulk-buttons">
              <button className="dispense-btn secondary small">
                <Package size={14} />
                Bulk Process
              </button>
            </div>
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="dispense-filter-panel">
            <div className="dispense-filter-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                {activeTab === 'dispense' ? (
                  <>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </>
                ) : (
                  <>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </>
                )}
              </select>
            </div>
            <button
              className="dispense-btn secondary small"
              onClick={() => setFilters({ status: 'all' })}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Dispense Table */}
      <div className="dispense-table-container">
        <div className="dispense-table-wrapper">
          <table className="dispense-table">
            <thead>
              <tr>
                <th className="dispense-th checkbox">
                  <input
                    type="checkbox"
                    checked={filteredRecords.length > 0 && selectedDispenses.length === filteredRecords.length}
                    onChange={handleSelectAll}
                    className="dispense-checkbox"
                  />
                </th>
                <th className="dispense-th sortable" onClick={() => handleSort('id')}>
                  {activeTab === 'dispense' ? 'Dispense ID' : 'Refill ID'}
                  {sortConfig.key === 'id' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                <th className="dispense-th sortable" onClick={() => handleSort('patientName')}>
                  Patient
                  {sortConfig.key === 'patientName' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                <th className="dispense-th sortable" onClick={() => handleSort(activeTab === 'dispense' ? 'dispenseDate' : 'requestDate')}>
                  {activeTab === 'dispense' ? 'Dispense Date' : 'Request Date'}
                  {sortConfig.key === (activeTab === 'dispense' ? 'dispenseDate' : 'requestDate') && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                <th className="dispense-th">Medicines</th>
                {activeTab === 'dispense' && <th className="dispense-th">Dispensed By</th>}
                <th className="dispense-th">Status</th>
                <th className="dispense-th actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id} className={selectedDispenses.includes(record.id) ? 'selected' : ''}>
                  <td className="dispense-td checkbox">
                    <input
                      type="checkbox"
                      checked={selectedDispenses.includes(record.id)}
                      onChange={() => handleSelectDispense(record.id)}
                      className="dispense-checkbox"
                    />
                  </td>
                  <td className="dispense-td">
                    <span className="dispense-id">{record.id}</span>
                  </td>
                  <td className="dispense-td">
                    <div className="dispense-patient-cell">
                      <div className="dispense-avatar">
                        {record.patientName.charAt(0).toUpperCase()}
                      </div>
                      <div className="dispense-patient-info">
                        <div className="dispense-patient-name">{record.patientName}</div>
                        <div className="dispense-patient-id">{record.patientId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="dispense-td">
                    <span className="dispense-date">
                      {new Date(activeTab === 'dispense' ? record.dispenseDate : record.requestDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="dispense-td">
                    <div className="dispense-medicines">
                      <div className="dispense-medicine-count">
                        <Pill size={14} />
                        <span>{record.totalMedicines} medicine{record.totalMedicines > 1 ? 's' : ''}</span>
                      </div>
                      <div className="dispense-medicine-preview">
                        {record.medicines.slice(0, 2).map((med, index) => (
                          <span key={index} className="dispense-medicine-tag">
                            {med.name}
                          </span>
                        ))}
                        {record.medicines.length > 2 && (
                          <span className="dispense-medicine-more">
                            +{record.medicines.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  {activeTab === 'dispense' && (
                    <td className="dispense-td">
                      <span className="dispense-doctor">{record.dispensedBy}</span>
                    </td>
                  )}
                  <td className="dispense-td">
                    <div className="dispense-status-cell">
                      {getStatusIcon(record.status)}
                      <span className={getStatusBadge(record.status)}>
                        {record.status}
                      </span>
                    </div>
                  </td>
                  <td className="dispense-td actions">
                    <div className="dispense-action-buttons">
                      <button
                        className="dispense-action-btn view"
                        title="View Details"
                        onClick={() => handleOpenDispenseModal(record)}
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRecords.length === 0 && (
            <div className="dispense-no-results">
              <Package size={48} />
              <p>No {activeTab === 'dispense' ? 'dispense records' : 'refill requests'} found</p>
              <span>Try adjusting your search or filter criteria</span>
            </div>
          )}
        </div>

        {/* Table Footer */}
        <div className="dispense-table-footer">
          <div className="dispense-table-info">
            Showing {filteredRecords.length} of {activeTab === 'dispense' ? dispenseRecords.length : refillRequests.length} {activeTab === 'dispense' ? 'dispense records' : 'refill requests'}
          </div>
        </div>
      </div>

      {/* Dispense Details Modal */}
      {showDispenseModal && selectedDispense && (
        <>
          <div className="dispense-modal-backdrop" onClick={closeModal}></div>
          <div className="dispense-modal large">
            <div className="dispense-modal-header">
              <h3>
                {activeTab === 'dispense' ? 'Dispense Details' : 'Refill Request'} - {selectedDispense.id}
              </h3>
              <button className="dispense-modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="dispense-modal-content">

              {/* Patient Information */}
              <div className="dispense-info-section">
                <h4>Patient Information</h4>
                <div className="dispense-info-grid">
                  <div className="dispense-info-item">
                    <label>Patient Name</label>
                    <span>{selectedDispense.patientName}</span>
                  </div>
                  <div className="dispense-info-item">
                    <label>Patient ID</label>
                    <span>{selectedDispense.patientId}</span>
                  </div>
                  <div className="dispense-info-item">
                    <label>{activeTab === 'dispense' ? 'Dispense Date' : 'Request Date'}</label>
                    <span>
                      {new Date(activeTab === 'dispense' ? selectedDispense.dispenseDate : selectedDispense.requestDate).toLocaleDateString()}
                    </span>
                  </div>
                  {activeTab === 'dispense' && (
                    <div className="dispense-info-item">
                      <label>Dispensed By</label>
                      <span>{selectedDispense.dispensedBy}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Medicine Selection */}
              <div className="dispense-medicine-section">
                <h4>{activeTab === 'dispense' ? 'Medicine Selection' : 'Requested Medicines'}</h4>
                {activeTab === 'dispense' && (
                  <div className="dispense-select-all">
                    <input
                      type="checkbox"
                      id="selectAllMedicines"
                      checked={selectedMedicines.length === selectedDispense.medicines.length}
                      onChange={handleSelectAllMedicines}
                      className="dispense-checkbox"
                    />
                    <label htmlFor="selectAllMedicines">Select All Medicines</label>
                  </div>
                )}

                <div className="dispense-medicine-list">
                  {selectedDispense.medicines.map((medicine) => (
                    <div key={medicine.id} className="dispense-medicine-item">
                      {activeTab === 'dispense' && (
                        <div className="dispense-medicine-checkbox">
                          <input
                            type="checkbox"
                            id={`medicine-${medicine.id}`}
                            checked={selectedMedicines.includes(medicine.id)}
                            onChange={() => handleMedicineToggle(medicine.id)}
                            className="dispense-checkbox"
                          />
                        </div>
                      )}
                      <div className="dispense-medicine-details">
                        <div className="dispense-medicine-main">
                          <h5>{medicine.name}</h5>
                          <div className="dispense-medicine-meta">
                            <span className="dispense-medicine-dosage">{medicine.dosage}</span>
                            <span className="dispense-medicine-quantity">Qty: {medicine.quantity}</span>
                          </div>
                        </div>
                        <div className="dispense-medicine-instructions">
                          <strong>Instructions:</strong> {medicine.instructions}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refill Status Selection */}
              {activeTab === 'refill' && (
                <div className="dispense-status-section">
                  <h4>Request Status</h4>
                  <div className="dispense-status-options">
                    <label className="dispense-radio-option">
                      <input
                        type="radio"
                        name="refillStatus"
                        value="Approved"
                        checked={selectedRefillStatus === 'Approved'}
                        onChange={(e) => setSelectedRefillStatus(e.target.value)}
                      />
                      <span className="dispense-radio-label">Approved</span>
                    </label>
                    <label className="dispense-radio-option">
                      <input
                        type="radio"
                        name="refillStatus"
                        value="Rejected"
                        checked={selectedRefillStatus === 'Rejected'}
                        onChange={(e) => setSelectedRefillStatus(e.target.value)}
                      />
                      <span className="dispense-radio-label">Rejected</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedDispense.notes && (
                <div className="dispense-notes-section">
                  <h4>Notes</h4>
                  <p>{selectedDispense.notes}</p>
                </div>
              )}

            </div>
            <div className="dispense-modal-actions">
              <button className="dispense-btn secondary" onClick={closeModal}>
                Close
              </button>
              <button
                className="dispense-btn primary"
                onClick={handleDispenseSubmit}
                disabled={activeTab === 'dispense' && selectedMedicines.length === 0}
              >
                {activeTab === 'dispense'
                  ? `Process Selected (${selectedMedicines.length})`
                  : 'Update Status'
                }
              </button>
            </div>
          </div>
        </>
      )}


    </div>
  );
};

export default ModernDispenseList;