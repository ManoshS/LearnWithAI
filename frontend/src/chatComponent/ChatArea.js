import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatArea = ({ selectedUser, currentRoom, messages, message, setMessage, handleSendMessage, username }) => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b bg-white">
        <h1 className="text-xl font-bold">
          {selectedUser ? `Chat with ${selectedUser}` : `${currentRoom} Room`}
        </h1>
      </div>

      <MessageList messages={messages} username={username} />
      <MessageInput 
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatArea;