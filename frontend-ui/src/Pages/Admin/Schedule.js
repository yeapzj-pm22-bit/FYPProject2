import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Plus, Settings, Filter, Bell, CheckCircle, XCircle, AlertCircle, Eye, Edit3, Trash2, Search, Download, ChevronLeft, ChevronRight, MapPin, Coffee, Plane, CalendarDays, UserCheck } from 'lucide-react';

const EnhancedSchedule = () => {
  const [currentView, setCurrentView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Schedule settings with validity years
  const [scheduleSettings, setScheduleSettings] = useState({
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    workingHours: { start: '09:00', end: '17:00' },
    breakTime: { start: '13:00', end: '14:00' },
    allowedDurations: [30, 60], // Allow both 30min and 1hr appointments
    validityYears: 1, // Schedule valid for 1 year
    validFromDate: new Date().toISOString().split('T')[0]
  });

  // Malaysia Public Holidays 2025 (can be updated annually)
  const malaysiaHolidays2025 = {
    '2025-01-01': 'New Year\'s Day',
    '2025-01-29': 'Chinese New Year',
    '2025-01-30': 'Chinese New Year Holiday',
    '2025-05-01': 'Labour Day',
    '2025-05-12': 'Wesak Day',
    '2025-06-02': 'Agong\'s Birthday',
    '2025-06-16': 'Hari Raya Haji',
    '2025-08-31': 'National Day',
    '2025-09-16': 'Malaysia Day',
    '2025-10-20': 'Deepavali',
    '2025-12-25': 'Christmas Day'
  };

  // Sample appointments with customer-selected durations
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'John Smith',
      patientEmail: 'john@email.com',
      patientPhone: '+60123456789',
      type: 'General Checkup',
      date: '2025-07-30',
      time: '09:00',
      duration: 30, // Customer selected 30 minutes
      status: 'pending',
      notes: 'Regular checkup appointment',
      createdAt: '2025-01-15'
    },
    {
      id: 2,
      patientName: 'Mary Johnson',
      patientEmail: 'mary@email.com',
      patientPhone: '+60123456790',
      type: 'Blood Test',
      date: '2025-07-30',
      time: '10:00',
      duration: 60, // Customer selected 1 hour
      status: 'approved',
      notes: 'Follow-up blood work',
      createdAt: '2025-01-14'
    },
    {
      id: 3,
      patientName: 'Robert Brown',
      patientEmail: 'robert@email.com',
      patientPhone: '+60123456791',
      type: 'Consultation',
      date: '2025-07-30',
      time: '14:00',
      duration: 60,
      status: 'pending',
      notes: 'Initial consultation',
      createdAt: '2025-01-13'
    },
    {
      id: 4,
      patientName: 'Sarah Wilson',
      patientEmail: 'sarah@email.com',
      patientPhone: '+60123456792',
      type: 'Follow-up',
      date: '2025-07-31',
      time: '09:30',
      duration: 30,
      status: 'pending',
      notes: 'Follow-up appointment for previous consultation',
      createdAt: '2025-01-16'
    },
    {
      id: 5,
      patientName: 'David Lee',
      patientEmail: 'david@email.com',
      patientPhone: '+60123456793',
      type: 'Vaccination',
      date: '2025-08-01',
      time: '11:00',
      duration: 30,
      status: 'rejected',
      notes: 'Vaccination appointment',
      createdAt: '2025-01-17'
    }
  ]);

  // Leave applications
  const [leaveApplications, setLeaveApplications] = useState([
    {
      id: 1,
      type: 'Annual Leave',
      startDate: '2025-08-15',
      endDate: '2025-08-16',
      reason: 'Family vacation',
      status: 'approved',
      appliedDate: '2025-01-10'
    },
    {
      id: 2,
      type: 'Medical Leave',
      startDate: '2025-09-05',
      endDate: '2025-09-05',
      reason: 'Medical appointment',
      status: 'pending',
      appliedDate: '2025-01-20'
    }
  ]);

  // New leave application form
  const [newLeave, setNewLeave] = useState({
    type: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Quick approve/reject functions
  const handleQuickApprove = (appointmentId, e) => {
    e.stopPropagation();
    setAppointments(prev => prev.map(apt =>
      apt.id === appointmentId ? { ...apt, status: 'approved' } : apt
    ));
  };

  const handleQuickReject = (appointmentId, e) => {
    e.stopPropagation();
    setAppointments(prev => prev.map(apt =>
      apt.id === appointmentId ? { ...apt, status: 'rejected' } : apt
    ));
  };

  // Check if date is a public holiday
  const isPublicHoliday = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const year = date.getFullYear();

    // You can extend this for multiple years
    if (year === 2025) {
      return malaysiaHolidays2025[dateString];
    }
    return null;
  };

  // Check if date is within schedule validity
  const isWithinValidityPeriod = (date) => {
    const validFrom = new Date(scheduleSettings.validFromDate);
    const validUntil = new Date(validFrom);
    validUntil.setFullYear(validUntil.getFullYear() + scheduleSettings.validityYears);

    return date >= validFrom && date <= validUntil;
  };

  // Check if date has approved leave
  const hasApprovedLeave = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return leaveApplications.some(leave =>
      leave.status === 'approved' &&
      dateString >= leave.startDate &&
      dateString <= leave.endDate
    );
  };

  // Generate time slots for a given date
  const generateTimeSlots = (date) => {
    const slots = [];
    const dayOfWeek = date.getDay();
    const dateString = date.toISOString().split('T')[0];

    // Check various blocking conditions
    if (!scheduleSettings.workingDays.includes(dayOfWeek)) return slots;
    if (!isWithinValidityPeriod(date)) return slots;
    if (isPublicHoliday(date)) return slots;
    if (hasApprovedLeave(date)) return slots;

    const startHour = parseInt(scheduleSettings.workingHours.start.split(':')[0]);
    const startMinute = parseInt(scheduleSettings.workingHours.start.split(':')[1]);
    const endHour = parseInt(scheduleSettings.workingHours.end.split(':')[0]);
    const endMinute = parseInt(scheduleSettings.workingHours.end.split(':')[1]);

    const breakStartHour = parseInt(scheduleSettings.breakTime.start.split(':')[0]);
    const breakStartMinute = parseInt(scheduleSettings.breakTime.start.split(':')[1]);
    const breakEndHour = parseInt(scheduleSettings.breakTime.end.split(':')[0]);
    const breakEndMinute = parseInt(scheduleSettings.breakTime.end.split(':')[1]);

    const totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    const minSlotDuration = Math.min(...scheduleSettings.allowedDurations);
    const slotsCount = Math.floor(totalMinutes / minSlotDuration);

    for (let i = 0; i < slotsCount; i++) {
      const slotStartMinutes = startHour * 60 + startMinute + (i * minSlotDuration);
      const slotEndMinutes = slotStartMinutes + minSlotDuration;

      const slotStartHour = Math.floor(slotStartMinutes / 60);
      const slotStartMin = slotStartMinutes % 60;

      // Check if slot overlaps with break time
      const isBreakTime = (
        (slotStartHour * 60 + slotStartMin) >= (breakStartHour * 60 + breakStartMinute) &&
        (slotStartHour * 60 + slotStartMin) < (breakEndHour * 60 + breakEndMinute)
      );

      if (!isBreakTime) {
        const timeString = `${slotStartHour.toString().padStart(2, '0')}:${slotStartMin.toString().padStart(2, '0')}`;

        // Check if slot is booked
        const bookedAppointment = appointments.find(apt =>
          apt.date === dateString && apt.time === timeString && apt.status === 'approved'
        );

        slots.push({
          time: timeString,
          available: !bookedAppointment,
          appointment: bookedAppointment
        });
      }
    }

    return slots;
  };

  // Get day status for calendar display
  const getDayStatus = (date) => {
    const dayOfWeek = date.getDay();
    const dateString = date.toISOString().split('T')[0];

    // Check if it's a public holiday
    const holiday = isPublicHoliday(date);
    if (holiday) return { type: 'holiday', label: holiday };

    // Check if it's approved leave (yellow)
    if (hasApprovedLeave(date)) return { type: 'leave', label: 'On Leave' };

    // Check if it's outside validity period
    if (!isWithinValidityPeriod(date)) return { type: 'invalid', label: 'Schedule Expired' };

    // Check if it's a working day
    if (!scheduleSettings.workingDays.includes(dayOfWeek)) return { type: 'non-working', label: 'Non-working Day' };

    return { type: 'working', label: 'Available' };
  };

  // Filter appointments based on search and status
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         apt.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         apt.patientEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateString);
  };

  // Handle month/year navigation
  const navigateDate = (direction) => {
    const newDate = new Date(selectedYear, selectedMonth + direction, 1);
    setSelectedMonth(newDate.getMonth());
    setSelectedYear(newDate.getFullYear());
    setSelectedDate(newDate);
  };

  // Handle year/month picker changes
  const handleDatePickerChange = (type, value) => {
    if (type === 'year') {
      setSelectedYear(parseInt(value));
      setSelectedDate(new Date(parseInt(value), selectedMonth, 1));
    } else if (type === 'month') {
      setSelectedMonth(parseInt(value));
      setSelectedDate(new Date(selectedYear, parseInt(value), 1));
    }
  };

  // Submit leave application
  const handleLeaveSubmit = () => {
    if (!newLeave.startDate || !newLeave.endDate || !newLeave.reason) return;

    const newLeaveApp = {
      id: leaveApplications.length + 1,
      ...newLeave,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    setLeaveApplications(prev => [...prev, newLeaveApp]);
    setNewLeave({ type: 'Annual Leave', startDate: '', endDate: '', reason: '' });
    setShowLeaveModal(false);
  };

  // Calendar component with enhanced features
  const CalendarView = () => {
    const today = new Date();
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(selectedYear, selectedMonth, day));
    }

    return (
      <div className="schedule-calendar">
        <div className="schedule-calendar-header">
          <div className="schedule-calendar-nav">
            <button onClick={() => navigateDate(-1)} className="schedule-nav-btn">
              <ChevronLeft size={16} />
            </button>
            <div className="schedule-date-picker">
              <select
                value={selectedMonth}
                onChange={(e) => handleDatePickerChange('month', e.target.value)}
                className="schedule-month-select"
              >
                {Array.from({length: 12}, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(2025, i, 1).toLocaleDateString('en-US', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => handleDatePickerChange('year', e.target.value)}
                className="schedule-year-select"
              >
                {Array.from({length: 10}, (_, i) => (
                  <option key={i} value={2025 + i}>{2025 + i}</option>
                ))}
              </select>
            </div>
            <button onClick={() => navigateDate(1)} className="schedule-nav-btn">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="schedule-validity-info">
            <span className="schedule-validity-badge">
              Valid until: {new Date(new Date(scheduleSettings.validFromDate).setFullYear(new Date(scheduleSettings.validFromDate).getFullYear() + scheduleSettings.validityYears)).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="schedule-calendar-grid">
          <div className="schedule-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="schedule-weekday">{day}</div>
            ))}
          </div>

          <div className="schedule-days">
            {days.map((date, index) => {
              if (!date) return <div key={index} className="schedule-day empty"></div>;

              const dayAppointments = getAppointmentsForDate(date);
              const isToday = date.toDateString() === today.toDateString();
              const dayStatus = getDayStatus(date);

              return (
                <div
                  key={index}
                  className={`schedule-day ${isToday ? 'today' : ''} ${dayStatus.type}`}
                  onClick={() => setSelectedDate(date)}
                  title={dayStatus.label}
                >
                  <div className="schedule-day-content">
                    <span className="schedule-day-number">{date.getDate()}</span>

                    {/* Holiday indicator */}
                    {dayStatus.type === 'holiday' && (
                      <div className="schedule-day-indicator holiday">
                        <MapPin size={12} />
                      </div>
                    )}

                    {/* Leave indicator */}
                    {dayStatus.type === 'leave' && (
                      <div className="schedule-day-indicator leave">
                        <Plane size={12} />
                      </div>
                    )}

                    {/* Appointments count */}
                    {dayAppointments.length > 0 && dayStatus.type === 'working' && (
                      <div className="schedule-day-appointments">
                        {dayAppointments.slice(0, 2).map(apt => (
                          <div key={apt.id} className={`schedule-appointment-dot ${apt.status}`}></div>
                        ))}
                        {dayAppointments.length > 2 && (
                          <span className="schedule-more-appointments">+{dayAppointments.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="schedule-legend">
          <div className="schedule-legend-item">
            <div className="schedule-legend-color working"></div>
            <span>Working Day</span>
          </div>
          <div className="schedule-legend-item">
            <div className="schedule-legend-color holiday"></div>
            <span>Public Holiday</span>
          </div>
          <div className="schedule-legend-item">
            <div className="schedule-legend-color leave"></div>
            <span>On Leave</span>
          </div>
          <div className="schedule-legend-item">
            <div className="schedule-legend-color non-working"></div>
            <span>Non-working</span>
          </div>
        </div>
      </div>
    );
  };

  // Day view component
  const DayView = () => {
    const timeSlots = generateTimeSlots(selectedDate);
    const dayAppointments = getAppointmentsForDate(selectedDate);
    const dayStatus = getDayStatus(selectedDate);

    return (
      <div className="schedule-day-view">
        <div className="schedule-day-header">
          <div className="schedule-day-title">
            <h3>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
            <span className={`schedule-day-status ${dayStatus.type}`}>{dayStatus.label}</span>
          </div>
          <div className="schedule-day-stats">
            <span className="schedule-stat">
              <CheckCircle size={16} />
              {dayAppointments.filter(apt => apt.status === 'approved').length} Approved
            </span>
            <span className="schedule-stat">
              <AlertCircle size={16} />
              {dayAppointments.filter(apt => apt.status === 'pending').length} Pending
            </span>
          </div>
        </div>

        <div className="schedule-time-slots">
          {timeSlots.length === 0 ? (
            <div className="schedule-no-slots">
              <Calendar size={48} />
              <p>No working hours scheduled for this day</p>
              <p className="schedule-no-slots-reason">{dayStatus.label}</p>
            </div>
          ) : (
            timeSlots.map((slot, index) => (
              <div key={index} className={`schedule-time-slot ${slot.available ? 'available' : 'booked'}`}>
                <div className="schedule-slot-time">
                  <Clock size={16} />
                  <span>{slot.time}</span>
                </div>
                <div className="schedule-slot-content">
                  {slot.appointment ? (
                    <div className="schedule-appointment-info">
                      <div className="schedule-appointment-details">
                        <div className="schedule-appointment-patient">
                          <Users size={14} />
                          <span>{slot.appointment.patientName}</span>
                        </div>
                        <div className="schedule-appointment-type">{slot.appointment.type}</div>
                        <div className="schedule-appointment-duration">
                          <Clock size={12} />
                          {slot.appointment.duration} minutes
                        </div>
                      </div>
                      <div className="schedule-appointment-actions">
                        <button
                          className="schedule-action-btn view"
                          onClick={() => {
                            setSelectedAppointment(slot.appointment);
                            setShowReviewModal(true);
                          }}
                        >
                          <Eye size={12} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="schedule-available-slot">
                      <span>Available for booking</span>
                      <div className="schedule-duration-options">
                        {scheduleSettings.allowedDurations.map(duration => (
                          <span key={duration} className="schedule-duration-tag">
                            {duration}min
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Appointments Management View
  const AppointmentsView = () => (
    <div className="schedule-appointments-view">
      <div className="schedule-appointments-header">
        <div className="schedule-search-filter">
          <div className="schedule-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="schedule-search-input"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="schedule-filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Pending Appointments Section */}
      <div className="schedule-pending-section">
        <h3>
          <AlertCircle size={20} />
          Pending Appointments ({appointments.filter(apt => apt.status === 'pending').length})
        </h3>
        <div className="schedule-appointments-grid">
          {appointments.filter(apt => apt.status === 'pending').map(appointment => (
            <div key={appointment.id} className="schedule-appointment-card pending">
              <div className="schedule-appointment-header">
                <div className="schedule-appointment-patient-info">
                  <h4>{appointment.patientName}</h4>
                  <p>{appointment.type}</p>
                </div>
                <span className="schedule-status-badge pending">
                  <AlertCircle size={14} />
                  Pending
                </span>
              </div>

              <div className="schedule-appointment-details-card">
                <div className="schedule-detail-item">
                  <Calendar size={14} />
                  <span>{new Date(appointment.date).toLocaleDateString()}</span>
                </div>
                <div className="schedule-detail-item">
                  <Clock size={14} />
                  <span>{appointment.time} ({appointment.duration} min)</span>
                </div>
                <div className="schedule-detail-item">
                  <Users size={14} />
                  <span>{appointment.patientPhone}</span>
                </div>
              </div>

              {appointment.notes && (
                <div className="schedule-appointment-notes">
                  <p>"{appointment.notes}"</p>
                </div>
              )}

              <div className="schedule-appointment-actions-card">
                <button
                  className="schedule-btn secondary small"
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setShowReviewModal(true);
                  }}
                >
                  <Eye size={14} />
                  View Details
                </button>
                <button
                  className="schedule-btn danger small"
                  onClick={(e) => handleQuickReject(appointment.id, e)}
                >
                  <XCircle size={14} />
                  Reject
                </button>
                <button
                  className="schedule-btn primary small"
                  onClick={(e) => handleQuickApprove(appointment.id, e)}
                >
                  <CheckCircle size={14} />
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>

        {appointments.filter(apt => apt.status === 'pending').length === 0 && (
          <div className="schedule-no-pending">
            <CheckCircle size={48} />
            <p>No pending appointments!</p>
            <span>All appointments have been reviewed.</span>
          </div>
        )}
      </div>

      {/* All Appointments List */}
      <div className="schedule-all-appointments">
        <h3>All Appointments ({filteredAppointments.length})</h3>
        <div className="schedule-appointments-list">
          {filteredAppointments.map(appointment => (
            <div
              key={appointment.id}
              className={`schedule-appointment-row ${appointment.status}`}
              onClick={() => {
                setSelectedAppointment(appointment);
                setShowReviewModal(true);
              }}
            >
              <div className="schedule-appointment-row-info">
                <div className="schedule-appointment-primary">
                  <span className="schedule-patient-name">{appointment.patientName}</span>
                  <span className="schedule-appointment-type-small">{appointment.type}</span>
                </div>
                <div className="schedule-appointment-secondary">
                  <span>{new Date(appointment.date).toLocaleDateString()}</span>
                  <span>{appointment.time}</span>
                  <span>{appointment.duration} min</span>
                </div>
              </div>

              <div className="schedule-appointment-row-actions">
                <span className={`schedule-status-badge ${appointment.status}`}>
                  {appointment.status === 'approved' && <CheckCircle size={12} />}
                  {appointment.status === 'pending' && <AlertCircle size={12} />}
                  {appointment.status === 'rejected' && <XCircle size={12} />}
                  {appointment.status}
                </span>

                {appointment.status === 'pending' && (
                  <div className="schedule-quick-actions">
                    <button
                      className="schedule-quick-btn reject"
                      onClick={(e) => handleQuickReject(appointment.id, e)}
                      title="Quick Reject"
                    >
                      <XCircle size={14} />
                    </button>
                    <button
                      className="schedule-quick-btn approve"
                      onClick={(e) => handleQuickApprove(appointment.id, e)}
                      title="Quick Approve"
                    >
                      <CheckCircle size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Leave management component
  const LeaveManagement = () => (
    <div className="schedule-leave-management">
      <div className="schedule-section-header">
        <h3>Leave Applications</h3>
        <button className="schedule-btn primary" onClick={() => setShowLeaveModal(true)}>
          <Plus size={16} />
          Apply Leave
        </button>
      </div>

      <div className="schedule-leave-list">
        {leaveApplications.map(leave => (
          <div key={leave.id} className="schedule-leave-item">
            <div className="schedule-leave-info">
              <h4>{leave.type}</h4>
              <p>{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</p>
              <p className="schedule-leave-reason">{leave.reason}</p>
            </div>
            <div className="schedule-leave-status">
              <span className={`schedule-status-badge ${leave.status}`}>
                {leave.status === 'approved' && <CheckCircle size={14} />}
                {leave.status === 'pending' && <AlertCircle size={14} />}
                {leave.status === 'rejected' && <XCircle size={14} />}
                {leave.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <div className="schedule-title-section">
          <h2>Enhanced Schedule Management</h2>
          <p>Manage appointments, working hours, and leave applications</p>
        </div>
        <div className="schedule-actions">
          <button
            className="schedule-btn secondary"
            onClick={() => setShowScheduleModal(true)}
          >
            <Settings size={16} />
            Schedule Settings
          </button>
          <button className="schedule-btn secondary">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="schedule-stats">
        <div className="schedule-stat-card pending">
          <div className="schedule-stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="schedule-stat-content">
            <h3>{appointments.filter(apt => apt.status === 'pending').length}</h3>
            <p>Pending Appointments</p>
          </div>
        </div>
        <div className="schedule-stat-card approved">
          <div className="schedule-stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="schedule-stat-content">
            <h3>{appointments.filter(apt => apt.status === 'approved').length}</h3>
            <p>Approved Appointments</p>
          </div>
        </div>
        <div className="schedule-stat-card leave">
          <div className="schedule-stat-icon">
            <Plane size={24} />
          </div>
          <div className="schedule-stat-content">
            <h3>{leaveApplications.filter(leave => leave.status === 'approved').length}</h3>
            <p>Approved Leave Days</p>
          </div>
        </div>
        <div className="schedule-stat-card total">
          <div className="schedule-stat-icon">
            <Calendar size={24} />
          </div>
          <div className="schedule-stat-content">
            <h3>{appointments.length}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
      </div>

      <div className="schedule-view-controls">
        <div className="schedule-view-tabs">
          <button
            className={`schedule-tab ${currentView === 'month' ? 'active' : ''}`}
            onClick={() => setCurrentView('month')}
          >
            <Calendar size={16} />
            Month View
          </button>
          <button
            className={`schedule-tab ${currentView === 'day' ? 'active' : ''}`}
            onClick={() => setCurrentView('day')}
          >
            <Clock size={16} />
            Day View
          </button>
          <button
            className={`schedule-tab ${currentView === 'appointments' ? 'active' : ''}`}
            onClick={() => setCurrentView('appointments')}
          >
            <UserCheck size={16} />
            Appointments
            {appointments.filter(apt => apt.status === 'pending').length > 0 && (
              <span className="schedule-tab-badge">
                {appointments.filter(apt => apt.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            className={`schedule-tab ${currentView === 'leave' ? 'active' : ''}`}
            onClick={() => setCurrentView('leave')}
          >
            <Plane size={16} />
            Leave Management
          </button>
        </div>
      </div>

      <div className="schedule-main-content">
        {currentView === 'month' && <CalendarView />}
        {currentView === 'day' && <DayView />}
        {currentView === 'appointments' && <AppointmentsView />}
        {currentView === 'leave' && <LeaveManagement />}
      </div>

      {/* Schedule Settings Modal */}
      {showScheduleModal && (
        <>
          <div className="schedule-modal-backdrop" onClick={() => setShowScheduleModal(false)}></div>
          <div className="schedule-modal large">
            <div className="schedule-modal-header">
              <h3>Advanced Schedule Settings</h3>
              <button className="schedule-modal-close" onClick={() => setShowScheduleModal(false)}>×</button>
            </div>
            <div className="schedule-modal-content">
              <div className="schedule-form-section">
                <h4>Schedule Validity</h4>
                <div className="schedule-validity-settings">
                  <div className="schedule-input-group">
                    <label>Valid From Date</label>
                    <input
                      type="date"
                      value={scheduleSettings.validFromDate}
                      onChange={(e) => setScheduleSettings(prev => ({
                        ...prev,
                        validFromDate: e.target.value
                      }))}
                      className="schedule-input"
                    />
                  </div>
                  <div className="schedule-input-group">
                    <label>Validity Period (Years)</label>
                    <select
                      value={scheduleSettings.validityYears}
                      onChange={(e) => setScheduleSettings(prev => ({
                        ...prev,
                        validityYears: parseInt(e.target.value)
                      }))}
                      className="schedule-select"
                    >
                      <option value={1}>1 Year</option>
                      <option value={2}>2 Years</option>
                      <option value={3}>3 Years</option>
                      <option value={5}>5 Years</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="schedule-form-section">
                <h4>Working Days</h4>
                <div className="schedule-weekday-selector">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <label key={index} className="schedule-weekday-option">
                      <input
                        type="checkbox"
                        checked={scheduleSettings.workingDays.includes(index)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setScheduleSettings(prev => ({
                              ...prev,
                              workingDays: [...prev.workingDays, index]
                            }));
                          } else {
                            setScheduleSettings(prev => ({
                              ...prev,
                              workingDays: prev.workingDays.filter(d => d !== index)
                            }));
                          }
                        }}
                      />
                      <span>{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="schedule-form-section">
                <h4>Working Hours</h4>
                <div className="schedule-time-inputs">
                  <div className="schedule-input-group">
                    <label>Start Time</label>
                    <input
                      type="time"
                      value={scheduleSettings.workingHours.start}
                      onChange={(e) => setScheduleSettings(prev => ({
                        ...prev,
                        workingHours: { ...prev.workingHours, start: e.target.value }
                      }))}
                      className="schedule-time-input"
                    />
                  </div>
                  <div className="schedule-input-group">
                    <label>End Time</label>
                    <input
                      type="time"
                      value={scheduleSettings.workingHours.end}
                      onChange={(e) => setScheduleSettings(prev => ({
                        ...prev,
                        workingHours: { ...prev.workingHours, end: e.target.value }
                      }))}
                      className="schedule-time-input"
                    />
                  </div>
                </div>
              </div>

              <div className="schedule-form-section">
                <h4>Break Time</h4>
                <div className="schedule-time-inputs">
                  <div className="schedule-input-group">
                    <label>Break Start</label>
                    <input
                      type="time"
                      value={scheduleSettings.breakTime.start}
                      onChange={(e) => setScheduleSettings(prev => ({
                        ...prev,
                        breakTime: { ...prev.breakTime, start: e.target.value }
                      }))}
                      className="schedule-time-input"
                    />
                  </div>
                  <div className="schedule-input-group">
                    <label>Break End</label>
                    <input
                      type="time"
                      value={scheduleSettings.breakTime.end}
                      onChange={(e) => setScheduleSettings(prev => ({
                        ...prev,
                        breakTime: { ...prev.breakTime, end: e.target.value }
                      }))}
                      className="schedule-time-input"
                    />
                  </div>
                </div>
              </div>

              <div className="schedule-form-section">
                <h4>Allowed Appointment Durations</h4>
                <div className="schedule-duration-selector">
                  {[15, 30, 45, 60, 90, 120].map(duration => (
                    <label key={duration} className="schedule-duration-option">
                      <input
                        type="checkbox"
                        checked={scheduleSettings.allowedDurations.includes(duration)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setScheduleSettings(prev => ({
                              ...prev,
                              allowedDurations: [...prev.allowedDurations, duration].sort((a, b) => a - b)
                            }));
                          } else {
                            setScheduleSettings(prev => ({
                              ...prev,
                              allowedDurations: prev.allowedDurations.filter(d => d !== duration)
                            }));
                          }
                        }}
                      />
                      <span>{duration} min</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="schedule-modal-actions">
              <button className="schedule-btn secondary" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </button>
              <button className="schedule-btn primary" onClick={() => setShowScheduleModal(false)}>
                Save Settings
              </button>
            </div>
          </div>
        </>
      )}

      {/* Apply Leave Modal */}
      {showLeaveModal && (
        <>
          <div className="schedule-modal-backdrop" onClick={() => setShowLeaveModal(false)}></div>
          <div className="schedule-modal">
            <div className="schedule-modal-header">
              <h3>Apply for Leave</h3>
              <button className="schedule-modal-close" onClick={() => setShowLeaveModal(false)}>×</button>
            </div>
            <div className="schedule-modal-content">
              <div className="schedule-form-section">
                <div className="schedule-input-group">
                  <label>Leave Type</label>
                  <select
                    value={newLeave.type}
                    onChange={(e) => setNewLeave(prev => ({ ...prev, type: e.target.value }))}
                    className="schedule-select"
                  >
                    <option>Annual Leave</option>
                    <option>Medical Leave</option>
                    <option>Emergency Leave</option>
                    <option>Personal Leave</option>
                  </select>
                </div>
                <div className="schedule-time-inputs">
                  <div className="schedule-input-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={newLeave.startDate}
                      onChange={(e) => setNewLeave(prev => ({ ...prev, startDate: e.target.value }))}
                      className="schedule-input"
                    />
                  </div>
                  <div className="schedule-input-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={newLeave.endDate}
                      onChange={(e) => setNewLeave(prev => ({ ...prev, endDate: e.target.value }))}
                      className="schedule-input"
                    />
                  </div>
                </div>
                <div className="schedule-input-group">
                  <label>Reason</label>
                  <textarea
                    value={newLeave.reason}
                    onChange={(e) => setNewLeave(prev => ({ ...prev, reason: e.target.value }))}
                    className="schedule-textarea"
                    placeholder="Please provide a reason for your leave..."
                  />
                </div>
              </div>
            </div>
            <div className="schedule-modal-actions">
              <button className="schedule-btn secondary" onClick={() => setShowLeaveModal(false)}>
                Cancel
              </button>
              <button
                className="schedule-btn primary"
                onClick={handleLeaveSubmit}
                disabled={!newLeave.startDate || !newLeave.endDate || !newLeave.reason}
              >
                Submit Application
              </button>
            </div>
          </div>
        </>
      )}

      {/* Review Appointment Modal */}
      {showReviewModal && selectedAppointment && (
        <>
          <div className="schedule-modal-backdrop" onClick={() => setShowReviewModal(false)}></div>
          <div className="schedule-modal">
            <div className="schedule-modal-header">
              <h3>Review Appointment</h3>
              <button className="schedule-modal-close" onClick={() => setShowReviewModal(false)}>×</button>
            </div>
            <div className="schedule-modal-content">
              <div className="schedule-appointment-details-full">
                <div className="schedule-detail-group">
                  <label>Patient Name</label>
                  <p>{selectedAppointment.patientName}</p>
                </div>
                <div className="schedule-detail-group">
                  <label>Email</label>
                  <p>{selectedAppointment.patientEmail}</p>
                </div>
                <div className="schedule-detail-group">
                  <label>Phone</label>
                  <p>{selectedAppointment.patientPhone}</p>
                </div>
                <div className="schedule-detail-group">
                  <label>Appointment Type</label>
                  <p>{selectedAppointment.type}</p>
                </div>
                <div className="schedule-detail-group">
                  <label>Date & Time</label>
                  <p>{new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.time}</p>
                </div>
                <div className="schedule-detail-group">
                  <label>Duration (Customer Selected)</label>
                  <div className="schedule-duration-display">
                    <Clock size={16} />
                    <span>{selectedAppointment.duration} minutes</span>
                  </div>
                </div>
                <div className="schedule-detail-group">
                  <label>Notes</label>
                  <p>{selectedAppointment.notes}</p>
                </div>
                <div className="schedule-detail-group">
                  <label>Current Status</label>
                  <span className={`schedule-status-badge ${selectedAppointment.status}`}>
                    {selectedAppointment.status === 'approved' && <CheckCircle size={14} />}
                    {selectedAppointment.status === 'pending' && <AlertCircle size={14} />}
                    {selectedAppointment.status === 'rejected' && <XCircle size={14} />}
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="schedule-modal-actions">
              <button className="schedule-btn secondary" onClick={() => setShowReviewModal(false)}>
                Close
              </button>
              {selectedAppointment.status === 'pending' && (
                <>
                  <button
                    className="schedule-btn danger"
                    onClick={() => {
                      setAppointments(prev => prev.map(apt =>
                        apt.id === selectedAppointment.id ? { ...apt, status: 'rejected' } : apt
                      ));
                      setShowReviewModal(false);
                    }}
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                  <button
                    className="schedule-btn primary"
                    onClick={() => {
                      setAppointments(prev => prev.map(apt =>
                        apt.id === selectedAppointment.id ? { ...apt, status: 'approved' } : apt
                      ));
                      setShowReviewModal(false);
                    }}
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}


    </div>
  );
};

export default EnhancedSchedule;