import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Eye, Filter, ChevronDown, ChevronUp, Package, Clock, CheckCircle, AlertCircle, Users, Download, RefreshCw, Pill, X } from 'lucide-react';

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

      <style jsx>{`
        .dispense-list-container {
          padding: 24px 32px;
          min-height: 100vh;
        }

        .dispense-list-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .dispense-list-title-section h2 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 600;
          color: #1e293b;
        }

        .dispense-list-title-section p {
          margin: 0;
          color: #64748b;
          font-size: 16px;
        }

        .dispense-list-actions {
          display: flex;
          gap: 12px;
        }

        .dispense-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 32px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 4px;
        }

        .dispense-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 14px;
        }

        .dispense-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .dispense-tab:hover:not(.active) {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .dispense-btn {
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

        .dispense-btn.small {
          padding: 8px 12px;
          font-size: 12px;
        }

        .dispense-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .dispense-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .dispense-btn.primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .dispense-btn.secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #64748b;
          border: 1px solid rgba(226, 232, 240, 0.8);
          backdrop-filter: blur(10px);
        }

        .dispense-btn.secondary:hover,
        .dispense-btn.secondary.active {
          background: rgba(255, 255, 255, 1);
          border-color: #667eea;
          color: #667eea;
        }

        .dispense-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .dispense-stat-card {
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

        .dispense-stat-card:hover {
          transform: translateY(-2px);
        }

        .dispense-stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .dispense-stat-card.total .dispense-stat-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .dispense-stat-card.active .dispense-stat-icon {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        }

        .dispense-stat-card.completed .dispense-stat-icon {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
        }

        .dispense-stat-card.pending .dispense-stat-icon {
          background: linear-gradient(135deg, #faad14 0%, #f59e0b 100%);
        }

        .dispense-stat-content h3 {
          margin: 0 0 4px 0;
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }

        .dispense-stat-content p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .dispense-controls {
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

        .dispense-search-section {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .dispense-search-box {
          position: relative;
          flex: 1;
          max-width: 500px;
        }

        .dispense-search-box svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          z-index: 1;
        }

        .dispense-search-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .dispense-search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .dispense-bulk-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 12px;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .dispense-selected-count {
          color: #667eea;
          font-weight: 500;
        }

        .dispense-bulk-buttons {
          display: flex;
          gap: 8px;
        }

        .dispense-filter-panel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          padding: 16px;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .dispense-filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dispense-filter-group label {
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .dispense-filter-group select {
          padding: 8px 12px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          cursor: pointer;
        }

        .dispense-table-container {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          overflow: hidden;
        }

        .dispense-table-wrapper {
          overflow-x: auto;
        }

        .dispense-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          min-width: 1000px;
        }

        .dispense-th {
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

        .dispense-th.sortable {
          cursor: pointer;
          user-select: none;
          transition: all 0.2s ease;
        }

        .dispense-th.sortable:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .dispense-th.sortable svg {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
        }

        .dispense-th.checkbox {
          width: 50px;
          text-align: center;
        }

        .dispense-th.actions {
          width: 100px;
          text-align: center;
        }

        .dispense-td {
          padding: 16px 12px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.3);
          font-size: 14px;
          color: #374151;
        }

        .dispense-td.checkbox {
          text-align: center;
        }

        .dispense-td.actions {
          text-align: center;
        }

        .dispense-table tbody tr {
          transition: all 0.2s ease;
        }

        .dispense-table tbody tr:hover {
          background: rgba(102, 126, 234, 0.05);
        }

        .dispense-table tbody tr.selected {
          background: rgba(102, 126, 234, 0.1);
        }

        .dispense-checkbox {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .dispense-patient-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dispense-avatar {
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

        .dispense-patient-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .dispense-patient-name {
          font-weight: 500;
          color: #1e293b;
        }

        .dispense-patient-id {
          font-size: 12px;
          color: #64748b;
        }

        .dispense-id {
          font-family: monospace;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .dispense-date {
          color: #64748b;
          font-size: 13px;
        }

        .dispense-medicines {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dispense-medicine-count {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 13px;
        }

        .dispense-medicine-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .dispense-medicine-tag {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
        }

        .dispense-medicine-more {
          color: #64748b;
          font-size: 11px;
          font-style: italic;
        }

        .dispense-doctor {
          color: #64748b;
          font-size: 13px;
        }

        .dispense-status-cell {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dispense-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .dispense-badge.active {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .dispense-badge.completed {
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
        }

        .dispense-badge.pending {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .dispense-badge.cancelled {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .dispense-action-buttons {
          display: flex;
          gap: 4px;
          justify-content: center;
        }

        .dispense-action-btn {
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

        .dispense-action-btn.view {
          color: #3b82f6;
        }

        .dispense-action-btn.view:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .dispense-action-btn.edit {
          color: #16a34a;
        }

        .dispense-action-btn.edit:hover {
          background: #16a34a;
          color: white;
          border-color: #16a34a;
        }

        .dispense-no-results {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .dispense-no-results svg {
          color: #94a3b8;
          margin-bottom: 16px;
        }

        .dispense-no-results span {
          color: #94a3b8;
          font-size: 14px;
        }

        .dispense-table-footer {
          padding: 16px 24px;
          background: rgba(248, 250, 252, 0.8);
          border-top: 1px solid rgba(226, 232, 240, 0.6);
        }

        .dispense-table-info {
          color: #64748b;
          font-size: 14px;
        }

        /* Modal Styles */
        .dispense-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .dispense-modal {
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

        .dispense-modal-header {
          padding: 24px 32px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          margin-bottom: 24px;
          padding-bottom: 16px;
        }

        .dispense-modal-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }

        .dispense-modal-close {
          background: none;
          border: none;
          font-size: 24px;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
          transition: color 0.2s ease;
        }

        .dispense-modal-close:hover {
          color: #ef4444;
        }

        .dispense-modal-content {
          padding: 0 32px 32px;
        }

        .dispense-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 24px 32px;
          border-top: 1px solid rgba(226, 232, 240, 0.6);
          background: rgba(248, 250, 252, 0.5);
        }

        .dispense-info-section {
          margin-bottom: 32px;
        }

        .dispense-info-section h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .dispense-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .dispense-info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dispense-info-item label {
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .dispense-info-item span {
          color: #1e293b;
          font-weight: 500;
        }

        .dispense-medicine-section {
          margin-bottom: 32px;
        }

        .dispense-medicine-section h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .dispense-select-all {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .dispense-select-all label {
          font-weight: 500;
          color: #667eea;
          cursor: pointer;
        }

        .dispense-medicine-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dispense-medicine-item {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .dispense-medicine-item:hover {
          background: rgba(102, 126, 234, 0.05);
          border-color: rgba(102, 126, 234, 0.3);
        }

        .dispense-medicine-checkbox {
          display: flex;
          align-items: flex-start;
          padding-top: 2px;
        }

        .dispense-medicine-details {
          flex: 1;
        }

        .dispense-medicine-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .dispense-medicine-main h5 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .dispense-medicine-meta {
          display: flex;
          gap: 12px;
          font-size: 12px;
        }

        .dispense-medicine-dosage {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 500;
        }

        .dispense-medicine-quantity {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 500;
        }

        .dispense-medicine-instructions {
          color: #64748b;
          font-size: 14px;
          line-height: 1.4;
        }

        .dispense-notes-section {
          margin-bottom: 24px;
        }

        .dispense-notes-section h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .dispense-notes-section p {
          margin: 0;
          padding: 12px;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 8px;
          color: #92400e;
          font-size: 14px;
          line-height: 1.5;
        }

        .dispense-status-section {
          margin-bottom: 24px;
        }

        .dispense-status-section h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .dispense-status-options {
          display: flex;
          gap: 16px;
        }

        .dispense-radio-option {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 12px 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.8);
          transition: all 0.2s ease;
        }

        .dispense-radio-option:hover {
          background: rgba(102, 126, 234, 0.05);
          border-color: rgba(102, 126, 234, 0.3);
        }

        .dispense-radio-option input[type="radio"]:checked + .dispense-radio-label {
          font-weight: 600;
          color: #667eea;
        }

        .dispense-radio-label {
          color: #374151;
          font-size: 14px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .dispense-list-container {
            padding: 16px;
          }

          .dispense-list-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .dispense-list-actions {
            justify-content: stretch;
          }

          .dispense-list-actions .dispense-btn {
            flex: 1;
            justify-content: center;
          }

          .dispense-tabs {
            flex-direction: column;
            gap: 4px;
          }

          .dispense-tab {
            justify-content: center;
          }

          .dispense-stats {
            grid-template-columns: 1fr;
          }

          .dispense-search-section {
            flex-direction: column;
            align-items: stretch;
          }

          .dispense-search-box {
            max-width: none;
          }

          .dispense-filter-panel {
            grid-template-columns: 1fr;
          }

          .dispense-bulk-actions {
            flex-direction: column;
            gap: 12px;
          }

          .dispense-table-wrapper {
            font-size: 12px;
          }

          .dispense-table {
            min-width: 800px;
          }

          .dispense-th,
          .dispense-td {
            padding: 8px 6px;
          }

          .dispense-patient-cell {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .dispense-avatar {
            width: 32px;
            height: 32px;
            font-size: 12px;
          }

          .dispense-medicine-preview {
            flex-direction: column;
          }

          .dispense-action-buttons {
            flex-direction: column;
            gap: 2px;
          }

          .dispense-action-btn {
            width: 28px;
            height: 28px;
          }

          .dispense-modal {
            width: 95%;
            height: 90vh;
            max-height: 90vh;
            margin: 5vh auto;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
          }

          .dispense-modal-header,
          .dispense-modal-content,
          .dispense-modal-actions {
            padding-left: 20px;
            padding-right: 20px;
          }

          .dispense-info-grid {
            grid-template-columns: 1fr;
          }

          .dispense-medicine-main {
            flex-direction: column;
            gap: 8px;
          }

          .dispense-status-options {
            flex-direction: column;
          }

          .dispense-modal-actions {
            flex-direction: column-reverse;
          }

          .dispense-modal-actions .dispense-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ModernDispenseList;