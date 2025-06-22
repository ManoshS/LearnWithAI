import React, { useState, useEffect, useRef } from "react";
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

// Comprehensive list of topics and skills for autocomplete
const TOPICS_AND_SKILLS = [
  // Programming Languages
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "TypeScript",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "PHP",
  "Ruby",
  "Scala",
  "R",
  "MATLAB",
  "Dart",
  "Elixir",
  "Clojure",
  "Haskell",
  "Perl",

  // Web Development
  "Web Development",
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Express.js",
  "Django",
  "Flask",
  "Laravel",
  "Spring Boot",
  "ASP.NET",
  "Ruby on Rails",
  "Next.js",
  "Nuxt.js",
  "Gatsby",
  "Svelte",
  "Ember.js",

  // Mobile Development
  "Mobile Development",
  "iOS Development",
  "Android Development",
  "React Native",
  "Flutter",
  "Xamarin",
  "Ionic",
  "NativeScript",
  "SwiftUI",
  "Jetpack Compose",
  "Kotlin Multiplatform",

  // Data Science & AI
  "Data Science",
  "Machine Learning",
  "Deep Learning",
  "Artificial Intelligence",
  "Natural Language Processing",
  "Computer Vision",
  "Data Analysis",
  "Data Engineering",
  "Big Data",
  "Statistics",
  "Predictive Analytics",
  "Neural Networks",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Seaborn",
  "Jupyter",

  // DevOps & Cloud
  "DevOps",
  "Cloud Computing",
  "AWS",
  "Azure",
  "Google Cloud Platform",
  "Docker",
  "Kubernetes",
  "Jenkins",
  "GitLab CI/CD",
  "GitHub Actions",
  "Terraform",
  "Ansible",
  "Linux Administration",
  "System Administration",
  "Network Administration",
  "Cybersecurity",
  "Information Security",
  "Penetration Testing",
  "Ethical Hacking",

  // Database & Data Management
  "Database Design",
  "SQL",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Cassandra",
  "Elasticsearch",
  "Data Warehousing",
  "ETL",
  "Data Modeling",
  "Database Administration",

  // Software Engineering
  "Software Engineering",
  "Software Architecture",
  "Design Patterns",
  "Clean Code",
  "Test Driven Development",
  "Agile Development",
  "Scrum",
  "Kanban",
  "Code Review",
  "Version Control",
  "Git",
  "Microservices",
  "API Development",
  "REST APIs",
  "GraphQL",
  "Web Services",

  // UI/UX Design
  "UI/UX Design",
  "User Interface Design",
  "User Experience Design",
  "Graphic Design",
  "Visual Design",
  "Interaction Design",
  "Prototyping",
  "Figma",
  "Adobe XD",
  "Sketch",
  "Adobe Photoshop",
  "Adobe Illustrator",
  "InDesign",
  "Typography",
  "Color Theory",
  "Design Systems",

  // Game Development
  "Game Development",
  "Unity",
  "Unreal Engine",
  "Godot",
  "Game Design",
  "3D Modeling",
  "Blender",
  "Maya",
  "3ds Max",
  "Game Programming",
  "Game Art",
  "Level Design",
  "Game Audio",
  "VR Development",
  "AR Development",

  // Blockchain & Web3
  "Blockchain",
  "Web3",
  "Cryptocurrency",
  "Smart Contracts",
  "Solidity",
  "Ethereum",
  "Bitcoin",
  "DeFi",
  "NFTs",
  "DApp Development",
  "MetaMask",
  "IPFS",
  "Polkadot",
  "Cardano",

  // Digital Marketing
  "Digital Marketing",
  "SEO",
  "SEM",
  "Social Media Marketing",
  "Content Marketing",
  "Email Marketing",
  "Google Analytics",
  "Google Ads",
  "Facebook Ads",
  "Influencer Marketing",
  "Affiliate Marketing",
  "Marketing Automation",

  // Business & Management
  "Project Management",
  "Product Management",
  "Business Analysis",
  "Data Analytics",
  "Business Intelligence",
  "Process Improvement",
  "Lean Six Sigma",
  "Agile Project Management",
  "Scrum Master",
  "Product Owner",
  "Business Strategy",
  "Entrepreneurship",

  // Creative & Media
  "Video Editing",
  "Motion Graphics",
  "Animation",
  "Adobe Premiere Pro",
  "After Effects",
  "Final Cut Pro",
  "DaVinci Resolve",
  "Cinema 4D",
  "Photography",
  "Videography",
  "Podcasting",
  "Content Creation",

  // Languages & Communication
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Portuguese",
  "Italian",
  "Russian",
  "Public Speaking",
  "Technical Writing",
  "Copywriting",
  "Translation",

  // Science & Engineering
  "Physics",
  "Chemistry",
  "Biology",
  "Mathematics",
  "Calculus",
  "Linear Algebra",
  "Statistics",
  "Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biomedical Engineering",

  // Finance & Economics
  "Finance",
  "Investment",
  "Trading",
  "Financial Analysis",
  "Accounting",
  "Economics",
  "Cryptocurrency Trading",
  "Stock Market",
  "Forex Trading",
  "Financial Modeling",
  "Risk Management",

  // Health & Fitness
  "Nutrition",
  "Fitness",
  "Yoga",
  "Meditation",
  "Mental Health",
  "Personal Training",
  "Sports Medicine",
  "Physical Therapy",
  "Wellness Coaching",
  "Mindfulness",

  // Music & Arts
  "Music Production",
  "Guitar",
  "Piano",
  "Singing",
  "Music Theory",
  "Digital Art",
  "Drawing",
  "Painting",
  "Sculpture",
  "Photography",
  "Film Making",
  "Acting",
  "Dance",

  // Cooking & Culinary
  "Cooking",
  "Baking",
  "Pastry Making",
  "Wine Tasting",
  "Mixology",
  "Food Photography",
  "Recipe Development",
  "Nutritional Cooking",
  "International Cuisine",

  // Travel & Culture
  "Travel Planning",
  "Cultural Studies",
  "History",
  "Geography",
  "Archaeology",
  "Anthropology",
  "Museum Studies",
  "Tourism",
  "Hospitality Management",

  // Technology Trends
  "Internet of Things",
  "IoT",
  "Edge Computing",
  "Quantum Computing",
  "5G Technology",
  "Augmented Reality",
  "Virtual Reality",
  "Mixed Reality",
  "Robotics",
  "Automation",
  "RPA",
  "Chatbots",
  "Voice Assistants",
  "Smart Home Technology",
];

const CreateRoadmap = () => {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  // Filter suggestions based on input
  useEffect(() => {
    if (topic.trim()) {
      const filtered = TOPICS_AND_SKILLS.filter((item) =>
        item.toLowerCase().includes(topic.toLowerCase())
      ).slice(0, 10); // Limit to 10 suggestions
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 1);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [topic]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          setTopic(suggestions[selectedIndex]);
          setShowSuggestions(false);
        } else if (topic.trim()) {
          handleSubmit(e);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setTopic(suggestion);
    inputRef.current?.focus();
    setShowSuggestions(false);
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
                  onKeyDown={handleKeyDown}
                  onFocus={handleInputFocus}
                  ref={inputRef}
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-gray-800/50 backdrop-blur-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg text-white placeholder-gray-400"
                  placeholder="Enter a topic (e.g., 'Web Development')"
                />

                {/* Autocomplete Dropdown */}
                <AnimatePresence>
                  {showSuggestions && (
                    <motion.div
                      ref={suggestionsRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-lg border border-gray-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
                    >
                      {suggestions.map((suggestion, index) => (
                        <motion.div
                          key={suggestion}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className={`px-4 py-3 cursor-pointer transition-colors duration-150 flex items-center gap-3 ${
                            index === selectedIndex
                              ? "bg-blue-500/20 text-blue-300 border-l-2 border-blue-500"
                              : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                          }`}
                          onClick={() => handleSuggestionClick(suggestion)}
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          <Search className="w-4 h-4 text-gray-500" />
                          <span className="flex-1">{suggestion}</span>
                          {index === selectedIndex && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-blue-500 rounded-full"
                            />
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
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
