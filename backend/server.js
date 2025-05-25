const app = require("./app");
const http = require("http");
const socketIO = require("socket.io");
require("dotenv").config();

const socketConfig = require("./config/socketConfig");
const socketController = require("./controllers/socketController");
const messageRoutes = require("./routes/messageRoutes");

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONT_END_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io accessible to routes
app.set("io", io);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected");
  socketController.handleConnection(socket, io);
});

// Message routes
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
