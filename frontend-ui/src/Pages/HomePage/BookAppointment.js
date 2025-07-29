import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, MapPin, Check } from 'lucide-react';
import './css/BookAppointment.css';
import PatientHeader from '../../Components/PatientHeader';
import PatientFooter from '../../Components/PatientFooter';

const PatientAppointmentBooking = () => {
  const [currentStep, setCurrentStep] = useState('department'); // initial, department, doctor, calendar, booking-details, confirmation
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [bookingTitle, setBookingTitle] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const departments = [
    { id: 'cardiology', name: 'Cardiology', icon: '❤️' },
    { id: 'dermatology', name: 'Dermatology', icon: '🫧' },
    { id: 'pediatrics', name: 'Pediatrics', icon: '👶' },
    { id: 'orthopedics', name: 'Orthopedics', icon: '🦴' },
    { id: 'neurology', name: 'Neurology', icon: '🧠' },
    { id: 'ophthalmology', name: 'Ophthalmology', icon: '👁️' }
  ];

  const doctors = {
    cardiology: [
      { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Interventional Cardiology', rating: 4.9 },
      { id: 2, name: 'Dr. Michael Chen', specialty: 'Heart Surgery', rating: 4.8 }
    ],
    dermatology: [
      { id: 3, name: 'Dr. Emily Davis', specialty: 'Cosmetic Dermatology', rating: 4.9 },
      { id: 4, name: 'Dr. James Wilson', specialty: 'Medical Dermatology', rating: 4.7 }
    ],
    pediatrics: [
      { id: 5, name: 'Dr. Lisa Brown', specialty: 'General Pediatrics', rating: 4.8 },
      { id: 6, name: 'Dr. Robert Taylor', specialty: 'Pediatric Emergency', rating: 4.9 }
    ],
    orthopedics: [
      { id: 7, name: 'Dr. David Miller', specialty: 'Sports Medicine', rating: 4.7 },
      { id: 8, name: 'Dr. Jennifer Lee', specialty: 'Joint Replacement', rating: 4.8 }
    ],
    neurology: [
      { id: 9, name: 'Dr. Mark Anderson', specialty: 'Stroke Specialist', rating: 4.9 },
      { id: 10, name: 'Dr. Rachel Green', specialty: 'Epilepsy Specialist', rating: 4.8 }
    ],
    ophthalmology: [
      { id: 11, name: 'Dr. Thomas White', specialty: 'Retina Specialist', rating: 4.7 },
      { id: 12, name: 'Dr. Maria Garcia', specialty: 'Cataract Surgery', rating: 4.9 }
    ]
  };

  const commonReasons = {
    cardiology: [
      'Chest Pain Consultation',
      'Heart Check-up',
      'Blood Pressure Management',
      'Heart Rhythm Issues',
      'Cardiac Follow-up',
      'Pre-surgery Consultation'
    ],
    dermatology: [
      'Skin Examination',
      'Acne Treatment',
      'Mole Check',
      'Rash Consultation',
      'Cosmetic Consultation',
      'Skin Cancer Screening'
    ],
    pediatrics: [
      'Child Wellness Check',
      'Vaccination',
      'Growth Assessment',
      'Fever/Illness',
      'Behavioral Concerns',
      'School Physical'
    ],
    orthopedics: [
      'Joint Pain Consultation',
      'Sports Injury',
      'Back Pain Treatment',
      'Fracture Follow-up',
      'Physical Therapy Evaluation',
      'Pre-surgery Consultation'
    ],
    neurology: [
      'Headache Consultation',
      'Memory Issues',
      'Seizure Evaluation',
      'Nerve Pain',
      'Movement Disorders',
      'Neurological Examination'
    ],
    ophthalmology: [
      'Eye Examination',
      'Vision Problems',
      'Eye Pain/Irritation',
      'Cataract Consultation',
      'Glaucoma Check',
      'Contact Lens Fitting'
    ]
  };

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  // Mock data for available dates (in real app, this would come from API)
  const getAvailableDates = () => {
    const unavailableDates = [
      '2025-08-05', '2025-08-12', '2025-08-19', '2025-08-26',
      '2025-09-02', '2025-09-09', '2025-09-16', '2025-09-23', '2025-09-30'
    ];
    return unavailableDates;
  };

  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    const today = new Date();
    const unavailableDates = getAvailableDates();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
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

  const navigateMonth = (direction) => {
    if (direction === 'next') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    } else {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleBookAppointment = () => {
    setCurrentStep('department');
  };

  const handleDepartmentSelect = (deptId) => {
    setSelectedDepartment(deptId);
    setCurrentStep('doctor');
  };

  const handleDoctorSelect = (doctorId) => {
    setSelectedDoctor(doctorId);
    setCurrentStep('calendar');
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeRangeComplete = () => {
    if (selectedStartTime && selectedEndTime) {
      setCurrentStep('booking-details');
    }
  };

  const handleBookingDetailsComplete = () => {
    if (bookingTitle.trim()) {
      setCurrentStep('confirmation');
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleBack = () => {
    if (currentStep === 'department') setCurrentStep('initial');
    else if (currentStep === 'doctor') setCurrentStep('department');
    else if (currentStep === 'calendar') setCurrentStep('doctor');
    else if (currentStep === 'booking-details') setCurrentStep('calendar');
    else if (currentStep === 'confirmation') setCurrentStep('booking-details');
  };

  const resetBooking = () => {
    setCurrentStep('initial');
    setSelectedDepartment('');
    setSelectedDoctor('');
    setSelectedDate('');
    setSelectedStartTime('');
    setSelectedEndTime('');
    setBookingTitle('');
    setBookingNotes('');
    setCurrentMonth(new Date().getMonth());
    setCurrentYear(new Date().getFullYear());
  };

  const selectedDoctorInfo = selectedDoctor ?
    Object.values(doctors).flat().find(doc => doc.id === parseInt(selectedDoctor)) : null;

  return (
  <div>
          {/* Header */}
          <PatientHeader />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="booking-header-section">
          <h1 className="booking-main-title">Book Your Appointment</h1>
            <p className="booking-subtitle">Schedule your visit with our expert medical professionals</p>
        </div>

        {/* Progress Indicator */}
        {currentStep !== 'initial' && (
            <div className="stepper-container">
              <div className="stepper-inner-wrapper">
                <div className={`stepper-step-circle ${
                  ['department', 'doctor', 'calendar', 'booking-details', 'confirmation'].includes(currentStep)
                    ? 'active' : 'inactive'
                }`}>1</div>
                <div className="stepper-line"></div>
                <div className={`stepper-step-circle ${
                  ['doctor', 'calendar', 'booking-details', 'confirmation'].includes(currentStep)
                    ? 'active' : 'inactive'
                }`}>2</div>
                <div className="stepper-line"></div>
                <div className={`stepper-step-circle ${
                  ['calendar', 'booking-details', 'confirmation'].includes(currentStep)
                    ? 'active' : 'inactive'
                }`}>3</div>
                <div className="stepper-line"></div>
                <div className={`stepper-step-circle ${
                  ['booking-details', 'confirmation'].includes(currentStep)
                    ? 'active' : 'inactive'
                }`}>4</div>
                <div className="stepper-line"></div>
                <div className={`stepper-step-circle ${
                  currentStep === 'confirmation'
                    ? 'active' : 'inactive'
                }`}>5</div>
              </div>
            </div>
          )}

        {/* Back Button */}
        {currentStep !== 'initial' && currentStep !== 'confirmation' && (
          <div className="back-button-container"> {/* Added a container for better layout control if needed */}
            <button
              onClick={handleBack}
              className="back-button"
            >
              {/* Assuming ChevronLeft is an SVG component or an icon */}
              <ChevronLeft className="back-button-icon" />
              Back
            </button>
          </div>
        )}

        {/* Initial Page */}
        {currentStep === 'initial' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-blue-900 mb-2">Ready to Book?</h2>
                <p className="text-gray-600">Get started by selecting your preferred department and doctor</p>
              </div>
              <button
                onClick={handleBookAppointment}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Book Appointment
              </button>
            </div>
          </div>
        )}

        {/* Department Selection */}
{currentStep === 'department' && (
  <div className="department-section max-w-4xl mx-auto">
    <h2 className="department-title">Select Department</h2>
    <div className="department-grid">
      {departments.map((dept) => (
        <div
          key={dept.id}
          onClick={() => handleDepartmentSelect(dept.id)}
          className="department-card"
        >
          <div className="text-center">
            <div className="department-icon">{dept.icon}</div>
            <h3 className="department-name">{dept.name}</h3>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
        {/* Doctor Selection */}
        {currentStep === 'doctor' && (
          <div className="doctor-selection-container">
            <h2 className="doctor-selection-title">
              Select Doctor - {departments.find(d => d.id === selectedDepartment)?.name}
            </h2>
            <div className="doctor-grid">
              {doctors[selectedDepartment]?.map((doctor) => (
                <div
                  key={doctor.id}
                  onClick={() => handleDoctorSelect(doctor.id)}
                  className="doctor-card"
                >
                  <div className="doctor-info">
                    <div className="doctor-avatar">
                      <User className="doctor-icon" />
                    </div>
                    <div className="doctor-details">
                      <h3 className="doctor-name">{doctor.name}</h3>
                      <p className="doctor-specialty">{doctor.specialty}</p>
                      <div className="doctor-rating">
                        <span className="star-icon">⭐</span>
                        <span className="rating-score">{doctor.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar Selection */}
        {currentStep === 'calendar' && (
          <div className="calendar-section max-w-4xl mx-auto">
            <h2 className="calendar-title">
              Select Date & Time with {selectedDoctorInfo?.name}
            </h2>

            <div className="calendar-container">
              {/* Header */}
              <div className="calendar-header">
                <button onClick={() => navigateMonth('prev')} className="nav-btn">
                  <ChevronLeft className="nav-icon" />
                </button>
                <h3 className="calendar-month">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                <button onClick={() => navigateMonth('next')} className="nav-btn">
                  <ChevronRight className="nav-icon" />
                </button>
              </div>

              {/* Week Days */}
              <div className="calendar-weekdays">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="weekday">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="calendar-grid">
                {generateCalendarDays().map((day, index) => (
                  <div key={index} className="calendar-cell">
                    {day ? (
                      <div
                        onClick={() => day.isAvailable ? handleDateSelect(day.date) : null}
                        className={`calendar-day
                          ${day.isPast ? 'day-past' : ''}
                          ${day.isAvailable ? 'day-available' : 'day-unavailable'}
                          ${selectedDate === day.date ? 'day-selected' : ''}
                        `}
                      >
                        {day.day}
                      </div>
                    ) : (
                      <div className="calendar-empty"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="calendar-legend">
                <div className="legend-item">
                  <div className="legend-color available"></div> {/* Added specific class for available color */}
                  <span className="legend-text">Available</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color unavailable"></div> {/* Added specific class for unavailable color */}
                  <span className="legend-text">Unavailable</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color selected"></div> {/* Added specific class for selected color */}
                  <span className="legend-text">Selected</span>
                </div>
              </div>
            </div>


            {/* Time Range Selection */}
            {selectedDate && (
              <div className="bg-white rounded-xl p-6 shadow-lg time-range-container">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 time-range-title">Select Time Range</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 time-grid-wrapper">
                  {/* Start Time */}
                  <div className="time-column">
                    <label className="block text-sm font-medium text-blue-900 mb-3 time-label">Start Time</label>
                    <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto time-slot-grid">
                      {timeSlots.map((time) => (
                        <button
                                      key={`start-${time}`}
                                      onClick={() => setSelectedStartTime(time)}
                                      disabled={selectedEndTime && time >= selectedEndTime}
                                      className={`time-slot-btn ${
                                        selectedStartTime === time
                                          ? 'selected'
                                          : selectedEndTime && time >= selectedEndTime
                                          ? 'disabled'
                                          : ''
                                      }`}
                                    >
                                      {formatTime(time)}
                                    </button>
                      ))}
                    </div>
                  </div>

                  {/* End Time */}
                  <div className="time-column">
                    <label className="block text-sm font-medium text-blue-900 mb-3 time-label">End Time</label>
                    <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto time-slot-grid">
                      {timeSlots.map((time) => (
                                  <button
                                    key={`end-${time}`}
                                    onClick={() => setSelectedEndTime(time)}
                                    disabled={!selectedStartTime || time <= selectedStartTime}
                                    className={`time-slot-btn ${
                                      selectedEndTime === time
                                        ? 'selected'
                                        : !selectedStartTime || time <= selectedStartTime
                                        ? 'disabled'
                                        : ''
                                    }`}
                                  >
                                    {formatTime(time)}
                                  </button>
                                ))}
                    </div>
                  </div>
                </div>

                {/* Confirm Time Range */}
                {selectedStartTime && selectedEndTime && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg time-summary">
                    <div className="flex items-center justify-between summary-info">
                      <div className="summary-time">
                        <span className="text-blue-900 font-medium">
                          Selected Time: {formatTime(selectedStartTime)} - {formatTime(selectedEndTime)}
                        </span>
                        <div className="text-sm text-blue-600 mt-1 summary-duration">
                          Duration: {((parseInt(selectedEndTime.split(':')[0]) * 60 + parseInt(selectedEndTime.split(':')[1])) -
                                     (parseInt(selectedStartTime.split(':')[0]) * 60 + parseInt(selectedStartTime.split(':')[1]))) / 60} hours
                        </div>
                      </div>
                      <button
                        onClick={handleTimeRangeComplete}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors btn-continue"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Booking Details */}
        {currentStep === 'booking-details' && (
          <div className="appointment-details-container">
            <h2 className="appointment-details-header">
              Appointment Details
            </h2>

            <div className="appointment-details-card">
              {/* Appointment Summary */}
              <div className="appointment-summary">
                <h3 className="appointment-summary-title">Appointment Summary</h3>
                <div className="appointment-summary-info">
                  <div>Doctor: {selectedDoctorInfo?.name}</div>
                  <div>Department: {departments.find(d => d.id === selectedDepartment)?.name}</div>
                  <div>Date: {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</div>
                  <div>Time: {formatTime(selectedStartTime)} - {formatTime(selectedEndTime)}</div>
                </div>
              </div>

              {/* Reason for Visit Section */}
              <div className="reason-for-visit-section">
                <label className="form-label">
                  Reason for Visit <span className="required-star">*</span>
                </label>

                {/* Quick Select Options */}
                <div className="quick-select-options">
                  <p className="quick-select-info">Quick select common reasons:</p>
                  <div className="quick-select-grid">
                    {commonReasons[selectedDepartment]?.map((reason) => (
                      <button
                        key={reason}
                        onClick={() => setBookingTitle(reason)}
                        className={`quick-select-button ${
                          bookingTitle === reason ? 'selected' : ''
                        }`}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Input for Reason */}
                <input
                  type="text"
                  value={bookingTitle}
                  onChange={(e) => setBookingTitle(e.target.value)}
                  placeholder="Or enter a custom reason for your visit..."
                  className="custom-reason-input"
                />
              </div>

              {/* Additional Notes */}
              <div className="additional-notes-section">
                <label className="form-label">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Please provide any additional information about your symptoms, concerns, or special requests..."
                  rows={4}
                  className="additional-notes-textarea"
                />
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleBookingDetailsComplete}
                disabled={!bookingTitle.trim()}
                className="confirm-button"
              >
                Confirm Appointment Details
              </button>
            </div>
          </div>
        )}

        {/* Confirmation */}
        {currentStep === 'confirmation' && (
          <div className="confirmation-container">
            <div className="confirmation-card">
               <div className="confirmation-header">
                <div className="confirmation-icon-wrapper">
                  <Check className="confirmation-icon" />
                </div>
                <h2 className="confirmation-title">Appointment Confirmed!</h2>
                <p className="confirmation-message">Your appointment has been successfully booked</p>
              </div>

              <div className="appointment-details-list">
                <div className="detail-item">
                          {/* Assuming User is an SVG component or an icon */}
                          <User className="detail-item-icon" />
                          <span className="detail-item-text">{selectedDoctorInfo?.name}</span>
                 </div>
                <div className="detail-item">
                          {/* Assuming MapPin is an SVG component or an icon */}
                          <MapPin className="detail-item-icon" />
                          <span className="detail-item-text">
                            {departments.find(d => d.id === selectedDepartment)?.name}
                          </span>
                        </div>
                <div className="detail-item">
                          {/* Assuming Calendar is an SVG component or an icon */}
                          <Calendar className="detail-item-icon" />
                          <span className="detail-item-text">
                            {new Date(selectedDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                 </div>
                <div className="detail-item">
                          {/* Assuming Clock is an SVG component or an icon */}
                          <Clock className="detail-item-icon" />
                          <span className="detail-item-text">
                            {formatTime(selectedStartTime)} - {formatTime(selectedEndTime)}
                          </span>
                 </div>
                <div className="detail-item reason-for-visit">
                          {/* Using a div with unicode for clipboard icon as Check, User etc. are assumed components */}
                          <div className="detail-item-icon">📋</div>
                          <div className="detail-item-text">
                            <div className="main-reason">{bookingTitle}</div>
                            {bookingNotes && (
                              <div className="notes">{bookingNotes}</div>
                            )}
                          </div>
                        </div>
                      </div>

              <div className="confirmation-actions">
                <button
                          onClick={resetBooking}
                          className="book-another-button"
                        >
                          Book Another Appointment
                        </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    <PatientFooter />
                </div>
  );
};

export default PatientAppointmentBooking;