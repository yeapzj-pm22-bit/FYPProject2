import React, { useState,useRef } from 'react';
import { Table, Tag, Button, Modal, Input, DatePicker, Radio } from 'antd';
import Select from 'react-select';

import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const inventoryOrders = [
  {
    id: 'ORD001',
    medication: 'Paracetamol 500mg',
    quantity: 100,
    expectedExpiry: '2026-01-01',
    supplier: 'MediSupply Co.',
    actualQuantity: '',
    actualExpiry: '',
    notes: '',
    status: 'Pending',
  },
  {
    id: 'ORD002',
    medication: 'Amoxicillin 250mg',
    quantity: 200,
    expectedExpiry: '2025-12-01',
    supplier: 'PharmaPlus Ltd.',
    actualQuantity: 200,
    actualExpiry: '2026-02-01',
    notes: 'Delivered in good condition.',
    status: 'Received',
  },
];

const InventoryList = () => {

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          >
            Search
          </Button>
          <Button
            size="small"
            style={{ width: 90 }}
            onClick={() => handleReset(clearFilters, confirm)}
          >
            Reset
          </Button>
        </div>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
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
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

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

  const [showModal2, setShowModal2] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actualQuantity, setActualQuantity] = useState('');
  const [actualExpiryDate, setActualExpiryDate] = useState(null);
  const [selectedNote, setSelectedNote] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');

  const navigate = useNavigate();

  const noteOptions = [
    { value: 'Complete', label: 'Complete' },
    { value: 'Partial', label: 'Partial' },
    { value: 'Damaged Items', label: 'Damaged Items' },
  ];

  const handleReceive = (order) => {
    setSelectedOrder(order);
    setActualQuantity('');
    setActualExpiryDate(null);
    setSelectedNote('');
    setApprovalStatus('');
    setShowModal2(true);
  };

  const handleReceiveSubmit = () => {
    // Perform validation/submission logic here

    setShowModal2(false);
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      ...getColumnSearchProps('id'),
      sorter: (a, b) => a.id.localeCompare(b.id),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Medication',
      dataIndex: 'medication',
      key: 'medication',
      ...getColumnSearchProps('medication'),
    },
    {
      title: 'Order Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Expected Expiry Date',
      dataIndex: 'expectedExpiry',
      key: 'expectedExpiry',
      render: (text) => moment(text).format('YYYY-MM-DD'),
      sorter: (a, b) => new Date(a.expectedExpiry) - new Date(b.expectedExpiry),
    },
    {
      title: 'Supplier Name',
      dataIndex: 'supplier',
      key: 'supplier',
      ...getColumnSearchProps('supplier'),
    },
    {
      title: 'Actual Quantity Received',
      dataIndex: 'actualQuantity',
      key: 'actualQuantity',
      render: (text) => text || '-',
      sorter: (a, b) => (a.actualQuantity || 0) - (b.actualQuantity || 0),
    },
    {
      title: 'Actual Expiry Date',
      dataIndex: 'actualExpiry',
      key: 'actualExpiry',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD') : '-'),
      sorter: (a, b) => new Date(a.actualExpiry || 0) - new Date(b.actualExpiry || 0),
    },
    {
      title: 'Receiving Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: (text) => text || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Received', value: 'Received' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === 'Pending' ? 'orange' : 'green'}>{status}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) =>
        record.status === 'Pending' ? (
          <Button type="primary" size="small" onClick={() => handleReceive(record)}>
            Receive
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
            <h2 className="mb-0">Inventory List</h2>
            <Link to="/inventory">
                      <Button type="primary" shape="circle" icon={<PlusOutlined />} />
            </Link>

          </div>
        </div>
      </div>

      <div className="main_content_iner mt-3">
        <Table columns={columns} dataSource={inventoryOrders} rowKey="id" bordered />
      </div>

      <Modal
        title="Receive Inventory Order"
        visible={showModal2}
        onCancel={() => setShowModal2(false)}
        onOk={handleReceiveSubmit}
        okButtonProps={{
          disabled: !actualQuantity || !actualExpiryDate || !selectedNote || !approvalStatus,
        }}
      >
        {selectedOrder && (
          <>
            <p style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}>
              Medication: <span style={{ fontWeight: 'normal' }}>{selectedOrder.medication}</span>
            </p>
            <p style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}>
              Order Quantity: <span style={{ fontWeight: 'normal' }}>{selectedOrder.quantity}</span>
            </p>
            <p style={{ display: 'block', fontWeight: 'bold', marginBottom: 12, color: '#000' }}>
              Expected Expiry Date: <span style={{ fontWeight: 'normal' }}>{selectedOrder.expectedExpiry}</span>
            </p>

            <div className="mb-3">
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}>
                Actual Quantity Received
              </label>
              <Input
                type="number"
                min="1"
                value={actualQuantity}
                onChange={(e) => setActualQuantity(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}>
                Actual Expiry Date
              </label>
              <DatePicker
                style={{ width: '100%' }}
                value={actualExpiryDate ? moment(actualExpiryDate) : null}
                onChange={(date) => setActualExpiryDate(date ? date.format('YYYY-MM-DD') : '')}
              />
            </div>

            <div className="mb-3">
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}>
                Receiving Notes
              </label>
              <Select
                options={noteOptions}
                value={noteOptions.find((opt) => opt.value === selectedNote)}
                onChange={(selected) => setSelectedNote(selected.value)}
                placeholder="Select a note"
              />
            </div>

            <div className="mb-2">
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}>
                Decision
              </label>
              <Radio.Group
                onChange={(e) => setApprovalStatus(e.target.value)}
                value={approvalStatus}
              >
                <Radio value="approved">Approve</Radio>
                <Radio value="rejected">Reject</Radio>
              </Radio.Group>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default InventoryList;
