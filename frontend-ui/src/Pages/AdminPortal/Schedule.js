import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Modal,
  Button,
  Select,
  Input,
  Radio,
  InputNumber,
  Row,
  Col,
  Alert,
  Badge,
  Space,
  Typography,
  TimePicker,
  DatePicker
} from 'antd';
import dayjs from 'dayjs';
import './css/Schedule.css';

const { Option } = Select;
const { Title, Text } = Typography;

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

  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedWeekdays, setSelectedWeekdays] = useState([1, 2, 3, 4, 5]); // Monday to Friday
  const [workingStartTime, setWorkingStartTime] = useState(dayjs('09:00', 'HH:mm'));
  const [workingEndTime, setWorkingEndTime] = useState(dayjs('18:00', 'HH:mm'));
  const [breakStartTime, setBreakStartTime] = useState(dayjs('13:00', 'HH:mm'));
  const [breakEndTime, setBreakEndTime] = useState(dayjs('14:00', 'HH:mm'));
  const [validYears, setValidYears] = useState(1);
  const calendarRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [events, setEvents] = useState([
    // Sample bookings for July 29, 2025 (Tuesday) - 10 appointments
    {
      id: 'appointment-1',
      title: 'John Smith - General Checkup',
      start: '2025-07-29T09:00:00',
      end: '2025-07-29T09:30:00',
      backgroundColor: '#52c41a',
      borderColor: '#52c41a',
      textColor: '#fff',
      status: 'approved'
    },
    {
      id: 'appointment-2',
      title: 'Mary Johnson - Blood Test',
      start: '2025-07-29T09:30:00',
      end: '2025-07-29T10:00:00',
      backgroundColor: '#faad14',
      borderColor: '#faad14',
      textColor: '#fff',
      status: 'pending'
    },
    {
      id: 'appointment-3',
      title: 'Robert Brown - Follow-up',
      start: '2025-07-29T10:00:00',
      end: '2025-07-29T10:30:00',
      backgroundColor: '#52c41a',
      borderColor: '#52c41a',
      textColor: '#fff',
      status: 'approved'
    },
    {
      id: 'appointment-4',
      title: 'Lisa Wilson - Vaccination',
      start: '2025-07-29T10:30:00',
      end: '2025-07-29T11:00:00',
      backgroundColor: '#ff4d4f',
      borderColor: '#ff4d4f',
      textColor: '#fff',
      status: 'rejected'
    },
    {
      id: 'appointment-5',
      title: 'David Chen - Consultation',
      start: '2025-07-29T11:00:00',
      end: '2025-07-29T11:30:00',
      backgroundColor: '#52c41a',
      borderColor: '#52c41a',
      textColor: '#fff',
      status: 'approved'
    },
    {
      id: 'appointment-6',
      title: 'Emma Davis - X-Ray Review',
      start: '2025-07-29T11:30:00',
      end: '2025-07-29T12:00:00',
      backgroundColor: '#faad14',
      borderColor: '#faad14',
      textColor: '#fff',
      status: 'pending'
    },
    {
      id: 'appointment-7',
      title: 'Michael Lee - Physical Exam',
      start: '2025-07-29T12:00:00',
      end: '2025-07-29T12:30:00',
      backgroundColor: '#52c41a',
      borderColor: '#52c41a',
      textColor: '#fff',
      status: 'approved'
    },
    {
      id: 'appointment-8',
      title: 'Sarah Taylor - Prescription',
      start: '2025-07-29T12:30:00',
      end: '2025-07-29T13:00:00',
      backgroundColor: '#faad14',
      borderColor: '#faad14',
      textColor: '#fff',
      status: 'pending'
    },
    {
      id: 'appointment-9',
      title: 'James Miller - Lab Results',
      start: '2025-07-29T14:00:00',
      end: '2025-07-29T14:30:00',
      backgroundColor: '#52c41a',
      borderColor: '#52c41a',
      textColor: '#fff',
      status: 'approved'
    },
    {
      id: 'appointment-10',
      title: 'Anna Garcia - Dental Referral',
      start: '2025-07-29T14:30:00',
      end: '2025-07-29T15:00:00',
      backgroundColor: '#ff4d4f',
      borderColor: '#ff4d4f',
      textColor: '#fff',
      status: 'rejected'
    },
    // Additional sample appointments for other days
    {
      id: 'appointment-11',
      title: 'Tom Wilson - Routine Check',
      start: '2025-07-30T15:00:00',
      end: '2025-07-30T15:30:00',
      backgroundColor: '#52c41a',
      borderColor: '#52c41a',
      textColor: '#fff',
      status: 'approved'
    },
    {
      id: 'appointment-12',
      title: 'Jennifer Martinez - Consultation',
      start: '2025-07-31T16:00:00',
      end: '2025-07-31T16:30:00',
      backgroundColor: '#faad14',
      borderColor: '#faad14',
      textColor: '#fff',
      status: 'pending'
    }
  ]);

  // Generate default schedule on component mount
  useEffect(() => {
    generateDefaultSchedule();
  }, []);



  const generateDefaultSchedule = () => {
    const weekdays = [1, 2, 3, 4, 5]; // Monday to Friday
    const today = new Date();
    const futureDate = new Date();
    futureDate.setFullYear(today.getFullYear() + 1);

    const tempEvents = [];
    const workingStart = '09:00';
    const workingEnd = '18:00';
    const breakStart = '13:00';
    const breakEnd = '14:00';

    console.log('Generating default schedule with times:', {
      workingStart, workingEnd, breakStart, breakEnd
    });

    for (let d = new Date(today); d <= futureDate; d.setDate(d.getDate() + 1)) {
      const day = d.getDay();
      const dateStr = d.toISOString().split("T")[0];
      const isWorkingDay = weekdays.includes(day);

      if (isWorkingDay) {
        // Month view - highlight working days in green
        tempEvents.push({
          id: `working-day-${dateStr}`,
          start: dateStr,
          allDay: true,
          display: "background",
          backgroundColor: "rgba(40, 167, 69, 0.3)",
          classNames: ['working-day-bg']
        });

        // Create the three time blocks using the same logic
        const timeBlocks = createOptimizedTimeBlocks(dateStr, workingStart, workingEnd, breakStart, breakEnd);
        tempEvents.push(...timeBlocks);
      } else {
        // Non-working day - red background for month view
        tempEvents.push({
          id: `non-working-day-${dateStr}`,
          start: dateStr,
          allDay: true,
          display: "background",
          backgroundColor: "rgba(220, 53, 69, 0.3)",
          classNames: ['non-working-day-bg']
        });
      }
    }

    console.log(`Default schedule: Generated ${tempEvents.length} total events`);

    // Add schedule events to existing appointments
    setEvents((prevEvents) => {
      // Filter out any existing schedule events first
      const filteredEvents = prevEvents.filter((e) => {
        const isScheduleEvent = (
          e.display === 'background' ||
          e.classNames?.some(className =>
            ['working-day-bg', 'non-working-day-bg', 'time-block', 'availability-block'].includes(className)
          ) ||
          e.extendedProps?.isAvailability ||
          e.id?.includes('working-day-') ||
          e.id?.includes('non-working-day-') ||
          e.id?.includes('available-') ||
          e.id?.includes('break-')
        );
        return !isScheduleEvent;
      });

      console.log(`Default schedule: Keeping ${filteredEvents.length} appointments, adding ${tempEvents.length} schedule events`);
      return [...filteredEvents, ...tempEvents];
    });
  };

  const handleGenerateSchedule = () => {
    const weekdays = selectedWeekdays;
    const today = new Date();
    const futureDate = new Date();
    futureDate.setFullYear(today.getFullYear() + validYears);

    const tempEvents = [];

    // Get the formatted times
    const workingStart = workingStartTime?.format('HH:mm');
    const workingEnd = workingEndTime?.format('HH:mm');
    const breakStart = breakStartTime?.format('HH:mm');
    const breakEnd = breakEndTime?.format('HH:mm');

    console.log('Custom schedule generation with times:', {
      workingStart, workingEnd, breakStart, breakEnd, weekdays
    });

    for (let d = new Date(today); d <= futureDate; d.setDate(d.getDate() + 1)) {
      const day = d.getDay();
      const dateStr = d.toISOString().split("T")[0];
      const isWorkingDay = weekdays.includes(day);

      if (isWorkingDay) {
        // Month view - highlight working days in green
        tempEvents.push({
          id: `working-day-${dateStr}`,
          start: dateStr,
          allDay: true,
          display: "background",
          backgroundColor: "rgba(40, 167, 69, 0.3)",
          classNames: ['working-day-bg']
        });

        // Create time blocks
        if (workingStart && workingEnd) {
          const timeBlocks = createOptimizedTimeBlocks(dateStr, workingStart, workingEnd, breakStart, breakEnd);
          tempEvents.push(...timeBlocks);
        }
      } else {
        // Non-working day - red background for month view
        tempEvents.push({
          id: `non-working-day-${dateStr}`,
          start: dateStr,
          allDay: true,
          display: "background",
          backgroundColor: "rgba(220, 53, 69, 0.3)",
          classNames: ['non-working-day-bg']
        });
      }
    }

    console.log(`Custom schedule: Generated ${tempEvents.length} total events`);

    // Replace all schedule events with new ones
    setEvents((prevEvents) => {
      const filteredEvents = prevEvents.filter((e) => {
        const isScheduleEvent = (
          e.display === 'background' ||
          e.classNames?.some(className =>
            ['working-day-bg', 'non-working-day-bg', 'time-block', 'availability-block'].includes(className)
          ) ||
          e.extendedProps?.isAvailability ||
          e.id?.includes('working-day-') ||
          e.id?.includes('non-working-day-') ||
          e.id?.includes('available-') ||
          e.id?.includes('break-')
        );
        return !isScheduleEvent;
      });

      console.log(`Custom schedule: Keeping ${filteredEvents.length} appointments, adding ${tempEvents.length} new schedule events`);
      return [...filteredEvents, ...tempEvents];
    });

    setShowManageModal(false);
  };

  // Better approach: Create fewer, larger blocks to minimize overlapping
  const createOptimizedTimeBlocks = (dateStr, workingStart, workingEnd, breakStart, breakEnd) => {
    const blocks = [];

    // Helper function to ensure proper time format
    const formatTime = (timeStr) => {
      if (!timeStr || timeStr === 'undefined') return null;
      return timeStr.length > 5 ? timeStr.substring(0, 5) : timeStr;
    };

    const formattedWorkingStart = formatTime(workingStart);
    const formattedWorkingEnd = formatTime(workingEnd);
    const formattedBreakStart = formatTime(breakStart);
    const formattedBreakEnd = formatTime(breakEnd);

    // Validate that we have working times
    if (!formattedWorkingStart || !formattedWorkingEnd) {
      console.log(`Skipping ${dateStr}: Missing working times`);
      return blocks;
    }

    // Check if we have valid break times within working hours
    const hasValidBreak = formattedBreakStart && formattedBreakEnd &&
      formattedBreakStart >= formattedWorkingStart &&
      formattedBreakEnd <= formattedWorkingEnd &&
      formattedBreakStart < formattedBreakEnd;

    if (hasValidBreak) {
      // Working period before break
      if (formattedBreakStart > formattedWorkingStart) {
        blocks.push({
          id: `available-morning-${dateStr}`,
          title: '● Available',
          start: `${dateStr}T${formattedWorkingStart}:00`,
          end: `${dateStr}T${formattedBreakStart}:00`,
          backgroundColor: 'rgba(40, 167, 69, 0.8)',
          borderColor: '#28a745',
          textColor: '#ffffff',
          display: 'block',
          classNames: ['availability-block'],
          extendedProps: { isAvailability: true }
        });
      }

      // Break period
      blocks.push({
        id: `break-${dateStr}`,
        title: '● Break Time',
        start: `${dateStr}T${formattedBreakStart}:00`,
        end: `${dateStr}T${formattedBreakEnd}:00`,
        backgroundColor: 'rgba(220, 53, 69, 0.8)',
        borderColor: '#dc3545',
        textColor: '#ffffff',
        display: 'block',
        classNames: ['availability-block'],
        extendedProps: { isAvailability: true }
      });

      // Working period after break
      if (formattedBreakEnd < formattedWorkingEnd) {
        blocks.push({
          id: `available-afternoon-${dateStr}`,
          title: '● Available',
          start: `${dateStr}T${formattedBreakEnd}:00`,
          end: `${dateStr}T${formattedWorkingEnd}:00`,
          backgroundColor: 'rgba(40, 167, 69, 0.8)',
          borderColor: '#28a745',
          textColor: '#ffffff',
          display: 'block',
          classNames: ['availability-block'],
          extendedProps: { isAvailability: true }
        });
      }

      // Log the three blocks for this date (only show first few dates to avoid spam)
      if (dateStr <= '2025-08-05') {
        console.log(`${dateStr} - Three blocks created: ${formattedWorkingStart}-${formattedBreakStart} (Available), ${formattedBreakStart}-${formattedBreakEnd} (Break), ${formattedBreakEnd}-${formattedWorkingEnd} (Available)`);
      }
    } else {
      // No break - single availability block
      blocks.push({
        id: `available-full-${dateStr}`,
        title: '● Available',
        start: `${dateStr}T${formattedWorkingStart}:00`,
        end: `${dateStr}T${formattedWorkingEnd}:00`,
        backgroundColor: 'rgba(40, 167, 69, 0.8)',
        borderColor: '#28a745',
        textColor: '#ffffff',
        display: 'block',
        classNames: ['availability-block'],
        extendedProps: { isAvailability: true }
      });

      if (dateStr <= '2025-08-05') {
        console.log(`${dateStr} - Single block created: ${formattedWorkingStart}-${formattedWorkingEnd} (Available)`);
      }
    }

    return blocks;
  };

  const handleDateChange = (date, dateString) => {
    if (calendarRef.current && dateString) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(dateString);
    }
  };

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!title || !startTime || !endTime) return;

    const start = `${selectedDate}T${startTime.format('HH:mm')}:00`;
    const end = `${selectedDate}T${endTime.format('HH:mm')}:00`;

    setEvents((prev) => [
      ...prev,
      {
        id: `appointment-${Date.now()}`,
        title: title,
        start,
        end,
        backgroundColor: '#1890ff',
        borderColor: '#1890ff',
        textColor: '#fff',
        status: 'pending'
      },
    ]);

    setShowModal(false);
    setTitle('');
    setStartTime(null);
    setEndTime(null);
  };

  const resetManageForm = () => {
    setSelectedWeekdays([]);
    setWorkingStartTime(null);
    setWorkingEndTime(null);
    setBreakStartTime(null);
    setBreakEndTime(null);
    setValidYears(1);
  };


  return (
    <div className="container-fluid" style={{ paddingTop: '20px' }}>
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title d-flex justify-content-between align-items-center"
               style={{
                 padding: '15px 0',
                 marginBottom: '20px',
                 borderBottom: '1px solid #f0f0f0'
               }}>
            <Title level={2} style={{ margin: 0 }}>Doctor Schedule</Title>
            <Space>
              <DatePicker onChange={handleDateChange} />
              <Button type="primary" onClick={() => setShowManageModal(true)}>
                Manage Schedule
              </Button>
            </Space>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '10px' }}>
        <div style={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '20px',
          marginBottom: '20px'
        }}>
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
          height="auto"
          views={{
            dayGridMonth: {
              displayEventEnd: true,
              dayMaxEvents: 3, // Show only 3 events, then "+X more" link
              moreLinkClick: 'popover', // Show popover when clicking "+X more"
            },
            timeGridWeek: {
              displayEventEnd: true,
              slotMinTime: '08:00:00',
              slotMaxTime: '19:00:00',
              eventDisplay: 'block',
              slotDuration: '00:30:00', // 30-minute time slots
              slotLabelInterval: '01:00:00', // Show hour labels
              eventMaxStack: 3, // Limit event stacking
            },
            timeGridDay: {
              displayEventEnd: true,
              slotMinTime: '08:00:00',
              slotMaxTime: '19:00:00',
              eventDisplay: 'block',
              slotDuration: '00:15:00', // 15-minute time slots for detailed view
              slotLabelInterval: '01:00:00',
              eventMaxStack: 1, // Single column in day view
            },
          }}
          eventClick={(info) => {
            const event = info.event;

            // Don't show modal for availability blocks
            if (event.extendedProps?.isAvailability) return;
            if (event.display === 'background') return;

            setSelectedEvent({
              id: event.id,
              title: event.title,
              start: event.startStr,
              end: event.endStr,
              status: event.extendedProps?.status || 'pending',
            });

            setSelectedEventObj(event);
            setApprovalStatus(event.extendedProps?.status || 'pending');
            setShowReviewModal(true);
          }}

          // Add day cell content to show appointment count
          dayCellContent={(arg) => {
            // Get the date in YYYY-MM-DD format (local timezone)
            const year = arg.date.getFullYear();
            const month = String(arg.date.getMonth() + 1).padStart(2, '0');
            const day = String(arg.date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            // Filter events for this specific date
            const dayEvents = events.filter(event => {
              if (!event.start || event.extendedProps?.isAvailability || event.display === 'background') {
                return false;
              }

              // Handle both string and Date object formats
              let eventDateStr;
              if (typeof event.start === 'string') {
                eventDateStr = event.start.split('T')[0];
              } else if (event.start instanceof Date) {
                const eventYear = event.start.getFullYear();
                const eventMonth = String(event.start.getMonth() + 1).padStart(2, '0');
                const eventDay = String(event.start.getDate()).padStart(2, '0');
                eventDateStr = `${eventYear}-${eventMonth}-${eventDay}`;
              } else {
                return false;
              }

              // Exact date match
              return eventDateStr === dateStr;
            });

            if (arg.view.type === 'dayGridMonth' && dayEvents.length > 0) {
              return {
                html: `
                  <div style="position: relative; height: 100%; width: 100%;">
                    <div style="font-weight: bold;">${arg.dayNumberText}</div>
                    <div style="
                      position: absolute;
                      top: 2px;
                      right: 2px;
                      background: #1890ff;
                      color: white;
                      border-radius: 50%;
                      width: 18px;
                      height: 18px;
                      font-size: 11px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-weight: bold;
                      z-index: 10;
                    ">${dayEvents.length}</div>
                  </div>
                `
              };
            }
            return { html: `<div>${arg.dayNumberText}</div>` };
          }}





          eventContent={(arg) => {
            // Don't customize background events
            if (arg.event.display === 'background') return null;

            // Don't customize availability blocks (let them show their title)
            if (arg.event.extendedProps?.isAvailability) {
              return { html: `<div style="font-size: 11px; padding: 1px 3px;">${arg.event.title}</div>` };
            }

            const status = arg.event.extendedProps?.status || 'pending';
            const isRejected = status === 'rejected';
            const isApproved = status === 'approved';
            const isPending = status === 'pending';

            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%',
                  padding: '2px 4px',
                  fontSize: '11px'
                }}
              >
                {isApproved && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#52c41a',
                      borderRadius: '50%',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                )}
                {isPending && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#faad14',
                      borderRadius: '50%',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                )}
                <span
                  style={{
                    textDecoration: isRejected ? 'line-through' : 'none',
                    color: isRejected ? '#ff4d4f' : 'inherit',
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
          // Add custom CSS to reduce gaps between events
          eventDidMount={(info) => {
            if (info.event.extendedProps?.isAvailability) {
              info.el.style.marginBottom = '1px';
              info.el.style.border = '1px solid ' + info.event.borderColor;
              info.el.style.fontSize = '11px';
              info.el.style.opacity = '0.7';
              info.el.style.zIndex = '1';
            } else {
              // Regular appointments
              info.el.style.fontSize = '11px';
              info.el.style.fontWeight = '500';
              info.el.style.zIndex = '2';
              // Add hover effect
              info.el.addEventListener('mouseenter', () => {
                info.el.style.transform = 'scale(1.02)';
                info.el.style.zIndex = '10';
                info.el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
              });
              info.el.addEventListener('mouseleave', () => {
                info.el.style.transform = 'scale(1)';
                info.el.style.zIndex = '2';
                info.el.style.boxShadow = 'none';
              });
            }
          }}
          // Custom CSS to ensure calendar doesn't overlap navigation
          customClassNames={{
            calendar: 'custom-fullcalendar'
          }}
        />
        </div>

        {/* Add custom CSS styles */}
        <style jsx>{`
          .custom-fullcalendar {
            position: relative !important;
            z-index: 1 !important;
          }

          .fc-header-toolbar {
            position: relative !important;
            z-index: 2 !important;
            background: white;
            padding: 10px 0;
            margin-bottom: 10px !important;
          }

          .fc-view-harness {
            position: relative !important;
            z-index: 1 !important;
          }

          .fc-daygrid-event-harness,
          .fc-timegrid-event-harness {
            z-index: 2 !important;
          }

          .fc-popover {
            z-index: 1000 !important;
          }

          .fc-more-popover {
            z-index: 1000 !important;
          }

          /* Ensure modal z-index is higher than sticky nav */


          /* Fix for sticky navigation overlap */
          .fc-toolbar {
            position: relative !important;
            z-index: 2 !important;
          }

          /* Calendar container adjustments */
          .fc {
            margin-top: 0 !important;
          }

          /* Ensure calendar events don't go behind nav */
          .fc-event {
            position: relative !important;
          }

          /* Custom scrollbar for better appearance */
          .fc-scroller::-webkit-scrollbar {
            width: 6px;
          }

          .fc-scroller::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }

          .fc-scroller::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
          }

          .fc-scroller::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
        `}</style>
        />

        {/* Add Appointment Modal */}
        <Modal
          title={`Add Appointment for ${selectedDate}`}
          open={showModal}
          onCancel={() => {
            setShowModal(false);
            setTitle('');
            setStartTime(null);
            setEndTime(null);
          }}
          footer={[
            <Button key="cancel" onClick={() => setShowModal(false)}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleSubmit}
              disabled={!title || !startTime || !endTime}
            >
              Add Appointment
            </Button>
          ]}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <Text strong>Patient Name & Description</Text>
              <Input
                placeholder="e.g. John Doe - General Checkup"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ marginTop: 8 }}
              />
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Start Time</Text>
                <TimePicker
                  value={startTime}
                  onChange={setStartTime}
                  format="HH:mm"
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder="Select start time"
                />
              </Col>
              <Col span={12}>
                <Text strong>End Time</Text>
                <TimePicker
                  value={endTime}
                  onChange={setEndTime}
                  format="HH:mm"
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder="Select end time"
                />
              </Col>
            </Row>
          </Space>
        </Modal>

        {/* Manage Schedule Modal */}
        <Modal
          title="Manage Weekly Schedule"
          open={showManageModal}
          onCancel={() => {
            setShowManageModal(false);
            resetManageForm();
          }}
          width={700}
          footer={[
            <Button key="cancel" onClick={() => setShowManageModal(false)}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleGenerateSchedule}
              disabled={!selectedWeekdays.length || !workingStartTime || !workingEndTime}
            >
              Generate Schedule
            </Button>
          ]}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div>
              <Text strong>Select Working Days</Text>
              <Select
                mode="multiple"
                placeholder="Choose weekdays"
                value={selectedWeekdays}
                onChange={setSelectedWeekdays}
                style={{ width: '100%', marginTop: 8 }}
              >
                {weekdayOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Working Start Time</Text>
                <TimePicker
                  value={workingStartTime}
                  onChange={setWorkingStartTime}
                  format="HH:mm"
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder="e.g. 09:00"
                />
              </Col>
              <Col span={12}>
                <Text strong>Working End Time</Text>
                <TimePicker
                  value={workingEndTime}
                  onChange={setWorkingEndTime}
                  format="HH:mm"
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder="e.g. 17:00"
                />
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Break Start Time (Optional)</Text>
                <TimePicker
                  value={breakStartTime}
                  onChange={setBreakStartTime}
                  format="HH:mm"
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder="e.g. 12:00"
                />
              </Col>
              <Col span={12}>
                <Text strong>Break End Time (Optional)</Text>
                <TimePicker
                  value={breakEndTime}
                  onChange={setBreakEndTime}
                  format="HH:mm"
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder="e.g. 13:00"
                />
              </Col>
            </Row>

            <div>
              <Text strong>Schedule Validity (Years)</Text>
              <InputNumber
                min={1}
                max={5}
                value={validYears}
                onChange={(value) => setValidYears(value || 1)}
                style={{ width: '100%', marginTop: 8 }}
              />
            </div>

            <Alert
              message="Color Legend"
              description={
                <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                  <li><Badge color="#52c41a" /> Green: Available working hours</li>
                  <li><Badge color="#ff4d4f" /> Red: Break time or unavailable</li>
                  <li>Month view: Working days highlighted in background</li>
                  <li>Week/Day view: Availability blocks show doctor's schedule</li>
                </ul>
              }
              type="info"
              showIcon
            />
          </Space>
        </Modal>

        {/* Review Appointment Modal */}
        <Modal
          title="Review Appointment"
          open={showReviewModal}
          onCancel={() => setShowReviewModal(false)}
          footer={[
            <Button key="cancel" onClick={() => setShowReviewModal(false)}>
              Close
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                if (selectedEventObj) {
                  selectedEventObj.setExtendedProp('status', approvalStatus);

                  if (approvalStatus === 'approved') {
                    selectedEventObj.setProp('backgroundColor', '#52c41a');
                    selectedEventObj.setProp('borderColor', '#52c41a');
                  } else if (approvalStatus === 'rejected') {
                    selectedEventObj.setProp('backgroundColor', '#ff4d4f');
                    selectedEventObj.setProp('borderColor', '#ff4d4f');
                  } else {
                    selectedEventObj.setProp('backgroundColor', '#faad14');
                    selectedEventObj.setProp('borderColor', '#faad14');
                  }
                }

                setShowReviewModal(false);
                setSelectedEventObj(null);
              }}
            >
              Update Status
            </Button>
          ]}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <Text strong>Patient & Description:</Text>
              <div style={{ marginTop: 4 }}>{selectedEvent?.title}</div>
            </div>
            <div>
              <Text strong>Start:</Text>
              <div style={{ marginTop: 4 }}>
                {selectedEvent?.start ? dayjs(selectedEvent.start).format('YYYY-MM-DD HH:mm') : ''}
              </div>
            </div>
            <div>
              <Text strong>End:</Text>
              <div style={{ marginTop: 4 }}>
                {selectedEvent?.end ? dayjs(selectedEvent.end).format('YYYY-MM-DD HH:mm') : ''}
              </div>
            </div>
            <div>
              <Text strong>Current Status:</Text>
              <div style={{ marginTop: 4 }}>
                <Badge
                  status={
                    selectedEvent?.status === 'approved' ? 'success' :
                    selectedEvent?.status === 'rejected' ? 'error' : 'warning'
                  }
                  text={selectedEvent?.status || 'pending'}
                />
              </div>
            </div>

            <div>
              <Text strong>Update Status:</Text>
              <Radio.Group
                value={approvalStatus}
                onChange={(e) => setApprovalStatus(e.target.value)}
                style={{ marginTop: 8 }}
              >
                <Space direction="vertical">
                  <Radio value="approved">
                    <Text type="success">✓ Approve Appointment</Text>
                  </Radio>
                  <Radio value="rejected">
                    <Text type="danger">✗ Reject Appointment</Text>
                  </Radio>
                  <Radio value="pending">
                    <Text type="warning">⏳ Keep Pending</Text>
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
          </Space>
        </Modal>
      </div>
    </div>
  );
};

export default Schedule;