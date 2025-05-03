import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  const navigate = useNavigate();

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
              // Get user details using the user_id from response
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

        const matchesSearch =
          (mentor.first_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
            mentor.last_name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())) ??
          false;

        const matchesSkill =
          (selectedSkill === "All" || mentor.skills?.includes(selectedSkill)) ??
          false;

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

  if (loading) return <div>Loading mentors...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div
      className="p-6 bg-gray-50"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20px 20px, #fffff1 2px, transparent 0),
          radial-gradient(circle at 60px 60px, #000000 2px, transparent 0),
          radial-gradient(circle at 100px 40px, #8b4513 2px, transparent 0)
        `,
        backgroundSize: "100px 100px",
      }}
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900">Expert Mentors</h2>
        <p className="text-gray-600 mt-2">
          Connect with industry professionals to guide your learning journey
        </p>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 flex flex-col sm:flex-row gap-4"
      >
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search mentors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Skills Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            "All",
            "Recommend For Me",
            "React",
            "Python",
            "Node.js",
            "Machine Learning",
            "DevOps",
          ].map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(skill)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedSkill === skill
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } transition-colors duration-200`}
            >
              {skill}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Mentors Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        {filteredMentors.map((mentor) => {
          const connectionStatus = getConnectionStatus(mentor.teacher_id);
          const isConnected = connectionStatus === "connected";
          const isPending = connectionStatus === "pending";
          if (mentor.teacher_id != localStorage.getItem("userId"))
            return (
              <motion.div
                key={mentor.teacher_id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <Link to={`/${mentor.teacher_id}`}>
                  <div className="flex gap-4">
                    <img
                      src={
                        mentor.profile_image ||
                        `https://ui-avatars.com/api/?name=${
                          mentor.first_name + " " + mentor.last_name
                        }&background=random`
                      }
                      alt={`${mentor.first_name} ${mentor.last_name}`}
                      className="w-13 h-13 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{`${mentor.first_name} ${mentor.last_name}`}</h3>
                      <p className="text-gray-600 text-sm">
                        {mentor.bio || "Mentor"}
                      </p>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {mentor.organization || "Educational Institution"}
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {mentor.rating || "4.5"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      {mentor.students_count || "0"} students
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserPlus className="w-4 h-4 text-green-500" />
                    <span className="text-sm">
                      {userConnectionsCount[mentor.teacher_id] !== undefined
                        ? userConnectionsCount[mentor.teacher_id]
                        : "..."}{" "}
                      connections
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {mentor.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleConnect(mentor.teacher_id)}
                    disabled={isConnected || isPending}
                    className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      isConnected
                        ? "bg-gray-500 text-white cursor-not-allowed"
                        : isPending
                        ? "bg-yellow-500 text-white cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Connected
                      </>
                    ) : isPending ? (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Pending
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Connect
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleMessageClick(mentor.teacher_id)}
                    disabled={!isConnected}
                    className={`px-4 py-2 border border-gray-300 rounded-lg transition-colors flex items-center justify-center
                      ${
                        isConnected
                          ? "hover:bg-gray-50"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }
                    `}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
        })}
      </motion.div>
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
  const navigate = useNavigate();

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
              // Get user details using the user_id from response
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
        console.log(learner);
        if (!learner) return false;

        const matchesSearch =
          (learner.first_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
            learner.last_name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())) ??
          false;

        const matchesInterest =
          (selectedInterest === "All" ||
            learner.interests?.includes(selectedInterest)) ??
          false;
        console.log(matchesSearch, matchesInterest);
        return matchesSearch || matchesInterest;
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

  if (loading) return <div>Loading learners...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div
      className="p-6 bg-gray-50"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20px 20px, #fffff1 2px, transparent 0),
          radial-gradient(circle at 60px 60px, #000000 2px, transparent 0),
          radial-gradient(circle at 100px 40px, #8b4513 2px, transparent 0)
        `,
        backgroundSize: "100px 100px",
      }}
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900">Active Learners</h2>
        <p className="text-gray-600 mt-2">
          Connect with fellow learners and grow together
        </p>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 flex flex-col sm:flex-row gap-4"
      >
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search learners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Interests Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            "All",
            "Recommend For Me",
            "Web Development",
            "Mobile Apps",
            "Data Science",
            "UI/UX",
            "DevOps",
          ].map((interest) => (
            <button
              key={interest}
              onClick={() => setSelectedInterest(interest)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedInterest === interest
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } transition-colors duration-200`}
            >
              {interest}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Learners Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        {console.log(filteredLearners, "filteredLearners")}
        {filteredLearners &&
          filteredLearners?.map((learner) => {
            const connectionStatus = getConnectionStatus(learner.student_id);
            const isConnected = connectionStatus === "connected";
            const isPending = connectionStatus === "pending";
            if (learner.student_id != localStorage.getItem("userId"))
              return (
                <motion.div
                  key={learner.student_id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <Link to={`/${learner.student_id}`}>
                    <div className="flex gap-4">
                      <img
                        src={
                          learner.profile_image ||
                          `https://ui-avatars.com/api/?name=${
                            learner.first_name + " " + learner.last_name
                          }&background=random`
                        }
                        alt={`${learner.first_name} ${learner.last_name}`}
                        className="w-13 h-13 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{`${learner.first_name} ${learner.last_name}`}</h3>
                        <p className="text-gray-600 text-sm flex items-center gap-1">
                          <GraduationCap className="w-4 h-4" />

                          {learner.grade_level || "Beginner"}
                        </p>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${learner.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      {learner.goals || "Learning and growing"}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {learner.interests?.map((interest) => (
                      <span
                        key={interest}
                        className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <div className="flex items-center gap-1 mr-2">
                      <UserPlus className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        {userConnectionsCount[learner.student_id] !== undefined
                          ? userConnectionsCount[learner.student_id]
                          : "..."}{" "}
                        connections
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleConnect(learner.student_id);
                      }}
                      disabled={isConnected || isPending}
                      className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        isConnected
                          ? "bg-gray-500 text-white cursor-not-allowed"
                          : isPending
                          ? "bg-yellow-500 text-white cursor-not-allowed"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {isConnected ? (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Connected
                        </>
                      ) : isPending ? (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Pending
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Connect
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleMessageClick(learner.student_id)}
                      disabled={!isConnected}
                      className={`px-4 py-2 border border-gray-300 rounded-lg transition-colors flex items-center justify-center
                        ${
                          isConnected
                            ? "hover:bg-gray-50"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }
                      `}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                  {learner.skills && (
                    <div style={{ padding: "10px" }}>
                      {learner.skills.map((skill) => (
                        <Tag color="green">{skill.skill_name}</Tag>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
          })}
      </motion.div>
    </div>
  );
};

export { MentorsGrid, LearnersGrid };
