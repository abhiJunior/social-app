import React, { useEffect, useState } from "react";
import { Card, Button, Avatar, message, Skeleton, Select } from "antd";
import { UserPlus, UserMinus, Edit2 } from "lucide-react";
import { Link } from "react-router-dom";

const { Meta } = Card;
const { Option } = Select;

const Dashboard = () => {
  const apiBase = "http://localhost:5000";
  const [users, setUsers] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectLoading, setSelectLoading] = useState(false);

  // ✅ Initialize message API
  const [messageApi, contextHolder] = message.useMessage();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/user`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.message,
        placement: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowingIds = async (userId) => {
    try {
      const res = await fetch(`${apiBase}/api/follow/${userId}/following`);
      if (!res.ok) throw new Error("Failed to fetch following list");
      const data = await res.json();
      const ids = data.map((u) => u.id);
      setFollowingIds(ids);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.message,
        placement: "top",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentUserId) fetchFollowingIds(currentUserId);
  }, [currentUserId]);

  const isFollowing = (user) => followingIds.includes(user.id);

  const handleFollowToggle = async (user) => {
    if (user.id === currentUserId) {
      messageApi.open({
        type: "error",
        content: "❌ You can't follow yourself",
        placement: "top",
        duration: 3,
      });
      return;
    }

    const action = isFollowing(user) ? "unfollow" : "follow";
    const endpoint = `${apiBase}/api/follow/${currentUserId}/${action}`;
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followeeId: user.id }),
      });
      if (!res.ok) throw new Error("Failed to update follow status");

      messageApi.open({
        type: "success",
        content: `${isFollowing(user) ? "Unfollowed" : "Followed"} ${user.name}`,
        placement: "top",
      });
      await fetchFollowingIds(currentUserId);
      await fetchUsers();
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.message,
        placement: "top",
      });
    }
  };

  const handleUserSelect = (selectedEmail) => {
    const selectedUser = users.find((u) => u.email === selectedEmail);
    if (selectedUser) {
      setCurrentUserId(selectedUser.id);
      messageApi.open({
        type: "info",
        content: `Switched to ${selectedUser.name}`,
        placement: "top",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-6">
      {/* Ant Design message container */}
      {contextHolder}

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          User Dashboard
        </h1>

        <Select
          showSearch
          style={{ width: 250 }}
          placeholder="Select current user (by email)"
          optionFilterProp="children"
          loading={selectLoading}
          value={
            users.find((u) => u.id === currentUserId)?.email || "Select User"
          }
          onChange={handleUserSelect}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {users.map((user) => (
            <Option key={user.id} value={user.email}>
              {user.email}
            </Option>
          ))}
        </Select>
      </div>

      {/* User Cards */}
      {loading ? (
        <div className="flex justify-center">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {users.map((user) => (
            <Card
              key={user.id}
              className="rounded-2xl shadow-sm border border-gray-200 hover:shadow-2xl transition-all duration-300 bg-white/70 backdrop-blur-md"
              cover={
                <div className="relative h-48 overflow-hidden rounded-t-2xl bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
                  <Avatar
                    src={
                      user.avatar_url ||
                      "https://www.bing.com/th/id/OIP.sDGudWbPLYyfB9reTqQ6kgHaHa?w=198&h=211&c=8&rs=1&qlt=90&o=6&cb=12&dpr=1.3&pid=3.1&rm=2"
                    }
                    size={120}
                    className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 border-4 border-white shadow-lg"
                  />
                </div>
              }
              bodyStyle={{ paddingTop: 60 }}
              actions={[
                <Button
                  key="follow"
                  type={isFollowing(user) ? "default" : "primary"}
                  icon={isFollowing(user) ? <UserMinus /> : <UserPlus />}
                  block
                  shape="round"
                  size="large"
                  onClick={() => handleFollowToggle(user)}
                  className={`${
                    isFollowing(user)
                      ? "bg-gray-200 hover:bg-gray-300"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  } transition-all duration-300`}
                >
                  {isFollowing(user) ? "Unfollow" : "Follow"}
                </Button>,

                <Link key="edit" to={`/edit-user/${user.id}`}>
                  <Button
                    type="default"
                    shape="round"
                    size="large"
                    icon={<Edit2 />}
                    block
                  >
                    Edit
                  </Button>
                </Link>,
              ]}
            >
              <Meta
                title={
                  <p className="text-center font-semibold text-lg text-gray-800 mb-1">
                    {user.name}
                  </p>
                }
                description={
                  <div className="text-center text-gray-600 text-sm">
                    <p>{user.email}</p>
                    <p>Age: {user.age}</p>
                    <p className="font-medium text-gray-700 mt-1">
                      👥 {user.follower_count} Followers • Following {user.following_count}
                    </p>
                  </div>
                }
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
