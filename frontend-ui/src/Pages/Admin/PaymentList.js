import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Eye, Filter, ChevronDown, ChevronUp, CreditCard, Clock, CheckCircle, AlertCircle, Users, Download, RefreshCw, DollarSign, X, Calendar, FileText, Receipt, Wallet } from 'lucide-react';
import "./css/PaymentList.css";
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
    </div>
  );
};

export default ModernBillingPayment;