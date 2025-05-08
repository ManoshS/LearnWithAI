import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Search, Loader2 } from "lucide-react";
import axiosInstance from "../authComponent/axiosConnection";
import { useNavigate } from "react-router-dom";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const currentUserId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(
          `/api/messages/chatList/${currentUserId}`
        );
        setChats(res.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChats();
  }, [currentUserId]);

  const filteredChats = chats.filter(
    (chat) =>
      chat.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated background pattern */}
      <div className="inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20px 20px, #60A5FA 2px, transparent 0),
              radial-gradient(circle at 60px 60px, #60A5FA 2px, transparent 0),
              radial-gradient(circle at 100px 40px, #60A5FA 2px, transparent 0)
            `,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Your Conversations
          </h1>
          <p className="text-gray-400">
            Connect and chat with your mentors and learners
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Members..."
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800/50 backdrop-blur-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-400"
              />
            </div>
          </div>
        </motion.div>

        {/* Chat List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <AnimatePresence>
              {filteredChats.map((chat, index) => (
                <motion.div
                  key={chat.user_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200" />
                  <div
                    className="relative bg-gray-800/50 backdrop-blur-lg rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors p-4 cursor-pointer"
                    onClick={() => navigate(`/chat/${chat.user_id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                          <img
                            src={
                              chat.profile_image ||
                              `https://ui-avatars.com/api/?name=${chat.first_name}+${chat.last_name}&background=random`
                            }
                            alt={`${chat.first_name} ${chat.last_name}`}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">
                            {chat.first_name} {chat.last_name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {chat.last_message || "No messages yet"}
                          </p>
                        </div>
                      </div>
                      {chat.unread_count > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {chat.unread_count}
                          </span>
                          <MessageCircle className="w-5 h-5 text-blue-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ChatList;
