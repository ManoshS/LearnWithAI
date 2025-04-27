import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RoadmapPath = () => {
  const [position, setPosition] = useState({ x: 50, y: 100 });
  
  const locations = {
    start: { x: 50, y: 100 },
    html: { x: 150, y: 200 },
    css: { x: 400, y: 200 },
    javascript: { x: 150, y: 300 },
    nodejs: { x: 150, y: 400 },
    react: { x: 150, y: 500 }
  };

  const handleClick = (pos) => {
    setPosition(locations[pos]);
  };

  return (
    <div className="w-full h-screen bg-blue-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Web Development Journey
        </h1>
        
        <div className="relative">
          {/* SVG for the path */}
          <svg className="w-full h-[600px]" viewBox="0 0 500 600">
            {/* Background decorations */}
            <path d="M20,50 Q40,0 60,50" className="stroke-blue-200 fill-none" />
            <path d="M400,100 Q420,50 440,100" className="stroke-blue-200 fill-none" />
            
            {/* Main path */}
            <path
              d="M50,100 L150,200 L400,200 M150,200 L150,300 L150,400 L150,500"
              className="stroke-blue-400 stroke-2 fill-none"
            />
            
            {/* Animated character */}
            <motion.g
              animate={position}
              transition={{ duration: 0.5 }}
            >
              <circle r="5" fill="#4B5563" />
              <line x1="0" y1="5" x2="0" y2="15" stroke="#4B5563" strokeWidth="2" />
              <line x1="-5" y1="10" x2="5" y2="10" stroke="#4B5563" strokeWidth="2" />
            </motion.g>

            {/* Technology nodes */}
            <g onClick={() => handleClick('start')} className="cursor-pointer">
              <rect x="20" y="70" width="60" height="30" rx="15" className="fill-blue-500" />
              <text x="30" y="90" className="fill-white text-sm">Start</text>
            </g>

            <g onClick={() => handleClick('html')} className="cursor-pointer">
              <rect x="120" y="180" width="60" height="30" rx="5" className="fill-orange-500" />
              <text x="130" y="200" className="fill-white text-sm">HTML</text>
            </g>

            <g onClick={() => handleClick('css')} className="cursor-pointer">
              <rect x="370" y="180" width="60" height="30" rx="5" className="fill-blue-500" />
              <text x="385" y="200" className="fill-white text-sm">CSS</text>
            </g>

            <g onClick={() => handleClick('javascript')} className="cursor-pointer">
              <rect x="120" y="280" width="80" height="30" rx="5" className="fill-yellow-500" />
              <text x="125" y="300" className="fill-white text-sm">JavaScript</text>
            </g>

            <g onClick={() => handleClick('nodejs')} className="cursor-pointer">
              <rect x="120" y="380" width="70" height="30" rx="5" className="fill-green-500" />
              <text x="130" y="400" className="fill-white text-sm">Node.js</text>
            </g>

            <g onClick={() => handleClick('react')} className="cursor-pointer">
              <rect x="120" y="480" width="60" height="30" rx="5" className="fill-blue-400" />
              <text x="130" y="500" className="fill-white text-sm">React</text>
            </g>

            {/* Decorative elements */}
            <g className="text-blue-200">
              {Array.from({ length: 10 }).map((_, i) => (
                <path
                  key={i}
                  d={`M${400 + i * 20},50 l5,-5`}
                  className="stroke-current"
                />
              ))}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPath;