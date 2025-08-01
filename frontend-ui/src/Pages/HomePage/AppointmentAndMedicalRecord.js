import React, { useState, useMemo } from 'react';
import {
  Calendar,
  FileText,
  Pill,
  Camera,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Search,
  Filter,
  RotateCcw,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Save
} from 'lucide-react';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [imageModal, setImageModal] = useState(null);

  // Reschedule states
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleStartTime, setRescheduleStartTime] = useState('');
  const [rescheduleEndTime, setRescheduleEndTime] = useState('');
  const [rescheduleMonth, setRescheduleMonth] = useState(new Date().getMonth());
  const [rescheduleYear, setRescheduleYear] = useState(new Date().getFullYear());

  // Search and Filter states
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState('all');
  const [appointmentDateFilter, setAppointmentDateFilter] = useState('all');
  const [recordSearch, setRecordSearch] = useState('');
  const [recordDateFilter, setRecordDateFilter] = useState('all');

  // Sample data
  const appointments = [
    {
      appointID: 'APT001',
      bookingTitle: 'General Checkup',
      doctorName: 'Dr. Sarah Johnson',
      date: '2024-08-15',
      time: '10:00 AM',
      status: 'approved',
      hasRecord: true,
      recordId: 'REC001'
    },
    {
      appointID: 'APT002',
      bookingTitle: 'Follow-up Consultation',
      doctorName: 'Dr. Michael Chen',
      date: '2024-08-20',
      time: '2:30 PM',
      status: 'pending',
      hasRecord: false
    },
    {
      appointID: 'APT003',
      bookingTitle: 'Cardiology Consultation',
      doctorName: 'Dr. Emily Davis',
      date: '2024-08-10',
      time: '11:15 AM',
      status: 'rejected',
      hasRecord: false
    },
    {
      appointID: 'APT004',
      bookingTitle: 'Dermatology Checkup',
      doctorName: 'Dr. Lisa Wang',
      date: '2024-08-25',
      time: '9:00 AM',
      status: 'pending',
      hasRecord: false
    },
    {
      appointID: 'APT005',
      bookingTitle: 'Blood Test',
      doctorName: 'Dr. James Wilson',
      date: '2024-08-05',
      time: '8:30 AM',
      status: 'approved',
      hasRecord: true,
      recordId: 'REC002'
    }
  ];

  const medicalRecords = [
    {
      recordId: 'REC001',
      appointID: 'APT001',
      date: '2024-08-15',
      doctorName: 'Dr. Sarah Johnson',
      diagnosis: 'Mild hypertension, Vitamin D deficiency',
      instructions: 'Monitor blood pressure daily, increase physical activity to 30 minutes daily, maintain low-sodium diet, return for follow-up in 3 months.',
      prescriptions: [
        {
          medicine: 'Lisinopril 10mg',
          qty: 30,
          enableRefill: true,
          refillsLeft: 2,
          instructions: 'Take once daily in the morning'
        },
        {
          medicine: 'Vitamin D3 2000 IU',
          qty: 60,
          enableRefill: true,
          refillsLeft: 5,
          instructions: 'Take one capsule daily with food'
        },
        {
          medicine: 'Aspirin 81mg',
          qty: 90,
          enableRefill: false,
          refillsLeft: 0,
          instructions: 'Take once daily for cardiovascular protection'
        }
      ],
      images: [
        'https://via.placeholder.com/300x200/e3f2fd/1976d2?text=Blood+Test+Results',
        'https://via.placeholder.com/300x200/f3e5f5/7b1fa2?text=ECG+Report',
        'https://via.placeholder.com/300x200/e8f5e8/388e3c?text=X-Ray+Chest'
      ]
    },
    {
      recordId: 'REC002',
      appointID: 'APT005',
      date: '2024-08-05',
      doctorName: 'Dr. James Wilson',
      diagnosis: 'Normal blood work, slight iron deficiency',
      instructions: 'Continue current diet, add iron-rich foods, repeat blood work in 6 months.',
      prescriptions: [
        {
          medicine: 'Iron Supplement 65mg',
          qty: 90,
          enableRefill: true,
          refillsLeft: 3,
          instructions: 'Take one tablet daily with vitamin C'
        }
      ],
      images: [
        'https://via.placeholder.com/300x200/fef3c7/d97706?text=Blood+Panel+Results'
      ]
    }
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Reschedule functions
  const getAvailableDates = () => {
    const unavailableDates = [
      '2024-08-05', '2024-08-12', '2024-08-19', '2024-08-26',
      '2024-09-02', '2024-09-09', '2024-09-16', '2024-09-23', '2024-09-30'
    ];
    return unavailableDates;
  };

  const generateRescheduleCalendarDays = () => {
    const firstDayOfMonth = new Date(rescheduleYear, rescheduleMonth, 1);
    const lastDayOfMonth = new Date(rescheduleYear, rescheduleMonth + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    const today = new Date();
    const unavailableDates = getAvailableDates();

    const days = [];

    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(rescheduleYear, rescheduleMonth, day);
      const dateString = date.toISOString().split('T')[0];
      const isPast = date < today.setHours(0, 0, 0, 0);
      const isUnavailable = unavailableDates.includes(dateString);

      days.push({
        date: dateString,
        day: day,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isPast,
        isAvailable: !isPast && !isUnavailable
      });
    }

    return days;
  };

  const navigateRescheduleMonth = (direction) => {
    if (direction === 'next') {
      if (rescheduleMonth === 11) {
        setRescheduleMonth(0);
        setRescheduleYear(rescheduleYear + 1);
      } else {
        setRescheduleMonth(rescheduleMonth + 1);
      }
    } else {
      if (rescheduleMonth === 0) {
        setRescheduleMonth(11);
        setRescheduleYear(rescheduleYear - 1);
      } else {
        setRescheduleMonth(rescheduleMonth - 1);
      }
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleReschedule = (appointmentId) => {
    const appointment = appointments.find(apt => apt.appointID === appointmentId);
    setRescheduleModal(appointment);
    setRescheduleDate('');
    setRescheduleStartTime('');
    setRescheduleEndTime('');
    setRescheduleMonth(new Date().getMonth());
    setRescheduleYear(new Date().getFullYear());
  };

  const closeRescheduleModal = () => {
    setRescheduleModal(null);
    setRescheduleDate('');
    setRescheduleStartTime('');
    setRescheduleEndTime('');
  };

  const submitReschedule = () => {
    if (rescheduleDate && rescheduleStartTime && rescheduleEndTime) {
      alert(`Appointment ${rescheduleModal.appointID} rescheduled to ${rescheduleDate} from ${formatTime(rescheduleStartTime)} to ${formatTime(rescheduleEndTime)}`);
      closeRescheduleModal();
    }
  };

  // Get CSS class for calendar day
  const getCalendarDayClass = (day) => {
    let classes = ['calendar-day'];

    if (rescheduleDate === day.date) {
      classes.push('day-selected');
    } else if (day.isPast) {
      classes.push('day-past');
    } else if (day.isAvailable) {
      classes.push('day-available');
    } else {
      classes.push('day-unavailable');
    }

    return classes.join(' ');
  };

  // Filtered appointments based on search and filters
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const matchesSearch = appointmentSearch === '' ||
        appointment.bookingTitle.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
        appointment.doctorName.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
        appointment.appointID.toLowerCase().includes(appointmentSearch.toLowerCase());

      const matchesStatus = appointmentStatusFilter === 'all' ||
        appointment.status === appointmentStatusFilter;

      let matchesDate = true;
      if (appointmentDateFilter !== 'all') {
        const appointmentDate = new Date(appointment.date);
        const today = new Date();

        switch (appointmentDateFilter) {
          case 'upcoming':
            matchesDate = appointmentDate >= today;
            break;
          case 'past':
            matchesDate = appointmentDate < today;
            break;
          case 'this-week':
            const weekFromToday = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            matchesDate = appointmentDate >= today && appointmentDate <= weekFromToday;
            break;
          case 'this-month':
            matchesDate = appointmentDate.getMonth() === today.getMonth() &&
                         appointmentDate.getFullYear() === today.getFullYear();
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, appointmentSearch, appointmentStatusFilter, appointmentDateFilter]);

  // Filtered medical records based on search and filters
  const filteredRecords = useMemo(() => {
    return medicalRecords.filter(record => {
      const matchesSearch = recordSearch === '' ||
        record.diagnosis.toLowerCase().includes(recordSearch.toLowerCase()) ||
        record.doctorName.toLowerCase().includes(recordSearch.toLowerCase()) ||
        record.recordId.toLowerCase().includes(recordSearch.toLowerCase()) ||
        record.appointID.toLowerCase().includes(recordSearch.toLowerCase());

      let matchesDate = true;
      if (recordDateFilter !== 'all') {
        const recordDate = new Date(record.date);
        const today = new Date();

        switch (recordDateFilter) {
          case 'last-month':
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
            matchesDate = recordDate >= lastMonth;
            break;
          case 'last-3-months':
            const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3);
            matchesDate = recordDate >= threeMonthsAgo;
            break;
          case 'last-year':
            const lastYear = new Date(today.getFullYear() - 1, today.getMonth());
            matchesDate = recordDate >= lastYear;
            break;
          case 'this-year':
            matchesDate = recordDate.getFullYear() === today.getFullYear();
            break;
        }
      }

      return matchesSearch && matchesDate;
    });
  }, [medicalRecords, recordSearch, recordDateFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle style={{ width: '20px', height: '20px', color: '#10b981' }} />;
      case 'rejected':
        return <XCircle style={{ width: '20px', height: '20px', color: '#ef4444' }} />;
      case 'pending':
        return <Clock style={{ width: '20px', height: '20px', color: '#f59e0b' }} />;
      default:
        return <AlertCircle style={{ width: '20px', height: '20px', color: '#6b7280' }} />;
    }
  };

  const handleRefillRequest = (medicine) => {
    alert(`Refill request submitted for ${medicine}`);
  };

  const clearAllFilters = () => {
    if (activeTab === 'appointments') {
      setAppointmentSearch('');
      setAppointmentStatusFilter('all');
      setAppointmentDateFilter('all');
    } else {
      setRecordSearch('');
      setRecordDateFilter('all');
    }
  };

  const AppointmentCard = ({ appointment }) => (
    <div className="appointment-card">
      <div className="card-header">
        <div className="appointment-info">
          <h3 className="appointment-title">{appointment.bookingTitle}</h3>
          <p className="appointment-id">ID: {appointment.appointID}</p>
          <p className="doctor-name">{appointment.doctorName}</p>
        </div>
        <div className="status-container">
          {getStatusIcon(appointment.status)}
          <span className={`status-badge status-${appointment.status}`}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="appointment-details">
        <div className="combined-datetime">
          <Calendar style={{ width: '16px', height: '16px' }} />
          <span>{appointment.date}</span>
          <span className="datetime-separator">•</span>
          <Clock style={{ width: '16px', height: '16px' }} />
          <span>{appointment.time}</span>
        </div>
      </div>

      <div className="appointment-actions">
        {appointment.hasRecord && (
          <button
            onClick={() => setSelectedRecord(medicalRecords.find(r => r.recordId === appointment.recordId))}
            className="view-record-btn"
          >
            <FileText style={{ width: '16px', height: '16px' }} />
            <span>View Medical Record</span>
          </button>
        )}

        {(appointment.status === 'pending' || appointment.status === 'approved') && (
          <button
            onClick={() => handleReschedule(appointment.appointID)}
            className="reschedule-btn"
          >
            <Edit3 style={{ width: '16px', height: '16px' }} />
            <span>Reschedule</span>
          </button>
        )}
      </div>
    </div>
  );

  const RescheduleModal = ({ appointment, onClose }) => {
    // Track if we should auto-scroll (only when date is newly selected, not month navigation)
    const [shouldAutoScroll, setShouldAutoScroll] = React.useState(false);

    // Auto-scroll to time section when date is selected (but not during month navigation)
    React.useEffect(() => {
      if (rescheduleDate && shouldAutoScroll) {
        const timeSection = document.getElementById('time-selection-section');
        if (timeSection) {
          setTimeout(() => {
            timeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
        setShouldAutoScroll(false); // Reset flag after scrolling
      }
    }, [rescheduleDate, shouldAutoScroll]);

    return (
      <div className="modal-overlay">
        <div className="modal-content" style={{ maxWidth: '1100px', maxHeight: '95vh', position: 'relative' }}>
          <div className="modal-header">
            <div>
              <h2 className="modal-title">Reschedule Appointment</h2>
              <div className="record-info">
                <p>{appointment.bookingTitle} with {appointment.doctorName}</p>
                <p>Current: {appointment.date} at {appointment.time}</p>
              </div>
            </div>
            <button onClick={onClose} className="close-btn">×</button>
          </div>

          {/* Fixed container to prevent jumping during month navigation */}
          <div className="modal-body" style={{ scrollBehavior: 'auto' }}>
            {/* Step Progress Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: rescheduleDate ? '#10b981' : '#3b82f6',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  <Calendar style={{ width: '16px', height: '16px' }} />
                  <span>{rescheduleDate ? 'Date Selected' : 'Select Date'}</span>
                </div>
                <div style={{ width: '24px', height: '2px', background: rescheduleDate ? '#10b981' : '#d1d5db' }}></div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: rescheduleDate ? (rescheduleStartTime && rescheduleEndTime ? '#10b981' : '#3b82f6') : '#e5e7eb',
                  color: rescheduleDate ? 'white' : '#9ca3af',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  <Clock style={{ width: '16px', height: '16px' }} />
                  <span>{rescheduleStartTime && rescheduleEndTime ? 'Time Selected' : 'Select Time'}</span>
                </div>
              </div>
              {rescheduleDate && rescheduleStartTime && rescheduleEndTime && (
                <div style={{ marginLeft: 'auto', color: '#059669', fontWeight: '500', fontSize: '14px' }}>
                  Ready to confirm!
                </div>
              )}
            </div>

            {/* Main Content - Fixed height container to prevent shifting */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: rescheduleDate ? '1fr 1fr' : '1fr',
              gap: '24px',
              minHeight: '450px', // Fixed minimum height
              alignItems: 'start' // Align to top to prevent jumping
            }}>

              {/* Calendar Section */}
              <div className="section">
                <h3 className="section-title">
                  <Calendar style={{ width: '20px', height: '20px', color: '#3b82f6', marginRight: '8px' }} />
                  Select New Date
                </h3>

                <div className="calendar-container" style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
                  {/* Calendar Header - Fixed positioning */}
                  <div className="calendar-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigateRescheduleMonth('prev');
                      }}
                      className="nav-btn"
                      style={{
                        padding: '8px',
                        border: 'none',
                        background: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                      onMouseLeave={(e) => e.target.style.background = 'white'}
                    >
                      <ChevronLeft style={{ width: '20px', height: '20px' }} />
                    </button>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', minWidth: '180px', textAlign: 'center' }}>
                      {monthNames[rescheduleMonth]} {rescheduleYear}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigateRescheduleMonth('next');
                      }}
                      className="nav-btn"
                      style={{
                        padding: '8px',
                        border: 'none',
                        background: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                      onMouseLeave={(e) => e.target.style.background = 'white'}
                    >
                      <ChevronRight style={{ width: '20px', height: '20px' }} />
                    </button>
                  </div>

                  {/* Week Days */}
                  <div className="calendar-weekdays">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="weekday">{day}</div>
                    ))}
                  </div>

                  {/* Calendar Grid - Fixed height to prevent shifting */}
                  <div className="calendar-grid" style={{ minHeight: '240px' }}>
                    {generateRescheduleCalendarDays().map((day, index) => (
                      <div key={index} className="calendar-cell">
                        {day ? (
                          <button
                            onClick={() => {
                              if (day.isAvailable) {
                                setRescheduleDate(day.date);
                                setRescheduleStartTime('');
                                setRescheduleEndTime('');
                                setShouldAutoScroll(true); // Trigger auto-scroll only when date is selected
                              }
                            }}
                            disabled={!day.isAvailable}
                            className={getCalendarDayClass(day)}
                          >
                            {day.day}
                          </button>
                        ) : (
                          <div className="calendar-empty"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Legend */}
                  <div className="calendar-legend">
                    <div className="legend-item">
                      <div className="legend-color available"></div>
                      <span className="legend-text">Available</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color unavailable"></div>
                      <span className="legend-text">Unavailable</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color selected"></div>
                      <span className="legend-text">Selected</span>
                    </div>
                  </div>

                  {/* Selected Date Display */}
                  {rescheduleDate && (
                    <div style={{ marginTop: '16px', padding: '12px', background: '#dbeafe', borderRadius: '6px', textAlign: 'center' }}>
                      <p style={{ margin: 0, color: '#1e40af', fontWeight: '500' }}>
                        Selected: {new Date(rescheduleDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Time Selection - Only show when date is selected */}
              {rescheduleDate && (
                <div id="time-selection-section" className="section">
                  <h3 className="section-title">
                    <Clock style={{ width: '20px', height: '20px', color: '#3b82f6', marginRight: '8px' }} />
                    Select New Time Range
                  </h3>

                  <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
                    {/* Quick Time Slots */}
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px', color: '#374151' }}>Quick Select (1 hour slots):</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
                        {['09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'].map((slot) => {
                          const [start, end] = slot.split('-');
                          return (
                            <button
                              key={slot}
                              onClick={() => {
                                setRescheduleStartTime(start);
                                setRescheduleEndTime(end);
                              }}
                              className={`quick-time-slot ${
                                (rescheduleStartTime === start && rescheduleEndTime === end) ? 'selected' : ''
                              }`}
                            >
                              {formatTime(start)} - {formatTime(end)}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Time Selection */}
                    <div className="time-range-container">
                      <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '16px', color: '#374151' }}>Or choose custom times:</p>
                      <div className="time-grid-wrapper">
                        {/* Start Time */}
                        <div className="time-column">
                          <label className="time-label">Start Time</label>
                          <div className="time-slot-grid">
                            {timeSlots.map((time) => (
                              <button
                                key={`start-${time}`}
                                onClick={() => setRescheduleStartTime(time)}
                                disabled={rescheduleEndTime && time >= rescheduleEndTime}
                                className={`time-slot-btn ${
                                  rescheduleStartTime === time ? 'selected' : ''
                                } ${
                                  (rescheduleEndTime && time >= rescheduleEndTime) ? 'disabled' : ''
                                }`}
                              >
                                {formatTime(time)}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* End Time */}
                        <div className="time-column">
                          <label className="time-label">End Time</label>
                          <div className="time-slot-grid">
                            {timeSlots.map((time) => (
                              <button
                                key={`end-${time}`}
                                onClick={() => setRescheduleEndTime(time)}
                                disabled={!rescheduleStartTime || time <= rescheduleStartTime}
                                className={`time-slot-btn ${
                                  rescheduleEndTime === time ? 'selected' : ''
                                } ${
                                  (!rescheduleStartTime || time <= rescheduleStartTime) ? 'disabled' : ''
                                }`}
                              >
                                {formatTime(time)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fixed Bottom Action Bar */}
            {rescheduleDate && rescheduleStartTime && rescheduleEndTime && (
              <div className="time-summary">
                <div className="summary-info">
                  <div className="summary-time">
                    <p style={{ color: '#1e40af', fontWeight: '600', margin: 0, fontSize: '16px' }}>
                      📅 {new Date(rescheduleDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      at {formatTime(rescheduleStartTime)} - {formatTime(rescheduleEndTime)}
                    </p>
                    <p className="summary-duration">
                      Duration: {((parseInt(rescheduleEndTime.split(':')[0]) * 60 + parseInt(rescheduleEndTime.split(':')[1])) -
                                 (parseInt(rescheduleStartTime.split(':')[0]) * 60 + parseInt(rescheduleStartTime.split(':')[1]))) / 60} hours
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => {
                        setRescheduleDate('');
                        setRescheduleStartTime('');
                        setRescheduleEndTime('');
                        setShouldAutoScroll(false); // Reset auto-scroll flag
                      }}
                      style={{
                        padding: '10px 20px',
                        background: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        color: '#374151'
                      }}
                    >
                      Start Over
                    </button>
                    <button
                      onClick={submitReschedule}
                      className="btn-continue"
                    >
                      <Save style={{ width: '18px', height: '18px', marginRight: '8px' }} />
                      Confirm Reschedule
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const SearchAndFilter = () => (
    <div className="search-filter-container">
      <div className="search-section">
        <div className="search-input-container">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder={activeTab === 'appointments' ? 'Search appointments, doctors, or ID...' : 'Search records, diagnosis, or doctor...'}
            className="search-input"
            value={activeTab === 'appointments' ? appointmentSearch : recordSearch}
            onChange={(e) => activeTab === 'appointments' ? setAppointmentSearch(e.target.value) : setRecordSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-group">
          <Filter className="filter-icon" size={16} />
          <span className="filter-label">Filters:</span>

          {activeTab === 'appointments' ? (
            <>
              <select
                value={appointmentStatusFilter}
                onChange={(e) => setAppointmentStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={appointmentDateFilter}
                onChange={(e) => setAppointmentDateFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Dates</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
              </select>
            </>
          ) : (
            <select
              value={recordDateFilter}
              onChange={(e) => setRecordDateFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Dates</option>
              <option value="last-month">Last Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="last-year">Last Year</option>
              <option value="this-year">This Year</option>
            </select>
          )}

          <button onClick={clearAllFilters} className="clear-filters-btn">
            <RotateCcw size={14} />
            Clear
          </button>
        </div>
      </div>
    </div>
  );

  const ResultsCount = () => {
    const count = activeTab === 'appointments' ? filteredAppointments.length : filteredRecords.length;
    const total = activeTab === 'appointments' ? appointments.length : medicalRecords.length;

    return (
      <div className="results-count">
        Showing {count} of {total} {activeTab === 'appointments' ? 'appointments' : 'records'}
        {(appointmentSearch || recordSearch || appointmentStatusFilter !== 'all' || appointmentDateFilter !== 'all' || recordDateFilter !== 'all') &&
          <span className="filtered-indicator"> (filtered)</span>
        }
      </div>
    );
  };

  const MedicalRecordModal = ({ record, onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Medical Record</h2>
            <div className="record-info">
              <p>Record ID: {record.recordId} | Appointment: {record.appointID}</p>
              <p>Date: {record.date} | Doctor: {record.doctorName}</p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="modal-body">
          {/* Diagnosis */}
          <div className="section">
            <h3 className="section-title">
              <FileText style={{ width: '20px', height: '20px', color: '#3b82f6', marginRight: '8px' }} />
              Diagnosis
            </h3>
            <div className="diagnosis-box">
              <p>{record.diagnosis}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="section">
            <h3 className="section-title">
              <AlertCircle style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px' }} />
              Instructions
            </h3>
            <div className="instructions-box">
              <p>{record.instructions}</p>
            </div>
          </div>

          {/* Prescriptions */}
          <div className="section">
            <h3 className="section-title">
              <Pill style={{ width: '20px', height: '20px', color: '#8b5cf6', marginRight: '8px' }} />
              Prescriptions ({record.prescriptions.length} medications)
            </h3>
            <div className="prescriptions-grid">
              {record.prescriptions.map((prescription, index) => (
                <div key={index} className="prescription-card">
                  <div className="prescription-header">
                    <div>
                      <h4 className="medicine-name">{prescription.medicine}</h4>
                      <p className="medicine-instructions">{prescription.instructions}</p>
                    </div>
                    <div className="prescription-details">
                      <p>Qty: {prescription.qty}</p>
                      {prescription.enableRefill && (
                        <p className="refills-left">Refills left: {prescription.refillsLeft}</p>
                      )}
                    </div>
                  </div>

                  {prescription.enableRefill && prescription.refillsLeft > 0 ? (
                    <button
                      onClick={() => handleRefillRequest(prescription.medicine)}
                      className="refill-btn"
                    >
                      <RefreshCw style={{ width: '16px', height: '16px' }} />
                      <span>Request Refill</span>
                    </button>
                  ) : (
                    <div className="no-refill">
                      <XCircle style={{ width: '16px', height: '16px' }} />
                      <span>No refills available</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          {record.images && record.images.length > 0 && (
            <div className="section">
              <h3 className="section-title">
                <Camera style={{ width: '20px', height: '20px', color: '#f97316', marginRight: '8px' }} />
                Medical Images ({record.images.length} files)
              </h3>
              <div className="images-grid">
                {record.images.map((image, index) => (
                  <div key={index} className="image-container">
                    <img
                      src={image}
                      alt={`Medical image ${index + 1}`}
                      className="medical-image"
                      onClick={() => setImageModal(image)}
                    />
                    <div className="image-overlay">
                      <button
                        onClick={() => setImageModal(image)}
                        className="image-btn"
                      >
                        <Download style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ImageModal = ({ image, onClose }) => (
    <div className="image-modal-overlay">
      <div className="image-modal-content">
        <button onClick={onClose} className="image-close-btn">×</button>
        <img src={image} alt="Medical image" className="full-image" />
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        /* BookAppointment.css - Healthcare Theme */

        /* Reset and Base Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          line-height: 1.6;
          color: #374151;
          background-color: #f9fafb;
        }

        .dashboard-container {
          min-height: 100vh;
          background-color: #f9fafb;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 16px;
        }

        .main-title {
          font-size: 30px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 32px;
        }

        .tab-navigation {
          display: flex;
          background-color: #e5e7eb;
          padding: 4px;
          border-radius: 8px;
          width: fit-content;
          margin-bottom: 32px;
        }

        .tab-btn {
          padding: 8px 24px;
          border-radius: 6px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
        }

        .tab-btn.active {
          background-color: white;
          color: #2563eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .tab-btn:not(.active) {
          color: #4b5563;
        }

        .tab-btn:not(.active):hover {
          color: #1f2937;
        }

        .search-filter-container {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .search-section {
          margin-bottom: 16px;
        }

        .search-input-container {
          position: relative;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .search-input {
          width: 100%;
          padding: 12px 12px 12px 44px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .filter-section {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-icon {
          color: #6b7280;
        }

        .filter-label {
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background-color: white;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .filter-select:focus {
          outline: none;
          border-color: #2563eb;
        }

        .clear-filters-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background-color: white;
          color: #6b7280;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-filters-btn:hover {
          background-color: #f9fafb;
          color: #374151;
        }

        .results-count {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 16px;
        }

        .filtered-indicator {
          color: #2563eb;
          font-weight: 500;
        }

        .section-title-main {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 24px;
        }

        .appointment-card, .record-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
          margin-bottom: 16px;
          border-left: 4px solid #3b82f6;
        }

        .record-card {
          border-left-color: #10b981;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .appointment-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .appointment-id, .doctor-name {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 2px;
        }

        .status-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-approved {
          background-color: #dcfce7;
          color: #166534;
        }

        .status-rejected {
          background-color: #fecaca;
          color: #991b1b;
        }

        .status-pending {
          background-color: #fef3c7;
          color: #92400e;
        }

        .appointment-details {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .combined-datetime {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #f3f4f6;
          padding: 8px 12px;
          border-radius: 8px;
          color: #6b7280;
          font-size: 14px;
          width: fit-content;
        }

        .datetime-separator {
          color: #9ca3af;
          margin: 0 4px;
        }

        .appointment-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .view-record-btn, .refill-btn, .reschedule-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
        }

        .view-record-btn {
          background-color: #3b82f6;
          color: white;
        }

        .view-record-btn:hover {
          background-color: #2563eb;
        }

        .reschedule-btn {
          background-color: #f59e0b;
          color: white;
        }

        .reschedule-btn:hover {
          background-color: #d97706;
        }

        .refill-btn {
          background-color: #10b981;
          color: white;
        }

        .refill-btn:hover {
          background-color: #059669;
        }

        .record-card .view-record-btn {
          background-color: #10b981;
        }

        .record-card .view-record-btn:hover {
          background-color: #059669;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          max-width: 1024px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
        }

        .record-info {
          margin-top: 8px;
          color: #6b7280;
          font-size: 14px;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #6b7280;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          color: #374151;
        }

        .modal-body {
          padding: 24px;
        }

        .section {
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
        }

        .diagnosis-box {
          background-color: #eff6ff;
          padding: 16px;
          border-radius: 8px;
        }

        .instructions-box {
          background-color: #f0fdf4;
          padding: 16px;
          border-radius: 8px;
        }

        .prescriptions-grid {
          display: grid;
          gap: 16px;
        }

        .prescription-card {
          background-color: #faf5ff;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #e9d5ff;
        }

        .prescription-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .medicine-name {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .medicine-instructions {
          font-size: 14px;
          color: #6b7280;
        }

        .prescription-details {
          text-align: right;
          font-size: 14px;
        }

        .refills-left {
          color: #059669;
        }

        .no-refill {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #6b7280;
          font-size: 14px;
        }

        .images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .image-container {
          position: relative;
          group: image;
        }

        .medical-image {
          width: 100%;
          height: 160px;
          object-fit: cover;
          border-radius: 8px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .medical-image:hover {
          opacity: 0.8;
        }

        .image-overlay {
          position: absolute;
          top: 8px;
          right: 8px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .image-container:hover .image-overlay {
          opacity: 1;
        }

        .image-btn {
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          padding: 8px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-btn:hover {
          background-color: rgba(0, 0, 0, 0.7);
        }

        .image-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 1000;
        }

        .image-modal-content {
          position: relative;
          max-width: 1024px;
          max-height: 90vh;
        }

        .image-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 20px;
        }

        .image-close-btn:hover {
          background-color: rgba(0, 0, 0, 0.7);
        }

        .full-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
        }

        /* Calendar Styles */
        .calendar-container {
          background: #f8fafc;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
        }

        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .nav-btn {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-btn:hover {
          background-color: #f3f4f6;
          border-color: #2563eb;
        }

        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }

        .weekday {
          text-align: center;
          font-weight: 600;
          color: #6b7280;
          padding: 8px;
          font-size: 14px;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
        }

        .calendar-cell {
          aspect-ratio: 1;
          position: relative;
        }

        .calendar-day {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid transparent;
          font-size: 14px;
        }

        .day-past {
          color: #d1d5db !important;
          cursor: not-allowed !important;
          background-color: #f9fafb !important;
          border-color: #f3f4f6 !important;
        }

        .day-available {
          background-color: #d1fae5 !important;
          color: #065f46 !important;
          border-color: #34d399 !important;
        }

        .day-available:hover {
          background-color: #a7f3d0 !important;
          border-color: #10b981 !important;
          transform: scale(1.05) !important;
        }

        .day-unavailable {
          background-color: #fef2f2 !important;
          color: #ef4444 !important;
          cursor: not-allowed !important;
          border-color: #fecaca !important;
        }

        .day-selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
          border-color: #4f46e5 !important;
          transform: scale(1.1) !important;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
          font-weight: 600 !important;
        }

        .calendar-empty {
          height: 100%;
        }

        .calendar-legend {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
        }

        .legend-color.available {
          background-color: #d1fae5;
          border-color: #34d399;
        }

        .legend-color.unavailable {
          background-color: #fef2f2;
          border-color: #fecaca;
        }

        .legend-color.selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #4f46e5;
        }

        .legend-text {
          font-size: 14px;
          color: #6b7280;
        }

        /* Time Range Selection */
        .time-range-container {
          margin-top: 32px;
        }

        .time-grid-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .time-column {
          background: #f8fafc;
          padding: 20px;
          border-radius: 12px;
        }

        .time-label {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 16px;
          display: block;
        }

        .time-slot-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          max-height: 240px;
          overflow-y: auto;
          padding-right: 8px;
        }

        .time-slot-btn {
          padding: 12px 8px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #374151;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .time-slot-btn:hover:not(.disabled) {
          border-color: #2563eb;
          background-color: #eff6ff;
        }

        .time-slot-btn.selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #4f46e5;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .time-slot-btn.disabled {
          background-color: #f9fafb;
          color: #d1d5db;
          cursor: not-allowed;
          border-color: #f3f4f6;
        }

        .time-summary {
          margin-top: 24px;
          padding: 20px;
          background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
          border-radius: 12px;
          border: 1px solid #bfdbfe;
        }

        .summary-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .summary-time {
          flex: 1;
        }

        .summary-duration {
          font-size: 14px;
          color: #2563eb;
          margin-top: 4px;
        }

        .btn-continue {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-continue:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        /* Quick time slot styles */
        .quick-time-slot {
          padding: 10px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #374151;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .quick-time-slot:hover {
          border-color: #2563eb;
          background-color: #eff6ff;
        }

        .quick-time-slot.selected {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-color: #059669;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }

        @media (max-width: 768px) {
          .container {
            padding: 16px 8px;
          }

          .card-header {
            flex-direction: column;
            gap: 12px;
          }

          .appointment-details {
            flex-direction: column;
            gap: 8px;
          }

          .combined-datetime {
            width: 100%;
            justify-content: flex-start;
          }

          .appointment-actions {
            flex-direction: column;
            gap: 8px;
          }

          .prescription-header {
            flex-direction: column;
            gap: 8px;
          }

          .images-grid {
            grid-template-columns: 1fr;
          }

          .filter-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .filter-group {
            flex-wrap: wrap;
            gap: 8px;
          }

          .time-grid-wrapper {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .time-slot-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .calendar-legend {
            flex-direction: column;
            align-items: center;
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .time-slot-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <div className="container">
          <h1 className="main-title">Patient Dashboard</h1>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`tab-btn ${activeTab === 'records' ? 'active' : ''}`}
            >
              Medical Records
            </button>
          </div>

          {/* Search and Filter Component */}
          <SearchAndFilter />

          {/* Results Count */}
          <ResultsCount />

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div>
              <h2 className="section-title-main">My Appointments</h2>
              <div>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.appointID} appointment={appointment} />
                  ))
                ) : (
                  <div style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    <AlertCircle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <p>No appointments found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Medical Records Tab */}
          {activeTab === 'records' && (
            <div>
              <h2 className="section-title-main">Medical Records</h2>
              <div>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <div key={record.recordId} className="record-card">
                      <div className="card-header">
                        <div className="appointment-info">
                          <h3 className="appointment-title">Medical Record #{record.recordId}</h3>
                          <p className="appointment-id">Appointment: {record.appointID}</p>
                          <p className="doctor-name">{record.doctorName}</p>
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '14px' }}>
                          {record.date}
                        </div>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <p style={{ fontWeight: '500', color: '#374151' }}>Diagnosis:</p>
                        <p style={{ color: '#6b7280' }}>{record.diagnosis}</p>
                      </div>

                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="view-record-btn"
                      >
                        <FileText style={{ width: '16px', height: '16px' }} />
                        <span>View Full Record</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <p>No medical records found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reschedule Modal */}
          {rescheduleModal && (
            <RescheduleModal
              appointment={rescheduleModal}
              onClose={closeRescheduleModal}
            />
          )}

          {/* Medical Record Modal */}
          {selectedRecord && (
            <MedicalRecordModal
              record={selectedRecord}
              onClose={() => setSelectedRecord(null)}
            />
          )}

          {/* Image Modal */}
          {imageModal && (
            <ImageModal
              image={imageModal}
              onClose={() => setImageModal(null)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PatientDashboard;