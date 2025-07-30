import React, { useState } from 'react';
import { Calendar, CreditCard, CheckCircle, XCircle, Clock, AlertCircle, DollarSign, Receipt, Filter, ArrowLeft, Search, Download, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import PatientHeader from '../../Components/PatientHeader';
import PatientFooter from '../../Components/PatientFooter';
const EnhancedPaymentForm = () => {
  const [selectedBill, setSelectedBill] = useState({
    billId: 'BILL001',
    service: 'General Checkup',
    doctorName: 'Dr. Sarah Johnson',
    amount: 150.00,
    date: '2024-08-15',
    items: [
      { description: 'Consultation Fee', amount: 100.00 },
      { description: 'Blood Test', amount: 30.00 },
      { description: 'ECG', amount: 20.00 }
    ]
  });

  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(true);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    if (method === 'paypal') {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setShowPaymentForm(false);
        setShowPaymentSuccess(true);
      }, 2000);
    }
  };

  const handleCardPayment = () => {
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
      alert('Please fill in all card details');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowPaymentForm(false);
      setShowPaymentSuccess(true);
    }, 3000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const getCardType = (number) => {
    const num = number.replace(/\s/g, '');
    if (/^4/.test(num)) return 'visa';
    if (/^5[1-5]/.test(num)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    return 'card';
  };

  if (showPaymentSuccess) {
    return (
      <div className="payment-success-container">
        <div className="payment-success-content">
          <div className="success-icon-wrapper">
            <CheckCircle className="success-icon" />
          </div>
          <h2 className="success-title">Payment Successful!</h2>
          <p className="success-message">
            Your payment has been processed successfully. You will receive a confirmation email shortly.
          </p>

          <div className="success-details">
            <div className="detail-row">
              <span className="detail-label">Amount Paid:</span>
              <span className="detail-value">${selectedBill?.amount.toFixed(2)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Bill ID:</span>
              <span className="detail-value">{selectedBill?.billId}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Payment Method:</span>
              <span className="detail-value">{paymentMethod === 'card' ? 'Credit Card' : 'PayPal'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Transaction Date:</span>
              <span className="detail-value">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="success-actions">
            <button onClick={() => window.print()} className="btn-secondary">
              Download Receipt
            </button>
            <button
              onClick={() => {
                setShowPaymentSuccess(false);
                setPaymentMethod('');
                setCardDetails({ number: '', expiry: '', cvv: '', name: '' });
              }}
              className="btn-primary"
            >
              Back to Billing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .payment-container {
          min-height: 100vh;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .payment-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f1f5f9;
          overflow: hidden;
          max-width: 600px;
          width: 100%;
          position: relative;
        }

        .payment-header {
          background: white;
          border-bottom: 1px solid #f1f5f9;
          padding: 30px;
          text-align: center;
          color: #1e293b;
          position: relative;
        }

        .back-button {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #64748b;
        }

        .back-button:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          transform: translateY(-50%) scale(1.1);
          color: #475569;
        }

        .payment-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .payment-subtitle {
          opacity: 0.9;
          font-size: 16px;
        }

        .payment-content {
          padding: 40px;
        }

        .bill-summary {
          background: white;
          border: 1px solid #f1f5f9;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
        }

        .summary-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .summary-items {
          space-y: 12px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .summary-item:last-child {
          border-bottom: none;
          padding-top: 16px;
          margin-top: 16px;
          border-top: 2px solid #3b82f6;
          font-weight: 600;
          font-size: 18px;
          color: #1e293b;
        }

        .summary-label {
          color: #64748b;
          font-size: 14px;
        }

        .summary-value {
          color: #1e293b;
          font-weight: 500;
        }

        .payment-methods {
          margin-bottom: 32px;
        }

        .methods-title {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .method-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .method-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px;
          border: 2px solid #f1f5f9;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 16px;
          font-weight: 500;
          color: #475569;
          position: relative;
          overflow: hidden;
        }

        .method-button:hover {
          border-color: #3b82f6;
          background: #fafbff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
        }

        .method-button.selected {
          border-color: #3b82f6;
          background: #fafbff;
          color: #1d4ed8;
        }

        .method-icon {
          width: 24px;
          height: 24px;
        }

        .paypal-icon {
          width: 28px;
          height: 28px;
          background: #0070ba;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 12px;
        }

        .card-form {
          animation: slideInUp 0.3s ease-out;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-title {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 16px;
          border: 2px solid #f1f5f9;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.05);
        }

        .form-input.error {
          border-color: #ef4444;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          cursor: pointer;
        }

        .input-icon:hover {
          color: #6b7280;
        }

        .card-preview {
          background: white;
          border: 2px solid #f1f5f9;
          border-radius: 16px;
          padding: 24px;
          color: #1e293b;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .card-preview::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(59, 130, 246, 0.05) 100%);
          border-radius: 50%;
        }

        .card-number {
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 2px;
          margin-bottom: 16px;
          font-family: 'Courier New', monospace;
          color: #475569;
        }

        .card-details {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .card-name {
          font-size: 14px;
          text-transform: uppercase;
          font-weight: 500;
          color: #64748b;
        }

        .card-expiry {
          font-size: 14px;
          font-family: 'Courier New', monospace;
          color: #64748b;
        }

        .security-info {
          background: white;
          border: 1px solid #e0f2fe;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .security-text {
          font-size: 14px;
          color: #0369a1;
        }

        .submit-button {
          width: 100%;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 18px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .submit-button:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .processing-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .paypal-processing {
          text-align: center;
          padding: 40px;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .processing-icon {
          width: 60px;
          height: 60px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        .processing-text {
          font-size: 18px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .processing-subtext {
          font-size: 14px;
          color: #6b7280;
        }

        .payment-success-container {
          min-height: 100vh;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .payment-success-content {
          background: white;
          border: 1px solid #f1f5f9;
          border-radius: 20px;
          padding: 48px 40px;
          text-align: center;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          animation: slideInUp 0.5s ease-out;
        }

        .success-icon-wrapper {
          background: #10b981;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }

        .success-icon {
          width: 40px;
          height: 40px;
          color: white;
        }

        .success-title {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 12px;
        }

        .success-message {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .success-details {
          background: white;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
          text-align: left;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f8fafc;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-size: 14px;
          color: #64748b;
        }

        .detail-value {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .success-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
        }

        .btn-secondary {
          background: white;
          color: #374151;
          border: 2px solid #f1f5f9;
          border-radius: 12px;
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          border-color: #e2e8f0;
          background: #fafbff;
        }

        @media (max-width: 768px) {
          .payment-container {
            padding: 10px;
          }

          .payment-content {
            padding: 24px;
          }

          .method-buttons {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .success-actions {
            flex-direction: column;
          }

          .payment-header {
            padding: 24px;
          }

          .payment-title {
            font-size: 24px;
          }
        }
      `}</style>
<div>
        {/* Header */}
        <PatientHeader />
      <div className="payment-container">
        <div className="payment-card">
          <div className="payment-header">
            {/*<button
              onClick={() => setShowPaymentForm(false)}
              className="back-button"
            >
              <ArrowLeft size={20} />
            </button> */}
            <h1 className="payment-title">Secure Payment</h1>
            <p className="payment-subtitle">Complete your payment safely and securely</p>
          </div>

          <div className="payment-content">
            {/* Bill Summary */}
            <div className="bill-summary">
              <h3 className="summary-title">
                <Receipt size={20} />
                Bill Summary
              </h3>
              <div className="summary-items">
                {selectedBill.items.map((item, index) => (
                  <div key={index} className="summary-item">
                    <span className="summary-label">{item.description}</span>
                    <span className="summary-value">${item.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="summary-item">
                  <span>Total Amount</span>
                  <span>${selectedBill.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            {!paymentMethod && !isProcessing && (
              <div className="payment-methods">
                <h3 className="methods-title">
                  <CreditCard size={20} />
                  Choose Payment Method
                </h3>
                <div className="method-buttons">
                  <button
                    onClick={() => handlePaymentMethodSelect('card')}
                    className="method-button"
                  >
                    <CreditCard className="method-icon" />
                    <span>Credit Card</span>
                  </button>
                  <button
                    onClick={() => handlePaymentMethodSelect('paypal')}
                    className="method-button"
                  >
                    <div className="paypal-icon">PP</div>
                    <span>PayPal</span>
                  </button>
                </div>
              </div>
            )}

            {/* Card Payment Form */}
            {paymentMethod === 'card' && !isProcessing && (
              <div className="card-form">
                <h3 className="form-title">
                  <Lock size={20} />
                  Enter Card Details
                </h3>

                {/* Live Card Preview */}
                <div className="card-preview">
                  <div className="card-number">
                    {cardDetails.number || '•••• •••• •••• ••••'}
                  </div>
                  <div className="card-details">
                    <div className="card-name">
                      {cardDetails.name || 'CARDHOLDER NAME'}
                    </div>
                    <div className="card-expiry">
                      {cardDetails.expiry || 'MM/YY'}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({
                      ...cardDetails,
                      number: formatCardNumber(e.target.value)
                    })}
                    maxLength="19"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({
                        ...cardDetails,
                        expiry: formatExpiry(e.target.value)
                      })}
                      maxLength="5"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <div className="input-with-icon">
                      <input
                        type={showCvv ? "text" : "password"}
                        className="form-input"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({
                          ...cardDetails,
                          cvv: e.target.value.replace(/\D/g, '').substring(0, 4)
                        })}
                        maxLength="4"
                      />
                      <button
                        type="button"
                        className="input-icon"
                        onClick={() => setShowCvv(!showCvv)}
                      >
                        {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({
                      ...cardDetails,
                      name: e.target.value.toUpperCase()
                    })}
                  />
                </div>

                <div className="security-info">
                  <Shield size={20} color="#0369a1" />
                  <span className="security-text">
                    Your payment information is encrypted and secure
                  </span>
                </div>

                <button
                  onClick={handleCardPayment}
                  className="submit-button"
                  disabled={!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name}
                >
                  <Lock size={18} />
                  Pay ${selectedBill.amount.toFixed(2)}
                </button>
              </div>
            )}

            {/* PayPal Processing */}
            {(isProcessing && paymentMethod === 'paypal') && (
              <div className="paypal-processing">
                <div className="processing-icon"></div>
                <p className="processing-text">Redirecting to PayPal...</p>
                <p className="processing-subtext">Please wait while we redirect you to PayPal to complete your payment</p>
              </div>
            )}

            {/* Card Processing */}
            {(isProcessing && paymentMethod === 'card') && (
              <div className="paypal-processing">
                <div className="processing-icon"></div>
                <p className="processing-text">Processing Payment...</p>
                <p className="processing-subtext">Please wait while we process your payment securely</p>
              </div>
            )}
          </div>
        </div>
      </div>

<PatientFooter />
            </div>
    </>
  );
};

export default EnhancedPaymentForm;