import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Download, RefreshCw, Calendar, TrendingUp, Package, Activity, DollarSign, Users, FileText, PieChart, BarChart3, LineChart, Target, AlertTriangle, TrendingDown, Clock, Zap, Heart, Shield, Star, Award, Eye, Settings, Printer, FileSpreadsheet, FileImage, Plus, Minus, Move, Maximize, Minimize, RotateCcw, Save, Upload, Grid, Layout, Palette, Edit3, Copy, Trash2, X, Sun, Moon, Droplets, Sparkles } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, RadialBarChart, RadialBar } from 'recharts';

const CustomizableDashboard = () => {
  const [dashboardMode, setDashboardMode] = useState('view'); // view, edit, design
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState(null);
  const [dashboardTitle, setDashboardTitle] = useState('Custom Dashboard');
  const [gridSize, setGridSize] = useState(12);
  const [showGridLines, setShowGridLines] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  // Design settings state
  const [designSettings, setDesignSettings] = useState({
    theme: 'light', // light, dark, auto
    colorScheme: 'blue', // blue, purple, green, orange, red
    backgroundType: 'gradient', // gradient, solid, pattern, image
    backgroundImage: '',
    spacing: 'normal', // compact, normal, spacious
    borderRadius: 'normal', // sharp, normal, rounded
    shadows: 'normal', // none, subtle, normal, strong
    animations: true,
    glassmorphism: true,
    customColors: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#1e293b'
    }
  });

  // Color schemes
  const colorSchemes = {
    blue: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#4facfe',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    purple: {
      primary: '#a855f7',
      secondary: '#7c3aed',
      accent: '#c4b5fd',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)'
    },
    green: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#6ee7b7',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    orange: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fbbf24',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
    red: {
      primary: '#ef4444',
      secondary: '#dc2626',
      accent: '#fca5a5',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    }
  };

  // Background patterns
  const backgroundPatterns = {
    dots: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 1px, transparent 1px)',
    grid: 'linear-gradient(rgba(102, 126, 234, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(102, 126, 234, 0.05) 1px, transparent 1px)',
    diagonal: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(102, 126, 234, 0.05) 10px, rgba(102, 126, 234, 0.05) 20px)',
    wave: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23667eea" fill-opacity="0.05"%3E%3Cpath d="M30 30c0-16.569 13.431-30 30-30v60c-16.569 0-30-13.431-30-30z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
  };

  // Sample data
  const sampleData = {
    revenue: [
      { month: 'Jan', revenue: 65000, expenses: 45000, profit: 20000 },
      { month: 'Feb', revenue: 72000, expenses: 48000, profit: 24000 },
      { month: 'Mar', revenue: 68000, expenses: 46000, profit: 22000 },
      { month: 'Apr', revenue: 78000, expenses: 52000, profit: 26000 },
      { month: 'May', revenue: 82000, expenses: 55000, profit: 27000 },
      { month: 'Jun', revenue: 88000, expenses: 58000, profit: 30000 },
    ],
    patientDemographics: [
      { ageGroup: '0-18', count: 120, percentage: 16.4, color: '#667eea' },
      { ageGroup: '19-35', count: 185, percentage: 25.3, color: '#764ba2' },
      { ageGroup: '36-50', count: 165, percentage: 22.6, color: '#f093fb' },
      { ageGroup: '51-65', count: 145, percentage: 19.9, color: '#4facfe' },
      { ageGroup: '65+', count: 115, percentage: 15.8, color: '#43e97b' },
    ],
    stockLevels: [
      { medicine: 'Paracetamol', current: 850, minimum: 200, status: 'Good' },
      { medicine: 'Amoxicillin', current: 450, minimum: 300, status: 'Good' },
      { medicine: 'Ibuprofen', current: 180, minimum: 150, status: 'Low' },
      { medicine: 'Metformin', current: 90, minimum: 200, status: 'Critical' },
    ]
  };

  // Widget templates
  const widgetTemplates = [
    {
      type: 'kpi-card',
      name: 'KPI Card',
      icon: <Target size={16} />,
      description: 'Display key metrics with trend indicators',
      defaultSize: { width: 3, height: 2 }
    },
    {
      type: 'line-chart',
      name: 'Line Chart',
      icon: <LineChart size={16} />,
      description: 'Show trends over time',
      defaultSize: { width: 6, height: 4 }
    },
    {
      type: 'bar-chart',
      name: 'Bar Chart',
      icon: <BarChart3 size={16} />,
      description: 'Compare values across categories',
      defaultSize: { width: 6, height: 4 }
    },
    {
      type: 'pie-chart',
      name: 'Pie Chart',
      icon: <PieChart size={16} />,
      description: 'Show proportional data',
      defaultSize: { width: 4, height: 4 }
    },
    {
      type: 'area-chart',
      name: 'Area Chart',
      icon: <Activity size={16} />,
      description: 'Display data with filled areas',
      defaultSize: { width: 6, height: 4 }
    },
    {
      type: 'gauge-chart',
      name: 'Gauge Chart',
      icon: <Zap size={16} />,
      description: 'Show progress towards targets',
      defaultSize: { width: 3, height: 3 }
    },
    {
      type: 'table',
      name: 'Data Table',
      icon: <FileText size={16} />,
      description: 'Display structured data',
      defaultSize: { width: 6, height: 4 }
    },
    {
      type: 'alert-list',
      name: 'Alert List',
      icon: <AlertTriangle size={16} />,
      description: 'Show important notifications',
      defaultSize: { width: 4, height: 3 }
    }
  ];

  // Dashboard templates
  const dashboardTemplates = [
    {
      name: 'Executive Overview',
      description: 'High-level KPIs and trends for executives',
      widgets: [
        { type: 'kpi-card', title: 'Total Revenue', position: { x: 0, y: 0 }, size: { width: 3, height: 2 } },
        { type: 'kpi-card', title: 'Patient Count', position: { x: 3, y: 0 }, size: { width: 3, height: 2 } },
        { type: 'line-chart', title: 'Revenue Trend', position: { x: 0, y: 2 }, size: { width: 8, height: 4 } },
        { type: 'pie-chart', title: 'Department Revenue', position: { x: 8, y: 2 }, size: { width: 4, height: 4 } }
      ]
    },
    {
      name: 'Clinical Dashboard',
      description: 'Patient care and clinical metrics',
      widgets: [
        { type: 'kpi-card', title: 'Patient Visits', position: { x: 0, y: 0 }, size: { width: 3, height: 2 } },
        { type: 'pie-chart', title: 'Patient Demographics', position: { x: 6, y: 0 }, size: { width: 6, height: 4 } },
        { type: 'bar-chart', title: 'Treatment Outcomes', position: { x: 0, y: 2 }, size: { width: 6, height: 4 } }
      ]
    }
  ];

  // Default dashboard layout
  const [widgets, setWidgets] = useState([
    {
      id: 'revenue-chart',
      type: 'line-chart',
      title: 'Revenue Trend',
      position: { x: 0, y: 0 },
      size: { width: 6, height: 4 },
      data: sampleData.revenue,
      config: {
        dataKey: 'revenue',
        stroke: '#667eea',
        showGrid: true,
        showLegend: true
      }
    },
    {
      id: 'kpi-revenue',
      type: 'kpi-card',
      title: 'Monthly Revenue',
      position: { x: 6, y: 0 },
      size: { width: 3, height: 2 },
      data: { value: 88000, change: 12.5, target: 90000 },
      config: {
        icon: 'dollar-sign',
        color: '#667eea',
        format: 'currency'
      }
    },
    {
      id: 'kpi-patients',
      type: 'kpi-card',
      title: 'Patient Visits',
      position: { x: 9, y: 0 },
      size: { width: 3, height: 2 },
      data: { value: 730, change: 8.1, target: 800 },
      config: {
        icon: 'users',
        color: '#10b981',
        format: 'number'
      }
    },
    {
      id: 'patient-demographics',
      type: 'pie-chart',
      title: 'Patient Demographics',
      position: { x: 6, y: 2 },
      size: { width: 6, height: 4 },
      data: sampleData.patientDemographics,
      config: {
        dataKey: 'count',
        showLegend: true,
        showLabels: true
      }
    },
    {
      id: 'stock-alerts',
      type: 'alert-list',
      title: 'Stock Alerts',
      position: { x: 0, y: 4 },
      size: { width: 6, height: 3 },
      data: sampleData.stockLevels.filter(item => item.status !== 'Good'),
      config: {
        showStatus: true,
        maxItems: 5
      }
    }
  ]);

  // Get current theme styles
  const getThemeStyles = () => {
    const scheme = colorSchemes[designSettings.colorScheme] || colorSchemes.blue;
    const isDark = designSettings.theme === 'dark' ||
      (designSettings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return {
      ...scheme,
      isDark,
      background: isDark ? '#0f172a' : '#f8fafc',
      surface: isDark ? '#1e293b' : '#ffffff',
      text: isDark ? '#f1f5f9' : '#1e293b',
      textSecondary: isDark ? '#94a3b8' : '#64748b',
      border: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(226, 232, 240, 0.8)',
      glassBg: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)'
    };
  };

  const themeStyles = getThemeStyles();

  // Get background style
  const getBackgroundStyle = () => {
    const baseGradient = designSettings.theme === 'dark'
      ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';

    switch (designSettings.backgroundType) {
      case 'solid':
        return { background: themeStyles.background };
      case 'pattern':
        return {
          background: baseGradient,
          backgroundImage: backgroundPatterns.dots,
          backgroundSize: '20px 20px'
        };
      case 'image':
        return designSettings.backgroundImage ? {
          backgroundImage: `url(${designSettings.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        } : { background: baseGradient };
      default:
        return { background: baseGradient };
    }
  };

  // Apply design settings to widgets
  const applyDesignToWidgets = () => {
    setWidgets(prev => prev.map(widget => ({
      ...widget,
      config: {
        ...widget.config,
        stroke: widget.config.stroke ? themeStyles.primary : widget.config.stroke,
        fill: widget.config.fill ? themeStyles.primary : widget.config.fill,
        color: widget.config.color === '#667eea' ? themeStyles.primary : widget.config.color
      }
    })));
  };

  // Update widgets when design changes
  useEffect(() => {
    applyDesignToWidgets();
  }, [designSettings.colorScheme]);

  // Handle drag and drop
  const [dropPreview, setDropPreview] = useState(null);

  const handleDragStart = (e, widget) => {
    setDraggedWidget(widget);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (dashboardMode === 'edit' && draggedWidget) {
      const gridRect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - gridRect.left;
      const y = e.clientY - gridRect.top;

      const cellWidth = gridRect.width / gridSize;
      const cellHeight = gridRect.height / 10;

      const gridX = Math.floor(x / cellWidth);
      const gridY = Math.floor(y / cellHeight);

      const clampedX = Math.max(0, Math.min(gridX, gridSize - draggedWidget.size.width));
      const clampedY = Math.max(0, Math.min(gridY, 10 - draggedWidget.size.height));

      setDropPreview({ x: clampedX, y: clampedY });
    }
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDropPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedWidget || !dropPreview) return;

    if (dashboardMode === 'edit') {
      const wouldCollide = widgets.some(widget => {
        if (widget.id === draggedWidget.id) return false;

        const widgetEndX = widget.position.x + widget.size.width;
        const widgetEndY = widget.position.y + widget.size.height;
        const draggedEndX = dropPreview.x + draggedWidget.size.width;
        const draggedEndY = dropPreview.y + draggedWidget.size.height;

        return !(dropPreview.x >= widgetEndX ||
                draggedEndX <= widget.position.x ||
                dropPreview.y >= widgetEndY ||
                draggedEndY <= widget.position.y);
      });

      if (!wouldCollide) {
        setWidgets(prev => prev.map(widget =>
          widget.id === draggedWidget.id
            ? { ...widget, position: dropPreview }
            : widget
        ));
      }
    }

    setDraggedWidget(null);
    setDropPreview(null);
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
    setDropPreview(null);
  };

  // Add new widget
  const addWidget = (template) => {
    const position = findAvailablePosition(template.defaultSize);

    const newWidget = {
      id: `widget-${Date.now()}`,
      type: template.type,
      title: template.name,
      position: position,
      size: template.defaultSize,
      data: getSampleDataForType(template.type),
      config: getDefaultConfigForType(template.type)
    };

    setWidgets(prev => [...prev, newWidget]);
    setShowWidgetLibrary(false);
  };

  // Find available position for new widget
  const findAvailablePosition = (size) => {
    for (let y = 0; y <= 10 - size.height; y++) {
      for (let x = 0; x <= gridSize - size.width; x++) {
        const wouldCollide = widgets.some(widget => {
          const widgetEndX = widget.position.x + widget.size.width;
          const widgetEndY = widget.position.y + widget.size.height;
          const newEndX = x + size.width;
          const newEndY = y + size.height;

          return !(x >= widgetEndX || newEndX <= widget.position.x ||
                  y >= widgetEndY || newEndY <= widget.position.y);
        });

        if (!wouldCollide) {
          return { x, y };
        }
      }
    }
    return { x: 0, y: 0 };
  };

  // Get sample data based on widget type
  const getSampleDataForType = (type) => {
    switch (type) {
      case 'line-chart':
      case 'area-chart':
      case 'bar-chart':
        return sampleData.revenue;
      case 'pie-chart':
        return sampleData.patientDemographics;
      case 'kpi-card':
        return { value: 1250, change: 5.2, target: 1500 };
      case 'alert-list':
        return sampleData.stockLevels.filter(item => item.status !== 'Good');
      case 'gauge-chart':
        return { value: 85, max: 100, target: 90 };
      default:
        return [];
    }
  };

  // Get default config based on widget type
  const getDefaultConfigForType = (type) => {
    switch (type) {
      case 'line-chart':
        return { dataKey: 'revenue', stroke: themeStyles.primary, showGrid: true };
      case 'bar-chart':
        return { dataKey: 'revenue', fill: themeStyles.primary, showGrid: true };
      case 'pie-chart':
        return { dataKey: 'count', showLegend: true };
      case 'kpi-card':
        return { icon: 'activity', color: themeStyles.primary, format: 'number' };
      default:
        return {};
    }
  };

  // Apply template
  const applyTemplate = (template) => {
    const newWidgets = template.widgets.map((widgetTemplate, index) => ({
      id: `widget-${Date.now()}-${index}`,
      type: widgetTemplate.type,
      title: widgetTemplate.title,
      position: widgetTemplate.position,
      size: widgetTemplate.size,
      data: getSampleDataForType(widgetTemplate.type),
      config: getDefaultConfigForType(widgetTemplate.type)
    }));

    setWidgets(newWidgets);
    setDashboardTitle(template.name);
    setShowTemplates(false);
  };

  // Render widgets
  const renderWidget = (widget) => {
    const isSelected = selectedWidget?.id === widget.id;
    const isDragging = draggedWidget?.id === widget.id;

    return (
      <div
        key={widget.id}
        className={`dashboard-widget ${isSelected ? 'selected' : ''} ${dashboardMode === 'edit' ? 'editable' : ''} ${isDragging ? 'dragging' : ''}`}
        style={{
          gridColumn: `${widget.position.x + 1} / span ${widget.size.width}`,
          gridRow: `${widget.position.y + 1} / span ${widget.size.height}`,
        }}
        draggable={dashboardMode === 'edit'}
        onDragStart={(e) => handleDragStart(e, widget)}
        onDragEnd={handleDragEnd}
        onClick={() => dashboardMode === 'edit' && setSelectedWidget(widget)}
      >
        {dashboardMode === 'edit' && (
          <div className="widget-controls">
            <button
              className="widget-control-btn"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Maximize size={12} />
            </button>
            <button
              className="widget-control-btn"
              onClick={(e) => {
                e.stopPropagation();
                setWidgets(prev => prev.filter(w => w.id !== widget.id));
              }}
            >
              <X size={12} />
            </button>
          </div>
        )}

        <div className="widget-header">
          <h3>{widget.title}</h3>
          {dashboardMode === 'edit' && (
            <Move size={14} className="drag-handle" />
          )}
        </div>

        <div className="widget-content">
          {renderWidgetContent(widget)}
        </div>
      </div>
    );
  };

  // Render widget content
  const renderWidgetContent = (widget) => {
    switch (widget.type) {
      case 'kpi-card':
        return (
          <div className="kpi-widget">
            <div className="kpi-icon">
              {getIconForType(widget.config.icon)}
            </div>
            <div className="kpi-content">
              <h2>{formatValue(widget.data.value, widget.config.format)}</h2>
              <p className={`kpi-change ${widget.data.change >= 0 ? 'positive' : 'negative'}`}>
                {widget.data.change >= 0 ? '+' : ''}{widget.data.change}%
              </p>
              <div className="kpi-progress">
                <div
                  className="progress-bar"
                  style={{
                    width: `${(widget.data.value / widget.data.target) * 100}%`,
                    backgroundColor: widget.config.color
                  }}
                />
              </div>
            </div>
          </div>
        );

      case 'line-chart':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={widget.data}>
              <CartesianGrid strokeDasharray="3 3" stroke={themeStyles.border} />
              <XAxis dataKey="month" stroke={themeStyles.textSecondary} />
              <YAxis stroke={themeStyles.textSecondary} />
              <Tooltip
                contentStyle={{
                  backgroundColor: themeStyles.surface,
                  border: `1px solid ${themeStyles.border}`,
                  borderRadius: '8px',
                  color: themeStyles.text
                }}
              />
              <Line
                type="monotone"
                dataKey={widget.config.dataKey}
                stroke={widget.config.stroke}
                strokeWidth={2}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        );

      case 'bar-chart':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={widget.data}>
              <CartesianGrid strokeDasharray="3 3" stroke={themeStyles.border} />
              <XAxis dataKey="month" stroke={themeStyles.textSecondary} />
              <YAxis stroke={themeStyles.textSecondary} />
              <Tooltip
                contentStyle={{
                  backgroundColor: themeStyles.surface,
                  border: `1px solid ${themeStyles.border}`,
                  borderRadius: '8px',
                  color: themeStyles.text
                }}
              />
              <Bar dataKey={widget.config.dataKey} fill={widget.config.fill} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie-chart':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={widget.data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey={widget.config.dataKey}
                label={({ ageGroup, percentage }) => `${ageGroup}: ${percentage}%`}
              >
                {widget.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: themeStyles.surface,
                  border: `1px solid ${themeStyles.border}`,
                  borderRadius: '8px',
                  color: themeStyles.text
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        );

      case 'area-chart':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={widget.data}>
              <CartesianGrid strokeDasharray="3 3" stroke={themeStyles.border} />
              <XAxis dataKey="month" stroke={themeStyles.textSecondary} />
              <YAxis stroke={themeStyles.textSecondary} />
              <Tooltip
                contentStyle={{
                  backgroundColor: themeStyles.surface,
                  border: `1px solid ${themeStyles.border}`,
                  borderRadius: '8px',
                  color: themeStyles.text
                }}
              />
              <Area
                type="monotone"
                dataKey={widget.config.dataKey}
                stroke={widget.config.stroke}
                fill={widget.config.stroke}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'gauge-chart':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="90%"
              data={[widget.data]}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={10}
                fill={widget.config.color || themeStyles.primary}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        );

      case 'alert-list':
        return (
          <div className="alert-widget">
            {widget.data.slice(0, widget.config.maxItems || 5).map((alert, index) => (
              <div key={index} className={`alert-item ${alert.status.toLowerCase()}`}>
                <AlertTriangle size={16} />
                <div className="alert-content">
                  <h4>{alert.medicine}</h4>
                  <p>Current: {alert.current}, Min: {alert.minimum}</p>
                  <span className="alert-status">{alert.status}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'table':
        return (
          <div className="table-widget">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {widget.data.slice(0, 5).map((item, index) => (
                  <tr key={index}>
                    <td>{item.medicine || item.month || 'Item'}</td>
                    <td>{item.current || item.revenue || item.count || 'N/A'}</td>
                    <td>{item.status || 'Good'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return <div className="widget-placeholder">Widget content not available</div>;
    }
  };

  // Helper functions
  const getIconForType = (iconType) => {
    const icons = {
      'dollar-sign': <DollarSign size={20} />,
      'users': <Users size={20} />,
      'activity': <Activity size={20} />,
      'package': <Package size={20} />,
      'target': <Target size={20} />,
      'trending-up': <TrendingUp size={20} />
    };
    return icons[iconType] || <Activity size={20} />;
  };

  const formatValue = (value, format) => {
    switch (format) {
      case 'currency':
        return `$${(value / 1000).toFixed(0)}K`;
      case 'percentage':
        return `${value}%`;
      default:
        return value.toLocaleString();
    }
  };

  return (
    <div className="dashboard-container" style={getBackgroundStyle()}>
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h2>{dashboardTitle}</h2>
          <div className="dashboard-mode-switch">
            <button
              className={`mode-btn ${dashboardMode === 'view' ? 'active' : ''}`}
              onClick={() => setDashboardMode('view')}
            >
              <Eye size={16} />
              View
            </button>
            <button
              className={`mode-btn ${dashboardMode === 'edit' ? 'active' : ''}`}
              onClick={() => setDashboardMode('edit')}
            >
              <Edit3 size={16} />
              Edit
            </button>
            <button
              className={`mode-btn ${dashboardMode === 'design' ? 'active' : ''}`}
              onClick={() => setDashboardMode('design')}
            >
              <Palette size={16} />
              Design
            </button>
          </div>
        </div>

        <div className="dashboard-actions">
          {dashboardMode === 'edit' && (
            <>
              <button
                className="dashboard-btn secondary"
                onClick={() => setShowWidgetLibrary(true)}
              >
                <Plus size={16} />
                Add Widget
              </button>
              <button
                className="dashboard-btn secondary"
                onClick={() => setShowTemplates(true)}
              >
                <Layout size={16} />
                Templates
              </button>
              <button
                className="dashboard-btn secondary"
                onClick={() => setShowGridLines(!showGridLines)}
              >
                <Grid size={16} />
                Grid {showGridLines ? 'Off' : 'On'}
              </button>
            </>
          )}
          <button className="dashboard-btn secondary">
            <Save size={16} />
            Save
          </button>
          <button className="dashboard-btn secondary">
            <Upload size={16} />
            Export
          </button>
          <button className="dashboard-btn primary">
            <RefreshCw size={16} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-workspace">
        <div
          className={`dashboard-grid ${showGridLines && dashboardMode === 'edit' ? 'show-grid' : ''}`}
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: 'repeat(10, 1fr)'
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Drop Preview */}
          {dropPreview && draggedWidget && dashboardMode === 'edit' && (
            <div
              className="drop-preview"
              style={{
                gridColumn: `${dropPreview.x + 1} / span ${draggedWidget.size.width}`,
                gridRow: `${dropPreview.y + 1} / span ${draggedWidget.size.height}`,
              }}
            />
          )}

          {/* Widgets */}
          {widgets.map(renderWidget)}
        </div>
      </div>

      {/* Widget Library Modal */}
      {showWidgetLibrary && (
        <>
          <div className="modal-backdrop" onClick={() => setShowWidgetLibrary(false)} />
          <div className="widget-library-modal">
            <div className="modal-header">
              <h3>Widget Library</h3>
              <button onClick={() => setShowWidgetLibrary(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="widget-library-grid">
              {widgetTemplates.map((template, index) => (
                <div
                  key={index}
                  className="widget-template"
                  onClick={() => addWidget(template)}
                >
                  <div className="template-icon">
                    {template.icon}
                  </div>
                  <div className="template-info">
                    <h4>{template.name}</h4>
                    <p>{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <>
          <div className="modal-backdrop" onClick={() => setShowTemplates(false)} />
          <div className="templates-modal">
            <div className="modal-header">
              <h3>Dashboard Templates</h3>
              <button onClick={() => setShowTemplates(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="templates-grid">
              {dashboardTemplates.map((template, index) => (
                <div
                  key={index}
                  className="template-card"
                  onClick={() => applyTemplate(template)}
                >
                  <h4>{template.name}</h4>
                  <p>{template.description}</p>
                  <div className="template-widgets">
                    {template.widgets.length} widgets
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Design Panel */}
      {dashboardMode === 'design' && (
        <div className="design-panel">
          <div className="design-header">
            <h3>Design Settings</h3>
            <button onClick={() => setDashboardMode('view')}>
              <X size={16} />
            </button>
          </div>

          <div className="design-content">
            {/* Theme Section */}
            <div className="design-section">
              <h4>Theme</h4>
              <div className="theme-options">
                {['light', 'dark', 'auto'].map(theme => (
                  <button
                    key={theme}
                    className={`theme-btn ${designSettings.theme === theme ? 'active' : ''}`}
                    onClick={() => setDesignSettings(prev => ({ ...prev, theme }))}
                  >
                    {theme === 'light' && <Sun size={16} />}
                    {theme === 'dark' && <Moon size={16} />}
                    {theme === 'auto' && <Sparkles size={16} />}
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Scheme Section */}
            <div className="design-section">
              <h4>Color Scheme</h4>
              <div className="color-scheme-grid">
                {Object.entries(colorSchemes).map(([name, scheme]) => (
                  <button
                    key={name}
                    className={`color-scheme-btn ${designSettings.colorScheme === name ? 'active' : ''}`}
                    onClick={() => setDesignSettings(prev => ({ ...prev, colorScheme: name }))}
                    style={{ background: scheme.gradient }}
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Section */}
            <div className="design-section">
              <h4>Background</h4>
              <div className="background-options">
                {[
                  { type: 'gradient', label: 'Gradient', icon: <Droplets size={16} /> },
                  { type: 'solid', label: 'Solid', icon: <Sun size={16} /> },
                  { type: 'pattern', label: 'Pattern', icon: <Grid size={16} /> },
                  { type: 'image', label: 'Image', icon: <FileImage size={16} /> }
                ].map(option => (
                  <button
                    key={option.type}
                    className={`bg-option-btn ${designSettings.backgroundType === option.type ? 'active' : ''}`}
                    onClick={() => setDesignSettings(prev => ({ ...prev, backgroundType: option.type }))}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Spacing Section */}
            <div className="design-section">
              <h4>Spacing</h4>
              <div className="spacing-control">
                <label>Widget Gap</label>
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={designSettings.spacing === 'compact' ? 8 : designSettings.spacing === 'spacious' ? 24 : 16}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    const spacing = value <= 12 ? 'compact' : value >= 20 ? 'spacious' : 'normal';
                    setDesignSettings(prev => ({ ...prev, spacing }));
                  }}
                  className="spacing-slider"
                />
              </div>
            </div>

            {/* Effects Section */}
            <div className="design-section">
              <h4>Effects</h4>
              <div className="effects-controls">
                <label className="effect-toggle">
                  <input
                    type="checkbox"
                    checked={designSettings.glassmorphism}
                    onChange={(e) => setDesignSettings(prev => ({
                      ...prev,
                      glassmorphism: e.target.checked
                    }))}
                  />
                  <span>Glassmorphism</span>
                </label>
                <label className="effect-toggle">
                  <input
                    type="checkbox"
                    checked={designSettings.animations}
                    onChange={(e) => setDesignSettings(prev => ({
                      ...prev,
                      animations: e.target.checked
                    }))}
                  />
                  <span>Animations</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Widget Settings Panel */}
      {selectedWidget && dashboardMode === 'edit' && (
        <div className="widget-settings-panel">
          <div className="settings-header">
            <h3>Widget Settings</h3>
            <button onClick={() => setSelectedWidget(null)}>
              <X size={16} />
            </button>
          </div>
          <div className="settings-content">
            <div className="setting-group">
              <label>Title</label>
              <input
                type="text"
                value={selectedWidget.title}
                onChange={(e) => {
                  setWidgets(prev => prev.map(w =>
                    w.id === selectedWidget.id
                      ? { ...w, title: e.target.value }
                      : w
                  ));
                  setSelectedWidget({ ...selectedWidget, title: e.target.value });
                }}
              />
            </div>
            <div className="setting-group">
              <label>Width</label>
              <input
                type="range"
                min="1"
                max="12"
                value={selectedWidget.size.width}
                onChange={(e) => {
                  const newWidth = parseInt(e.target.value);
                  setWidgets(prev => prev.map(w =>
                    w.id === selectedWidget.id
                      ? { ...w, size: { ...w.size, width: newWidth } }
                      : w
                  ));
                  setSelectedWidget({
                    ...selectedWidget,
                    size: { ...selectedWidget.size, width: newWidth }
                  });
                }}
              />
            </div>
            <div className="setting-group">
              <label>Height</label>
              <input
                type="range"
                min="1"
                max="8"
                value={selectedWidget.size.height}
                onChange={(e) => {
                  const newHeight = parseInt(e.target.value);
                  setWidgets(prev => prev.map(w =>
                    w.id === selectedWidget.id
                      ? { ...w, size: { ...w.size, height: newHeight } }
                      : w
                  ));
                  setSelectedWidget({
                    ...selectedWidget,
                    size: { ...selectedWidget.size, height: newHeight }
                  });
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .dashboard-container {
          padding: 24px 32px;
          min-height: 100vh;
          position: relative;
          transition: all 0.3s ease;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding: 20px;
          background: ${designSettings.glassmorphism ? themeStyles.glassBg : themeStyles.surface};
          backdrop-filter: ${designSettings.glassmorphism ? 'blur(20px)' : 'none'};
          border: 1px solid ${themeStyles.border};
          border-radius: ${designSettings.borderRadius === 'rounded' ? '20px' : designSettings.borderRadius === 'sharp' ? '4px' : '16px'};
          color: ${themeStyles.text};
          transition: all 0.3s ease;
        }

        .dashboard-title-section {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .dashboard-title-section h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: ${themeStyles.text};
        }

        .dashboard-mode-switch {
          display: flex;
          background: ${themeStyles.isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)'};
          border-radius: 12px;
          padding: 4px;
          border: 1px solid ${themeStyles.border};
        }

        .mode-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: ${themeStyles.textSecondary};
          transition: all 0.2s ease;
        }

        .mode-btn.active {
          background: ${themeStyles.gradient};
          color: white;
          box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
        }

        .mode-btn:hover:not(.active) {
          background: ${themeStyles.primary}20;
          color: ${themeStyles.primary};
        }

        .dashboard-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .dashboard-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          font-size: 14px;
        }

        .dashboard-btn.primary {
          background: ${themeStyles.gradient};
          color: white;
        }

        .dashboard-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px ${themeStyles.primary}60;
        }

        .dashboard-btn.secondary {
          background: ${designSettings.glassmorphism ? themeStyles.glassBg : themeStyles.surface};
          color: ${themeStyles.textSecondary};
          border: 1px solid ${themeStyles.border};
        }

        .dashboard-btn.secondary:hover {
          background: ${themeStyles.surface};
          border-color: ${themeStyles.primary};
          color: ${themeStyles.primary};
        }

        .dashboard-workspace {
          position: relative;
          min-height: 600px;
        }

        .dashboard-grid {
          display: grid;
          gap: ${designSettings.spacing === 'compact' ? '8px' : designSettings.spacing === 'spacious' ? '24px' : '16px'};
          min-height: 600px;
          position: relative;
          transition: gap 0.3s ease;
        }

        .dashboard-grid.show-grid {
          background-image:
            linear-gradient(${themeStyles.primary}20 1px, transparent 1px),
            linear-gradient(90deg, ${themeStyles.primary}20 1px, transparent 1px);
          background-size: calc(100% / 12) calc(100% / 10);
        }

        .dashboard-widget {
          background: ${designSettings.glassmorphism ? themeStyles.glassBg : themeStyles.surface};
          backdrop-filter: ${designSettings.glassmorphism ? 'blur(20px)' : 'none'};
          border: 1px solid ${themeStyles.border};
          border-radius: ${designSettings.borderRadius === 'rounded' ? '20px' : designSettings.borderRadius === 'sharp' ? '4px' : '16px'};
          padding: 20px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          cursor: default;
          color: ${themeStyles.text};
          box-shadow: ${designSettings.shadows === 'none' ? 'none' :
                      designSettings.shadows === 'subtle' ? '0 1px 3px rgba(0, 0, 0, 0.1)' :
                      designSettings.shadows === 'strong' ? '0 10px 40px rgba(0, 0, 0, 0.2)' :
                      '0 4px 12px rgba(0, 0, 0, 0.1)'};
        }

        .dashboard-widget:hover {
          transform: ${designSettings.animations ? 'translateY(-2px)' : 'none'};
          box-shadow: ${designSettings.shadows !== 'none' ? '0 8px 25px rgba(0, 0, 0, 0.15)' : 'none'};
        }

        .dashboard-widget.editable {
          cursor: move;
        }

        .dashboard-widget.dragging {
          opacity: 0.5;
          transform: rotate(2deg);
          z-index: 1000;
        }

        .drop-preview {
          background: ${themeStyles.primary}30;
          border: 2px dashed ${themeStyles.primary};
          border-radius: 16px;
          pointer-events: none;
          z-index: 999;
          animation: ${designSettings.animations ? 'pulse 1s infinite' : 'none'};
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.8; }
        }

        .widget-controls {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .dashboard-widget:hover .widget-controls {
          opacity: 1;
        }

        .widget-control-btn {
          width: 24px;
          height: 24px;
          border: none;
          background: ${themeStyles.surface};
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: ${themeStyles.textSecondary};
          transition: all 0.2s ease;
        }

        .widget-control-btn:hover {
          background: ${themeStyles.primary};
          color: white;
        }

        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .widget-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: ${themeStyles.text};
        }

        .drag-handle {
          color: ${themeStyles.textSecondary};
          cursor: move;
        }

        .widget-content {
          height: calc(100% - 60px);
          display: flex;
          flex-direction: column;
        }

        .kpi-widget {
          display: flex;
          align-items: center;
          gap: 16px;
          height: 100%;
        }

        .kpi-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: ${themeStyles.gradient};
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .kpi-content {
          flex: 1;
        }

        .kpi-content h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 700;
          color: ${themeStyles.text};
        }

        .kpi-change {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 12px;
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .kpi-change.positive {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .kpi-change.negative {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .kpi-progress {
          width: 100%;
          height: 6px;
          background: ${themeStyles.border};
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .alert-widget {
          display: flex;
          flex-direction: column;
          gap: 12px;
          height: 100%;
          overflow-y: auto;
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
          color: #ef4444;
        }

        .alert-item.low {
          border-color: rgba(245, 158, 11, 0.3);
          background: rgba(245, 158, 11, 0.05);
          color: #f59e0b;
        }

        .alert-content h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .alert-content p {
          margin: 0 0 4px 0;
          font-size: 12px;
          opacity: 0.8;
        }

        .alert-status {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          opacity: 0.7;
        }

        .table-widget {
          height: 100%;
          overflow: auto;
        }

        .table-widget table {
          width: 100%;
          border-collapse: collapse;
        }

        .table-widget th,
        .table-widget td {
          padding: 8px 12px;
          text-align: left;
          border-bottom: 1px solid ${themeStyles.border};
        }

        .table-widget th {
          font-weight: 600;
          color: ${themeStyles.text};
          background: ${themeStyles.isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(248, 250, 252, 0.5)'};
        }

        .table-widget td {
          color: ${themeStyles.textSecondary};
          font-size: 14px;
        }

        .widget-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: ${themeStyles.textSecondary};
          font-style: italic;
        }

        /* Modal Styles */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .widget-library-modal,
        .templates-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: ${designSettings.glassmorphism ? themeStyles.glassBg : themeStyles.surface};
          backdrop-filter: ${designSettings.glassmorphism ? 'blur(20px)' : 'none'};
          border: 1px solid ${themeStyles.border};
          border-radius: 16px;
          width: 800px;
          max-width: 90vw;
          max-height: 80vh;
          overflow-y: auto;
          z-index: 1001;
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.2);
          color: ${themeStyles.text};
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid ${themeStyles.border};
        }

        .modal-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: ${themeStyles.text};
        }

        .modal-header button {
          background: none;
          border: none;
          color: ${themeStyles.textSecondary};
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s ease;
        }

        .modal-header button:hover {
          color: #ef4444;
        }

        .widget-library-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
          padding: 24px;
        }

        .widget-template {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border: 1px solid ${themeStyles.border};
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: ${themeStyles.surface};
        }

        .widget-template:hover {
          border-color: ${themeStyles.primary};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px ${themeStyles.primary}40;
        }

        .template-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: ${themeStyles.gradient};
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .template-info h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: ${themeStyles.text};
        }

        .template-info p {
          margin: 0;
          font-size: 14px;
          color: ${themeStyles.textSecondary};
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
          padding: 24px;
        }

        .template-card {
          padding: 20px;
          border: 1px solid ${themeStyles.border};
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: ${themeStyles.surface};
        }

        .template-card:hover {
          border-color: ${themeStyles.primary};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px ${themeStyles.primary}40;
        }

        .template-card h4 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: ${themeStyles.text};
        }

        .template-card p {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: ${themeStyles.textSecondary};
        }

        .template-widgets {
          font-size: 12px;
          color: ${themeStyles.textSecondary};
          font-weight: 500;
        }

        /* Design Panel */
        .design-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 360px;
          height: 100vh;
          background: ${designSettings.glassmorphism ? themeStyles.glassBg : themeStyles.surface};
          backdrop-filter: ${designSettings.glassmorphism ? 'blur(20px)' : 'none'};
          border-left: 1px solid ${themeStyles.border};
          z-index: 999;
          display: flex;
          flex-direction: column;
          color: ${themeStyles.text};
          transform: translateX(${dashboardMode === 'design' ? '0' : '100%'});
          transition: transform 0.3s ease;
        }

        .design-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid ${themeStyles.border};
        }

        .design-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: ${themeStyles.text};
        }

        .design-header button {
          background: none;
          border: none;
          color: ${themeStyles.textSecondary};
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s ease;
        }

        .design-header button:hover {
          color: #ef4444;
        }

        .design-content {
          padding: 20px;
          flex: 1;
          overflow-y: auto;
        }

        .design-section {
          margin-bottom: 32px;
        }

        .design-section h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: ${themeStyles.text};
        }

        .theme-options {
          display: flex;
          gap: 8px;
        }

        .theme-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border: 1px solid ${themeStyles.border};
          background: ${themeStyles.surface};
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: ${themeStyles.textSecondary};
          transition: all 0.2s ease;
        }

        .theme-btn.active {
          background: ${themeStyles.primary};
          color: white;
          border-color: ${themeStyles.primary};
        }

        .theme-btn:hover:not(.active) {
          border-color: ${themeStyles.primary};
          color: ${themeStyles.primary};
        }

        .color-scheme-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .color-scheme-btn {
          padding: 12px;
          border: 2px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: white;
          text-align: center;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .color-scheme-btn.active {
          border-color: ${themeStyles.text};
          transform: scale(1.05);
        }

        .color-scheme-btn:hover {
          transform: scale(1.02);
        }

        .background-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .bg-option-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
          border: 1px solid ${themeStyles.border};
          background: ${themeStyles.surface};
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: ${themeStyles.textSecondary};
          transition: all 0.2s ease;
        }

        .bg-option-btn.active {
          background: ${themeStyles.primary};
          color: white;
          border-color: ${themeStyles.primary};
        }

        .bg-option-btn:hover:not(.active) {
          border-color: ${themeStyles.primary};
          color: ${themeStyles.primary};
        }

        .spacing-control {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .spacing-control label {
          font-size: 14px;
          font-weight: 500;
          color: ${themeStyles.text};
        }

        .spacing-slider {
          width: 100%;
          height: 6px;
          background: ${themeStyles.border};
          border-radius: 3px;
          outline: none;
          cursor: pointer;
        }

        .spacing-slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          background: ${themeStyles.primary};
          border-radius: 50%;
          cursor: pointer;
        }

        .effects-controls {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .effect-toggle {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 500;
          color: ${themeStyles.text};
          cursor: pointer;
        }

        .effect-toggle input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: ${themeStyles.primary};
        }

        /* Widget Settings Panel */
        .widget-settings-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 320px;
          height: 100vh;
          background: ${designSettings.glassmorphism ? themeStyles.glassBg : themeStyles.surface};
          backdrop-filter: ${designSettings.glassmorphism ? 'blur(20px)' : 'none'};
          border-left: 1px solid ${themeStyles.border};
          z-index: 999;
          display: flex;
          flex-direction: column;
          color: ${themeStyles.text};
        }

        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid ${themeStyles.border};
        }

        .settings-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: ${themeStyles.text};
        }

        .settings-header button {
          background: none;
          border: none;
          color: ${themeStyles.textSecondary};
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s ease;
        }

        .settings-header button:hover {
          color: #ef4444;
        }

        .settings-content {
          padding: 20px;
          flex: 1;
          overflow-y: auto;
        }

        .setting-group {
          margin-bottom: 20px;
        }

        .setting-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          color: ${themeStyles.text};
        }

        .setting-group input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid ${themeStyles.border};
          border-radius: 8px;
          background: ${themeStyles.surface};
          font-size: 14px;
          transition: border-color 0.2s ease;
          color: ${themeStyles.text};
        }

        .setting-group input:focus {
          outline: none;
          border-color: ${themeStyles.primary};
          box-shadow: 0 0 0 3px ${themeStyles.primary}20;
        }

        .setting-group input[type="range"] {
          padding: 0;
          height: 6px;
          background: ${themeStyles.border};
          border-radius: 3px;
          cursor: pointer;
        }

        .setting-group input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          background: ${themeStyles.primary};
          border-radius: 50%;
          cursor: pointer;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .design-panel,
          .widget-settings-panel {
            width: 320px;
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 16px;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .dashboard-actions {
            justify-content: center;
            flex-wrap: wrap;
          }

          .design-panel,
          .widget-settings-panel {
            width: 100vw;
          }

          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }

          .dashboard-widget {
            grid-column: 1 !important;
            grid-row: auto !important;
          }

          .widget-library-modal,
          .templates-modal {
            width: 95vw;
            height: 80vh;
          }

          .widget-library-grid,
          .templates-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomizableDashboard;