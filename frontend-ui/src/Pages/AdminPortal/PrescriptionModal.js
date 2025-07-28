import React from 'react';
import { Modal, Input, Select, Checkbox, Form } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const PrescriptionModal = ({
  visible,
  onCancel,
  onSubmit,
  isEditing,
  selectedMedicine,
  setSelectedMedicine,
  quantity,
  setQuantity,
  instruction,
  setInstruction,
  refillChecked,
  setRefillChecked,
  refillCount,
  setRefillCount,
  timeUnit,
  setTimeUnit,
  duration,
  setDuration,
  medicineOptions,
}) => {
  return (
    <Modal
      title={isEditing ? 'Edit Prescription' : 'Add Prescription'}
      open={visible}
      onCancel={onCancel}
      onOk={onSubmit}
      okText={isEditing ? 'Update' : 'Add'}
    >
      <Form layout="vertical">
        <Form.Item label="Medicine">
          <Select
            value={selectedMedicine}
            onChange={setSelectedMedicine}
            placeholder="-- Select Medicine --"
            options={medicineOptions}
          />
        </Form.Item>

        <Form.Item label="Quantity">
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
          />
        </Form.Item>

        <Form.Item label="Medical Instruction">
          <TextArea
            rows={5}
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Enter medical instruction"
            style={{
              resize: 'none',
              overflow: 'auto',
              fontSize: '14px',
            }}
          />
        </Form.Item>

        <Form.Item>
          <Checkbox
            checked={refillChecked}
            onChange={(e) => setRefillChecked(e.target.checked)}
          >
            Enable Refill
          </Checkbox>
        </Form.Item>

        {refillChecked && (
          <>
            <Form.Item label="Refill Count">
              <Input
                type="number"
                value={refillCount}
                onChange={(e) => setRefillCount(e.target.value)}
                placeholder="Enter refill count"
              />
            </Form.Item>

            <Form.Item label="Time Unit">
              <Select
                value={timeUnit}
                onChange={(value) => setTimeUnit(value)}
                placeholder="-- Select Time Unit --"
              >
                <Option value="day">Day(s)</Option>
                <Option value="week">Week(s)</Option>
                <Option value="month">Month(s)</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Duration">
              <Input

                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter duration"
              />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default PrescriptionModal;
