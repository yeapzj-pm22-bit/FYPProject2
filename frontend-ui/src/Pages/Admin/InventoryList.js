import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Eye, Filter, ChevronDown, ChevronUp, Package, Clock, CheckCircle, AlertCircle, Users, Download, RefreshCw, Pill, X, Calendar, Truck } from 'lucide-react';

const ModernInventoryList = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    status: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Inventory modal states
  const [actualQuantity, setActualQuantity] = useState('');
  const [actualExpiryDate, setActualExpiryDate] = useState('');
  const [selectedNote, setSelectedNote] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');

  // Restock modal states
  const [supplierName, setSupplierName] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  // Create order form states
  const [createFormData, setCreateFormData] = useState({
    medication: '',
    quantity: '',
    expectedExpiry: '',
    supplier: ''
  });

  // Medication options for the create form
  const medicationOptions = [
    { value: 'Paracetamol 500mg', label: 'Paracetamol 500mg Tablet' },
    { value: 'Amoxicillin 250mg', label: 'Amoxicillin 250mg Capsule' },
    { value: 'Ibuprofen 400mg', label: 'Ibuprofen 400mg Tablet' },
    { value: 'Metformin 500mg', label: 'Metformin 500mg Tablet' },
    { value: 'Lisinopril 10mg', label: 'Lisinopril 10mg Tablet' },
    { value: 'Atorvastatin 20mg', label: 'Atorvastatin 20mg Tablet' },
  ];

  // Sample inventory orders data
  const [inventoryOrders, setInventoryOrders] = useState([
    {
      id: 'ORD001',
      medication: 'Paracetamol 500mg',
      quantity: 100,
      expectedExpiry: '2026-01-01',
      supplier: 'MediSupply Co.',
      actualQuantity: '',
      actualExpiry: '',
      notes: '',
      status: 'Pending',
      orderDate: '2024-07-20'
    },
    {
      id: 'ORD002',
      medication: 'Amoxicillin 250mg',
      quantity: 200,
      expectedExpiry: '2025-12-01',
      supplier: 'PharmaPlus Ltd.',
      actualQuantity: 200,
      actualExpiry: '2026-02-01',
      notes: 'Delivered in good condition.',
      status: 'Received',
      orderDate: '2024-07-18'
    },
    {
      id: 'ORD003',
      medication: 'Ibuprofen 400mg',
      quantity: 150,
      expectedExpiry: '2025-11-15',
      supplier: 'HealthCorp Ltd.',
      actualQuantity: '',
      actualExpiry: '',
      notes: '',
      status: 'Pending',
      orderDate: '2024-07-25'
    }
  ]);

  // Sample restock requests data
  const [restockRequests, setRestockRequests] = useState([
    {
      id: 'REQ001',
      medication: 'Amoxicillin 500mg',
      quantity: 100,
      expectedExpiry: '2025-12-31',
      reason: 'Stock running low',
      status: 'Pending',
      requestDate: '2024-07-28',
      requestedBy: 'Dr. Sarah Wilson'
    },
    {
      id: 'REQ002',
      medication: 'Paracetamol 500mg',
      quantity: 200,
      expectedExpiry: '2026-06-30',
      reason: 'High patient demand',
      status: 'Approved',
      requestDate: '2024-07-26',
      requestedBy: 'Dr. Michael Chen',
      supplierName: 'MediCorp Ltd.'
    },
    {
      id: 'REQ003',
      medication: 'Insulin 100IU/ml',
      quantity: 50,
      expectedExpiry: '2025-09-30',
      reason: 'Emergency restocking required',
      status: 'Rejected',
      requestDate: '2024-07-24',
      requestedBy: 'Dr. Emma Johnson',
      rejectReason: 'Budget constraints'
    }
  ]);

  // Filter and search records based on active tab
  const filteredRecords = useMemo(() => {
    const currentData = activeTab === 'inventory' ? inventoryOrders : restockRequests;

    let filtered = currentData.filter(record => {
      const matchesSearch =
        record.medication.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (activeTab === 'inventory' && record.supplier?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (activeTab === 'restock' && record.reason?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (activeTab === 'restock' && record.requestedBy?.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = filters.status === 'all' || record.status === filters.status;

      return matchesSearch && matchesStatus;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.key === 'expectedExpiry' || sortConfig.key === 'orderDate' || sortConfig.key === 'requestDate') {
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
  }, [inventoryOrders, restockRequests, searchQuery, filters, sortConfig, activeTab]);

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle record selection
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

  // Handle modal
  const handleOpenModal = (record) => {
    setSelectedRecord(record);

    if (activeTab === 'inventory') {
      setActualQuantity('');
      setActualExpiryDate('');
      setSelectedNote('');
      setApprovalStatus('');
    } else {
      setApprovalStatus('');
      setSupplierName('');
      setRejectReason('');
    }

    setShowModal(true);
  };

  const handleSubmit = () => {
    if (activeTab === 'inventory') {
      // Handle inventory receive logic
      setInventoryOrders(prev => prev.map(order =>
        order.id === selectedRecord.id
          ? {
              ...order,
              status: approvalStatus === 'approved' ? 'Received' : 'Rejected',
              actualQuantity: actualQuantity,
              actualExpiry: actualExpiryDate,
              notes: selectedNote
            }
          : order
      ));
    } else {
      // Handle restock request logic
      setRestockRequests(prev => prev.map(request =>
        request.id === selectedRecord.id
          ? {
              ...request,
              status: approvalStatus === 'approved' ? 'Approved' : 'Rejected',
              supplierName: approvalStatus === 'approved' ? supplierName : undefined,
              rejectReason: approvalStatus === 'rejected' ? rejectReason : undefined
            }
          : request
      ));
    }

    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  // Handle create order modal
  const handleOpenCreateModal = () => {
    setCreateFormData({
      medication: '',
      quantity: '',
      expectedExpiry: '',
      supplier: ''
    });
    setShowCreateModal(true);
  };

  const handleCreateFormChange = (field, value) => {
    setCreateFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateCreateForm = () => {
    const required = ['medication', 'quantity', 'expectedExpiry', 'supplier'];

    for (let field of required) {
      if (!createFormData[field]) {
        alert(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
        return false;
      }
    }

    if (parseInt(createFormData.quantity) <= 0) {
      alert('Quantity must be greater than 0');
      return false;
    }

    const selectedDate = new Date(createFormData.expectedExpiry);
    const today = new Date();
    if (selectedDate <= today) {
      alert('Expected expiry date must be in the future');
      return false;
    }

    return true;
  };

  const handleCreateSubmit = () => {
    if (!validateCreateForm()) return;

    // Generate new order ID
    const newOrderId = `ORD${String(inventoryOrders.length + 1).padStart(3, '0')}`;

    const newOrder = {
      id: newOrderId,
      medication: createFormData.medication,
      quantity: parseInt(createFormData.quantity),
      expectedExpiry: createFormData.expectedExpiry,
      supplier: createFormData.supplier,
      actualQuantity: '',
      actualExpiry: '',
      notes: '',
      status: 'Pending',
      orderDate: new Date().toISOString().split('T')[0]
    };

    setInventoryOrders(prev => [...prev, newOrder]);
    setShowCreateModal(false);

    // Reset form
    setCreateFormData({
      medication: '',
      quantity: '',
      expectedExpiry: '',
      supplier: ''
    });
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'inventory-badge pending',
      'Received': 'inventory-badge received',
      'Approved': 'inventory-badge approved',
      'Rejected': 'inventory-badge rejected'
    };
    return styles[status] || 'inventory-badge default';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock size={14} />;
      case 'Received': return <CheckCircle size={14} />;
      case 'Approved': return <CheckCircle size={14} />;
      case 'Rejected': return <X size={14} />;
      default: return <Package size={14} />;
    }
  };

  return (
    <div className="inventory-list-container">
      {/* Header */}
      <div className="inventory-list-header">
        <div className="inventory-list-title-section">
          <h2>Inventory Management</h2>
          <p>Manage inventory orders and restock requests</p>
        </div>
        <div className="inventory-list-actions">
          <button className="inventory-btn secondary" onClick={() => window.location.reload()}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="inventory-btn secondary">
            <Download size={16} />
            Export
          </button>
          <button className="inventory-btn primary" onClick={handleOpenCreateModal}>
            <Plus size={16} />
            New Order
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="inventory-tabs">
        <button
          className={`inventory-tab ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('inventory');
            setSelectedRecords([]);
            setFilters({ status: 'all' });
          }}
        >
          <Package size={16} />
          Inventory Orders
        </button>
        <button
          className={`inventory-tab ${activeTab === 'restock' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('restock');
            setSelectedRecords([]);
            setFilters({ status: 'all' });
          }}
        >
          <Truck size={16} />
          Restock Requests
        </button>
      </div>

      {/* Stats Cards */}
      <div className="inventory-stats">
        <div className="inventory-stat-card total">
          <div className="inventory-stat-icon">
            <Package size={24} />
          </div>
          <div className="inventory-stat-content">
            <h3>{activeTab === 'inventory' ? inventoryOrders.length : restockRequests.length}</h3>
            <p>Total {activeTab === 'inventory' ? 'Orders' : 'Requests'}</p>
          </div>
        </div>
        <div className="inventory-stat-card pending">
          <div className="inventory-stat-icon">
            <Clock size={24} />
          </div>
          <div className="inventory-stat-content">
            <h3>
              {activeTab === 'inventory'
                ? inventoryOrders.filter(o => o.status === 'Pending').length
                : restockRequests.filter(r => r.status === 'Pending').length
              }
            </h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="inventory-stat-card completed">
          <div className="inventory-stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="inventory-stat-content">
            <h3>
              {activeTab === 'inventory'
                ? inventoryOrders.filter(o => o.status === 'Received').length
                : restockRequests.filter(r => r.status === 'Approved').length
              }
            </h3>
            <p>{activeTab === 'inventory' ? 'Received' : 'Approved'}</p>
          </div>
        </div>
        <div className="inventory-stat-card rejected">
          <div className="inventory-stat-icon">
            <X size={24} />
          </div>
          <div className="inventory-stat-content">
            <h3>
              {activeTab === 'inventory'
                ? inventoryOrders.filter(o => o.status === 'Rejected').length
                : restockRequests.filter(r => r.status === 'Rejected').length
              }
            </h3>
            <p>Rejected</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="inventory-controls">
        <div className="inventory-search-section">
          <div className="inventory-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder={activeTab === 'inventory'
                ? "Search by medication, order ID, or supplier..."
                : "Search by medication, request ID, reason, or requester..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="inventory-search-input"
            />
          </div>
          <button
            className={`inventory-btn secondary ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedRecords.length > 0 && (
          <div className="inventory-bulk-actions">
            <span className="inventory-selected-count">
              {selectedRecords.length} {activeTab === 'inventory' ? 'order' : 'request'}{selectedRecords.length > 1 ? 's' : ''} selected
            </span>
            <div className="inventory-bulk-buttons">
              <button className="inventory-btn secondary small">
                <Package size={14} />
                Bulk Process
              </button>
            </div>
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="inventory-filter-panel">
            <div className="inventory-filter-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                {activeTab === 'inventory' ? (
                  <>
                    <option value="Pending">Pending</option>
                    <option value="Received">Received</option>
                    <option value="Rejected">Rejected</option>
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
              className="inventory-btn secondary small"
              onClick={() => setFilters({ status: 'all' })}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="inventory-table-container">
        <div className="inventory-table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th className="inventory-th checkbox">
                  <input
                    type="checkbox"
                    checked={filteredRecords.length > 0 && selectedRecords.length === filteredRecords.length}
                    onChange={handleSelectAll}
                    className="inventory-checkbox"
                  />
                </th>
                <th className="inventory-th sortable" onClick={() => handleSort('id')}>
                  {activeTab === 'inventory' ? 'Order ID' : 'Request ID'}
                  {sortConfig.key === 'id' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                <th className="inventory-th sortable" onClick={() => handleSort('medication')}>
                  Medication
                  {sortConfig.key === 'medication' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                <th className="inventory-th sortable" onClick={() => handleSort('quantity')}>
                  Quantity
                  {sortConfig.key === 'quantity' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                <th className="inventory-th sortable" onClick={() => handleSort('expectedExpiry')}>
                  Expected Expiry
                  {sortConfig.key === 'expectedExpiry' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                {activeTab === 'inventory' ? (
                  <>
                    <th className="inventory-th">Supplier</th>
                    <th className="inventory-th">Actual Qty</th>
                  </>
                ) : (
                  <>
                    <th className="inventory-th">Reason</th>
                    <th className="inventory-th">Requested By</th>
                  </>
                )}
                <th className="inventory-th">Status</th>
                <th className="inventory-th actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id} className={selectedRecords.includes(record.id) ? 'selected' : ''}>
                  <td className="inventory-td checkbox">
                    <input
                      type="checkbox"
                      checked={selectedRecords.includes(record.id)}
                      onChange={() => handleSelectRecord(record.id)}
                      className="inventory-checkbox"
                    />
                  </td>
                  <td className="inventory-td">
                    <span className="inventory-id">{record.id}</span>
                  </td>
                  <td className="inventory-td">
                    <div className="inventory-medication">
                      <Pill size={14} />
                      <span>{record.medication}</span>
                    </div>
                  </td>
                  <td className="inventory-td">
                    <span className="inventory-quantity">{record.quantity}</span>
                  </td>
                  <td className="inventory-td">
                    <div className="inventory-date">
                      <Calendar size={14} />
                      <span>{new Date(record.expectedExpiry).toLocaleDateString()}</span>
                    </div>
                  </td>
                  {activeTab === 'inventory' ? (
                    <>
                      <td className="inventory-td">
                        <span className="inventory-supplier">{record.supplier}</span>
                      </td>
                      <td className="inventory-td">
                        <span className="inventory-actual-qty">
                          {record.actualQuantity || '-'}
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="inventory-td">
                        <span className="inventory-reason">{record.reason}</span>
                      </td>
                      <td className="inventory-td">
                        <span className="inventory-requester">{record.requestedBy}</span>
                      </td>
                    </>
                  )}
                  <td className="inventory-td">
                    <div className="inventory-status-cell">
                      {getStatusIcon(record.status)}
                      <span className={getStatusBadge(record.status)}>
                        {record.status}
                      </span>
                    </div>
                  </td>
                  <td className="inventory-td actions">
                    <div className="inventory-action-buttons">
                      {record.status === 'Pending' ? (
                        <button
                          className="inventory-action-btn process"
                          title={activeTab === 'inventory' ? 'Receive' : 'Reply'}
                          onClick={() => handleOpenModal(record)}
                        >
                          {activeTab === 'inventory' ? <Package size={14} /> : <Eye size={14} />}
                        </button>
                      ) : (
                        <button
                          className="inventory-action-btn view"
                          title="View Details"
                          onClick={() => handleOpenModal(record)}
                        >
                          <Eye size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRecords.length === 0 && (
            <div className="inventory-no-results">
              <Package size={48} />
              <p>No {activeTab === 'inventory' ? 'inventory orders' : 'restock requests'} found</p>
              <span>Try adjusting your search or filter criteria</span>
            </div>
          )}
        </div>

        {/* Table Footer */}
        <div className="inventory-table-footer">
          <div className="inventory-table-info">
            Showing {filteredRecords.length} of {activeTab === 'inventory' ? inventoryOrders.length : restockRequests.length} {activeTab === 'inventory' ? 'inventory orders' : 'restock requests'}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedRecord && (
        <>
          <div className="inventory-modal-backdrop" onClick={closeModal}></div>
          <div className="inventory-modal large">
            <div className="inventory-modal-header">
              <h3>
                {activeTab === 'inventory' ? 'Receive Inventory Order' : 'Review Request Detail'} - {selectedRecord.id}
              </h3>
              <button className="inventory-modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="inventory-modal-content">

              {/* Basic Information */}
              <div className="inventory-info-section">
                <h4>{activeTab === 'inventory' ? 'Order Information' : 'Request Information'}</h4>
                <div className="inventory-info-grid">
                  <div className="inventory-info-item">
                    <label>Medication</label>
                    <span>{selectedRecord.medication}</span>
                  </div>
                  <div className="inventory-info-item">
                    <label>{activeTab === 'inventory' ? 'Order Quantity' : 'Request Quantity'}</label>
                    <span>{selectedRecord.quantity}</span>
                  </div>
                  <div className="inventory-info-item">
                    <label>Expected Expiry Date</label>
                    <span>{new Date(selectedRecord.expectedExpiry).toLocaleDateString()}</span>
                  </div>
                  {activeTab === 'inventory' ? (
                    <div className="inventory-info-item">
                      <label>Supplier</label>
                      <span>{selectedRecord.supplier}</span>
                    </div>
                  ) : (
                    <>
                      <div className="inventory-info-item">
                        <label>Reason</label>
                        <span>{selectedRecord.reason}</span>
                      </div>
                      <div className="inventory-info-item">
                        <label>Requested By</label>
                        <span>{selectedRecord.requestedBy}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Inventory Specific Fields */}
              {activeTab === 'inventory' && selectedRecord.status === 'Pending' && (
                <div className="inventory-form-section">
                  <h4>Receiving Details</h4>
                  <div className="inventory-form-grid">
                    <div className="inventory-form-group">
                      <label>Actual Quantity Received *</label>
                      <input
                        type="number"
                        min="1"
                        value={actualQuantity}
                        onChange={(e) => setActualQuantity(e.target.value)}
                        className="inventory-form-input"
                        placeholder="Enter actual quantity"
                      />
                    </div>
                    <div className="inventory-form-group">
                      <label>Actual Expiry Date *</label>
                      <input
                        type="date"
                        value={actualExpiryDate}
                        onChange={(e) => setActualExpiryDate(e.target.value)}
                        className="inventory-form-input"
                      />
                    </div>
                    <div className="inventory-form-group">
                      <label>Receiving Notes *</label>
                      <select
                        value={selectedNote}
                        onChange={(e) => setSelectedNote(e.target.value)}
                        className="inventory-form-select"
                      >
                        <option value="">Select note</option>
                        <option value="Complete">Complete</option>
                        <option value="Partial">Partial</option>
                        <option value="Damaged Items">Damaged Items</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Decision Section */}
              {selectedRecord.status === 'Pending' && (
                <div className="inventory-decision-section">
                  <h4>Decision</h4>
                  <div className="inventory-radio-options">
                    <label className="inventory-radio-option">
                      <input
                        type="radio"
                        name="decision"
                        value="approved"
                        checked={approvalStatus === 'approved'}
                        onChange={(e) => setApprovalStatus(e.target.value)}
                      />
                      <span className="inventory-radio-label">
                        {activeTab === 'inventory' ? 'Approve' : 'Approve'}
                      </span>
                    </label>
                    <label className="inventory-radio-option">
                      <input
                        type="radio"
                        name="decision"
                        value="rejected"
                        checked={approvalStatus === 'rejected'}
                        onChange={(e) => setApprovalStatus(e.target.value)}
                      />
                      <span className="inventory-radio-label">Reject</span>
                    </label>
                  </div>

                  {/* Conditional Fields */}
                  {activeTab === 'restock' && approvalStatus === 'approved' && (
                    <div className="inventory-form-group mt-3">
                      <label>Supplier Name *</label>
                      <input
                        type="text"
                        value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)}
                        className="inventory-form-input"
                        placeholder="Enter supplier name"
                      />
                    </div>
                  )}

                  {approvalStatus === 'rejected' && (
                    <div className="inventory-form-group mt-3">
                      <label>Reason for Rejection *</label>
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="inventory-form-input"
                        placeholder="Enter reason for rejection"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* View Only Fields for Non-Pending Records */}
              {selectedRecord.status !== 'Pending' && (
                <div className="inventory-info-section">
                  <h4>Additional Details</h4>
                  <div className="inventory-info-grid">
                    {activeTab === 'inventory' && (
                      <>
                        <div className="inventory-info-item">
                          <label>Actual Quantity</label>
                          <span>{selectedRecord.actualQuantity || '-'}</span>
                        </div>
                        <div className="inventory-info-item">
                          <label>Actual Expiry</label>
                          <span>{selectedRecord.actualExpiry ? new Date(selectedRecord.actualExpiry).toLocaleDateString() : '-'}</span>
                        </div>
                        <div className="inventory-info-item">
                          <label>Notes</label>
                          <span>{selectedRecord.notes || '-'}</span>
                        </div>
                      </>
                    )}
                    {activeTab === 'restock' && (
                      <>
                        {selectedRecord.supplierName && (
                          <div className="inventory-info-item">
                            <label>Supplier Name</label>
                            <span>{selectedRecord.supplierName}</span>
                          </div>
                        )}
                        {selectedRecord.rejectReason && (
                          <div className="inventory-info-item">
                            <label>Reject Reason</label>
                            <span>{selectedRecord.rejectReason}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

            </div>
            <div className="inventory-modal-actions">
              <button className="inventory-btn secondary" onClick={closeModal}>
                Close
              </button>
              {selectedRecord.status === 'Pending' && (
                <button
                  className="inventory-btn primary"
                  onClick={handleSubmit}
                  disabled={
                    !approvalStatus ||
                    (activeTab === 'inventory' && approvalStatus === 'approved' && (!actualQuantity || !actualExpiryDate || !selectedNote)) ||
                    (activeTab === 'restock' && approvalStatus === 'approved' && !supplierName) ||
                    (approvalStatus === 'rejected' && !rejectReason)
                  }
                >
                  Submit Decision
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Create Order Modal */}
      {showCreateModal && (
        <>
          <div className="inventory-modal-backdrop" onClick={closeCreateModal}></div>
          <div className="inventory-modal large">
            <div className="inventory-modal-header">
              <h3>Create New Inventory Order</h3>
              <button className="inventory-modal-close" onClick={closeCreateModal}>×</button>
            </div>
            <div className="inventory-modal-content">

              <div className="inventory-form-section">
                <h4>Order Details</h4>
                <div className="inventory-form-grid">
                  <div className="inventory-form-group">
                    <label>Medication *</label>
                    <select
                      value={createFormData.medication}
                      onChange={(e) => handleCreateFormChange('medication', e.target.value)}
                      className="inventory-form-select"
                    >
                      <option value="">-- Select Medication --</option>
                      {medicationOptions.map((med) => (
                        <option key={med.value} value={med.value}>
                          {med.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="inventory-form-group">
                    <label>Quantity to Order *</label>
                    <input
                      type="number"
                      min="1"
                      value={createFormData.quantity}
                      onChange={(e) => handleCreateFormChange('quantity', e.target.value)}
                      className="inventory-form-input"
                      placeholder="Enter quantity"
                    />
                  </div>

                  <div className="inventory-form-group">
                    <label>Expected Expiry Date *</label>
                    <input
                      type="date"
                      value={createFormData.expectedExpiry}
                      onChange={(e) => handleCreateFormChange('expectedExpiry', e.target.value)}
                      className="inventory-form-input"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="inventory-form-group">
                    <label>Supplier Name *</label>
                    <input
                      type="text"
                      value={createFormData.supplier}
                      onChange={(e) => handleCreateFormChange('supplier', e.target.value)}
                      className="inventory-form-input"
                      placeholder="Enter supplier name"
                    />
                  </div>
                </div>
              </div>

              <div className="create-order-note">
                <div className="note-icon">
                  <Package size={20} />
                </div>
                <div className="note-content">
                  <h5>Order Information</h5>
                  <p>This order will be created with "Pending" status and will need to be processed when received.</p>
                </div>
              </div>

            </div>
            <div className="inventory-modal-actions">
              <button className="inventory-btn secondary" onClick={closeCreateModal}>
                Cancel
              </button>
              <button
                className="inventory-btn primary"
                onClick={handleCreateSubmit}
                disabled={!createFormData.medication || !createFormData.quantity || !createFormData.expectedExpiry || !createFormData.supplier}
              >
                Create Order
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .inventory-list-container {
          padding: 24px 32px;
          min-height: 100vh;
        }

        .inventory-list-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .inventory-list-title-section h2 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 600;
          color: #1e293b;
        }

        .inventory-list-title-section p {
          margin: 0;
          color: #64748b;
          font-size: 16px;
        }

        .inventory-list-actions {
          display: flex;
          gap: 12px;
        }

        .inventory-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 32px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 4px;
        }

        .inventory-tab {
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

        .inventory-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .inventory-tab:hover:not(.active) {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .inventory-btn {
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

        .inventory-btn.small {
          padding: 8px 12px;
          font-size: 12px;
        }

        .inventory-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .inventory-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .inventory-btn.primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .inventory-btn.secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #64748b;
          border: 1px solid rgba(226, 232, 240, 0.8);
          backdrop-filter: blur(10px);
        }

        .inventory-btn.secondary:hover,
        .inventory-btn.secondary.active {
          background: rgba(255, 255, 255, 1);
          border-color: #667eea;
          color: #667eea;
        }

        .inventory-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .inventory-stat-card {
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

        .inventory-stat-card:hover {
          transform: translateY(-2px);
        }

        .inventory-stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .inventory-stat-card.total .inventory-stat-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .inventory-stat-card.pending .inventory-stat-icon {
          background: linear-gradient(135deg, #faad14 0%, #f59e0b 100%);
        }

        .inventory-stat-card.completed .inventory-stat-icon {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
        }

        .inventory-stat-card.rejected .inventory-stat-icon {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .inventory-stat-content h3 {
          margin: 0 0 4px 0;
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }

        .inventory-stat-content p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .inventory-controls {
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

        .inventory-search-section {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .inventory-search-box {
          position: relative;
          flex: 1;
          max-width: 500px;
        }

        .inventory-search-box svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          z-index: 1;
        }

        .inventory-search-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .inventory-search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .inventory-bulk-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 12px;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .inventory-selected-count {
          color: #667eea;
          font-weight: 500;
        }

        .inventory-bulk-buttons {
          display: flex;
          gap: 8px;
        }

        .inventory-filter-panel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          padding: 16px;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .inventory-filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .inventory-filter-group label {
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .inventory-filter-group select {
          padding: 8px 12px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          cursor: pointer;
        }

        .inventory-table-container {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          overflow: hidden;
        }

        .inventory-table-wrapper {
          overflow-x: auto;
        }

        .inventory-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          min-width: 1200px;
        }

        .inventory-th {
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

        .inventory-th.sortable {
          cursor: pointer;
          user-select: none;
          transition: all 0.2s ease;
        }

        .inventory-th.sortable:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .inventory-th.sortable svg {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
        }

        .inventory-th.checkbox {
          width: 50px;
          text-align: center;
        }

        .inventory-th.actions {
          width: 100px;
          text-align: center;
        }

        .inventory-td {
          padding: 16px 12px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.3);
          font-size: 14px;
          color: #374151;
        }

        .inventory-td.checkbox {
          text-align: center;
        }

        .inventory-td.actions {
          text-align: center;
        }

        .inventory-table tbody tr {
          transition: all 0.2s ease;
        }

        .inventory-table tbody tr:hover {
          background: rgba(102, 126, 234, 0.05);
        }

        .inventory-table tbody tr.selected {
          background: rgba(102, 126, 234, 0.1);
        }

        .inventory-checkbox {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .inventory-id {
          font-family: monospace;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .inventory-medication {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #1e293b;
          font-weight: 500;
        }

        .inventory-quantity {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .inventory-date {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 13px;
        }

        .inventory-supplier,
        .inventory-reason,
        .inventory-requester {
          color: #64748b;
          font-size: 13px;
        }

        .inventory-actual-qty {
          color: #374151;
          font-weight: 500;
        }

        .inventory-status-cell {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .inventory-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .inventory-badge.pending {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .inventory-badge.received,
        .inventory-badge.approved {
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
        }

        .inventory-badge.rejected {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .inventory-action-buttons {
          display: flex;
          gap: 4px;
          justify-content: center;
        }

        .inventory-action-btn {
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

        .inventory-action-btn.process {
          color: #16a34a;
        }

        .inventory-action-btn.process:hover {
          background: #16a34a;
          color: white;
          border-color: #16a34a;
        }

        .inventory-action-btn.view {
          color: #3b82f6;
        }

        .inventory-action-btn.view:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .inventory-no-results {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .inventory-no-results svg {
          color: #94a3b8;
          margin-bottom: 16px;
        }

        .inventory-no-results span {
          color: #94a3b8;
          font-size: 14px;
        }

        .inventory-table-footer {
          padding: 16px 24px;
          background: rgba(248, 250, 252, 0.8);
          border-top: 1px solid rgba(226, 232, 240, 0.6);
        }

        .inventory-table-info {
          color: #64748b;
          font-size: 14px;
        }

        /* Modal Styles */
        .inventory-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .inventory-modal {
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

        .inventory-modal-header {
          padding: 24px 32px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          margin-bottom: 24px;
          padding-bottom: 16px;
        }

        .inventory-modal-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }

        .inventory-modal-close {
          background: none;
          border: none;
          font-size: 24px;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
          transition: color 0.2s ease;
        }

        .inventory-modal-close:hover {
          color: #ef4444;
        }

        .inventory-modal-content {
          padding: 0 32px 32px;
        }

        .inventory-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 24px 32px;
          border-top: 1px solid rgba(226, 232, 240, 0.6);
          background: rgba(248, 250, 252, 0.5);
        }

        .inventory-info-section {
          margin-bottom: 32px;
        }

        .inventory-info-section h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .inventory-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .inventory-info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .inventory-info-item label {
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .inventory-info-item span {
          color: #1e293b;
          font-weight: 500;
        }

        .inventory-form-section {
          margin-bottom: 32px;
        }

        .inventory-form-section h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .inventory-form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .inventory-form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .inventory-form-group.mt-3 {
          margin-top: 16px;
        }

        .inventory-form-group label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .inventory-form-input,
        .inventory-form-select {
          padding: 12px 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          transition: all 0.2s ease;
          color: #374151;
        }

        .inventory-form-input:focus,
        .inventory-form-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .inventory-decision-section {
          margin-bottom: 24px;
        }

        .inventory-decision-section h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .inventory-radio-options {
          display: flex;
          gap: 16px;
        }

        .inventory-radio-option {
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

        .inventory-radio-option:hover {
          background: rgba(102, 126, 234, 0.05);
          border-color: rgba(102, 126, 234, 0.3);
        }

        .inventory-radio-option input[type="radio"]:checked + .inventory-radio-label {
          font-weight: 600;
          color: #667eea;
        }

        .inventory-radio-label {
          color: #374151;
          font-size: 14px;
        }

        .create-order-note {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: 12px;
          margin-top: 24px;
        }

        .note-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .note-content {
          flex: 1;
        }

        .note-content h5 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #667eea;
        }

        .note-content p {
          margin: 0;
          font-size: 13px;
          color: #64748b;
          line-height: 1.4;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .inventory-list-container {
            padding: 16px;
          }

          .inventory-list-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .inventory-list-actions {
            justify-content: stretch;
          }

          .inventory-list-actions .inventory-btn {
            flex: 1;
            justify-content: center;
          }

          .inventory-tabs {
            flex-direction: column;
            gap: 4px;
          }

          .inventory-tab {
            justify-content: center;
          }

          .inventory-stats {
            grid-template-columns: 1fr;
          }

          .inventory-search-section {
            flex-direction: column;
            align-items: stretch;
          }

          .inventory-search-box {
            max-width: none;
          }

          .inventory-filter-panel {
            grid-template-columns: 1fr;
          }

          .inventory-bulk-actions {
            flex-direction: column;
            gap: 12px;
          }

          .inventory-table-wrapper {
            font-size: 12px;
          }

          .inventory-table {
            min-width: 900px;
          }

          .inventory-th,
          .inventory-td {
            padding: 8px 6px;
          }

          .inventory-action-buttons {
            flex-direction: column;
            gap: 2px;
          }

          .inventory-action-btn {
            width: 28px;
            height: 28px;
          }

          .inventory-modal {
            width: 95%;
            height: 90vh;
            max-height: 90vh;
            margin: 5vh auto;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
          }

          .inventory-modal-header,
          .inventory-modal-content,
          .inventory-modal-actions {
            padding-left: 20px;
            padding-right: 20px;
          }

          .inventory-info-grid,
          .inventory-form-grid {
            grid-template-columns: 1fr;
          }

          .inventory-radio-options {
            flex-direction: column;
          }

          .inventory-modal-actions {
            flex-direction: column-reverse;
          }

          .inventory-modal-actions .inventory-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ModernInventoryList;