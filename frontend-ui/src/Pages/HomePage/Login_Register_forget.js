import React, { useState, useEffect } from 'react';
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
  CheckCircle,
  Loader,
  Info,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import ApiService from '../../services/api';
import "./css/Login_Register_forget.css";
import blindSignatureClient from '../../services/blindSignatureClient';

const HealthcareAuth = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // New state for verification features
  const [showDemo, setShowDemo] = useState(false);
  const [showVerifier, setShowVerifier] = useState(false);
  const [registrationStep, setRegistrationStep] = useState('form'); // 'form', 'signing', 'success'
  const [verificationData, setVerificationData] = useState(null);

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

  // Clear messages when switching pages
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [currentPage]);

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

    if (field === 'password') {
      const strength = evaluatePasswordStrength(value);
      setPasswordStrength(strength);
    }

    // Clear errors when user starts typing
    if (error) setError('');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await ApiService.login({
        email: formData.email,
        password: formData.password
      });

      if (response.success) {
        // Store token and user data
        ApiService.setToken(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        setSuccess('Login successful! Redirecting...');

        // Redirect to patient homepage
        setTimeout(() => {
          window.location.href = '/PatientHomePage';
        }, 1500);
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRegistrationStep('signing');

    // Frontend validation first
    console.log('🔍 Starting frontend validation...');

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      setRegistrationStep('form');
      return;
    }

    if (passwordStrength.score < 3) {
      setError('Please choose a stronger password');
      setLoading(false);
      setRegistrationStep('form');
      return;
    }

    // Check required fields
    const requiredFields = {
      firstName: formData.firstName?.trim(),
      lastName: formData.lastName?.trim(),
      email: formData.email?.trim(),
      gender: formData.gender,
      birthDate: formData.birthDate,
      password: formData.password
    };

    console.log('📝 Form data validation:', requiredFields);

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        setError(`${field} is required`);
        setLoading(false);
        setRegistrationStep('form');
        return;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      setRegistrationStep('form');
      return;
    }

    // Validate birth date format (ensure ISO format)
    const birthDateISO = new Date(formData.birthDate).toISOString().split('T')[0];
    console.log('📅 Birth date converted to ISO:', birthDateISO);

    try {
      setSuccess('🔐 Initializing secure anonymous registration...');

      // Step 1: Initialize blind signature parameters
      console.log('🔄 Step 1: Initializing blind signature client...');
      await blindSignatureClient.initializeBlindSignature(ApiService);
      console.log('✅ Step 1: Blind signature client initialized');

      // Step 2: Initialize registration with email check
      console.log('🔄 Step 2: Checking email availability...');
      const initPayload = { email: formData.email.trim() };
      console.log('📤 Sending init payload:', initPayload);

      const initResponse = await ApiService.request('/auth/register-init', {
        method: 'POST',
        body: JSON.stringify(initPayload)
      });

      console.log('📥 Init response:', initResponse);

      if (!initResponse.success) {
        throw new Error(initResponse.message || 'Email validation failed');
      }
      console.log('✅ Step 2: Email available');

      setSuccess('🎭 Creating anonymous identity...');

      // Step 3: Create blinded message
      console.log('🔄 Step 3: Creating blinded message...');
      const userData = {
        email: formData.email.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim()
      };
      console.log('👤 User data for blinding:', userData);

      const blindingResult = await blindSignatureClient.createBlindedMessage(userData);
      console.log('🎭 Blinding result:', {
        sessionId: blindingResult.sessionId,
        blindedMessageLength: blindingResult.blindedMessage?.length || 0,
        messageHashLength: blindingResult.messageHash?.length || 0,
        blindingFactorLength: blindingResult.blindingFactor?.length || 0
      });

      // Step 4: Get blind signature from server
      console.log('🔄 Step 4: Requesting blind signature...');
      const blindPayload = {
        blindedMessage: blindingResult.blindedMessage,
        sessionId: blindingResult.sessionId,
        messageHash: blindingResult.messageHash,
        tempUserData: userData
      };
      console.log('📤 Sending blind payload:', {
        ...blindPayload,
        blindedMessage: `${blindPayload.blindedMessage?.substring(0, 20)}...`,
        messageHash: `${blindPayload.messageHash?.substring(0, 20)}...`
      });

      const blindResponse = await ApiService.request('/auth/register-blind', {
        method: 'POST',
        body: JSON.stringify(blindPayload)
      });

      console.log('📥 Blind response:', blindResponse);

      if (!blindResponse.success) {
        console.error('❌ Blind signature request failed:', blindResponse);
        throw new Error(blindResponse.message || 'Blind signature creation failed');
      }
      console.log('✅ Step 4: Blind signature received');

      setSuccess('✅ Processing anonymous credentials...');

      // Step 5: Process the signature
      console.log('🔄 Step 5: Processing signature...');
      const signatureResult = blindSignatureClient.processSignature(blindResponse.blindSignature);
      console.log('🔓 Signature processed:', {
        sessionId: signatureResult.sessionId,
        signatureLength: signatureResult.signature?.length || 0,
        originalMessageLength: signatureResult.originalMessage?.length || 0
      });

      // Step 6: Complete registration with processed signature
      console.log('🔄 Step 6: Completing registration...');
      const completePayload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        gender: formData.gender,
        birthDate: birthDateISO, // Use ISO format
        password: formData.password,
        signature: signatureResult.signature,
        originalMessage: signatureResult.originalMessage,
        sessionId: signatureResult.sessionId
      };

      console.log('📤 Sending complete payload:', {
        ...completePayload,
        password: '[HIDDEN]',
        signature: `${completePayload.signature?.substring(0, 20)}...`,
        originalMessage: `${completePayload.originalMessage?.substring(0, 50)}...`
      });

      const completeResponse = await ApiService.request('/auth/register-complete', {
        method: 'POST',
        body: JSON.stringify(completePayload)
      });

      console.log('📥 Complete response:', completeResponse);

      if (completeResponse.success) {
        setSuccess('🎉 Anonymous registration successful! Your privacy has been protected.');
        setRegistrationStep('success');

        // Enhanced verification data capture with your backend structure
        setVerificationData({
          sessionId: signatureResult.sessionId,
          timestamp: new Date().toISOString(),
          blindSignatureUsed: true,
          privacyProtected: true,
          user: completeResponse.user,
          // Capture blockchain data from your registerComplete response
          blockchain: {
            cordaTransactionId: completeResponse.blockchain?.cordaTransactionId,
            identityCommitment: completeResponse.blockchain?.identityCommitment,
            blockchainAddress: completeResponse.blockchain?.blockchainAddress,
            privacyLevel: completeResponse.blockchain?.privacyLevel || 'PSEUDONYMOUS',
            complianceProof: completeResponse.blockchain?.complianceProof,
            immutable: completeResponse.blockchain?.immutable !== false,
            chainVerified: completeResponse.blockchain?.chainVerified !== false,
            fallbackMode: completeResponse.blockchain?.fallbackMode || false,
            timestamp: completeResponse.blockchain?.timestamp || new Date().toISOString()
          },
          privacy: completeResponse.privacy || {
            blindSignatureUsed: true,
            serverBlindness: true,
            unlinkableRegistration: true,
            blockchainPrivacy: true
          }
        });

        console.log('✅ Registration completed successfully:', completeResponse.user);
        console.log('🔗 Blockchain data captured:', completeResponse.blockchain);

        // Reset blind signature client
        blindSignatureClient.reset();

        // Show success for a bit longer before redirecting
        setTimeout(() => {
          setCurrentPage('login');
          setRegistrationStep('form');
          // Clear the form data but keep email
          setFormData({
            email: formData.email,
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            gender: '',
            birthDate: '',
            otp: ['', '', '', '', '', '']
          });
        }, 4000);
      } else {
        console.error('❌ Registration completion failed:', completeResponse);
        throw new Error(completeResponse.message || 'Registration completion failed');
      }

    } catch (error) {
      console.error('❌ Registration error:', error);

      // Enhanced error reporting
      let errorMessage = 'Registration failed';

      if (error.message.includes('Validation failed')) {
        errorMessage = 'Please check all required fields are filled correctly';
      } else if (error.message.includes('Email already registered')) {
        errorMessage = 'This email is already registered. Please use a different email or try logging in.';
      } else if (error.message.includes('password')) {
        errorMessage = 'Password does not meet requirements. Please use a stronger password.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(`Registration failed: ${errorMessage}`);
      setRegistrationStep('form');

      // Debug information
      console.log('🔍 Debug information:');
      console.log('- Form data:', formData);
      console.log('- Client state:', blindSignatureClient.getSessionInfo());
      console.log('- Error details:', error);

      // Reset blind signature client on error
      blindSignatureClient.reset();
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await ApiService.forgotPassword(formData.email);

      if (response.success) {
        setSuccess('Verification code sent to your email!');
        // Move to OTP verification after delay
        setTimeout(() => {
          setCurrentPage('reset');
        }, 1500);
      }
    } catch (error) {
      setError(error.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const otpString = formData.otp.join('');
      const response = await ApiService.resetPassword({
        email: formData.email,
        otp: otpString,
        newPassword: formData.password
      });

      if (response.success) {
        setSuccess('Password reset successful! Please login with your new password.');
        setTimeout(() => {
          setCurrentPage('login');
          // Clear form
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            gender: '',
            birthDate: '',
            otp: ['', '', '', '', '', '']
          });
        }, 1500);
      }
    } catch (error) {
      setError(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const renderError = () => {
    if (!error) return null;
    return (
      <div style={{
        padding: '12px',
        marginBottom: '16px',
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        borderRadius: '6px',
        color: '#c33',
        fontSize: '14px'
      }}>
        {error}
      </div>
    );
  };

  const renderSuccess = () => {
    if (!success) return null;
    return (
      <div style={{
        padding: '12px',
        marginBottom: '16px',
        backgroundColor: '#efe',
        border: '1px solid #cfc',
        borderRadius: '6px',
        color: '#363',
        fontSize: '14px'
      }}>
        {success}
      </div>
    );
  };

  // Demo Modal Component
  const renderDemoModal = () => {
    if (!showDemo) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', maxWidth: '800px', width: '90%', maxHeight: '80vh', overflow: 'auto', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>🔐 How Blind Signatures Protect Your Privacy</h2>
            <button onClick={() => setShowDemo(false)} style={{ fontSize: '24px', color: '#6b7280', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>×</button>
          </div>

          <div style={{ backgroundColor: '#f3f4f6', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>Why This Matters for Your Healthcare Privacy</h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                <Shield size={20} style={{ color: '#3b82f6', marginTop: '2px' }} />
                <div>
                  <p style={{ fontWeight: '500', color: '#1f2937', margin: '0 0 4px 0' }}>Server Blindness</p>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Hospital server never sees your real data during signing</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                <Lock size={20} style={{ color: '#8b5cf6', marginTop: '2px' }} />
                <div>
                  <p style={{ fontWeight: '500', color: '#1f2937', margin: '0 0 4px 0' }}>Unlinkability</p>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Your registration cannot be traced to your signing session</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                <CheckCircle size={20} style={{ color: '#10b981', marginTop: '2px' }} />
                <div>
                  <p style={{ fontWeight: '500', color: '#1f2937', margin: '0 0 4px 0' }}>Verifiable Identity</p>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Still prove you're legitimate without revealing identity</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#ecfdf5', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>🏥 Real Healthcare Benefits</h4>
            <ul style={{ fontSize: '14px', color: '#374151', margin: 0, paddingLeft: '20px' }}>
              <li>Register anonymously without revealing identity to server</li>
              <li>Cannot be tracked during registration process</li>
              <li>Still get verifiable medical credentials</li>
              <li>Protection against data breaches during signup</li>
              <li>Comply with privacy regulations (HIPAA, GDPR)</li>
            </ul>
          </div>

          <button onClick={() => setShowDemo(false)} style={{ width: '100%', backgroundColor: '#3b82f6', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' }}>
            Got it, let's register securely!
          </button>
        </div>
      </div>
    );
  };

  // Verification Modal Component
  const renderVerificationModal = () => {
    if (!showVerifier || !verificationData) return null;

    const blockchain = verificationData.blockchain || {};
    const isFallbackMode = blockchain.fallbackMode;
    const isChainVerified = blockchain.chainVerified !== false;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '800px',
          width: '95%',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '28px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '2px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: 0
            }}>
              <div style={{
                background: isChainVerified
                  ? 'linear-gradient(45deg, #3b82f6, #8b5cf6)'
                  : 'linear-gradient(45deg, #f59e0b, #ef4444)',
                borderRadius: '12px',
                padding: '8px',
                color: 'white'
              }}>
                <Shield size={32} />
              </div>
              {isChainVerified ? 'Blockchain Privacy Verification' : 'Registration Privacy Verification'}
            </h2>
            <button
              onClick={() => setShowVerifier(false)}
              style={{
                fontSize: '24px',
                color: '#6b7280',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px'
              }}
            >
              ×
            </button>
          </div>

          {/* Status Banner */}
          <div style={{
            background: isChainVerified
              ? 'linear-gradient(to right, #ecfdf5, #d1fae5)'
              : 'linear-gradient(to right, #fef3c7, #fed7aa)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '24px',
            border: isChainVerified ? '2px solid #bbf7d0' : '2px solid #fdba74'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              {isChainVerified ? (
                <CheckCircle size={28} style={{ color: '#10b981', marginRight: '12px' }} />
              ) : (
                <AlertTriangle size={28} style={{ color: '#f59e0b', marginRight: '12px' }} />
              )}
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                {isChainVerified
                  ? 'Registration Verified & Secured on Blockchain'
                  : 'Registration Secured with Privacy Protection'
                }
              </h3>
            </div>
            <p style={{ color: '#374151', margin: 0, fontSize: '16px', lineHeight: '1.5' }}>
              Your registration has been <strong>anonymously processed</strong> using blind signature cryptography
              {isChainVerified
                ? ' and <strong>permanently recorded</strong> on the Corda blockchain with complete privacy protection.'
                : ' with <strong>simulated blockchain</strong> verification for development purposes.'
              }
            </p>
            {isFallbackMode && (
              <div style={{
                marginTop: '12px',
                padding: '8px 12px',
                backgroundColor: '#fef3c7',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#92400e'
              }}>
                <strong>Development Mode:</strong> Full Corda blockchain will be available in production
              </div>
            )}
          </div>

          {/* Privacy Protection Section */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <EyeOff size={20} style={{ color: '#8b5cf6' }} />
              Privacy Protection Verified
            </h3>

            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { label: 'Server Blindness', desc: 'Server never saw your personal data during signing', icon: '🔒', verified: true },
                { label: 'Unlinkable Registration', desc: 'Cannot trace registration back to signing session', icon: '🔗', verified: true },
                { label: 'Anonymous Identity', desc: 'Blockchain contains no personal information', icon: '👤', verified: true },
                { label: 'Cryptographic Proof', desc: 'Mathematically provable privacy preservation', icon: '🧮', verified: true }
              ].map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{item.icon}</span>
                    <div>
                      <span style={{ fontSize: '15px', fontWeight: '500', color: '#1f2937' }}>
                        {item.label}
                      </span>
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0 0 0' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <CheckCircle size={18} style={{ color: '#10b981' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Blockchain Verification Section */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                background: isChainVerified
                  ? 'linear-gradient(45deg, #3b82f6, #1d4ed8)'
                  : 'linear-gradient(45deg, #f59e0b, #dc2626)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>⛓</span>
              </div>
              {isChainVerified ? 'Corda Blockchain Registration' : 'Blockchain Registration (Simulated)'}
            </h3>

            <div style={{
              backgroundColor: isChainVerified ? '#dbeafe' : '#fef3c7',
              padding: '16px',
              borderRadius: '10px',
              border: isChainVerified ? '1px solid #93c5fd' : '1px solid #fdba74'
            }}>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: isChainVerified ? '#1e40af' : '#92400e', fontWeight: '500' }}>
                    Transaction ID
                  </span>
                  <code style={{
                    fontSize: '12px',
                    backgroundColor: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    color: '#1f2937',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {blockchain.cordaTransactionId?.substring(0, 16)}...
                  </code>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: isChainVerified ? '#1e40af' : '#92400e', fontWeight: '500' }}>
                    Identity Commitment
                  </span>
                  <code style={{
                    fontSize: '12px',
                    backgroundColor: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    color: '#1f2937',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {blockchain.identityCommitment?.substring(0, 16)}...
                  </code>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: isChainVerified ? '#1e40af' : '#92400e', fontWeight: '500' }}>
                    Privacy Level
                  </span>
                  <span style={{
                    fontSize: '12px',
                    backgroundColor: '#22c55e',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontWeight: '500'
                  }}>
                    {blockchain.privacyLevel || 'PSEUDONYMOUS'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: isChainVerified ? '#1e40af' : '#92400e', fontWeight: '500' }}>
                    Blockchain Network
                  </span>
                  <span style={{ fontSize: '12px', color: isChainVerified ? '#1e40af' : '#92400e', fontWeight: '500' }}>
                    {isChainVerified ? 'Corda Healthcare Network' : 'Simulated Network'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: isChainVerified ? '#1e40af' : '#92400e', fontWeight: '500' }}>
                    Immutable Record
                  </span>
                  <span style={{
                    fontSize: '12px',
                    backgroundColor: blockchain.immutable ? '#22c55e' : '#f59e0b',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontWeight: '500'
                  }}>
                    {blockchain.immutable ? 'YES' : 'SIMULATED'}
                  </span>
                </div>

                {blockchain.timestamp && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: isChainVerified ? '#1e40af' : '#92400e', fontWeight: '500' }}>
                      Timestamp
                    </span>
                    <span style={{ fontSize: '12px', color: '#1f2937' }}>
                      {new Date(blockchain.timestamp).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Info size={20} style={{ color: '#3b82f6' }} />
              Technical Implementation
            </h3>

            <div style={{
              backgroundColor: '#f1f5f9',
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1'
            }}>
              <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#475569', fontWeight: '500' }}>Algorithm:</span>
                  <span style={{ color: '#1f2937' }}>RSA Blind Signature (BSSA)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#475569', fontWeight: '500' }}>Key Size:</span>
                  <span style={{ color: '#1f2937' }}>2048-bit RSA</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#475569', fontWeight: '500' }}>Hash Function:</span>
                  <span style={{ color: '#1f2937' }}>SHA-256</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#475569', fontWeight: '500' }}>Blockchain:</span>
                  <span style={{ color: '#1f2937' }}>
                    {isChainVerified ? 'R3 Corda DLT' : 'Simulated (Corda in Production)'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#475569', fontWeight: '500' }}>Privacy Standard:</span>
                  <span style={{ color: '#1f2937' }}>Zero-Knowledge Registration</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#475569', fontWeight: '500' }}>Session ID:</span>
                  <span style={{ color: '#1f2937', fontSize: '12px' }}>
                    {verificationData.sessionId?.substring(0, 20)}...
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowVerifier(false)}
              style={{
                flex: 1,
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '16px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <CheckCircle size={20} />
              Continue to Healthcare Portal
            </button>

            {isChainVerified && (
              <button
                onClick={() => {
                  // Optional: Add blockchain explorer link
                  window.open(`/blockchain/transaction/${blockchain.cordaTransactionId}`, '_blank');
                }}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '14px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                View on Blockchain
              </button>
            )}
          </div>

          {/* Development Notice */}
          {isFallbackMode && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#92400e',
              textAlign: 'center'
            }}>
              <strong>Development Notice:</strong> This registration used simulated blockchain.
              In production, all transactions are recorded on the live Corda healthcare network.
            </div>
          )}
        </div>
      </div>
    );
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

        <form className="auth-form" onSubmit={handleLogin}>
          {renderError()}
          {renderSuccess()}

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
                required
                disabled={loading}
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
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
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
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? <Loader className="spin" size={20} /> : 'Sign In'}
          </button>

          <div className="auth-divider">
            <span>Don't have an account?</span>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={() => setCurrentPage('register')}
            disabled={loading}
          >
            Create Account
          </button>
        </form>
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
            disabled={loading}
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

        <form className="auth-form" onSubmit={handleRegister}>
          {/* Privacy Information Banner */}
          <div style={{
            background: 'linear-gradient(to right, #dbeafe, #e0e7ff)',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #c7d2fe'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Shield size={24} style={{ color: '#3b82f6', marginRight: '12px' }} />
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>Anonymous Registration</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Your data is protected using blind signature cryptography</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDemo(true)}
                style={{
                  fontSize: '14px',
                  backgroundColor: '#dbeafe',
                  color: '#3b82f6',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid #93c5fd',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Info size={16} />
                How it works
              </button>
            </div>
          </div>

          {/* Registration Status Indicator */}
          {registrationStep === 'signing' && (
            <div style={{
              backgroundColor: '#faf5ff',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px',
              border: '1px solid #e9d5ff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="animate-spin" style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #a855f7',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  marginRight: '12px'
                }}></div>
                <div>
                  <p style={{ color: '#7c3aed', fontWeight: '500', margin: '0 0 4px 0' }}>Performing Anonymous Registration</p>
                  <p style={{ color: '#8b5cf6', fontSize: '14px', margin: 0 }}>Your data is being signed without server visibility...</p>
                </div>
              </div>
            </div>
          )}

          {/* Success with Verification Button */}
          {registrationStep === 'success' && (
            <div style={{
              backgroundColor: '#f0fdf4',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle size={24} style={{ color: '#10b981', marginRight: '12px' }} />
                  <div>
                    <p style={{ color: '#065f46', fontWeight: '500', margin: '0 0 4px 0' }}>Anonymous Registration Successful!</p>
                    <p style={{ color: '#059669', fontSize: '14px', margin: 0 }}>Your privacy has been protected throughout the process</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVerifier(true)}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Eye size={16} />
                  Verify Privacy
                </button>
              </div>
            </div>
          )}

          {renderError()}
          {renderSuccess()}

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
                  required
                  disabled={loading}
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
                  required
                  disabled={loading}
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
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">Gender</div>
            <select
              className="form-input select-input"
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              required
              disabled={loading}
            >
              <option value="" disabled>-- Select Gender* --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <div className="form-label">Birth Date</div>
            <input
              type="date"
              className="form-input date-input"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              required
              disabled={loading}
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
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
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
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <div className="error-text">Passwords do not match</div>
            )}
          </div>

          {/* Privacy Notice */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #e5e7eb'
          }}>
            <h4 style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} style={{ color: '#3b82f6' }} />
              Your Privacy is Protected
            </h4>
            <ul style={{ fontSize: '14px', color: '#6b7280', margin: 0, paddingLeft: '20px' }}>
              <li>Your registration data will never be visible to the server during signing</li>
              <li>The signature process is mathematically unlinkable to your identity</li>
              <li>You receive verifiable credentials without compromising privacy</li>
              <li>Full compliance with healthcare privacy regulations</li>
            </ul>
          </div>

          <div className="terms-section">
            <div className="checkbox-label">
              <input type="checkbox" className="checkbox" required disabled={loading} />
              <span className="checkbox-text">
                I agree to the <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a>
              </span>
            </div>
          </div>

          <button className="primary-button" type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {loading ? (
              <>
                <div className="animate-spin" style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%'
                }}></div>
                Creating Anonymous Account...
              </>
            ) : (
              <>
                <Shield size={20} />
                Create Anonymous Account
              </>
            )}
          </button>

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={() => setCurrentPage('login')}
            disabled={loading}
          >
            Sign In
          </button>
        </form>
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
            disabled={loading}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="logo-section">
            <div className="logo-icon">
              <Shield size={32} />
            </div>
            <h1 className="logo-text">HealthCare+</h1>
          </div>
          <h2 className="auth-title">Forgot Password</h2>
          <p className="auth-subtitle">
            Enter your email address to receive a verification code
          </p>
        </div>

        <form className="auth-form" onSubmit={handleForgotPassword}>
          {renderError()}
          {renderSuccess()}

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
                required
                disabled={loading}
              />
            </div>
          </div>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? <Loader className="spin" size={20} /> : 'Send Verification Code'}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => setCurrentPage('login')}
            disabled={loading}
          >
            Back to Sign In
          </button>
        </form>
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
            disabled={loading}
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
            Enter the verification code and your new password
          </p>
        </div>

        <form className="auth-form" onSubmit={handleResetPassword}>
          {renderError()}
          {renderSuccess()}

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
                  disabled={loading}
                />
              ))}
            </div>
          </div>

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
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
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
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
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

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? <Loader className="spin" size={20} /> : 'Reset Password'}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => setCurrentPage('login')}
            disabled={loading}
          >
            Back to Sign In
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="auth-wrapper">
      {currentPage === 'login' && renderLogin()}
      {currentPage === 'register' && renderRegister()}
      {currentPage === 'forgot' && renderForgotPassword()}
      {currentPage === 'reset' && renderResetPassword()}

      {/* Render modals */}
      {renderDemoModal()}
      {renderVerificationModal()}
    </div>
  );
};

export default HealthcareAuth;