import React, { useState, useEffect } from 'react';
import socket from './socket';
import Login from './Login';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

const ChatApp = () => {
  const [username, setUsername] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentRoom, setCurrentRoom] = useState('general');

  useEffect(() => {
    socket.on('userList', (userList) => {
      setUsers(userList);
    });

    socket.on('newGroupMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('newPrivateMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('previousMessages', (messages) => {
      setMessages(messages);
    });

    return () => {
      socket.off('userList');
      socket.off('newGroupMessage');
      socket.off('newPrivateMessage');
      socket.off('previousMessages');
    };
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('register', username);
      setIsRegistered(true);
      socket.emit('joinRoom', 'general');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      if (selectedUser) {
        socket.emit('privateMessage', {
          recipient: selectedUser,
          content: message
        });
      } else {
        socket.emit('groupMessage', {
          content: message,
          roomId: currentRoom
        });
      }
      setMessage('');
    }
  };

  const handleRoomChange = (roomId) => {
    setSelectedUser(null);
    setCurrentRoom(roomId);
    setMessages([]);
    socket.emit('joinRoom', roomId);
  };

  const handleUserSelect = (user) => {
    if (user !== username) {
      setSelectedUser(user);
      setCurrentRoom(null);
      setMessages([]);
    }
  };

  if (!isRegistered) {
    return (
      <Login 
        username={username}
        setUsername={setUsername}
        handleRegister={handleRegister}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        users={users}
        currentRoom={currentRoom}
        selectedUser={selectedUser}
        username={username}
        handleRoomChange={handleRoomChange}
        handleUserSelect={handleUserSelect}
      />
      <ChatArea
        selectedUser={selectedUser}
        currentRoom={currentRoom}
        messages={messages}
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
        username={username}
      />
    </div>
  );
};

export default ChatApp;