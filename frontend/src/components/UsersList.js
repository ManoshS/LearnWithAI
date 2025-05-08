import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../authComponent/axiosConnection";
import {
  UserPlus,
  Star,
  MessageCircle,
  Users,
  Briefcase,
  GraduationCap,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  X,
  Loader2,
} from "lucide-react";
import { Tag } from "antd";
import { Link, useNavigate } from "react-router-dom";
// Mentors Component
const MentorsGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connections, setConnections] = useState([]);
  const [userConnectionsCount, setUserConnectionsCount] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const filters = [
    { id: "All", label: "All Users" },
    { id: "Recommend For Me", label: "Recommend For Me" },
    { id: "online", label: "Online" },
    { id: "offline", label: "Offline" },
    { id: "favorites", label: "Favorites" },
  ];

  useEffect(() => {
    if (selectedSkill === "Recommend For Me") {
      fetchRecommendedMentors();
    } else {
      fetchMentors();
    }
    fetchConnections();
  }, [selectedSkill]);

  const fetchConnections = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axiosInstance.get(
        `/api/connect/getAllConnections/${userId}`
      );
      setConnections(response.data);
    } catch (err) {
      console.error("Error fetching connections:", err);
    }
  };

  const getConnectionStatus = (userId) => {
    // Check if there's an accepted connection
    const isConnected = connections.some(
      (conn) =>
        conn.status === "accepted" &&
        (conn.connection_recoverid === userId ||
          conn.connection_senderid === userId)
    );
    if (isConnected) return "connected";

    // Check if there's a pending connection
    const isPending = connections.some(
      (conn) =>
        conn.status === "pending" &&
        (conn.connection_recoverid === userId ||
          conn.connection_senderid === userId)
    );
    if (isPending) return "pending";

    return "not_connected";
  };

  const getTotalConnections = async (userId) => {
    const response = await axiosInstance.get(
      `/api/connect/getAllConnections/${userId}`
    );

    return response.data.filter(
      (conn) =>
        conn.status === "accepted" &&
        (conn.connection_recoverid === userId ||
          conn.connection_senderid === userId)
    ).length;
  };

  const fetchMentors = async () => {
    try {
      const response = await axiosInstance.get("/api/users/getAllTeachers/1"); // Replace 1 with actual user ID

      // Use Promise.all to wait for all async operations to complete
      const mentorsList = await Promise.all(
        response.data.map(async (user) => {
          try {
            const userItem = await axiosInstance.get(
              `api/users/get/${user.teacher_id}`
            );
            return userItem.data;
          } catch (e) {
            console.error(`Error fetching user ${user.teacher_id}:`, e);
            return null;
          }
        })
      );

      // Filter out any null values from failed requests
      const validMentors = mentorsList.filter((mentor) => mentor !== null);
      setMentors(validMentors);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching mentors:", err);
      setError("Failed to fetch mentors");
      setLoading(false);
    }
  };

  const fetchUserSkills = async (userId) => {
    try {
      const response = await axiosInstance.get(
        `/api/users/getSkillsById/${userId}`
      );
      return response.data.map((skill) => skill.skill_id);
    } catch (error) {
      console.error("Error fetching user skills:", error);
      return [];
    }
  };

  const fetchRecommendedMentors = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      // Fetch user skills from API
      const userSkills = await fetchUserSkills(userId);

      if (userSkills.length === 0) {
        setError("No skills found for recommendations");
        setLoading(false);
        return;
      }

      const response = await axiosInstance.post(
        "/api/users/getUserByAnySkill",
        {
          skillsList: userSkills,
        }
      );

      if (response.data && response.data.length > 0) {
        // Filter for teachers only
        const teacherUsers = response.data.filter(
          (user) => user.user_type === "teacher"
        );

        // Fetch full user details for each recommended teacher
        const mentorsList = await Promise.all(
          teacherUsers.map(async (user) => {
            try {
              const userItem = await axiosInstance.get(
                `/api/users/get/${user.user_id}`
              );
              if (userItem.data) {
                // Add skills to the user data
                const skillsResponse = await axiosInstance.get(
                  `/api/users/getSkillsById/${user.user_id}`
                );
                return {
                  ...userItem.data,
                  skills: skillsResponse.data || [],
                };
              }
              return null;
            } catch (e) {
              console.error(`Error fetching user ${user.user_id}:`, e);
              return null;
            }
          })
        );

        // Filter out any null values
        const validMentors = mentorsList.filter((mentor) => mentor !== null);
        setMentors(validMentors);
      } else {
        setMentors([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching recommended mentors:", err);
      // setError("Failed to fetch recommended mentors");
      setLoading(false);
    }
  };

  const handleConnect = async (userId) => {
    try {
      await axiosInstance.post("/api/connect/addConnection", {
        connection_recover_id: userId,
        connection_sender_id: localStorage.getItem("userId"),
      });
      // Update connections state to include the new pending connection
      setConnections((prev) => [
        ...prev,
        {
          connection_recoverid: userId,
          connection_senderid: localStorage.getItem("userId"),
          status: "pending",
        },
      ]);
    } catch (err) {
      console.error("Error connecting with user:", err);
    }
  };

  const handleMessageClick = (userId) => {
    navigate(`/chat/${userId}`);
  };

  const filteredMentors = React.useMemo(
    () =>
      mentors?.filter((mentor) => {
        if (!mentor) return false;

        const fullName = `${mentor.first_name || ""} ${
          mentor.last_name || ""
        }`.toLowerCase();
        const matchesSearch =
          searchQuery === "" || fullName.includes(searchQuery.toLowerCase());

        // If "Recommend For Me" is selected, show all recommended mentors
        const matchesSkill =
          selectedSkill === "All" ||
          selectedSkill === "Recommend For Me" ||
          mentor.skills?.includes(selectedSkill);

        return matchesSearch && matchesSkill;
      }),
    [mentors, searchQuery, selectedSkill]
  );

  // Helper to fetch and cache total connections for a user
  const fetchUserConnectionsCount = async (userId) => {
    if (userConnectionsCount[userId] !== undefined) return; // Already fetched
    try {
      const response = await axiosInstance.get(
        `/api/connect/getAllConnections/${userId}`
      );
      const count = response.data.filter(
        (conn) =>
          conn.status === "accepted" &&
          (conn.connection_recoverid === userId ||
            conn.connection_senderid === userId)
      ).length;
      setUserConnectionsCount((prev) => ({ ...prev, [userId]: count }));
    } catch (err) {
      setUserConnectionsCount((prev) => ({ ...prev, [userId]: 0 }));
    }
  };

  useEffect(() => {
    filteredMentors.forEach((mentor) => {
      if (mentor && mentor.teacher_id)
        fetchUserConnectionsCount(mentor.teacher_id);
    });
  }, [filteredMentors]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 animate-pulse" />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="relative w-16 h-16 rounded-full bg-gray-800/50 backdrop-blur-lg border border-gray-700 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-8 h-8 text-blue-500" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-lg blur opacity-30" />
          <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-lg border border-red-500/20 p-6 text-center">
            <h3 className="text-red-400 text-lg font-medium mb-2">Error</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated background pattern */}
      <div className=" inset-0 opacity-10">
        <div
          className=" inset-0"
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

      <div className=" max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Users Directory
          </h1>
          <p className="text-gray-400">
            Connect with other learners and mentors
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                style={{
                  zIndex: 10000,
                }}
              >
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg text-white flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </motion.button>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex flex-wrap gap-2"
              >
                {filters.map((filter) => (
                  <motion.button
                    key={filter.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSkill(filter.id)}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      selectedSkill === filter.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-gray-400"
                    }`}
                  >
                    {filter.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredMentors.map((mentor, index) => {
              const connectionStatus = getConnectionStatus(mentor.teacher_id);
              const isConnected = connectionStatus === "connected";
              const isPending = connectionStatus === "pending";
              if (mentor.teacher_id != localStorage.getItem("userId"))
                return (
                  <motion.div
                    key={mentor.teacher_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group relative w-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200" />
                    <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors p-6 h-full">
                      <div
                        className="flex items-start justify-between mb-4 cursor-pointer"
                        onClick={() => navigate(`/${mentor.teacher_id}`)}
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
                          <div>
                            <h3 className="text-white font-semibold">{`${mentor.first_name} ${mentor.last_name}`}</h3>
                            <p className="text-sm text-gray-400">
                              {mentor.bio || "Mentor"}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-400 hover:text-yellow-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add favorite functionality here
                          }}
                        >
                          <Star
                            className={`w-5 h-5 ${
                              mentor.isFavorite ? "fill-yellow-400" : ""
                            }`}
                          />
                        </motion.button>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Briefcase className="w-4 h-4" />
                          <span className="text-sm">
                            {mentor.organization || "Educational Institution"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">
                            {userConnectionsCount[mentor.teacher_id] !==
                            undefined
                              ? userConnectionsCount[mentor.teacher_id]
                              : "..."}{" "}
                            connections
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span
                          className={`text-sm ${
                            isConnected ? "text-green-400" : "text-gray-400"
                          }`}
                        >
                          {isConnected ? "Connected" : "Not Connected"}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleConnect(mentor.teacher_id)}
                            disabled={isConnected || isPending}
                            className={`flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg flex items-center justify-center gap-1 text-sm ${
                              isConnected || isPending
                                ? "cursor-not-allowed opacity-75"
                                : "hover:bg-blue-600"
                            }`}
                          >
                            <UserPlus className="w-4 h-4" />
                            {isConnected
                              ? "Connected"
                              : isPending
                              ? "Pending"
                              : "Connect"}
                          </button>
                          <button
                            onClick={() =>
                              handleMessageClick(mentor.teacher_id)
                            }
                            disabled={!isConnected}
                            className={`flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg flex items-center justify-center gap-1 text-sm ${
                              isConnected
                                ? "hover:bg-blue-600"
                                : "cursor-not-allowed opacity-75"
                            }`}
                          >
                            <MessageCircle className="w-4 h-4" />
                            Message
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Learners Component
const LearnersGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("All");
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connections, setConnections] = useState([]);
  const [userConnectionsCount, setUserConnectionsCount] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const filters = [
    { id: "All", label: "All Users" },
    { id: "Recommend For Me", label: "Recommend For Me" },
    { id: "online", label: "Online" },
    { id: "offline", label: "Offline" },
    { id: "favorites", label: "Favorites" },
  ];

  useEffect(() => {
    if (selectedInterest === "Recommend For Me") {
      fetchRecommendedLearners();
    } else {
      fetchLearners();
    }
    fetchConnections();
  }, [selectedInterest]);

  const fetchConnections = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axiosInstance.get(
        `/api/connect/getAllConnections/${userId}`
      );
      console.log(response.data);
      setConnections(response.data);
    } catch (err) {
      console.error("Error fetching connections:", err);
    }
  };

  const getConnectionStatus = (learnerId) => {
    // Check if there's an accepted connection
    const isConnected = connections.some(
      (conn) =>
        conn.status == "accepted" &&
        (conn.connection_recoverid === learnerId ||
          conn.connection_senderid === learnerId)
    );
    if (isConnected) return "connected";

    // Check if there's a pending connection
    const isPending = connections.some(
      (conn) =>
        conn.status == "pending" &&
        (conn.connection_recoverid === learnerId ||
          conn.connection_senderid === learnerId)
    );

    if (isPending) return "pending";

    return "not_connected";
  };

  const getTotalConnections = async (userId) => {
    const response = await axiosInstance.get(
      `/api/connect/getAllConnections/${userId}`
    );

    return response.data.filter(
      (conn) =>
        conn.status === "accepted" &&
        (conn.connection_recoverid === userId ||
          conn.connection_senderid === userId)
    ).length;
  };

  const fetchLearners = async () => {
    try {
      const response = await axiosInstance.get("/api/users/getAllStudents/1"); // Replace 1 with actual user ID

      // Use Promise.all to wait for all async operations to complete
      const learnersList = await Promise.all(
        response.data.map(async (user) => {
          try {
            const userItem = await axiosInstance.get(
              `api/users/get/${user.student_id}`
            );
            return userItem.data;
          } catch (e) {
            console.error(`Error fetching user ${user.student_id}:`, e);
            return null;
          }
        })
      );

      // Filter out any null values from failed requests
      const validLearners = learnersList.filter((learner) => learner !== null);
      setLearners(validLearners);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching learners:", err);
      setError("Failed to fetch learners");
      setLoading(false);
    }
  };

  const fetchUserSkills = async (userId) => {
    try {
      const response = await axiosInstance.get(
        `/api/users/getSkillsById/${userId}`
      );
      return response.data.map((skill) => skill.skill_id);
    } catch (error) {
      console.error("Error fetching user skills:", error);
      return [];
    }
  };

  const fetchRecommendedLearners = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      // Fetch user skills from API
      const userSkills = await fetchUserSkills(userId);

      if (userSkills.length === 0) {
        setError("No skills found for recommendations");
        setLoading(false);
        return;
      }

      const response = await axiosInstance.post(
        "/api/users/getUserByAnySkill",
        {
          skillsList: userSkills,
        }
      );

      if (response.data && response.data.length > 0) {
        // Filter for students only
        const studentUsers = response.data.filter(
          (user) => user.user_type === "student"
        );

        // Fetch full user details for each recommended student
        const learnersList = await Promise.all(
          studentUsers.map(async (user) => {
            try {
              const userItem = await axiosInstance.get(
                `/api/users/get/${user.user_id}`
              );
              if (userItem.data) {
                // Add skills to the user data
                const skillsResponse = await axiosInstance.get(
                  `/api/users/getSkillsById/${user.user_id}`
                );
                return {
                  ...userItem.data,
                  skills: skillsResponse.data || [],
                };
              }
              return null;
            } catch (e) {
              console.error(`Error fetching user ${user.user_id}:`, e);
              return null;
            }
          })
        );

        // Filter out any null values
        const validLearners = learnersList.filter(
          (learner) => learner !== null
        );
        setLearners(validLearners);
      } else {
        setLearners([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching recommended learners:", err);
      // setError("Failed to fetch recommended learners");
      setLoading(false);
    }
  };

  const handleConnect = async (userId) => {
    try {
      await axiosInstance.post("/api/connect/addConnection", {
        connection_recover_id: userId,
        connection_sender_id: localStorage.getItem("userId"),
      });
      // Update connections state to include the new pending connection
      setConnections((prev) => [
        ...prev,
        {
          connection_recoverid: userId,
          connection_senderid: localStorage.getItem("userId"),
          status: "pending",
        },
      ]);
    } catch (err) {
      console.error("Error connecting with user:", err);
    }
  };

  const handleMessageClick = (userId) => {
    navigate(`/chat/${userId}`);
  };

  console.log(learners);
  const filteredLearners = React.useMemo(
    () =>
      learners?.filter((learner) => {
        if (!learner) return false;

        const fullName = `${learner.first_name || ""} ${
          learner.last_name || ""
        }`.toLowerCase();
        const matchesSearch =
          searchQuery === "" || fullName.includes(searchQuery.toLowerCase());

        // If "Recommend For Me" is selected, show all recommended learners
        const matchesInterest =
          selectedInterest === "All" ||
          selectedInterest === "Recommend For Me" ||
          learner.interests?.includes(selectedInterest);

        return matchesSearch && matchesInterest;
      }),
    [learners, searchQuery, selectedInterest]
  );

  // Helper to fetch and cache total connections for a user
  const fetchUserConnectionsCount = async (userId) => {
    if (userConnectionsCount[userId] !== undefined) return; // Already fetched
    try {
      const response = await axiosInstance.get(
        `/api/connect/getAllConnections/${userId}`
      );
      const count = response.data.filter(
        (conn) =>
          conn.status === "accepted" &&
          (conn.connection_recoverid === userId ||
            conn.connection_senderid === userId)
      ).length;
      setUserConnectionsCount((prev) => ({ ...prev, [userId]: count }));
    } catch (err) {
      setUserConnectionsCount((prev) => ({ ...prev, [userId]: 0 }));
    }
  };

  useEffect(() => {
    console.log(filteredLearners);
    filteredLearners.forEach((learner) => {
      if (learner && learner.student_id)
        fetchUserConnectionsCount(learner.student_id);
    });
  }, [filteredLearners]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 animate-pulse" />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="relative w-16 h-16 rounded-full bg-gray-800/50 backdrop-blur-lg border border-gray-700 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-8 h-8 text-blue-500" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-lg blur opacity-30" />
          <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-lg border border-red-500/20 p-6 text-center">
            <h3 className="text-red-400 text-lg font-medium mb-2">Error</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated background pattern */}
      <div className=" inset-0 opacity-10">
        <div
          className=" inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20px 20px, #60A5FA 2px, transparent 0),
              radial-gradient(circle at 60px 60px, #60A5FA 2px, transparent 0),
              radial-gradient(circle at 100px 40px, #60A5FA 2px, transparent 0)
            `,
          }}
        />
      </div>

      <div
        className=" max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        style={{
          backgroundImage: `
          radial-gradient(circle at 20px 20px, #60A5FA 2px, transparent 0),
          radial-gradient(circle at 60px 60px, #60A5FA 2px, transparent 0),
          radial-gradient(circle at 100px 40px, #60A5FA 2px, transparent 0)
        `,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Users Directory
          </h1>
          <p className="text-gray-400">
            Connect with other learners and mentors
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                style={{
                  zIndex: 10000,
                }}
              >
                <Search className="w-5 h-5 text-gray-400" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg text-white flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </motion.button>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex flex-wrap gap-2"
              >
                {filters.map((filter) => (
                  <motion.button
                    key={filter.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedInterest(filter.id)}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      selectedInterest === filter.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "bg-gray-800/50 backdrop-blur-lg border border-gray-700 text-gray-400"
                    }`}
                  >
                    {filter.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Learners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredLearners.map((learner, index) => {
              const connectionStatus = getConnectionStatus(learner.student_id);
              const isConnected = connectionStatus === "connected";
              const isPending = connectionStatus === "pending";
              if (learner.student_id != localStorage.getItem("userId"))
                return (
                  <motion.div
                    key={learner.student_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group relative w-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200" />
                    <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors p-6 h-full">
                      <div
                        className="flex items-start justify-between mb-4 cursor-pointer"
                        onClick={() => navigate(`/${learner.student_id}`)}
                      >
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
                          <div>
                            <h3 className="text-white font-semibold">{`${learner.first_name} ${learner.last_name}`}</h3>
                            <p className="text-sm text-gray-400">
                              {learner.grade_level || "Beginner"}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-400 hover:text-yellow-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add favorite functionality here
                          }}
                        >
                          <Star
                            className={`w-5 h-5 ${
                              learner.isFavorite ? "fill-yellow-400" : ""
                            }`}
                          />
                        </motion.button>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-400">
                          <GraduationCap className="w-4 h-4" />
                          <span className="text-sm">
                            {learner.grade_level || "Beginner"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">
                            {userConnectionsCount[learner.student_id] !==
                            undefined
                              ? userConnectionsCount[learner.student_id]
                              : "..."}{" "}
                            connections
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span
                          className={`text-sm ${
                            isConnected ? "text-green-400" : "text-gray-400"
                          }`}
                        >
                          {isConnected ? "Connected" : "Not Connected"}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleConnect(learner.student_id)}
                            disabled={isConnected || isPending}
                            className={`flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg flex items-center justify-center gap-1 text-sm ${
                              isConnected || isPending
                                ? "cursor-not-allowed opacity-75"
                                : "hover:bg-blue-600"
                            }`}
                          >
                            <UserPlus className="w-4 h-4" />
                            {isConnected
                              ? "Connected"
                              : isPending
                              ? "Pending"
                              : "Connect"}
                          </button>
                          <button
                            onClick={() =>
                              handleMessageClick(learner.student_id)
                            }
                            disabled={!isConnected}
                            className={`flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg flex items-center justify-center gap-1 text-sm ${
                              isConnected
                                ? "hover:bg-blue-600"
                                : "cursor-not-allowed opacity-75"
                            }`}
                          >
                            <MessageCircle className="w-4 h-4" />
                            Message
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export { MentorsGrid, LearnersGrid };
