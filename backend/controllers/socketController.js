class SocketController {
    constructor() {
      this.users = new Map();
      this.chatRooms = new Map();
    }
  
    handleConnection(socket, io) {
      console.log('New client connected');
  
      socket.on('register', (username) => this.handleRegistration(socket, io, username));
      socket.on('joinRoom', (roomId) => this.handleJoinRoom(socket, roomId));
      socket.on('groupMessage', (data) => this.handleGroupMessage(socket, io, data));
      socket.on('privateMessage', (data) => this.handlePrivateMessage(socket, io, data));
      socket.on('disconnect', () => this.handleDisconnection(socket, io));
    }
  
    handleRegistration(socket, io, username) {
      this.users.set(username, socket.id);
      socket.username = username;
      io.emit('userList', Array.from(this.users.keys()));
    }
  
    handleJoinRoom(socket, roomId) {
      socket.join(roomId);
      if (!this.chatRooms.has(roomId)) {
        this.chatRooms.set(roomId, { messages: [] });
      }
      socket.emit('previousMessages', this.chatRooms.get(roomId).messages);
    }
  
    handleGroupMessage(socket, io, data) {
      const messageData = {
        sender: socket.username,
        content: data.content,
        timestamp: new Date(),
        roomId: data.roomId
      };
      
      this.chatRooms.get(data.roomId).messages.push(messageData);
      io.to(data.roomId).emit('newGroupMessage', messageData);
    }
  
    handlePrivateMessage(socket, io, data) {
      const recipientSocketId = this.users.get(data.recipient);
      if (recipientSocketId) {
        const messageData = {
          sender: socket.username,
          content: data.content,
          timestamp: new Date(),
          isPrivate: true
        };
        
        io.to(recipientSocketId).emit('newPrivateMessage', messageData);
        socket.emit('newPrivateMessage', messageData);
      }
    }
  
    handleDisconnection(socket, io) {
      if (socket.username) {
        this.users.delete(socket.username);
        io.emit('userList', Array.from(this.users.keys()));
      }
      console.log('Client disconnected');
    }
  }
  
  module.exports = new SocketController();