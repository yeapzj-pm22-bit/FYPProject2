import React, { useState } from 'react';
import { Table, Tag, Button, Input, Space, Modal, Form, DatePicker, InputNumber, Select as AntSelect } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Link } from 'react-router-dom';

const { Option } = AntSelect;

const reasonOptions = [
  { value: 'high_demand', label: 'High Demand' },
  { value: 'low_stock', label: 'Low Stock' },
  { value: 'seasonal_increase', label: 'Seasonal Increase' },
  { value: 'other', label: 'Other' },
];

const medicines = [
  {
    id: 'M001',
    name: 'Paracetamol',
    form: 'Tablet',
    strength: '500 mg',
    indication: 'Pain Relief',
    category: 'Analgesics',
    quantity: 25,
    status: 'active',
  },
  {
    id: 'M002',
    name: 'Metformin',
    form: 'Tablet',
    strength: '850 mg',
    indication: 'Diabetes Mellitus',
    category: 'Hypoglycemics (Oral)',
    quantity: 60,
    status: 'inactive',
  },
];

const MedicineList = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);

  const [form] = Form.useForm();

  const handleRequest = (record) => {
    setSelectedMed(record);
    setShowModal(true);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
            onClick={() => handleReset(clearFilters, confirm)} // <-- pass both
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
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
   confirm({ closeDropdown: true }); // closes the dropdown after reset
 };

  const columns = [
    {
      title: 'Medicine ID',
      dataIndex: 'id',
      key: 'id',
      ...getColumnSearchProps('id'),
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'Medicine Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Dosage Form',
      dataIndex: 'form',
      key: 'form',
      ...getColumnSearchProps('form'),
    },
    {
      title: 'Strength',
      dataIndex: 'strength',
      key: 'strength',
    },
    {
      title: 'Indication',
      dataIndex: 'indication',
      key: 'indication',
      ...getColumnSearchProps('indication'),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      ...getColumnSearchProps('category'),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text, record) => (
        <span>
          {text} {text < 30 && <Tag color="red">Low</Tag>}{' '}
          {text < 30 && (
            <a
              style={{ color: '#1677ff', cursor: 'pointer' }}
              onClick={() => handleRequest(record)}
            >
              Request Refill
            </a>
          )}
        </span>
      ),
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'gray'}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => alert(`View ${record.name}`)}>View</Button>
      ),
    },
  ];


  return (
    <div className="container-fluid">
      <div className="page_title d-flex justify-content-between align-items-center">
        <h2>Medicine List</h2>
        <Link to="/medicine">
          <Button type="primary" shape="circle" icon={<PlusOutlined />} />
        </Link>
      </div>

      <Table columns={columns} dataSource={medicines} rowKey="id" pagination={{ pageSize: 5 }} />

      <Modal
        title="Request Medication"
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => {
          form.validateFields().then(values => {
            console.log('Submitted:', values);
            setShowModal(false);
          });
        }}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Medication Name">
            <Input value={selectedMed?.name} readOnly />
          </Form.Item>
          <Form.Item label="Quantity to Request" name="quantity" rules={[{ required: true }]}>
            <InputNumber min={1} className="w-100" />
          </Form.Item>
          <Form.Item label="Expected Expiry Date" name="expiry" rules={[{ required: true }]}>
            <DatePicker className="w-100" />
          </Form.Item>
          <Form.Item label="Reason" name="reason" rules={[{ required: true }]}>
            <AntSelect placeholder="Select reason">
              {reasonOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
              ))}
            </AntSelect>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MedicineList;