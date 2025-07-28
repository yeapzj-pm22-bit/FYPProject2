import React, { useState,useRef } from 'react';
import { Table, Tag, Button, Modal, Input, Radio,Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';



const RestockMedicineRequest = () => {
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [rejectReason, setRejectReason] = useState('');

const getColumnSearchProps = (dataIndex, title, searchInput, setSearchText, setSearchedColumn, searchedColumn) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
    <div style={{ padding: 8 }}>
      <Input
        ref={searchInput}
        placeholder={`Search ${title}`}
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => {
          confirm();
          setSearchText(selectedKeys[0]);
          setSearchedColumn(dataIndex);
        }}
        style={{ width: 188, marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => {
            confirm();
            setSearchText(selectedKeys[0]);
            setSearchedColumn(dataIndex);
          }}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            setSearchText('');
            setSearchedColumn('');  // <-- clear highlighting
            confirm();
          }}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </Space>
    </div>
  ),
  filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
  onFilter: (value, record) =>
    record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
  onFilterDropdownVisibleChange: visible => {
    if (visible) {
      setTimeout(() => searchInput.current?.select(), 100);
    }
  },
  render: text =>
    searchedColumn === dataIndex ? (
      <span style={{ backgroundColor: '#ffc069', padding: 0 }}>{text}</span>
    ) : (
      text
    ),
});


const requests = [
  {
    id: 101,
    medication: "Amoxicillin 500mg",
    quantity: 100,
    expectedExpiry: "2025-12-31",
    reason: "Stock running low",
    status: "Pending",
  },
  {
    id: 102,
    medication: "Paracetamol 500mg",
    quantity: 200,
    expectedExpiry: "2026-06-30",
    reason: "High patient demand",
    status: "Approved",
  },
];

  const handleReply = (record) => {
    setSelectedRequest(record);
    setApprovalStatus('');
    setSupplierName('');
    setRejectReason('');
    setModalVisible(true);
  };

  const handleSubmit = () => {
    // Submit logic here
    setModalVisible(false);
  };

  const columns = [
    {
      title: 'Request ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Medication Name',
      dataIndex: 'medication',
      key: 'medication',
      ...getColumnSearchProps('medication', 'Medication Name', searchInput, setSearchText, setSearchedColumn, searchedColumn),
    },
    {
      title: 'Request Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Expected Expiry Date',
      dataIndex: 'expectedExpiry',
      key: 'expectedExpiry',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      ...getColumnSearchProps('reason', 'Reason', searchInput, setSearchText, setSearchedColumn, searchedColumn),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Approved', value: 'Approved' },
        { text: 'Rejected', value: 'Rejected' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = '';
        if (status === 'Pending') color = 'gold';
        else if (status === 'Approved') color = 'green';
        else if (status === 'Rejected') color = 'red';

        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) =>
        record.status === 'Pending' ? (
          <Button size="small" type="primary" onClick={() => handleReply(record)}>
            Reply
          </Button>
        ) : (
          '-'
        ),
    },
  ];

  return (
    <div className="container-fluid">
     <div className="row column_title">
             <div className="col-md-12">
               <div className="page_title d-flex justify-content-between align-items-center">
                 <h2 className="mb-0">Restock Medicine Request List</h2>

               </div>
             </div>
           </div>
      <Table dataSource={requests} columns={columns} rowKey="id" pagination={false} />

      <Modal
        title="Review Request Detail"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        okButtonProps={{
          disabled:
            (approvalStatus === 'approved' && !supplierName) ||
            (approvalStatus === 'rejected' && !rejectReason) ||
            !approvalStatus,
        }}
      >
        {selectedRequest && (
          <>
           <p>
             <span style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}>
               Medication Name:
             </span>
             <span style={{ color: '#000' }}>{selectedRequest.medication}</span>
           </p>
           <p>
             <span style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}>
               Request Quantity:
             </span>
             <span style={{ color: '#000' }}>{selectedRequest.quantity}</span>
           </p>
           <p>
             <span style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}>
               Expected Expiry Date:
             </span>
             <span style={{ color: '#000' }}>{selectedRequest.expectedExpiry}</span>
           </p>
           <p>
             <span style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}>
               Reason:
             </span>
             <span style={{ color: '#000' }}>{selectedRequest.reason}</span>
           </p>

            <p>
                         <span style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}>
                           Decision:
                         </span>

                       </p>
            <Radio.Group
              onChange={(e) => setApprovalStatus(e.target.value)}
              value={approvalStatus}
            >
              <span style={{ color: '#000' }}><Radio value="approved">Approve</Radio></span>
              <span style={{ color: '#000' }}><Radio value="rejected">Reject</Radio></span>
            </Radio.Group>

            {approvalStatus === 'approved' && (
              <Input
                className="mt-2"
                placeholder="Enter Supplier Name"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
              />
            )}

            {approvalStatus === 'rejected' && (
              <Input
                className="mt-2"
                placeholder="Enter Reason for Rejection"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default RestockMedicineRequest;