import React, { useState, useRef } from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  Shield,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  Camera,
  Upload,
  Check,
  AlertCircle,
  Activity,
  TrendingUp,
  Clock,
  Building,
  Award,
  Eye,
  EyeOff,
  Lock,
  Globe
} from 'lucide-react';

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('profile');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const fileInputRef = useRef(null);

  const [adminData, setAdminData] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@healthcare.com',
    phone: '+1 (555) 234-5678',
    position: 'Senior Administrator',
    department: 'Healthcare Operations',
    employeeId: 'ADM-2024-001',
    dateOfBirth: '1985-03-20',
    address: '456 Admin Street',
    city: 'Healthcare City',
    state: 'HC',
    zipCode: '54321',
    emergencyContact: 'Michael Johnson',
    emergencyPhone: '+1 (555) 876-5432',
    joinDate: '2020-01-15',
    lastLogin: '2024-07-30 09:15 AM',
    permissions: ['User Management', 'System Settings', 'Reports', 'Appointments']
  });

  const [editData, setEditData] = useState({ ...adminData });

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'profile', icon: User, label: 'My Profile' },
    { id: 'users', icon: Users, label: 'User Management' },
    { id: 'appointments', icon: Calendar, label: 'Appointments' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'settings', icon: Settings, label: 'System Settings' }
  ];

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...adminData });
  };

  const handleSave = () => {
    setAdminData({ ...editData });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditData({ ...adminData });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        setShowImageUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = [
    { label: 'Total Patients', value: '2,847', change: '+12%', color: '#3b82f6' },
    { label: 'Active Appointments', value: '156', change: '+8%', color: '#10b981' },
    { label: 'Pending Verifications', value: '23', change: '-5%', color: '#f59e0b' },
    { label: 'System Health', value: '98.5%', change: '+0.2%', color: '#8b5cf6' }
  ];

  return (
    <div className="admin-dashboard">
      <style>{`
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        }

        .admin-dashboard * {
          box-sizing: border-box;
        }

        /* Sidebar Styles */
        .admin-sidebar {
          width: ${sidebarCollapsed ? '80px' : '280px'};
          background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
          color: white;
          transition: width 0.3s ease;
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          z-index: 100;
          overflow-y: auto;
        }

        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: ${sidebarCollapsed ? 'center' : 'space-between'};
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 20px;
          font-weight: bold;
          color: white;
        }

        .sidebar-toggle {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .sidebar-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .sidebar-menu {
          padding: 16px 0;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-size: 14px;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .menu-item.active {
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          border-right: 3px solid #60a5fa;
        }

        .menu-item-text {
          display: ${sidebarCollapsed ? 'none' : 'block'};
        }

        /* Main Content Area */
        .admin-main {
          flex: 1;
          margin-left: ${sidebarCollapsed ? '80px' : '280px'};
          transition: margin-left 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        /* Top Header */
        .admin-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .page-title {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .breadcrumb {
          color: #64748b;
          font-size: 14px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input {
          padding: 8px 12px 8px 40px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          width: 300px;
          background: #f8fafc;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #64748b;
        }

        .notification-btn {
          position: relative;
          background: none;
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
        }

        .notification-btn:hover {
          background: #f1f5f9;
          color: #334155;
        }

        .notification-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 8px;
          height: 8px;
        }

        .admin-profile-dropdown {
          position: relative;
        }

        .profile-trigger {
          display: flex;
          align-items: center;
          gap: 12px;
          background: none;
          border: none;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .profile-trigger:hover {
          background: #f1f5f9;
        }

        .profile-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 16px;
          overflow: hidden;
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-info {
          text-align: left;
        }

        .profile-name {
          font-weight: 600;
          color: #1e293b;
          font-size: 14px;
          line-height: 1.2;
        }

        .profile-role {
          color: #64748b;
          font-size: 12px;
          line-height: 1.2;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          min-width: 220px;
          margin-top: 8px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.2s;
          z-index: 110;
        }

        .dropdown-menu.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #374151;
          transition: background 0.2s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
        }

        .dropdown-item:hover {
          background: #f8fafc;
        }

        .dropdown-item.danger {
          color: #dc2626;
        }

        .dropdown-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 8px 0;
        }

        /* Content Area */
        .admin-content {
          padding: 32px;
          flex: 1;
          overflow-y: auto;
        }

        /* Stats Cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border-left: 4px solid;
        }

        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .stat-title {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .stat-change {
          font-size: 14px;
          font-weight: 500;
        }

        .stat-change.positive {
          color: #10b981;
        }

        .stat-change.negative {
          color: #ef4444;
        }

        /* Profile Content */
        .profile-container {
          max-width: 1000px;
        }

        .profile-header-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .profile-header-content {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .profile-image-section {
          position: relative;
          flex-shrink: 0;
        }

        .profile-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: 600;
          overflow: hidden;
          border: 4px solid #f1f5f9;
        }

        .profile-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-upload-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #3b82f6;
          color: white;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          border: 3px solid white;
        }

        .image-upload-btn:hover {
          background: #2563eb;
          transform: scale(1.1);
        }

        .profile-details {
          flex: 1;
        }

        .admin-name {
          font-size: 28px;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .admin-position {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 16px;
        }

        .admin-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 14px;
        }

        .profile-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          font-size: 14px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .btn-secondary {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
        }

        .btn-secondary:hover {
          background: #e2e8f0;
        }

        /* Form Styles */
        .form-section {
          background: white;
          border-radius: 12px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s;
          background: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input:disabled {
          background: #f8fafc;
          color: #64748b;
          cursor: not-allowed;
        }

        .permissions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }

        .permission-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .permission-badge {
          background: #10b981;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .password-form {
          background: #fef7f0;
          border: 1px solid #fed7aa;
          border-radius: 12px;
          padding: 24px;
          margin-top: 24px;
        }

        .upload-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .upload-content {
          background: white;
          border-radius: 16px;
          padding: 32px;
          max-width: 400px;
          width: 90%;
          text-align: center;
        }

        .upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 40px;
          margin: 20px 0;
          cursor: pointer;
          transition: all 0.2s;
        }

        .upload-area:hover {
          border-color: #3b82f6;
          background: #f8fafc;
        }

        .hidden {
          display: none;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .admin-sidebar {
            width: ${sidebarCollapsed ? '0px' : '280px'};
            transform: translateX(${sidebarCollapsed ? '-100%' : '0'});
          }

          .admin-main {
            margin-left: 0;
          }

          .admin-header {
            padding: 16px;
          }

          .search-input {
            width: 200px;
          }

          .profile-header-content {
            flex-direction: column;
            text-align: center;
            gap: 24px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Shield size={28} />
            {!sidebarCollapsed && <span>Admin Panel</span>}
          </div>
          {!sidebarCollapsed && (
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        <div className="sidebar-menu">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`menu-item ${activeMenuItem === item.id ? 'active' : ''}`}
              onClick={() => setActiveMenuItem(item.id)}
              title={sidebarCollapsed ? item.label : ''}
            >
              <item.icon size={20} />
              <span className="menu-item-text">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Header */}
        <div className="admin-header">
          <div className="header-left">
            {sidebarCollapsed && (
              <button
                className="sidebar-toggle"
                onClick={() => setSidebarCollapsed(false)}
                style={{background: 'none', border: 'none', padding: '8px', cursor: 'pointer'}}
              >
                <Menu size={20} />
              </button>
            )}
            <div>
              <h1 className="page-title">
                {activeMenuItem === 'profile' ? 'My Profile' :
                 activeMenuItem === 'dashboard' ? 'Dashboard' :
                 activeMenuItem.charAt(0).toUpperCase() + activeMenuItem.slice(1)}
              </h1>
              <div className="breadcrumb">Admin / {activeMenuItem}</div>
            </div>
          </div>

          <div className="header-right">
            <div className="search-box">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
              />
            </div>

            <button className="notification-btn">
              <Bell size={20} />
              <div className="notification-badge"></div>
            </button>

            <div className="admin-profile-dropdown">
              <button
                className="profile-trigger"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="profile-avatar">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" />
                  ) : (
                    `${adminData.firstName[0]}${adminData.lastName[0]}`
                  )}
                </div>
                <div className="profile-info">
                  <div className="profile-name">{adminData.firstName} {adminData.lastName}</div>
                  <div className="profile-role">Administrator</div>
                </div>
                <ChevronDown size={16} />
              </button>

              <div className={`dropdown-menu ${profileDropdownOpen ? 'open' : ''}`}>
                <button className="dropdown-item" onClick={() => setActiveMenuItem('profile')}>
                  <User size={16} />
                  My Profile
                </button>
                <button className="dropdown-item">
                  <Settings size={16} />
                  Account Settings
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item danger">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="admin-content">
          {activeMenuItem === 'dashboard' && (
            <>
              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="stat-card"
                    style={{ borderLeftColor: stat.color }}
                  >
                    <div className="stat-header">
                      <div className="stat-title">{stat.label}</div>
                      <Activity size={20} style={{ color: stat.color }} />
                    </div>
                    <div className="stat-value">{stat.value}</div>
                    <div className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                      {stat.change} from last month
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeMenuItem === 'profile' && (
            <div className="profile-container">
              {/* Profile Header */}
              <div className="profile-header-card">
                <div className="profile-header-content">
                  <div className="profile-image-section">
                    <div className="profile-image">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" />
                      ) : (
                        `${adminData.firstName[0]}${adminData.lastName[0]}`
                      )}
                    </div>
                    <button
                      className="image-upload-btn"
                      onClick={() => setShowImageUpload(true)}
                    >
                      <Camera size={18} />
                    </button>
                  </div>

                  <div className="profile-details">
                    <h1 className="admin-name">
                      {adminData.firstName} {adminData.lastName}
                    </h1>
                    <p className="admin-position">{adminData.position} • {adminData.department}</p>

                    <div className="admin-meta">
                      <div className="meta-item">
                        <Building size={16} />
                        Employee ID: {adminData.employeeId}
                      </div>
                      <div className="meta-item">
                        <Calendar size={16} />
                        Joined: {new Date(adminData.joinDate).toLocaleDateString()}
                      </div>
                      <div className="meta-item">
                        <Clock size={16} />
                        Last Login: {adminData.lastLogin}
                      </div>
                      <div className="meta-item">
                        <Activity size={16} />
                        Status: Active
                      </div>
                    </div>
                  </div>

                  <div className="profile-actions">
                    {isEditing ? (
                      <>
                        <button className="btn btn-primary" onClick={handleSave}>
                          <Save size={18} />
                          Save Changes
                        </button>
                        <button className="btn btn-secondary" onClick={handleCancel}>
                          <X size={18} />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button className="btn btn-primary" onClick={handleEdit}>
                        <Edit2 size={18} />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="form-section">
                <h2 className="section-title">
                  <User size={20} />
                  Personal Information
                </h2>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-input"
                      value={isEditing ? editData.firstName : adminData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-input"
                      value={isEditing ? editData.lastName : adminData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      value={isEditing ? editData.email : adminData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      value={isEditing ? editData.phone : adminData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      className="form-input"
                      value={isEditing ? editData.dateOfBirth : adminData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Position</label>
                    <input
                      type="text"
                      name="position"
                      className="form-input"
                      value={isEditing ? editData.position : adminData.position}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      name="department"
                      className="form-input"
                      value={isEditing ? editData.department : adminData.department}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Employee ID</label>
                    <input
                      type="text"
                      name="employeeId"
                      className="form-input"
                      value={adminData.employeeId}
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="form-section">
                <h2 className="section-title">
                  <MapPin size={20} />
                  Address Information
                </h2>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-input"
                      value={isEditing ? editData.address : adminData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-input"
                      value={isEditing ? editData.city : adminData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      className="form-input"
                      value={isEditing ? editData.state : adminData.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      className="form-input"
                      value={isEditing ? editData.zipCode : adminData.zipCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="form-section">
                <h2 className="section-title">
                  <Phone size={20} />
                  Emergency Contact
                </h2>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Emergency Contact Name</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      className="form-input"
                      value={isEditing ? editData.emergencyContact : adminData.emergencyContact}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      className="form-input"
                      value={isEditing ? editData.emergencyPhone : adminData.emergencyPhone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Permissions & Access */}
              <div className="form-section">
                <h2 className="section-title">
                  <Shield size={20} />
                  Permissions & Access
                </h2>

                <div className="permissions-grid">
                  {adminData.permissions.map((permission, index) => (
                    <div key={index} className="permission-item">
                      <Check size={16} color="#10b981" />
                      <span className="permission-badge">{permission}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Settings */}
              <div className="form-section">
                <h2 className="section-title">
                  <Lock size={20} />
                  Security Settings
                </h2>

                <div style={{display: 'flex', gap: '16px', marginBottom: '24px'}}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                  >
                    <Lock size={18} />
                    Change Password
                  </button>
                  <button className="btn btn-secondary">
                    <Shield size={18} />
                    Two-Factor Authentication
                  </button>
                  <button className="btn btn-secondary">
                    <Globe size={18} />
                    Login Sessions
                  </button>
                </div>

                {showPasswordForm && (
                  <div className="password-form">
                    <h3 style={{marginBottom: '16px', color: '#1e293b'}}>Change Password</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Current Password</label>
                        <input
                          type="password"
                          className="form-input"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-input"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Confirm New Password</label>
                        <input
                          type="password"
                          className="form-input"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    <div style={{display: 'flex', gap: '12px', marginTop: '16px'}}>
                      <button className="btn btn-primary">
                        <Check size={18} />
                        Update Password
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowPasswordForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeMenuItem === 'users' && (
            <div>
              <h3 style={{color: '#64748b', textAlign: 'center', marginTop: '100px'}}>
                User Management Module - Coming Soon
              </h3>
            </div>
          )}

          {activeMenuItem === 'appointments' && (
            <div>
              <h3 style={{color: '#64748b', textAlign: 'center', marginTop: '100px'}}>
                Appointments Management - Coming Soon
              </h3>
            </div>
          )}

          {activeMenuItem === 'reports' && (
            <div>
              <h3 style={{color: '#64748b', textAlign: 'center', marginTop: '100px'}}>
                Reports & Analytics - Coming Soon
              </h3>
            </div>
          )}

          {activeMenuItem === 'security' && (
            <div>
              <h3 style={{color: '#64748b', textAlign: 'center', marginTop: '100px'}}>
                Security Center - Coming Soon
              </h3>
            </div>
          )}

          {activeMenuItem === 'settings' && (
            <div>
              <h3 style={{color: '#64748b', textAlign: 'center', marginTop: '100px'}}>
                System Settings - Coming Soon
              </h3>
            </div>
          )}
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="upload-modal">
          <div className="upload-content">
            <h3 style={{marginBottom: '16px', color: '#1f2937'}}>Update Profile Picture</h3>

            <div
              className="upload-area"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.background = '#f8fafc';
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.background = 'transparent';
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.background = 'transparent';
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                  const file = files[0];
                  if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setProfileImage(e.target.result);
                      setShowImageUpload(false);
                    };
                    reader.readAsDataURL(file);
                  }
                }
              }}
            >
              <Upload size={48} color="#6b7280" style={{marginBottom: '16px'}} />
              <p style={{color: '#6b7280', marginBottom: '8px'}}>
                Click to upload or drag and drop
              </p>
              <p style={{color: '#9ca3af', fontSize: '14px'}}>
                PNG, JPG up to 5MB
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <div style={{display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px'}}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowImageUpload(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={18} />
                Choose File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;