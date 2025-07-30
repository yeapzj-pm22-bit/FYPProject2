import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Download, RefreshCw, Calendar, TrendingUp, Package, Activity, DollarSign, Users, FileText, PieChart, BarChart3, LineChart, Target } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, TreeMap, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend ,Pie} from 'recharts';

const ModernReportsdashboard = () => {
  const [activeTab, setActiveTab] = useState('financial');
  const [selectedPeriod, setSelectedPeriod] = useState('last30days');
  const [showFilters, setShowFilters] = useState(false);

  // Sample data for Financial Reports
  const revenueData = [
    { month: 'Jan', revenue: 65000, expenses: 45000, profit: 20000 },
    { month: 'Feb', revenue: 72000, expenses: 48000, profit: 24000 },
    { month: 'Mar', revenue: 68000, expenses: 46000, profit: 22000 },
    { month: 'Apr', revenue: 78000, expenses: 52000, profit: 26000 },
    { month: 'May', revenue: 82000, expenses: 55000, profit: 27000 },
    { month: 'Jun', revenue: 88000, expenses: 58000, profit: 30000 },
  ];

  const expenseBreakdown = [
    { category: 'Medicines', amount: 180000, color: '#667eea' },
    { category: 'Staff Salaries', amount: 120000, color: '#764ba2' },
    { category: 'Equipment', amount: 45000, color: '#f093fb' },
    { category: 'Utilities', amount: 25000, color: '#4facfe' },
    { category: 'Marketing', amount: 15000, color: '#43e97b' },
    { category: 'Others', amount: 20000, color: '#38a169' },
  ];

  const departmentRevenue = [
    { name: 'Pharmacy', revenue: 180000, percentage: 45 },
    { name: 'Consultation', revenue: 120000, percentage: 30 },
    { name: 'Laboratory', revenue: 60000, percentage: 15 },
    { name: 'Emergency', revenue: 40000, percentage: 10 },
  ];

  // Sample data for Inventory Reports
  const stockLevels = [
    { medicine: 'Paracetamol', current: 850, minimum: 200, maximum: 1000 },
    { medicine: 'Amoxicillin', current: 450, minimum: 300, maximum: 800 },
    { medicine: 'Ibuprofen', current: 180, minimum: 150, maximum: 600 },
    { medicine: 'Aspirin', current: 320, minimum: 100, maximum: 500 },
    { medicine: 'Metformin', current: 90, minimum: 200, maximum: 400 },
    { medicine: 'Lisinopril', current: 280, minimum: 150, maximum: 350 },
  ];

  const expiryTracking = [
    { month: 'Jan', expiringSoon: 15, expired: 3, total: 1200 },
    { month: 'Feb', expiringSoon: 22, expired: 5, total: 1180 },
    { month: 'Mar', expiringSoon: 18, expired: 8, total: 1165 },
    { month: 'Apr', expiringSoon: 25, expired: 4, total: 1190 },
    { month: 'May', expiringSoon: 20, expired: 6, total: 1175 },
    { month: 'Jun', expiringSoon: 12, expired: 2, total: 1200 },
  ];

  const supplierPerformance = [
    { supplier: 'MediCorp', delivery: 95, quality: 92, price: 85, reliability: 88 },
    { supplier: 'PharmaPlus', delivery: 88, quality: 95, price: 90, reliability: 92 },
    { supplier: 'HealthSupply', delivery: 82, quality: 85, price: 95, reliability: 80 },
  ];

  // Sample data for Clinical Activity Reports
  const patientVisits = [
    { month: 'Jan', newPatients: 145, returning: 380, total: 525 },
    { month: 'Feb', newPatients: 165, returning: 420, total: 585 },
    { month: 'Mar', newPatients: 135, returning: 390, total: 525 },
    { month: 'Apr', newPatients: 180, returning: 450, total: 630 },
    { month: 'May', newPatients: 195, returning: 480, total: 675 },
    { month: 'Jun', newPatients: 210, returning: 520, total: 730 },
  ];

  const prescriptionPatterns = [
    { category: 'Antibiotics', count: 450, color: '#667eea' },
    { category: 'Pain Relievers', count: 380, color: '#764ba2' },
    { category: 'Chronic Disease', count: 320, color: '#f093fb' },
    { category: 'Vitamins', count: 280, color: '#4facfe' },
    { category: 'Emergency', count: 150, color: '#43e97b' },
  ];

  const treatmentOutcomes = [
    { department: 'General', successful: 85, partial: 12, unsuccessful: 3 },
    { department: 'Cardiology', successful: 78, partial: 18, unsuccessful: 4 },
    { department: 'Pediatrics', successful: 92, partial: 6, unsuccessful: 2 },
    { department: 'Emergency', successful: 88, partial: 10, unsuccessful: 2 },
  ];

  // Sample data for Additional Reports
  const medicineUsageVsStock = [
    { usage: 120, stock: 850, medicine: 'Paracetamol' },
    { usage: 85, stock: 450, medicine: 'Amoxicillin' },
    { usage: 95, stock: 180, medicine: 'Ibuprofen' },
    { usage: 60, stock: 320, medicine: 'Aspirin' },
    { usage: 150, stock: 90, medicine: 'Metformin' },
    { usage: 45, stock: 280, medicine: 'Lisinopril' },
  ];

  const staffPerformance = [
    { name: 'Dr. Smith', patients: 156, satisfaction: 94, efficiency: 88 },
    { name: 'Dr. Johnson', patients: 142, satisfaction: 96, efficiency: 92 },
    { name: 'Dr. Wilson', patients: 138, satisfaction: 91, efficiency: 85 },
    { name: 'Dr. Brown', patients: 134, satisfaction: 89, efficiency: 90 },
  ];

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#38a169'];

  const renderFinancialReports = () => (
    <div className="reports-grid">
      {/* Revenue Trends - Line Chart */}
      <div className="report-card large">
        <div className="report-header">
          <h3>Revenue Trends</h3>
          <p>Monthly revenue, expenses, and profit tracking</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#667eea" strokeWidth={3} name="Revenue" />
              <Line type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={3} name="Expenses" />
              <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} name="Profit" />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Breakdown - Pie Chart */}
      <div className="report-card medium">
        <div className="report-header">
          <h3>Expense Breakdown</h3>
          <p>Distribution of operational expenses</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="amount"
                label={({ category, percentage }) => `${category}: ${percentage}%`}
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Revenue - Bar Chart */}
      <div className="report-card medium">
        <div className="report-header">
          <h3>Department Revenue</h3>
          <p>Revenue contribution by department</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={departmentRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="revenue" fill="#667eea" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderInventoryReports = () => (
    <div className="reports-grid">
      {/* Stock Levels - Stacked Bar Chart */}
      <div className="report-card large">
        <div className="report-header">
          <h3>Medicine Stock Levels</h3>
          <p>Current stock vs minimum and maximum thresholds</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockLevels}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="medicine" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="current" fill="#667eea" name="Current Stock" radius={[4, 4, 0, 0]} />
              <Bar dataKey="minimum" fill="#f59e0b" name="Minimum Level" />
              <Bar dataKey="maximum" fill="#10b981" name="Maximum Level" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expiry Tracking - Area Chart */}
      <div className="report-card medium">
        <div className="report-header">
          <h3>Medicine Expiry Tracking</h3>
          <p>Medicines expiring soon and expired items</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={expiryTracking}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Area type="monotone" dataKey="expiringSoon" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
              <Area type="monotone" dataKey="expired" stackId="1" stroke="#ef4444" fill="#ef4444" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Supplier Performance - Radar Chart */}
      <div className="report-card medium">
        <div className="report-header">
          <h3>Supplier Performance</h3>
          <p>Multi-dimensional supplier evaluation</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={[
              { metric: 'Delivery', MediCorp: 95, PharmaPlus: 88, HealthSupply: 82 },
              { metric: 'Quality', MediCorp: 92, PharmaPlus: 95, HealthSupply: 85 },
              { metric: 'Price', MediCorp: 85, PharmaPlus: 90, HealthSupply: 95 },
              { metric: 'Reliability', MediCorp: 88, PharmaPlus: 92, HealthSupply: 80 },
            ]}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="MediCorp" dataKey="MediCorp" stroke="#667eea" fill="#667eea" fillOpacity={0.3} />
              <Radar name="PharmaPlus" dataKey="PharmaPlus" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Radar name="HealthSupply" dataKey="HealthSupply" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Medicine Usage vs Stock - Scatter Plot */}
      <div className="report-card medium">
        <div className="report-header">
          <h3>Usage vs Stock Analysis</h3>
          <p>Medicine usage patterns against stock levels</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart data={medicineUsageVsStock}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" dataKey="usage" name="Usage" stroke="#64748b" />
              <YAxis type="number" dataKey="stock" name="Stock" stroke="#64748b" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [value, name]}
                labelFormatter={(label) => `Medicine: ${medicineUsageVsStock[label]?.medicine || ''}`}
              />
              <Scatter name="Medicines" dataKey="stock" fill="#667eea" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderClinicalReports = () => (
    <div className="reports-grid">
      {/* Patient Visits - Area Chart */}
      <div className="report-card large">
        <div className="report-header">
          <h3>Patient Visit Trends</h3>
          <p>New vs returning patient visits over time</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={patientVisits}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="newPatients" stackId="1" stroke="#667eea" fill="#667eea" name="New Patients" />
              <Area type="monotone" dataKey="returning" stackId="1" stroke="#10b981" fill="#10b981" name="Returning Patients" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Prescription Patterns - Donut Chart */}
      <div className="report-card medium">
        <div className="report-header">
          <h3>Prescription Patterns</h3>
          <p>Distribution of prescriptions by medicine category</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={prescriptionPatterns}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="count"
                label={({ category, count }) => `${category}: ${count}`}
              >
                {prescriptionPatterns.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Prescriptions']} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Treatment Outcomes - Stacked Bar Chart */}
      <div className="report-card medium">
        <div className="report-header">
          <h3>Treatment Outcomes</h3>
          <p>Success rates by department</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={treatmentOutcomes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="department" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="successful" stackId="a" fill="#10b981" name="Successful" />
              <Bar dataKey="partial" stackId="a" fill="#f59e0b" name="Partial Success" />
              <Bar dataKey="unsuccessful" stackId="a" fill="#ef4444" name="Unsuccessful" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Staff Performance - Bar Chart */}
      <div className="report-card medium">
        <div className="report-header">
          <h3>Staff Performance</h3>
          <p>Doctor performance metrics</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={staffPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="satisfaction" fill="#667eea" name="Satisfaction %" />
              <Bar dataKey="efficiency" fill="#10b981" name="Efficiency %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'financial': return <DollarSign size={16} />;
      case 'inventory': return <Package size={16} />;
      case 'clinical': return <Activity size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'financial': return renderFinancialReports();
      case 'inventory': return renderInventoryReports();
      case 'clinical': return renderClinicalReports();
      default: return renderFinancialReports();
    }
  };

  return (
    <div className="reports-container">
      {/* Header */}
      <div className="reports-header">
        <div className="reports-title-section">
          <h2>Analytics & Reports</h2>
          <p>Comprehensive insights and performance metrics</p>
        </div>
        <div className="reports-actions">
          <div className="period-selector">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="period-select"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
              <option value="last6months">Last 6 Months</option>
              <option value="lastyear">Last Year</option>
            </select>
          </div>
          <button className="reports-btn secondary" onClick={() => window.location.reload()}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="reports-btn primary">
            <Download size={16} />
            Export All
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="reports-tabs">
        <button
          className={`reports-tab ${activeTab === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveTab('financial')}
        >
          {getTabIcon('financial')}
          Financial Reports
        </button>
        <button
          className={`reports-tab ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          {getTabIcon('inventory')}
          Inventory Reports
        </button>
        <button
          className={`reports-tab ${activeTab === 'clinical' ? 'active' : ''}`}
          onClick={() => setActiveTab('clinical')}
        >
          {getTabIcon('clinical')}
          Clinical Reports
        </button>
      </div>

      {/* Quick Stats */}
      <div className="reports-stats">
        <div className="reports-stat-card">
          <div className="reports-stat-icon financial">
            <DollarSign size={24} />
          </div>
          <div className="reports-stat-content">
            <h3>$88,000</h3>
            <p>Monthly Revenue</p>
            <span className="stat-change positive">+12.5%</span>
          </div>
        </div>
        <div className="reports-stat-card">
          <div className="reports-stat-icon inventory">
            <Package size={24} />
          </div>
          <div className="reports-stat-content">
            <h3>1,247</h3>
            <p>Items in Stock</p>
            <span className="stat-change negative">-3.2%</span>
          </div>
        </div>
        <div className="reports-stat-card">
          <div className="reports-stat-icon clinical">
            <Users size={24} />
          </div>
          <div className="reports-stat-content">
            <h3>730</h3>
            <p>Patient Visits</p>
            <span className="stat-change positive">+8.1%</span>
          </div>
        </div>
        <div className="reports-stat-card">
          <div className="reports-stat-icon performance">
            <TrendingUp size={24} />
          </div>
          <div className="reports-stat-content">
            <h3>94.2%</h3>
            <p>Success Rate</p>
            <span className="stat-change positive">+2.1%</span>
          </div>
        </div>
      </div>

      {/* Reports Content */}
      <div className="reports-content">
        {getTabContent()}
      </div>

      <style jsx>{`
        .reports-container {
          padding: 24px 32px;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .reports-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .reports-title-section h2 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 600;
          color: #1e293b;
        }

        .reports-title-section p {
          margin: 0;
          color: #64748b;
          font-size: 16px;
        }

        .reports-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .period-selector {
          position: relative;
        }

        .period-select {
          padding: 12px 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .period-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .reports-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          font-size: 14px;
        }

        .reports-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .reports-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .reports-btn.secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #64748b;
          border: 1px solid rgba(226, 232, 240, 0.8);
          backdrop-filter: blur(10px);
        }

        .reports-btn.secondary:hover {
          background: rgba(255, 255, 255, 1);
          border-color: #667eea;
          color: #667eea;
        }

        .reports-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 32px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 4px;
        }

        .reports-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 14px;
        }

        .reports-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .reports-tab:hover:not(.active) {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .reports-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .reports-stat-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: transform 0.2s ease;
        }

        .reports-stat-card:hover {
          transform: translateY(-2px);
        }

        .reports-stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .reports-stat-icon.financial {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .reports-stat-icon.inventory {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .reports-stat-icon.clinical {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .reports-stat-icon.performance {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        .reports-stat-content h3 {
          margin: 0 0 4px 0;
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
        }

        .reports-stat-content p {
          margin: 0 0 4px 0;
          color: #64748b;
          font-size: 14px;
        }

        .stat-change {
          font-size: 12px;
          font-weight: 500;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .stat-change.positive {
          color: #059669;
          background: rgba(16, 185, 129, 0.1);
        }

        .stat-change.negative {
          color: #dc2626;
          background: rgba(239, 68, 68, 0.1);
        }

        .reports-content {
          margin-bottom: 32px;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 24px;
        }

        .report-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 24px;
          transition: transform 0.2s ease;
        }

        .report-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .report-card.large {
          grid-column: span 8;
        }

        .report-card.medium {
          grid-column: span 4;
        }

        .report-header h3 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .report-header p {
          margin: 0 0 20px 0;
          color: #64748b;
          font-size: 14px;
        }

        .chart-container {
          width: 100%;
          height: auto;
        }

        /* Mobile Responsive */
        @media (max-width: 1200px) {
          .report-card.large,
          .report-card.medium {
            grid-column: span 12;
          }
        }

        @media (max-width: 768px) {
          .reports-container {
            padding: 16px;
          }

          .reports-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .reports-actions {
            justify-content: stretch;
          }

          .reports-actions .reports-btn {
            flex: 1;
            justify-content: center;
          }

          .reports-tabs {
            flex-direction: column;
            gap: 4px;
          }

          .reports-tab {
            justify-content: center;
          }

          .reports-stats {
            grid-template-columns: 1fr;
          }

          .reports-grid {
            grid-template-columns: 1fr;
          }

          .report-card.large,
          .report-card.medium {
            grid-column: span 1;
          }

          .chart-container {
            overflow-x: auto;
          }
        }

        @media (max-width: 480px) {
          .reports-stat-card {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }

          .period-select {
            width: 100%;
          }

          .reports-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ModernReportsdashboard;