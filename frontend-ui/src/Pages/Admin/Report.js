import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Download, RefreshCw, Calendar, TrendingUp, Package, Activity, DollarSign, Users, FileText, PieChart, BarChart3, LineChart, Target, AlertTriangle, TrendingDown, Clock, Zap, Heart, Shield, Star, Award, Eye, Settings, Printer, FileSpreadsheet, FileImage } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, Treemap as TreeMap, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, FunnelChart, Funnel, LabelList, RadialBarChart, RadialBar } from 'recharts';

const AdvancedReportsDashboard = () => {
  const [activeTab, setActiveTab] = useState('financial');
  const [selectedPeriod, setSelectedPeriod] = useState('last30days');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({ start: '', end: '' });
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'profit', 'patients']);
  const [viewMode, setViewMode] = useState('charts'); // charts, tables, both

  // Enhanced Financial Data
  const revenueData = [
    { month: 'Jan', revenue: 65000, expenses: 45000, profit: 20000, target: 70000, previousYear: 58000 },
    { month: 'Feb', revenue: 72000, expenses: 48000, profit: 24000, target: 70000, previousYear: 61000 },
    { month: 'Mar', revenue: 68000, expenses: 46000, profit: 22000, target: 70000, previousYear: 65000 },
    { month: 'Apr', revenue: 78000, expenses: 52000, profit: 26000, target: 75000, previousYear: 68000 },
    { month: 'May', revenue: 82000, expenses: 55000, profit: 27000, target: 75000, previousYear: 72000 },
    { month: 'Jun', revenue: 88000, expenses: 58000, profit: 30000, target: 80000, previousYear: 75000 },
  ];

  const cashFlowData = [
    { month: 'Jan', inflow: 65000, outflow: -45000, netFlow: 20000 },
    { month: 'Feb', inflow: 72000, outflow: -48000, netFlow: 24000 },
    { month: 'Mar', inflow: 68000, outflow: -46000, netFlow: 22000 },
    { month: 'Apr', inflow: 78000, outflow: -52000, netFlow: 26000 },
    { month: 'May', inflow: 82000, outflow: -55000, netFlow: 27000 },
    { month: 'Jun', inflow: 88000, outflow: -58000, netFlow: 30000 },
  ];

  const expenseBreakdown = [
    { category: 'Medicines', amount: 180000, percentage: 44, color: '#667eea', budget: 175000 },
    { category: 'Staff Salaries', amount: 120000, percentage: 29, color: '#764ba2', budget: 125000 },
    { category: 'Equipment', amount: 45000, percentage: 11, color: '#f093fb', budget: 50000 },
    { category: 'Utilities', amount: 25000, percentage: 6, color: '#4facfe', budget: 30000 },
    { category: 'Marketing', amount: 15000, percentage: 4, color: '#43e97b', budget: 20000 },
    { category: 'Others', amount: 20000, percentage: 5, color: '#38a169', budget: 25000 },
  ];

  const departmentRevenue = [
    { name: 'Pharmacy', revenue: 180000, percentage: 45, growth: 12.5, target: 200000 },
    { name: 'Consultation', revenue: 120000, percentage: 30, growth: 8.2, target: 140000 },
    { name: 'Laboratory', revenue: 60000, percentage: 15, growth: -2.1, target: 65000 },
    { name: 'Emergency', revenue: 40000, percentage: 10, growth: 15.8, target: 50000 },
  ];

  const profitMarginTrend = [
    { month: 'Jan', grossMargin: 30.8, netMargin: 23.1, operatingMargin: 25.4 },
    { month: 'Feb', grossMargin: 33.3, netMargin: 25.0, operatingMargin: 27.8 },
    { month: 'Mar', grossMargin: 32.4, netMargin: 23.5, operatingMargin: 26.2 },
    { month: 'Apr', grossMargin: 33.3, netMargin: 25.6, operatingMargin: 28.2 },
    { month: 'May', grossMargin: 32.9, netMargin: 24.4, operatingMargin: 27.6 },
    { month: 'Jun', grossMargin: 34.1, netMargin: 26.1, operatingMargin: 29.5 },
  ];

  // Enhanced Inventory Data
  const stockLevels = [
    { medicine: 'Paracetamol', current: 850, minimum: 200, maximum: 1000, reorderLevel: 300, cost: 25.50, status: 'Good' },
    { medicine: 'Amoxicillin', current: 450, minimum: 300, maximum: 800, reorderLevel: 400, cost: 45.00, status: 'Good' },
    { medicine: 'Ibuprofen', current: 180, minimum: 150, maximum: 600, reorderLevel: 200, cost: 18.75, status: 'Low' },
    { medicine: 'Aspirin', current: 320, minimum: 100, maximum: 500, reorderLevel: 150, cost: 12.25, status: 'Good' },
    { medicine: 'Metformin', current: 90, minimum: 200, maximum: 400, reorderLevel: 250, cost: 35.80, status: 'Critical' },
    { medicine: 'Lisinopril', current: 280, minimum: 150, maximum: 350, reorderLevel: 200, cost: 28.90, status: 'Good' },
  ];

  const inventoryTurnover = [
    { category: 'Antibiotics', turnover: 8.5, target: 8.0, efficiency: 'High' },
    { category: 'Pain Relievers', turnover: 12.2, target: 10.0, efficiency: 'Excellent' },
    { category: 'Chronic Meds', turnover: 6.8, target: 7.0, efficiency: 'Good' },
    { category: 'Emergency', turnover: 15.6, target: 12.0, efficiency: 'Excellent' },
    { category: 'Vitamins', turnover: 4.2, target: 5.0, efficiency: 'Poor' },
  ];

  const supplierPerformance = [
    { supplier: 'MediCorp', delivery: 95, quality: 92, price: 85, reliability: 88, orders: 45, rating: 4.6 },
    { supplier: 'PharmaPlus', delivery: 88, quality: 95, price: 90, reliability: 92, orders: 38, rating: 4.8 },
    { supplier: 'HealthSupply', delivery: 82, quality: 85, price: 95, reliability: 80, orders: 25, rating: 4.2 },
    { supplier: 'MedSource', delivery: 90, quality: 88, price: 88, reliability: 85, orders: 32, rating: 4.4 },
  ];

  const abcAnalysis = [
    { category: 'A - High Value', items: 25, percentage: 15, value: 280000, color: '#ef4444' },
    { category: 'B - Medium Value', items: 45, percentage: 27, value: 120000, color: '#f59e0b' },
    { category: 'C - Low Value', items: 95, percentage: 58, value: 35000, color: '#10b981' },
  ];

  // Enhanced Clinical Data
  const patientVisits = [
    { month: 'Jan', newPatients: 145, returning: 380, total: 525, appointments: 580, noShows: 55 },
    { month: 'Feb', newPatients: 165, returning: 420, total: 585, appointments: 640, noShows: 55 },
    { month: 'Mar', newPatients: 135, returning: 390, total: 525, appointments: 580, noShows: 55 },
    { month: 'Apr', newPatients: 180, returning: 450, total: 630, appointments: 690, noShows: 60 },
    { month: 'May', newPatients: 195, returning: 480, total: 675, appointments: 740, noShows: 65 },
    { month: 'Jun', newPatients: 210, returning: 520, total: 730, appointments: 800, noShows: 70 },
  ];

  const patientDemographics = [
    { ageGroup: '0-18', count: 120, percentage: 16.4, color: '#667eea' },
    { ageGroup: '19-35', count: 185, percentage: 25.3, color: '#764ba2' },
    { ageGroup: '36-50', count: 165, percentage: 22.6, color: '#f093fb' },
    { ageGroup: '51-65', count: 145, percentage: 19.9, color: '#4facfe' },
    { ageGroup: '65+', count: 115, percentage: 15.8, color: '#43e97b' },
  ];

  const treatmentOutcomes = [
    { department: 'General', successful: 85, partial: 12, unsuccessful: 3, satisfaction: 4.2 },
    { department: 'Cardiology', successful: 78, partial: 18, unsuccessful: 4, satisfaction: 4.5 },
    { department: 'Pediatrics', successful: 92, partial: 6, unsuccessful: 2, satisfaction: 4.8 },
    { department: 'Emergency', successful: 88, partial: 10, unsuccessful: 2, satisfaction: 4.3 },
    { department: 'Orthopedics', successful: 81, partial: 15, unsuccessful: 4, satisfaction: 4.1 },
  ];

  const staffPerformance = [
    { name: 'Dr. Smith', patients: 156, satisfaction: 94, efficiency: 88, revenue: 45000 },
    { name: 'Dr. Johnson', patients: 142, satisfaction: 96, efficiency: 92, revenue: 48000 },
    { name: 'Dr. Wilson', patients: 138, satisfaction: 91, efficiency: 85, revenue: 42000 },
    { name: 'Dr. Brown', patients: 134, satisfaction: 89, efficiency: 90, revenue: 39000 },
    { name: 'Dr. Davis', patients: 128, satisfaction: 93, efficiency: 87, revenue: 41000 },
  ];

  const patientJourney = [
    { stage: 'Registration', value: 1000, color: '#667eea' },
    { stage: 'Consultation', value: 950, color: '#764ba2' },
    { stage: 'Diagnosis', value: 920, color: '#f093fb' },
    { stage: 'Treatment', value: 900, color: '#4facfe' },
    { stage: 'Follow-up', value: 750, color: '#43e97b' },
    { stage: 'Recovery', value: 680, color: '#38a169' },
  ];

  const diseasePatterns = [
    { disease: 'Hypertension', cases: 245, severity: 'Medium', trend: 'Rising' },
    { disease: 'Diabetes', cases: 198, severity: 'High', trend: 'Stable' },
    { disease: 'Common Cold', cases: 385, severity: 'Low', trend: 'Seasonal' },
    { disease: 'Arthritis', cases: 156, severity: 'Medium', trend: 'Rising' },
    { disease: 'Heart Disease', cases: 89, severity: 'High', trend: 'Declining' },
  ];

  // Operational Data
  const equipmentUtilization = [
    { equipment: 'X-Ray Machine', utilization: 85, downtime: 12, maintenance: 3 },
    { equipment: 'MRI Scanner', utilization: 92, downtime: 5, maintenance: 3 },
    { equipment: 'CT Scanner', utilization: 78, downtime: 18, maintenance: 4 },
    { equipment: 'Ultrasound', utilization: 88, downtime: 8, maintenance: 4 },
  ];

  const kpiData = [
    { name: 'Patient Satisfaction', value: 94, target: 95, unit: '%' },
    { name: 'Bed Occupancy', value: 78, target: 85, unit: '%' },
    { name: 'Average Wait Time', value: 25, target: 20, unit: 'min' },
    { name: 'Treatment Success Rate', value: 87, target: 90, unit: '%' },
  ];

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#38a169', '#ef4444', '#f59e0b'];

  const renderFinancialReports = () => (
    <div className="reports-grid">
      {/* Revenue vs Target - Composed Chart */}
      <div className="report-card xlarge">
        <div className="report-header">
          <div className="report-title">
            <h3>Revenue Performance Analysis</h3>
            <p>Revenue, expenses, profit trends with targets and year-over-year comparison</p>
          </div>
          <div className="report-actions">
            <button className="report-action-btn"><Download size={14} /></button>
            <button className="report-action-btn"><Eye size={14} /></button>
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={revenueData}>
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
              <Bar dataKey="revenue" fill="#667eea" name="Revenue" opacity={0.8} />
              <Bar dataKey="expenses" fill="#f59e0b" name="Expenses" opacity={0.8} />
              <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={3} name="Target" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="previousYear" stroke="#10b981" strokeWidth={2} name="Previous Year" />
              <Line type="monotone" dataKey="profit" stroke="#8b5cf6" strokeWidth={3} name="Profit" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cash Flow - Waterfall Effect */}
      <div className="report-card large">
        <div className="report-header">
          <h3>Cash Flow Analysis</h3>
          <p>Monthly cash inflows and outflows</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={cashFlowData}>
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
              <Bar dataKey="inflow" fill="#10b981" name="Cash Inflow" />
              <Bar dataKey="outflow" fill="#ef4444" name="Cash Outflow" />
              <Line type="monotone" dataKey="netFlow" stroke="#667eea" strokeWidth={3} name="Net Cash Flow" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Breakdown with Budget Comparison */}
      <div className="report-card medium">
        <div className="report-header">
          <h3>Expense vs Budget Analysis</h3>
          <p>Actual expenses compared to budget allocations</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenseBreakdown} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" />
              <YAxis dataKey="category" type="category" stroke="#64748b" width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="amount" fill="#667eea" name="Actual" />
              <Bar dataKey="budget" fill="#e2e8f0" name="Budget" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Profit Margin Trends */}
      <div className="report-card medium">
        <div className="report-header">
          <h3>Profit Margin Analysis</h3>
          <p>Gross, net, and operating margin trends</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={profitMarginTrend}>
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
              <Line type="monotone" dataKey="grossMargin" stroke="#10b981" strokeWidth={3} name="Gross Margin %" />
              <Line type="monotone" dataKey="netMargin" stroke="#667eea" strokeWidth={3} name="Net Margin %" />
              <Line type="monotone" dataKey="operatingMargin" stroke="#f59e0b" strokeWidth={3} name="Operating Margin %" />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Performance */}
      <div className="report-card medium">
        <div className="report-header">
          <h3>Department Performance</h3>
          <p>Revenue and growth by department</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={departmentRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis yAxisId="left" stroke="#64748b" />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" fill="#667eea" name="Revenue" />
              <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#10b981" strokeWidth={3} name="Growth %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="report-card medium">
        <div className="report-header">
          <h3>Financial KPI Dashboard</h3>
          <p>Key performance indicators</p>
        </div>
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon revenue">
              <DollarSign size={20} />
            </div>
            <div className="kpi-content">
              <h4>$88K</h4>
              <p>Monthly Revenue</p>
              <span className="kpi-change positive">+12.5%</span>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon profit">
              <TrendingUp size={20} />
            </div>
            <div className="kpi-content">
              <h4>34.1%</h4>
              <p>Profit Margin</p>
              <span className="kpi-change positive">+2.1%</span>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon cost">
              <Target size={20} />
            </div>
            <div className="kpi-content">
              <h4>$58K</h4>
              <p>Operating Costs</p>
              <span className="kpi-change negative">+5.2%</span>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon efficiency">
              <Award size={20} />
            </div>
            <div className="kpi-content">
              <h4>92.3%</h4>
              <p>Cost Efficiency</p>
              <span className="kpi-change positive">+1.8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventoryReports = () => (
    <div className="reports-grid">
      {/* Stock Status Overview */}
      <div className="report-card xlarge">
        <div className="report-header">
          <h3>Comprehensive Stock Analysis</h3>
          <p>Current stock levels, reorder points, and cost analysis</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={stockLevels}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="medicine" stroke="#64748b" />
              <YAxis yAxisId="left" stroke="#64748b" />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="current" fill="#667eea" name="Current Stock" />
              <Bar yAxisId="left" dataKey="minimum" fill="#f59e0b" name="Minimum Level" />
              <Bar yAxisId="left" dataKey="reorderLevel" fill="#10b981" name="Reorder Level" />
              <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={3} name="Unit Cost ($)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ABC Analysis - TreeMap */}
      <div className="report-card large">
        <div className="report-header">
          <h3>ABC Inventory Analysis</h3>
          <p>Value-based inventory categorization</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <TreeMap
              data={abcAnalysis}
              dataKey="value"
              ratio={4/3}
              stroke="#fff"
              fill="#667eea"
            >
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
            </TreeMap>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inventory Turnover */}
      <div className="report-card medium">
        <div className="report-header">
          <h3>Inventory Turnover Analysis</h3>
          <p>Turnover rates by medicine category</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inventoryTurnover}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="category" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="turnover" fill="#667eea" name="Actual Turnover" />
              <Bar dataKey="target" fill="#e2e8f0" name="Target Turnover" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Supplier Performance Radar */}
      <div className="report-card medium">
        <div className="report-header">
          <h3>Supplier Performance Matrix</h3>
          <p>Multi-dimensional supplier evaluation</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={[
              { metric: 'Delivery', MediCorp: 95, PharmaPlus: 88, HealthSupply: 82, MedSource: 90 },
              { metric: 'Quality', MediCorp: 92, PharmaPlus: 95, HealthSupply: 85, MedSource: 88 },
              { metric: 'Price', MediCorp: 85, PharmaPlus: 90, HealthSupply: 95, MedSource: 88 },
              { metric: 'Reliability', MediCorp: 88, PharmaPlus: 92, HealthSupply: 80, MedSource: 85 },
            ]}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="MediCorp" dataKey="MediCorp" stroke="#667eea" fill="#667eea" fillOpacity={0.3} />
              <Radar name="PharmaPlus" dataKey="PharmaPlus" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Radar name="HealthSupply" dataKey="HealthSupply" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
              <Radar name="MedSource" dataKey="MedSource" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stock Alerts */}
      <div className="report-card medium">
        <div className="report-header">
          <h3>Stock Status Alerts</h3>
          <p>Critical and low stock medicines</p>
        </div>
        <div className="alert-list">
          {stockLevels.filter(item => item.status !== 'Good').map((item, index) => (
            <div key={index} className={`alert-item ${item.status.toLowerCase()}`}>
              <div className="alert-icon">
                {item.status === 'Critical' ? <AlertTriangle size={16} /> : <Clock size={16} />}
              </div>
              <div className="alert-content">
                <h4>{item.medicine}</h4>
                <p>Current: {item.current}, Min: {item.minimum}</p>
                <span className="alert-status">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Utilization */}
      <div className="report-card medium">
        <div className="report-header">
          <h3>Equipment Utilization</h3>
          <p>Equipment usage and downtime analysis</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={equipmentUtilization}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="equipment" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="utilization" fill="#10b981" name="Utilization %" />
              <Bar dataKey="downtime" fill="#ef4444" name="Downtime %" />
              <Bar dataKey="maintenance" fill="#f59e0b" name="Maintenance %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderClinicalReports = () => (
    <div className="reports-grid">
      {/* Patient Journey Funnel */}
      <div className="report-card xlarge">
        <div className="report-header">
          <h3>Patient Journey Analysis</h3>
          <p>Patient flow through treatment stages</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <FunnelChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Funnel
                dataKey="value"
                data={patientJourney}
                isAnimationActive
              >
                <LabelList position="center" fill="#fff" stroke="none" />
                {patientJourney.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Patient Demographics */}
      <div className="report-card large">
        <div className="report-header">
          <h3>Patient Demographics Distribution</h3>
          <p>Age group analysis of patient population</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={patientDemographics}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="count"
                label={({ ageGroup, percentage }) => `${ageGroup}: ${percentage}%`}
              >
                {patientDemographics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Patients']} />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Treatment Outcomes */}
      <div className="report-card medium">
        <div className="report-header">
          <h3>Treatment Success Rates</h3>
          <p>Success rates by department</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
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

      {/* Staff Performance */}
      <div className="report-card medium">
        <div className="report-header">
          <h3>Staff Performance Matrix</h3>
          <p>Doctor performance and patient satisfaction</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={staffPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" dataKey="satisfaction" name="Satisfaction" unit="%" stroke="#64748b" />
              <YAxis type="number" dataKey="efficiency" name="Efficiency" unit="%" stroke="#64748b" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [value + '%', name]}
                labelFormatter={(label) => `Dr. ${staffPerformance[label]?.name || ''}`}
              />
              <Scatter name="Doctors" dataKey="efficiency" fill="#667eea" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Disease Pattern Analysis */}
      <div className="report-card medium">
        <div className="report-header">
          <h3>Disease Pattern Trends</h3>
          <p>Common diseases and their trends</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={diseasePatterns} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" />
              <YAxis dataKey="disease" type="category" stroke="#64748b" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="cases" fill="#667eea" name="Cases" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* KPI Gauge Charts */}
      <div className="report-card medium">
        <div className="report-header">
          <h3>Clinical KPI Dashboard</h3>
          <p>Key performance indicators</p>
        </div>
        <div className="kpi-gauges">
          {kpiData.map((kpi, index) => (
            <div key={index} className="gauge-container">
              <ResponsiveContainer width="100%" height={120}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="90%"
                  data={[{ name: kpi.name, value: kpi.value, target: kpi.target }]}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill={kpi.value >= kpi.target ? '#10b981' : '#f59e0b'}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="gauge-label">
                <h4>{kpi.value}{kpi.unit}</h4>
                <p>{kpi.name}</p>
                <span className={kpi.value >= kpi.target ? 'positive' : 'negative'}>
                  Target: {kpi.target}{kpi.unit}
                </span>
              </div>
            </div>
          ))}
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
      {/* Enhanced Header */}
      <div className="reports-header">
        <div className="reports-title-section">
          <h2>Advanced Analytics & Reports</h2>
          <p>Comprehensive insights, forecasting, and performance metrics</p>
        </div>
        <div className="reports-actions">
          <div className="date-range-selector">
            <input
              type="date"
              value={selectedDateRange.start}
              onChange={(e) => setSelectedDateRange({...selectedDateRange, start: e.target.value})}
              className="date-input"
            />
            <span>to</span>
            <input
              type="date"
              value={selectedDateRange.end}
              onChange={(e) => setSelectedDateRange({...selectedDateRange, end: e.target.value})}
              className="date-input"
            />
          </div>
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
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'charts' ? 'active' : ''}`}
              onClick={() => setViewMode('charts')}
            >
              <BarChart3 size={16} />
            </button>
            <button
              className={`view-btn ${viewMode === 'tables' ? 'active' : ''}`}
              onClick={() => setViewMode('tables')}
            >
              <FileText size={16} />
            </button>
          </div>
          <div className="export-controls">
            <button className="reports-btn secondary">
              <Printer size={16} />
              Print
            </button>
            <button className="reports-btn secondary">
              <FileSpreadsheet size={16} />
              Excel
            </button>
            <button className="reports-btn secondary">
              <FileImage size={16} />
              PDF
            </button>
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

      {/* Enhanced Tab Navigation */}
      <div className="reports-tabs">
        <button
          className={`reports-tab ${activeTab === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveTab('financial')}
        >
          {getTabIcon('financial')}
          Financial Analytics
          <span className="tab-badge">6 Reports</span>
        </button>
        <button
          className={`reports-tab ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          {getTabIcon('inventory')}
          Inventory Intelligence
          <span className="tab-badge">6 Reports</span>
        </button>
        <button
          className={`reports-tab ${activeTab === 'clinical' ? 'active' : ''}`}
          onClick={() => setActiveTab('clinical')}
        >
          {getTabIcon('clinical')}
          Clinical Insights
          <span className="tab-badge">6 Reports</span>
        </button>
      </div>

      {/* Enhanced Quick Stats */}
      <div className="reports-stats">
        <div className="reports-stat-card">
          <div className="reports-stat-icon financial">
            <DollarSign size={24} />
          </div>
          <div className="reports-stat-content">
            <h3>$88,000</h3>
            <p>Monthly Revenue</p>
            <span className="stat-change positive">+12.5%</span>
            <div className="stat-progress">
              <div className="progress-bar" style={{width: '78%'}}></div>
            </div>
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
            <div className="stat-progress">
              <div className="progress-bar warning" style={{width: '65%'}}></div>
            </div>
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
            <div className="stat-progress">
              <div className="progress-bar" style={{width: '82%'}}></div>
            </div>
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
            <div className="stat-progress">
              <div className="progress-bar success" style={{width: '94%'}}></div>
            </div>
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
          flex-wrap: wrap;
          gap: 16px;
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
          flex-wrap: wrap;
        }

        .date-range-selector {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .date-input {
          border: none;
          background: transparent;
          color: #374151;
          font-size: 14px;
        }

        .date-input:focus {
          outline: none;
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

        .view-controls {
          display: flex;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .view-btn {
          padding: 12px;
          border: none;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-btn.active {
          background: #667eea;
          color: white;
        }

        .export-controls {
          display: flex;
          gap: 8px;
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
          white-space: nowrap;
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
          position: relative;
        }

        .tab-badge {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }

        .reports-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .reports-tab.active .tab-badge {
          background: rgba(255, 255, 255, 0.2);
          color: white;
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
          position: relative;
          overflow: hidden;
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
          flex-shrink: 0;
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

        .reports-stat-content {
          flex: 1;
        }

        .reports-stat-content h3 {
          margin: 0 0 4px 0;
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
        }

        .reports-stat-content p {
          margin: 0 0 8px 0;
          color: #64748b;
          font-size: 14px;
        }

        .stat-change {
          font-size: 12px;
          font-weight: 500;
          padding: 2px 6px;
          border-radius: 4px;
          margin-bottom: 8px;
          display: inline-block;
        }

        .stat-change.positive {
          color: #059669;
          background: rgba(16, 185, 129, 0.1);
        }

        .stat-change.negative {
          color: #dc2626;
          background: rgba(239, 68, 68, 0.1);
        }

        .stat-progress {
          width: 100%;
          height: 4px;
          background: rgba(226, 232, 240, 0.5);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #059669);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .progress-bar.warning {
          background: linear-gradient(90deg, #f59e0b, #d97706);
        }

        .progress-bar.success {
          background: linear-gradient(90deg, #10b981, #059669);
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
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .report-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .report-card.xlarge {
          grid-column: span 12;
        }

        .report-card.large {
          grid-column: span 8;
        }

        .report-card.medium {
          grid-column: span 4;
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .report-title h3 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .report-title p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .report-actions {
          display: flex;
          gap: 8px;
        }

        .report-action-btn {
          width: 32px;
          height: 32px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          background: rgba(255, 255, 255, 0.8);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s ease;
        }

        .report-action-btn:hover {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .chart-container {
          width: 100%;
          height: auto;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .kpi-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .kpi-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .kpi-icon.revenue {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .kpi-icon.profit {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .kpi-icon.cost {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .kpi-icon.efficiency {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        .kpi-content h4 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .kpi-content p {
          margin: 0 0 4px 0;
          font-size: 12px;
          color: #64748b;
        }

        .kpi-change {
          font-size: 11px;
          font-weight: 500;
          padding: 2px 4px;
          border-radius: 3px;
        }

        .kpi-change.positive {
          color: #059669;
          background: rgba(16, 185, 129, 0.1);
        }

        .kpi-change.negative {
          color: #dc2626;
          background: rgba(239, 68, 68, 0.1);
        }

        .alert-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .alert-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid;
          background: rgba(255, 255, 255, 0.8);
        }

        .alert-item.critical {
          border-color: rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.05);
        }

        .alert-item.low {
          border-color: rgba(245, 158, 11, 0.3);
          background: rgba(245, 158, 11, 0.05);
        }

        .alert-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .alert-item.critical .alert-icon {
          background: #ef4444;
        }

        .alert-item.low .alert-icon {
          background: #f59e0b;
        }

        .alert-content h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .alert-content p {
          margin: 0 0 4px 0;
          font-size: 12px;
          color: #64748b;
        }

        .alert-status {
          font-size: 11px;
          font-weight: 500;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .alert-item.critical .alert-status {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .alert-item.low .alert-status {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .kpi-gauges {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }

        .gauge-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .gauge-label h4 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .gauge-label p {
          margin: 0 0 4px 0;
          font-size: 12px;
          color: #64748b;
        }

        .gauge-label span {
          font-size: 11px;
          font-weight: 500;
          padding: 2px 4px;
          border-radius: 3px;
        }

        .gauge-label span.positive {
          color: #059669;
          background: rgba(16, 185, 129, 0.1);
        }

        .gauge-label span.negative {
          color: #dc2626;
          background: rgba(239, 68, 68, 0.1);
        }

        /* Mobile Responsive */
        @media (max-width: 1200px) {
          .report-card.xlarge,
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
            align-items: stretch;
          }

          .reports-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .reports-actions > * {
            width: 100%;
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

          .report-card.xlarge,
          .report-card.large,
          .report-card.medium {
            grid-column: span 1;
          }

          .chart-container {
            overflow-x: auto;
          }

          .kpi-grid {
            grid-template-columns: 1fr;
          }

          .kpi-gauges {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .reports-stat-card {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }

          .report-header {
            flex-direction: column;
            gap: 12px;
          }

          .report-actions {
            align-self: stretch;
            justify-content: center;
          }

          .kpi-gauges {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdvancedReportsDashboard;