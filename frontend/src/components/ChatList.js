import React, { useEffect, useState } from "react";
import axiosInstance from "../authComponent/axiosConnection";
import { useNavigate } from "react-router-dom";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const currentUserId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      const res = await axiosInstance.get(
        `/api/messages/chatList/${currentUserId}`
      );
      setChats(res.data);
    };
    fetchChats();
  }, [currentUserId]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Chats</h2>
      <ul>
        {chats.map((user) => (
          <li
            key={user.user_id}
            className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50"
            onClick={() => navigate(`/chat/${user.user_id}`)}
          >
            <div className="flex items-center gap-3">
              <img
                src={
                  user.profile_image ||
                  `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random`
                }
                alt={user.first_name}
                className="w-10 h-10 rounded-full"
              />
              <span className="font-medium">
                {user.first_name} {user.last_name}
              </span>
            </div>
            {user.unread_count > 0 && (
              <span className="bg-red-500 text-white rounded-full px-3 py-1 text-xs">
                {user.unread_count}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
