import React, { useState } from 'react';
import { Calendar, CreditCard, CheckCircle, XCircle, Clock, AlertCircle, DollarSign, Receipt, Filter, ArrowLeft, Search, Download, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import PatientHeader from '../../Components/PatientHeader';
import PatientFooter from '../../Components/PatientFooter';
import "./css/Payment.css";
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