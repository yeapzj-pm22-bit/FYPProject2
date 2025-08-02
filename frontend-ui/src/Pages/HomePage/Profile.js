import React, { useState, useRef } from 'react';
import {
  Heart,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Camera,
  Save,
  X,
  Shield,
  FileText,
  Bell,
  Settings,
  LogOut,
  Upload,
  Check,
  AlertCircle,
  Lock,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';

import PatientHeader from '../../Components/PatientHeader';
import PatientFooter from '../../Components/PatientFooter';
import "./css/Profile.css";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileImage, setProfileImage] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const fileInputRef = useRef(null);

  // Password reset states
  const [resetPasswordData, setResetPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
    color: '#ef4444'
  });

  // IC Verification states
  const [icFrontImage, setIcFrontImage] = useState(null);
  const [icBackImage, setIcBackImage] = useState(null);
  const [icVerificationStatus, setIcVerificationStatus] = useState('not-verified');
  const [showIcUpload, setShowIcUpload] = useState(false);
  const icFrontInputRef = useRef(null);
  const icBackInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: 'Male',
    dateOfBirth: '1990-05-15',
    address: '123 Health Street',
    city: 'Medical City',
    state: 'MC',
    zipCode: '12345',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+1 (555) 987-6543',
    bloodType: 'O+',
    allergies: 'Penicillin, Peanuts',
    conditions: 'Hypertension',
    medications: 'Lisinopril 10mg daily'
  });

  const [editData, setEditData] = useState({ ...profileData });

  // Password strength evaluation
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...editData });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setResetPasswordData(prev => ({ ...prev, [name]: value }));

    // Evaluate password strength for new password
    if (name === 'newPassword') {
      const strength = evaluatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const handleResetPassword = () => {
    const { currentPassword, newPassword, confirmPassword } = resetPasswordData;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      alert('New password must be at least 8 characters long.');
      return;
    }

    if (passwordStrength.score < 3) {
      alert('Please choose a stronger password.');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      alert('Password reset successfully!');
      setShowResetPassword(false);
      setResetPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordStrength({ score: 0, feedback: '', color: '#ef4444' });
    }, 1000);
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

  const handleIcImageUpload = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'front') {
          setIcFrontImage(e.target.result);
        } else {
          setIcBackImage(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const submitIcVerification = () => {
    if (icFrontImage && icBackImage) {
      setIcVerificationStatus('pending');
      setShowIcUpload(false);
      alert('IC verification submitted successfully! Please wait for admin approval.');

      setTimeout(() => {
        setIcVerificationStatus('verified');
      }, 3000);
    } else {
      alert('Please upload both front and back images of your IC.');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getVerificationStatusInfo = () => {
    switch (icVerificationStatus) {
      case 'verified':
        return {
          icon: <CheckCircle size={18} color="#10b981" />,
          text: 'IC Verified',
          color: '#10b981',
          bgColor: '#ecfdf5'
        };
      case 'pending':
        return {
          icon: <Clock size={18} color="#f59e0b" />,
          text: 'Verification Pending',
          color: '#f59e0b',
          bgColor: '#fffbeb'
        };
      case 'rejected':
        return {
          icon: <XCircle size={18} color="#ef4444" />,
          text: 'Verification Rejected',
          color: '#ef4444',
          bgColor: '#fef2f2'
        };
      default:
        return {
          icon: <CreditCard size={18} color="#6b7280" />,
          text: 'IC Not Verified',
          color: '#6b7280',
          bgColor: '#f9fafb'
        };
    }
  };

  const statusInfo = getVerificationStatusInfo();

  return (
   <div>
            {/* Header */}
            <PatientHeader />
    <div className="profile-page-container">


      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="header-content">
            <div className="profile-image-section">
              <div className="profile-image">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" />
                ) : (
                  `${profileData.firstName[0]}${profileData.lastName[0]}`
                )}
              </div>
              <button
                className="image-upload-btn"
                onClick={() => setShowImageUpload(true)}
              >
                <Camera size={18} />
              </button>
            </div>

            <div className="profile-info">
              <h1 className="profile-name">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="profile-role" style={{ fontWeight: 'bold', color: 'black' }}>Patient ID: HC-2024-001</p>

              <div className="profile-stats">
                <div className="stat-item">
                  <div className="stat-value">15</div>
                  <div className="stat-label">Appointments</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">8</div>
                  <div className="stat-label">Prescriptions</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">3</div>
                  <div className="stat-label">Years with us</div>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              {isEditing ? (
                <>
                  <button className="action-btn primary" onClick={handleSave}>
                    <Save size={18} />
                    Save Changes
                  </button>
                  <button className="action-btn" onClick={handleCancel}>
                    <X size={18} />
                    Cancel
                  </button>
                </>
              ) : (
                <button className="action-btn primary" onClick={handleEdit}>
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          <div className="tab-navigation">
            <button
              className={`tab-item ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <User size={18} />
              Personal Info
            </button>
            <button
              className={`tab-item ${activeTab === 'verification' ? 'active' : ''}`}
              onClick={() => setActiveTab('verification')}
            >
              <CreditCard size={18} />
              IC Verification
            </button>
            <button
              className={`tab-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} />
              Settings
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'personal' && (
              <div>
                <h2 className="section-title">Personal Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-input"
                      value={isEditing ? editData.firstName : profileData.firstName}
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
                      value={isEditing ? editData.lastName : profileData.lastName}
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
                      value={isEditing ? editData.email : profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-input"
                      value={isEditing ? editData.phone : profileData.phone}
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
                      value={isEditing ? editData.dateOfBirth : profileData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'verification' && (
              <div>
                <h2 className="section-title">IC Verification</h2>
                <div className="info-card">
                  <div className="info-card-title">
                    <Shield size={18} />
                    Verification Status
                  </div>
                  <div
                    className="verification-status"
                    style={{
                      color: statusInfo.color,
                      backgroundColor: statusInfo.bgColor
                    }}
                  >
                    {statusInfo.icon}
                    {statusInfo.text}
                  </div>

                  {icVerificationStatus === 'not-verified' && (
                    <div style={{marginTop: '16px'}}>
                      <p style={{color: '#6b7280', marginBottom: '16px'}}>
                        Please upload clear images of both front and back of your IC for verification.
                      </p>
                      <button
                        className="btn btn-primary"
                        onClick={() => setShowIcUpload(true)}
                      >
                        <Upload size={18} />
                        Upload IC Images
                      </button>
                    </div>
                  )}

                  {icVerificationStatus === 'pending' && (
                    <div style={{marginTop: '16px'}}>
                      <p style={{color: '#6b7280'}}>
                        Your IC verification is being processed. This usually takes 1-2 business days.
                      </p>
                    </div>
                  )}

                  {icVerificationStatus === 'verified' && (
                    <div style={{marginTop: '16px'}}>
                      <p style={{color: '#059669'}}>
                        Your IC has been successfully verified! You now have full access to all features.
                      </p>
                    </div>
                  )}

                  {icVerificationStatus === 'rejected' && (
                    <div style={{marginTop: '16px'}}>
                      <p style={{color: '#dc2626', marginBottom: '16px'}}>
                        Your IC verification was rejected. Please ensure images are clear and readable, then try again.
                      </p>
                      <button
                        className="btn btn-primary"
                        onClick={() => setShowIcUpload(true)}
                      >
                        <Upload size={18} />
                        Re-upload IC Images
                      </button>
                    </div>
                  )}
                </div>

                {(icFrontImage || icBackImage) && (
                  <div className="info-card">
                    <div className="info-card-title">
                      <FileText size={18} />
                      Uploaded Documents
                    </div>
                    <div className="ic-upload-section">
                      <div className="ic-upload-item has-image">
                        <h4 style={{margin: '0 0 12px 0', color: '#1f2937'}}>Front of IC</h4>
                        {icFrontImage ? (
                          <img src={icFrontImage} alt="IC Front" className="ic-preview" />
                        ) : (
                          <p style={{color: '#6b7280'}}>Not uploaded</p>
                        )}
                      </div>
                      <div className="ic-upload-item has-image">
                        <h4 style={{margin: '0 0 12px 0', color: '#1f2937'}}>Back of IC</h4>
                        {icBackImage ? (
                          <img src={icBackImage} alt="IC Back" className="ic-preview" />
                        ) : (
                          <p style={{color: '#6b7280'}}>Not uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="section-title">Account Settings</h2>

                <div className="info-card">
                  <div className="info-card-title">
                    <Bell size={18} />
                    Notification Preferences
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px'}}>
                    <label style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <input type="checkbox" defaultChecked />
                      <span>Email notifications for appointments</span>
                    </label>
                    <label style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <input type="checkbox" defaultChecked />
                      <span>SMS reminders</span>
                    </label>
                    <label style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <input type="checkbox" />
                      <span>Marketing emails</span>
                    </label>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-card-title">
                    <Shield size={18} />
                    Privacy & Security
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px'}}>
                    <button
                      className="btn btn-secondary"
                      style={{justifyContent: 'flex-start'}}
                      onClick={() => setShowResetPassword(true)}
                    >
                      <Lock size={18} />
                      Change Password
                    </button>
                    <button className="btn btn-secondary" style={{justifyContent: 'flex-start'}}>
                      <Shield size={18} />
                      Two-Factor Authentication
                    </button>
                    <button className="btn btn-secondary" style={{justifyContent: 'flex-start'}}>
                      <FileText size={18} />
                      Download My Data
                    </button>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-card-title">
                    <Settings size={18} />
                    Account Actions
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px'}}>
                    <button className="btn btn-secondary" style={{justifyContent: 'flex-start'}}>
                      <User size={18} />
                      Deactivate Account
                    </button>
                    <button className="btn btn-secondary" style={{justifyContent: 'flex-start', color: '#dc2626'}}>
                      <LogOut size={18} />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isEditing && (
              <div className="edit-actions">
                <button className="btn btn-secondary" onClick={handleCancel}>
                  <X size={18} />
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Image Upload Modal */}
        {showImageUpload && (
          <div className="upload-modal">
            <div className="upload-content">
              <h3 style={{marginBottom: '16px', color: '#1f2937', textAlign: 'center'}}>Update Profile Picture</h3>
              <div
                className="upload-area"
                onClick={triggerFileInput}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('dragover');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('dragover');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('dragover');
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
                  onClick={triggerFileInput}
                >
                  <Upload size={18} />
                  Choose File
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Password Modal */}
        {showResetPassword && (
          <div className="upload-modal">
            <div className="upload-content">
              <h3 style={{marginBottom: '16px', color: '#1f2937', textAlign: 'center'}}>Reset Password</h3>
              <p style={{color: '#6b7280', textAlign: 'center', marginBottom: '24px'}}>
                Enter your current password and choose a new one
              </p>

              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    className="form-input"
                    placeholder="Enter current password"
                    value={resetPasswordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    style={{paddingRight: '45px'}}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    className="form-input"
                    placeholder="Enter new password"
                    value={resetPasswordData.newPassword}
                    onChange={handlePasswordInputChange}
                    style={{paddingRight: '45px'}}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                {resetPasswordData.newPassword && (
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
                <label className="form-label">Confirm New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Confirm new password"
                    value={resetPasswordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    style={{paddingRight: '45px'}}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                {resetPasswordData.confirmPassword && resetPasswordData.newPassword !== resetPasswordData.confirmPassword && (
                  <div className="error-text">Passwords do not match</div>
                )}
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

              <div style={{display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px'}}>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowResetPassword(false);
                    setResetPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setPasswordStrength({ score: 0, feedback: '', color: '#ef4444' });
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleResetPassword}
                >
                  <Lock size={18} />
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* IC Upload Modal */}
        {showIcUpload && (
          <div className="upload-modal">
            <div className="upload-content">
              <h3 style={{marginBottom: '16px', color: '#1f2937', textAlign: 'center'}}>Upload IC Images</h3>
              <p style={{color: '#6b7280', textAlign: 'center', marginBottom: '24px'}}>
                Please upload clear, readable images of both sides of your IC
              </p>

              <div className="ic-upload-section">
                <div
                  className={`ic-upload-item ${icFrontImage ? 'has-image' : ''}`}
                  onClick={() => icFrontInputRef.current?.click()}
                >
                  <h4 style={{margin: '0 0 12px 0', color: '#1f2937'}}>Front of IC</h4>
                  {icFrontImage ? (
                    <img src={icFrontImage} alt="IC Front" className="ic-preview" />
                  ) : (
                    <>
                      <Upload size={32} color="#6b7280" style={{marginBottom: '8px'}} />
                      <p style={{color: '#6b7280', fontSize: '14px'}}>Click to upload front</p>
                    </>
                  )}
                </div>

                <div
                  className={`ic-upload-item ${icBackImage ? 'has-image' : ''}`}
                  onClick={() => icBackInputRef.current?.click()}
                >
                  <h4 style={{margin: '0 0 12px 0', color: '#1f2937'}}>Back of IC</h4>
                  {icBackImage ? (
                    <img src={icBackImage} alt="IC Back" className="ic-preview" />
                  ) : (
                    <>
                      <Upload size={32} color="#6b7280" style={{marginBottom: '8px'}} />
                      <p style={{color: '#6b7280', fontSize: '14px'}}>Click to upload back</p>
                    </>
                  )}
                </div>
              </div>

              <input
                ref={icFrontInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleIcImageUpload('front', e)}
                className="hidden"
              />

              <input
                ref={icBackInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleIcImageUpload('back', e)}
                className="hidden"
              />

              <div style={{display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px'}}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowIcUpload(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={submitIcVerification}
                  disabled={!icFrontImage || !icBackImage}
                  style={{
                    opacity: (!icFrontImage || !icBackImage) ? 0.5 : 1,
                    cursor: (!icFrontImage || !icBackImage) ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Check size={18} />
                  Submit for Verification
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
     <PatientFooter />
                    </div>
  );
};

export default ProfilePage;