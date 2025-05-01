import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./authComponent/Login";
import Register from "./authComponent/Register";
import UserProfile from "./components/UserProfile";
import { UserProvider } from "./context/UserContext";
import Header from "./components/Header";
import CreateRoadmap from "./components/Roadmap";
import CreateYourRoadmap from "./components/CreateYourRoadmap";
import Footer from "./components/Footer";
import { MentorsGrid, LearnersGrid } from "./components/UsersList";
import RoadmapPath from "./components/RoadmapAnimation";
// import ChatApp from "./chatComponent/ChatApp";
import ProtectedRoute from "./authComponent/ProtectedRoute";
import SkillsManagement from "./components/SkillsManagement";
import AddSkills from "./authComponent/AddSkills";
import Chat from "./components/Chat";
import ChatList from "./components/ChatList";

function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-skills" element={<AddSkills />} />

          {/* Protected routes */}
          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <SkillsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <CreateRoadmap />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/Chatting"
            element={
              <ProtectedRoute>
                <ChatApp />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/roadmapAnimation"
            element={
              <ProtectedRoute>
                <RoadmapPath />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentors"
            element={
              <ProtectedRoute>
                <MentorsGrid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learners"
            element={
              <ProtectedRoute>
                <LearnersGrid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <CreateYourRoadmap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:userId"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:userId"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat-list"
            element={
              <ProtectedRoute>
                <ChatList />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
// import React, { useState } from 'react';

// function App() {
//   const [hoveredText, setHoveredText] = useState(null);

//   const handleMouseEnter = (text) => {
//     setHoveredText(text);
//   };

//   const handleMouseLeave = () => {
//     setHoveredText(null);
//   };

//   const handleSearchClick = () => {
//     if (hoveredText) {
//       const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(hoveredText)}`;
//       window.open(googleSearchUrl, '_blank');
//     }
//   };

//   const textItems = [
//     'React.js',
//     'Tailwind CSS',
//     'JavaScript',
//     'HTML5',
//     'CSS3'
//   ];

//   return (
//     <div className="flex flex-col items-center p-10 space-y-5">
//       <h1 className="text-2xl font-bold mb-5">Hover over text to search</h1>
//       {textItems.map((text, index) => (
//         <div
//           key={index}
//           className="relative group flex items-center space-x-2"
//           onMouseEnter={() => handleMouseEnter(text)}
//           onMouseLeave={handleMouseLeave}
//         >
//           <span className="text-xl hover:text-blue-500 cursor-pointer">{text}</span>
//           {hoveredText === text && (
//             <button
//               className="p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 transition-all duration-200"
//               onClick={handleSearchClick}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5 text-gray-600"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M8 4a4 4 0 100 8 4 4 0 000-8zm0 7a3 3 0 100-6 3 3 0 000 6zm6.32 2.9a7.6 7.6 0 11-1.42-1.4l4.39 4.39a1 1 0 11-1.42 1.42l-4.39-4.39a7.57 7.57 0 011.42 1.4z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default App;
