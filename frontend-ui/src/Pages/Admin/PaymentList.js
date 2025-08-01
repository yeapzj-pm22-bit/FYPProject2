import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Eye, Filter, ChevronDown, ChevronUp, CreditCard, Clock, CheckCircle, AlertCircle, Users, Download, RefreshCw, DollarSign, X, Calendar, FileText, Receipt, Wallet } from 'lucide-react';

const ModernBillingPayment = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    status: 'all',
    paymentMethod: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    serviceType: '',
    amount: '',
    dueDate: '',
    description: '',
    paymentMethod: '',
    paymentDate: '',
    transactionId: ''
  });

  // Sample invoices data
  const [invoices, setInvoices] = useState([
    {
      id: 'INV001',
      patientName: 'John Doe',
      patientId: 'P001',
      serviceType: 'Consultation',
      amount: 150.00,
      issueDate: '2024-07-25',
      dueDate: '2024-08-25',
      status: 'Paid',
      paymentDate: '2024-07-28',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN12345',
      description: 'General consultation and prescription'
    },
    {
      id: 'INV002',
      patientName: 'Jane Smith',
      patientId: 'P002',
      serviceType: 'Laboratory Tests',
      amount: 280.00,
      issueDate: '2024-07-20',
      dueDate: '2024-08-20',
      status: 'Pending',
      paymentDate: '',
      paymentMethod: '',
      transactionId: '',
      description: 'Blood work and diagnostic tests'
    },
    {
      id: 'INV003',
      patientName: 'Michael Johnson',
      patientId: 'P003',
      serviceType: 'Emergency Care',
      amount: 850.00,
      issueDate: '2024-07-22',
      dueDate: '2024-08-22',
      status: 'Overdue',
      paymentDate: '',
      paymentMethod: '',
      transactionId: '',
      description: 'Emergency room treatment and medications'
    },
    {
      id: 'INV004',
      patientName: 'Sarah Wilson',
      patientId: 'P004',
      serviceType: 'Surgery',
      amount: 2500.00,
      issueDate: '2024-07-15',
      dueDate: '2024-08-15',
      status: 'Partially Paid',
      paymentDate: '2024-07-30',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN67890',
      paidAmount: 1500.00,
      description: 'Minor surgical procedure'
    },
    {
      id: 'INV005',
      patientName: 'David Brown',
      patientId: 'P005',
      serviceType: 'Pharmacy',
      amount: 75.50,
      issueDate: '2024-07-30',
      dueDate: '2024-08-30',
      status: 'Paid',
      paymentDate: '2024-07-30',
      paymentMethod: 'Cash',
      transactionId: 'TXN11111',
      description: 'Prescription medications'
    }
  ]);

  // Sample payments data
  const [payments, setPayments] = useState([
    {
      id: 'PAY001',
      invoiceId: 'INV001',
      patientName: 'John Doe',
      amount: 150.00,
      paymentDate: '2024-07-28',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN12345',
      status: 'Completed',
      processingFee: 4.50,
      netAmount: 145.50
    },
    {
      id: 'PAY002',
      invoiceId: 'INV004',
      patientName: 'Sarah Wilson',
      amount: 1500.00,
      paymentDate: '2024-07-30',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN67890',
      status: 'Completed',
      processingFee: 15.00,
      netAmount: 1485.00
    },
    {
      id: 'PAY003',
      invoiceId: 'INV005',
      patientName: 'David Brown',
      amount: 75.50,
      paymentDate: '2024-07-30',
      paymentMethod: 'Cash',
      transactionId: 'TXN11111',
      status: 'Completed',
      processingFee: 0.00,
      netAmount: 75.50
    }
  ]);

  // Filter and search records based on active tab
  const filteredRecords = useMemo(() => {
    const currentData = activeTab === 'invoices' ? invoices : payments;

    let filtered = currentData.filter(record => {
      const matchesSearch =
        record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (record.patientId && record.patientId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (record.transactionId && record.transactionId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = filters.status === 'all' || record.status === filters.status;
      const matchesPaymentMethod = filters.paymentMethod === 'all' || record.paymentMethod === filters.paymentMethod;

      return matchesSearch && matchesStatus && matchesPaymentMethod;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.key === 'amount' || sortConfig.key === 'paidAmount') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        if (sortConfig.key === 'issueDate' || sortConfig.key === 'dueDate' || sortConfig.key === 'paymentDate') {
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
  }, [invoices, payments, searchQuery, filters, sortConfig, activeTab]);

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
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  // Handle create modal
  const handleOpenCreateModal = () => {
    setFormData({
      patientName: '',
      patientId: '',
      serviceType: '',
      amount: '',
      dueDate: '',
      description: '',
      paymentMethod: '',
      paymentDate: '',
      transactionId: ''
    });
    setShowCreateModal(true);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateSubmit = () => {
    // Validation
    if (!formData.patientName || !formData.serviceType || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    const newId = activeTab === 'invoices' ? `INV${String(invoices.length + 1).padStart(3, '0')}` : `PAY${String(payments.length + 1).padStart(3, '0')}`;

    if (activeTab === 'invoices') {
      const newInvoice = {
        id: newId,
        patientName: formData.patientName,
        patientId: formData.patientId,
        serviceType: formData.serviceType,
        amount: parseFloat(formData.amount),
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: formData.dueDate,
        status: 'Pending',
        paymentDate: '',
        paymentMethod: '',
        transactionId: '',
        description: formData.description
      };
      setInvoices(prev => [...prev, newInvoice]);
    } else {
      const newPayment = {
        id: newId,
        invoiceId: formData.invoiceId || 'N/A',
        patientName: formData.patientName,
        amount: parseFloat(formData.amount),
        paymentDate: formData.paymentDate,
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId,
        status: 'Completed',
        processingFee: formData.paymentMethod === 'Credit Card' ? parseFloat(formData.amount) * 0.03 : 0,
        netAmount: parseFloat(formData.amount) - (formData.paymentMethod === 'Credit Card' ? parseFloat(formData.amount) * 0.03 : 0)
      };
      setPayments(prev => [...prev, newPayment]);
    }

    setShowCreateModal(false);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'billing-badge pending',
      'Paid': 'billing-badge paid',
      'Overdue': 'billing-badge overdue',
      'Partially Paid': 'billing-badge partial',
      'Completed': 'billing-badge completed',
      'Failed': 'billing-badge failed'
    };
    return styles[status] || 'billing-badge default';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock size={14} />;
      case 'Paid':
      case 'Completed': return <CheckCircle size={14} />;
      case 'Overdue':
      case 'Failed': return <AlertCircle size={14} />;
      case 'Partially Paid': return <DollarSign size={14} />;
      default: return <FileText size={14} />;
    }
  };

  // Calculate statistics
  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.status === 'Paid' ? inv.amount : (inv.paidAmount || 0)), 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0);
  const totalPayments = payments.reduce((sum, pay) => sum + pay.amount, 0);

  return (
    <div className="billing-container">
      {/* Header */}
      <div className="billing-header">
        <div className="billing-title-section">
          <h2>Billing & Payment Management</h2>
          <p>Manage invoices, payments, and financial records</p>
        </div>
        <div className="billing-actions">
          <button className="billing-btn secondary" onClick={() => window.location.reload()}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="billing-btn secondary">
            <Download size={16} />
            Export
          </button>

        </div>
      </div>

      {/* Tab Navigation */}
      <div className="billing-tabs">
        <button
          className={`billing-tab ${activeTab === 'invoices' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('invoices');
            setSelectedRecords([]);
            setFilters({ status: 'all', paymentMethod: 'all' });
          }}
        >
          <FileText size={16} />
          Invoices
        </button>
        <button
          className={`billing-tab ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('payments');
            setSelectedRecords([]);
            setFilters({ status: 'all', paymentMethod: 'all' });
          }}
        >
          <CreditCard size={16} />
          Payments
        </button>
      </div>

      {/* Stats Cards */}
      <div className="billing-stats">
        <div className="billing-stat-card revenue">
          <div className="billing-stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="billing-stat-content">
            <h3>${totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="billing-stat-card pending">
          <div className="billing-stat-icon">
            <Clock size={24} />
          </div>
          <div className="billing-stat-content">
            <h3>${pendingAmount.toLocaleString()}</h3>
            <p>Pending Payments</p>
          </div>
        </div>
        <div className="billing-stat-card overdue">
          <div className="billing-stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="billing-stat-content">
            <h3>${overdueAmount.toLocaleString()}</h3>
            <p>Overdue Amount</p>
          </div>
        </div>
        <div className="billing-stat-card collected">
          <div className="billing-stat-icon">
            <Wallet size={24} />
          </div>
          <div className="billing-stat-content">
            <h3>${totalPayments.toLocaleString()}</h3>
            <p>Payments Collected</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="billing-controls">
        <div className="billing-search-section">
          <div className="billing-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder={activeTab === 'invoices'
                ? "Search by patient name, invoice ID, or patient ID..."
                : "Search by patient name, payment ID, or transaction ID..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="billing-search-input"
            />
          </div>
          <button
            className={`billing-btn secondary ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedRecords.length > 0 && (
          <div className="billing-bulk-actions">
            <span className="billing-selected-count">
              {selectedRecords.length} {activeTab === 'invoices' ? 'invoice' : 'payment'}{selectedRecords.length > 1 ? 's' : ''} selected
            </span>
            <div className="billing-bulk-buttons">
              <button className="billing-btn secondary small">
                <Download size={14} />
                Export Selected
              </button>
            </div>
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="billing-filter-panel">
            <div className="billing-filter-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                {activeTab === 'invoices' ? (
                  <>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Partially Paid">Partially Paid</option>
                  </>
                ) : (
                  <>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                  </>
                )}
              </select>
            </div>
            <div className="billing-filter-group">
              <label>Payment Method</label>
              <select
                value={filters.paymentMethod}
                onChange={(e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
              >
                <option value="all">All Methods</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Insurance">Insurance</option>
              </select>
            </div>
            <button
              className="billing-btn secondary small"
              onClick={() => setFilters({ status: 'all', paymentMethod: 'all' })}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="billing-table-container">
        <div className="billing-table-wrapper">
          <table className="billing-table">
            <thead>
              <tr>
                <th className="billing-th checkbox">
                  <input
                    type="checkbox"
                    checked={filteredRecords.length > 0 && selectedRecords.length === filteredRecords.length}
                    onChange={handleSelectAll}
                    className="billing-checkbox"
                  />
                </th>
                <th className="billing-th sortable" onClick={() => handleSort('id')}>
                  {activeTab === 'invoices' ? 'Invoice ID' : 'Payment ID'}
                  {sortConfig.key === 'id' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                <th className="billing-th sortable" onClick={() => handleSort('patientName')}>
                  Patient Name
                  {sortConfig.key === 'patientName' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                {activeTab === 'invoices' ? (
                  <>
                    <th className="billing-th">Service Type</th>
                    <th className="billing-th sortable" onClick={() => handleSort('amount')}>
                      Amount
                      {sortConfig.key === 'amount' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </th>
                    <th className="billing-th sortable" onClick={() => handleSort('dueDate')}>
                      Due Date
                      {sortConfig.key === 'dueDate' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </th>
                  </>
                ) : (
                  <>
                    <th className="billing-th">Invoice ID</th>
                    <th className="billing-th sortable" onClick={() => handleSort('amount')}>
                      Amount
                      {sortConfig.key === 'amount' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </th>
                    <th className="billing-th sortable" onClick={() => handleSort('paymentDate')}>
                      Payment Date
                      {sortConfig.key === 'paymentDate' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </th>
                  </>
                )}
                <th className="billing-th">Payment Method</th>
                <th className="billing-th">Status</th>
                <th className="billing-th actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id} className={selectedRecords.includes(record.id) ? 'selected' : ''}>
                  <td className="billing-td checkbox">
                    <input
                      type="checkbox"
                      checked={selectedRecords.includes(record.id)}
                      onChange={() => handleSelectRecord(record.id)}
                      className="billing-checkbox"
                    />
                  </td>
                  <td className="billing-td">
                    <span className="billing-id">{record.id}</span>
                  </td>
                  <td className="billing-td">
                    <div className="billing-patient">
                      <div className="patient-avatar">
                        {record.patientName.charAt(0).toUpperCase()}
                      </div>
                      <div className="patient-info">
                        <div className="patient-name">{record.patientName}</div>
                        {record.patientId && <div className="patient-id">{record.patientId}</div>}
                      </div>
                    </div>
                  </td>
                  {activeTab === 'invoices' ? (
                    <>
                      <td className="billing-td">
                        <span className="service-type">{record.serviceType}</span>
                      </td>
                      <td className="billing-td">
                        <div className="amount-cell">
                          <span className="amount">${record.amount.toFixed(2)}</span>
                          {record.paidAmount && (
                            <span className="paid-amount">Paid: ${record.paidAmount.toFixed(2)}</span>
                          )}
                        </div>
                      </td>
                      <td className="billing-td">
                        <div className="date-cell">
                          <Calendar size={14} />
                          <span>{new Date(record.dueDate).toLocaleDateString()}</span>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="billing-td">
                        <span className="invoice-ref">{record.invoiceId}</span>
                      </td>
                      <td className="billing-td">
                        <div className="amount-cell">
                          <span className="amount">${record.amount.toFixed(2)}</span>
                          <span className="net-amount">Net: ${record.netAmount.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="billing-td">
                        <div className="date-cell">
                          <Calendar size={14} />
                          <span>{new Date(record.paymentDate).toLocaleDateString()}</span>
                        </div>
                      </td>
                    </>
                  )}
                  <td className="billing-td">
                    <span className="payment-method">{record.paymentMethod || '-'}</span>
                  </td>
                  <td className="billing-td">
                    <div className="status-cell">
                      {getStatusIcon(record.status)}
                      <span className={getStatusBadge(record.status)}>
                        {record.status}
                      </span>
                    </div>
                  </td>
                  <td className="billing-td actions">
                    <div className="billing-action-buttons">
                      <button
                        className="billing-action-btn view"
                        title="View Details"
                        onClick={() => handleOpenModal(record)}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="billing-action-btn edit"
                        title="Edit Record"
                      >
                        <Edit3 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRecords.length === 0 && (
            <div className="billing-no-results">
              <FileText size={48} />
              <p>No {activeTab === 'invoices' ? 'invoices' : 'payments'} found</p>
              <span>Try adjusting your search or filter criteria</span>
            </div>
          )}
        </div>

        {/* Table Footer */}
        <div className="billing-table-footer">
          <div className="billing-table-info">
            Showing {filteredRecords.length} of {activeTab === 'invoices' ? invoices.length : payments.length} {activeTab === 'invoices' ? 'invoices' : 'payments'}
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {showModal && selectedRecord && (
        <>
          <div className="billing-modal-backdrop" onClick={closeModal}></div>
          <div className="billing-modal large">
            <div className="billing-modal-header">
              <h3>{activeTab === 'invoices' ? 'Invoice Details' : 'Payment Details'} - {selectedRecord.id}</h3>
              <button className="billing-modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="billing-modal-content">

              <div className="billing-info-section">
                <h4>Patient Information</h4>
                <div className="billing-info-grid">
                  <div className="billing-info-item">
                    <label>Patient Name</label>
                    <span>{selectedRecord.patientName}</span>
                  </div>
                  {selectedRecord.patientId && (
                    <div className="billing-info-item">
                      <label>Patient ID</label>
                      <span>{selectedRecord.patientId}</span>
                    </div>
                  )}
                </div>
              </div>

              {activeTab === 'invoices' ? (
                <div className="billing-info-section">
                  <h4>Invoice Details</h4>
                  <div className="billing-info-grid">
                    <div className="billing-info-item">
                      <label>Service Type</label>
                      <span>{selectedRecord.serviceType}</span>
                    </div>
                    <div className="billing-info-item">
                      <label>Amount</label>
                      <span>${selectedRecord.amount.toFixed(2)}</span>
                    </div>
                    <div className="billing-info-item">
                      <label>Issue Date</label>
                      <span>{new Date(selectedRecord.issueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="billing-info-item">
                      <label>Due Date</label>
                      <span>{new Date(selectedRecord.dueDate).toLocaleDateString()}</span>
                    </div>
                    {selectedRecord.description && (
                      <div className="billing-info-item">
                        <label>Description</label>
                        <span>{selectedRecord.description}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="billing-info-section">
                  <h4>Payment Details</h4>
                  <div className="billing-info-grid">
                    <div className="billing-info-item">
                      <label>Invoice ID</label>
                      <span>{selectedRecord.invoiceId}</span>
                    </div>
                    <div className="billing-info-item">
                      <label>Amount</label>
                      <span>${selectedRecord.amount.toFixed(2)}</span>
                    </div>
                    <div className="billing-info-item">
                      <label>Processing Fee</label>
                      <span>${selectedRecord.processingFee.toFixed(2)}</span>
                    </div>
                    <div className="billing-info-item">
                      <label>Net Amount</label>
                      <span>${selectedRecord.netAmount.toFixed(2)}</span>
                    </div>
                    <div className="billing-info-item">
                      <label>Payment Date</label>
                      <span>{new Date(selectedRecord.paymentDate).toLocaleDateString()}</span>
                    </div>
                    <div className="billing-info-item">
                      <label>Transaction ID</label>
                      <span>{selectedRecord.transactionId}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedRecord.paymentMethod && (
                <div className="billing-info-section">
                  <h4>Payment Information</h4>
                  <div className="billing-info-grid">
                    <div className="billing-info-item">
                      <label>Payment Method</label>
                      <span>{selectedRecord.paymentMethod}</span>
                    </div>
                    {selectedRecord.transactionId && (
                      <div className="billing-info-item">
                        <label>Transaction ID</label>
                        <span>{selectedRecord.transactionId}</span>
                      </div>
                    )}
                    {selectedRecord.paymentDate && (
                      <div className="billing-info-item">
                        <label>Payment Date</label>
                        <span>{new Date(selectedRecord.paymentDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
            <div className="billing-modal-actions">
              <button className="billing-btn secondary" onClick={closeModal}>
                Close
              </button>
              <button className="billing-btn primary">
                <Receipt size={16} />
                Print {activeTab === 'invoices' ? 'Invoice' : 'Receipt'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <>
          <div className="billing-modal-backdrop" onClick={closeCreateModal}></div>
          <div className="billing-modal large">
            <div className="billing-modal-header">
              <h3>{activeTab === 'invoices' ? 'Create New Invoice' : 'Record New Payment'}</h3>
              <button className="billing-modal-close" onClick={closeCreateModal}>×</button>
            </div>
            <div className="billing-modal-content">

              <div className="billing-form-section">
                <h4>Patient Information</h4>
                <div className="billing-form-grid">
                  <div className="billing-form-group">
                    <label>Patient Name *</label>
                    <input
                      type="text"
                      value={formData.patientName}
                      onChange={(e) => handleFormChange('patientName', e.target.value)}
                      className="billing-form-input"
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div className="billing-form-group">
                    <label>Patient ID</label>
                    <input
                      type="text"
                      value={formData.patientId}
                      onChange={(e) => handleFormChange('patientId', e.target.value)}
                      className="billing-form-input"
                      placeholder="Enter patient ID"
                    />
                  </div>
                </div>
              </div>

              {activeTab === 'invoices' ? (
                <div className="billing-form-section">
                  <h4>Invoice Details</h4>
                  <div className="billing-form-grid">
                    <div className="billing-form-group">
                      <label>Service Type *</label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => handleFormChange('serviceType', e.target.value)}
                        className="billing-form-select"
                      >
                        <option value="">Select service type</option>
                        <option value="Consultation">Consultation</option>
                        <option value="Laboratory Tests">Laboratory Tests</option>
                        <option value="Emergency Care">Emergency Care</option>
                        <option value="Surgery">Surgery</option>
                        <option value="Pharmacy">Pharmacy</option>
                        <option value="Imaging">Imaging</option>
                      </select>
                    </div>
                    <div className="billing-form-group">
                      <label>Amount *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => handleFormChange('amount', e.target.value)}
                        className="billing-form-input"
                        placeholder="Enter amount"
                      />
                    </div>
                    <div className="billing-form-group">
                      <label>Due Date *</label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => handleFormChange('dueDate', e.target.value)}
                        className="billing-form-input"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="billing-form-group">
                      <label>Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleFormChange('description', e.target.value)}
                        className="billing-form-textarea"
                        placeholder="Enter service description"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="billing-form-section">
                  <h4>Payment Details</h4>
                  <div className="billing-form-grid">
                    <div className="billing-form-group">
                      <label>Amount *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => handleFormChange('amount', e.target.value)}
                        className="billing-form-input"
                        placeholder="Enter payment amount"
                      />
                    </div>
                    <div className="billing-form-group">
                      <label>Payment Method *</label>
                      <select
                        value={formData.paymentMethod}
                        onChange={(e) => handleFormChange('paymentMethod', e.target.value)}
                        className="billing-form-select"
                      >
                        <option value="">Select payment method</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cash">Cash</option>
                        <option value="Insurance">Insurance</option>
                      </select>
                    </div>
                    <div className="billing-form-group">
                      <label>Payment Date *</label>
                      <input
                        type="date"
                        value={formData.paymentDate}
                        onChange={(e) => handleFormChange('paymentDate', e.target.value)}
                        className="billing-form-input"
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="billing-form-group">
                      <label>Transaction ID</label>
                      <input
                        type="text"
                        value={formData.transactionId}
                        onChange={(e) => handleFormChange('transactionId', e.target.value)}
                        className="billing-form-input"
                        placeholder="Enter transaction ID"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
            <div className="billing-modal-actions">
              <button className="billing-btn secondary" onClick={closeCreateModal}>
                Cancel
              </button>
              <button
                className="billing-btn primary"
                onClick={handleCreateSubmit}
                disabled={!formData.patientName || !formData.amount || (activeTab === 'invoices' ? !formData.serviceType : !formData.paymentMethod)}
              >
                {activeTab === 'invoices' ? 'Create Invoice' : 'Record Payment'}
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .billing-container {
          padding: 24px 32px;
          min-height: 100vh;
        }

        .billing-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .billing-title-section h2 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 600;
          color: #1e293b;
        }

        .billing-title-section p {
          margin: 0;
          color: #64748b;
          font-size: 16px;
        }

        .billing-actions {
          display: flex;
          gap: 12px;
        }

        .billing-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 32px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 4px;
        }

        .billing-tab {
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

        .billing-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .billing-tab:hover:not(.active) {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .billing-btn {
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

        .billing-btn.small {
          padding: 8px 12px;
          font-size: 12px;
        }

        .billing-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .billing-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .billing-btn.primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .billing-btn.secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #64748b;
          border: 1px solid rgba(226, 232, 240, 0.8);
          backdrop-filter: blur(10px);
        }

        .billing-btn.secondary:hover,
        .billing-btn.secondary.active {
          background: rgba(255, 255, 255, 1);
          border-color: #667eea;
          color: #667eea;
        }

        .billing-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .billing-stat-card {
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

        .billing-stat-card:hover {
          transform: translateY(-2px);
        }

        .billing-stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .billing-stat-card.revenue .billing-stat-icon {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .billing-stat-card.pending .billing-stat-icon {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .billing-stat-card.overdue .billing-stat-icon {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .billing-stat-card.collected .billing-stat-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .billing-stat-content h3 {
          margin: 0 0 4px 0;
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
        }

        .billing-stat-content p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .billing-controls {
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

        .billing-search-section {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .billing-search-box {
          position: relative;
          flex: 1;
          max-width: 500px;
        }

        .billing-search-box svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          z-index: 1;
        }

        .billing-search-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .billing-search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .billing-bulk-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 12px;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .billing-selected-count {
          color: #667eea;
          font-weight: 500;
        }

        .billing-bulk-buttons {
          display: flex;
          gap: 8px;
        }

        .billing-filter-panel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          padding: 16px;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .billing-filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .billing-filter-group label {
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .billing-filter-group select {
          padding: 8px 12px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          cursor: pointer;
        }

        .billing-table-container {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          overflow: hidden;
        }

        .billing-table-wrapper {
          overflow-x: auto;
        }

        .billing-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          min-width: 1200px;
        }

        .billing-th {
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

        .billing-th.sortable {
          cursor: pointer;
          user-select: none;
          transition: all 0.2s ease;
        }

        .billing-th.sortable:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .billing-th.sortable svg {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
        }

        .billing-th.checkbox {
          width: 50px;
          text-align: center;
        }

        .billing-th.actions {
          width: 100px;
          text-align: center;
        }

        .billing-td {
          padding: 16px 12px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.3);
          font-size: 14px;
          color: #374151;
        }

        .billing-td.checkbox {
          text-align: center;
        }

        .billing-td.actions {
          text-align: center;
        }

        .billing-table tbody tr {
          transition: all 0.2s ease;
        }

        .billing-table tbody tr:hover {
          background: rgba(102, 126, 234, 0.05);
        }

        .billing-table tbody tr.selected {
          background: rgba(102, 126, 234, 0.1);
        }

        .billing-checkbox {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .billing-id {
          font-family: monospace;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .billing-patient {
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
        }

        .service-type {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .amount-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .amount {
          font-weight: 600;
          color: #1e293b;
        }

        .paid-amount, .net-amount {
          font-size: 11px;
          color: #64748b;
        }

        .date-cell {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 13px;
        }

        .payment-method {
          color: #64748b;
          font-size: 13px;
        }

        .invoice-ref {
          font-family: monospace;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-cell {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .billing-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .billing-badge.pending {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .billing-badge.paid,
        .billing-badge.completed {
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
        }

        .billing-badge.overdue,
        .billing-badge.failed {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .billing-badge.partial {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .billing-action-buttons {
          display: flex;
          gap: 4px;
          justify-content: center;
        }

        .billing-action-btn {
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

        .billing-action-btn.view {
          color: #3b82f6;
        }

        .billing-action-btn.view:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .billing-action-btn.edit {
          color: #16a34a;
        }

        .billing-action-btn.edit:hover {
          background: #16a34a;
          color: white;
          border-color: #16a34a;
        }

        .billing-no-results {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .billing-no-results svg {
          color: #94a3b8;
          margin-bottom: 16px;
        }

        .billing-no-results span {
          color: #94a3b8;
          font-size: 14px;
        }

        .billing-table-footer {
          padding: 16px 24px;
          background: rgba(248, 250, 252, 0.8);
          border-top: 1px solid rgba(226, 232, 240, 0.6);
        }

        .billing-table-info {
          color: #64748b;
          font-size: 14px;
        }

        /* Modal Styles */
        .billing-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .billing-modal {
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

        .billing-modal-header {
          padding: 24px 32px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          margin-bottom: 24px;
          padding-bottom: 16px;
        }

        .billing-modal-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }

        .billing-modal-close {
          background: none;
          border: none;
          font-size: 24px;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
          transition: color 0.2s ease;
        }

        .billing-modal-close:hover {
          color: #ef4444;
        }

        .billing-modal-content {
          padding: 0 32px 32px;
        }

        .billing-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 24px 32px;
          border-top: 1px solid rgba(226, 232, 240, 0.6);
          background: rgba(248, 250, 252, 0.5);
        }

        .billing-info-section {
          margin-bottom: 32px;
        }

        .billing-info-section h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .billing-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .billing-info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .billing-info-item label {
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .billing-info-item span {
          color: #1e293b;
          font-weight: 500;
        }

        .billing-form-section {
          margin-bottom: 32px;
        }

        .billing-form-section h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .billing-form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .billing-form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .billing-form-group label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .billing-form-input,
        .billing-form-select,
        .billing-form-textarea {
          padding: 12px 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          transition: all 0.2s ease;
          color: #374151;
        }

        .billing-form-input:focus,
        .billing-form-select:focus,
        .billing-form-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .billing-form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .billing-container {
            padding: 16px;
          }

          .billing-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .billing-actions {
            justify-content: stretch;
          }

          .billing-actions .billing-btn {
            flex: 1;
            justify-content: center;
          }

          .billing-tabs {
            flex-direction: column;
            gap: 4px;
          }

          .billing-tab {
            justify-content: center;
          }

          .billing-stats {
            grid-template-columns: 1fr;
          }

          .billing-search-section {
            flex-direction: column;
            align-items: stretch;
          }

          .billing-search-box {
            max-width: none;
          }

          .billing-filter-panel {
            grid-template-columns: 1fr;
          }

          .billing-bulk-actions {
            flex-direction: column;
            gap: 12px;
          }

          .billing-table-wrapper {
            font-size: 12px;
          }

          .billing-table {
            min-width: 900px;
          }

          .billing-th,
          .billing-td {
            padding: 8px 6px;
          }

          .billing-patient {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .patient-avatar {
            width: 32px;
            height: 32px;
            font-size: 12px;
          }

          .billing-action-buttons {
            flex-direction: column;
            gap: 2px;
          }

          .billing-action-btn {
            width: 28px;
            height: 28px;
          }

          .billing-modal {
            width: 95%;
            height: 90vh;
            max-height: 90vh;
            margin: 5vh auto;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
          }

          .billing-modal-header,
          .billing-modal-content,
          .billing-modal-actions {
            padding-left: 20px;
            padding-right: 20px;
          }

          .billing-info-grid,
          .billing-form-grid {
            grid-template-columns: 1fr;
          }

          .billing-modal-actions {
            flex-direction: column-reverse;
          }

          .billing-modal-actions .billing-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ModernBillingPayment;