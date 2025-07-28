import React, { useRef, useState } from 'react';
import { Table, Modal, Select, Button ,Tag ,Space ,Input} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const AppointmentList = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null); // store current selected appointment
  const [status, setStatus] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSubmit = () => {
    console.log('Submitted status:', reviewStatus, 'for', selectedRecord);
    setShowModal(false);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText('');
    setSearchedColumn('');
    confirm({ closeDropdown: true });
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text?.toString() || ''}
        />
      ) : (
        text
      ),
  });

  const appointments = [
    {
      id: 'APT-001',
      patientName: 'John Doe',
      title: 'Follow-up Consultation',
      startTime: '2025-08-01 10:00',
      endTime: '2025-08-01 10:30',
      status: 'Ongoing',
      medicalRecordStatus: 'Not Created',
    },
    {
      id: 'APT-002',
      patientName: 'Jane Smith',
      title: 'Annual Checkup',
      startTime: '2025-08-01 11:00',
      endTime: '2025-08-01 11:30',
      status: 'Completed',
      medicalRecordStatus: 'Created',
    },
    {
      id: 'APT-003',
      patientName: 'Mark Lee',
      title: 'Flu Symptoms',
      startTime: '2025-08-01 12:00',
      endTime: '2025-08-01 12:30',
      status: 'Completed',
      medicalRecordStatus: 'Not Created',
    },
    {
      id: 'APT-004',
      patientName: 'Alice Wong',
      title: 'Migraine Consultation',
      startTime: '2025-08-01 13:00',
      endTime: '2025-08-01 13:30',
      status: 'No-show',
      medicalRecordStatus: 'Not Created',
    },
  ];

  const columns = [
    {
      title: 'Appointment ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'Patient Name',
      dataIndex: 'patientName',
      key: 'patientName',
      ...getColumnSearchProps('patientName'),
    },
    {
      title: 'Booking Title',
      dataIndex: 'title',
      key: 'title',
      ...getColumnSearchProps('title'),
    },
    {
      title: 'Booking Time',
      key: 'bookingTime',
      sorter: (a, b) => new Date(a.startTime) - new Date(b.startTime),
      render: (_, record) => (
        <span>{record.startTime} - {record.endTime}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Ongoing', value: 'Ongoing' },
        { text: 'Completed', value: 'Completed' },
        { text: 'No-show', value: 'No-show' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = 'gray';
        if (status === 'Ongoing') color = 'blue';
        else if (status === 'Completed') color = 'green';
        else if (status === 'No-show') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Medical Record',
      dataIndex: 'medicalRecordStatus',
      key: 'medicalRecordStatus',
      filters: [
        { text: 'Created', value: 'Created' },
        { text: 'Not Created', value: 'Not Created' },
      ],
      onFilter: (value, record) => record.medicalRecordStatus === value,
      render: (status) => (
        <Tag color={status === 'Created' ? 'green' : 'gold'}>{status}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        if (record.status === 'Completed' && record.medicalRecordStatus !== 'Created') {
          return (
            <Button type="primary" size="small">
              Create Medical Record
            </Button>
          );
        } else if (record.status === 'Ongoing') {
          return (
            <Button type="link" size="small" onClick={() => handleView(record)}>
              View
            </Button>
          );
        } else {
          return '-';
        }
      },
    },
  ];

  const handleView = (record) => {
    setSelectedRecord(record); // to populate modal
    setShowModal(true);
  };

  return (
   <div className="container-fluid">
        <div className="row column_title">
          <div className="col-md-12">
            <div className="page_title d-flex justify-content-between align-items-center">
              <h2 style={{ margin: 0 }}>Appointment List</h2>
            </div>
          </div>
        </div>
    <div className="container mt-4">

      <Table
        columns={columns}
        dataSource={appointments}
        rowKey="id"
        bordered
      />

      {selectedRecord && (
        <Modal
          title="Update Appointment Status"
          open={showModal}
          onCancel={() => setShowModal(false)}
          onOk={handleSubmit}
          okText="Submit"
          cancelText="Cancel"
        >
          <p style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}>
            Appointment ID: <span style={{ fontWeight: 'normal' }}>{selectedRecord.id}</span>
          </p>
          <p style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}>
            Booking Title: <span style={{ fontWeight: 'normal' }}>{selectedRecord.title}</span>
          </p>
          <p style={{ display: 'block', fontWeight: 'bold', marginBottom: 12, color: '#000' }}>
            Booking Time: <span style={{ fontWeight: 'normal' }}>{selectedRecord.startTime} - {selectedRecord.endTime}</span>
          </p>

          <div className="mb-3">
            <label
              className="form-label"
              style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}
            >
              Update Status
            </label>
            <Select
              style={{ width: '100%' }}
              value={reviewStatus}
              onChange={(value) => setReviewStatus(value)}
              placeholder="-- Select Status --"
            >
              <Select.Option value="no-show">No-Show</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
            </Select>
          </div>
        </Modal>

      )}
    </div>
    </div>
  );
};

export default AppointmentList;
