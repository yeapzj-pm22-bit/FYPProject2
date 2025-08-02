import React, { useState, useRef, useEffect } from 'react';
import './css/PatientHomePage.css';
import {
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  Calendar,
  FileText,
  Heart,
  Shield,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import PatientHeader from '../../Components/PatientHeader';
import PatientFooter from '../../Components/PatientFooter';
import { Link } from 'react-router-dom';

const HealthcareHomepage = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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
    setProfileDropdownOpen(false);
    alert(`${action} clicked`);
  };

  return (
    <>

      <div>
        {/* Header */}
        <PatientHeader />

        {/* Main Content */}
        <main className="main-content">
          <section className="hero-section">
            <div className="hero-container">
              <h1 className="hero-title">Your Health, Our Priority</h1>
              <p className="hero-subtitle">
                Manage your healthcare journey with ease. Book appointments, access medical records,
                and stay connected with your healthcare providers.
              </p>
              <div className="cta-buttons">
                <Link to="/BookAppointment" className="cta-button cta-primary">
                  <Calendar size={20} />
                  Book Appointment
                </Link>
                <a href="#" className="cta-button cta-secondary">
                  <FileText size={20} />
                  View Records
                </a>
              </div>
            </div>
          </section>

          <section className="features-section">
            <div className="features-container">
              <h2 className="features-title">Why Choose HealthCare+?</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">
                    <Calendar size={32} />
                  </div>
                  <h3 className="feature-title">Easy Scheduling</h3>
                  <p className="feature-description">
                    Book appointments with your preferred doctors at your convenience.
                    Real-time availability and instant confirmations.
                  </p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">
                    <FileText size={32} />
                  </div>
                  <h3 className="feature-title">Digital Records</h3>
                  <p className="feature-description">
                    Access your complete medical history, prescriptions, and test results
                    securely from anywhere, anytime.
                  </p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">
                    <Shield size={32} />
                  </div>
                  <h3 className="feature-title">Secure & Private</h3>
                  <p className="feature-description">
                    Your health information is protected with bank-level security and
                    strict privacy controls.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <PatientFooter />
      </div>
    </>
  );
};

export default HealthcareHomepage;