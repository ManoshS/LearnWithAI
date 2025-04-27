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

      // Parse the reply to extract steps
      const regex = /\d+\.\s?([^\n]+)/g;
      const matches = data.reply.match(regex) || [];
      console.log(matches);

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

  const handleMouseEnter = (text) => {
    setHoveredText(text);
  };

  const handleMouseLeave = () => {
    setHoveredText(null);
  };

  const handleSearchClick = () => {
    if (hoveredText) {
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
        hoveredText
      )}`;
      window.open(googleSearchUrl, "_blank");
    }
  };

  const getStepIcon = (index) => {
    if (index === 0) return <Flag className="w-8 h-8" />;
    if (index === steps.length - 1) return <Trophy className="w-8 h-8" />;
    return <Footprints className="w-8 h-8" />;
  };

  const generateDynamicResources = (title) => {
    // Extract text within ** ** if it exists, otherwise use the whole title
    const extractBoldText = (text) => {
      const matches = text.match(/\*\*(.*?)\*\*/);
      return matches ? matches[1] : text;
    };

    const searchTerm = extractBoldText(title);
    const searchQuery = encodeURIComponent(searchTerm);

    // Add Google search as the first resource
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

    // Add technology-specific resources
    const lowerSearchTerm = searchTerm.toLowerCase();

    if (lowerSearchTerm.includes(".net")) {
      resources.push({
        title: `${searchTerm} - Microsoft Docs`,
        link: `https://learn.microsoft.com/en-us/search/?terms=${searchQuery}&scope=.NET`,
        description: "Official Microsoft .NET documentation and guides",
        type: "Documentation",
      });
    } else if (lowerSearchTerm.includes("react")) {
      resources.push({
        title: `${searchTerm} - React Docs`,
        link: `https://react.dev/search?q=${searchQuery}`,
        description: "Official React documentation and tutorials",
        type: "Documentation",
      });
    } else if (lowerSearchTerm.includes("python")) {
      resources.push({
        title: `${searchTerm} - Python Docs`,
        link: `https://docs.python.org/3/search.html?q=${searchQuery}`,
        description: "Official Python documentation and guides",
        type: "Documentation",
      });
    } else if (
      lowerSearchTerm.includes("javascript") ||
      lowerSearchTerm.includes("js")
    ) {
      resources.push({
        title: `${searchTerm} - JavaScript.info`,
        link: `https://javascript.info/search/?query=${searchQuery}`,
        description: "Modern JavaScript tutorials and references",
        type: "Tutorial",
      });
    }

    return resources;
  };

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

  return (
    <div className="min-h-screen bg-[#f3ebe1] p-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20px 20px, #8b4513 2px, transparent 0),
            radial-gradient(circle at 60px 60px, #8f4513 2px, transparent 0),
            radial-gradient(circle at 100px 40px, #8f4513 2px, transparent 0)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      {/* Header */}
      <div
        className={`text-center mb-12 transform transition-all duration-1000 ${
          animate ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
        }`}
      >
        <h1 className="text-4xl font-bold text-[#8b4513] mb-4 flex items-center justify-center">
          <Compass className="w-10 h-10 mr-3 animate-[spin_4s_linear_infinite]" />
          {topic} Learning Roadmap
        </h1>
        <p className="text-[#5c2d0b] text-xl">
          Your personalized learning journey
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto relative">
        {/* Steps Container */}
        <div className="space-y-8 relative">
          {/* Decorative Path */}
          {steps.length > 0 && (
            <div className="absolute left-[2.25rem] top-0 bottom-0 w-1 bg-[#8b4513] opacity-20 dashed-line" />
          )}

          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center space-x-4 transform transition-all duration-500 ${
                animate
                  ? "translate-x-0 opacity-100"
                  : "translate-x-[-100px] opacity-0"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="w-16 h-16 rounded-full bg-[#8b4513] flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-transform">
                {getStepIcon(index)}
              </div>

              <div className="flex-1 bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-sm text-[#5c2d0b] bg-[#f4e4bc] px-3 py-1 rounded-full inline-block">
                        Step {index + 1}
                      </span>
                      <div
                        className="relative group flex items-center space-x-2 text-xl font-semibold text-[#8b4513] cursor-pointer"
                        onClick={() => handleStepClick(step.id, step.title)}
                      >
                        <span className="text-xl hover:text-blue-500">
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
                  {expandedStep === step.id && (
                    <div className="mt-4 space-y-3">
                      <h4 className="text-sm font-semibold text-gray-600 flex items-center">
                        <Search className="w-4 h-4 mr-2" />
                        Learning Resources for {formatTitle(step.title)}:
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {dynamicResources[step.id]?.map((resource, idx) => (
                          <a
                            key={idx}
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-medium text-blue-600">
                                {resource.title}
                              </h5>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  resource.type === "Documentation"
                                    ? "bg-purple-100 text-purple-600"
                                    : resource.type === "Tutorial"
                                    ? "bg-green-100 text-green-600"
                                    : resource.type === "Code"
                                    ? "bg-orange-100 text-orange-600"
                                    : resource.type === "Community"
                                    ? "bg-blue-100 text-blue-600"
                                    : resource.type === "Search"
                                    ? "bg-red-100 text-red-600"
                                    : resource.type === "Video"
                                    ? "bg-pink-100 text-pink-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {resource.type}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {resource.description}
                            </p>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Final Achievement */}
          {steps.length > 0 && (
            <div
              className={`absolute -bottom-16 right-0 transform transition-all duration-1000 ${
                animate
                  ? "translate-x-0 opacity-100"
                  : "translate-x-[100px] opacity-0"
              }`}
            >
              <div className="w-24 h-24 bg-[#8b4513] rounded-full flex items-center justify-center animate-bounce shadow-xl">
                <Trophy className="w-12 h-12 text-yellow-400" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateRoadmap;
