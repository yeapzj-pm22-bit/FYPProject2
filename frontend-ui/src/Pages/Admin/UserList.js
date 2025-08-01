import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Trash2, Filter, ChevronDown, ChevronUp, Users, Shield, UserCheck, UserX, Eye, EyeOff, MoreHorizontal, Download, RefreshCw, FileCheck, Clock, X, Check } from 'lucide-react';

const IntegratedUserManagement = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    icVerify: 'all',
    gender: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const [formData, setFormData] = useState({
    role: '',
    expertise: '',
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    birthDate: '',
    phone: '',
    password: '',
    confirmPassword: '',
    status: 'Active'
  });

  // Sample user data
  const [users, setUsers] = useState([
    {
      id: 'U001',
      firstName: 'Yeap',
      lastName: 'Zi Jia',
      name: 'Yeap Zi Jia',
      email: 'yeapzi@gmail.com',
      gender: 'Male',
      birthDate: '2005-02-03',
      phone: '+60123456789',
      role: 'Patient',
      expertise: '',
      icVerify: 'Pending Verification',
      status: 'Active',
      createdAt: '2024-01-15',
      lastLogin: '2024-07-29'
    },
    {
      id: 'U002',
      firstName: 'Jane',
      lastName: 'Smith',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      gender: 'Female',
      birthDate: '1990-09-15',
      phone: '+60123456790',
      role: 'Patient',
      expertise: '',
      icVerify: 'Not Verified',
      status: 'Inactive',
      createdAt: '2024-02-20',
      lastLogin: '2024-07-25'
    },
    {
      id: 'U003',
      firstName: 'Ali',
      lastName: 'Ahmad',
      name: 'Ali Ahmad',
      email: 'ali.ahmad@clinic.com',
      gender: 'Male',
      birthDate: '1985-06-21',
      phone: '+60123456791',
      role: 'Admin',
      expertise: '',
      icVerify: 'Verified',
      status: 'Active',
      createdAt: '2023-12-10',
      lastLogin: '2024-07-30'
    },
    {
      id: 'U004',
      firstName: 'Sarah',
      lastName: 'Wilson',
      name: 'Sarah Wilson',
      email: 'sarah.w@clinic.com',
      gender: 'Female',
      birthDate: '1988-11-08',
      phone: '+60123456792',
      role: 'Doctor',
      expertise: 'Cardiologist',
      icVerify: 'Verified',
      status: 'Active',
      createdAt: '2024-01-05',
      lastLogin: '2024-07-30'
    },
    {
      id: 'U005',
      firstName: 'Michael',
      lastName: 'Chen',
      name: 'Michael Chen',
      email: 'michael.chen@gmail.com',
      gender: 'Male',
      birthDate: '1995-03-22',
      phone: '+60123456793',
      role: 'Patient',
      expertise: '',
      icVerify: 'Verified',
      status: 'Blocked',
      createdAt: '2024-03-12',
      lastLogin: '2024-07-20'
    },
    {
      id: 'U006',
      firstName: 'Emma',
      lastName: 'Johnson',
      name: 'Emma Johnson',
      email: 'emma.j@example.com',
      gender: 'Female',
      birthDate: '1992-07-14',
      phone: '+60123456794',
      role: 'Patient',
      expertise: '',
      icVerify: 'Pending Verification',
      status: 'Active',
      createdAt: '2024-04-18',
      lastLogin: '2024-07-28'
    }
  ]);

  // Sample IC verification data
  const [icRequests, setIcRequests] = useState([
    {
      id: 'ICREQ001',
      requestID: 'ICREQ001',
      userID: 'U001',
      patientID: 'P1234',
      name: 'Yeap Zi Jia',
      email: 'yeapzi@gmail.com',
      phone: '+60123456789',
      frontImg: 'https://via.placeholder.com/200x150/f0f0f0/666?text=IC+Front',
      backImg: 'https://via.placeholder.com/200x150/f0f0f0/666?text=IC+Back',
      role: 'Patient',
      status: 'Pending',
      submittedAt: '2024-07-25',
      reviewedBy: null,
      reviewedAt: null
    },
    {
      id: 'ICREQ002',
      requestID: 'ICREQ002',
      userID: 'U002',
      patientID: 'P5678',
      name: 'Ahmad Rahman',
      email: 'ahmad.r@gmail.com',
      phone: '+60123456790',
      frontImg: 'https://via.placeholder.com/200x150/f0f0f0/666?text=IC+Front',
      backImg: 'https://via.placeholder.com/200x150/f0f0f0/666?text=IC+Back',
      role: 'Patient',
      status: 'Approved',
      submittedAt: '2024-07-23',
      reviewedBy: 'Admin',
      reviewedAt: '2024-07-24'
    },
    {
      id: 'ICREQ003',
      requestID: 'ICREQ003',
      userID: 'U003',
      patientID: 'P9012',
      name: 'Li Wei Chen',
      email: 'li.wei@gmail.com',
      phone: '+60123456791',
      frontImg: 'https://via.placeholder.com/200x150/f0f0f0/666?text=IC+Front',
      backImg: 'https://via.placeholder.com/200x150/f0f0f0/666?text=IC+Back',
      role: 'Patient',
      status: 'Rejected',
      submittedAt: '2024-07-22',
      reviewedBy: 'Admin',
      reviewedAt: '2024-07-23',
      rejectionReason: 'Image quality too poor to verify identity'
    },
    {
      id: 'ICREQ004',
      requestID: 'ICREQ004',
      userID: 'U004',
      patientID: 'P3456',
      name: 'Sarah Johnson',
      email: 'sarah.j@gmail.com',
      phone: '+60123456792',
      frontImg: 'https://via.placeholder.com/200x150/f0f0f0/666?text=IC+Front',
      backImg: 'https://via.placeholder.com/200x150/f0f0f0/666?text=IC+Back',
      role: 'Patient',
      status: 'Pending',
      submittedAt: '2024-07-26',
      reviewedBy: null,
      reviewedAt: null
    },
    {
      id: 'ICREQ005',
      requestID: 'ICREQ005',
      userID: 'U005',
      patientID: 'P7890',
      name: 'Michael Tan',
      email: 'michael.tan@example.com',
      phone: '+60123456793',
      frontImg: 'https://via.placeholder.com/200x150/f0f0f0/666?text=IC+Front',
      backImg: 'https://via.placeholder.com/200x150/f0f0f0/666?text=IC+Back',
      role: 'Patient',
      status: 'Pending',
      submittedAt: '2024-07-27',
      reviewedBy: null,
      reviewedAt: null
    }
  ]);

  // Get current data based on active tab
  const getCurrentData = () => {
    return activeTab === 'users' ? users : icRequests;
  };

  // Real-time search and filter
  const filteredRecords = useMemo(() => {
    const currentData = getCurrentData();

    let filtered = currentData.filter(record => {
      let matchesSearch = false;

      if (activeTab === 'users') {
        matchesSearch =
          record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.phone.includes(searchQuery);
      } else {
        matchesSearch =
          record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.requestID.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.patientID.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.phone.includes(searchQuery);
      }

      const matchesRole = filters.role === 'all' || record.role === filters.role;
      const matchesStatus = filters.status === 'all' || record.status === filters.status;
      const matchesICVerify = filters.icVerify === 'all' || record.icVerify === filters.icVerify;
      const matchesGender = filters.gender === 'all' || record.gender === filters.gender;

      return matchesSearch && matchesRole && matchesStatus && matchesICVerify && matchesGender;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.key === 'birthDate' || sortConfig.key === 'createdAt' || sortConfig.key === 'lastLogin' ||
            sortConfig.key === 'submittedAt' || sortConfig.key === 'reviewedAt') {
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
  }, [users, icRequests, searchQuery, filters, sortConfig, activeTab]);

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

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedRecords([]);
    setFilters({ role: 'all', status: 'all', icVerify: 'all', gender: 'all' });
    setSearchQuery('');
    setSortConfig({ key: null, direction: 'asc' });
  };

  // Handle user actions
  const handleEditUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditingUser(user);
      setFormData({
        role: user.role,
        expertise: user.expertise || '',
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        birthDate: user.birthDate,
        phone: user.phone,
        password: '',
        confirmPassword: '',
        status: user.status
      });
      setShowEditModal(true);
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      setSelectedRecords(prev => prev.filter(id => id !== userId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedRecords.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedRecords.length} selected users?`)) {
      setUsers(prev => prev.filter(user => !selectedRecords.includes(user.id)));
      setSelectedRecords([]);
    }
  };

  const handleAddUser = () => {
    setFormData({
      role: '',
      expertise: '',
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      birthDate: '',
      phone: '',
      password: '',
      confirmPassword: '',
      status: 'Active'
    });
    setShowCreateModal(true);
  };

  // Handle IC verification actions
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
    setIcRequests(prev => prev.map(request =>
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

    // Update user's IC verification status
    if (approvalStatus === 'approved') {
      setUsers(prev => prev.map(user =>
        user.id === selectedRecord.userID
          ? { ...user, icVerify: 'Verified' }
          : user
      ));
    }

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

  // Handle bulk IC verification actions
  const handleBulkApprove = () => {
    if (selectedRecords.length === 0) return;
    const pendingSelected = selectedRecords.filter(id => {
      const request = icRequests.find(r => r.id === id);
      return request && request.status === 'Pending';
    });

    if (pendingSelected.length === 0) {
      alert('No pending requests selected for approval.');
      return;
    }

    if (window.confirm(`Are you sure you want to approve ${pendingSelected.length} selected requests?`)) {
      setIcRequests(prev => prev.map(request =>
        pendingSelected.includes(request.id)
          ? {
              ...request,
              status: 'Approved',
              reviewedBy: 'Current Admin',
              reviewedAt: new Date().toISOString().split('T')[0]
            }
          : request
      ));

      // Update users' IC verification status
      const userIdsToUpdate = icRequests
        .filter(request => pendingSelected.includes(request.id))
        .map(request => request.userID);

      setUsers(prev => prev.map(user =>
        userIdsToUpdate.includes(user.id)
          ? { ...user, icVerify: 'Verified' }
          : user
      ));

      setSelectedRecords([]);
    }
  };

  const handleBulkReject = () => {
    if (selectedRecords.length === 0) return;
    const pendingSelected = selectedRecords.filter(id => {
      const request = icRequests.find(r => r.id === id);
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
      setIcRequests(prev => prev.map(request =>
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
      setSelectedRecords([]);
    }
  };

  // Form handling functions
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'gender', 'birthDate', 'phone', 'role'];

    for (let field of required) {
      if (!formData[field]) {
        alert(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
        return false;
      }
    }

    if (formData.role === 'Doctor' && !formData.expertise) {
      alert('Expertise is required for doctors');
      return false;
    }

    if (!showEditModal) {
      if (!formData.password) {
        alert('Password is required');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleFormSubmit = () => {
    if (!validateForm()) return;

    if (showEditModal && editingUser) {
      // Update existing user
      setUsers(prev => prev.map(user =>
        user.id === editingUser.id
          ? {
              ...user,
              firstName: formData.firstName,
              lastName: formData.lastName,
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              gender: formData.gender,
              birthDate: formData.birthDate,
              phone: formData.phone,
              role: formData.role,
              expertise: formData.expertise,
              status: formData.status,
              icVerify: formData.role === 'Patient' ? user.icVerify : 'Verified'
            }
          : user
      ));
      setShowEditModal(false);
      setEditingUser(null);
    } else {
      // Create new user
      const newUser = {
        id: `U${String(users.length + 1).padStart(3, '0')}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        gender: formData.gender,
        birthDate: formData.birthDate,
        phone: formData.phone,
        role: formData.role,
        expertise: formData.expertise,
        status: formData.status,
        icVerify: formData.role === 'Patient' ? 'Not Verified' : 'Verified',
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: '-'
      };
      setUsers(prev => [...prev, newUser]);
      setShowCreateModal(false);
    }

    // Reset form
    setFormData({
      role: '',
      expertise: '',
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      birthDate: '',
      phone: '',
      password: '',
      confirmPassword: '',
      status: 'Active'
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingUser(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      'Active': 'badge success',
      'Inactive': 'badge warning',
      'Blocked': 'badge danger',
      'Pending': 'badge warning',
      'Approved': 'badge success',
      'Rejected': 'badge danger',
      'Verified': 'badge success',
      'Pending Verification': 'badge warning',
      'Not Verified': 'badge danger'
    };
    return styles[status] || 'badge default';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <UserCheck size={12} />;
      case 'Inactive': return <Clock size={12} />;
      case 'Blocked': return <UserX size={12} />;
      case 'Pending': return <Clock size={12} />;
      case 'Approved': return <Check size={12} />;
      case 'Rejected': return <X size={12} />;
      case 'Verified': return <Check size={12} />;
      case 'Pending Verification': return <Clock size={12} />;
      case 'Not Verified': return <X size={12} />;
      default: return <FileCheck size={12} />;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin': return <Shield size={14} />;
      case 'Doctor': return <UserCheck size={14} />;
      case 'Patient': return <Users size={14} />;
      default: return <Users size={14} />;
    }
  };

  const getTabTitle = () => {
    return activeTab === 'users' ? 'User Management' : 'IC Verification Management';
  };

  const getTabDescription = () => {
    return activeTab === 'users' ? 'Manage users, roles, and permissions' : 'Review and verify patient identity documents';
  };

  return (
    <div className="user-mgmt-container">
      {/* Header */}
      <div className="user-mgmt-header">
        <div className="user-mgmt-title-section">
          <h2>{getTabTitle()}</h2>
          <p>{getTabDescription()}</p>
        </div>
        <div className="user-mgmt-actions">
          <button className="mgmt-btn secondary" onClick={() => window.location.reload()}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="mgmt-btn secondary">
            <Download size={16} />
            Export
          </button>
          {activeTab === 'users' && (
            <button className="mgmt-btn primary" onClick={handleAddUser}>
              <Plus size={16} />
              Add User
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="user-mgmt-tabs">
        <button
          className={`user-mgmt-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => handleTabChange('users')}
        >
          <Users size={16} />
          User Management
        </button>
        <button
          className={`user-mgmt-tab ${activeTab === 'ic-verification' ? 'active' : ''}`}
          onClick={() => handleTabChange('ic-verification')}
        >
          <FileCheck size={16} />
          IC Verification
        </button>
      </div>

      {/* Stats Cards */}
      <div className="user-mgmt-stats">
        <div className="user-mgmt-stat-card total">
          <div className="user-mgmt-stat-icon">
            {activeTab === 'users' ? <Users size={24} /> : <FileCheck size={24} />}
          </div>
          <div className="user-mgmt-stat-content">
            <h3>{getCurrentData().length}</h3>
            <p>Total {activeTab === 'users' ? 'Users' : 'Requests'}</p>
          </div>
        </div>
        <div className="user-mgmt-stat-card pending">
          <div className="user-mgmt-stat-icon">
            <Clock size={24} />
          </div>
          <div className="user-mgmt-stat-content">
            <h3>
              {activeTab === 'users'
                ? users.filter(u => u.icVerify === 'Pending Verification').length
                : icRequests.filter(r => r.status === 'Pending').length
              }
            </h3>
            <p>{activeTab === 'users' ? 'Pending Verification' : 'Pending Review'}</p>
          </div>
        </div>
        <div className="user-mgmt-stat-card active">
          <div className="user-mgmt-stat-icon">
            <Check size={24} />
          </div>
          <div className="user-mgmt-stat-content">
            <h3>
              {activeTab === 'users'
                ? users.filter(u => u.status === 'Active').length
                : icRequests.filter(r => r.status === 'Approved').length
              }
            </h3>
            <p>{activeTab === 'users' ? 'Active Users' : 'Approved'}</p>
          </div>
        </div>
        <div className="user-mgmt-stat-card blocked">
          <div className="user-mgmt-stat-icon">
            <X size={24} />
          </div>
          <div className="user-mgmt-stat-content">
            <h3>
              {activeTab === 'users'
                ? users.filter(u => u.status === 'Blocked').length
                : icRequests.filter(r => r.status === 'Rejected').length
              }
            </h3>
            <p>{activeTab === 'users' ? 'Blocked Users' : 'Rejected'}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="user-mgmt-controls">
        <div className="user-mgmt-search-section">
          <div className="user-mgmt-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder={
                activeTab === 'users'
                  ? "Search users by name, email, ID, or phone..."
                  : "Search by name, email, request ID, patient ID, or phone..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="user-mgmt-search-input"
            />
          </div>
          <button
            className={`mgmt-btn secondary ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedRecords.length > 0 && (
          <div className="user-mgmt-bulk-actions">
            <span className="user-mgmt-selected-count">
              {selectedRecords.length} {activeTab === 'users' ? 'user' : 'request'}{selectedRecords.length > 1 ? 's' : ''} selected
            </span>
            <div className="user-mgmt-bulk-buttons">
              {activeTab === 'users' ? (
                <button className="mgmt-btn danger small" onClick={handleBulkDelete}>
                  <Trash2 size={14} />
                  Delete Selected
                </button>
              ) : (
                <>
                  <button className="mgmt-btn success small" onClick={handleBulkApprove}>
                    <Check size={14} />
                    Bulk Approve
                  </button>
                  <button className="mgmt-btn danger small" onClick={handleBulkReject}>
                    <X size={14} />
                    Bulk Reject
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="user-mgmt-filter-panel">
            <div className="user-mgmt-filter-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                {activeTab === 'users' ? (
                  <>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Blocked">Blocked</option>
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
            <div className="user-mgmt-filter-group">
              <label>Role</label>
              <select
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              >
                <option value="all">All Roles</option>
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            {activeTab === 'users' && (
              <>
                <div className="user-mgmt-filter-group">
                  <label>IC Verification</label>
                  <select
                    value={filters.icVerify}
                    onChange={(e) => setFilters(prev => ({ ...prev, icVerify: e.target.value }))}
                  >
                    <option value="all">All Verification</option>
                    <option value="Verified">Verified</option>
                    <option value="Pending Verification">Pending</option>
                    <option value="Not Verified">Not Verified</option>
                  </select>
                </div>
                <div className="user-mgmt-filter-group">
                  <label>Gender</label>
                  <select
                    value={filters.gender}
                    onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                  >
                    <option value="all">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </>
            )}
            <button
              className="mgmt-btn secondary small"
              onClick={() => setFilters({ role: 'all', status: 'all', icVerify: 'all', gender: 'all' })}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="user-mgmt-table-container">
        <div className="user-mgmt-table-wrapper">
          <table className="user-mgmt-table">
            <thead>
              <tr>
                <th className="mgmt-th checkbox">
                  <input
                    type="checkbox"
                    checked={filteredRecords.length > 0 && selectedRecords.length === filteredRecords.length}
                    onChange={handleSelectAll}
                    className="mgmt-checkbox"
                  />
                </th>
                {/* Dynamic table headers based on active tab */}
                {activeTab === 'users' ? (
                  <>
                    <th className="mgmt-th sortable" onClick={() => handleSort('id')}>
                      User ID
                      {sortConfig.key === 'id' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </th>
                    <th className="mgmt-th sortable" onClick={() => handleSort('name')}>
                      Name
                      {sortConfig.key === 'name' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </th>
                    <th className="mgmt-th sortable" onClick={() => handleSort('email')}>
                      Email
                      {sortConfig.key === 'email' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </th>
                    <th className="mgmt-th">Gender</th>
                    <th className="mgmt-th sortable" onClick={() => handleSort('birthDate')}>
                      Birth Date
                      {sortConfig.key === 'birthDate' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </th>
                    <th className="mgmt-th">Role</th>
                    <th className="mgmt-th">IC Verify</th>
                    <th className="mgmt-th">Status</th>
                    <th className="mgmt-th sortable" onClick={() => handleSort('lastLogin')}>
                      Last Login
                      {sortConfig.key === 'lastLogin' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </th>
                    <th className="mgmt-th actions">Actions</th>
                  </>
                ) : (
                  <>
                    <th className="mgmt-th sortable" onClick={() => handleSort('requestID')}>
                      Request ID
                      {sortConfig.key === 'requestID' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </th>
                    <th className="mgmt-th sortable" onClick={() => handleSort('name')}>
                      Patient Name
                      {sortConfig.key === 'name' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </th>
                    <th className="mgmt-th sortable" onClick={() => handleSort('patientID')}>
                      Patient ID
                      {sortConfig.key === 'patientID' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </th>
                    <th className="mgmt-th">Contact</th>
                    <th className="mgmt-th">IC Images</th>
                    <th className="mgmt-th">Status</th>
                    <th className="mgmt-th sortable" onClick={() => handleSort('submittedAt')}>
                      Submitted
                      {sortConfig.key === 'submittedAt' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </th>
                    <th className="mgmt-th">Reviewed By</th>
                    <th className="mgmt-th actions">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id} className={selectedRecords.includes(record.id) ? 'selected' : ''}>
                  <td className="mgmt-td checkbox">
                    <input
                      type="checkbox"
                      checked={selectedRecords.includes(record.id)}
                      onChange={() => handleSelectRecord(record.id)}
                      className="mgmt-checkbox"
                    />
                  </td>

                  {/* Dynamic table cells based on active tab */}
                  {activeTab === 'users' ? (
                    <>
                      <td className="mgmt-td">
                        <span className="record-id">{record.id}</span>
                      </td>
                      <td className="mgmt-td">
                        <div className="user-cell">
                          <div className="user-avatar">
                            {record.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="user-info">
                            <div className="user-name">{record.name}</div>
                            <div className="user-phone">{record.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="mgmt-td">
                        <span className="user-email">{record.email}</span>
                      </td>
                      <td className="mgmt-td">
                        <span className="user-gender">{record.gender}</span>
                      </td>
                      <td className="mgmt-td">
                        <span className="date-text">{new Date(record.birthDate).toLocaleDateString()}</span>
                      </td>
                      <td className="mgmt-td">
                        <div className="role-cell">
                          {getRoleIcon(record.role)}
                          <span>{record.role}</span>
                        </div>
                      </td>
                      <td className="mgmt-td">
                        {record.role === 'Patient' ? (
                          <div className={getStatusBadge(record.icVerify)}>
                            {getStatusIcon(record.icVerify)}
                            <span>{record.icVerify}</span>
                          </div>
                        ) : (
                          <span className="na-text">-</span>
                        )}
                      </td>
                      <td className="mgmt-td">
                        <div className={getStatusBadge(record.status)}>
                          {getStatusIcon(record.status)}
                          <span>{record.status}</span>
                        </div>
                      </td>
                      <td className="mgmt-td">
                        <span className="date-text">{record.lastLogin !== '-' ? new Date(record.lastLogin).toLocaleDateString() : '-'}</span>
                      </td>
                      <td className="mgmt-td actions">
                        <div className="action-buttons">
                          <button
                            className="action-btn view"
                            title="View Details"
                            onClick={() => console.log('View user:', record.id)}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="action-btn edit"
                            title="Edit User"
                            onClick={() => handleEditUser(record.id)}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            className="action-btn delete"
                            title="Delete User"
                            onClick={() => handleDeleteUser(record.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="mgmt-td">
                        <span className="record-id">{record.requestID}</span>
                      </td>
                      <td className="mgmt-td">
                        <div className="user-cell">
                          <div className="user-avatar">
                            {record.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="user-info">
                            <div className="user-name">{record.name}</div>
                            <div className="user-role">{record.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="mgmt-td">
                        <span className="patient-id">{record.patientID}</span>
                      </td>
                      <td className="mgmt-td">
                        <div className="contact-info">
                          <div className="contact-email">{record.email}</div>
                          <div className="contact-phone">{record.phone}</div>
                        </div>
                      </td>
                      <td className="mgmt-td">
                        <div className="ic-images">
                          <div className="ic-image-preview">
                            <img src={record.frontImg} alt="Front IC" />
                            <span>Front</span>
                          </div>
                          <div className="ic-image-preview">
                            <img src={record.backImg} alt="Back IC" />
                            <span>Back</span>
                          </div>
                        </div>
                      </td>
                      <td className="mgmt-td">
                        <div className={getStatusBadge(record.status)}>
                          {getStatusIcon(record.status)}
                          <span>{record.status}</span>
                        </div>
                      </td>
                      <td className="mgmt-td">
                        <span className="date-text">{new Date(record.submittedAt).toLocaleDateString()}</span>
                      </td>
                      <td className="mgmt-td">
                        <span className="reviewer-text">
                          {record.reviewedBy || <span className="na-text">-</span>}
                        </span>
                      </td>
                      <td className="mgmt-td actions">
                        <div className="action-buttons">
                          <button
                            className="action-btn review"
                            title="Review Request"
                            onClick={() => handleReviewRequest(record)}
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRecords.length === 0 && (
            <div className="no-results">
              {activeTab === 'users' ? <Users size={48} /> : <FileCheck size={48} />}
              <p>No {activeTab === 'users' ? 'users' : 'IC verification requests'} found</p>
              <span>Try adjusting your search or filter criteria</span>
            </div>
          )}
        </div>

        {/* Table Footer */}
        <div className="user-mgmt-table-footer">
          <div className="user-mgmt-table-info">
            Showing {filteredRecords.length} of {getCurrentData().length} {activeTab === 'users' ? 'users' : 'requests'}
          </div>
        </div>
      </div>

      {/* User Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <>
          <div className="modal-backdrop" onClick={closeModal}></div>
          <div className="modal large">
            <div className="modal-header">
              <h3>{showEditModal ? `Edit User - ${editingUser?.name}` : 'Create New User'}</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-content">
              <div className="user-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Role *</label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleFormChange('role', e.target.value)}
                      className="form-select"
                    >
                      <option value="">-- Select Role --</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Pharmacist">Pharmacist</option>
                      <option value="Nurse">Nurse</option>
                      <option value="Patient">Patient</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  {formData.role === 'Doctor' && (
                    <div className="form-group">
                      <label>Expertise *</label>
                      <input
                        type="text"
                        value={formData.expertise}
                        onChange={(e) => handleFormChange('expertise', e.target.value)}
                        placeholder="e.g. Cardiologist"
                        className="form-input"
                      />
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleFormChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleFormChange('lastName', e.target.value)}
                      placeholder="Enter last name"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      placeholder="Enter email address"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      placeholder="e.g. +60123456789"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleFormChange('gender', e.target.value)}
                      className="form-select"
                    >
                      <option value="">-- Select Gender --</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Birth Date *</label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleFormChange('birthDate', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                {!showEditModal && (
                  <div className="form-row">
                    <div className="form-group">
                      <label>Password *</label>
                      <div className="password-input">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => handleFormChange('password', e.target.value)}
                          placeholder="Enter password"
                          className="form-input"
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Confirm Password *</label>
                      <div className="password-input">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => handleFormChange('confirmPassword', e.target.value)}
                          placeholder="Confirm password"
                          className="form-input"
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleFormChange('status', e.target.value)}
                      className="form-select"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      {showEditModal && <option value="Blocked">Blocked</option>}
                    </select>
                  </div>
                </div>

                {showEditModal && (
                  <div className="form-note">
                    <p><strong>Note:</strong> Password fields are not shown in edit mode for security. To change password, use the password reset function.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button className="mgmt-btn secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="mgmt-btn primary"
                onClick={handleFormSubmit}
                disabled={
                  !formData.firstName || !formData.lastName || !formData.email ||
                  !formData.gender || !formData.birthDate || !formData.phone || !formData.role ||
                  (formData.role === 'Doctor' && !formData.expertise) ||
                  (!showEditModal && (!formData.password || !formData.confirmPassword))
                }
              >
                {showEditModal ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* IC Verification Review Modal */}
      {showReviewModal && selectedRecord && (
        <>
          <div className="modal-backdrop" onClick={closeReviewModal}></div>
          <div className="modal large">
            <div className="modal-header">
              <h3>Review IC Verification - {selectedRecord.name}</h3>
              <button className="modal-close" onClick={closeReviewModal}>×</button>
            </div>
            <div className="modal-content">
              <div className="review-info">
                <div className="info-row">
                  <div className="info-item">
                    <label>Patient Name:</label>
                    <span>{selectedRecord.name}</span>
                  </div>
                  <div className="info-item">
                    <label>Patient ID:</label>
                    <span>{selectedRecord.patientID}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-item">
                    <label>User ID:</label>
                    <span>{selectedRecord.userID}</span>
                  </div>
                  <div className="info-item">
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

              {selectedRecord.status === 'Pending' && (
                <div className="form-section">
                  <div className="form-group">
                    <label>Decision *</label>
                    <select
                      value={approvalStatus}
                      onChange={(e) => setApprovalStatus(e.target.value)}
                      className="form-select"
                    >
                      <option value="">-- Select Decision --</option>
                      <option value="approved">Approve</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </div>

                  {approvalStatus === 'rejected' && (
                    <div className="form-group">
                      <label>Reason for Rejection *</label>
                      <textarea
                        rows={3}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Please provide a detailed reason for rejection..."
                        className="form-textarea"
                      />
                    </div>
                  )}
                </div>
              )}

              {selectedRecord.status !== 'Pending' && selectedRecord.rejectionReason && (
                <div className="info-section">
                  <h4>Rejection Reason</h4>
                  <p>{selectedRecord.rejectionReason}</p>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="mgmt-btn secondary" onClick={closeReviewModal}>
                {selectedRecord.status === 'Pending' ? 'Cancel' : 'Close'}
              </button>
              {selectedRecord.status === 'Pending' && (
                <button
                  className="mgmt-btn primary"
                  onClick={handleSubmitReview}
                  disabled={!approvalStatus || (approvalStatus === 'rejected' && rejectionReason.trim() === '')}
                >
                  Submit Review
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .user-mgmt-container {
          padding: 24px 32px;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .user-mgmt-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .user-mgmt-title-section h2 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 600;
          color: #1e293b;
        }

        .user-mgmt-title-section p {
          margin: 0;
          color: #64748b;
          font-size: 16px;
        }

        .user-mgmt-actions {
          display: flex;
          gap: 12px;
        }

        .user-mgmt-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 32px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 4px;
        }

        .user-mgmt-tab {
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

        .user-mgmt-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .user-mgmt-tab:hover:not(.active) {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .mgmt-btn {
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

        .mgmt-btn.small {
          padding: 8px 12px;
          font-size: 12px;
        }

        .mgmt-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .mgmt-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .mgmt-btn.primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .mgmt-btn.secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #64748b;
          border: 1px solid rgba(226, 232, 240, 0.8);
          backdrop-filter: blur(10px);
        }

        .mgmt-btn.secondary:hover,
        .mgmt-btn.secondary.active {
          background: rgba(255, 255, 255, 1);
          border-color: #667eea;
          color: #667eea;
        }

        .mgmt-btn.success {
          background: #22c55e;
          color: white;
        }

        .mgmt-btn.success:hover {
          background: #16a34a;
          transform: translateY(-2px);
        }

        .mgmt-btn.danger {
          background: #ef4444;
          color: white;
        }

        .mgmt-btn.danger:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        .user-mgmt-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .user-mgmt-stat-card {
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

        .user-mgmt-stat-card:hover {
          transform: translateY(-2px);
        }

        .user-mgmt-stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .user-mgmt-stat-card.total .user-mgmt-stat-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .user-mgmt-stat-card.pending .user-mgmt-stat-icon {
          background: linear-gradient(135deg, #faad14 0%, #f59e0b 100%);
        }

        .user-mgmt-stat-card.active .user-mgmt-stat-icon {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
        }

        .user-mgmt-stat-card.blocked .user-mgmt-stat-icon {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .user-mgmt-stat-content h3 {
          margin: 0 0 4px 0;
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }

        .user-mgmt-stat-content p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .user-mgmt-controls {
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

        .user-mgmt-search-section {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .user-mgmt-search-box {
          position: relative;
          flex: 1;
          max-width: 600px;
        }

        .user-mgmt-search-box svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          z-index: 1;
        }

        .user-mgmt-search-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .user-mgmt-search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .user-mgmt-bulk-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 12px;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .user-mgmt-selected-count {
          color: #667eea;
          font-weight: 500;
        }

        .user-mgmt-bulk-buttons {
          display: flex;
          gap: 8px;
        }

        .user-mgmt-filter-panel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          padding: 16px;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .user-mgmt-filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .user-mgmt-filter-group label {
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .user-mgmt-filter-group select {
          padding: 8px 12px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          cursor: pointer;
        }

        .user-mgmt-table-container {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          overflow: hidden;
        }

        .user-mgmt-table-wrapper {
          overflow-x: auto;
        }

        .user-mgmt-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          min-width: 1200px;
        }

        .mgmt-th {
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

        .mgmt-th.sortable {
          cursor: pointer;
          user-select: none;
          transition: all 0.2s ease;
        }

        .mgmt-th.sortable:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .mgmt-th.sortable svg {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
        }

        .mgmt-th.checkbox {
          width: 50px;
          text-align: center;
        }

        .mgmt-th.actions {
          width: 120px;
          text-align: center;
        }

        .mgmt-td {
          padding: 16px 12px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.3);
          font-size: 14px;
          color: #374151;
        }

        .mgmt-td.checkbox {
          text-align: center;
        }

        .mgmt-td.actions {
          text-align: center;
        }

        .user-mgmt-table tbody tr {
          transition: all 0.2s ease;
        }

        .user-mgmt-table tbody tr:hover {
          background: rgba(102, 126, 234, 0.05);
        }

        .user-mgmt-table tbody tr.selected {
          background: rgba(102, 126, 234, 0.1);
        }

        .mgmt-checkbox {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .record-id {
          font-family: monospace;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
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

        .user-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .user-name {
          font-weight: 500;
          color: #1e293b;
        }

        .user-phone,
        .user-role {
          font-size: 12px;
          color: #64748b;
        }

        .user-email {
          color: #64748b;
        }

        .user-gender {
          color: #64748b;
        }

        .date-text {
          color: #64748b;
          font-size: 13px;
        }

        .role-cell {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
        }

        .patient-id {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          font-family: monospace;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .contact-email {
          color: #64748b;
          font-size: 13px;
        }

        .contact-phone {
          color: #64748b;
          font-size: 12px;
          font-family: monospace;
        }

        .ic-images {
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

        .reviewer-text {
          color: #64748b;
          font-size: 13px;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .badge.success {
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
        }

        .badge.warning {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .badge.danger {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .badge.default {
          background: rgba(148, 163, 184, 0.1);
          color: #94a3b8;
        }

        .na-text {
          color: #94a3b8;
          font-style: italic;
        }

        .action-buttons {
          display: flex;
          gap: 4px;
          justify-content: center;
        }

        .action-btn {
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

        .action-btn.view {
          color: #3b82f6;
        }

        .action-btn.view:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .action-btn.edit {
          color: #16a34a;
        }

        .action-btn.edit:hover {
          background: #16a34a;
          color: white;
          border-color: #16a34a;
        }

        .action-btn.delete {
          color: #ef4444;
        }

        .action-btn.delete:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }

        .action-btn.review {
          color: #3b82f6;
        }

        .action-btn.review:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .no-results {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .no-results svg {
          color: #94a3b8;
          margin-bottom: 16px;
        }

        .no-results span {
          color: #94a3b8;
          font-size: 14px;
        }

        .user-mgmt-table-footer {
          padding: 16px 24px;
          background: rgba(248, 250, 252, 0.8);
          border-top: 1px solid rgba(226, 232, 240, 0.6);
        }

        .user-mgmt-table-info {
          color: #64748b;
          font-size: 14px;
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
          max-width: 800px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          z-index: 10000;
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.2);
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

        .modal-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
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

        /* Form Styles */
        .user-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-row:has(.form-group:only-child) {
          grid-template-columns: 1fr;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        .form-input,
        .form-select,
        .form-textarea {
          padding: 12px 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          transition: all 0.2s ease;
          color: #374151;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-select {
          cursor: pointer;
        }

        .form-textarea {
          resize: vertical;
        }

        .password-input {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .password-toggle:hover {
          color: #667eea;
        }

        .form-note {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          padding: 12px;
          margin-top: 16px;
        }

        .form-note p {
          margin: 0;
          color: #3b82f6;
          font-size: 14px;
        }

        .form-section {
          margin-bottom: 24px;
        }

        .form-section h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        /* IC Verification Modal specific styles */
        .review-info {
          margin-bottom: 24px;
        }

        .info-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 12px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-item label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        .info-item span {
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

        .info-section {
          margin-bottom: 24px;
        }

        .info-section h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .user-mgmt-container {
            padding: 16px;
          }

          .user-mgmt-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .user-mgmt-actions {
            justify-content: stretch;
          }

          .user-mgmt-actions .mgmt-btn {
            flex: 1;
            justify-content: center;
          }

          .user-mgmt-tabs {
            flex-direction: column;
            gap: 4px;
          }

          .user-mgmt-tab {
            justify-content: center;
          }

          .user-mgmt-stats {
            grid-template-columns: 1fr;
          }

          .user-mgmt-search-section {
            flex-direction: column;
            align-items: stretch;
          }

          .user-mgmt-search-box {
            max-width: none;
          }

          .user-mgmt-filter-panel {
            grid-template-columns: 1fr;
          }

          .user-mgmt-bulk-actions {
            flex-direction: column;
            gap: 12px;
          }

          .user-mgmt-table-wrapper {
            font-size: 12px;
          }

          .user-mgmt-table {
            min-width: 900px;
          }

          .mgmt-th,
          .mgmt-td {
            padding: 8px 6px;
          }

          .user-cell {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .user-avatar {
            width: 32px;
            height: 32px;
            font-size: 12px;
          }

          .action-buttons {
            flex-direction: column;
            gap: 2px;
          }

          .action-btn {
            width: 28px;
            height: 28px;
          }

          .modal {
            width: 95%;
            height: 90vh;
            max-height: 90vh;
            margin: 5vh auto;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
          }

          .modal-header,
          .modal-content,
          .modal-actions {
            padding-left: 20px;
            padding-right: 20px;
          }

          .form-row,
          .info-row,
          .ic-images-section {
            grid-template-columns: 1fr;
          }

          .modal-actions {
            flex-direction: column-reverse;
          }

          .modal-actions .mgmt-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default IntegratedUserManagement;