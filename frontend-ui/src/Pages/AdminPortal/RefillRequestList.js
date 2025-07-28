import React, { useRef, useState, useMemo } from 'react';
import { Table, Input, Button, Space, Tag, Radio,Modal,Checkbox  } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Modal2 } from 'react-bootstrap';

const RefillRequestList = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedMedicineIds, setSelectedMedicineIds] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Pending');

  const [records, setRecords] = useState([
    {
      refillId: 'R001',
      patientName: 'John Doe',
      status: 'Pending',
      medicines: [
        { name: 'Amoxicillin', quantity: 15 },
        { name: 'Paracetamol', quantity: 10 },
      ],
    },
    {
      refillId: 'R002',
      patientName: 'Jane Smith',
      status: 'Pending',
      medicines: [{ name: 'Ibuprofen', quantity: 20 }],
    },
  ]);

  const handleOpenModal = (refillId) => {
    const found = records.find((r) => r.refillId === refillId);
    setSelectedPatient(found);
    setSelectedStatus(found.status);
    setSelectedMedicineIds(found.medicines.map((m) => m.name)); // Pre-select all
    setShowModal2(true);
  };

  const handleDispenseSubmit = () => {
    const updated = records.map((rec) =>
      rec.refillId === selectedPatient.refillId
        ? { ...rec, status: selectedStatus }
        : rec
    );
    setRecords(updated);
    setShowModal2(false);
  };

  const handleMedicineCheckbox = (name) => {
    setSelectedMedicineIds((prev) =>
      prev.includes(name)
        ? prev.filter((id) => id !== name)
        : [...prev, name]
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
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
            onClick={() => handleReset(clearFilters)}
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
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
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

  const flattenedTableData = useMemo(() => {
    const flattened = [];
    records.forEach((record) => {
      record.medicines.forEach((med, index) => {
        flattened.push({
          refillId: record.refillId,
          patientName: record.patientName,
          status: record.status,
          medicineName: med.name,
          quantity: med.quantity,
          isFirst: index === 0,
          span: record.medicines.length,
        });
      });
    });
    return flattened;
  }, [records]);

  const columns = [
    {
      title: 'Refill ID',
      dataIndex: 'refillId',
      sorter: (a, b) => a.refillId.localeCompare(b.refillId),
      ...getColumnSearchProps('refillId'),
      render: (_, row) => ({
        children: row.refillId,
        props: {
          rowSpan: row.isFirst ? row.span : 0,
        },
      }),
    },
    {
      title: 'Patient Name',
      dataIndex: 'patientName',
      ...getColumnSearchProps('patientName'),
      render: (_, row) => ({
        children: row.patientName,
        props: {
          rowSpan: row.isFirst ? row.span : 0,
        },
      }),
    },
    {
      title: 'Medicine',
      dataIndex: 'medicineName',
      ...getColumnSearchProps('medicineName'),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Approved', value: 'Approved' },
        { text: 'Rejected', value: 'Rejected' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status, row) => ({
        children: (
          <Tag
            color={
              status === 'Approved'
                ? 'green'
                : status === 'Rejected'
                ? 'red'
                : 'orange'
            }
          >
            {status}
          </Tag>
        ),
        props: {
          rowSpan: row.isFirst ? row.span : 0,
        },
      }),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, row) => ({
        children: (
          <Button size="small" type="link" onClick={() => handleOpenModal(row.refillId)}>
            View
          </Button>
        ),
        props: {
          rowSpan: row.isFirst ? row.span : 0,
        },
      }),
    },
  ];

  return (
    <>
      <div className="container-fluid">
        <div className="row column_title">
          <div className="col-md-12">
            <div className="page_title d-flex justify-content-between align-items-center">
              <h2>Refill Medicines Request List</h2>
            </div>
          </div>
        </div>

        <div className="main_content_iner">
          <div className="container-fluid p-0">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="white_card card_height_100 mb_30">
                  <div className="white_card_body">
                    <Table
                      columns={columns}
                      dataSource={flattenedTableData}
                      rowKey={(record, index) => `${record.refillId}-${index}`}
                      pagination={{ pageSize: 5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title="Refill Medicines Request"
        open={showModal2}
        onCancel={() => setShowModal2(false)}
        onOk={handleDispenseSubmit}
        okText="Submit"
        cancelText="Close"
      >
        <div style={{ marginBottom: 12 }}>
          <span style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}>
            Patient Name:
          </span>
          <span style={{ color: '#000' }}>{selectedPatient?.patientName}</span>
        </div>

        <div style={{ marginBottom: 12 }}>
          <span style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}>
            Refill ID:
          </span>
          <span style={{ color: '#000' }}>{selectedPatient?.refillId}</span>
        </div>

        <div className="mb-3">
          <span style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}>
            Medicines:
          </span>
          <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: '#000' }}>
            {selectedPatient?.medicines?.map((med, index) => (
              <li key={index} style={{ marginBottom: 4 }}>
                {med.name} ({med.quantity})
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3">
          <span style={{ display: 'block', fontWeight: 'bold', marginBottom: 4, color: '#000' }}>
            Status:
          </span>
          <Radio.Group
            onChange={(e) => setSelectedStatus(e.target.value)}
            value={selectedStatus}
          >
            <Radio value="Approved" style={{ color: '#000' }}>Approved</Radio>
            <Radio value="Rejected" style={{ color: '#000' }}>Rejected</Radio>
          </Radio.Group>
        </div>
      </Modal>
    </>
  );
};

export default RefillRequestList;
