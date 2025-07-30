import React, { useState } from 'react';
import { Calendar, CreditCard, CheckCircle, XCircle, Clock, AlertCircle, DollarSign, Receipt, Filter, ArrowLeft, Search, Download } from 'lucide-react';
import PatientHeader from '../../Components/PatientHeader';
import PatientFooter from '../../Components/PatientFooter';

const PatientBilling = () => {
  const [activeTab, setActiveTab] = useState('bills');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  // Search and filter states
  const [billSearchTerm, setBillSearchTerm] = useState('');
  const [paymentSearchTerm, setPaymentSearchTerm] = useState('');
  const [paymentFilterStatus, setPaymentFilterStatus] = useState('all');
  const [paymentFilterMethod, setPaymentFilterMethod] = useState('all');

  // Sample billing data
  const bills = [
    {
      billId: 'BILL001',
      appointmentId: 'APT001',
      date: '2024-08-15',
      dueDate: '2024-09-15',
      doctorName: 'Dr. Sarah Johnson',
      service: 'General Checkup',
      amount: 150.00,
      status: 'unpaid',
      items: [
        { description: 'Consultation Fee', amount: 100.00 },
        { description: 'Blood Test', amount: 30.00 },
        { description: 'ECG', amount: 20.00 }
      ]
    },
    {
      billId: 'BILL002',
      appointmentId: 'APT002',
      date: '2024-08-10',
      dueDate: '2024-09-10',
      doctorName: 'Dr. Michael Chen',
      service: 'Follow-up Consultation',
      amount: 80.00,
      status: 'paid',
      paidDate: '2024-08-12',
      paymentMethod: 'Credit Card',
      items: [
        { description: 'Consultation Fee', amount: 80.00 }
      ]
    },
    {
      billId: 'BILL003',
      appointmentId: 'APT003',
      date: '2024-07-28',
      dueDate: '2024-08-28',
      doctorName: 'Dr. Emily Davis',
      service: 'Cardiology Consultation',
      amount: 200.00,
      status: 'overdue',
      items: [
        { description: 'Specialist Consultation', amount: 150.00 },
        { description: 'Echocardiogram', amount: 50.00 }
      ]
    }
  ];

  const paymentHistory = [
    {
      paymentId: 'PAY001',
      billId: 'BILL002',
      date: '2024-08-12',
      amount: 80.00,
      method: 'Credit Card',
      status: 'completed',
      transactionId: 'TXN123456789'
    },
    {
      paymentId: 'PAY002',
      billId: 'BILL004',
      date: '2024-08-05',
      amount: 120.00,
      method: 'PayPal',
      status: 'completed',
      transactionId: 'TXN987654321'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return <CheckCircle style={{ width: '20px', height: '20px', color: '#10b981' }} />;
      case 'unpaid':
        return <Clock style={{ width: '20px', height: '20px', color: '#f59e0b' }} />;
      case 'overdue':
        return <XCircle style={{ width: '20px', height: '20px', color: '#ef4444' }} />;
      default:
        return <AlertCircle style={{ width: '20px', height: '20px', color: '#6b7280' }} />;
    }
  };

  const filteredBills = bills.filter(bill => {
    const matchesStatus = filterStatus === 'all' || bill.status === filterStatus;
    const matchesSearch = billSearchTerm === '' ||
      bill.service.toLowerCase().includes(billSearchTerm.toLowerCase()) ||
      bill.doctorName.toLowerCase().includes(billSearchTerm.toLowerCase()) ||
      bill.billId.toLowerCase().includes(billSearchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const filteredPayments = paymentHistory.filter(payment => {
    const matchesStatus = paymentFilterStatus === 'all' || payment.status === paymentFilterStatus;
    const matchesMethod = paymentFilterMethod === 'all' || payment.method === paymentFilterMethod;
    const matchesSearch = paymentSearchTerm === '' ||
      payment.paymentId.toLowerCase().includes(paymentSearchTerm.toLowerCase()) ||
      payment.billId.toLowerCase().includes(paymentSearchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(paymentSearchTerm.toLowerCase());

    return matchesStatus && matchesMethod && matchesSearch;
  });

  const handlePayment = (bill) => {
    setSelectedBill(bill);
    setShowPaymentForm(true);
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    if (method === 'paypal') {
      // Simulate PayPal payment
      setTimeout(() => {
        setShowPaymentForm(false);
        setShowPaymentSuccess(true);
      }, 1000);
    }
  };

  const handleCardPayment = () => {
    // Basic validation
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
      alert('Please fill in all card details');
      return;
    }

    // Simulate card payment processing
    setTimeout(() => {
      setShowPaymentForm(false);
      setShowPaymentSuccess(true);
      // Update bill status (in real app, this would be handled by backend)
      const billIndex = bills.findIndex(b => b.billId === selectedBill.billId);
      if (billIndex !== -1) {
        bills[billIndex].status = 'paid';
        bills[billIndex].paidDate = new Date().toISOString().split('T')[0];
        bills[billIndex].paymentMethod = 'Credit Card';
      }
    }, 2000);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentSuccess(false);
    setSelectedBill(null);
    setPaymentMethod('');
    setCardDetails({ number: '', expiry: '', cvv: '', name: '' });
  };

  const generatePaymentPDF = () => {
    // Simple PDF generation simulation
    const pdfContent = `
PAYMENT HISTORY REPORT
Generated on: ${new Date().toLocaleDateString()}

${filteredPayments.map(payment => `
Payment ID: ${payment.paymentId}
Bill ID: ${payment.billId}
Date: ${payment.date}
Amount: ${payment.amount.toFixed(2)}
Method: ${payment.method}
Status: ${payment.status}
Transaction ID: ${payment.transactionId}
-------------------
`).join('')}
    `;

    // Create a blob and download
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payment-history-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success message
    alert('Payment history downloaded successfully!');
  };

  const BillCard = ({ bill }) => (
    <div className="billing-bill-card">
      <div className="billing-card-header">
        <div className="billing-bill-info">
          <h3 className="billing-bill-title">{bill.service}</h3>
          <p className="billing-bill-id">Bill ID: {bill.billId}</p>
          <p className="billing-doctor-name">Dr. {bill.doctorName}</p>
        </div>
        <div className="billing-status-container">
          {getStatusIcon(bill.status)}
          <span className={`billing-status-badge billing-status-${bill.status}`}>
            {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="billing-bill-details">
        <div className="billing-detail-item">
          <Calendar style={{ width: '16px', height: '16px' }} />
          <span>Service Date: {bill.date}</span>
        </div>
        <div className="billing-detail-item">
          <Clock style={{ width: '16px', height: '16px' }} />
          <span>Due Date: {bill.dueDate}</span>
        </div>
        <div className="billing-detail-item">
          <DollarSign style={{ width: '16px', height: '16px' }} />
          <span className="billing-amount">${bill.amount.toFixed(2)}</span>
        </div>
      </div>

      {bill.status === 'paid' && (
        <div className="billing-paid-info">
          <p>Paid on {bill.paidDate} via {bill.paymentMethod}</p>
        </div>
      )}

      <div className="billing-bill-actions">
        {(bill.status === 'unpaid' || bill.status === 'overdue') && (
          <button
            onClick={() => handlePayment(bill)}
            className="billing-pay-btn"
          >
            <CreditCard style={{ width: '16px', height: '16px' }} />
            <span>Pay Now</span>
          </button>
        )}
        <button className="billing-view-details-btn">
          <Receipt style={{ width: '16px', height: '16px' }} />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );

  const PaymentCard = ({ payment }) => (
    <div className="billing-payment-card">
      <div className="billing-card-header">
        <div className="billing-payment-info">
          <h3 className="billing-payment-title">Payment #{payment.paymentId}</h3>
          <p className="billing-payment-id">Bill: {payment.billId}</p>
          <p className="billing-transaction-id">Transaction: {payment.transactionId}</p>
        </div>
        <div className="billing-status-container">
          {getStatusIcon(payment.status)}
          <span className={`billing-status-badge billing-status-${payment.status}`}>
            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="billing-payment-details">
        <div className="billing-detail-item">
          <Calendar style={{ width: '16px', height: '16px' }} />
          <span>{payment.date}</span>
        </div>
        <div className="billing-detail-item">
          <CreditCard style={{ width: '16px', height: '16px' }} />
          <span>{payment.method}</span>
        </div>
        <div className="billing-detail-item">
          <DollarSign style={{ width: '16px', height: '16px' }} />
          <span className="billing-amount">${payment.amount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  if (showPaymentSuccess) {
    return (
      <div className="billing-payment-success-container">
        <div className="billing-success-content">
          <CheckCircle style={{ width: '64px', height: '64px', color: '#10b981', marginBottom: '16px' }} />
          <h2 className="billing-success-title">Payment Successful!</h2>
          <p className="billing-success-message">
            Your payment of ${selectedBill?.amount.toFixed(2)} has been processed successfully.
          </p>
          <div className="billing-success-details">
            <p>Bill ID: {selectedBill?.billId}</p>
            <p>Payment Method: {paymentMethod === 'card' ? 'Credit Card' : 'PayPal'}</p>
            <p>Date: {new Date().toLocaleDateString()}</p>
          </div>
          <button onClick={handlePaymentSuccess} className="billing-continue-btn">
            Continue to Billing
          </button>
        </div>
      </div>
    );
  }

  if (showPaymentForm) {
    return (
      <div className="billing-payment-form-container">
        <div className="billing-payment-form-content">
          <div className="billing-payment-header">
            <button onClick={() => setShowPaymentForm(false)} className="billing-back-btn">
              <ArrowLeft style={{ width: '20px', height: '20px' }} />
              Back
            </button>
            <h2 className="billing-payment-title">Pay Bill</h2>
          </div>

          <div className="billing-bill-summary">
            <h3>Bill Summary</h3>
            <div className="billing-summary-item">
              <span>Service:</span>
              <span>{selectedBill?.service}</span>
            </div>
            <div className="billing-summary-item">
              <span>Doctor:</span>
              <span>Dr. {selectedBill?.doctorName}</span>
            </div>
            <div className="billing-summary-item billing-total">
              <span>Total Amount:</span>
              <span>${selectedBill?.amount.toFixed(2)}</span>
            </div>
          </div>

          {!paymentMethod ? (
            <div className="billing-payment-methods">
              <h3>Select Payment Method</h3>
              <div className="billing-method-buttons">
                <button
                  onClick={() => handlePaymentMethodSelect('card')}
                  className="billing-method-btn"
                >
                  <CreditCard style={{ width: '24px', height: '24px' }} />
                  <span>Credit Card</span>
                </button>
                <button
                  onClick={() => handlePaymentMethodSelect('paypal')}
                  className="billing-method-btn"
                >
                  <div style={{ width: '24px', height: '24px', backgroundColor: '#0070ba', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px' }}>
                    PP
                  </div>
                  <span>PayPal</span>
                </button>
              </div>
            </div>
          ) : paymentMethod === 'card' ? (
            <div className="billing-card-form">
              <h3>Enter Card Details</h3>
              <div className="billing-form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                />
              </div>
              <div className="billing-form-row">
                <div className="billing-form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                  />
                </div>
                <div className="billing-form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                  />
                </div>
              </div>
              <div className="billing-form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                />
              </div>
              <button onClick={handleCardPayment} className="billing-pay-submit-btn">
                Pay ${selectedBill?.amount.toFixed(2)}
              </button>
            </div>
          ) : (
            <div className="billing-paypal-processing">
              <div className="billing-processing-spinner"></div>
              <p>Redirecting to PayPal...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .billing-container {
          min-height: 100vh;
          background-color: #f9fafb;
          padding: 32px 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          color: #374151;
          line-height: 1.5;
        }

        .billing-container * {
          box-sizing: border-box;
        }

        .billing-main-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .billing-main-title {
          font-size: 30px;
          font-weight: bold;
          color: #1f2937;
          margin: 0 0 32px 0;
        }

        .billing-tab-navigation {
          display: flex;
          background-color: #e5e7eb;
          padding: 4px;
          border-radius: 8px;
          width: fit-content;
          margin-bottom: 24px;
        }

        .billing-tab-btn {
          padding: 8px 24px;
          border-radius: 6px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          font-family: inherit;
        }

        .billing-tab-btn.billing-active {
          background-color: white;
          color: #2563eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .billing-tab-btn:not(.billing-active) {
          color: #4b5563;
        }

        .billing-tab-btn:not(.billing-active):hover {
          color: #1f2937;
        }

        .billing-filter-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .billing-controls-section {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .billing-search-container {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f9fafb;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          margin-bottom: 16px;
        }

        .billing-search-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px;
          font-family: inherit;
          color: #374151;
        }

        .billing-search-input::placeholder {
          color: #9ca3af;
        }

        .billing-filters-row {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .billing-filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .billing-download-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #dc2626;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
          font-size: 14px;
          font-family: inherit;
          margin-left: auto;
        }

        .billing-download-btn:hover:not(:disabled) {
          background-color: #b91c1c;
        }

        .billing-download-btn:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .billing-payment-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .billing-results-count {
          color: #6b7280;
          font-size: 14px;
          font-style: italic;
        }

        .billing-filter-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          color: #374151;
        }

        .billing-filter-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          font-size: 14px;
          font-family: inherit;
        }

        .billing-section-title-main {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 24px 0;
        }

        .billing-bill-card, .billing-payment-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
          margin-bottom: 16px;
          border-left: 4px solid #3b82f6;
        }

        .billing-payment-card {
          border-left-color: #10b981;
        }

        .billing-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .billing-bill-title, .billing-payment-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .billing-bill-id, .billing-payment-id, .billing-transaction-id, .billing-doctor-name {
          color: #6b7280;
          font-size: 14px;
          margin: 0 0 2px 0;
        }

        .billing-status-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .billing-status-badge {
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 500;
        }

        .billing-status-paid, .billing-status-completed {
          background-color: #dcfce7;
          color: #166534;
        }

        .billing-status-unpaid {
          background-color: #fef3c7;
          color: #92400e;
        }

        .billing-status-overdue {
          background-color: #fecaca;
          color: #991b1b;
        }

        .billing-bill-details, .billing-payment-details {
          display: flex;
          gap: 24px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .billing-detail-item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #6b7280;
          font-size: 14px;
        }

        .billing-amount {
          font-weight: 600;
          color: #1f2937;
          font-size: 16px;
        }

        .billing-paid-info {
          background-color: #f0fdf4;
          padding: 8px 12px;
          border-radius: 6px;
          margin-bottom: 16px;
          font-size: 14px;
          color: #166534;
        }

        .billing-paid-info p {
          margin: 0;
        }

        .billing-bill-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .billing-pay-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #10b981;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
          font-size: 14px;
          font-family: inherit;
        }

        .billing-pay-btn:hover {
          background-color: #059669;
        }

        .billing-view-details-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #6b7280;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
          font-size: 14px;
          font-family: inherit;
        }

        .billing-view-details-btn:hover {
          background-color: #4b5563;
        }

        .billing-payment-form-container, .billing-payment-success-container {
          min-height: 100vh;
          background-color: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          color: #374151;
          line-height: 1.5;
        }

        .billing-payment-form-content {
          background: white;
          border-radius: 8px;
          padding: 32px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .billing-payment-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .billing-back-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border-radius: 50%;
          transition: background-color 0.2s;
          font-family: inherit;
        }

        .billing-back-btn:hover {
          background-color: #f3f4f6;
        }

        .billing-payment-title {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin: 0;
        }

        .billing-bill-summary {
          background-color: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .billing-bill-summary h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 12px 0;
        }

        .billing-summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .billing-summary-item.billing-total {
          border-top: 1px solid #e5e7eb;
          padding-top: 8px;
          font-weight: 600;
          font-size: 16px;
        }

        .billing-payment-methods h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 16px 0;
        }

        .billing-method-buttons {
          display: flex;
          gap: 16px;
        }

        .billing-method-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 16px;
          flex: 1;
          justify-content: center;
          font-family: inherit;
        }

        .billing-method-btn:hover {
          border-color: #3b82f6;
          background-color: #f8faff;
        }

        .billing-card-form {
          margin-top: 24px;
        }

        .billing-card-form h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 16px 0;
        }

        .billing-form-group {
          margin-bottom: 16px;
        }

        .billing-form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 4px;
        }

        .billing-form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
        }

        .billing-form-group input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .billing-form-row {
          display: flex;
          gap: 16px;
        }

        .billing-form-row .billing-form-group {
          flex: 1;
        }

        .billing-pay-submit-btn {
          width: 100%;
          background-color: #10b981;
          color: white;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          font-family: inherit;
        }

        .billing-pay-submit-btn:hover {
          background-color: #059669;
        }

        .billing-paypal-processing {
          text-align: center;
          padding: 32px;
        }

        .billing-paypal-processing p {
          margin: 0;
        }

        .billing-processing-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: billing-spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes billing-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .billing-success-content {
          background: white;
          border-radius: 8px;
          padding: 48px 32px;
          text-align: center;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .billing-success-title {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .billing-success-message {
          color: #6b7280;
          margin: 0 0 24px 0;
        }

        .billing-success-details {
          background-color: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          text-align: left;
        }

        .billing-success-details p {
          font-size: 14px;
          margin: 0 0 4px 0;
        }

        .billing-continue-btn {
          background-color: #3b82f6;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          font-family: inherit;
        }

        .billing-continue-btn:hover {
          background-color: #2563eb;
        }

        .billing-empty-state {
          text-align: center;
          padding: 48px;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .billing-container {
            padding: 16px 8px;
          }

          .billing-card-header {
            flex-direction: column;
            gap: 12px;
          }

          .billing-bill-details, .billing-payment-details {
            flex-direction: column;
            gap: 8px;
          }

          .billing-bill-actions {
            flex-direction: column;
          }

          .billing-method-buttons {
            flex-direction: column;
          }

          .billing-form-row {
            flex-direction: column;
          }

          .billing-filters-row {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .billing-download-btn {
            margin-left: 0;
            width: 100%;
            justify-content: center;
          }

          .billing-payment-header-row {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }

          .billing-results-count {
            text-align: center;
          }
        }
      `}</style>

      <div>
        {/* Header */}
        <PatientHeader />

        <div className="billing-container">
          <div className="billing-main-container">
            <h1 className="billing-main-title">Billing & Payments</h1>

            {/* Tab Navigation */}
            <div className="billing-tab-navigation">
              <button
                onClick={() => setActiveTab('bills')}
                className={`billing-tab-btn ${activeTab === 'bills' ? 'billing-active' : ''}`}
              >
                Bills
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`billing-tab-btn ${activeTab === 'payments' ? 'billing-active' : ''}`}
              >
                Payment History
              </button>
            </div>

            {/* Bills Tab */}
            {activeTab === 'bills' && (
              <div>
                {/* Search and Filter Section */}
                <div className="billing-controls-section">
                  <div className="billing-search-container">
                    <Search style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                    <input
                      type="text"
                      placeholder="Search bills by service, doctor, or bill ID..."
                      value={billSearchTerm}
                      onChange={(e) => setBillSearchTerm(e.target.value)}
                      className="billing-search-input"
                    />
                  </div>
                  <div className="billing-filter-section">
                    <div className="billing-filter-label">
                      <Filter style={{ width: '16px', height: '16px' }} />
                      <span>Filter:</span>
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="billing-filter-select"
                    >
                      <option value="all">All Bills</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                </div>

                <h2 className="billing-section-title-main">My Bills</h2>
                <div>
                  {filteredBills.map((bill) => (
                    <BillCard key={bill.billId} bill={bill} />
                  ))}
                  {filteredBills.length === 0 && (
                    <div className="billing-empty-state">
                      {billSearchTerm ? 'No bills found matching your search.' : 'No bills found for the selected filter.'}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment History Tab */}
            {activeTab === 'payments' && (
              <div>
                {/* Search, Filter and Download Section */}
                <div className="billing-controls-section">
                  <div className="billing-search-container">
                    <Search style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                    <input
                      type="text"
                      placeholder="Search by payment ID, bill ID, or transaction ID..."
                      value={paymentSearchTerm}
                      onChange={(e) => setPaymentSearchTerm(e.target.value)}
                      className="billing-search-input"
                    />
                  </div>
                  <div className="billing-filters-row">
                    <div className="billing-filter-group">
                      <div className="billing-filter-label">
                        <Filter style={{ width: '16px', height: '16px' }} />
                        <span>Status:</span>
                      </div>
                      <select
                        value={paymentFilterStatus}
                        onChange={(e) => setPaymentFilterStatus(e.target.value)}
                        className="billing-filter-select"
                      >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                    <div className="billing-filter-group">
                      <div className="billing-filter-label">
                        <span>Method:</span>
                      </div>
                      <select
                        value={paymentFilterMethod}
                        onChange={(e) => setPaymentFilterMethod(e.target.value)}
                        className="billing-filter-select"
                      >
                        <option value="all">All Methods</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                    </div>
                    <button
                      onClick={generatePaymentPDF}
                      className="billing-download-btn"
                      disabled={filteredPayments.length === 0}
                    >
                      <Download style={{ width: '16px', height: '16px' }} />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>

                <div className="billing-payment-header-row">
                  <h2 className="billing-section-title-main">Payment History</h2>
                  <div className="billing-results-count">
                    {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''} found
                  </div>
                </div>

                <div>
                  {filteredPayments.map((payment) => (
                    <PaymentCard key={payment.paymentId} payment={payment} />
                  ))}
                  {filteredPayments.length === 0 && (
                    <div className="billing-empty-state">
                      {paymentSearchTerm || paymentFilterStatus !== 'all' || paymentFilterMethod !== 'all'
                        ? 'No payments found matching your criteria.'
                        : 'No payment history available.'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <PatientFooter />
      </div>
    </>
  );
};

export default PatientBilling;