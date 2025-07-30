import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, Users, Plus, Settings, Filter, Bell, CheckCircle, XCircle, AlertCircle, Eye, Edit3, Trash2, Search, Download } from 'lucide-react';

const EnhancedSchedule = () => {
  const [currentView, setCurrentView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Schedule settings
  const [scheduleSettings, setScheduleSettings] = useState({
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    workingHours: { start: '09:00', end: '17:00' },
    breakTime: { start: '13:00', end: '14:00' },
    slotDuration: 30, // minutes
    validityYears: 1
  });

  // Sample appointments data
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'John Smith',
      patientEmail: 'john@email.com',
      patientPhone: '+1234567890',
      type: 'General Checkup',
      date: '2025-07-30',
      time: '09:00',
      duration: 30,
      status: 'pending',
      notes: 'Regular checkup appointment',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      patientName: 'Mary Johnson',
      patientEmail: 'mary@email.com',
      patientPhone: '+1234567891',
      type: 'Blood Test',
      date: '2025-07-30',
      time: '10:00',
      duration: 30,
      status: 'approved',
      notes: 'Follow-up blood work',
      createdAt: '2024-01-14'
    },
    {
      id: 3,
      patientName: 'Robert Brown',
      patientEmail: 'robert@email.com',
      patientPhone: '+1234567892',
      type: 'Consultation',
      date: '2025-07-30',
      time: '11:00',
      duration: 60,
      status: 'rejected',
      notes: 'Initial consultation',
      createdAt: '2024-01-13'
    },
    {
      id: 4,
      patientName: 'Lisa Wilson',
      patientEmail: 'lisa@email.com',
      patientPhone: '+1234567893',
      type: 'Vaccination',
      date: '2025-07-31',
      time: '14:00',
      duration: 15,
      status: 'approved',
      notes: 'Annual flu vaccination',
      createdAt: '2024-01-12'
    }
  ]);

  // Generate time slots for a given date
  const generateTimeSlots = (date) => {
    const slots = [];
    const dayOfWeek = date.getDay();

    if (!scheduleSettings.workingDays.includes(dayOfWeek)) {
      return slots; // No slots for non-working days
    }

    const startHour = parseInt(scheduleSettings.workingHours.start.split(':')[0]);
    const startMinute = parseInt(scheduleSettings.workingHours.start.split(':')[1]);
    const endHour = parseInt(scheduleSettings.workingHours.end.split(':')[0]);
    const endMinute = parseInt(scheduleSettings.workingHours.end.split(':')[1]);

    const breakStartHour = parseInt(scheduleSettings.breakTime.start.split(':')[0]);
    const breakStartMinute = parseInt(scheduleSettings.breakTime.start.split(':')[1]);
    const breakEndHour = parseInt(scheduleSettings.breakTime.end.split(':')[0]);
    const breakEndMinute = parseInt(scheduleSettings.breakTime.end.split(':')[1]);

    const totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    const slotsCount = Math.floor(totalMinutes / scheduleSettings.slotDuration);

    for (let i = 0; i < slotsCount; i++) {
      const slotStartMinutes = startHour * 60 + startMinute + (i * scheduleSettings.slotDuration);
      const slotEndMinutes = slotStartMinutes + scheduleSettings.slotDuration;

      const slotStartHour = Math.floor(slotStartMinutes / 60);
      const slotStartMin = slotStartMinutes % 60;
      const slotEndHour = Math.floor(slotEndMinutes / 60);
      const slotEndMin = slotEndMinutes % 60;

      // Check if slot overlaps with break time
      const isBreakTime = (
        (slotStartHour * 60 + slotStartMin) >= (breakStartHour * 60 + breakStartMinute) &&
        (slotStartHour * 60 + slotStartMin) < (breakEndHour * 60 + breakEndMinute)
      );

      if (!isBreakTime) {
        const timeString = `${slotStartHour.toString().padStart(2, '0')}:${slotStartMin.toString().padStart(2, '0')}`;
        const dateString = date.toISOString().split('T')[0];

        // Check if slot is booked
        const bookedAppointment = appointments.find(apt =>
          apt.date === dateString && apt.time === timeString && apt.status === 'approved'
        );

        slots.push({
          time: timeString,
          endTime: `${slotEndHour.toString().padStart(2, '0')}:${slotEndMin.toString().padStart(2, '0')}`,
          available: !bookedAppointment,
          appointment: bookedAppointment
        });
      }
    }

    return slots;
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

  // Calendar component
  const CalendarView = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }

    const navigateMonth = (direction) => {
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() + direction);
      setSelectedDate(newDate);
    };

    return (
      <div className="schedule-calendar">
        <div className="schedule-calendar-header">
          <button onClick={() => navigateMonth(-1)} className="schedule-nav-btn">‹</button>
          <h3>{selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
          <button onClick={() => navigateMonth(1)} className="schedule-nav-btn">›</button>
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
              const isWorkingDay = scheduleSettings.workingDays.includes(date.getDay());

              return (
                <div
                  key={index}
                  className={`schedule-day ${isToday ? 'today' : ''} ${isWorkingDay ? 'working-day' : 'non-working-day'}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <span className="schedule-day-number">{date.getDate()}</span>
                  {dayAppointments.length > 0 && (
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
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Day view component
  const DayView = () => {
    const timeSlots = generateTimeSlots(selectedDate);
    const dayAppointments = getAppointmentsForDate(selectedDate);

    return (
      <div className="schedule-day-view">
        <div className="schedule-day-header">
          <h3>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
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
            </div>
          ) : (
            timeSlots.map((slot, index) => (
              <div key={index} className={`schedule-time-slot ${slot.available ? 'available' : 'booked'}`}>
                <div className="schedule-slot-time">
                  <Clock size={16} />
                  <span>{slot.time} - {slot.endTime}</span>
                </div>
                <div className="schedule-slot-content">
                  {slot.appointment ? (
                    <div className="schedule-appointment-info">
                      <div className="schedule-appointment-patient">
                        <Users size={14} />
                        <span>{slot.appointment.patientName}</span>
                      </div>
                      <div className="schedule-appointment-type">{slot.appointment.type}</div>
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

  // Appointment list component
  const AppointmentsList = () => (
    <div className="schedule-appointments-list">
      <div className="schedule-list-header">
        <h3>All Appointments</h3>
        <div className="schedule-list-controls">
          <div className="schedule-search-container">
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

      <div className="schedule-appointments-table">
        {filteredAppointments.length === 0 ? (
          <div className="schedule-no-appointments">
            <Users size={48} />
            <p>No appointments found</p>
          </div>
        ) : (
          filteredAppointments.map(appointment => (
            <div key={appointment.id} className="schedule-appointment-row">
              <div className="schedule-appointment-info">
                <div className="schedule-appointment-main">
                  <h4>{appointment.patientName}</h4>
                  <p>{appointment.type}</p>
                </div>
                <div className="schedule-appointment-details">
                  <span className="schedule-appointment-date">
                    <Calendar size={14} />
                    {new Date(appointment.date).toLocaleDateString()}
                  </span>
                  <span className="schedule-appointment-time">
                    <Clock size={14} />
                    {appointment.time}
                  </span>
                  <span className={`schedule-appointment-status ${appointment.status}`}>
                    {appointment.status === 'approved' && <CheckCircle size={14} />}
                    {appointment.status === 'pending' && <AlertCircle size={14} />}
                    {appointment.status === 'rejected' && <XCircle size={14} />}
                    {appointment.status}
                  </span>
                </div>
              </div>
              <div className="schedule-appointment-actions">
                <button
                  className="schedule-action-btn view"
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setShowReviewModal(true);
                  }}
                >
                  <Eye size={14} />
                  View
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <div className="schedule-title-section">
          <h2>Doctor Schedule Management</h2>
          <p>Manage appointments and working hours</p>
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
            <p>Approved Today</p>
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
            className={`schedule-tab ${currentView === 'list' ? 'active' : ''}`}
            onClick={() => setCurrentView('list')}
          >
            <Users size={16} />
            Appointments List
          </button>
        </div>
      </div>

      <div className="schedule-main-content">
        {currentView === 'month' && <CalendarView />}
        {currentView === 'day' && <DayView />}
        {currentView === 'list' && <AppointmentsList />}
      </div>

      {/* Schedule Settings Modal */}
      {showScheduleModal && (
        <>
          <div className="schedule-modal-backdrop" onClick={() => setShowScheduleModal(false)}></div>
          <div className="schedule-modal">
            <div className="schedule-modal-header">
              <h3>Schedule Settings</h3>
              <button className="schedule-modal-close" onClick={() => setShowScheduleModal(false)}>×</button>
            </div>
            <div className="schedule-modal-content">
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
                <h4>Appointment Duration</h4>
                <select
                  value={scheduleSettings.slotDuration}
                  onChange={(e) => setScheduleSettings(prev => ({
                    ...prev,
                    slotDuration: parseInt(e.target.value)
                  }))}
                  className="schedule-select"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
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
                  <label>Duration</label>
                  <p>{selectedAppointment.duration} minutes</p>
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

      <style jsx>{`
        .schedule-container {
          background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
          min-height: 100vh;
          padding: 24px 32px;
        }

        .schedule-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .schedule-title-section h2 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 600;
          color: #1e293b;
        }

        .schedule-title-section p {
          margin: 0;
          color: #64748b;
          font-size: 16px;
        }

        .schedule-actions {
          display: flex;
          gap: 12px;
        }

        .schedule-btn {
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

        .schedule-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .schedule-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .schedule-btn.secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #64748b;
          border: 1px solid rgba(226, 232, 240, 0.8);
          backdrop-filter: blur(10px);
        }

        .schedule-btn.secondary:hover {
          background: rgba(255, 255, 255, 1);
          border-color: #667eea;
          color: #667eea;
        }

        .schedule-btn.danger {
          background: #ef4444;
          color: white;
        }

        .schedule-btn.danger:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        .schedule-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .schedule-stat-card {
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

        .schedule-stat-card:hover {
          transform: translateY(-2px);
        }

        .schedule-stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .schedule-stat-card.pending .schedule-stat-icon {
          background: linear-gradient(135deg, #faad14 0%, #f59e0b 100%);
        }

        .schedule-stat-card.approved .schedule-stat-icon {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
        }

        .schedule-stat-card.total .schedule-stat-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .schedule-stat-content h3 {
          margin: 0 0 4px 0;
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }

        .schedule-stat-content p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .schedule-view-controls {
          margin-bottom: 24px;
        }

        .schedule-view-tabs {
          display: flex;
          gap: 4px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 4px;
          width: fit-content;
        }

        .schedule-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .schedule-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 4px rgba(102, 126, 234, 0.4);
        }

        .schedule-main-content {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 24px;
        }

        /* Calendar Styles */
        .schedule-calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .schedule-calendar-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }

        .schedule-nav-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          background: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #64748b;
          transition: all 0.2s ease;
        }

        .schedule-nav-btn:hover {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .schedule-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          margin-bottom: 8px;
        }

        .schedule-weekday {
          padding: 12px;
          text-align: center;
          font-weight: 600;
          color: #64748b;
          font-size: 14px;
        }

        .schedule-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          background: rgba(226, 232, 240, 0.3);
          border-radius: 8px;
          overflow: hidden;
        }

        .schedule-day {
          min-height: 100px;
          background: rgba(255, 255, 255, 0.8);
          padding: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .schedule-day:hover {
          background: rgba(102, 126, 234, 0.1);
        }

        .schedule-day.today {
          background: rgba(102, 126, 234, 0.2);
          font-weight: 600;
        }

        .schedule-day.working-day {
          border-left: 3px solid #16a34a;
        }

        .schedule-day.non-working-day {
          background: rgba(248, 250, 252, 0.5);
          color: #94a3b8;
        }

        .schedule-day.empty {
          background: transparent;
          cursor: default;
        }

        .schedule-day-number {
          font-weight: 600;
          color: #1e293b;
        }

        .schedule-day-appointments {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 8px;
        }

        .schedule-appointment-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .schedule-appointment-dot.approved {
          background: #16a34a;
        }

        .schedule-appointment-dot.pending {
          background: #faad14;
        }

        .schedule-appointment-dot.rejected {
          background: #ef4444;
        }

        .schedule-more-appointments {
          font-size: 10px;
          color: #64748b;
          font-weight: 500;
        }

        /* Day View Styles */
        .schedule-day-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
        }

        .schedule-day-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }

        .schedule-day-stats {
          display: flex;
          gap: 16px;
        }

        .schedule-stat {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #64748b;
        }

        .schedule-time-slots {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .schedule-time-slot {
          display: flex;
          align-items: center;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          transition: all 0.2s ease;
        }

        .schedule-time-slot.available {
          background: rgba(22, 163, 74, 0.05);
          border-color: rgba(22, 163, 74, 0.2);
        }

        .schedule-time-slot.booked {
          background: rgba(239, 68, 68, 0.05);
          border-color: rgba(239, 68, 68, 0.2);
        }

        .schedule-slot-time {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 120px;
          font-weight: 500;
          color: #374151;
        }

        .schedule-slot-content {
          flex: 1;
          margin-left: 16px;
        }

        .schedule-appointment-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .schedule-appointment-patient {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          color: #1e293b;
        }

        .schedule-appointment-type {
          color: #64748b;
          font-size: 14px;
          margin-top: 4px;
        }

        .schedule-available-slot {
          color: #16a34a;
          font-style: italic;
        }

        .schedule-no-slots {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .schedule-no-slots svg {
          color: #94a3b8;
          margin-bottom: 16px;
        }

        /* Appointments List Styles */
        .schedule-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .schedule-list-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }

        .schedule-list-controls {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .schedule-search-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .schedule-search-input {
          width: 250px;
          padding: 10px 16px 10px 40px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .schedule-search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .schedule-search-container svg {
          position: absolute;
          left: 12px;
          color: #94a3b8;
        }

        .schedule-filter-select {
          padding: 10px 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          min-width: 120px;
          cursor: pointer;
        }

        .schedule-appointment-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          margin-bottom: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          transition: all 0.2s ease;
        }

        .schedule-appointment-row:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .schedule-appointment-main h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .schedule-appointment-main p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .schedule-appointment-details {
          display: flex;
          gap: 16px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .schedule-appointment-details span {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #64748b;
        }

        .schedule-appointment-status {
          padding: 4px 8px;
          border-radius: 6px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .schedule-appointment-status.approved {
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
        }

        .schedule-appointment-status.pending {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .schedule-appointment-status.rejected {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .schedule-appointment-actions {
          display: flex;
          gap: 8px;
        }

        .schedule-action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          background: rgba(255, 255, 255, 0.8);
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 12px;
        }

        .schedule-action-btn:hover {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .schedule-action-btn.view:hover {
          background: #3b82f6;
          border-color: #3b82f6;
        }

        .schedule-no-appointments {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .schedule-no-appointments svg {
          color: #94a3b8;
          margin-bottom: 16px;
        }

        /* Modal Styles */
        .schedule-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .schedule-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          z-index: 10000;
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.2);
        }

        .schedule-modal-header {
          padding: 24px 32px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          margin-bottom: 24px;
          padding-bottom: 16px;
        }

        .schedule-modal-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }

        .schedule-modal-close {
          background: none;
          border: none;
          font-size: 24px;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
        }

        .schedule-modal-content {
          padding: 0 32px 32px;
        }

        .schedule-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 24px 32px;
          border-top: 1px solid rgba(226, 232, 240, 0.6);
        }

        .schedule-form-section {
          margin-bottom: 24px;
        }

        .schedule-form-section h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .schedule-weekday-selector {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .schedule-weekday-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .schedule-weekday-option:has(input:checked) {
          background: rgba(102, 126, 234, 0.1);
          border-color: #667eea;
          color: #667eea;
        }

        .schedule-time-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .schedule-input-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        .schedule-time-input, .schedule-select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .schedule-time-input:focus, .schedule-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .schedule-appointment-details-full {
          display: grid;
          gap: 16px;
        }

        .schedule-detail-group label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .schedule-detail-group p {
          margin: 0;
          color: #1e293b;
          background: rgba(248, 250, 252, 0.5);
          padding: 8px 12px;
          border-radius: 8px;
        }

        .schedule-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-weight: 500;
          text-transform: capitalize;
          font-size: 14px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .schedule-container {
            padding: 16px;
          }

          .schedule-header {
            flex-direction: column;
            gap: 16px;
          }

          .schedule-actions {
            width: 100%;
            justify-content: stretch;
          }

          .schedule-actions .schedule-btn {
            flex: 1;
            justify-content: center;
          }

          .schedule-stats {
            grid-template-columns: 1fr;
          }

          .schedule-view-tabs {
            width: 100%;
          }

          .schedule-tab {
            flex: 1;
            justify-content: center;
          }

          .schedule-days {
            gap: 2px;
          }

          .schedule-day {
            min-height: 80px;
            font-size: 14px;
          }

          .schedule-appointment-row {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .schedule-appointment-details {
            flex-direction: column;
            gap: 8px;
          }

          .schedule-list-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .schedule-search-input {
            width: 100%;
          }

          .schedule-time-inputs {
            grid-template-columns: 1fr;
          }

          .schedule-modal {
            width: 95%;
            margin: 20px;
          }

          .schedule-modal-header,
          .schedule-modal-content,
          .schedule-modal-actions {
            padding-left: 20px;
            padding-right: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedSchedule;