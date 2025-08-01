import React, { useState , useRef } from 'react';
import { Key,Menu, Bell, Search, User,Camera ,Settings, LogOut, Home, FilePlus,Pill,Truck,Users, Package, CreditCard,FileText, BarChart3, Calendar, MessageSquare, Shield, ChevronDown, ChevronRight, Edit3, Clock, Activity, Briefcase } from 'lucide-react';
import { Outlet , useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const AdminLayout = ({ currentPage, onPageChange }) => {
   const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
   const [profileImage, setProfileImage] = useState(null);
     const fileInputRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  const triggerFileInput = () => {
      fileInputRef.current?.click();
    };

  const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };

  const getPageTitle = (pathname) => {
      switch (pathname) {
        case '/dashboard': return 'Dashboard';
        case '/schedule': return 'Schedule';
        case '/userlist' : return 'User List';
        case '/userverificationlist' : return 'Ic Verification';
        case '/medicalRecordList' : return 'Medical Record Management';
        case '/medicineList' : return 'Medicine Record Management';
        case '/dispenseList' : return 'Dispense Management';
        case '/inventoryList' : return 'Inventory Management';
        case '/report' : return 'Analytics & Reports';
        case '/paymentList' : return  'Billing & Payment ';
        case '/' : return  'Dashboard';
        // Add all other routes here
        default: return 'Admin Panel';
      }
    };
   const isActive = (item) => {
     const path = location.pathname;

     // Consider "/" as equivalent to "/dashboard"
     if ((path === '/' && item.id === 'dashboard') || path === `/${item.id}`) {
       return true;
     }

     // Match submenu paths too
     if (item.submenu) {
       return item.submenu.some((sub) => path === `/${sub.id}`);
     }

     return false;
   };
  const sidebarItems = [
    {
      icon: Home,
      label: 'Dashboard',
      id: 'dashboard',
      path: '/dashboard',
      active: currentPage === 'dashboard'
    },
    {
      icon: Users,
      label: 'User Management',
      id: 'userlist',
      active: currentPage === 'userlist'
    },
    {
      icon: Calendar,
      label: 'Appointments',
      id: 'schedule',
      active: currentPage === 'schedule'
//      submenu: [
//        { label: 'Schedule', id: 'schedule' },
//        { label: 'Calendar View', id: 'calendar' },
//        { label: 'Appointment History', id: 'appointment-history' }
//      ]
    },
    {
      icon: FilePlus,
      label: 'Medical Records',
      id: 'medicalRecordList',
      active: currentPage === 'medicalRecordList'
    },
    {
      icon: Pill,
      label: 'Medicine',
      id: 'medicineList',
      active: currentPage === 'medicineList'
    },
    {
      icon: Truck,
      label: 'Dispense Management',
      id: 'dispenseList',
      active: currentPage === 'dispenseList'
    },
    {
      icon: Package,
      label: 'Inventory Management',
      id: 'inventoryList',
      active: currentPage === 'messages'
    },
    {
      icon: CreditCard,
      label: 'Billing & Payment',
      id: 'paymentList',
      active: currentPage === 'paymentList'
    },
    {
          icon: BarChart3,
          label: 'Report',
          id: 'report',
          active: currentPage === 'report'
        },
  ];

  const toggleSubmenu = (itemId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

//  const getPageTitle = (pageId) => {
//    const titles = {
//      'dashboard': 'Dashboard',
//      'patients': 'Patients',
//      'add-patient': 'Add Patient',
//      'patient-reports': 'Patient Reports',
//      'schedule': 'Schedule Management',
//      'calendar': 'Calendar View',
//      'appointment-history': 'Appointment History',
//      'records': 'Medical Records',
//      'lab-results': 'Lab Results',
//      'prescriptions': 'Prescriptions',
//      'analytics': 'Analytics',
//      'reports': 'Reports',
//      'financial': 'Financial',
//      'apply-leave': 'Apply Leave',
//      'leave-history': 'Leave History',
//      'leave-calendar': 'Leave Calendar',
//      'messages': 'Messages',
//      'settings': 'Settings',
//      'user-settings': 'User Settings',
//      'permissions': 'Permissions',
//      'security': 'Security'
//    };
//    return titles[pageId] || 'Dashboard';
//  };

  return (
    <div className="admin-layout-container">
      {/* Sidebar */}
      <div className={`admin-layout-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-layout-sidebar-header">
          <div className="admin-layout-logo">
            <div className="admin-layout-logo-icon">
              <Shield size={28} />
            </div>
            {sidebarOpen && (
              <span className="admin-layout-logo-text">MedAdmin</span>
            )}
          </div>
        </div>

        <nav className="admin-layout-sidebar-nav">
          {sidebarItems.map((item, index) => (
            <div key={index} className="admin-layout-nav-group">
              <div
                className={`admin-layout-nav-item ${isActive(item) ? 'active' : ''}`}
                onClick={() => {
                  if (item.submenu) {
                    toggleSubmenu(item.id);
                  } else {
                    navigate(`/${item.id}`);
                  }
                }}
              >
                <item.icon size={20} />
                {sidebarOpen && (
                  <>
                    <span>{item.label}</span>
                    {item.submenu && (
                      <ChevronRight
                        size={16}
                        className={`admin-layout-submenu-icon ${expandedMenus[item.id] ? 'rotated' : ''}`}
                      />
                    )}
                  </>
                )}
              </div>
              {item.submenu && sidebarOpen && expandedMenus[item.id] && (
                <div className="admin-layout-submenu">
                  {item.submenu.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      className={`admin-layout-submenu-item ${location.pathname === `/${subItem.id}` ? 'active' : ''}`}
                      onClick={() => {
                        onPageChange(subItem.id);         // still call your handler if needed
                        navigate(`/${subItem.id}`);       // this changes the route
                      }}
                    >
                      {subItem.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-layout-main">
        {/* Top Navigation */}
        <div className="admin-layout-topnav">
          <div className="admin-layout-topnav-left">
            <button
              className="admin-layout-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </button>
            <h1 className="admin-layout-page-title">
              {getPageTitle(location.pathname)}
            </h1>
          </div>

          <div className="admin-layout-topnav-right">
            {/* Search */}
            <div className="admin-layout-search-container">
              <Search className="admin-layout-search-icon" size={16} />
              <input
                type="text"
                placeholder="Search patients, records..."
                className="admin-layout-search-input"
              />
            </div>

            {/* Notifications */}
            <button className="admin-layout-notification-btn">
              <Bell size={18} />
              {notificationCount > 0 && (
                <span className="admin-layout-notification-badge">{notificationCount}</span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="admin-layout-profile-dropdown">
              <button
                className="admin-layout-profile-trigger"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="admin-layout-profile-avatar">
                  <User size={16} />
                </div>
                <div className="admin-layout-profile-info">
                  <span className="admin-layout-profile-name">Dr. Sarah Wilson</span>
                  <span className="admin-layout-profile-role">Administrator</span>
                </div>
                <ChevronDown size={14} />
              </button>

              {profileDropdownOpen && (
                              <div className="admin-layout-dropdown-menu">
                                <a href="#" className="admin-layout-dropdown-item" onClick={() => setShowProfileModal(true)}>
                                  <Edit3 size={14} />
                                  Edit Profile
                                </a>
                                <a href="#" className="admin-layout-dropdown-item">
                                  <User size={14} />
                                  View Profile
                                </a>
                                <a href="#" className="admin-layout-dropdown-item" onClick={() => setShowResetPasswordModal(true)}>
                                  <Key size={14} />
                                  Reset Password
                                </a>
                                <a href="#" className="admin-layout-dropdown-item">
                                  <Settings size={14} />
                                  Settings
                                </a>
                                <div className="admin-layout-dropdown-divider"></div>
                                <a href="#" className="admin-layout-dropdown-item danger">
                                  <LogOut size={14} />
                                  Logout
                                </a>
                              </div>
                            )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="admin-layout-content">
          <Outlet />
        </div>
      </div>

      {/* Profile Edit Modal */}
            {showProfileModal && (
              <>
                <div className="admin-layout-modal-backdrop" onClick={() => setShowProfileModal(false)}></div>
                <div className="admin-layout-modal">
                  <div className="admin-layout-modal-header">
                    <h3>Edit Profile</h3>
                    <button className="admin-layout-modal-close" onClick={() => setShowProfileModal(false)}>
                      ×
                    </button>
                  </div>
                  <div className="admin-layout-modal-content">
                    <div className="admin-layout-profile-section">
                      <div className="admin-layout-profile-avatar-section">
                        <div className="admin-layout-profile-avatar-large">
                          {profileImage ? (
                            <img src={profileImage} alt="Profile" className="admin-layout-profile-image-large" />
                          ) : (
                            <User size={32} />
                          )}
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          style={{ display: 'none' }}
                        />
                        <button type="button" className="admin-layout-btn-secondary" onClick={triggerFileInput}>
                          <Camera size={16} />
                          Upload Photo
                        </button>
                      </div>
                      <div className="admin-layout-form-grid">
                        <div className="admin-layout-form-group">
                          <label>First Name</label>
                          <input type="text" defaultValue="Sarah" className="admin-layout-form-input" />
                        </div>
                        <div className="admin-layout-form-group">
                          <label>Last Name</label>
                          <input type="text" defaultValue="Wilson" className="admin-layout-form-input" />
                        </div>
                        <div className="admin-layout-form-group admin-layout-form-group-full">
                          <label>Email</label>
                          <input type="email" defaultValue="sarah.wilson@hospital.com" className="admin-layout-form-input" />
                        </div>
                      </div>
                      <div className="admin-layout-modal-actions">
                        <button type="button" className="admin-layout-btn-secondary" onClick={() => setShowProfileModal(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="admin-layout-btn-primary">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Reset Password Modal */}
            {showResetPasswordModal && (
              <>
                <div className="admin-layout-modal-backdrop" onClick={() => setShowResetPasswordModal(false)}></div>
                <div className="admin-layout-modal admin-layout-modal-small">
                  <div className="admin-layout-modal-header">
                    <h3>Reset Password</h3>
                    <button className="admin-layout-modal-close" onClick={() => setShowResetPasswordModal(false)}>
                      ×
                    </button>
                  </div>
                  <div className="admin-layout-modal-content">
                    <div className="admin-layout-form-grid">
                      <div className="admin-layout-form-group">
                        <label>Current Password</label>
                        <input type="password" className="admin-layout-form-input" placeholder="Enter current password" />
                      </div>
                      <div className="admin-layout-form-group">
                        <label>New Password</label>
                        <input type="password" className="admin-layout-form-input" placeholder="Enter new password" />
                      </div>
                      <div className="admin-layout-form-group">
                        <label>Confirm New Password</label>
                        <input type="password" className="admin-layout-form-input" placeholder="Confirm new password" />
                      </div>
                    </div>
                    <div className="admin-layout-password-requirements">
                      <h4>Password Requirements:</h4>
                      <ul>
                        <li>At least 8 characters long</li>
                        <li>Contains uppercase and lowercase letters</li>
                        <li>Contains at least one number</li>
                        <li>Contains at least one special character</li>
                      </ul>
                    </div>
                    <div className="admin-layout-modal-actions">
                      <button type="button" className="admin-layout-btn-secondary" onClick={() => setShowResetPasswordModal(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="admin-layout-btn-primary">
                        Reset Password
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Backdrop for mobile */}
            {sidebarOpen && (
              <div
                className="admin-layout-backdrop"
                onClick={() => setSidebarOpen(false)}
              ></div>
            )}

            <style jsx>{`
              .admin-layout-container {
                display: flex;
                height: 100vh;
                background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              }

              /* Sidebar Styles */
              .admin-layout-sidebar {
                width: 280px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-right: 1px solid rgba(226, 232, 240, 0.8);
                transition: all 0.3s ease;
                position: fixed;
                height: 100vh;
                left: 0;
                top: 0;
                z-index: 1000;
                overflow-y: auto;
              }

              .admin-layout-sidebar.closed {
                width: 80px;
              }

              .admin-layout-sidebar-header {
                padding: 24px 20px;
                border-bottom: 1px solid rgba(226, 232, 240, 0.6);
              }

              .admin-layout-logo {
                display: flex;
                align-items: center;
                gap: 12px;
              }

              .admin-layout-logo-icon {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                flex-shrink: 0;
              }

              .admin-layout-logo-text {
                font-size: 20px;
                font-weight: 700;
                color: #1e293b;
                white-space: nowrap;
              }

              .admin-layout-sidebar-nav {
                padding: 20px 0;
              }

              .admin-layout-nav-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 20px;
                color: #64748b;
                text-decoration: none;
                transition: all 0.2s ease;
                margin: 2px 12px;
                border-radius: 12px;
                position: relative;
                cursor: pointer;
              }

              .admin-layout-nav-item:hover {
                background: rgba(100, 116, 139, 0.1);
                color: #334155;
              }

              .admin-layout-nav-item.active {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
              }

              .admin-layout-nav-item span {
                white-space: nowrap;
                flex: 1;
              }

              .admin-layout-submenu-icon {
                transition: transform 0.2s ease;
              }

              .admin-layout-submenu-icon.rotated {
                transform: rotate(90deg);
              }

              .admin-layout-submenu {
                margin-left: 32px;
                margin-top: 4px;
                margin-bottom: 8px;
              }

              .admin-layout-submenu-item {
                padding: 8px 20px;
                color: #64748b;
                cursor: pointer;
                border-radius: 8px;
                margin: 2px 0;
                transition: all 0.2s ease;
                font-size: 14px;
              }

              .admin-layout-submenu-item:hover {
                background: rgba(100, 116, 139, 0.1);
                color: #334155;
              }

              .admin-layout-submenu-item.active {
                background: rgba(102, 126, 234, 0.1);
                color: #667eea;
                font-weight: 500;
              }

              /* Main Content */
              .admin-layout-main {
                flex: 1;
                margin-left: 280px;
                transition: margin-left 0.3s ease;
                display: flex;
                flex-direction: column;
              }

              .admin-layout-sidebar.closed + .admin-layout-main {
                margin-left: 80px;
              }

              /* Top Navigation */
              .admin-layout-topnav {
                height: 80px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-bottom: 1px solid rgba(226, 232, 240, 0.8);
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 32px;
                position: sticky;
                top: 0;
                z-index: 100;
              }

              .admin-layout-topnav-left {
                display: flex;
                align-items: center;
                gap: 20px;
              }

              .admin-layout-menu-toggle {
                background: none;
                border: none;
                padding: 8px;
                border-radius: 8px;
                cursor: pointer;
                color: #64748b;
                transition: all 0.2s ease;
              }

              .admin-layout-menu-toggle:hover {
                background: rgba(100, 116, 139, 0.1);
                color: #334155;
              }

              .admin-layout-page-title {
                font-size: 24px;
                font-weight: 600;
                color: #1e293b;
                margin: 0;
              }

              .admin-layout-topnav-right {
                display: flex;
                align-items: center;
                gap: 20px;
              }

              /* Search */
              .admin-layout-search-container {
                position: relative;
                display: flex;
                align-items: center;
              }

              .admin-layout-search-input {
                width: 300px;
                padding: 10px 16px 10px 40px;
                border: 1px solid rgba(226, 232, 240, 0.8);
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.8);
                backdrop-filter: blur(10px);
                font-size: 14px;
                transition: all 0.2s ease;
              }

              .admin-layout-search-input:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
              }

              .admin-layout-search-icon {
                position: absolute;
                left: 12px;
                color: #94a3b8;
              }

              /* Notifications */
              .admin-layout-notification-btn {
                position: relative;
                background: none;
                border: none;
                padding: 10px;
                border-radius: 12px;
                cursor: pointer;
                color: #64748b;
                transition: all 0.2s ease;
              }

              .admin-layout-notification-btn:hover {
                background: rgba(100, 116, 139, 0.1);
                color: #334155;
              }

              .admin-layout-notification-badge {
                position: absolute;
                top: 6px;
                right: 6px;
                background: #ef4444;
                color: white;
                border-radius: 50%;
                width: 18px;
                height: 18px;
                font-size: 11px;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              /* Profile Dropdown */
              .admin-layout-profile-dropdown {
                position: relative;
              }

              .admin-layout-profile-trigger {
                display: flex;
                align-items: center;
                gap: 12px;
                background: rgba(255, 255, 255, 0.8);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(226, 232, 240, 0.8);
                padding: 8px 12px;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
              }

              .admin-layout-profile-trigger:hover {
                background: rgba(255, 255, 255, 1);
                border-color: #667eea;
              }

              .admin-layout-profile-avatar {
                width: 36px;
                height: 36px;
                border-radius: 10px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
              }

              .admin-layout-profile-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }

              .admin-layout-profile-info {
                display: flex;
                flex-direction: column;
                text-align: left;
              }

              .admin-layout-profile-name {
                font-weight: 600;
                color: #1e293b;
                font-size: 14px;
                line-height: 1.2;
              }

              .admin-layout-profile-role {
                color: #64748b;
                font-size: 12px;
                line-height: 1.2;
              }

              .admin-layout-dropdown-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(226, 232, 240, 0.8);
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                min-width: 180px;
                margin-top: 8px;
                overflow: hidden;
              }

              .admin-layout-dropdown-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                color: #334155;
                text-decoration: none;
                transition: background-color 0.2s ease;
                font-size: 14px;
                cursor: pointer;
              }

              .admin-layout-dropdown-item:hover {
                background: rgba(100, 116, 139, 0.1);
              }

              .admin-layout-dropdown-item.danger {
                color: #dc2626;
              }

              .admin-layout-dropdown-item.danger:hover {
                background: rgba(220, 38, 38, 0.1);
              }

              .admin-layout-dropdown-divider {
                height: 1px;
                background: rgba(226, 232, 240, 0.8);
                margin: 4px 0;
              }

              /* Content Area */
              .admin-layout-content {
                flex: 1;
                overflow-y: auto;
              }

              /* Buttons */
              .admin-layout-btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 8px;
              }

              .admin-layout-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
              }

              .admin-layout-btn-secondary {
                background: rgba(255, 255, 255, 0.9);
                color: #64748b;
                border: 1px solid rgba(226, 232, 240, 0.8);
                padding: 12px 24px;
                border-radius: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                backdrop-filter: blur(10px);
              }

              .admin-layout-btn-secondary:hover {
                background: rgba(255, 255, 255, 1);
                border-color: #667eea;
                color: #667eea;
              }

              /* Modal Styles */
              .admin-layout-modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9999;
                backdrop-filter: blur(4px);
              }

              .admin-layout-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(226, 232, 240, 0.8);
                border-radius: 16px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                z-index: 10000;
                box-shadow: 0 20px 25px rgba(0, 0, 0, 0.2);
              }

              .admin-layout-modal-small {
                max-width: 450px;
              }

              .admin-layout-modal-header {
                padding: 24px 32px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(226, 232, 240, 0.6);
                margin-bottom: 24px;
                padding-bottom: 16px;
              }

              .admin-layout-modal-header h3 {
                margin: 0;
                font-size: 20px;
                font-weight: 600;
                color: #1e293b;
              }

              .admin-layout-modal-close {
                background: none;
                border: none;
                font-size: 24px;
                color: #64748b;
                cursor: pointer;
                padding: 4px;
                line-height: 1;
              }

              .admin-layout-modal-content {
                padding: 0 32px 32px;
              }

              .admin-layout-modal-actions {
                display: flex;
                justify-content: flex-end;
                gap: 16px;
                margin-top: 24px;
                padding-top: 24px;
                border-top: 1px solid rgba(226, 232, 240, 0.6);
              }

              .admin-layout-profile-avatar-section {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 16px;
                margin-bottom: 24px;
                padding-bottom: 24px;
                border-bottom: 1px solid rgba(226, 232, 240, 0.6);
              }

              .admin-layout-profile-avatar-large {
                width: 80px;
                height: 80px;
                border-radius: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
              }

              .admin-layout-profile-image-large {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }

              .admin-layout-form-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
              }

              .admin-layout-form-group {
                display: flex;
                flex-direction: column;
              }

              .admin-layout-form-group-full {
                grid-column: 1 / -1;
              }

              .admin-layout-form-group label {
                margin-bottom: 8px;
                font-weight: 500;
                color: #374151;
                font-size: 14px;
              }

              .admin-layout-form-input,
              .admin-layout-form-select {
                padding: 12px 16px;
                border: 1px solid rgba(226, 232, 240, 0.8);
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.8);
                backdrop-filter: blur(10px);
                font-size: 14px;
                transition: all 0.2s ease;
              }

              .admin-layout-form-input:focus,
              .admin-layout-form-select:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
              }

              .admin-layout-password-requirements {
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 16px;
              }

              .admin-layout-password-requirements h4 {
                color: #374151;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 8px;
              }

              .admin-layout-password-requirements ul {
                list-style: none;
                margin: 0;
                padding: 0;
              }

              .admin-layout-password-requirements li {
                color: #6b7280;
                font-size: 13px;
                padding: 2px 0;
                position: relative;
                padding-left: 16px;
              }

              .admin-layout-password-requirements li:before {
                content: "•";
                color: #667eea;
                position: absolute;
                left: 0;
              }

              /* Mobile Backdrop */
              .admin-layout-backdrop {
                display: none;
              }

              /* Mobile Responsive */
              @media (max-width: 1024px) {
                .admin-layout-sidebar {
                  transform: translateX(-100%);
                }

                .admin-layout-sidebar.open {
                  transform: translateX(0);
                }

                .admin-layout-main {
                  margin-left: 0;
                }

                .admin-layout-backdrop {
                  display: block;
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: rgba(0, 0, 0, 0.5);
                  z-index: 999;
                }

                .admin-layout-search-input {
                  width: 200px;
                }
              }

              @media (max-width: 768px) {
                .admin-layout-topnav {
                  padding: 0 16px;
                }

                .admin-layout-search-container {
                  display: none;
                }

                .admin-layout-profile-info {
                  display: none;
                }

                .admin-layout-modal {
                  width: 95%;
                  margin: 20px;
                }

                .admin-layout-modal-header,
                .admin-layout-modal-content {
                  padding-left: 20px;
                  padding-right: 20px;
                }

                .admin-layout-form-grid {
                  grid-template-columns: 1fr;
                }
              }
            `}</style>
    </div>
  );
};

export default AdminLayout;