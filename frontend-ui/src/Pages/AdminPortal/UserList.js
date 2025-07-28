import React, { useState, useRef } from 'react';
import { Table, Input, Button, Space, Tag } from 'antd';
import { SearchOutlined , PlusOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Link } from 'react-router-dom';

const UserList = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

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

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      sorter: (a, b) => a.userId.localeCompare(b.userId),
      ...getColumnSearchProps('userId')
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email')
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      filters: [
        { text: 'Male', value: 'Male' },
        { text: 'Female', value: 'Female' }
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: 'Birth Date',
      dataIndex: 'birthDate',
      key: 'birthDate',
      sorter: (a, b) => new Date(a.birthDate) - new Date(b.birthDate),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Patient', value: 'Patient' },
        { text: 'Admin', value: 'Admin' }
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'IC Verify',
      dataIndex: 'icVerify',
      key: 'icVerify',
      filters: [
        { text: 'Pending Verification', value: 'Pending Verification' },
        { text: 'Not Verified', value: 'Not Verified' },
        { text: 'Verified', value: 'Verified' }
      ],
      onFilter: (value, record) => record.icVerify === value,
      render: (status, record) => {
        if (record.role !== 'Patient') return '-';
        let color = 'default';
        if (status === 'Pending Verification') color = 'warning';
        else if (status === 'Verified') color = 'success';
        else if (status === 'Not Verified') color = 'error';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Inactive', value: 'Inactive' },
        { text: 'Blocked', value: 'Blocked' }
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = status === 'Active' ? 'green' : status === 'Inactive' ? 'gray' : 'red';
        return <Tag color={color}>{status}</Tag>;
      }
    }
  ];

  const data = [
    {
      key: '1',
      userId: 'U001',
      name: 'Yeap Zi',
      email: 'jia@gmail.com',
      gender: 'Male',
      birthDate: '2005-02-03',
      role: 'Patient',
      icVerify: 'Pending Verification',
      status: 'Active'
    },
    {
      key: '2',
      userId: 'U002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      gender: 'Female',
      birthDate: '1990-09-15',
      role: 'Patient',
      icVerify: 'Not Verified',
      status: 'Inactive'
    },
    {
      key: '3',
      userId: 'U003',
      name: 'Ali Ahmad',
      email: 'ali@clinic.com',
      gender: 'Male',
      birthDate: '1985-06-21',
      role: 'Admin',
      icVerify: '',
      status: 'Blocked'
    }
  ];

  return (
    <div className="container-fluid">
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>User List</h2>
            <Link to="/create-user">
                                              <Button type="primary" shape="circle" icon={<PlusOutlined />} />
            </Link>
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
    </div>
  );
};

export default UserList;
