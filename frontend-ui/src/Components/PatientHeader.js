import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  Calendar,
  FileText,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

const PatientHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileAction = (action) => {
    console.log('Profile action:', action);
    setProfileDropdownOpen(false);
    // Handle different actions here
  };

  return (
    <div className="patient-header-wrapper">
      <style>{`
        /* Scoped Header Styles - Only affects this component */
        .patient-header-wrapper {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          line-height: 1.6;
          color: #374151;
        }

        .patient-header-wrapper * {
          box-sizing: border-box;
        }

        .patient-header-wrapper .header {
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
          margin: 0;
          padding: 0;
        }

        .patient-header-wrapper .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }

        .patient-header-wrapper .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
          text-decoration: none;
        }

        .patient-header-wrapper .logo:hover {
          color: #1d4ed8;
        }

        .patient-header-wrapper .nav-menu {
          display: flex;
          list-style: none;
          gap: 32px;
          margin: 0;
          padding: 0;
        }

        .patient-header-wrapper .nav-item {
          position: relative;
        }

        .patient-header-wrapper .nav-link {
          text-decoration: none;
          color: #374151;
          font-weight: 500;
          padding: 8px 0;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .patient-header-wrapper .nav-link:hover {
          color: #2563eb;
        }

        .patient-header-wrapper .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .patient-header-wrapper .search-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .patient-header-wrapper .search-input {
          padding: 8px 12px 8px 36px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          width: 250px;
          transition: border-color 0.2s;
          background: white;
          color: #374151;
        }

        .patient-header-wrapper .search-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .patient-header-wrapper .search-icon {
          position: absolute;
          left: 10px;
          color: #6b7280;
          pointer-events: none;
        }

        .patient-header-wrapper .notification-btn {
          position: relative;
          background: none;
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
        }

        .patient-header-wrapper .notification-btn:hover {
          background-color: #f3f4f6;
          color: #374151;
        }

        .patient-header-wrapper .notification-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          background-color: #ef4444;
          color: white;
          border-radius: 50%;
          width: 8px;
          height: 8px;
        }

        .patient-header-wrapper .profile-dropdown {
          position: relative;
        }

        .patient-header-wrapper .profile-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .patient-header-wrapper .profile-trigger:hover {
          background-color: #f3f4f6;
        }

        .patient-header-wrapper .profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #2563eb;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .patient-header-wrapper .profile-info {
          text-align: left;
        }

        .patient-header-wrapper .profile-name {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
          line-height: 1.2;
        }

        .patient-header-wrapper .profile-role {
          color: #6b7280;
          font-size: 12px;
          line-height: 1.2;
        }

        .patient-header-wrapper .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          min-width: 200px;
          margin-top: 4px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.2s;
          z-index: 110;
        }

        .patient-header-wrapper .dropdown-menu.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .patient-header-wrapper .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #374151;
          text-decoration: none;
          transition: background-color 0.2s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
        }

        .patient-header-wrapper .dropdown-item:hover {
          background-color: #f3f4f6;
        }

        .patient-header-wrapper .dropdown-item.danger {
          color: #dc2626;
        }

        .patient-header-wrapper .dropdown-item.danger:hover {
          background-color: #fef2f2;
        }

        .patient-header-wrapper .dropdown-divider {
          height: 1px;
          background-color: #e5e7eb;
          margin: 4px 0;
        }

        .patient-header-wrapper .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: #374151;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .patient-header-wrapper .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border-top: 1px solid #e5e7eb;
            flex-direction: column;
            gap: 0;
            padding: 16px;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
          }

          .patient-header-wrapper .nav-menu.open {
            max-height: 300px;
          }

          .patient-header-wrapper .nav-item {
            width: 100%;
          }

          .patient-header-wrapper .nav-link {
            padding: 12px 0;
            border-bottom: 1px solid #f3f4f6;
          }

          .patient-header-wrapper .search-box {
            display: none;
          }

          .patient-header-wrapper .mobile-menu-btn {
            display: block;
          }

          .patient-header-wrapper .header-actions {
            gap: 8px;
          }
        }

        @media (max-width: 480px) {
          .patient-header-wrapper .header-container {
            padding: 0 12px;
          }

          .patient-header-wrapper .logo {
            font-size: 20px;
          }

          .patient-header-wrapper .profile-info {
            display: none;
          }
        }
      `}</style>

      <header className="header">
        <div className="header-container">
          <a href="#" className="logo">
            <Heart size={32} />
            HealthCare+
          </a>

          <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <Calendar size={16} />
                Appointments
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <FileText size={16} />
                Records
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">Services</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">About</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">Contact</a>
            </li>
          </nav>

          <div className="header-actions">
            <div className="search-box">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search doctors, services..."
                className="search-input"
              />
            </div>

            <button className="notification-btn">
              <Bell size={20} />
              <div className="notification-badge"></div>
            </button>

            <div className="profile-dropdown" ref={dropdownRef}>
              <button
                className="profile-trigger"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="profile-avatar">JD</div>
                <div className="profile-info">
                  <div className="profile-name">John Doe</div>
                  <div className="profile-role">Patient</div>
                </div>
                <ChevronDown size={16} />
              </button>

              <div className={`dropdown-menu ${profileDropdownOpen ? 'open' : ''}`}>
                <button
                  className="dropdown-item"
                  onClick={() => handleProfileAction('View Profile')}
                >
                  <User size={16} />
                  View Profile
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => handleProfileAction('My Appointments')}
                >
                  <Calendar size={16} />
                  My Appointments
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => handleProfileAction('Medical Records')}
                >
                  <FileText size={16} />
                  Medical Records
                </button>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item"
                  onClick={() => handleProfileAction('Settings')}
                >
                  <Settings size={16} />
                  Settings
                </button>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item danger"
                  onClick={() => handleProfileAction('Logout')}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default PatientHeader;