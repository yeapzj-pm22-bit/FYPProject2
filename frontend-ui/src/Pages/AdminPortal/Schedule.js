import React, { useState, useRef } from 'react';
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
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const [workingStartTime, setWorkingStartTime] = useState(null);
  const [workingEndTime, setWorkingEndTime] = useState(null);
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [breakEndTime, setBreakEndTime] = useState(null);
  const [validYears, setValidYears] = useState(1);
  const calendarRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [events, setEvents] = useState([
    {
      title: 'Dr. Lee - Clinic',
      start: '2025-07-28T10:00:00',
      end: '2025-07-28T12:00:00',
      status: 'approved'
    },
  ]);

  const handleGenerateSchedule = () => {
    const weekdays = selectedWeekdays;
    const today = new Date();
    const futureDate = new Date();
    futureDate.setFullYear(today.getFullYear() + validYears);

    const tempEvents = [];
    const workingStart = workingStartTime?.format('HH:mm');
    const workingEnd = workingEndTime?.format('HH:mm');
    const breakStart = breakStartTime?.format('HH:mm');
    const breakEnd = breakEndTime?.format('HH:mm');

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

        // Week/Day view - use resource-like approach for better time blocks
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

    // Clear existing schedule events and add new ones
    setEvents((prevEvents) => [
      ...prevEvents.filter((e) =>
        e.display !== 'background' &&
        !e.classNames?.some(className =>
          ['working-day-bg', 'non-working-day-bg', 'time-block', 'availability-block'].includes(className)
        )
      ),
      ...tempEvents,
    ]);

    setShowManageModal(false);
  };

  // Better approach: Create fewer, larger blocks to minimize overlapping
  const createOptimizedTimeBlocks = (dateStr, workingStart, workingEnd, breakStart, breakEnd) => {
    const blocks = [];

    // Use a different approach: create "availability" events instead of background blocks
    // This reduces visual overlap issues

    if (breakStart && breakEnd &&
        breakStart >= workingStart &&
        breakEnd <= workingEnd) {

      // Working period before break
      if (breakStart > workingStart) {
        blocks.push({
          id: `available-morning-${dateStr}`,
          title: '● Available',
          start: `${dateStr}T${workingStart}:00`,
          end: `${dateStr}T${breakStart}:00`,
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
        start: `${dateStr}T${breakStart}:00`,
        end: `${dateStr}T${breakEnd}:00`,
        backgroundColor: 'rgba(220, 53, 69, 0.8)',
        borderColor: '#dc3545',
        textColor: '#ffffff',
        display: 'block',
        classNames: ['availability-block'],
        extendedProps: { isAvailability: true }
      });

      // Working period after break
      if (breakEnd < workingEnd) {
        blocks.push({
          id: `available-afternoon-${dateStr}`,
          title: '● Available',
          start: `${dateStr}T${breakEnd}:00`,
          end: `${dateStr}T${workingEnd}:00`,
          backgroundColor: 'rgba(40, 167, 69, 0.8)',
          borderColor: '#28a745',
          textColor: '#ffffff',
          display: 'block',
          classNames: ['availability-block'],
          extendedProps: { isAvailability: true }
        });
      }
    } else {
      // No break - single availability block
      blocks.push({
        id: `available-full-${dateStr}`,
        title: '● Available',
        start: `${dateStr}T${workingStart}:00`,
        end: `${dateStr}T${workingEnd}:00`,
        backgroundColor: 'rgba(40, 167, 69, 0.8)',
        borderColor: '#28a745',
        textColor: '#ffffff',
        display: 'block',
        classNames: ['availability-block'],
        extendedProps: { isAvailability: true }
      });
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
    <div className="container-fluid">
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title d-flex justify-content-between align-items-center">
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
          height="auto"
          views={{
            dayGridMonth: {
              displayEventEnd: true,
            },
            timeGridWeek: {
              displayEventEnd: true,
              slotMinTime: '06:00:00',
              slotMaxTime: '22:00:00',
              eventDisplay: 'block', // Better display for overlapping prevention
            },
            timeGridDay: {
              displayEventEnd: true,
              slotMinTime: '06:00:00',
              slotMaxTime: '22:00:00',
              eventDisplay: 'block',
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
            }
          }}
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