import React, { useState, useRef } from 'react';
import { Table, Input, Button, Space, Modal, Select, Image ,Tag} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import userImg from './images/layout_img/user_img.jpg';

const UserList = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

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

  const getColumnSearchProps = (dataIndex, label) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${label}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
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
          <Button onClick={() => handleReset(clearFilters, confirm)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: text =>
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

  const handleSubmit = () => {
    if (approvalStatus === 'rejected' && rejectionReason.trim() === '') {
      alert('Please provide a reason for rejection.');
      return;
    }
    console.log('Submitted:', {
      status: approvalStatus,
      reason: rejectionReason,
    });
    setShowModal(false);
  };

  const handleView = () => {
    setShowModal(true);
  };

  const data = [
    {
      key: '1',
      requestID: 'REQ001',
      userID: 'U1001',
      patientID: 'P1234',
      name: 'Yeap Zi',
      frontImg: userImg,
      backImg: userImg,
      role: 'patient',
      status: 'Pending',
    },
    {
      key: '2',
      requestID: 'REQ002',
      userID: 'U1002',
      patientID: 'P5678',
      name: 'Tan Mei',
      frontImg: userImg,
      backImg: userImg,
      role: 'admin',
      status: '-',
    },
  ];

  const columns = [
    {
      title: 'Request ID',
      dataIndex: 'requestID',
      key: 'requestID',
      ...getColumnSearchProps('requestID', 'Request ID'),
    },
    {
      title: 'User ID',
      dataIndex: 'userID',
      key: 'userID',
      ...getColumnSearchProps('userID', 'User ID'),
    },
    {
      title: 'Patient ID',
      dataIndex: 'patientID',
      key: 'patientID',
      ...getColumnSearchProps('patientID', 'Patient ID'),
    },
    {
      title: 'Patient Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name', 'Patient Name'),
    },
    {
      title: 'Front Image',
      dataIndex: 'frontImg',
      key: 'frontImg',
      render: img => <Image width={60} height={60} src={img} style={{ objectFit: 'cover', border: '1px solid #ddd', borderRadius: 4 }} />,
    },
    {
      title: 'Back Image',
      dataIndex: 'backImg',
      key: 'backImg',
      render: img => <Image width={60} height={60} src={img} style={{ objectFit: 'cover', border: '1px solid #ddd', borderRadius: 4 }} />,
    },
    {
      title: 'IC Verification Status',
      dataIndex: 'status', // ✅ ADD THIS LINE
      key: 'icVerificationStatus',
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Approved', value: 'Approved' },
        { text: 'Rejected', value: 'Rejected' },
      ],
      onFilter: (value, record) =>
        record.role?.toLowerCase() === 'patient' && record.status === value,
      render: (status, record) => {
        if (record.role?.toLowerCase() !== 'patient') return '-';
        let color = 'default';
        if (status === 'Pending') color = 'gold';
        else if (status === 'Approved') color = 'green';
        else if (status === 'Rejected') color = 'red';

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button size="small" type="link" onClick={handleView}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title d-flex justify-content-between align-items-center">
            <h2 style={{ margin: 0 }}>IC Verification Request List</h2>
          </div>
        </div>
      </div>

      <div className="main_content_iner">
        <div className="container-fluid p-0">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="white_card card_height_100 mb_30">
                <div className="white_card_body">
                  <Table columns={columns} dataSource={data} bordered pagination={{ pageSize: 5 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Review Patient Details"
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={handleSubmit}
        okText="Submit"
        cancelText="Cancel"
        okButtonProps={{
          disabled: approvalStatus === 'rejected' && rejectionReason.trim() === '',
        }}
      >
        <p style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}>
          Patient Name: <span style={{ fontWeight: 'normal' }}>Yeap Zi</span>
        </p>

        <div className="d-flex justify-content-between mb-3">
          <div style={{ textAlign: 'center' }}>
            <label
              className="form-label d-block"
              style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}
            >
              Front IC Image
            </label>
            <Image
              src={userImg}
              width={200}
              style={{ border: '1px solid #ccc', borderRadius: 5 }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <label
              className="form-label d-block"
              style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}
            >
              Back IC Image
            </label>
            <Image
              src={userImg}
              width={200}
              style={{ border: '1px solid #ccc', borderRadius: 5 }}
            />
          </div>
        </div>

        <div className="mb-3">
          <label
            className="form-label"
            style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}
          >
            Approval
          </label>
          <Select
            style={{ width: '100%' }}
            value={approvalStatus}
            onChange={(value) => setApprovalStatus(value)}
            placeholder="-- Select Status --"
          >
            <Select.Option value="approved">Approve</Select.Option>
            <Select.Option value="rejected">Reject</Select.Option>
          </Select>
        </div>

        {approvalStatus === 'rejected' && (
          <div className="mb-3">
            <label
              className="form-label"
              style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}
            >
              Reason for Rejection
            </label>
            <Input.TextArea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason..."
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserList;
