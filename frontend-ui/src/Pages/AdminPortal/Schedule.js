import React, { useState,useRef  } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import './css/Schedule.css';

const weekdayOptions = [
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
  { label: 'Sunday', value: 0 },
];


const Schedule = () => {
const [selectedEventObj, setSelectedEventObj] = useState(null);
const [selectedEvent, setSelectedEvent] = useState(null);
const [approvalStatus, setApprovalStatus] = useState('approved');
const [showReviewModal, setShowReviewModal] = useState(false);

const [highlightedWeekdays, setHighlightedWeekdays] = useState([]);
const [showManageModal, setShowManageModal] = useState(false);
const [selectedWeekdays, setSelectedWeekdays] = useState([]);
const [workingStartTime, setWorkingStartTime] = useState('');
const [workingEndTime, setWorkingEndTime] = useState('');
const [breakStartTime, setBreakStartTime] = useState('');
const [breakEndTime, setBreakEndTime] = useState('');
const [validYears, setValidYears] = useState(1);
const calendarRef = useRef();
const [showModal, setShowModal] = useState(false);
const [selectedDate, setSelectedDate] = useState('');
const [title, setTitle] = useState('');
const [startTime, setStartTime] = useState('');
const [endTime, setEndTime] = useState('');

const handleGenerateSchedule = () => {
  const weekdays = selectedWeekdays.map((d) => d.value); // [1 = Monday, ...]
  const today = new Date();
  const futureDate = new Date();
  futureDate.setFullYear(today.getFullYear() + validYears);

  const tempEvents = [];

  for (let d = new Date(today); d <= futureDate; d.setDate(d.getDate() + 1)) {
    const day = d.getDay(); // 0 = Sunday, ..., 6 = Saturday
    const dateStr = d.toISOString().split("T")[0];
    const isWorkingDay = weekdays.includes(day);

    if (isWorkingDay) {
      // ✅ Month view highlight
      tempEvents.push({
        start: dateStr,
        allDay: true,
        display: "background",
        backgroundColor: "#28a745", // green
      });

      // ✅ Week/Day view time blocks
      if (workingStartTime && workingEndTime) {
        // 1. Red: Midnight to workingStartTime
        tempEvents.push({
          start: `${dateStr}T00:00:00`,
          end: `${dateStr}T${workingStartTime}`,
          display: "background",
          backgroundColor: "#dc3545", // red
        });

        if (breakStartTime && breakEndTime) {
          // 2. Green: WorkingStart to BreakStart
          tempEvents.push({
            start: `${dateStr}T${workingStartTime}`,
            end: `${dateStr}T${breakStartTime}`,
            display: "background",
            backgroundColor: "#28a745", // green
          });

          // 3. Red: Break period
          tempEvents.push({
            start: `${dateStr}T${breakStartTime}`,
            end: `${dateStr}T${breakEndTime}`,
            display: "background",
            backgroundColor: "#dc3545", // red
          });

          // 4. Green: BreakEnd to WorkingEnd
          tempEvents.push({
            start: `${dateStr}T${breakEndTime}`,
            end: `${dateStr}T${workingEndTime}`,
            display: "background",
            backgroundColor: "#28a745", // green
          });
        } else {
          // ✅ No break — full shift is green
          tempEvents.push({
            start: `${dateStr}T${workingStartTime}`,
            end: `${dateStr}T${workingEndTime}`,
            display: "background",
            backgroundColor: "#28a745", // green
          });
        }

        // 5. Red: WorkingEnd to midnight
        tempEvents.push({
          start: `${dateStr}T${workingEndTime}`,
          end: `${dateStr}T23:59:59`,
          display: "background",
          backgroundColor: "#dc3545", // red
        });
      }
    } else {
      // ❌ Non-working day = all red
      tempEvents.push({
        start: dateStr,
        allDay: true,
        display: "background",
        backgroundColor: "#dc3545",
      });

      tempEvents.push({
        start: `${dateStr}T00:00:00`,
        end: `${dateStr}T23:59:59`,
        display: "background",
        backgroundColor: "#dc3545",
      });
    }
  }

  setEvents((prevEvents) =>
    [
      // Keep existing non-background events (like actual appointments)
      ...prevEvents.filter((e) => e.display !== 'background'),

      // Add new background schedule (green/red)
      ...tempEvents,
    ]
  );
  setShowManageModal(false);
};



const generateScheduleEvents = (weekdays, startTime, endTime, years) => {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + years);

  const tempEvents = [];

  for (let d = new Date(now); d <= futureDate; d.setDate(d.getDate() + 1)) {
    const day = d.getDay(); // 0 = Sun, 1 = Mon, etc.
    if (weekdays.includes(day)) {
      const dateStr = d.toISOString().split('T')[0];
      tempEvents.push({
        title: 'Available',
        start: `${dateStr}T${startTime}`,
        end: `${dateStr}T${endTime}`,
        backgroundColor: '#28a745', // green
        borderColor: '#28a745'
      });
    }
  }

  setEvents([...events, ...tempEvents]);
};

const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (calendarRef.current && selectedDate) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(selectedDate);
    }
  };

  const [events, setEvents] = useState([
    {
      title: 'Dr. Lee - Clinic',
      start: '2025-07-28T10:00:00',
      end: '2025-07-28T12:00:00'
    },
  ]);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr); // example: 2025-08-01
    setShowModal(true);
  };

const handleSubmit = () => {
  if (!title || !startTime || !endTime) return;

  const start = `${selectedDate}T${startTime}`;
  const end = `${selectedDate}T${endTime}`;

  // Format title with time
  const formattedTitle = `${title}: ${startTime} - ${endTime}`;

  setEvents((prev) => [
    ...prev,
    {
      title: formattedTitle,
      start,
      end,
      backgroundColor: '#dc3545', // red background
      textColor: '#fff',          // white text
    },
  ]);

  // Reset and close modal
  setShowModal(false);
  setTitle('');
  setStartTime('');
  setEndTime('');
};


  return (

  <div className="container-fluid">
        <div className="row column_title">
          <div className="col-md-12">
            <div className="page_title d-flex justify-content-between align-items-center">
              <h2>Doctor Schedule</h2>
              <input
                type="date"
                onChange={handleDateChange}
                className="form-control"
                style={{ width: '200px' }}
              />
              <Button variant="success" onClick={() => setShowManageModal(true)}>
                  Manage Schedule
                </Button>
            </div>
          </div>
        </div>
    <div className="container mt-4">


      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: 'prev,next today',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        dateClick={handleDateClick}
        views={{
            dayGridMonth: {
              displayEventEnd: true,
            },
            timeGridWeek: {
              displayEventEnd: true,
            },
            timeGridDay: {
              displayEventEnd: true,
            },
          }}
        eventClick={(info) => {
          const event = info.event;

          setSelectedEvent({
            id: event.id,
            title: event.title,
            start: event.startStr,
            end: event.endStr,
            status: event.extendedProps?.status || 'approved',
          });

          setSelectedEventObj(event); // ✅ Store the actual FullCalendar event instance
          setApprovalStatus(event.extendedProps?.status || 'approved');
          setShowReviewModal(true);
        }}
        eventContent={(arg) => {
          const status = arg.event.extendedProps?.status || 'approved';
          const isRejected = status === 'rejected';
          const isApproved = status === 'approved';

          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%', // Ensure it respects the cell width
              }}
            >
              {isApproved && (
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'green',
                    borderRadius: '50%',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
              )}
              <span
                style={{
                  textDecoration: isRejected ? 'line-through' : 'none',
                  color: isRejected ? 'red' : 'inherit',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {arg.event.title}
              </span>
            </div>
          );
        }}

      />

      {/* Modal for adding event */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Booking for {selectedDate}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Booking Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Dr. John - Checkup"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Start Time</label>
            <input
              type="time"
              className="form-control"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">End Time</label>
            <input
              type="time"
              className="form-control"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!title || !startTime || !endTime}
          >
            Add Booking
          </Button>
        </Modal.Footer>
      </Modal>




      <Modal show={showManageModal} onHide={() => setShowManageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Manage Weekly Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Select Working Days</label>
            <Select
              isMulti
              options={weekdayOptions}
              value={selectedWeekdays}
              onChange={setSelectedWeekdays}
              placeholder="Choose weekdays"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Working Start Time</label>
            <input
              type="time"
              className="form-control"
              value={workingStartTime}
              onChange={(e) => setWorkingStartTime(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Working End Time</label>
            <input
              type="time"
              className="form-control"
              value={workingEndTime}
              onChange={(e) => setWorkingEndTime(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Break Start Time</label>
            <input
              type="time"
              className="form-control"
              value={breakStartTime}
              onChange={(e) => setBreakStartTime(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Break End Time</label>
            <input
              type="time"
              className="form-control"
              value={breakEndTime}
              onChange={(e) => setBreakEndTime(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Schedule Validity (Years)</label>
            <input
              type="number"
              className="form-control"
              min={1}
              value={validYears}
              onChange={(e) => setValidYears(parseInt(e.target.value))}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowManageModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleGenerateSchedule}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Review Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Title:</strong> {selectedEvent?.title}</p>
          <p><strong>Start:</strong> {selectedEvent?.start}</p>
          <p><strong>End:</strong> {selectedEvent?.end}</p>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="approval"
              value="approved"
              checked={approvalStatus === 'approved'}
              onChange={(e) => setApprovalStatus(e.target.value)}
            />
            <label className="form-check-label">Approve</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="approval"
              value="rejected"
              checked={approvalStatus === 'rejected'}
              onChange={(e) => setApprovalStatus(e.target.value)}
            />
            <label className="form-check-label">Reject</label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (selectedEventObj) {
                const baseTitle = selectedEventObj.title.replace(/\s*\(approved\)|\(rejected\)/gi, '').trim();

                selectedEventObj.setProp('title', `${baseTitle} (${approvalStatus})`);
                selectedEventObj.setExtendedProp('status', approvalStatus);
              }

              setShowReviewModal(false);
              setSelectedEventObj(null);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
    </div>
  );
};

export default Schedule;