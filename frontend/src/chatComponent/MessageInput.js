import React from 'react';

import TextField from '@mui/material/TextField';
import  Button  from '@mui/material/Button';

const MessageInput = ({ message, setMessage, handleSendMessage }) => {
  return (
    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
      <div className="flex space-x-4">
        <TextField
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit">Send</Button>
      </div>
    </form>
  );
};

export default MessageInput;