const onlineUsers = new Set();

const handleConnection = (socket, io) => {
  console.log("Client connected:", socket.id);

  // Handle user joining their room
  socket.on("join", (userId) => {
    socket.join(`user:${userId}`);
    socket.userId = userId;
    onlineUsers.add(userId);
    console.log(`User ${userId} joined their room: user:${userId}`);
    // Notify all clients that this user is online
    io.emit("user_online", { userId });
  });

  // Handle new message
  socket.on("new_message", (data) => {
    const { receiverId, message } = data;
    console.log("New message received:", { receiverId, message });

    // Create a unique room for this conversation
    const conversationRoom = `conversation:${Math.min(
      message.sender_id,
      receiverId
    )}:${Math.max(message.sender_id, receiverId)}`;

    // Join both users to the conversation room
    socket.join(conversationRoom);

    // Emit to the conversation room
    io.to(conversationRoom).emit("new_message", message);

    // Also emit to individual user rooms for backup
    io.to(`user:${receiverId}`).emit("new_message", message);
    io.to(`user:${message.sender_id}`).emit("new_message", message);
  });

  // Handle typing status
  socket.on("typing", (data) => {
    const { receiverId, isTyping } = data;
    io.to(`user:${receiverId}`).emit("user_typing", {
      userId: socket.id,
      isTyping,
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit("user_offline", { userId: socket.userId });
    }
    console.log("Client disconnected:", socket.id);
  });

  // Handle check online status
  socket.on("check_online_status", (targetUserId, callback) => {
    const online = isUserOnline(targetUserId);
    if (typeof callback === "function") {
      callback({ userId: targetUserId, online });
    } else {
      // fallback: emit to the socket
      socket.emit("online_status_response", { userId: targetUserId, online });
    }
  });
};

const isUserOnline = (userId) => onlineUsers.has(String(userId));

module.exports = {
  handleConnection,
  isUserOnline,
};
