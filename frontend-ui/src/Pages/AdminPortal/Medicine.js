import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Typography,
} from 'antd';
import {
  categoryOptions,
  dosageFormOptions,
  approvedIndicationOptions,
  sideEffectOptions,
  statusOptions,
  dosageFormUnits,
} from './medicineOptions'; // Move large constants into separate file for cleaner code
const { Title } = Typography;
const { Option, OptGroup } = Select;



const Medicine = () => {
  const [form] = Form.useForm();
  const [unit, setUnit] = useState('');

  const handleDosageFormChange = (value) => {
    const unitVal = dosageFormUnits[value] || '';
    setUnit(unitVal);
    form.setFieldsValue({ unit: unitVal });
  };

  const onFinish = (values) => {
    console.log('Form Submitted:', values);
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

      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="p-4 border rounded shadow bg-white"

          >
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <Form.Item
                  label="Medicine Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter medicine name' }]}
                >
                  <Input placeholder="Enter medicine name" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Dosage Form"
                  name="dosageForm"
                  rules={[{ required: true, message: 'Please select dosage form' }]}
                >
                  <Select
                    placeholder="-- Select Dosage Form --"
                    onChange={handleDosageFormChange}
                    showSearch
                    optionFilterProp="label" // optional, but not effective alone with OptGroup
                    filterOption={(input, option) =>
                      option?.children?.toLowerCase().includes(input.toLowerCase()) ||
                      option?.value?.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {dosageFormOptions.map((group) => (
                      <OptGroup key={group.label} label={group.label}>
                        {group.options.map((opt) => (
                          <Option key={opt.value} value={opt.value}>
                            {opt.label}
                          </Option>
                        ))}
                      </OptGroup>
                    ))}
                  </Select>

                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Strength"
                  name="strength"
                  rules={[{ required: true, message: 'Please enter strength' }]}
                >
                  <Input placeholder="e.g. 500" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Unit" name="unit">
                  <Input value={unit} readOnly />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Category"
                  name="category"
                  rules={[{ required: true, message: 'Please select category' }]}
                >
                  <Select
                    placeholder="-- Select Category --"
                    showSearch
                    optionFilterProp="label" // optional when using custom filter
                    filterOption={(input, option) =>
                      option?.children?.toLowerCase().includes(input.toLowerCase()) ||
                      option?.value?.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {categoryOptions.map((group) => (
                      <OptGroup key={group.label} label={group.label}>
                        {group.options.map((opt) => (
                          <Option key={opt.value} value={opt.value}>
                            {opt.label}
                          </Option>
                        ))}
                      </OptGroup>
                    ))}
                  </Select>

                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Approved Indication"
                  name="approvedIndication"
                  rules={[{ required: true, message: 'Please select indication' }]}
                >
                  <Select
                    placeholder="-- Select Approved Indication --"
                    showSearch
                    filterOption={(input, option) =>
                      option?.children?.toLowerCase().includes(input.toLowerCase()) ||
                      option?.value?.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {approvedIndicationOptions.map((group) => (
                      <OptGroup key={group.label} label={group.label}>
                        {group.options.map((opt) => (
                          <Option key={opt.value} value={opt.value}>
                            {opt.label}
                          </Option>
                        ))}
                      </OptGroup>
                    ))}
                  </Select>

                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Side Effects"
                  name="sideEffects"
                  rules={[{ required: true, message: 'Please select at least one side effect' }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select side effects"
                    showSearch
                    filterOption={(input, option) =>
                      option?.children?.toLowerCase().includes(input.toLowerCase()) ||
                      option?.value?.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {sideEffectOptions.map((group) => (
                      <OptGroup key={group.label} label={group.label}>
                        {group.options.map((opt) => (
                          <Option key={opt.value} value={opt.value}>
                            {opt.label}
                          </Option>
                        ))}
                      </OptGroup>
                    ))}
                  </Select>

                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Manufacturer Name"
                  name="manufacturer"
                  rules={[{ required: true, message: 'Please enter manufacturer name' }]}
                >
                  <Input placeholder="Enter manufacturer name" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Status"
                  name="status"
                  rules={[{ required: true, message: 'Please select status' }]}
                >
                  <Select placeholder="-- Select Status --">
                    {statusOptions.map((opt) => (
                      <Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="text-end">
              <Button type="primary" htmlType="submit">
                Create Medication
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Medicine;
