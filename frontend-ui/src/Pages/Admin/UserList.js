import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Trash2, Filter, ChevronDown, ChevronUp, Users, Shield, UserCheck, UserX, Eye, EyeOff, MoreHorizontal, Download, RefreshCw } from 'lucide-react';

const ModernUserList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    icVerify: 'all',
    gender: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showActions, setShowActions] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  // Sample user data - expanded for better demonstration
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

  // Real-time search and filter
  const filteredUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery);

      const matchesRole = filters.role === 'all' || user.role === filters.role;
      const matchesStatus = filters.status === 'all' || user.status === filters.status;
      const matchesICVerify = filters.icVerify === 'all' || user.icVerify === filters.icVerify;
      const matchesGender = filters.gender === 'all' || user.gender === filters.gender;

      return matchesSearch && matchesRole && matchesStatus && matchesICVerify && matchesGender;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.key === 'birthDate' || sortConfig.key === 'createdAt' || sortConfig.key === 'lastLogin') {
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
  }, [users, searchQuery, filters, sortConfig]);

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle user selection
  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
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
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} selected users?`)) {
      setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
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
      'Active': 'user-badge success',
      'Inactive': 'user-badge warning',
      'Blocked': 'user-badge danger'
    };
    return styles[status] || 'user-badge default';
  };

  const getICVerifyBadge = (icVerify, role) => {
    if (role !== 'Patient') return null;
    const styles = {
      'Verified': 'user-badge success',
      'Pending Verification': 'user-badge warning',
      'Not Verified': 'user-badge danger'
    };
    return styles[icVerify] || 'user-badge default';
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin': return <Shield size={14} />;
      case 'Doctor': return <UserCheck size={14} />;
      case 'Patient': return <Users size={14} />;
      default: return <Users size={14} />;
    }
  };

  return (
    <div className="user-list-container">
      {/* Header */}
      <div className="user-list-header">
        <div className="user-list-title-section">
          <h2>User Management</h2>
          <p>Manage users, roles, and permissions</p>
        </div>
        <div className="user-list-actions">
          <button className="user-btn secondary" onClick={() => window.location.reload()}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="user-btn secondary">
            <Download size={16} />
            Export
          </button>
          <button className="user-btn primary" onClick={handleAddUser}>
            <Plus size={16} />
            Add User
          </button>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <>
          <div className="user-modal-backdrop" onClick={closeModal}></div>
          <div className="user-modal large">
            <div className="user-modal-header">
              <h3>Create New User</h3>
              <button className="user-modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="user-modal-content">
              <div className="user-form">
                <div className="user-form-row">
                  <div className="user-form-group">
                    <label>Role *</label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleFormChange('role', e.target.value)}
                      className="user-form-select"
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
                    <div className="user-form-group">
                      <label>Expertise *</label>
                      <input
                        type="text"
                        value={formData.expertise}
                        onChange={(e) => handleFormChange('expertise', e.target.value)}
                        placeholder="e.g. Cardiologist"
                        className="user-form-input"
                      />
                    </div>
                  )}
                </div>

                <div className="user-form-row">
                  <div className="user-form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleFormChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                      className="user-form-input"
                    />
                  </div>
                  <div className="user-form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleFormChange('lastName', e.target.value)}
                      placeholder="Enter last name"
                      className="user-form-input"
                    />
                  </div>
                </div>

                <div className="user-form-row">
                  <div className="user-form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      placeholder="Enter email address"
                      className="user-form-input"
                    />
                  </div>
                  <div className="user-form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      placeholder="e.g. +60123456789"
                      className="user-form-input"
                    />
                  </div>
                </div>

                <div className="user-form-row">
                  <div className="user-form-group">
                    <label>Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleFormChange('gender', e.target.value)}
                      className="user-form-select"
                    >
                      <option value="">-- Select Gender --</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="user-form-group">
                    <label>Birth Date *</label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleFormChange('birthDate', e.target.value)}
                      className="user-form-input"
                    />
                  </div>
                </div>

                <div className="user-form-row">
                  <div className="user-form-group">
                    <label>Password *</label>
                    <div className="user-password-input">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleFormChange('password', e.target.value)}
                        placeholder="Enter password"
                        className="user-form-input"
                      />
                      <button
                        type="button"
                        className="user-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="user-form-group">
                    <label>Confirm Password *</label>
                    <div className="user-password-input">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleFormChange('confirmPassword', e.target.value)}
                        placeholder="Confirm password"
                        className="user-form-input"
                      />
                      <button
                        type="button"
                        className="user-password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="user-form-row">
                  <div className="user-form-group">
                    <label>Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleFormChange('status', e.target.value)}
                      className="user-form-select"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="user-modal-actions">
              <button className="user-btn secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="user-btn primary" onClick={handleFormSubmit}>
                Create User
              </button>
            </div>
          </div>
        </>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <>
          <div className="user-modal-backdrop" onClick={closeModal}></div>
          <div className="user-modal large">
            <div className="user-modal-header">
              <h3>Edit User - {editingUser.name}</h3>
              <button className="user-modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="user-modal-content">
              <div className="user-form">
                <div className="user-form-row">
                  <div className="user-form-group">
                    <label>Role *</label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleFormChange('role', e.target.value)}
                      className="user-form-select"
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
                    <div className="user-form-group">
                      <label>Expertise *</label>
                      <input
                        type="text"
                        value={formData.expertise}
                        onChange={(e) => handleFormChange('expertise', e.target.value)}
                        placeholder="e.g. Cardiologist"
                        className="user-form-input"
                      />
                    </div>
                  )}
                </div>

                <div className="user-form-row">
                  <div className="user-form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleFormChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                      className="user-form-input"
                    />
                  </div>
                  <div className="user-form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleFormChange('lastName', e.target.value)}
                      placeholder="Enter last name"
                      className="user-form-input"
                    />
                  </div>
                </div>

                <div className="user-form-row">
                  <div className="user-form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      placeholder="Enter email address"
                      className="user-form-input"
                    />
                  </div>
                  <div className="user-form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      placeholder="e.g. +60123456789"
                      className="user-form-input"
                    />
                  </div>
                </div>

                <div className="user-form-row">
                  <div className="user-form-group">
                    <label>Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleFormChange('gender', e.target.value)}
                      className="user-form-select"
                    >
                      <option value="">-- Select Gender --</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="user-form-group">
                    <label>Birth Date *</label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleFormChange('birthDate', e.target.value)}
                      className="user-form-input"
                    />
                  </div>
                </div>

                <div className="user-form-row">
                  <div className="user-form-group">
                    <label>Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleFormChange('status', e.target.value)}
                      className="user-form-select"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                </div>

                <div className="user-form-note">
                  <p><strong>Note:</strong> Password fields are not shown in edit mode for security. To change password, use the password reset function.</p>
                </div>
              </div>
            </div>
            <div className="user-modal-actions">
              <button className="user-btn secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="user-btn primary" onClick={handleFormSubmit}>
                Update User
              </button>
            </div>
          </div>
        </>
      )}

      {/* Stats Cards */}
      <div className="user-stats">
        <div className="user-stat-card total">
          <div className="user-stat-icon">
            <Users size={24} />
          </div>
          <div className="user-stat-content">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="user-stat-card active">
          <div className="user-stat-icon">
            <UserCheck size={24} />
          </div>
          <div className="user-stat-content">
            <h3>{users.filter(u => u.status === 'Active').length}</h3>
            <p>Active Users</p>
          </div>
        </div>
        <div className="user-stat-card pending">
          <div className="user-stat-icon">
            <Shield size={24} />
          </div>
          <div className="user-stat-content">
            <h3>{users.filter(u => u.icVerify === 'Pending Verification').length}</h3>
            <p>Pending Verification</p>
          </div>
        </div>
        <div className="user-stat-card blocked">
          <div className="user-stat-icon">
            <UserX size={24} />
          </div>
          <div className="user-stat-content">
            <h3>{users.filter(u => u.status === 'Blocked').length}</h3>
            <p>Blocked Users</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="user-controls">
        <div className="user-search-section">
          <div className="user-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search users by name, email, ID, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="user-search-input"
            />
          </div>
          <button
            className={`user-btn secondary ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="user-bulk-actions">
            <span className="user-selected-count">
              {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
            </span>
            <div className="user-bulk-buttons">
              <button className="user-btn danger small" onClick={handleBulkDelete}>
                <Trash2 size={14} />
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="user-filter-panel">
            <div className="user-filter-group">
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
            <div className="user-filter-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
            <div className="user-filter-group">
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
            <div className="user-filter-group">
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
            <button
              className="user-btn secondary small"
              onClick={() => setFilters({ role: 'all', status: 'all', icVerify: 'all', gender: 'all' })}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* User Table */}
      <div className="user-table-container">
        <div className="user-table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th className="user-th checkbox">
                  <input
                    type="checkbox"
                    checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                    onChange={handleSelectAll}
                    className="user-checkbox"
                  />
                </th>
                <th className="user-th sortable" onClick={() => handleSort('id')}>
                  User ID
                  {sortConfig.key === 'id' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                <th className="user-th sortable" onClick={() => handleSort('name')}>
                  Name
                  {sortConfig.key === 'name' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                <th className="user-th sortable" onClick={() => handleSort('email')}>
                  Email
                  {sortConfig.key === 'email' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                <th className="user-th">Gender</th>
                <th className="user-th sortable" onClick={() => handleSort('birthDate')}>
                  Birth Date
                  {sortConfig.key === 'birthDate' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                <th className="user-th">Role</th>
                <th className="user-th">IC Verify</th>
                <th className="user-th">Status</th>
                <th className="user-th sortable" onClick={() => handleSort('lastLogin')}>
                  Last Login
                  {sortConfig.key === 'lastLogin' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </th>
                <th className="user-th actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className={selectedUsers.includes(user.id) ? 'selected' : ''}>
                  <td className="user-td checkbox">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="user-checkbox"
                    />
                  </td>
                  <td className="user-td">
                    <span className="user-id">{user.id}</span>
                  </td>
                  <td className="user-td">
                    <div className="user-name-cell">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-name-info">
                        <div className="user-name">{user.name}</div>
                        <div className="user-phone">{user.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="user-td">
                    <span className="user-email">{user.email}</span>
                  </td>
                  <td className="user-td">
                    <span className="user-gender">{user.gender}</span>
                  </td>
                  <td className="user-td">
                    <span className="user-date">{new Date(user.birthDate).toLocaleDateString()}</span>
                  </td>
                  <td className="user-td">
                    <div className="user-role">
                      {getRoleIcon(user.role)}
                      <span>{user.role}</span>
                    </div>
                  </td>
                  <td className="user-td">
                    {getICVerifyBadge(user.icVerify, user.role) ? (
                      <span className={getICVerifyBadge(user.icVerify, user.role)}>
                        {user.icVerify}
                      </span>
                    ) : (
                      <span className="user-na">-</span>
                    )}
                  </td>
                  <td className="user-td">
                    <span className={getStatusBadge(user.status)}>
                      {user.status}
                    </span>
                  </td>
                  <td className="user-td">
                    <span className="user-date">{new Date(user.lastLogin).toLocaleDateString()}</span>
                  </td>
                  <td className="user-td actions">
                    <div className="user-action-buttons">
                      <button
                        className="user-action-btn view"
                        title="View Details"
                        onClick={() => console.log('View user:', user.id)}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="user-action-btn edit"
                        title="Edit User"
                        onClick={() => handleEditUser(user.id)}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="user-action-btn delete"
                        title="Delete User"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="user-no-results">
              <Users size={48} />
              <p>No users found</p>
              <span>Try adjusting your search or filter criteria</span>
            </div>
          )}
        </div>

        {/* Table Footer */}
        <div className="user-table-footer">
          <div className="user-table-info">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>

      <style jsx>{`
        .user-list-container {
          padding: 24px 32px;
          min-height: 100vh;
        }

        .user-list-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .user-list-title-section h2 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 600;
          color: #1e293b;
        }

        .user-list-title-section p {
          margin: 0;
          color: #64748b;
          font-size: 16px;
        }

        .user-list-actions {
          display: flex;
          gap: 12px;
        }

        .user-btn {
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

        .user-btn.small {
          padding: 8px 12px;
          font-size: 12px;
        }

        .user-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .user-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .user-btn.secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #64748b;
          border: 1px solid rgba(226, 232, 240, 0.8);
          backdrop-filter: blur(10px);
        }

        .user-btn.secondary:hover,
        .user-btn.secondary.active {
          background: rgba(255, 255, 255, 1);
          border-color: #667eea;
          color: #667eea;
        }

        .user-btn.danger {
          background: #ef4444;
          color: white;
        }

        .user-btn.danger:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        .user-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .user-stat-card {
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

        .user-stat-card:hover {
          transform: translateY(-2px);
        }

        .user-stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .user-stat-card.total .user-stat-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .user-stat-card.active .user-stat-icon {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
        }

        .user-stat-card.pending .user-stat-icon {
          background: linear-gradient(135deg, #faad14 0%, #f59e0b 100%);
        }

        .user-stat-card.blocked .user-stat-icon {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .user-stat-content h3 {
          margin: 0 0 4px 0;
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }

        .user-stat-content p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .user-controls {
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

        .user-search-section {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .user-search-box {
          position: relative;
          flex: 1;
          max-width: 500px;
        }

        .user-search-box svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          z-index: 1;
        }

        .user-search-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .user-search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .user-bulk-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 12px;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .user-selected-count {
          color: #667eea;
          font-weight: 500;
        }

        .user-bulk-buttons {
          display: flex;
          gap: 8px;
        }

        .user-filter-panel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          padding: 16px;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .user-filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .user-filter-group label {
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .user-filter-group select {
          padding: 8px 12px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          cursor: pointer;
        }

        .user-table-container {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          overflow: hidden;
        }

        .user-table-wrapper {
          overflow-x: auto;
        }

        .user-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          min-width: 1200px;
        }

        .user-th {
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

        .user-th.sortable {
          cursor: pointer;
          user-select: none;
          transition: all 0.2s ease;
        }

        .user-th.sortable:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .user-th.sortable svg {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
        }

        .user-th.checkbox {
          width: 50px;
          text-align: center;
        }

        .user-th.actions {
          width: 120px;
          text-align: center;
        }

        /* Specific column widths */
        .user-th:nth-child(2) { /* User ID */
          width: 100px;
        }

        .user-th:nth-child(3) { /* Name */
          width: 200px;
        }

        .user-th:nth-child(4) { /* Email */
          width: 200px;
        }

        .user-th:nth-child(5) { /* Gender */
          width: 80px;
        }

        .user-th:nth-child(6) { /* Birth Date */
          width: 120px;
        }

        .user-th:nth-child(7) { /* Role */
          width: 100px;
        }

        .user-th:nth-child(8) { /* IC Verify */
          width: 140px;
        }

        .user-th:nth-child(9) { /* Status */
          width: 100px;
        }

        .user-th:nth-child(10) { /* Last Login */
          width: 120px;
        }

        .user-td {
          padding: 16px 12px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.3);
          font-size: 14px;
          color: #374151;
        }

        .user-td.checkbox {
          text-align: center;
        }

        .user-td.actions {
          text-align: center;
        }

        .user-table tbody tr {
          transition: all 0.2s ease;
        }

        .user-table tbody tr:hover {
          background: rgba(102, 126, 234, 0.05);
        }

        .user-table tbody tr.selected {
          background: rgba(102, 126, 234, 0.1);
        }

        .user-checkbox {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .user-name-cell {
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

        .user-name-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .user-name {
          font-weight: 500;
          color: #1e293b;
        }

        .user-phone {
          font-size: 12px;
          color: #64748b;
        }

        .user-email {
          color: #64748b;
        }

        .user-id {
          font-family: monospace;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .user-role {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
        }

        .user-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .user-badge.success {
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
        }

        .user-badge.warning {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .user-badge.danger {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .user-badge.default {
          background: rgba(148, 163, 184, 0.1);
          color: #94a3b8;
        }

        .user-na {
          color: #94a3b8;
          font-style: italic;
        }

        .user-date {
          color: #64748b;
          font-size: 13px;
        }

        .user-action-buttons {
          display: flex;
          gap: 4px;
          justify-content: center;
        }

        .user-action-btn {
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

        .user-action-btn.view {
          color: #3b82f6;
        }

        .user-action-btn.view:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .user-action-btn.edit {
          color: #16a34a;
        }

        .user-action-btn.edit:hover {
          background: #16a34a;
          color: white;
          border-color: #16a34a;
        }

        .user-action-btn.delete {
          color: #ef4444;
        }

        .user-action-btn.delete:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }

        .user-no-results {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .user-no-results svg {
          color: #94a3b8;
          margin-bottom: 16px;
        }

        .user-no-results span {
          color: #94a3b8;
          font-size: 14px;
        }

        .user-table-footer {
          padding: 16px 24px;
          background: rgba(248, 250, 252, 0.8);
          border-top: 1px solid rgba(226, 232, 240, 0.6);
        }

        .user-table-info {
          color: #64748b;
          font-size: 14px;
        }

        /* Modal Styles */
        .user-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .user-modal {
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

        .user-modal-header {
          padding: 24px 32px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          margin-bottom: 24px;
          padding-bottom: 16px;
        }

        .user-modal-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }

        .user-modal-close {
          background: none;
          border: none;
          font-size: 24px;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
          transition: color 0.2s ease;
        }

        .user-modal-close:hover {
          color: #ef4444;
        }

        .user-modal-content {
          padding: 0 32px 32px;
        }

        .user-modal-actions {
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

        .user-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .user-form-row:has(.user-form-group:only-child) {
          grid-template-columns: 1fr;
        }

        .user-form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .user-form-group label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        .user-form-input,
        .user-form-select {
          padding: 12px 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          transition: all 0.2s ease;
          color: #374151;
        }

        .user-form-input:focus,
        .user-form-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .user-form-select {
          cursor: pointer;
        }

        .user-password-input {
          position: relative;
          display: flex;
          align-items: center;
        }

        .user-password-toggle {
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

        .user-password-toggle:hover {
          color: #667eea;
        }

        .user-form-note {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          padding: 12px;
          margin-top: 16px;
        }

        .user-form-note p {
          margin: 0;
          color: #3b82f6;
          font-size: 14px;
        }

        /* Fix container width to prevent sidebar scroll */
        .user-list-container {
          padding: 24px 32px;
          min-height: 100vh;
          max-width: 100%;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .user-list-container {
            padding: 16px;
            overflow-x: hidden;
          }

          .user-list-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .user-list-actions {
            justify-content: stretch;
          }

          .user-list-actions .user-btn {
            flex: 1;
            justify-content: center;
          }

          .user-stats {
            grid-template-columns: 1fr;
          }

          .user-search-section {
            flex-direction: column;
            align-items: stretch;
          }

          .user-search-box {
            max-width: none;
          }

          .user-filter-panel {
            grid-template-columns: 1fr;
          }

          .user-bulk-actions {
            flex-direction: column;
            gap: 12px;
          }

          .user-table-wrapper {
            font-size: 12px;
            overflow-x: auto;
          }

          .user-table {
            min-width: 900px;
          }

          .user-th,
          .user-td {
            padding: 8px 6px;
          }

          .user-name-cell {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .user-avatar {
            width: 32px;
            height: 32px;
            font-size: 12px;
          }

          .user-action-buttons {
            flex-direction: column;
            gap: 2px;
          }

          .user-action-btn {
            width: 28px;
            height: 28px;
          }

          /* Mobile Modal Styles */
          .user-modal {
            width: 95%;
            height: 90vh;
            max-height: 90vh;
            margin: 5vh auto;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
          }

          .user-modal-header,
          .user-modal-content,
          .user-modal-actions {
            padding-left: 20px;
            padding-right: 20px;
          }

          .user-form-row {
            grid-template-columns: 1fr;
          }

          .user-modal-actions {
            flex-direction: column-reverse;
          }

          .user-modal-actions .user-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ModernUserList;