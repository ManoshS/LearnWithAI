const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

// Get all messages between two users
const getMessages = async (req, res) => {
  const { userId, otherUserId } = req.params;
  try {
    const query = `
      SELECT m.*, 
        sender.first_name as sender_first_name, 
        sender.last_name as sender_last_name,
        receiver.first_name as receiver_first_name,
        receiver.last_name as receiver_last_name
      FROM messages m
      JOIN users sender ON m.sender_id = sender.user_id
      JOIN users receiver ON m.receiver_id = receiver.user_id
      WHERE (m.sender_id = ? AND m.receiver_id = ?)
         OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC
    `;

    const [messages] = await db.query(query, [
      userId,
      otherUserId,
      otherUserId,
      userId,
    ]);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Send a new message
const sendMessage = async (req, res) => {
  const { senderId, receiverId, messageText } = req.body;

  if (!senderId || !receiverId || !messageText) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Get sender's name for notification
    const [sender] = await db.query(
      "SELECT first_name, last_name FROM users WHERE user_id = ?",
      [senderId]
    );

    if (!sender || sender.length === 0) {
      return res.status(404).json({ error: "Sender not found" });
    }

    // Insert message
    const messageQuery = `
      INSERT INTO messages (sender_id, receiver_id, message_text)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.query(messageQuery, [
      senderId,
      receiverId,
      messageText,
    ]);

    // Create notification with sender's name
    const notificationQuery = `
      INSERT INTO notifications (user_id, sender_id, notification_type, message)
      VALUES (?, ?, 'message', ?)
    `;
    const notificationMessage = `New message from ${sender[0].first_name} ${sender[0].last_name}`;
    await db.query(notificationQuery, [
      receiverId,
      senderId,
      notificationMessage,
    ]);

    // Get the created message with user details
    const getMessageQuery = `
      SELECT m.*, 
        sender.first_name as sender_first_name, 
        sender.last_name as sender_last_name,
        receiver.first_name as receiver_first_name,
        receiver.last_name as receiver_last_name
      FROM messages m
      JOIN users sender ON m.sender_id = sender.user_id
      JOIN users receiver ON m.receiver_id = receiver.user_id
      WHERE m.message_id = ?
    `;
    const [message] = await db.query(getMessageQuery, [result.insertId]);

    // Emit socket event for real-time updates
    const io = req.app.get("io");
    if (io) {
      const messageData = message[0];
      console.log("Emitting message:", messageData);

      // Create conversation room name
      const conversationRoom = `conversation:${Math.min(
        senderId,
        receiverId
      )}:${Math.max(senderId, receiverId)}`;

      // Emit to conversation room
      io.to(conversationRoom).emit("new_message", messageData);

      // Also emit to individual user rooms
      io.to(`user:${receiverId}`).emit("new_message", messageData);
      io.to(`user:${senderId}`).emit("new_message", messageData);
    }

    res.json(message[0]);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Mark messages as read
const markMessagesAsRead = async (req, res) => {
  const { userId, otherUserId } = req.params;
  try {
    const query = `
      UPDATE messages 
      SET is_read = TRUE 
      WHERE sender_id = ? AND receiver_id = ? AND is_read = FALSE
    `;
    await db.query(query, [otherUserId, userId]);
    res.json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
};

// Get unread notifications
const getUnreadNotifications = async (req, res) => {
  const { userId } = req.params;
  try {
    const query = `
      SELECT n.*, 
        sender.first_name as sender_first_name, 
        sender.last_name as sender_last_name
      FROM notifications n
      JOIN users sender ON n.sender_id = sender.user_id
      WHERE n.user_id = ? AND n.is_read = FALSE
      ORDER BY n.created_at DESC
    `;
    const [notifications] = await db.query(query, [userId]);
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const query = `
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE notification_id = ?
    `;
    await db.query(query, [notificationId]);
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

// Get chat list for a user (users they've chatted with and unread count)
const getChatList = async (req, res) => {
  console.log("getChatList function called");
  let { userId } = req.params;
  userId = parseInt(userId); // Ensure it's a number
  console.log("userId:", userId);
  try {
    // Debug: Show all sender/receiver pairs
    const [debugRows] = await db.query(
      "SELECT DISTINCT sender_id, receiver_id FROM messages"
    );
    console.log("Distinct sender/receiver IDs in messages:", debugRows);

    const [rows] = await db.query(
      `
      SELECT 
        u.user_id, u.first_name, u.last_name,
        (
          SELECT COUNT(*) 
          FROM messages m2 
          WHERE m2.sender_id = u.user_id AND m2.receiver_id = ? AND m2.is_read = 0
        ) AS unread_count
      FROM users u
      WHERE u.user_id IN (
        SELECT DISTINCT m.receiver_id FROM messages m WHERE m.sender_id = ?
        UNION
        SELECT DISTINCT m.sender_id FROM messages m WHERE m.receiver_id = ?
      ) AND u.user_id != ?
      `,
      [userId, userId, userId, userId]
    );
    console.log("Rows:", rows);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching chat list:", error);
    res.status(500).json({ error: "Failed to fetch chat list" });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadNotifications,
  markNotificationAsRead,
  getChatList,
};
