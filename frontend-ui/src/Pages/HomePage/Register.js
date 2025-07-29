import React, { useState } from 'react';
import {
  Heart,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToPrivacy: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
      alert('Please agree to terms and privacy policy');
      return;
    }
    alert('Registration form submitted');
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          line-height: 1.6;
          color: #374151;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .register-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 500px;
          padding: 40px;
          position: relative;
          overflow: hidden;
          margin: 20px 0;
        }

        .register-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }

        .logo-section {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 28px;
          font-weight: bold;
          color: #2563eb;
          text-decoration: none;
          margin-bottom: 8px;
        }

        .logo-tagline {
          color: #6b7280;
          font-size: 14px;
        }

        .form-title {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          text-align: center;
          margin-bottom: 8px;
        }

        .form-subtitle {
          color: #6b7280;
          text-align: center;
          margin-bottom: 32px;
          font-size: 14px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          display: block;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .input-wrapper {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s;
          background: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
        }

        .password-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          padding: 4px;
          border-radius: 4px;
        }

        .password-toggle:hover {
          color: #374151;
          background-color: #f3f4f6;
        }

        .password-strength {
          margin-top: 8px;
          display: flex;
          gap: 4px;
        }

        .strength-bar {
          height: 4px;
          flex: 1;
          border-radius: 2px;
          background-color: #e5e7eb;
          transition: background-color 0.2s;
        }

        .strength-bar.active {
          background-color: #10b981;
        }

        .strength-bar.medium {
          background-color: #f59e0b;
        }

        .strength-bar.weak {
          background-color: #ef4444;
        }

        .checkbox-group {
          margin-bottom: 24px;
        }

        .checkbox-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .checkbox {
          width: 16px;
          height: 16px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .checkbox:checked {
          background-color: #2563eb;
          border-color: #2563eb;
        }

        .checkbox-label {
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          line-height: 1.5;
        }

        .checkbox-label a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
        }

        .checkbox-label a:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        .register-button {
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .register-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .register-button:active {
          transform: translateY(0);
        }

        .register-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .divider {
          position: relative;
          text-align: center;
          margin: 24px 0;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e5e7eb;
        }

        .divider-text {
          background: white;
          padding: 0 16px;
          color: #6b7280;
          font-size: 14px;
        }

        .social-buttons {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .social-button {
          flex: 1;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .social-button:hover {
          background-color: #f9fafb;
          border-color: #9ca3af;
        }

        .login-link {
          text-align: center;
          font-size: 14px;
          color: #6b7280;
        }

        .login-link a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
        }

        .login-link a:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        .security-features {
          background: #f8fafc;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .security-title {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .security-list {
          list-style: none;
          padding: 0;
        }

        .security-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .security-item:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 640px) {
          .register-card {
            padding: 32px 24px;
            margin: 16px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .social-buttons {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="register-container">
        <div className="register-card">
          <div className="logo-section">
            <a href="#" className="logo">
              <Heart size={32} />
              HealthCare+
            </a>
            <p className="logo-tagline">Your Health, Our Priority</p>
          </div>

          <h1 className="form-title">Create Your Account</h1>
          <p className="form-subtitle">Join thousands of patients managing their health with us</p>

          <div className="security-features">
            <div className="security-title">
              <Shield size={16} />
              Your Information is Secure
            </div>
            <ul className="security-list">
              <li className="security-item">
                <CheckCircle size={14} color="#10b981" />
                <span>256-bit SSL encryption</span>
              </li>
              <li className="security-item">
                <CheckCircle size={14} color="#10b981" />
                <span>HIPAA compliant platform</span>
              </li>
              <li className="security-item">
                <CheckCircle size={14} color="#10b981" />
                <span>No data sharing with third parties</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="form-input"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="form-input"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <div className="input-wrapper">
                  <Phone className="input-icon" size={18} />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-input"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                <div className="input-wrapper">
                  <Calendar className="input-icon" size={18} />
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    className="form-input"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="password-strength">
                <div className={`strength-bar ${formData.password.length >= 2 ? 'active weak' : ''}`}></div>
                <div className={`strength-bar ${formData.password.length >= 6 ? 'active medium' : ''}`}></div>
                <div className={`strength-bar ${formData.password.length >= 8 ? 'active' : ''}`}></div>
                <div className={`strength-bar ${formData.password.length >= 12 ? 'active' : ''}`}></div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="checkbox-group">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  className="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                />
                <label htmlFor="agreeToTerms" className="checkbox-label">
                  I agree to the <a href="#">Terms of Service</a> and understand that my health information will be handled according to these terms.
                </label>
              </div>

              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="agreeToPrivacy"
                  name="agreeToPrivacy"
                  className="checkbox"
                  checked={formData.agreeToPrivacy}
                  onChange={handleInputChange}
                />
                <label htmlFor="agreeToPrivacy" className="checkbox-label">
                  I have read and agree to the <a href="#">Privacy Policy</a> and consent to the collection and use of my personal information.
                </label>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="register-button"
              disabled={!formData.agreeToTerms || !formData.agreeToPrivacy}
            >
              Create Account
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="divider">
            <span className="divider-text">or sign up with</span>
          </div>

          <div className="social-buttons">
            <button className="social-button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="social-button">
              <Phone size={18} />
              Phone
            </button>
          </div>

          <p className="login-link">
            Already have an account? <a href="#">Sign in here</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;