import React, { useState } from 'react';
import { Calendar, Clock, Users, Plus, TrendingUp, TrendingDown, Activity, DollarSign, FileText, AlertCircle, CheckCircle, XCircle, Eye, Edit3, Bell, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  // Sample data
  const statsCards = [
    {
      title: 'Total Patients',
      value: '2,847',
      change: '+12%',
      changeType: 'positive',
      color: 'blue',
      icon: Users
    },
    {
      title: 'Today\'s Appointments',
      value: '24',
      change: '+8%',
      changeType: 'positive',
      color: 'green',
      icon: Calendar
    },
    {
      title: 'Pending Reviews',
      value: '156',
      change: '-3%',
      changeType: 'negative',
      color: 'orange',
      icon: AlertCircle
    },
    {
      title: 'Monthly Revenue',
      value: 'RM45,890',
      change: '+18%',
      changeType: 'positive',
      color: 'purple',
      icon: DollarSign
    },
  ];

  const recentAppointments = [
    {
      id: 1,
      patientName: 'John Smith',
      type: 'General Checkup',
      time: '09:00 AM',
      status: 'pending',
      duration: '30 min'
    },
    {
      id: 2,
      patientName: 'Mary Johnson',
      type: 'Blood Test',
      time: '10:30 AM',
      status: 'approved',
      duration: '60 min'
    },
    {
      id: 3,
      patientName: 'Robert Brown',
      type: 'Consultation',
      time: '02:00 PM',
      status: 'pending',
      duration: '45 min'
    },
    {
      id: 4,
      patientName: 'Lisa Wilson',
      type: 'Follow-up',
      time: '03:30 PM',
      status: 'approved',
      duration: '30 min'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'appointment',
      message: 'New appointment booked by John Doe',
      time: '2 minutes ago',
      icon: Calendar,
      color: 'blue'
    },
    {
      id: 2,
      type: 'patient',
      message: 'Patient record updated for Mary Johnson',
      time: '15 minutes ago',
      icon: Users,
      color: 'green'
    },
    {
      id: 3,
      type: 'leave',
      message: 'Leave application submitted',
      time: '1 hour ago',
      icon: FileText,
      color: 'orange'
    },
    {
      id: 4,
      type: 'system',
      message: 'System backup completed successfully',
      time: '2 hours ago',
      icon: Activity,
      color: 'purple'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Staff Meeting',
      date: 'Today',
      time: '2:00 PM',
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Medical Conference',
      date: 'Tomorrow',
      time: '9:00 AM',
      type: 'conference'
    },
    {
      id: 3,
      title: 'Equipment Maintenance',
      date: 'Aug 2',
      time: '10:00 AM',
      type: 'maintenance'
    }
  ];

  const performanceMetrics = [
    { label: 'Patient Satisfaction', value: 94, unit: '%', trend: 'up' },
    { label: 'Appointment Completion', value: 87, unit: '%', trend: 'up' },
    { label: 'Average Wait Time', value: 12, unit: 'min', trend: 'down' },
    { label: 'Revenue Growth', value: 23, unit: '%', trend: 'up' }
  ];

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <div className="dashboard-welcome-content">
          <h1>Welcome back, Dr. Sarah Wilson!</h1>
          <p>Here's what's happening at your clinic today.</p>
        </div>
        <div className="dashboard-welcome-actions">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="dashboard-timeframe-select"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats-grid">
        {statsCards.map((stat, index) => (
          <div key={index} className={`dashboard-stat-card ${stat.color}`}>
            <div className="dashboard-stat-icon">
              <stat.icon size={24} />
            </div>
            <div className="dashboard-stat-content">
              <div className="dashboard-stat-header">
                <h3 className="dashboard-stat-title">{stat.title}</h3>
                <span className={`dashboard-stat-change ${stat.changeType}`}>
                  {stat.changeType === 'positive' && <TrendingUp size={16} />}
                  {stat.changeType === 'negative' && <TrendingDown size={16} />}
                  {stat.change}
                </span>
              </div>
              <div className="dashboard-stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-main-grid">
        {/* Today's Appointments */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Today's Appointments</h3>
            <button className="dashboard-card-action">
              <Plus size={16} />
              Add New
            </button>
          </div>
          <div className="dashboard-card-content">
            <div className="dashboard-appointments-list">
              {recentAppointments.map((appointment) => (
                <div key={appointment.id} className="dashboard-appointment-item">
                  <div className="dashboard-appointment-info">
                    <div className="dashboard-appointment-patient">
                      <h4>{appointment.patientName}</h4>
                      <p>{appointment.type}</p>
                    </div>
                    <div className="dashboard-appointment-meta">
                      <span className="dashboard-appointment-time">
                        <Clock size={14} />
                        {appointment.time}
                      </span>
                      <span className="dashboard-appointment-duration">
                        {appointment.duration}
                      </span>
                    </div>
                  </div>
                  <div className="dashboard-appointment-status">
                    <span className={`dashboard-status-badge ${appointment.status}`}>
                      {appointment.status === 'approved' && <CheckCircle size={14} />}
                      {appointment.status === 'pending' && <AlertCircle size={14} />}
                      {appointment.status === 'rejected' && <XCircle size={14} />}
                      {appointment.status}
                    </span>
                    <button className="dashboard-action-btn">
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="dashboard-card-footer">
              <button className="dashboard-link-btn">View all appointments →</button>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Performance Metrics</h3>
            <button className="dashboard-card-action">
              <BarChart3 size={16} />
              Details
            </button>
          </div>
          <div className="dashboard-card-content">
            <div className="dashboard-metrics-list">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="dashboard-metric-item">
                  <div className="dashboard-metric-info">
                    <span className="dashboard-metric-label">{metric.label}</span>
                    <div className="dashboard-metric-value">
                      <span className="dashboard-metric-number">{metric.value}</span>
                      <span className="dashboard-metric-unit">{metric.unit}</span>
                      <span className={`dashboard-metric-trend ${metric.trend}`}>
                        {metric.trend === 'up' && <TrendingUp size={14} />}
                        {metric.trend === 'down' && <TrendingDown size={14} />}
                      </span>
                    </div>
                  </div>
                  <div className="dashboard-metric-bar">
                    <div
                      className="dashboard-metric-progress"
                      style={{ width: `${Math.min(metric.value, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Recent Activity</h3>
            <button className="dashboard-card-action">
              <Bell size={16} />
              All Notifications
            </button>
          </div>
          <div className="dashboard-card-content">
            <div className="dashboard-activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="dashboard-activity-item">
                  <div className={`dashboard-activity-icon ${activity.color}`}>
                    <activity.icon size={16} />
                  </div>
                  <div className="dashboard-activity-content">
                    <p className="dashboard-activity-message">{activity.message}</p>
                    <span className="dashboard-activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="dashboard-card-footer">
              <button className="dashboard-link-btn">View all activity →</button>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Upcoming Events</h3>
            <button className="dashboard-card-action">
              <Calendar size={16} />
              Calendar
            </button>
          </div>
          <div className="dashboard-card-content">
            <div className="dashboard-events-list">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="dashboard-event-item">
                  <div className="dashboard-event-date">
                    <span className="dashboard-event-day">{event.date}</span>
                    <span className="dashboard-event-time">{event.time}</span>
                  </div>
                  <div className="dashboard-event-info">
                    <h4>{event.title}</h4>
                    <span className={`dashboard-event-type ${event.type}`}>
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="dashboard-card-footer">
              <button className="dashboard-link-btn">View calendar →</button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="dashboard-card-content">
            <div className="dashboard-quick-actions">
              <button className="dashboard-quick-action-btn blue">
                <Users size={20} />
                <span>Add Patient</span>
              </button>
              <button className="dashboard-quick-action-btn green">
                <Calendar size={20} />
                <span>Book Appointment</span>
              </button>
              <button className="dashboard-quick-action-btn orange">
                <FileText size={20} />
                <span>Create Record</span>
              </button>
              <button className="dashboard-quick-action-btn purple">
                <BarChart3 size={20} />
                <span>View Reports</span>
              </button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>System Status</h3>
          </div>
          <div className="dashboard-card-content">
            <div className="dashboard-system-status">
              <div className="dashboard-status-item">
                <div className="dashboard-status-indicator online"></div>
                <span>Database: Online</span>
              </div>
              <div className="dashboard-status-item">
                <div className="dashboard-status-indicator online"></div>
                <span>Backup: Active</span>
              </div>
              <div className="dashboard-status-item">
                <div className="dashboard-status-indicator warning"></div>
                <span>Storage: 78% Used</span>
              </div>
              <div className="dashboard-status-item">
                <div className="dashboard-status-indicator online"></div>
                <span>API: Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          padding: 24px 32px;
        }

        .dashboard-welcome {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding: 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          color: white;
        }

        .dashboard-welcome-content h1 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 600;
        }

        .dashboard-welcome-content p {
          margin: 0;
          opacity: 0.9;
          font-size: 16px;
        }

        .dashboard-timeframe-select {
          padding: 10px 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: white;
          font-size: 14px;
          cursor: pointer;
        }

        .dashboard-timeframe-select option {
          background: #1e293b;
          color: white;
        }

        .dashboard-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .dashboard-stat-card {
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

        .dashboard-stat-card:hover {
          transform: translateY(-2px);
        }

        .dashboard-stat-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .dashboard-stat-card.blue .dashboard-stat-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .dashboard-stat-card.green .dashboard-stat-icon {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
        }

        .dashboard-stat-card.orange .dashboard-stat-icon {
          background: linear-gradient(135deg, #ea580c 0%, #fb923c 100%);
        }

        .dashboard-stat-card.purple .dashboard-stat-icon {
          background: linear-gradient(135deg, #9333ea 0%, #a855f7 100%);
        }

        .dashboard-stat-content {
          flex: 1;
        }

        .dashboard-stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .dashboard-stat-title {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
          margin: 0;
        }

        .dashboard-stat-change {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .dashboard-stat-change.positive {
          color: #16a34a;
          background: rgba(22, 163, 74, 0.1);
        }

        .dashboard-stat-change.negative {
          color: #dc2626;
          background: rgba(220, 38, 38, 0.1);
        }

        .dashboard-stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
        }

        .dashboard-main-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }

        .dashboard-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.2s ease;
        }

        .dashboard-card:hover {
          transform: translateY(-1px);
        }

        .dashboard-card-header {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dashboard-card-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .dashboard-card-action {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dashboard-card-action:hover {
          background: #667eea;
          color: white;
        }

        .dashboard-card-content {
          padding: 24px;
        }

        .dashboard-card-footer {
          padding: 16px 24px;
          border-top: 1px solid rgba(226, 232, 240, 0.6);
          background: rgba(248, 250, 252, 0.5);
        }

        .dashboard-link-btn {
          background: none;
          border: none;
          color: #667eea;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .dashboard-link-btn:hover {
          color: #4f46e5;
        }

        /* Appointments List */
        .dashboard-appointments-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .dashboard-appointment-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(248, 250, 252, 0.5);
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .dashboard-appointment-item:hover {
          background: rgba(226, 232, 240, 0.3);
        }

        .dashboard-appointment-patient h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .dashboard-appointment-patient p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .dashboard-appointment-meta {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .dashboard-appointment-time {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #667eea;
          font-size: 12px;
          font-weight: 500;
        }

        .dashboard-appointment-duration {
          color: #64748b;
          font-size: 12px;
        }

        .dashboard-appointment-status {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dashboard-status-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .dashboard-status-badge.approved {
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
        }

        .dashboard-status-badge.pending {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .dashboard-status-badge.rejected {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .dashboard-action-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 8px;
          background: rgba(100, 116, 139, 0.1);
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .dashboard-action-btn:hover {
          background: #667eea;
          color: white;
        }

        /* Performance Metrics */
        .dashboard-metrics-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .dashboard-metric-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dashboard-metric-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dashboard-metric-label {
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
        }

        .dashboard-metric-value {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dashboard-metric-number {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
        }

        .dashboard-metric-unit {
          color: #64748b;
          font-size: 14px;
        }

        .dashboard-metric-trend {
          display: flex;
          align-items: center;
        }

        .dashboard-metric-trend.up {
          color: #16a34a;
        }

        .dashboard-metric-trend.down {
          color: #dc2626;
        }

        .dashboard-metric-bar {
          height: 6px;
          background: rgba(226, 232, 240, 0.5);
          border-radius: 3px;
          overflow: hidden;
        }

        .dashboard-metric-progress {
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        /* Activity List */
        .dashboard-activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .dashboard-activity-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .dashboard-activity-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .dashboard-activity-icon.blue {
          background: #667eea;
        }

        .dashboard-activity-icon.green {
          background: #16a34a;
        }

        .dashboard-activity-icon.orange {
          background: #ea580c;
        }

        .dashboard-activity-icon.purple {
          background: #9333ea;
        }

        .dashboard-activity-content {
          flex: 1;
        }

        .dashboard-activity-message {
          margin: 0 0 4px 0;
          color: #1e293b;
          font-size: 14px;
          font-weight: 500;
        }

        .dashboard-activity-time {
          color: #64748b;
          font-size: 12px;
        }

        /* Events List */
        .dashboard-events-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .dashboard-event-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: rgba(248, 250, 252, 0.5);
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .dashboard-event-item:hover {
          background: rgba(226, 232, 240, 0.3);
        }

        .dashboard-event-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 60px;
          text-align: center;
        }

        .dashboard-event-day {
          font-size: 12px;
          font-weight: 600;
          color: #667eea;
          text-transform: uppercase;
        }

        .dashboard-event-time {
          font-size: 11px;
          color: #64748b;
          margin-top: 2px;
        }

        .dashboard-event-info h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .dashboard-event-type {
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
          font-weight: 500;
        }

        .dashboard-event-type.meeting {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .dashboard-event-type.conference {
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
        }

        .dashboard-event-type.maintenance {
          background: rgba(234, 88, 12, 0.1);
          color: #ea580c;
        }

        /* Quick Actions */
        .dashboard-quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .dashboard-quick-action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 20px 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          transition: all 0.2s ease;
          color: #64748b;
        }

        .dashboard-quick-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .dashboard-quick-action-btn.blue:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .dashboard-quick-action-btn.green:hover {
          border-color: #16a34a;
          color: #16a34a;
        }

        .dashboard-quick-action-btn.orange:hover {
          border-color: #ea580c;
          color: #ea580c;
        }

        .dashboard-quick-action-btn.purple:hover {
          border-color: #9333ea;
          color: #9333ea;
        }

        .dashboard-quick-action-btn span {
          font-size: 12px;
          font-weight: 500;
        }

        /* System Status */
        .dashboard-system-status {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dashboard-status-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: #64748b;
        }

        .dashboard-status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .dashboard-status-indicator.online {
          background: #16a34a;
        }

        .dashboard-status-indicator.warning {
          background: #f59e0b;
        }

        .dashboard-status-indicator.offline {
          background: #ef4444;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 16px;
          }

          .dashboard-welcome {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .dashboard-stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }

          .dashboard-main-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-quick-actions {
            grid-template-columns: 1fr;
          }

          .dashboard-appointment-item {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .dashboard-appointment-status {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;