import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, ArrowLeft } from "lucide-react";
import axiosInstance from "../authComponent/axiosConnection";
import io from "socket.io-client";

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const currentUserId = localStorage.getItem("userId");

  // Check connection status first
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/connect/getAllConnections/${currentUserId}`
        );
        console.log("Checking connection status:", response.data);

        const isUsersConnected = response.data.some(
          (conn) =>
            conn.status === "accepted" &&
            (conn.connection_senderid === parseInt(userId) ||
              conn.connection_recoverid === parseInt(userId))
        );

        if (!isUsersConnected) {
          console.log("Users are not connected, redirecting back");
          navigate(-1);
          return;
        }

        console.log("Users are connected, proceeding with chat");
        setIsConnected(true);
      } catch (error) {
        console.error("Error checking connection:", error);
        navigate(-1);
      }
    };

    checkConnection();
  }, [userId, currentUserId, navigate]);

  // Initialize chat only if users are connected
  useEffect(() => {
    if (!isConnected) return;

    // Initialize socket connection
    socketRef.current = io("http://localhost:4000", {
      withCredentials: true,
    });

    // Join user's room
    socketRef.current.emit("join", currentUserId);
    console.log("Joined user room:", currentUserId);

    // Join conversation room
    const conversationRoom = `conversation:${Math.min(
      currentUserId,
      userId
    )}:${Math.max(currentUserId, userId)}`;
    socketRef.current.emit("join", conversationRoom);
    console.log("Joined conversation room:", conversationRoom);

    // Listen for new messages
    socketRef.current.on("new_message", (message) => {
      console.log("Received new message:", message);
      setMessages((prev) => {
        // Check if message already exists
        const messageExists = prev.some(
          (m) => m.message_id === message.message_id
        );
        if (messageExists) return prev;
        return [...prev, message];
      });
      scrollToBottom();
    });

    // Listen for typing status
    socketRef.current.on(
      "user_typing",
      ({ userId: typingUserId, isTyping }) => {
        if (typingUserId === userId) {
          setIsTyping(isTyping);
        }
      }
    );

    // Fetch messages and user data
    const fetchData = async () => {
      try {
        const [messagesRes, userRes] = await Promise.all([
          axiosInstance.get(`/api/messages/${currentUserId}/${userId}`),
          axiosInstance.get(`/api/users/get/${userId}`),
        ]);

        setMessages(messagesRes.data);
        setOtherUser(userRes.data);
        setLoading(false);

        // Mark messages as read
        await axiosInstance.put(
          `/api/messages/read/${currentUserId}/${userId}`
        );
      } catch (error) {
        console.error("Error fetching chat data:", error);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [userId, currentUserId, isConnected]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTyping = () => {
    if (!socketRef.current) return;

    socketRef.current.emit("typing", {
      receiverId: userId,
      isTyping: true,
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.emit("typing", {
          receiverId: userId,
          isTyping: false,
        });
      }
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await axiosInstance.post("/api/messages/send", {
        senderId: currentUserId,
        receiverId: userId,
        messageText: newMessage.trim(),
      });

      console.log("Message sent successfully:", response.data);

      // Update messages state with the new message
      setMessages((prev) => {
        const messageExists = prev.some(
          (m) => m.message_id === response.data.message_id
        );
        if (messageExists) return prev;
        return [...prev, response.data];
      });

      setNewMessage("");
      scrollToBottom();

      // Emit socket event for real-time updates
      if (socketRef.current) {
        socketRef.current.emit("new_message", {
          receiverId: userId,
          message: response.data,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white shadow-sm p-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3">
          <img
            src={
              otherUser?.profile_image ||
              `https://ui-avatars.com/api/?name=${
                otherUser?.first_name + " " + otherUser?.last_name
              }&background=random`
            }
            alt={`${otherUser?.first_name} ${otherUser?.last_name}`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold text-lg">
              {otherUser?.first_name} {otherUser?.last_name}
            </h2>
            <p className="text-sm text-gray-500">
              {isTyping ? "typing..." : otherUser?.expertise || "User"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isMine = String(message.sender_id) === String(currentUserId);
          return (
            <motion.div
              key={message.message_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 shadow-md transition-colors duration-200
                  ${
                    isMine
                      ? "bg-blue-500 text-white ml-8"
                      : "bg-gray-200 text-gray-900 mr-8"
                  }
                `}
              >
                <p>{message.message_text}</p>
                <p className="text-xs mt-1 opacity-70 text-right">
                  {new Date(message.created_at).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="bg-white border-t p-4 flex items-center gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleTyping}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default Chat;
