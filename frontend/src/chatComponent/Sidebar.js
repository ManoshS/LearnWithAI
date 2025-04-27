import React from 'react';

const Sidebar = ({ users, currentRoom, selectedUser, username, handleRoomChange, handleUserSelect }) => {
  return (
    <div className="w-64 bg-white border-r">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Rooms</h2>
        <div className="space-y-2">
          <button
            onClick={() => handleRoomChange('general')}
            className={`w-full p-2 text-left rounded ${
              currentRoom === 'general' ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
          >
            General
          </button>
        </div>
        
        <h2 className="text-lg font-semibold mt-6 mb-4">Users</h2>
        <div className="space-y-2">
          {users.map((user) => (
            <button
              key={user}
              onClick={() => handleUserSelect(user)}
              className={`w-full p-2 text-left rounded ${
                selectedUser === user ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
            >
              {user} {user === username && '(you)'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;