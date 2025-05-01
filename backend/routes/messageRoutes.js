const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// Get chat list for a user
router.get("/chatList/:userId", messageController.getChatList);

// Get messages between two users
router.get("/:userId/:otherUserId", messageController.getMessages);

// Send a new message
router.post("/send", messageController.sendMessage);

// Mark messages as read
router.put("/read/:userId/:otherUserId", messageController.markMessagesAsRead);

// Get unread notifications
router.get("/notifications/:userId", messageController.getUnreadNotifications);

// Mark notification as read
router.put(
  "/notifications/:notificationId",
  messageController.markNotificationAsRead
);

module.exports = router;
