import React, { useState } from 'react';
import { Menu, Bell, Search, User, Settings, LogOut, Home, Users, FileText, BarChart3, Calendar, MessageSquare, Shield, ChevronDown, ChevronRight, Plus, Edit3, Eye, Trash2, Filter, Download, UserPlus, Clock, Activity, DollarSign, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [expandedMenus, setExpandedMenus] = useState({});
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  // Sample data for tables
  const [patients, setPatients] = useState([
    { id: 1, name: 'John Doe', age: 35, gender: 'Male', phone: '+1234567890', email: 'john@email.com', lastVisit: '2024-01-15', status: 'Active' },
    { id: 2, name: 'Jane Smith', age: 42, gender: 'Female', phone: '+1234567891', email: 'jane@email.com', lastVisit: '2024-01-14', status: 'Active' },
    { id: 3, name: 'Mike Johnson', age: 28, gender: 'Male', phone: '+1234567892', email: 'mike@email.com', lastVisit: '2024-01-10', status: 'Inactive' },
    { id: 4, name: 'Sarah Wilson', age: 55, gender: 'Female', phone: '+1234567893', email: 'sarah@email.com', lastVisit: '2024-01-12', status: 'Active' },
    { id: 5, name: 'David Brown', age: 31, gender: 'Male', phone: '+1234567894', email: 'david@email.com', lastVisit: '2024-01-08', status: 'Active' },
  ]);

  const [tableSearch, setTableSearch] = useState('');
  const [tableFilter, setTableFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sidebarItems = [
    {
      icon: Home,
      label: 'Dashboard',
      id: 'dashboard',
      active: currentPage === 'dashboard'
    },
    {
      icon: Users,
      label: 'Patients',
      id: 'patients',
      active: currentPage === 'patients',
      submenu: [
        { label: 'All Patients', id: 'patients' },
        { label: 'Add Patient', id: 'add-patient' },
        { label: 'Patient Reports', id: 'patient-reports' }
      ]
    },
    {
      icon: Calendar,
      label: 'Appointments',
      id: 'appointments',
      active: currentPage === 'appointments',
      submenu: [
        { label: 'Today\'s Schedule', id: 'appointments' },
        { label: 'Calendar View', id: 'calendar' },
        { label: 'Appointment History', id: 'appointment-history' }
      ]
    },
    {
      icon: FileText,
      label: 'Medical Records',
      id: 'records',
      active: currentPage === 'records',
      submenu: [
        { label: 'All Records', id: 'records' },
        { label: 'Lab Results', id: 'lab-results' },
        { label: 'Prescriptions', id: 'prescriptions' }
      ]
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      id: 'analytics',
      active: currentPage === 'analytics',
      submenu: [
        { label: 'Overview', id: 'analytics' },
        { label: 'Reports', id: 'reports' },
        { label: 'Financial', id: 'financial' }
      ]
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      id: 'messages',
      active: currentPage === 'messages'
    },
    {
      icon: Settings,
      label: 'Settings',
      id: 'settings',
      active: currentPage === 'settings',
      submenu: [
        { label: 'General', id: 'settings' },
        { label: 'Users', id: 'user-settings' },
        { label: 'Permissions', id: 'permissions' }
      ]
    },
    {
      icon: Shield,
      label: 'Security',
      id: 'security',
      active: currentPage === 'security'
    },
  ];

  const toggleSubmenu = (itemId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredPatients = React.useMemo(() => {
    let filteredPatients = patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
                          patient.email.toLowerCase().includes(tableSearch.toLowerCase());
      const matchesFilter = tableFilter === 'All' || patient.status === tableFilter;
      return matchesSearch && matchesFilter;
    });

    if (sortConfig.key) {
      filteredPatients.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredPatients;
  }, [patients, tableSearch, tableFilter, sortConfig]);

  const statsCards = [
    { title: 'Total Patients', value: '2,847', change: '+12%', color: 'blue' },
    { title: 'Today\'s Appointments', value: '24', change: '+8%', color: 'green' },
    { title: 'Pending Records', value: '156', change: '-3%', color: 'orange' },
    { title: 'Monthly Revenue', value: '$45,890', change: '+18%', color: 'purple' },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <div className="admin-logo-icon">
              <Shield size={28} />
            </div>
            {sidebarOpen && (
              <span className="admin-logo-text">MedAdmin</span>
            )}
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {sidebarItems.map((item, index) => (
            <div key={index} className="admin-nav-group">
              <div
                className={`admin-nav-item ${item.active ? 'active' : ''}`}
                onClick={() => {
                  if (item.submenu) {
                    toggleSubmenu(item.id);
                  } else {
                    setCurrentPage(item.id);
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
                        className={`admin-submenu-icon ${expandedMenus[item.id] ? 'rotated' : ''}`}
                      />
                    )}
                  </>
                )}
              </div>
              {item.submenu && sidebarOpen && expandedMenus[item.id] && (
                <div className="admin-submenu">
                  {item.submenu.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      className={`admin-submenu-item ${currentPage === subItem.id ? 'active' : ''}`}
                      onClick={() => setCurrentPage(subItem.id)}
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
      <div className="admin-main">
        {/* Top Navigation */}
        <div className="admin-topnav">
          <div className="admin-topnav-left">
            <button
              className="admin-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </button>
            <h1 className="admin-page-title">
              {currentPage === 'dashboard' && 'Dashboard'}
              {currentPage === 'patients' && 'Patients'}
              {currentPage === 'add-patient' && 'Add Patient'}
              {currentPage === 'reports' && 'Reports'}
              {currentPage === 'analytics' && 'Analytics'}
              {currentPage === 'appointments' && 'Appointments'}
              {currentPage === 'records' && 'Medical Records'}
              {currentPage === 'messages' && 'Messages'}
              {currentPage === 'settings' && 'Settings'}
              {currentPage === 'security' && 'Security'}
            </h1>
          </div>

          <div className="admin-topnav-right">
            {/* Search */}
            <div className="admin-search-container">
              <Search className="admin-search-icon" size={16} />
              <input
                type="text"
                placeholder="Search patients, records..."
                className="admin-search-input"
              />
            </div>

            {/* Notifications */}
            <button className="admin-notification-btn">
              <Bell size={18} />
              {notificationCount > 0 && (
                <span className="admin-notification-badge">{notificationCount}</span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="admin-profile-dropdown">
              <button
                className="admin-profile-trigger"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="admin-profile-avatar">
                  <User size={16} />
                </div>
                <div className="admin-profile-info">
                  <span className="admin-profile-name">Dr. Sarah Wilson</span>
                  <span className="admin-profile-role">Administrator</span>
                </div>
                <ChevronDown size={14} />
              </button>

              {profileDropdownOpen && (
                <div className="admin-dropdown-menu">
                  <a href="#" className="admin-dropdown-item" onClick={() => setShowProfileModal(true)}>
                    <Edit3 size={14} />
                    Edit Profile
                  </a>
                  <a href="#" className="admin-dropdown-item">
                    <User size={14} />
                    View Profile
                  </a>
                  <a href="#" className="admin-dropdown-item">
                    <Settings size={14} />
                    Settings
                  </a>
                  <div className="admin-dropdown-divider"></div>
                  <a href="#" className="admin-dropdown-item danger">
                    <LogOut size={14} />
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="admin-content">
          {currentPage === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="admin-stats-grid">
                {statsCards.map((stat, index) => (
                  <div key={index} className={`admin-stat-card ${stat.color}`}>
                    <div className="admin-stat-header">
                      <h3 className="admin-stat-title">{stat.title}</h3>
                      <span className={`admin-stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                        {stat.change}
                      </span>
                    </div>
                    <div className="admin-stat-value">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Content Grid */}
              <div className="admin-dashboard-grid">
                {/* Recent Activity */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>Recent Activity</h3>
                  </div>
                  <div className="admin-card-content">
                    <div className="admin-activity-list">
                      <div className="admin-activity-item">
                        <div className="admin-activity-icon blue">
                          <Users size={14} />
                        </div>
                        <div className="admin-activity-details">
                          <p>New patient registered</p>
                          <span>John Doe - 2 minutes ago</span>
                        </div>
                      </div>
                      <div className="admin-activity-item">
                        <div className="admin-activity-icon green">
                          <Calendar size={14} />
                        </div>
                        <div className="admin-activity-details">
                          <p>Appointment completed</p>
                          <span>Dr. Smith - 15 minutes ago</span>
                        </div>
                      </div>
                      <div className="admin-activity-item">
                        <div className="admin-activity-icon orange">
                          <FileText size={14} />
                        </div>
                        <div className="admin-activity-details">
                          <p>Medical record updated</p>
                          <span>Patient ID: 12345 - 1 hour ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>Quick Actions</h3>
                  </div>
                  <div className="admin-card-content">
                    <div className="admin-quick-actions">
                      <button className="admin-quick-action-btn blue" onClick={() => setCurrentPage('add-patient')}>
                        <Users size={16} />
                        Add Patient
                      </button>
                      <button className="admin-quick-action-btn green" onClick={() => setCurrentPage('appointments')}>
                        <Calendar size={16} />
                        Schedule Appointment
                      </button>
                      <button className="admin-quick-action-btn orange" onClick={() => setCurrentPage('records')}>
                        <FileText size={16} />
                        Create Record
                      </button>
                      <button className="admin-quick-action-btn purple" onClick={() => setCurrentPage('reports')}>
                        <BarChart3 size={16} />
                        View Reports
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentPage === 'patients' && (
            <div className="admin-patients-page">
              <div className="admin-page-header">
                <h2>Patients Management</h2>
                <button className="admin-btn-primary" onClick={() => setCurrentPage('add-patient')}>
                  <UserPlus size={16} />
                  Add New Patient
                </button>
              </div>

              <div className="admin-table-controls">
                <div className="admin-search-filter">
                  <div className="admin-search-container">
                    <Search className="admin-search-icon" size={16} />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      className="admin-search-input"
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                    />
                  </div>
                  <select
                    className="admin-filter-select"
                    value={tableFilter}
                    onChange={(e) => setTableFilter(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <button className="admin-btn-secondary">
                  <Download size={16} />
                  Export
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('id')} className="admin-sortable">
                        ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('name')} className="admin-sortable">
                        Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('age')} className="admin-sortable">
                        Age {sortConfig.key === 'age' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>Gender</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th onClick={() => handleSort('lastVisit')} className="admin-sortable">
                        Last Visit {sortConfig.key === 'lastVisit' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAndFilteredPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td>{patient.id}</td>
                        <td className="admin-patient-name">{patient.name}</td>
                        <td>{patient.age}</td>
                        <td>{patient.gender}</td>
                        <td>{patient.phone}</td>
                        <td>{patient.email}</td>
                        <td>{patient.lastVisit}</td>
                        <td>
                          <span className={`admin-status ${patient.status.toLowerCase()}`}>
                            {patient.status}
                          </span>
                        </td>
                        <td>
                          <div className="admin-action-buttons">
                            <button className="admin-action-btn view">
                              <Eye size={14} />
                            </button>
                            <button className="admin-action-btn edit">
                              <Edit3 size={14} />
                            </button>
                            <button className="admin-action-btn delete">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentPage === 'reports' && (
            <div className="admin-reports-page">
              <div className="admin-page-header">
                <h2>Reports & Analytics</h2>
                <div className="admin-report-actions">
                  <button className="admin-btn-secondary">
                    <Filter size={16} />
                    Filter
                  </button>
                  <button className="admin-btn-primary">
                    <Download size={16} />
                    Export Report
                  </button>
                </div>
              </div>

              <div className="admin-reports-grid">
                <div className="admin-report-card">
                  <div className="admin-report-icon patients">
                    <Users size={24} />
                  </div>
                  <div className="admin-report-content">
                    <h3>Patient Analytics</h3>
                    <p>Total Registrations: <strong>2,847</strong></p>
                    <p>New This Month: <strong>342</strong></p>
                    <p>Growth Rate: <strong>+12%</strong></p>
                  </div>
                </div>

                <div className="admin-report-card">
                  <div className="admin-report-icon appointments">
                    <Calendar size={24} />
                  </div>
                  <div className="admin-report-content">
                    <h3>Appointment Analytics</h3>
                    <p>Total Appointments: <strong>1,456</strong></p>
                    <p>This Week: <strong>124</strong></p>
                    <p>Completion Rate: <strong>94%</strong></p>
                  </div>
                </div>

                <div className="admin-report-card">
                  <div className="admin-report-icon revenue">
                    <DollarSign size={24} />
                  </div>
                  <div className="admin-report-content">
                    <h3>Revenue Analytics</h3>
                    <p>Monthly Revenue: <strong>$45,890</strong></p>
                    <p>Daily Average: <strong>$1,486</strong></p>
                    <p>Growth: <strong>+18%</strong></p>
                  </div>
                </div>

                <div className="admin-report-card">
                  <div className="admin-report-icon performance">
                    <TrendingUp size={24} />
                  </div>
                  <div className="admin-report-content">
                    <h3>Performance Metrics</h3>
                    <p>Average Wait Time: <strong>12 mins</strong></p>
                    <p>Patient Satisfaction: <strong>4.8/5</strong></p>
                    <p>Efficiency Score: <strong>92%</strong></p>
                  </div>
                </div>
              </div>

              <div className="admin-chart-section">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>Monthly Trends</h3>
                  </div>
                  <div className="admin-card-content">
                    <div className="admin-chart-placeholder">
                      <p>📊 Chart visualization would be displayed here</p>
                      <p>Sample data: Patient visits, Revenue trends, Appointment patterns</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentPage === 'add-patient' && (
            <div className="admin-form-page">
              <div className="admin-page-header">
                <h2>Add New Patient</h2>
                <button className="admin-btn-secondary" onClick={() => setCurrentPage('patients')}>
                  Back to Patients
                </button>
              </div>

              <div className="admin-form-container">
                <form className="admin-form">
                  <div className="admin-form-section">
                    <h3>Personal Information</h3>
                    <div className="admin-form-grid">
                      <div className="admin-form-group">
                        <label>First Name *</label>
                        <input type="text" placeholder="Enter first name" className="admin-form-input" />
                      </div>
                      <div className="admin-form-group">
                        <label>Last Name *</label>
                        <input type="text" placeholder="Enter last name" className="admin-form-input" />
                      </div>
                      <div className="admin-form-group">
                        <label>Date of Birth *</label>
                        <input type="date" className="admin-form-input" />
                      </div>
                      <div className="admin-form-group">
                        <label>Gender *</label>
                        <select className="admin-form-select">
                          <option>Select gender</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="admin-form-section">
                    <h3>Contact Information</h3>
                    <div className="admin-form-grid">
                      <div className="admin-form-group">
                        <label>Email Address *</label>
                        <input type="email" placeholder="patient@email.com" className="admin-form-input" />
                      </div>
                      <div className="admin-form-group">
                        <label>Phone Number *</label>
                        <input type="tel" placeholder="+1 (555) 123-4567" className="admin-form-input" />
                      </div>
                      <div className="admin-form-group admin-form-group-full">
                        <label>Address</label>
                        <textarea placeholder="Enter full address" className="admin-form-textarea"></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="admin-form-section">
                    <h3>Medical Information</h3>
                    <div className="admin-form-grid">
                      <div className="admin-form-group">
                        <label>Blood Type</label>
                        <select className="admin-form-select">
                          <option>Select blood type</option>
                          <option>A+</option>
                          <option>A-</option>
                          <option>B+</option>
                          <option>B-</option>
                          <option>AB+</option>
                          <option>AB-</option>
                          <option>O+</option>
                          <option>O-</option>
                        </select>
                      </div>
                      <div className="admin-form-group">
                        <label>Emergency Contact</label>
                        <input type="text" placeholder="Emergency contact name" className="admin-form-input" />
                      </div>
                      <div className="admin-form-group">
                        <label>Emergency Phone</label>
                        <input type="tel" placeholder="+1 (555) 123-4567" className="admin-form-input" />
                      </div>
                      <div className="admin-form-group">
                        <label>Insurance Provider</label>
                        <input type="text" placeholder="Insurance company" className="admin-form-input" />
                      </div>
                      <div className="admin-form-group admin-form-group-full">
                        <label>Medical History</label>
                        <textarea placeholder="Brief medical history, allergies, medications..." className="admin-form-textarea"></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="admin-form-actions">
                    <button type="button" className="admin-btn-secondary">Cancel</button>
                    <button type="submit" className="admin-btn-primary">Save Patient</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <>
          <div className="admin-modal-backdrop" onClick={() => setShowProfileModal(false)}></div>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>Edit Profile</h3>
              <button className="admin-modal-close" onClick={() => setShowProfileModal(false)}>
                ×
              </button>
            </div>
            <div className="admin-modal-content">
              <form className="admin-profile-form">
                <div className="admin-profile-avatar-section">
                  <div className="admin-profile-avatar-large">
                    <User size={32} />
                  </div>
                  <button type="button" className="admin-btn-secondary">Change Photo</button>
                </div>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label>First Name</label>
                    <input type="text" defaultValue="Sarah" className="admin-form-input" />
                  </div>
                  <div className="admin-form-group">
                    <label>Last Name</label>
                    <input type="text" defaultValue="Wilson" className="admin-form-input" />
                  </div>
                  <div className="admin-form-group">
                    <label>Email</label>
                    <input type="email" defaultValue="sarah.wilson@hospital.com" className="admin-form-input" />
                  </div>
                  <div className="admin-form-group">
                    <label>Phone</label>
                    <input type="tel" defaultValue="+1 (555) 123-4567" className="admin-form-input" />
                  </div>
                  <div className="admin-form-group">
                    <label>Department</label>
                    <select className="admin-form-select" defaultValue="Administration">
                      <option>Administration</option>
                      <option>Cardiology</option>
                      <option>Emergency</option>
                      <option>Pediatrics</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Role</label>
                    <select className="admin-form-select" defaultValue="Administrator">
                      <option>Administrator</option>
                      <option>Doctor</option>
                      <option>Nurse</option>
                      <option>Staff</option>
                    </select>
                  </div>
                </div>
                <div className="admin-modal-actions">
                  <button type="button" className="admin-btn-secondary" onClick={() => setShowProfileModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <style jsx>{`
        .admin-container {
          display: flex;
          height: 100vh;
          background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        /* Sidebar Styles */
        .admin-sidebar {
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

        .admin-sidebar.closed {
          width: 80px;
        }

        .admin-sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
        }

        .admin-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-logo-icon {
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

        .admin-logo-text {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          white-space: nowrap;
        }

        .admin-sidebar-nav {
          padding: 20px 0;
        }

        .admin-nav-item {
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

        .admin-nav-item:hover {
          background: rgba(100, 116, 139, 0.1);
          color: #334155;
        }

        .admin-nav-item.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .admin-nav-item span {
          white-space: nowrap;
          flex: 1;
        }

        .admin-submenu-icon {
          transition: transform 0.2s ease;
        }

        .admin-submenu-icon.rotated {
          transform: rotate(90deg);
        }

        .admin-submenu {
          margin-left: 32px;
          margin-top: 4px;
          margin-bottom: 8px;
        }

        .admin-submenu-item {
          padding: 8px 20px;
          color: #64748b;
          cursor: pointer;
          border-radius: 8px;
          margin: 2px 0;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .admin-submenu-item:hover {
          background: rgba(100, 116, 139, 0.1);
          color: #334155;
        }

        .admin-submenu-item.active {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          font-weight: 500;
        }

        /* Main Content */
        .admin-main {
          flex: 1;
          margin-left: 280px;
          transition: margin-left 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .admin-sidebar.closed + .admin-main {
          margin-left: 80px;
        }

        /* Top Navigation */
        .admin-topnav {
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

        .admin-topnav-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .admin-menu-toggle {
          background: none;
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s ease;
        }

        .admin-menu-toggle:hover {
          background: rgba(100, 116, 139, 0.1);
          color: #334155;
        }

        .admin-page-title {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .admin-topnav-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        /* Search */
        .admin-search-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .admin-search-input {
          width: 300px;
          padding: 10px 16px 10px 40px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .admin-search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .admin-search-icon {
          position: absolute;
          left: 12px;
          color: #94a3b8;
        }

        /* Notifications */
        .admin-notification-btn {
          position: relative;
          background: none;
          border: none;
          padding: 10px;
          border-radius: 12px;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s ease;
        }

        .admin-notification-btn:hover {
          background: rgba(100, 116, 139, 0.1);
          color: #334155;
        }

        .admin-notification-badge {
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
        .admin-profile-dropdown {
          position: relative;
        }

        .admin-profile-trigger {
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

        .admin-profile-trigger:hover {
          background: rgba(255, 255, 255, 1);
          border-color: #667eea;
        }

        .admin-profile-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-profile-info {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .admin-profile-name {
          font-weight: 600;
          color: #1e293b;
          font-size: 14px;
          line-height: 1.2;
        }

        .admin-profile-role {
          color: #64748b;
          font-size: 12px;
          line-height: 1.2;
        }

        .admin-dropdown-menu {
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

        .admin-dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #334155;
          text-decoration: none;
          transition: background-color 0.2s ease;
          font-size: 14px;
        }

        .admin-dropdown-item:hover {
          background: rgba(100, 116, 139, 0.1);
        }

        .admin-dropdown-item.danger {
          color: #dc2626;
        }

        .admin-dropdown-item.danger:hover {
          background: rgba(220, 38, 38, 0.1);
        }

        .admin-dropdown-divider {
          height: 1px;
          background: rgba(226, 232, 240, 0.8);
          margin: 4px 0;
        }

        /* Content Area */
        .admin-content {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }

        /* Stats Grid */
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .admin-stat-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 24px;
          transition: transform 0.2s ease;
        }

        .admin-stat-card:hover {
          transform: translateY(-2px);
        }

        .admin-stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .admin-stat-title {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
          margin: 0;
        }

        .admin-stat-change {
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .admin-stat-change.positive {
          color: #16a34a;
          background: rgba(22, 163, 74, 0.1);
        }

        .admin-stat-change.negative {
          color: #dc2626;
          background: rgba(220, 38, 38, 0.1);
        }

        .admin-stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }

        .admin-stat-card.blue {
          border-left: 4px solid #667eea;
        }

        .admin-stat-card.green {
          border-left: 4px solid #16a34a;
        }

        .admin-stat-card.orange {
          border-left: 4px solid #ea580c;
        }

        .admin-stat-card.purple {
          border-left: 4px solid #9333ea;
        }

        /* Dashboard Grid */
        .admin-dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }

        /* Card Styles */
        .admin-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          overflow: hidden;
        }

        .admin-card-header {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
        }

        .admin-card-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .admin-card-content {
          padding: 24px;
        }

        /* Activity List */
        .admin-activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .admin-activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-activity-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .admin-activity-icon.blue {
          background: #667eea;
        }

        .admin-activity-icon.green {
          background: #16a34a;
        }

        .admin-activity-icon.orange {
          background: #ea580c;
        }

        .admin-activity-details p {
          margin: 0 0 4px 0;
          font-weight: 500;
          color: #1e293b;
          font-size: 14px;
        }

        .admin-activity-details span {
          color: #64748b;
          font-size: 12px;
        }

        /* Quick Actions */
        .admin-quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
        }

        .admin-quick-action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 20px 16px;
          border: none;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          cursor: pointer;
          transition: all 0.2s ease;
          color: #1e293b;
          font-weight: 500;
          font-size: 14px;
        }

        .admin-quick-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .admin-quick-action-btn.blue:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .admin-quick-action-btn.green:hover {
          border-color: #16a34a;
          color: #16a34a;
        }

        .admin-quick-action-btn.orange:hover {
          border-color: #ea580c;
          color: #ea580c;
        }

        .admin-quick-action-btn.purple:hover {
          border-color: #9333ea;
          color: #9333ea;
        }

        /* Page Header */
        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .admin-page-header h2 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
          color: #1e293b;
        }

        /* Buttons */
        .admin-btn-primary {
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

        .admin-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .admin-btn-secondary {
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

        .admin-btn-secondary:hover {
          background: rgba(255, 255, 255, 1);
          border-color: #667eea;
          color: #667eea;
        }

        /* Table Styles */
        .admin-table-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 16px;
        }

        .admin-search-filter {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .admin-filter-select {
          padding: 10px 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          min-width: 120px;
          cursor: pointer;
        }

        .admin-table-container {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-table th {
          background: rgba(248, 250, 252, 0.8);
          padding: 16px;
          text-align: left;
          font-weight: 600;
          color: #334155;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
        }

        .admin-table th.admin-sortable {
          cursor: pointer;
          user-select: none;
        }

        .admin-table th.admin-sortable:hover {
          background: rgba(226, 232, 240, 0.5);
        }

        .admin-table td {
          padding: 16px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.5);
          color: #64748b;
        }

        .admin-table tr:hover {
          background: rgba(248, 250, 252, 0.5);
        }

        .admin-patient-name {
          font-weight: 500;
          color: #1e293b;
        }

        .admin-status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .admin-status.active {
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
        }

        .admin-status.inactive {
          background: rgba(107, 114, 128, 0.1);
          color: #6b7280;
        }

        .admin-action-buttons {
          display: flex;
          gap: 8px;
        }

        .admin-action-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .admin-action-btn.view {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .admin-action-btn.view:hover {
          background: rgba(59, 130, 246, 0.2);
        }

        .admin-action-btn.edit {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .admin-action-btn.edit:hover {
          background: rgba(245, 158, 11, 0.2);
        }

        .admin-action-btn.delete {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .admin-action-btn.delete:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        /* Form Styles */
        .admin-form-container {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 32px;
        }

        .admin-form-section {
          margin-bottom: 32px;
        }

        .admin-form-section h3 {
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          padding-bottom: 12px;
        }

        .admin-form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .admin-form-group {
          display: flex;
          flex-direction: column;
        }

        .admin-form-group-full {
          grid-column: 1 / -1;
        }

        .admin-form-group label {
          margin-bottom: 8px;
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        .admin-form-input,
        .admin-form-select,
        .admin-form-textarea {
          padding: 12px 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .admin-form-input:focus,
        .admin-form-select:focus,
        .admin-form-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .admin-form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .admin-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(226, 232, 240, 0.6);
        }

        /* Reports Page */
        .admin-reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .admin-report-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: transform 0.2s ease;
        }

        .admin-report-card:hover {
          transform: translateY(-2px);
        }

        .admin-report-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .admin-report-icon.patients {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .admin-report-icon.appointments {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
        }

        .admin-report-icon.revenue {
          background: linear-gradient(135deg, #ea580c 0%, #fb923c 100%);
        }

        .admin-report-icon.performance {
          background: linear-gradient(135deg, #9333ea 0%, #a855f7 100%);
        }

        .admin-report-content h3 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .admin-report-content p {
          margin: 4px 0;
          color: #64748b;
          font-size: 14px;
        }

        .admin-chart-section {
          margin-top: 32px;
        }

        .admin-chart-placeholder {
          padding: 60px;
          text-align: center;
          color: #64748b;
          background: rgba(248, 250, 252, 0.5);
          border-radius: 12px;
        }

        /* Modal Styles */
        .admin-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .admin-modal {
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

        .admin-modal-header {
          padding: 24px 32px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          margin-bottom: 24px;
          padding-bottom: 16px;
        }

        .admin-modal-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }

        .admin-modal-close {
          background: none;
          border: none;
          font-size: 24px;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
        }

        .admin-modal-content {
          padding: 0 32px 32px;
        }

        .admin-profile-avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
        }

        .admin-profile-avatar-large {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(226, 232, 240, 0.6);
        }

        /* Mobile Backdrop */
        .admin-backdrop {
          display: none;
        }

        /* Mobile Responsive */
        @media (max-width: 1024px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }

          .admin-main {
            margin-left: 0;
          }

          .admin-backdrop {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
          }

          .admin-search-input {
            width: 200px;
          }

          .admin-stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }

          .admin-dashboard-grid {
            grid-template-columns: 1fr;
          }

          .admin-reports-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }

          .admin-table-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .admin-search-filter {
            flex-direction: column;
          }
        }

        @media (max-width: 768px) {
          .admin-topnav {
            padding: 0 16px;
          }

          .admin-content {
            padding: 20px 16px;
          }

          .admin-search-container {
            display: none;
          }

          .admin-profile-info {
            display: none;
          }

          .admin-quick-actions {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          }

          .admin-stats-grid {
            grid-template-columns: 1fr;
          }

          .admin-form-grid {
            grid-template-columns: 1fr;
          }

          .admin-table-container {
            overflow-x: auto;
          }

          .admin-table {
            min-width: 800px;
          }

          .admin-page-header {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }

          .admin-modal {
            width: 95%;
            margin: 20px;
          }

          .admin-modal-header,
          .admin-modal-content {
            padding-left: 20px;
            padding-right: 20px;
          }

          .admin-reports-grid {
            grid-template-columns: 1fr;
          }

          .admin-report-card {
            flex-direction: column;
            text-align: center;
          }

          .admin-form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;