import React, { useState } from 'react';
import { Calendar, TrendingUp, DollarSign, CreditCard, Download, Filter, BarChart3, PieChart, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, AreaChart, Area ,Pie} from 'recharts';

const PatientReports = () => {
  const [dateRange, setDateRange] = useState('6months');
  const [reportType, setReportType] = useState('all');

  // Sample data for charts
  const monthlySpendingData = [
    { month: 'Jan', amount: 320, bills: 2 },
    { month: 'Feb', amount: 180, bills: 1 },
    { month: 'Mar', amount: 450, bills: 3 },
    { month: 'Apr', amount: 280, bills: 2 },
    { month: 'May', amount: 380, bills: 2 },
    { month: 'Jun', amount: 520, bills: 4 },
  ];

  const serviceTypeData = [
    { name: 'General Checkup', value: 35, amount: 1250, color: '#3b82f6' },
    { name: 'Cardiology', value: 25, amount: 980, color: '#ef4444' },
    { name: 'Dermatology', value: 20, amount: 750, color: '#10b981' },
    { name: 'Orthopedic', value: 15, amount: 600, color: '#f59e0b' },
    { name: 'Others', value: 5, amount: 200, color: '#8b5cf6' },
  ];

  const paymentMethodData = [
    { name: 'Credit Card', value: 60, color: '#3b82f6' },
    { name: 'PayPal', value: 30, color: '#10b981' },
    { name: 'Bank Transfer', value: 10, color: '#f59e0b' },
  ];

  const yearlyTrendData = [
    { year: '2020', amount: 2800 },
    { year: '2021', amount: 3200 },
    { year: '2022', amount: 2900 },
    { year: '2023', amount: 4100 },
    { year: '2024', amount: 3780 },
  ];

  // Summary statistics
  const summaryStats = {
    totalSpent: 3780,
    totalBills: 14,
    avgBillAmount: 270,
    pendingAmount: 350,
    thisMonthSpent: 520,
    lastMonthSpent: 380,
    mostUsedService: 'General Checkup',
    preferredPaymentMethod: 'Credit Card'
  };

  const downloadReport = () => {
    const reportData = `
PATIENT BILLING REPORT
Generated on: ${new Date().toLocaleDateString()}
Date Range: ${dateRange}

SUMMARY STATISTICS
==================
Total Amount Spent: $${summaryStats.totalSpent}
Total Bills: ${summaryStats.totalBills}
Average Bill Amount: $${summaryStats.avgBillAmount}
Pending Payments: $${summaryStats.pendingAmount}
This Month Spending: $${summaryStats.thisMonthSpent}
Last Month Spending: $${summaryStats.lastMonthSpent}

MONTHLY BREAKDOWN
================
${monthlySpendingData.map(item =>
`${item.month}: $${item.amount} (${item.bills} bills)`
).join('\n')}

SERVICE TYPE BREAKDOWN
=====================
${serviceTypeData.map(item =>
`${item.name}: ${item.value}% ($${item.amount})`
).join('\n')}

PAYMENT METHOD BREAKDOWN
=======================
${paymentMethodData.map(item =>
`${item.name}: ${item.value}%`
).join('\n')}
    `;

    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `billing-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-container">
      <style>{`
        .reports-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          padding: 32px 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .reports-main-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .reports-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .reports-title-section h1 {
          font-size: 32px;
          font-weight: bold;
          color: #1f2937;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .reports-title-section p {
          color: #6b7280;
          margin: 0;
          font-size: 16px;
        }

        .reports-controls {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .reports-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          font-size: 14px;
          font-family: inherit;
        }

        .reports-download-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #dc2626;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
          font-family: inherit;
        }

        .reports-download-btn:hover {
          background: #b91c1c;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border-left: 4px solid;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .stat-card.primary { border-left-color: #3b82f6; }
        .stat-card.success { border-left-color: #10b981; }
        .stat-card.warning { border-left-color: #f59e0b; }
        .stat-card.danger { border-left-color: #ef4444; }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .stat-title {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .stat-icon {
          padding: 8px;
          border-radius: 8px;
          background: #f3f4f6;
        }

        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .stat-change {
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .stat-change.positive { color: #10b981; }
        .stat-change.negative { color: #ef4444; }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .chart-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .chart-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .chart-card.full-width {
          grid-column: 1 / -1;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .chart-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chart-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 4px 0 0 0;
        }

        .chart-container {
          height: 300px;
        }

        .legend-container {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 16px;
          justify-content: center;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        .insight-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .insight-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .insight-item {
          background: rgba(255, 255, 255, 0.1);
          padding: 16px;
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }

        .insight-item h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
        }

        .insight-item p {
          margin: 0;
          font-size: 14px;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .reports-container {
            padding: 16px 8px;
          }

          .reports-header {
            flex-direction: column;
            align-items: stretch;
          }

          .reports-controls {
            justify-content: center;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }

          .chart-container {
            height: 250px;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }

        .custom-tooltip {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .tooltip-label {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .tooltip-value {
          color: #3b82f6;
          font-weight: 500;
        }
      `}</style>

      <div className="reports-main-container">
        {/* Header */}
        <div className="reports-header">
          <div className="reports-title-section">
            <h1>
              <BarChart3 style={{ width: '32px', height: '32px', color: '#3b82f6' }} />
              Billing Reports & Analytics
            </h1>
            <p>Track your healthcare spending patterns and payment history</p>
          </div>
          <div className="reports-controls">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="reports-select"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="all">All Time</option>
            </select>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="reports-select"
            >
              <option value="all">All Services</option>
              <option value="general">General Checkup</option>
              <option value="specialist">Specialist Care</option>
            </select>
            <button onClick={downloadReport} className="reports-download-btn">
              <Download style={{ width: '16px', height: '16px' }} />
              Download Report
            </button>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-header">
              <span className="stat-title">Total Spent</span>
              <div className="stat-icon">
                <DollarSign style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
              </div>
            </div>
            <div className="stat-value">${summaryStats.totalSpent.toLocaleString()}</div>
            <div className="stat-change positive">
              <TrendingUp style={{ width: '12px', height: '12px' }} />
              +12% from last period
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-header">
              <span className="stat-title">Total Bills</span>
              <div className="stat-icon">
                <Activity style={{ width: '20px', height: '20px', color: '#10b981' }} />
              </div>
            </div>
            <div className="stat-value">{summaryStats.totalBills}</div>
            <div className="stat-change positive">
              <TrendingUp style={{ width: '12px', height: '12px' }} />
              +3 this month
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-header">
              <span className="stat-title">Average Bill</span>
              <div className="stat-icon">
                <BarChart3 style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
              </div>
            </div>
            <div className="stat-value">${summaryStats.avgBillAmount}</div>
            <div className="stat-change negative">
              -8% from average
            </div>
          </div>

          <div className="stat-card danger">
            <div className="stat-header">
              <span className="stat-title">Pending Payments</span>
              <div className="stat-icon">
                <CreditCard style={{ width: '20px', height: '20px', color: '#ef4444' }} />
              </div>
            </div>
            <div className="stat-value">${summaryStats.pendingAmount}</div>
            <div className="stat-change positive">
              2 bills pending
            </div>
          </div>
        </div>

        {/* Insights Card */}
        <div className="insight-card">
          <h3 className="insight-title">
            <Activity style={{ width: '24px', height: '24px' }} />
            Key Insights
          </h3>
          <div className="insights-grid">
            <div className="insight-item">
              <h4>Spending Pattern</h4>
              <p>Your healthcare spending increased by 37% compared to last year, mainly due to specialist consultations.</p>
            </div>
            <div className="insight-item">
              <h4>Peak Month</h4>
              <p>June had the highest spending ($520) with 4 medical appointments scheduled.</p>
            </div>
            <div className="insight-item">
              <h4>Cost Optimization</h4>
              <p>Consider preventive care packages to reduce specialist visit costs by up to 25%.</p>
            </div>
            <div className="insight-item">
              <h4>Payment Preference</h4>
              <p>You primarily use Credit Card (60%) for payments. Consider automated payments for discounts.</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          {/* Monthly Spending Trend */}
          <div className="chart-card full-width">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">
                  <TrendingUp style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                  Monthly Spending Trend
                </h3>
                <p className="chart-subtitle">Your healthcare expenses over the last 6 months</p>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySpendingData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service Type Distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">
                  <PieChart style={{ width: '20px', height: '20px', color: '#10b981' }} />
                  Service Types
                </h3>
                <p className="chart-subtitle">Distribution by medical service category</p>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={serviceTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {serviceTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value}% ($${props.payload.amount})`,
                      props.payload.name
                    ]}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="legend-container">
              {serviceTypeData.map((item, index) => (
                <div key={index} className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">
                  <CreditCard style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
                  Payment Methods
                </h3>
                <p className="chart-subtitle">Preferred payment options</p>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentMethodData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="name" type="category" width={100} stroke="#6b7280" />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Usage']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Yearly Trend */}
          <div className="chart-card full-width">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">
                  <Calendar style={{ width: '20px', height: '20px', color: '#8b5cf6' }} />
                  5-Year Spending Overview
                </h3>
                <p className="chart-subtitle">Long-term healthcare expense trends</p>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    formatter={(value) => [`$${value}`, 'Annual Spending']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: '#8b5cf6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientReports;