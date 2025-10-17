import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Skeleton,
  Card,
  Tag,
} from "antd";
import moment from "moment";
import { X } from "lucide-react";

const { Option } = Select;

const EditUser = () => {
  const url = "http://localhost:5000"
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      setUserLoading(true);
      try {
        // Fetch current user details
        const resUser = await fetch(`${url}/api/user/${id}`);
        if (!resUser.ok) throw new Error("Failed to fetch user data");
        const data = await resUser.json();
        const userData = Array.isArray(data) ? data[0] : data;

        // Fetch users followed by this user
        const resFollowing = await fetch(
          `${url}/api/follow/${id}/following`
        );
        if (!resFollowing.ok)
          throw new Error("Failed to fetch following list");
        const followingData = await resFollowing.json();
        const followingUserIds = followingData.map((u) => u.id);
        setFollowingIds(followingUserIds);
        setFollowingUsers(followingData);

        // Fetch all users for dropdown
        const resAllUsers = await fetch(`${url}/api/user`);
        if (!resAllUsers.ok) throw new Error("Failed to fetch all users");
        const allUsersData = await resAllUsers.json();
        const filteredUsers = allUsersData.filter(
          (u) => u.id !== Number(id)
        );
        setAllUsers(filteredUsers);

        // Prefill form fields
        form.setFieldsValue({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          dob: userData.dob ? moment(userData.dob) : null,
          avatar_url: userData.avatar_url || "",
        });
      } catch (error) {
        message.error(error.message);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, [id, form]);

  // 🟢 Remove user from following immediately in UI + backend
  const handleRemoveFollowing = async (followeeId) => {
    try {
      const res = await fetch(
        `${url}/api/follow/${id}/unfollow`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followeeId }),
        }
      );
      if (!res.ok) throw new Error("Failed to unfollow user");

      setFollowingIds((prev) => prev.filter((fid) => fid !== followeeId));
      setFollowingUsers((prev) => prev.filter((u) => u.id !== followeeId));
      message.success("User removed from following list");
    } catch (error) {
      message.error(error.message);
    }
  };

  // 🟢 Add new user to following
  const handleAddFollowing = async (followeeId) => {
    if (followingIds.includes(followeeId)) {
      message.info("Already following this user");
      return;
    }
    try {
      const res = await fetch(
        `${url}/api/follow/${id}/follow`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followeeId }),
        }
      );
      if (!res.ok) throw new Error("Failed to follow user");

      const addedUser = allUsers.find((u) => u.id === followeeId);
      setFollowingUsers((prev) => [...prev, addedUser]);
      setFollowingIds((prev) => [...prev, followeeId]);
      message.success(`Now following ${addedUser.name}`);
    } catch (error) {
      message.error(error.message);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
        avatar_url: values.avatar_url || "",
      };

      const resUser = await fetch(`${url}/api/user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resUser.ok) throw new Error("Failed to update user");

      message.success("✅ User details updated!");
      navigate("/dashboard");
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-10">
      <Card
        title={<h2 className="text-2xl font-bold text-center">Edit User</h2>}
        bordered={false}
        className="w-full max-w-md rounded-2xl shadow-xl backdrop-blur-md bg-white/90"
      >
        {userLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* Basic Info */}
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
                { type: "email", message: "Invalid email" },
              ]}
            >
              <Input size="large" placeholder="john@example.com" />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please enter the phone" }]}
            >
              <Input size="large" placeholder="1234567890" />
            </Form.Item>

            <Form.Item
              label="Date of Birth"
              name="dob"
              rules={[{ required: true, message: "Please select DOB" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                size="large"
                disabledDate={(current) =>
                  current && current > moment().endOf("day")
                }
              />
            </Form.Item>

            <Form.Item label="Avatar URL" name="avatar_url">
              <Input
                size="large"
                placeholder="https://example.com/avatar.jpg"
              />
            </Form.Item>

            {/* 🔹 Current Following List */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-gray-700">
                Currently Following:
              </h3>
              {followingUsers.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Not following anyone yet.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {followingUsers.map((user) => (
                    <Tag
                      key={user.id}
                      color="blue"
                      closable
                      onClose={() => handleRemoveFollowing(user.id)}
                      closeIcon={<X size={14} />}
                    >
                      {user.name}
                    </Tag>
                  ))}
                </div>
              )}
            </div>

            {/* 🔹 Add New Following */}
            <Form.Item label="Add More Following">
              <Select
                placeholder="Select users to follow"
                onSelect={(value) => handleAddFollowing(value)}
                optionFilterProp="children"
                showSearch
              >
                {allUsers
                  .filter((u) => !followingIds.includes(u.id))
                  .map((u) => (
                    <Option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                Update User
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default EditUser;
