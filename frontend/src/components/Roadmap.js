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
  Users,
  GraduationCap,
  UserCheck,
  Star,
  Eye,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getUsersBySkillName } from "../services/skillsService";

const CreateRoadmap = () => {
  const [steps, setSteps] = useState([]);
  const [animate, setAnimate] = useState(false);
  const [topic, setTopic] = useState("");
  const [mentors, setMentors] = useState([]);
  const [learners, setLearners] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [showUsersSection, setShowUsersSection] = useState(false);
  const navigate = useNavigate();

  // Function to fetch mentors and learners by skill
  const fetchUsersBySkill = async (skillName) => {
    setIsLoadingUsers(true);
    try {
      const response = await getUsersBySkillName(skillName);
      if (response.success) {
        setMentors(response.mentors || []);
        setLearners(response.learners || []);
        setShowUsersSection(true);
      }
    } catch (error) {
      console.error("Error fetching users by skill:", error);
      setMentors([]);
      setLearners([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

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

      // Fetch mentors and learners for this topic
      fetchUsersBySkill(topic);
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

      {/* Mentors and Learners Section */}
      <AnimatePresence>
        {showUsersSection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Connect with {topic} Community
              </h2>
              <p className="text-xl text-gray-300">
                Find mentors to guide you and learners to collaborate with
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Mentors Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Mentors
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {mentors.length} experienced {topic} professionals
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400">
                      {mentors.length}
                    </div>
                    <div className="text-xs text-gray-500">Available</div>
                  </div>
                </div>

                {isLoadingUsers ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : mentors.length > 0 ? (
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {mentors.slice(0, 5).map((mentor, index) => (
                      <motion.div
                        key={mentor.user_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-blue-500/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                              <img
                                src={
                                  mentor.profile_image ||
                                  `https://ui-avatars.com/api/?name=${
                                    mentor.first_name + " " + mentor.last_name
                                  }&background=random`
                                }
                                alt={`${mentor.first_name} ${mentor.last_name}`}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">
                            {mentor.first_name} {mentor.last_name}
                          </h4>
                          {/* <p className="text-sm text-gray-400">
                            {mentor.years_of_experience || 0} years experience
                          </p> */}
                          {/* <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < (mentor.proficiency_level || 3)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              Level {mentor.proficiency_level || 3}
                            </span>
                          </div> */}
                        </div>
                        <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors">
                          <Eye
                            className="w-5 h-5 text-blue-400"
                            onClick={() => {
                              window.scrollTo(0, 0);
                              navigate(`/${mentor.user_id}`);
                            }}
                          />
                        </button>
                      </motion.div>
                    ))}
                    {mentors.length > 5 && (
                      <div className="text-center py-2">
                        <span className="text-sm text-gray-400">
                          +{mentors.length - 5} more mentors
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">
                      No mentors found for this skill
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Learners Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Learners
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {learners.length} students learning {topic}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">
                      {learners.length}
                    </div>
                    <div className="text-xs text-gray-500">Active</div>
                  </div>
                </div>

                {isLoadingUsers ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  </div>
                ) : learners.length > 0 ? (
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {learners.slice(0, 5).map((learner, index) => (
                      <motion.div
                        key={learner.user_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-green-500/50 transition-colors"
                      >
                        {console.log(learner)}
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                              <img
                                src={
                                  learner.profile_image ||
                                  `https://ui-avatars.com/api/?name=${
                                    learner.first_name + " " + learner.last_name
                                  }&background=random`
                                }
                                alt={`${learner.first_name} ${learner.last_name}`}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <h4 className="font-medium text-white">
                            {learner.first_name} {learner.last_name}
                          </h4>
                          {/* <p className="text-sm text-gray-400">
                            {learner.grade_level || "Student"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < (learner.proficiency_level || 1)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              Level {learner.proficiency_level || 1}
                            </span>
                          </div> */}
                        </div>
                        <button className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors">
                          <Eye
                            className="w-5 h-5 text-green-400"
                            onClick={() => {
                              window.scrollTo(0, 0);
                              navigate(`/${learner.user_id}`);
                            }}
                          />
                        </button>
                      </motion.div>
                    ))}
                    {learners.length > 5 && (
                      <div className="text-center py-2">
                        <span className="text-sm text-gray-400">
                          +{learners.length - 5} more learners
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">
                      No learners found for this skill
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateRoadmap;
