import React, { useState } from 'react';
import { Form, Input, DatePicker, Select, Button, Typography, Card } from 'antd';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const medicationOptions = [
  { value: 'paracetamol', label: 'Paracetamol 500mg Tablet' },
  { value: 'amoxicillin', label: 'Amoxicillin 250mg Capsule' },
  { value: 'ibuprofen', label: 'Ibuprofen 200mg Tablet' },
  { value: 'metformin', label: 'Metformin 500mg Tablet' },
];

const Inventory = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Submitted Values:', values);
  };

  return (
  <div className="container-fluid">
     <div className="row column_title">
             <div className="col-md-12">
               <div className="page_title">
                 <h2>Create New Medicine</h2>
               </div>
             </div>
           </div>
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px' }}>


      <Card>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
        >
          {/* Medication */}
          <Form.Item
            label="Medication"
            name="medication"
            rules={[{ required: true, message: 'Please select a medication' }]}
          >
            <Select
              showSearch
              placeholder="-- Select Medication --"
              filterOption={(input, option) =>
                (option?.children?.toLowerCase().includes(input.toLowerCase()) ||
                 option?.value?.toLowerCase().includes(input.toLowerCase()))
              }
            >
              {medicationOptions.map((med) => (
                <Option key={med.value} value={med.value}>
                  {med.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Quantity */}
          <Form.Item
            label="Quantity to Order"
            name="quantity"
            rules={[{ required: true, message: 'Please enter a quantity' }]}
          >
            <Input type="number" min={1} placeholder="Enter quantity" />
          </Form.Item>

          {/* Expiry Date */}
          <Form.Item
            label="Expected Expiry Date"
            name="expiryDate"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          {/* Supplier Name */}
          <Form.Item
            label="Supplier Name"
            name="supplierName"
            rules={[{ required: true, message: 'Please enter supplier name' }]}
          >
            <Input placeholder="Enter supplier name" />
          </Form.Item>

          {/* Submit */}
          <Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">
                Submit Order
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
    </div>
  );
};

export default Inventory;
