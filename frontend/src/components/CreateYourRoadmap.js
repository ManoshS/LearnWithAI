import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Map,
  ArrowRight,
  Loader2,
  Sparkles,
  BookOpen,
  Target,
  Rocket,
} from "lucide-react";
import { getChatResponse } from "../services/chatService";
import { useNavigate } from "react-router-dom";

const CreateRoadmap = () => {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Sample available roadmaps data
  const availableRoadmaps = [
    {
      id: 1,
      title: "Web Development",
      completed: 80,
      icon: <Rocket className="w-6 h-6" />,
    },
    {
      id: 2,
      title: "Machine Learning",
      completed: 75,
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      id: 3,
      title: "Mobile Development",
      completed: 75,
      icon: <Target className="w-6 h-6" />,
    },
    {
      id: 4,
      title: "DevOps",
      completed: 100,
      icon: <BookOpen className="w-6 h-6" />,
    },
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated background pattern */}
      <div className=" inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 20px 20px, #60A5FA 2px, transparent 0),
            radial-gradient(circle at 60px 60px, #60A5FA 2px, transparent 0),
            radial-gradient(circle at 100px 40px, #60A5FA 2px, transparent 0)
          `,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Create Your Learning Roadmap
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Enter any topic and we'll generate a personalized learning path
            tailored to your goals
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200" />
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-gray-800/50 backdrop-blur-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg text-white placeholder-gray-400"
                  placeholder="Enter a topic (e.g., 'Web Development')"
                />
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={!topic || isLoading}
              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-200" />
              <span className="relative">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Generate Roadmap
                    <ArrowRight className="inline-block ml-2 w-5 h-5" />
                  </>
                )}
              </span>
            </motion.button>
          </form>
        </motion.div>

        {/* Available Roadmaps Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl font-semibold text-white mb-8 text-center">
            Popular Roadmaps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {availableRoadmaps.map((roadmap) => (
              <motion.div
                key={roadmap.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200" />
                <div
                  className="relative bg-gray-800/50 backdrop-blur-lg p-6 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setTopic(roadmap.title);
                    handleSubmit(new Event("submit"));
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {roadmap.icon}
                        <h3 className="text-xl font-medium text-white">
                          {roadmap.title}
                        </h3>
                      </div>
                      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${roadmap.completed}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500"
                        />
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        {roadmap.completed}% Complete
                      </p>
                    </div>
                    <Map className="text-blue-400 group-hover:text-blue-300 transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateRoadmap;
