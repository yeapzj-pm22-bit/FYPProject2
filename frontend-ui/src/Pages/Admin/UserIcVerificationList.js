import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Trash2, Filter, ChevronDown, ChevronUp, Users, Shield, UserCheck, UserX, Eye, EyeOff, MoreHorizontal, Download, RefreshCw, FileCheck, Clock, X, Check } from 'lucide-react';

const ModernICVerificationList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    status: 'all',
    role: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Placeholder image URL for demo
  const userImg = 'https://via.placeholder.com/200x150/f0f0f0/666?text=IC+Image';

  // Sample IC verification data
  const [requests, setRequests] = useState([
    {
      id: 'REQ001',
      requestID: 'REQ001',
      userID: 'U1001',
      patientID: 'P1234',
      name: 'Yeap Zi Jia',
      email: 'yeapzi@gmail.com',
      phone: '+60123456789',
      frontImg: userImg,
      backImg: userImg,
      role: 'Patient',
      status: 'Pending',
      submittedAt: '2024-07-25',
      reviewedBy: null,
      reviewedAt: null
    },
    {
      id: 'REQ002',
      requestID: 'REQ002',
      userID: 'U1002',
      patientID: 'P5678',
      name: 'Ahmad Rahman',
      email: 'ahmad.r@gmail.com',
      phone: '+60123456790',
      frontImg: userImg,
      backImg: userImg,
      role: 'Patient',
      status: 'Approved',
      submittedAt: '2024-07-23',
      reviewedBy: 'Admin',
      reviewedAt: '2024-07-24'
    },
    {
      id: 'REQ003',
      requestID: 'REQ003',
      userID: 'U1003',
      patientID: 'P9012',
      name: 'Li Wei Chen',
      email: 'li.wei@gmail.com',
      phone: '+60123456791',
      frontImg: userImg,
      backImg: userImg,
      role: 'Patient',
      status: 'Rejected',
      submittedAt: '2024-07-22',
      reviewedBy: 'Admin',
      reviewedAt: '2024-07-23',
      rejectionReason: 'Image quality too poor to verify identity'
    },
    {
      id: 'REQ004',
      requestID: 'REQ004',
      userID: 'U1004',
      patientID: 'P3456',
      name: 'Sarah Johnson',
      email: 'sarah.j@gmail.com',
      phone: '+60123456792',
      frontImg: userImg,
      backImg: userImg,
      role: 'Patient',
      status: 'Pending',
      submittedAt: '2024-07-26',
      reviewedBy: null,
      reviewedAt: null
    },
    {
      id: 'REQ005',
      requestID: 'REQ005',
      userID: 'U1005',
      patientID: 'P7890',
      name: 'Michael Tan',
      email: 'michael.tan@example.com',
      phone: '+60123456793',
      frontImg: userImg,
      backImg: userImg,
      role: 'Patient',
      status: 'Pending',
      submittedAt: '2024-07-27',
      reviewedBy: null,
      reviewedAt: null
    }
  ]);

  // Real-time search and filter
  const filteredRequests = useMemo(() => {
    let filtered = requests.filter(request => {
      const matchesSearch =
        request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.requestID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.patientID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.phone.includes(searchQuery);

      const matchesStatus = filters.status === 'all' || request.status === filters.status;
      const matchesRole = filters.role === 'all' || request.role === filters.role;

      return matchesSearch && matchesStatus && matchesRole;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.key === 'submittedAt' || sortConfig.key === 'reviewedAt') {
          const aDate = new Date(aValue || '1970-01-01');
          const bDate = new Date(bValue || '1970-01-01');
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
  }, [requests, searchQuery, filters, sortConfig]);

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle request selection
  const handleSelectRequest = (requestId) => {
    setSelectedRequests(prev =>
      prev.includes(requestId)
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredRequests.map(request => request.id));
    }
  };

  // Handle review modal
  const handleReviewRequest = (request) => {
    setSelectedRecord(request);
    setApprovalStatus('');
    setRejectionReason('');
    setShowReviewModal(true);
  };

  const handleSubmitReview = () => {
    if (approvalStatus === 'rejected' && rejectionReason.trim() === '') {
      alert('Please provide a reason for rejection.');
      return;
    }

    // Update the request status
    setRequests(prev => prev.map(request =>
      request.id === selectedRecord.id
        ? {
            ...request,
            status: approvalStatus === 'approved' ? 'Approved' : 'Rejected',
            reviewedBy: 'Current Admin',
            reviewedAt: new Date().toISOString().split('T')[0],
            rejectionReason: approvalStatus === 'rejected' ? rejectionReason : undefined
          }
        : request
    ));

    // Close modal and reset
    setShowReviewModal(false);
    setSelectedRecord(null);
    setApprovalStatus('');
    setRejectionReason('');
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedRecord(null);
    setApprovalStatus('');
    setRejectionReason('');
  };

  // Handle bulk actions
  const handleBulkApprove = () => {
    if (selectedRequests.length === 0) return;
    const pendingSelected = selectedRequests.filter(id => {
      const request = requests.find(r => r.id === id);
      return request && request.status === 'Pending';
    });

    if (pendingSelected.length === 0) {
      alert('No pending requests selected for approval.');
      return;
    }

    if (window.confirm(`Are you sure you want to approve ${pendingSelected.length} selected requests?`)) {
      setRequests(prev => prev.map(request =>
        pendingSelected.includes(request.id)
          ? {
              ...request,
              status: 'Approved',
              reviewedBy: 'Current Admin',
              reviewedAt: new Date().toISOString().split('T')[0]
            }
          : request
      ));
      setSelectedRequests([]);
    }
  };

  const handleBulkReject = () => {
    if (selectedRequests.length === 0) return;
    const pendingSelected = selectedRequests.filter(id => {
      const request = requests.find(r => r.id === id);
      return request && request.status === 'Pending';
    });

    if (pendingSelected.length === 0) {
      alert('No pending requests selected for rejection.');
      return;
    }

    const reason = window.prompt('Please provide a reason for bulk rejection:');
    if (!reason || reason.trim() === '') {
      alert('Rejection reason is required.');
      return;
    }

    if (window.confirm(`Are you sure you want to reject ${pendingSelected.length} selected requests?`)) {
      setRequests(prev => prev.map(request =>
        pendingSelected.includes(request.id)
          ? {
              ...request,
              status: 'Rejected',
              reviewedBy: 'Current Admin',
              reviewedAt: new Date().toISOString().split('T')[0],
              rejectionReason: reason
            }
          : request
      ));
      setSelectedRequests([]);
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'ic-badge warning',
      'Approved': 'ic-badge success',
      'Rejected': 'ic-badge danger'
    };
    return styles[status] || 'ic-badge default';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <Check size={12} />;
      case 'Rejected': return <X size={12} />;
      case 'Pending': return <Clock size={12} />;
      default: return <FileCheck size={12} />;
    }
  };

  return (
    <div className="ic-verification-container">
      {/* Header */}
      <div className="ic-verification-header">
        <div className="ic-verification-title-section">
          <h2>IC Verification Management</h2>
          <p>Review and verify patient identity documents</p>
        </div>
        <div className="ic-verification-actions">
          <button className="ic-btn secondary" onClick={() => window.location.reload()}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="ic-btn secondary">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedRecord && (
        <>
          <div className="ic-modal-backdrop" onClick={closeReviewModal}></div>
          <div className="ic-modal large">
            <div className="ic-modal-header">
              <h3>Review IC Verification - {selectedRecord.name}</h3>
              <button className="ic-modal-close" onClick={closeReviewModal}>×</button>
            </div>
            <div className="ic-modal-content">
              <div className="ic-review-info">
                <div className="ic-info-row">
                  <div className="ic-info-item">
                    <label>Patient Name:</label>
                    <span>{selectedRecord.name}</span>
                  </div>
                  <div className="ic-info-item">
                    <label>Patient ID:</label>
                    <span>{selectedRecord.patientID}</span>
                  </div>
                </div>
                <div className="ic-info-row">
                  <div className="ic-info-item">
                    <label>User ID:</label>
                    <span>{selectedRecord.userID}</span>
                  </div>
                  <div className="ic-info-item">
                    <label>Email:</label>
                    <span>{selectedRecord.email}</span>
                  </div>
                </div>
              </div>

              <div className="ic-images-section">
                <div className="ic-image-container">
                  <label>Front IC Image</label>
                  <div className="ic-image-wrapper">
                    <img src={selectedRecord.frontImg} alt="Front IC" />
                  </div>
                </div>
                <div className="ic-image-container">
                  <label>Back IC Image</label>
                  <div className="ic-image-wrapper">
                    <img src={selectedRecord.backImg} alt="Back IC" />
                  </div>
                </div>
              </div>

              <div className="ic-form">
                <div className="ic-form-group">
                  <label>Decision *</label>
                  <select
                    value={approvalStatus}
                    onChange={(e) => setApprovalStatus(e.target.value)}
                    className="ic-form-select"
                  >
                    <option value="">-- Select Decision --</option>
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                  </select>
                </div>

                {approvalStatus === 'rejected' && (
                  <div className="ic-form-group">
                    <label>Reason for Rejection *</label>
                    <textarea
                      rows={3}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please provide a detailed reason for rejection..."
                      className="ic-form-textarea"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="ic-modal-actions">
              <button className="ic-btn secondary" onClick={closeReviewModal}>
                Cancel
              </button>
              <button
                className="ic-btn primary"
                onClick={handleSubmitReview}
                disabled={!approvalStatus || (approvalStatus === 'rejected' && rejectionReason.trim() === '')}
              >
                Submit Review
              </button>
            </div>
          </div>
        </>
      )}

      {/* Stats Cards */}
      <div className="ic-stats">
        <div className="ic-stat-card total">
          <div className="ic-stat-icon">
            <FileCheck size={24} />
          </div>
          <div className="ic-stat-content">
            <h3>{requests.length}</h3>
            <p>Total Requests</p>
          </div>
        </div>
        <div className="ic-stat-card pending">
          <div className="ic-stat-icon">
            <Clock size={24} />
          </div>
          <div className="ic-stat-content">
            <h3>{requests.filter(r => r.status === 'Pending').length}</h3>
            <p>Pending Review</p>
          </div>
        </div>
        <div className="ic-stat-card approved">
          <div className="ic-stat-icon">
            <Check size={24} />
          </div>
          <div className="ic-stat-content">
            <h3>{requests.filter(r => r.status === 'Approved').length}</h3>
            <p>Approved</p>
          </div>
        </div>
        <div className="ic-stat-card rejected">
          <div className="ic-stat-icon">
            <X size={24} />
          </div>
          <div className="ic-stat-content">
            <h3>{requests.filter(r => r.status === 'Rejected').length}</h3>
            <p>Rejected</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="ic-controls">
        <div className="ic-search-section">
          <div className="ic-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by name, email, request ID, patient ID, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ic-search-input"
            />
          </div>
          <button
            className={`ic-btn secondary ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedRequests.length > 0 && (
          <div className="ic-bulk-actions">
            <span className="ic-selected-count">
              {selectedRequests.length} request{selectedRequests.length > 1 ? 's' : ''} selected
            </span>
            <div className="ic-bulk-buttons">
              <button className="ic-btn success small" onClick={handleBulkApprove}>
                <Check size={14} />
                Bulk Approve
              </button>
              <button className="ic-btn danger small" onClick={handleBulkReject}>
                <X size={14} />
                Bulk Reject
              </button>
            </div>
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="ic-filter-panel">
            <div className="ic-filter-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="ic-filter-group">
              <label>Role</label>
              <select
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              >
                <option value="all">All Roles</option>
                <option value="Patient">Patient</option>
              </select>
            </div>
            <button
              className="ic-btn secondary small"
              onClick={() => setFilters({ status: 'all', role: 'all' })}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Requests Table */}
      <div className="ic-table-container">
        <div className="ic-table-wrapper">
          <table className="ic-table">
            <thead>
              <tr>
                <th className="ic-th checkbox">
                  <input
                    type="checkbox"
                    checked={filteredRequests.length > 0 && selectedRequests.length === filteredRequests.length}
                    onChange={handleSelectAll}
                    className="ic-checkbox"
                  />
                </th>
                <th className="ic-th sortable" onClick={() => handleSort('requestID')}>
                  Request ID
                  {sortConfig.key === 'requestID' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                <th className="ic-th sortable" onClick={() => handleSort('name')}>
                  Patient Name
                  {sortConfig.key === 'name' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                <th className="ic-th sortable" onClick={() => handleSort('patientID')}>
                  Patient ID
                  {sortConfig.key === 'patientID' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                <th className="ic-th">Contact</th>
                <th className="ic-th">IC Images</th>
                <th className="ic-th">Status</th>
                <th className="ic-th sortable" onClick={() => handleSort('submittedAt')}>
                  Submitted
                  {sortConfig.key === 'submittedAt' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                <th className="ic-th">Reviewed By</th>
                <th className="ic-th actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(request => (
                <tr key={request.id} className={selectedRequests.includes(request.id) ? 'selected' : ''}>
                  <td className="ic-td checkbox">
                    <input
                      type="checkbox"
                      checked={selectedRequests.includes(request.id)}
                      onChange={() => handleSelectRequest(request.id)}
                      className="ic-checkbox"
                    />
                  </td>
                  <td className="ic-td">
                    <span className="ic-request-id">{request.requestID}</span>
                  </td>
                  <td className="ic-td">
                    <div className="ic-patient-cell">
                      <div className="ic-patient-avatar">
                        {request.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ic-patient-info">
                        <div className="ic-patient-name">{request.name}</div>
                        <div className="ic-patient-role">{request.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="ic-td">
                    <span className="ic-patient-id">{request.patientID}</span>
                  </td>
                  <td className="ic-td">
                    <div className="ic-contact-info">
                      <div className="ic-email">{request.email}</div>
                      <div className="ic-phone">{request.phone}</div>
                    </div>
                  </td>
                  <td className="ic-td">
                    <div className="ic-image-previews">
                      <div className="ic-image-preview">
                        <img src={request.frontImg} alt="Front IC" />
                        <span>Front</span>
                      </div>
                      <div className="ic-image-preview">
                        <img src={request.backImg} alt="Back IC" />
                        <span>Back</span>
                      </div>
                    </div>
                  </td>
                  <td className="ic-td">
                    <div className={getStatusBadge(request.status)}>
                      {getStatusIcon(request.status)}
                      <span>{request.status}</span>
                    </div>
                  </td>
                  <td className="ic-td">
                    <span className="ic-date">{new Date(request.submittedAt).toLocaleDateString()}</span>
                  </td>
                  <td className="ic-td">
                    <span className="ic-reviewer">
                      {request.reviewedBy || <span className="ic-na">-</span>}
                    </span>
                  </td>
                  <td className="ic-td actions">
                    <div className="ic-action-buttons">
                      <button
                        className="ic-action-btn review"
                        title="Review Request"
                        onClick={() => handleReviewRequest(request)}
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRequests.length === 0 && (
            <div className="ic-no-results">
              <FileCheck size={48} />
              <p>No IC verification requests found</p>
              <span>Try adjusting your search or filter criteria</span>
            </div>
          )}
        </div>

        {/* Table Footer */}
        <div className="ic-table-footer">
          <div className="ic-table-info">
            Showing {filteredRequests.length} of {requests.length} requests
          </div>
        </div>
      </div>

      <style jsx>{`
        .ic-verification-container {
          padding: 24px 32px;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .ic-verification-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .ic-verification-title-section h2 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 600;
          color: #1e293b;
        }

        .ic-verification-title-section p {
          margin: 0;
          color: #64748b;
          font-size: 16px;
        }

        .ic-verification-actions {
          display: flex;
          gap: 12px;
        }

        .ic-btn {
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

        .ic-btn.small {
          padding: 8px 12px;
          font-size: 12px;
        }

        .ic-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .ic-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .ic-btn.primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .ic-btn.secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #64748b;
          border: 1px solid rgba(226, 232, 240, 0.8);
          backdrop-filter: blur(10px);
        }

        .ic-btn.secondary:hover,
        .ic-btn.secondary.active {
          background: rgba(255, 255, 255, 1);
          border-color: #667eea;
          color: #667eea;
        }

        .ic-btn.success {
          background: #22c55e;
          color: white;
        }

        .ic-btn.success:hover {
          background: #16a34a;
          transform: translateY(-2px);
        }

        .ic-btn.danger {
          background: #ef4444;
          color: white;
        }

        .ic-btn.danger:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        .ic-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .ic-stat-card {
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

        .ic-stat-card:hover {
          transform: translateY(-2px);
        }

        .ic-stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .ic-stat-card.total .ic-stat-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .ic-stat-card.pending .ic-stat-icon {
          background: linear-gradient(135deg, #faad14 0%, #f59e0b 100%);
        }

        .ic-stat-card.approved .ic-stat-icon {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
        }

        .ic-stat-card.rejected .ic-stat-icon {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .ic-stat-content h3 {
          margin: 0 0 4px 0;
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }

        .ic-stat-content p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .ic-controls {
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

        .ic-search-section {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .ic-search-box {
          position: relative;
          flex: 1;
          max-width: 600px;
        }

        .ic-search-box svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          z-index: 1;
        }

        .ic-search-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .ic-search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .ic-bulk-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 12px;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .ic-selected-count {
          color: #667eea;
          font-weight: 500;
        }

        .ic-bulk-buttons {
          display: flex;
          gap: 8px;
        }

        .ic-filter-panel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          padding: 16px;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .ic-filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ic-filter-group label {
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .ic-filter-group select {
          padding: 8px 12px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          cursor: pointer;
        }

        .ic-table-container {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          overflow: hidden;
        }

        .ic-table-wrapper {
          overflow-x: auto;
        }

        .ic-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          min-width: 1200px;
        }

        .ic-th {
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

        .ic-th.sortable {
          cursor: pointer;
          user-select: none;
          transition: all 0.2s ease;
        }

        .ic-th.sortable:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .ic-th.sortable svg {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
        }

        .ic-th.checkbox {
          width: 50px;
          text-align: center;
        }

        .ic-th.actions {
          width: 80px;
          text-align: center;
        }

        .ic-td {
          padding: 16px 12px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.3);
          font-size: 14px;
          color: #374151;
        }

        .ic-td.checkbox {
          text-align: center;
        }

        .ic-td.actions {
          text-align: center;
        }

        .ic-table tbody tr {
          transition: all 0.2s ease;
        }

        .ic-table tbody tr:hover {
          background: rgba(102, 126, 234, 0.05);
        }

        .ic-table tbody tr.selected {
          background: rgba(102, 126, 234, 0.1);
        }

        .ic-checkbox {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .ic-request-id {
          font-family: monospace;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .ic-patient-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ic-patient-avatar {
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

        .ic-patient-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .ic-patient-name {
          font-weight: 500;
          color: #1e293b;
        }

        .ic-patient-role {
          font-size: 12px;
          color: #64748b;
        }

        .ic-patient-id {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          font-family: monospace;
        }

        .ic-contact-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .ic-email {
          color: #64748b;
          font-size: 13px;
        }

        .ic-phone {
          color: #64748b;
          font-size: 12px;
          font-family: monospace;
        }

        .ic-image-previews {
          display: flex;
          gap: 8px;
        }

        .ic-image-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .ic-image-preview img {
          width: 40px;
          height: 30px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .ic-image-preview span {
          font-size: 10px;
          color: #64748b;
        }

        .ic-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .ic-badge.success {
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
        }

        .ic-badge.warning {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .ic-badge.danger {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .ic-badge.default {
          background: rgba(148, 163, 184, 0.1);
          color: #94a3b8;
        }

        .ic-date {
          color: #64748b;
          font-size: 13px;
        }

        .ic-reviewer {
          color: #64748b;
          font-size: 13px;
        }

        .ic-na {
          color: #94a3b8;
          font-style: italic;
        }

        .ic-action-buttons {
          display: flex;
          gap: 4px;
          justify-content: center;
        }

        .ic-action-btn {
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

        .ic-action-btn.review {
          color: #3b82f6;
        }

        .ic-action-btn.review:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .ic-no-results {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .ic-no-results svg {
          color: #94a3b8;
          margin-bottom: 16px;
        }

        .ic-no-results span {
          color: #94a3b8;
          font-size: 14px;
        }

        .ic-table-footer {
          padding: 16px 24px;
          background: rgba(248, 250, 252, 0.8);
          border-top: 1px solid rgba(226, 232, 240, 0.6);
        }

        .ic-table-info {
          color: #64748b;
          font-size: 14px;
        }

        /* Modal Styles */
        .ic-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .ic-modal {
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

        .ic-modal-header {
          padding: 24px 32px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          margin-bottom: 24px;
          padding-bottom: 16px;
        }

        .ic-modal-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }

        .ic-modal-close {
          background: none;
          border: none;
          font-size: 24px;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
          transition: color 0.2s ease;
        }

        .ic-modal-close:hover {
          color: #ef4444;
        }

        .ic-modal-content {
          padding: 0 32px 32px;
        }

        .ic-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 24px 32px;
          border-top: 1px solid rgba(226, 232, 240, 0.6);
          background: rgba(248, 250, 252, 0.5);
        }

        .ic-review-info {
          margin-bottom: 24px;
        }

        .ic-info-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 12px;
        }

        .ic-info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ic-info-item label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        .ic-info-item span {
          color: #64748b;
          font-size: 14px;
        }

        .ic-images-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .ic-image-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ic-image-container label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
          text-align: center;
        }

        .ic-image-wrapper {
          border: 2px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          overflow: hidden;
          aspect-ratio: 4/3;
        }

        .ic-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ic-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .ic-form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ic-form-group label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        .ic-form-select,
        .ic-form-textarea {
          padding: 12px 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          transition: all 0.2s ease;
          color: #374151;
        }

        .ic-form-select:focus,
        .ic-form-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .ic-form-select {
          cursor: pointer;
        }

        .ic-form-textarea {
          resize: vertical;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .ic-verification-container {
            padding: 16px;
          }

          .ic-verification-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .ic-verification-actions {
            justify-content: stretch;
          }

          .ic-verification-actions .ic-btn {
            flex: 1;
            justify-content: center;
          }

          .ic-stats {
            grid-template-columns: 1fr;
          }

          .ic-search-section {
            flex-direction: column;
            align-items: stretch;
          }

          .ic-search-box {
            max-width: none;
          }

          .ic-filter-panel {
            grid-template-columns: 1fr;
          }

          .ic-bulk-actions {
            flex-direction: column;
            gap: 12px;
          }

          .ic-table-wrapper {
            font-size: 12px;
          }

          .ic-table {
            min-width: 900px;
          }

          .ic-th,
          .ic-td {
            padding: 8px 6px;
          }

          .ic-patient-cell {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .ic-patient-avatar {
            width: 32px;
            height: 32px;
            font-size: 12px;
          }

          .ic-modal {
            width: 95%;
            height: 90vh;
            max-height: 90vh;
            margin: 5vh auto;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
          }

          .ic-modal-header,
          .ic-modal-content,
          .ic-modal-actions {
            padding-left: 20px;
            padding-right: 20px;
          }

          .ic-info-row,
          .ic-images-section {
            grid-template-columns: 1fr;
          }

          .ic-modal-actions {
            flex-direction: column-reverse;
          }

          .ic-modal-actions .ic-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ModernICVerificationList;