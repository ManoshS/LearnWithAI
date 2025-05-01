const handleConnection = (socket, io) => {
  console.log("Client connected:", socket.id);

  // Handle user joining their room
  socket.on("join", (userId) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} joined their room: user:${userId}`);
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
    console.log("Client disconnected:", socket.id);
  });
};

module.exports = {
  handleConnection,
};
