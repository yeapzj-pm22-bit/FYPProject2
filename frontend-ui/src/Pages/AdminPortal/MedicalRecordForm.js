import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Tag,
  Modal,
  Upload,
  Image,
} from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import PrescriptionModal from './PrescriptionModal';

const { TextArea } = Input;
const { Option } = Select;

const CreateMedicalRecordForm = () => {
  const [form] = Form.useForm();
  const [prescriptions, setPrescriptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [instruction, setInstruction] = useState('');
  const [refillChecked, setRefillChecked] = useState(false);
  const [refillCount, setRefillCount] = useState('');
  const [timeUnit, setTimeUnit] = useState('');
  const [duration, setDuration] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const [imageList, setImageList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);

  const medicineOptions = [
    { label: 'Panadol', value: 'panadol' },
    { label: 'Amoxicillin', value: 'amoxicillin' },
    { label: 'Ibuprofen', value: 'ibuprofen' },
  ];

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

    const updated = [...prescriptions];
    if (editingIndex !== null) {
      updated[editingIndex] = newPrescription;
    } else {
      updated.push(newPrescription);
    }

    setPrescriptions(updated);
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

  const handleSaveImages = () => {
    const newImages = fileList.map(file => ({
      src: URL.createObjectURL(file.originFileObj),
      description: '',
    }));
    setImageList(prev => [...prev, ...newImages]);
    setFileList([]);
    setShowImageModal(false);
  };

  const handleChange = ({ fileList }) => setFileList(fileList);

  const handlePreview = async file => {
    window.open(URL.createObjectURL(file.originFileObj));
  };

  const updateDescription = (index, desc) => {
    const updated = [...imageList];
    updated[index].description = desc;
    setImageList(updated);
  };

  const removeImage = (index) => {
    const updated = imageList.filter((_, i) => i !== index);
    setImageList(updated);
  };

  return (
  <div className="container-fluid">
  <div className="row column_title">
          <div className="col-md-12">
            <div className="page_title">
              <h2>Create Medical Record</h2>
            </div>
          </div>
        </div>

<div className="row justify-content-center">
    <div className="col-md-10 col-lg-8">

    <Form
      form={form}
      layout="vertical"
      style={{
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '20px',
        maxWidth: 800,
        backgroundColor: '#fff',
      }}
    >
      <Form.Item
        label="Patient"
        name="patient"
        rules={[{ required: true, message: 'Please select a patient' }]}
      >
        <Select placeholder="-- Select Patient --">
          <Option value="john">John Doe</Option>
          <Option value="jane">Jane Smith</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Diagnosis"
        name="diagnosis"
        rules={[{ required: true, message: 'Please enter diagnosis' }]}
      >
        <TextArea
          placeholder="Enter diagnosis"
          rows={3}
          style={{ resize: 'none' }}
        />
      </Form.Item>

      <Form.Item label="Prescriptions">
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
              style={{
                cursor: 'pointer',
                padding: '0.5rem 1rem',
                fontSize: '14px',
              }}
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
      </Form.Item>

      <Form.Item label="Medical Image">
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
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">Submit Record</Button>
      </Form.Item>

      {/* Prescription Modal */}
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

      {/* Image Upload Modal */}
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
          beforeUpload={() => false}
        >
          {fileList.length >= 10 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </Modal>
    </Form>
</div>
</div>
    </div>
  );
};

export default CreateMedicalRecordForm;
