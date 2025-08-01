import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  Heart,
  CheckCircle
} from 'lucide-react';

const HealthcareAuth = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: '',
    otp: ['', '', '', '', '', '']
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
    color: '#ef4444'
  });

  const evaluatePasswordStrength = (password) => {
    let score = 0;
    let feedback = '';
    let color = '#ef4444';

    if (password.length === 0) {
      return { score: 0, feedback: '', color: '#ef4444' };
    }

    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
        feedback = 'Very Weak';
        color = '#ef4444';
        break;
      case 2:
        feedback = 'Weak';
        color = '#f97316';
        break;
      case 3:
        feedback = 'Fair';
        color = '#eab308';
        break;
      case 4:
        feedback = 'Good';
        color = '#22c55e';
        break;
      case 5:
        feedback = 'Strong';
        color = '#16a34a';
        break;
      default:
        feedback = 'Very Weak';
        color = '#ef4444';
    }

    return { score, feedback, color };
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Evaluate password strength for password field
    if (field === 'password') {
      const strength = evaluatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...formData.otp];
      newOtp[index] = value;
      setFormData(prev => ({
        ...prev,
        otp: newOtp
      }));

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const renderLogin = () => (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-section">
            <div className="logo-icon">
              <Heart size={32} />
            </div>
            <h1 className="logo-text">HealthCare+</h1>
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to access your healthcare portal</p>
        </div>

        <div className="auth-form">
          <div className="form-group">
            <div className="form-label">Email Address</div>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">Password</div>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <div className="checkbox-label">
              <input type="checkbox" className="checkbox" />
              <span className="checkbox-text">Remember me</span>
            </div>
            <button
              type="button"
              className="link-button"
              onClick={() => setCurrentPage('forgot')}
            >
              Forgot Password?
            </button>
          </div>

          <button className="primary-button">
            Sign In
          </button>

          <div className="auth-divider">
            <span>Don't have an account?</span>
          </div>

          <button
            className="secondary-button"
            onClick={() => setCurrentPage('register')}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderRegister = () => (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <button
            className="back-button"
            onClick={() => setCurrentPage('login')}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="logo-section">
            <div className="logo-icon">
              <Heart size={32} />
            </div>
            <h1 className="logo-text">HealthCare+</h1>
          </div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join our healthcare community today</p>
        </div>

        <div className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <div className="form-label">First Name</div>
              <div className="input-wrapper">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="First Name*"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="form-label">Last Name</div>
              <div className="input-wrapper">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Last Name*"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">Email Address</div>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                className="form-input"
                placeholder="Email*"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">Gender</div>
            <select
              className="form-input select-input"
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
            >
              <option value="" disabled>-- Select Gender* --</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <div className="form-label">Birth Date</div>
            <input
              type="date"
              className="form-input date-input"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
            />
          </div>

          <div className="form-group">
            <div className="form-label">Password</div>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Password*"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${(passwordStrength.score / 5) * 100}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  ></div>
                </div>
                <div className="strength-text" style={{ color: passwordStrength.color }}>
                  {passwordStrength.feedback}
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <div className="form-label">Confirm Password</div>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-input"
                placeholder="Confirm Password*"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <div className="error-text">Passwords do not match</div>
            )}
          </div>

          <div className="terms-section">
            <div className="checkbox-label">
              <input type="checkbox" className="checkbox" />
              <span className="checkbox-text">
                I agree to the <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a>
              </span>
            </div>
          </div>

          <button className="primary-button">
            Create Account
          </button>

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <button
            className="secondary-button"
            onClick={() => setCurrentPage('login')}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );

  const renderForgotPassword = () => (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <button
            className="back-button"
            onClick={() => setCurrentPage('login')}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="logo-section">
            <div className="logo-icon">
              <Shield size={32} />
            </div>
            <h1 className="logo-text">HealthCare+</h1>
          </div>
          <h2 className="auth-title">Verify Your Identity</h2>
          <p className="auth-subtitle">
            We've sent a 6-digit verification code to your email address
          </p>
        </div>

        <div className="auth-form">
          <div className="form-group">
            <div className="form-label">Email Address</div>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">Verification Code</div>
            <div className="otp-container">
              {formData.otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  className="otp-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !digit && index > 0) {
                      const prevInput = document.getElementById(`otp-${index - 1}`);
                      if (prevInput) prevInput.focus();
                    }
                  }}
                />
              ))}
            </div>
          </div>

          <div className="resend-section">
            <span className="resend-text">Didn't receive the code?</span>
            <button className="link-button">
              Resend Code
            </button>
          </div>

          <button
            className="primary-button"
            onClick={() => setCurrentPage('reset')}
          >
            Verify Code
          </button>

          <button
            className="secondary-button"
            onClick={() => setCurrentPage('login')}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );

  const renderResetPassword = () => (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <button
            className="back-button"
            onClick={() => setCurrentPage('forgot')}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="logo-section">
            <div className="logo-icon">
              <CheckCircle size={32} />
            </div>
            <h1 className="logo-text">HealthCare+</h1>
          </div>
          <h2 className="auth-title">Reset Password</h2>
          <p className="auth-subtitle">
            Create a new password for your account
          </p>
        </div>

        <div className="auth-form">
          <div className="form-group">
            <div className="form-label">New Password</div>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Enter new password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">Confirm New Password</div>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-input"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="password-requirements">
            <h4>Password Requirements:</h4>
            <ul>
              <li>At least 8 characters long</li>
              <li>Contains uppercase and lowercase letters</li>
              <li>Contains at least one number</li>
              <li>Contains at least one special character</li>
            </ul>
          </div>

          <button
            className="primary-button"
            onClick={() => setCurrentPage('login')}
          >
            Reset Password
          </button>

          <button
            className="secondary-button"
            onClick={() => setCurrentPage('login')}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="auth-wrapper">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .auth-wrapper {
          min-height: 100vh;
          background-color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .auth-container {
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
        }

        .auth-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #e5e7eb;
          padding: 32px;
          position: relative;
        }

        .back-button {
          position: absolute;
          top: 24px;
          left: 24px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .back-button:hover {
          background-color: #f3f4f6;
          color: #374151;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .logo-text {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
        }

        .auth-title {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .auth-subtitle {
          color: #6b7280;
          font-size: 16px;
          line-height: 1.5;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
        }

        .form-input {
          width: 100%;
          padding: 12px 12px 12px 44px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s;
          background-color: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .date-input {
          padding: 12px 16px;
        }

        .select-input {
          padding: 12px 16px;
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 12px center;
          background-repeat: no-repeat;
          background-size: 16px;
        }

        .password-strength {
          margin-top: 8px;
        }

        .strength-bar {
          width: 100%;
          height: 4px;
          background-color: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .strength-fill {
          height: 100%;
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        .strength-text {
          font-size: 12px;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .error-text {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
          font-weight: 500;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s;
        }

        .password-toggle:hover {
          color: #374151;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: -8px 0;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
        }

        .checkbox {
          width: 16px;
          height: 16px;
          accent-color: #2563eb;
        }

        .checkbox-text {
          color: #374151;
        }

        .link-button {
          background: none;
          border: none;
          color: #2563eb;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.2s;
        }

        .link-button:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        .link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
        }

        .link:hover {
          text-decoration: underline;
        }

        .primary-button {
          width: 100%;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          border: none;
          padding: 14px 20px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .primary-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .secondary-button {
          width: 100%;
          background: transparent;
          color: #2563eb;
          border: 2px solid #2563eb;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .secondary-button:hover {
          background-color: #2563eb;
          color: white;
        }

        .auth-divider {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          margin: 8px 0;
        }

        .terms-section {
          margin: -8px 0;
        }

        .otp-container {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .otp-input {
          width: 50px;
          height: 50px;
          text-align: center;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .otp-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .resend-section {
          text-align: center;
          margin: -8px 0;
        }

        .resend-text {
          color: #6b7280;
          font-size: 14px;
          margin-right: 8px;
        }

        .password-requirements {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          margin: -8px 0;
        }

        .password-requirements h4 {
          color: #374151;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .password-requirements ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .password-requirements li {
          color: #6b7280;
          font-size: 13px;
          padding: 2px 0;
          position: relative;
          padding-left: 16px;
        }

        .password-requirements li:before {
          content: "•";
          color: #2563eb;
          position: absolute;
          left: 0;
        }

        @media (max-width: 640px) {
          .auth-card {
            padding: 24px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .auth-title {
            font-size: 24px;
          }

          .otp-container {
            gap: 8px;
          }

          .otp-input {
            width: 45px;
            height: 45px;
            font-size: 16px;
          }
        }
      `}</style>

      {currentPage === 'login' && renderLogin()}
      {currentPage === 'register' && renderRegister()}
      {currentPage === 'forgot' && renderForgotPassword()}
      {currentPage === 'reset' && renderResetPassword()}
    </div>
  );
};

export default HealthcareAuth;