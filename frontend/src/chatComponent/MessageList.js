import React from 'react';

const MessageList = ({ messages, username }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg ${
            msg.sender === username
              ? 'bg-blue-500 text-white ml-auto'
              : 'bg-gray-200'
          } max-w-[70%]`}
        >
          <div className="font-semibold">{msg.sender}</div>
          <div>{msg.content}</div>
          <div className="text-xs opacity-75">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;