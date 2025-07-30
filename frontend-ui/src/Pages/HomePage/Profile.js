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
  Clock
} from 'lucide-react';
import PatientHeader from '../../Components/PatientHeader';
import PatientFooter from '../../Components/PatientFooter';
const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileImage, setProfileImage] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const fileInputRef = useRef(null);

  // IC Verification states
  const [icFrontImage, setIcFrontImage] = useState(null);
  const [icBackImage, setIcBackImage] = useState(null);
  const [icVerificationStatus, setIcVerificationStatus] = useState('not-verified'); // 'not-verified', 'pending', 'verified', 'rejected'
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

      // Simulate verification process
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
<>
          {/* Header */}
          <div>
          <PatientHeader />
</div>
    <div className="profile-page-container">
      <style>{`
        .profile-page-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          line-height: 1.6;
          color: #374151;
          background-color: #f9fafb;
          min-height: 100vh;
        }

        .profile-page-container * {
          box-sizing: border-box;
        }

        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .profile-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 40px;
          color: white;
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }

        .profile-header::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          transform: translate(50px, -50px);
        }

        .header-content {
          position: relative;
          z-index: 1;
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
          background: rgba(255, 255, 255, 0.2);
          border: 4px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: 600;
          color: white;
          overflow: hidden;
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
          background: #2563eb;
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
          background: #1d4ed8;
          transform: scale(1.1);
        }

        .profile-info {
          flex: 1;
        }

        .profile-name {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .profile-role {
          font-size: 18px;
          opacity: 0.9;
          margin-bottom: 16px;
        }

        .profile-stats {
          display: flex;
          gap: 32px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          opacity: 0.8;
        }

        .profile-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .action-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .action-btn.primary {
          background: white;
          color: #2563eb;
        }

        .action-btn.primary:hover {
          background: #f8fafc;
        }

        .profile-content {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .tab-navigation {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
        }

        .tab-item {
          flex: 1;
          padding: 20px 24px;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 500;
          color: #6b7280;
        }

        .tab-item.active {
          color: #2563eb;
          border-bottom: 2px solid #2563eb;
          background: #f8fafc;
        }

        .tab-item:hover:not(.active) {
          background: #f9fafb;
          color: #374151;
        }

        .tab-content {
          padding: 32px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: between;
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
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-input:disabled {
          background-color: #f9fafb;
          color: #6b7280;
          cursor: not-allowed;
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .edit-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
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
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .info-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .info-card-title {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .info-list {
          list-style: none;
          padding: 0;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-label {
          font-weight: 500;
          color: #6b7280;
        }

        .info-value {
          color: #1f2937;
          font-weight: 500;
        }

        .verification-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          font-size: 14px;
        }

        .ic-upload-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 20px;
        }

        .ic-upload-item {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          min-height: 150px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .ic-upload-item:hover {
          border-color: #2563eb;
          background: #f8fafc;
        }

        .ic-upload-item.has-image {
          border-color: #10b981;
          background: #ecfdf5;
        }

        .ic-preview {
          max-width: 100%;
          max-height: 120px;
          border-radius: 4px;
          margin-bottom: 8px;
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
          border-radius: 12px;
          padding: 32px;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 40px;
          margin: 20px 0;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .upload-area:hover {
          border-color: #2563eb;
          background: #f8fafc;
        }

        .upload-area.dragover {
          border-color: #2563eb;
          background: #f0f9ff;
        }

        .hidden {
          display: none;
        }

        @media (max-width: 768px) {
          .profile-container {
            padding: 16px;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
            gap: 24px;
          }

          .profile-stats {
            justify-content: center;
          }

          .tab-navigation {
            flex-wrap: wrap;
          }

          .tab-item {
            flex: 1;
            min-width: 120px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .ic-upload-section {
            grid-template-columns: 1fr;
          }

          .edit-actions {
            flex-direction: column;
          }
        }
      `}</style>

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
                      type="tel"
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

            {activeTab === 'medical' && (
              <div>
                <h2 className="section-title">Medical Information</h2>

                <div className="info-card">
                  <div className="info-card-title">
                    <AlertCircle size={18} color="#f59e0b" />
                    Important Medical Details
                  </div>
                  <ul className="info-list">
                    <li className="info-item">
                      <span className="info-label">Blood Type</span>
                      <span className="info-value">{profileData.bloodType}</span>
                    </li>
                    <li className="info-item">
                      <span className="info-label">Known Allergies</span>
                      <span className="info-value">{profileData.allergies}</span>
                    </li>
                  </ul>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Blood Type</label>
                    <input
                      type="text"
                      name="bloodType"
                      className="form-input"
                      value={isEditing ? editData.bloodType : profileData.bloodType}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Current Conditions</label>
                    <textarea
                      name="conditions"
                      className="form-input form-textarea"
                      value={isEditing ? editData.conditions : profileData.conditions}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="List any current medical conditions..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Known Allergies</label>
                    <textarea
                      name="allergies"
                      className="form-input form-textarea"
                      value={isEditing ? editData.allergies : profileData.allergies}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="List any known allergies..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Current Medications</label>
                    <textarea
                      name="medications"
                      className="form-input form-textarea"
                      value={isEditing ? editData.medications : profileData.medications}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="List current medications and dosages..."
                    />
                  </div>
                </div>
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
                    <button className="btn btn-secondary" style={{justifyContent: 'flex-start'}}>
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
    </>
  );
};

export default ProfilePage;