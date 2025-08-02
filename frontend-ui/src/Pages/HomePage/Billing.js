import React, { useState } from 'react';
import { Calendar, CreditCard, CheckCircle, XCircle, Clock, AlertCircle, DollarSign, Receipt, Filter, ArrowLeft, Search, Download } from 'lucide-react';
import PatientHeader from '../../Components/PatientHeader';
import PatientFooter from '../../Components/PatientFooter';
import { useNavigate } from 'react-router-dom';
import "./css/Billing.css"
const PatientBilling = () => {
  const navigate = useNavigate();
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
    // Optional: do something with `bill` if needed
    navigate('/payment'); // Redirect to payment page
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