import React, { useState } from "react";
import { Form, Input, Button, DatePicker, message, Card } from "antd";
import moment from "moment";

const CreateUser = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        dob: values.dob.format("YYYY-MM-DD"),
        avatar_url: values.avatar_url || "",
      };

      const res = await fetch("http://localhost:5000/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create user");
      }

      messageApi.open({
        type: "success",
        content: "✅ User created successfully!",
        duration: 3,
      });
      form.resetFields();
    } catch (error) {
      messageApi.open({
        type: "error",
        content: `❌ ${error.message}`,
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-10">
      {contextHolder}
      <Card
        title={
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Create New User
          </h2>
        }
        bordered={false}
        className="w-full max-w-md rounded-2xl shadow-xl backdrop-blur-md bg-white/90"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input size="large" placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter the email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input size="large" placeholder="john@example.com" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter the phone number" }]}
          >
            <Input size="large" placeholder="1234567890" />
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            name="dob"
            rules={[{ required: true, message: "Please select date of birth" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              size="large"
              disabledDate={(current) => current && current > moment().endOf("day")}
              placeholder="Select Date of Birth"
            />
          </Form.Item>

          <Form.Item label="Avatar URL" name="avatar_url">
            <Input
              size="large"
              placeholder="https://example.com/avatar.jpg"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              className="rounded-lg mt-2 bg-blue-600 hover:bg-blue-700"
            >
              Create User
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateUser;
