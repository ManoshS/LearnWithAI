import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Smile,
  Image,
  File,
  X,
  Loader2,
  User,
  MoreVertical,
  Phone,
  Video,
  Info,
} from "lucide-react";
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
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

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
    socketRef.current = io(process.env.REACT_APP_BACKEND_URL, {
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
    if (newMessage.trim() || attachments.length > 0) {
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
        setAttachments([]);
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
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Chat Header */}
      <div className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                  <img
                    src={
                      otherUser?.profile_image ||
                      `https://ui-avatars.com/api/?name=${
                        otherUser?.first_name + " " + otherUser?.last_name
                      }&background=random`
                    }
                    alt={`${otherUser?.first_name} ${otherUser?.last_name}`}
                    className="w-6 h-6 text-gray-400"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-white font-semibold">
                  {otherUser?.first_name} {otherUser?.last_name}
                </h2>
                <p className="text-sm text-gray-400">
                  {isTyping ? "typing..." : otherUser?.expertise || "User"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5 text-gray-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <Video className="w-5 h-5 text-gray-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <Info className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                msg.sender_id === parseInt(currentUserId)
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-2xl p-4 ${
                  msg.sender_id === parseInt(currentUserId)
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "bg-gray-700/50 backdrop-blur-lg text-gray-200"
                }`}
              >
                <p>{msg.message_text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-gray-800/50 backdrop-blur-lg border-t border-gray-700 p-4">
        <form onSubmit={handleSendMessage} className="space-y-4">
          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {attachments.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <div className="w-20 h-20 rounded-lg bg-gray-700/50 flex items-center justify-center">
                    {file.type.startsWith("image/") ? (
                      <Image className="w-8 h-8 text-gray-400" />
                    ) : (
                      <File className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeAttachment(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <Paperclip className="w-5 h-5 text-gray-400" />
            </motion.button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
            />
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleTyping}
              placeholder="Type a message..."
              className="flex-1 bg-gray-700/50 backdrop-blur-lg text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <Smile className="w-5 h-5 text-gray-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!newMessage.trim() && attachments.length === 0}
              className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTyping ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
