import React, { useState, useEffect } from "react";
import {
  Compass,
  Flag,
  Map,
  Footprints,
  Trophy,
  Book,
  Video,
  CheckCircle2,
  Lock,
  ChevronRight,
  Plus,
  X,
  Code,
  Database,
  Server,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const CreateRoadmap = () => {
  const [steps, setSteps] = useState([]);
  const [animate, setAnimate] = useState(false);
  const [topic, setTopic] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
    const storedRoadmap = localStorage.getItem("currentRoadmap");

    if (!storedRoadmap) {
      navigate("/");
      return;
    }

    try {
      const { topic, data } = JSON.parse(storedRoadmap);
      setTopic(topic);

      const regex = /\d+\.\s?([^\n]+)/g;
      const matches = data.reply.match(regex) || [];

      const roadmapSteps = matches.map((match, index) => ({
        id: index + 1,
        title: match.replace(/^\d+\.\s?/, "").trim(),
        category: "Learning Step",
        skill: topic,
        description: match,
        estimatedTime: "Flexible",
        completed: false,
        resources: data.stepsWithResources?.[index]?.resources || [],
      }));

      setSteps(roadmapSteps);
    } catch (error) {
      console.error("Error parsing roadmap:", error);
      navigate("/");
    }
  }, [navigate]);

  const formatTitle = (title) => {
    return title.split(/(\*\*.*?\*\*)/).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const boldText = part.slice(2, -2);
        return (
          <span key={index} style={{ fontWeight: "bold", fontSize: "1.2em" }}>
            {boldText}
          </span>
        );
      }
      return part;
    });
  };

  const [hoveredText, setHoveredText] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);
  const [dynamicResources, setDynamicResources] = useState({});

  const handleStepClick = (stepId, title) => {
    if (expandedStep === stepId) {
      setExpandedStep(null);
    } else {
      setExpandedStep(stepId);
      if (!dynamicResources[stepId]) {
        setDynamicResources((prev) => ({
          ...prev,
          [stepId]: generateDynamicResources(title),
        }));
      }
    }
  };

  const getStepIcon = (index) => {
    if (index === 0) return <Flag className="w-8 h-8" />;
    if (index === steps.length - 1) return <Trophy className="w-8 h-8" />;
    return <Footprints className="w-8 h-8" />;
  };

  const generateDynamicResources = (title) => {
    const extractBoldText = (text) => {
      const matches = text.match(/\*\*(.*?)\*\*/);
      return matches ? matches[1] : text;
    };

    const searchTerm = extractBoldText(title);
    const searchQuery = encodeURIComponent(searchTerm);

    const resources = [
      {
        title: `${searchTerm} - Google Search`,
        link: `https://www.google.com/search?q=${
          topic + " " + searchQuery
        }+tutorial+guide`,
        description: `Find comprehensive tutorials and guides about ${searchTerm}`,
        type: "Search",
      },
      {
        title: `${searchTerm} Videos - Google`,
        link: `https://www.google.com/search?q=${
          topic + " " + searchQuery
        }+tutorial&tbm=vid`,
        description: `Watch video tutorials about ${searchTerm}`,
        type: "Video",
      },
      {
        title: `${searchTerm} Documentation - MDN`,
        link: `https://developer.mozilla.org/en-US/search?q=${
          topic + " " + searchQuery
        }`,
        description: `Search MDN Web Docs for ${searchTerm} documentation and guides`,
        type: "Documentation",
      },
      {
        title: `${searchTerm} Tutorial - Codecademy`,
        link: `https://www.codecademy.com/search?query=${
          topic + " " + searchQuery
        }`,
        description: `Learn ${searchTerm} with interactive coding lessons and projects`,
        type: "Tutorial",
      },
      {
        title: `${searchTerm} Q&A - Stack Overflow`,
        link: `https://stackoverflow.com/search?q=${topic + " " + searchQuery}`,
        description: `Find solutions and discussions about ${searchTerm}`,
        type: "Community",
      },
      {
        title: `${searchTerm} Projects - GitHub`,
        link: `https://github.com/search?q=${
          topic + " " + searchQuery
        }&type=repositories`,
        description: `Explore open-source ${searchTerm} projects and examples`,
        type: "Code",
      },
      {
        title: `${searchTerm} Articles - Dev.to`,
        link: `https://dev.to/search?q=${topic + " " + searchQuery}`,
        description: `Read community articles and tutorials about ${searchTerm}`,
        type: "Article",
      },
    ];

    return resources;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ marginTop: "68px" }}
      >
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

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 pt-8"
      >
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center justify-center">
          <Compass className="w-10 h-10 mr-3 animate-[spin_4s_linear_infinite]" />
          {topic} Learning Roadmap
        </h1>
        <p className="text-xl text-gray-300">
          Your personalized learning journey
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto relative px-4">
        {/* Steps Container */}
        <div className="space-y-8 relative">
          {/* Decorative Path */}
          {steps.length > 0 && (
            <div className="absolute left-[2.25rem] top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 opacity-20" />
          )}

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center space-x-4"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg"
              >
                {getStepIcon(index)}
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex-1 bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-700 hover:border-blue-500/50 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-sm text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full inline-block">
                        Step {index + 1}
                      </span>
                      <div
                        className="relative group flex items-center space-x-2 text-xl font-semibold text-white cursor-pointer"
                        onClick={() => handleStepClick(step.id, step.title)}
                      >
                        <span className="text-xl hover:text-blue-400">
                          {formatTitle(step.title)}
                        </span>
                        <ChevronRight
                          className={`w-5 h-5 transition-transform ${
                            expandedStep === step.id ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Resources Section */}
                  <AnimatePresence>
                    {expandedStep === step.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-3"
                      >
                        <h4 className="text-sm font-semibold text-gray-400 flex items-center">
                          <Search className="w-4 h-4 mr-2" />
                          Learning Resources for {formatTitle(step.title)}:
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                          {dynamicResources[step.id]?.map((resource, idx) => (
                            <motion.a
                              key={idx}
                              href={resource.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.02 }}
                              className="flex flex-col p-3 rounded-lg bg-gray-700/50 border border-gray-600 hover:border-blue-500/50 hover:shadow-md transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <h5 className="text-sm font-medium text-blue-400">
                                  {resource.title}
                                </h5>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    resource.type === "Documentation"
                                      ? "bg-purple-500/20 text-purple-400"
                                      : resource.type === "Tutorial"
                                      ? "bg-green-500/20 text-green-400"
                                      : resource.type === "Code"
                                      ? "bg-orange-500/20 text-orange-400"
                                      : resource.type === "Community"
                                      ? "bg-blue-500/20 text-blue-400"
                                      : resource.type === "Search"
                                      ? "bg-red-500/20 text-red-400"
                                      : resource.type === "Video"
                                      ? "bg-pink-500/20 text-pink-400"
                                      : "bg-gray-500/20 text-gray-400"
                                  }`}
                                >
                                  {resource.type}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">
                                {resource.description}
                              </p>
                            </motion.a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          ))}

          {/* Final Achievement */}
          {steps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: steps.length * 0.1 }}
              className="flex justify-center mt-12"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl"
              >
                <Trophy className="w-12 h-12 text-yellow-400" />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateRoadmap;
