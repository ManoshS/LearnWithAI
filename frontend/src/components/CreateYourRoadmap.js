import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Map, ArrowRight, Loader2 } from "lucide-react";
import { getChatResponse } from "../services/chatService";
import { useNavigate } from "react-router-dom";

const CreateRoadmap = () => {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Sample available roadmaps data
  const availableRoadmaps = [
    { id: 1, title: "Web Development", completed: 80 },
    { id: 2, title: "Machine Learning", completed: 75 },
    { id: 3, title: "Mobile Development", completed: 75 },
    { id: 4, title: "DevOps", completed: 100 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await getChatResponse(topic);
      // Store the roadmap data in localStorage for the Roadmap component to use
      localStorage.setItem(
        "currentRoadmap",
        JSON.stringify({
          topic,
          data: response,
        })
      );

      // Navigate to the roadmap page
      navigate("/roadmap");
    } catch (error) {
      console.error("Error generating roadmap:", error);
      // Handle error (you might want to show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20px 20px, #8b4513 2px, transparent 0),
          radial-gradient(circle at 60px 60px, #8b4513 2px, transparent 0),
          radial-gradient(circle at 100px 40px, #8b4513 2px, transparent 0)
        `,
        backgroundSize: "100px 100px",
      }}
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Create Your Learning Roadmap
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Enter any topic and we'll generate a personalized learning path for
          you
        </p>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-2xl mx-auto mb-12"
      >
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
              placeholder="Enter a topic (e.g., 'Web Development')"
            />
          </div>
          <button
            type="submit"
            disabled={!topic || isLoading}
            className="mt-4 w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Generate Roadmap
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Available Roadmaps Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Popular Roadmaps
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {availableRoadmaps.map((roadmap) => (
            <motion.div
              key={roadmap.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setTopic(roadmap.title);
                handleSubmit(new Event("submit"));
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-justify font-medium text-gray-900">
                    {roadmap.title}
                  </h3>
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${roadmap.completed}%` }}
                  />
                  {/* <p className="text-sm text-gray-500 mt-1">
                    {roadmap.users.toLocaleString()} users following
                  </p> */}
                </div>
                <Map className="text-blue-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CreateRoadmap;
