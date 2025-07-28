import React, { useState, useRef } from 'react';
import { Table, Input, Button, Space, Tag , Image, Select, Modal, Upload} from 'antd';
import { SearchOutlined, PlusOutlined,CloseOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import userImg from './images/layout_img/user_img.jpg';
import PrescriptionModal from './PrescriptionModal';

const MedicalRecordList = () => {
const medicineOptions = [
  { label: 'Paracetamol', value: 'paracetamol' },
  { label: 'Ibuprofen', value: 'ibuprofen' },
  { label: 'Amoxicillin', value: 'amoxicillin' },
  // Add more medicines as needed
];
    const handleSubmit = () => {
          console.log({
            selectedPatient,
            diagnosis,
            prescriptions,
            uploadedImages,
          });
          setShowPrescriptionModal(false);
        };
        const [showImageModal, setShowImageModal] = useState(false);
          const [imageList, setImageList] = useState([]);
          const [fileList, setFileList] = useState([]);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientOptions, setPatientOptions] = useState([
      { label: 'John Doe', value: 'john' },
      { label: 'Jane Smith', value: 'jane' },
    ]);
    const [diagnosis, setDiagnosis] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [showAddPrescriptionModal, setShowAddPrescriptionModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [editPrescriptionIndex, setEditPrescriptionIndex] = useState(null);
    const [editPrescriptionValue, setEditPrescriptionValue] = useState('');
    const [showEditPrescriptionModal, setShowEditPrescriptionModal] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [instruction, setInstruction] = useState('');
    const [refillChecked, setRefillChecked] = useState(false);
    const [refillCount, setRefillCount] = useState('');
    const [timeUnit, setTimeUnit] = useState('');
    const [duration, setDuration] = useState('');



   //Handle Prescription
    const openAddModal = () => {
      resetForm();
      setEditingIndex(null);
      setShowModal(true);
    };

    const handleChipClick = (index) => {
      const item = prescriptions[index];
      setSelectedMedicine(item.medicine);
      setQuantity(item.quantity);
      setInstruction(item.instruction);
      setRefillChecked(item.refillChecked);
      setRefillCount(item.refillCount);
      setTimeUnit(item.timeUnit);
      setDuration(item.duration);
      setEditingIndex(index);
      setShowModal(true);
    };

    const handleSubmitPrescription = () => {
      const newPrescription = {
        medicine: selectedMedicine,
        quantity,
        instruction,
        refillChecked,
        refillCount,
        timeUnit,
        duration,
      };

      if (editingIndex !== null) {
        const updated = [...prescriptions];
        updated[editingIndex] = newPrescription;
        setPrescriptions(updated);
      } else {
        setPrescriptions([...prescriptions, newPrescription]);
      }

      setShowModal(false);
      resetForm();
    };

    const resetForm = () => {
      setSelectedMedicine(null);
      setQuantity('');
      setInstruction('');
      setRefillChecked(false);
      setRefillCount('');
      setTimeUnit('');
      setDuration('');
    };

    const handleEditPrescription = (index) => {
     setEditPrescriptionIndex(index);
     setEditPrescriptionValue(prescriptions[index].medicine); // make sure 'prescriptions' state exists
     setShowEditPrescriptionModal(true); // make sure this modal toggle exists too
   };

    const removePrescription = (index) => {
        const updated = prescriptions.filter((_, i) => i !== index);
        setPrescriptions(updated);
      };



    //Handle Prescription



    //Handle Image
    const handlePreview = async (file) => {
        const src = file.thumbUrl || (await getBase64(file.originFileObj));
        Modal.info({
          title: file.name,
          content: <Image src={src} alt={file.name} style={{ width: '100%' }} />,
        });
      };

      // Convert file to base64
      const getBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });

      // Handle file upload change
      const handleChange = async ({ fileList: newList }) => {
        const updatedImages = await Promise.all(
          newList.map(async (file) => {
            const base64 = file.thumbUrl || (await getBase64(file.originFileObj));
            return {
              src: base64,
              name: file.name,
              description: '', // initially empty
            };
          })
        );
        setFileList(newList);
        setImageList(updatedImages);
      };

      // Save image list and close modal
      const handleSaveImages = () => {
        setShowImageModal(false);
      };

      // Remove image
      const removeImage = (idx) => {
        const newImages = [...imageList];
        newImages.splice(idx, 1);
        setImageList(newImages);

        const newFileList = [...fileList];
        newFileList.splice(idx, 1);
        setFileList(newFileList);
      };

      // Update description
      const updateDescription = (idx, value) => {
        const newImages = [...imageList];
        newImages[idx].description = value;
        setImageList(newImages);
      };

    //Handle Image




  const handleView = (recordId) => {
    navigate('/medical-edit');
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

  const columns = [
    {
      title: 'Record ID',
      dataIndex: 'recordId',
      key: 'recordId',
      sorter: (a, b) => a.recordId.localeCompare(b.recordId),
      ...getColumnSearchProps('recordId'),
    },
    {
      title: 'Patient Name',
      dataIndex: 'patientName',
      key: 'patientName',
      sorter: (a, b) => a.patientName.localeCompare(b.patientName),
      ...getColumnSearchProps('patientName'),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Diagnosis',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      render: (text) => (
        <span style={{ maxWidth: '200px', display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</span>
      ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (imgSrc) => (
        <img src={imgSrc} alt="Medical" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Completed', value: 'Completed' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === 'Pending' ? 'gold' : 'green'}>{status}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => {
            setSelectedRecord(record);     // Set the selected row data
            setShowPrescriptionModal(true); // Show modal
          }}
        >
          View
        </Button>
      ),
    },
  ];

  const dataSource = [
    {
      key: '1',
      recordId: 'MR001',
      patientName: 'Yeap Zi',
      date: '2025-07-27',
      diagnosis: 'Flu with mild symptoms, prescribed Paracetamol',
      image: userImg,
      status: 'Pending',
    },
    {
      key: '2',
      recordId: 'MR002',
      patientName: 'Jane Smith',
      date: '2025-07-20',
      diagnosis: 'High blood pressure – prescribed Metformin and lifestyle changes',
      image: userImg,
      status: 'Completed',
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row column_title">
        <div className="col-md-12">
          <div className="page_title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>Medical Record List</h2>
            <Link to="/create-medical">
                                  <Button type="primary" shape="circle" icon={<PlusOutlined />} />
             </Link>

          </div>
        </div>
      </div>
      <div className="main_content_iner ">
        <div className="container-fluid p-0">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="white_card card_height_100 mb_30">
                <div className="white_card_body">
                  <Table columns={columns} dataSource={dataSource} bordered pagination={{ pageSize: 5 }} />
                  <Modal
                    title="Create Prescription"
                    open={showPrescriptionModal}
                    onCancel={() => setShowPrescriptionModal(false)}
                    footer={null}
                    width={800}
                  >
                    <div className="row g-4 mb-4">
                      {/* Patient Selection */}
                      <div className="col-md-6">
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4 }}>Patient</label>
                        <Select
                          showSearch
                          style={{ width: '100%' }}
                          value={selectedPatient?.value}
                          onChange={(val) => {
                            const selected = patientOptions.find(p => p.value === val);
                            setSelectedPatient(selected);
                          }}
                          placeholder="-- Select Patient --"
                          options={patientOptions}
                        />
                      </div>

                      {/* Diagnosis */}
                      <div className="col-md-6">
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4 }}>Diagnosis</label>
                        <Input.TextArea
                          placeholder="Enter diagnosis"
                          rows={5} // 👈 increase rows for taller height
                          value={diagnosis}
                          onChange={(e) => setDiagnosis(e.target.value)}
                          style={{
                            resize: 'none',     // Disable manual resizing
                            overflow: 'auto',   // Show scrollbar if text overflows
                            fontSize: '14px',   // Optional: larger font
                          }}
                        />
                      </div>

                      {/* Prescriptions */}
                      <div className="d-flex flex-wrap gap-2 align-items-center">
                        {prescriptions.map((item, idx) => (
                          <Tag
                            key={idx}
                            color="blue"
                            closable
                            onClose={(e) => {
                              e.preventDefault();
                              setPrescriptions(prescriptions.filter((_, i) => i !== idx));
                            }}
                            onClick={() => handleChipClick(idx)}
                            style={{ cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '14px' }}
                          >
                            {item.medicine?.label || item.medicine}
                          </Tag>
                        ))}
                        <Button
                          icon={<PlusOutlined />}
                          onClick={openAddModal}
                          type="dashed"
                          shape="circle"
                        />
                      </div>

                      <PrescriptionModal
                        visible={showModal}
                        onCancel={() => setShowModal(false)}
                        onSubmit={handleSubmitPrescription}
                        isEditing={editingIndex !== null}
                        selectedMedicine={selectedMedicine}
                        setSelectedMedicine={setSelectedMedicine}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        instruction={instruction}
                        setInstruction={setInstruction}
                        refillChecked={refillChecked}
                        setRefillChecked={setRefillChecked}
                        refillCount={refillCount}
                        setRefillCount={setRefillCount}
                        timeUnit={timeUnit}
                        setTimeUnit={setTimeUnit}
                        duration={duration}
                        setDuration={setDuration}
                        medicineOptions={medicineOptions}
                      />

                      {/* Medical Images */}
                      <div className="col-md-12">
                              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4 }}>Medical Image</label>
                              <div
                                className="d-flex align-items-center gap-2 border rounded p-2"
                                style={{ cursor: 'pointer', height: '45px' }}
                                onClick={() => setShowImageModal(true)}
                              >
                                <PlusOutlined className="text-primary" />
                                <span>Add Image</span>
                              </div>

                              {imageList.length > 0 && (
                                <div className="d-flex flex-wrap gap-3 mt-3">
                                  {imageList.map((img, idx) => (
                                    <div key={idx} className="position-relative text-center">
                                      <Image
                                        src={img.src}
                                        alt={`img-${idx}`}
                                        width={100}
                                        height={100}
                                        style={{ objectFit: 'cover', borderRadius: 5 }}
                                      />
                                      <Button
                                        type="primary"
                                        danger
                                        size="small"
                                        shape="circle"
                                        icon={<CloseOutlined />}
                                        style={{ position: 'absolute', top: 0, right: 0 }}
                                        onClick={() => removeImage(idx)}
                                      />
                                      <Input.TextArea
                                        autoSize={{ minRows: 3, maxRows: 3 }}
                                        rows={1}
                                        placeholder="Description"
                                        value={img.description}
                                        onChange={(e) => updateDescription(idx, e.target.value)}
                                        style={{ width: 100, marginTop: 5, fontSize: '12px' }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <Modal
                                    title="Upload Medical Images"
                                    open={showImageModal}
                                    onCancel={() => setShowImageModal(false)}
                                    onOk={handleSaveImages}
                                  >
                                    <Upload
                                      listType="picture-card"
                                      fileList={fileList}
                                      onPreview={handlePreview}
                                      onChange={handleChange}
                                      multiple
                                      beforeUpload={() => false} // prevent auto-upload
                                    >
                                      {fileList.length >= 10 ? null : (
                                        <div>
                                          <PlusOutlined />
                                          <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                      )}
                                    </Upload>
                                  </Modal>

                      {/* Submit Button */}
                      <div className="text-end mt-4" style={{ width: '100%' }}>
                        <Button type="primary" onClick={handleSubmit}>
                          Submit Record
                        </Button>
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordList;