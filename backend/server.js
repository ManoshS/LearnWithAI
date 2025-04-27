const app = require("./app");
const http = require("http");
const socketIO = require("socket.io");
require("dotenv").config();

const socketConfig = require("./config/socketConfig");
const socketController = require("./controllers/socketController");

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");
  socketController.handleConnection(socket, io);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
