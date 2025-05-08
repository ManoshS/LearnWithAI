import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Database, Server, Terminal, Globe, Cpu } from "lucide-react";

const RoadmapPath = () => {
  const [position, setPosition] = useState({ x: 50, y: 100 });
  const [selectedTech, setSelectedTech] = useState(null);

  const locations = {
    start: { x: 50, y: 100 },
    html: { x: 150, y: 200 },
    css: { x: 400, y: 200 },
    javascript: { x: 150, y: 300 },
    nodejs: { x: 150, y: 400 },
    react: { x: 150, y: 500 },
  };

  const techDetails = {
    html: {
      icon: <Code className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600",
    },
    css: {
      icon: <Globe className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
    },
    javascript: {
      icon: <Terminal className="w-6 h-6" />,
      color: "from-yellow-500 to-yellow-600",
    },
    nodejs: {
      icon: <Server className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
    },
    react: {
      icon: <Cpu className="w-6 h-6" />,
      color: "from-blue-400 to-blue-500",
    },
  };

  const handleClick = (tech) => {
    setPosition(locations[tech]);
    setSelectedTech(tech);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          Web Development Journey
        </motion.h1>

        <div className="relative">
          <svg className="w-full h-[600px]" viewBox="0 0 500 600">
            {/* Animated background grid */}
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Glowing path */}
            <path
              d="M50,100 L150,200 L400,200 M150,200 L150,300 L150,400 L150,500"
              className="stroke-blue-400 stroke-2 fill-none"
              filter="url(#glow)"
            />

            {/* Glow filter */}
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Animated character */}
            <motion.g
              animate={position}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            >
              <circle r="8" fill="#60A5FA" filter="url(#glow)" />
              <motion.path
                d="M0,8 L0,20 M-8,12 L8,12"
                stroke="#60A5FA"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.g>

            {/* Technology nodes */}
            {Object.entries(techDetails).map(([tech, { icon, color }]) => (
              <g
                key={tech}
                onClick={() => handleClick(tech)}
                className="cursor-pointer transform hover:scale-110 transition-transform"
              >
                <motion.rect
                  x={locations[tech].x - 30}
                  y={locations[tech].y - 15}
                  width="60"
                  height="30"
                  rx="15"
                  className={`fill-gradient-to-r ${color}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
                <text
                  x={locations[tech].x}
                  y={locations[tech].y + 5}
                  className="fill-white text-sm font-medium"
                  textAnchor="middle"
                >
                  {tech.toUpperCase()}
                </text>
              </g>
            ))}
          </svg>

          {/* Tech Details Panel */}
          <AnimatePresence>
            {selectedTech && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-0 right-0 w-64 bg-gray-800/90 backdrop-blur-lg rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-center space-x-3 mb-3">
                  {techDetails[selectedTech].icon}
                  <h3 className="text-lg font-semibold text-white">
                    {selectedTech.toUpperCase()}
                  </h3>
                </div>
                <p className="text-gray-300 text-sm">
                  {getTechDescription(selectedTech)}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const getTechDescription = (tech) => {
  const descriptions = {
    html: "The foundation of web development. Learn to structure content and create semantic markup.",
    css: "Style your web pages with modern CSS techniques and responsive design principles.",
    javascript:
      "Add interactivity and dynamic behavior to your web applications.",
    nodejs: "Build scalable server-side applications with JavaScript.",
    react:
      "Create modern, interactive user interfaces with React's component-based architecture.",
  };
  return descriptions[tech] || "";
};

export default RoadmapPath;
