import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Row,
  Col,
  Typography,
} from 'antd';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const { Title } = Typography;
const { Option } = Select;

const CreateUser = () => {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const onFinish = (values) => {
    console.log('Form values:', values);
  };

  return (

    <div className="container-fluid">
      <div className="row column_title">
              <div className="col-md-12">
                <div className="page_title">
                  <h2>Create New User</h2>
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: 'Please select a role' }]}
              >
                <Select
                  placeholder="-- Select Role --"
                  onChange={(value) => setSelectedRole(value)}
                >
                  <Option value="doctor">Doctor</Option>
                  <Option value="pharmacist">Pharmacist</Option>
                  <Option value="nurse">Nurse</Option>
                  <Option value="patient">Patient</Option>
                </Select>
              </Form.Item>
            </Col>

            {selectedRole === 'doctor' && (
              <Col span={12}>
                <Form.Item
                  label="Expertise"
                  name="expertise"
                  rules={[{ required: true, message: 'Please enter expertise' }]}
                >
                  <Input placeholder="e.g. Cardiologist" />
                </Form.Item>
              </Col>
            )}

            <Col span={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Enter a valid email' },
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: 'Please select gender' }]}
              >
                <Select placeholder="-- Select Gender --">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Birth Date"
                name="birthDate"
                rules={[{ required: true, message: 'Please select birth date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please enter password' }]}
              >
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  suffix={
                    <span
                      onClick={() => setShowPassword((prev) => !prev)}
                      style={{ cursor: 'pointer' }}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  }
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('Passwords do not match')
                      );
                    },
                  }),
                ]}
              >
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm password"
                  suffix={
                    <span
                      onClick={() => setShowConfirm((prev) => !prev)}
                      style={{ cursor: 'pointer' }}
                    >
                      {showConfirm ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="text-end">
            <Button type="primary" htmlType="submit">
              Create User
            </Button>
          </Form.Item>
        </Form>
      </div>
       </div>
    </div>
  );
};

export default CreateUser;
