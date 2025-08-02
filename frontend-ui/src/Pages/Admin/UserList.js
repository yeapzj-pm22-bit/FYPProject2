import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Trash2, Filter, ChevronDown, ChevronUp, Users, Shield, UserCheck, UserX, Eye, EyeOff, MoreHorizontal, Download, RefreshCw, FileCheck, Clock, X, Check } from 'lucide-react';
import "./css/UserList.css";
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


    </div>
  );
};

export default IntegratedUserManagement;