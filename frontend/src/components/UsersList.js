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

// Mentors Component
const MentorsGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connections, setConnections] = useState([]);
  const [pendingConnections, setPendingConnections] = useState([]);

  useEffect(() => {
    fetchMentors();
    fetchConnections();
    fetchPendingConnections();
  }, []);

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

  const fetchPendingConnections = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axiosInstance.get(
        `/api/connect/getAllConnectionsRequest/${userId}`
      );
      setPendingConnections(response.data);
    } catch (err) {
      console.error("Error fetching pending connections:", err);
    }
  };

  const getConnectionStatus = (mentorId) => {
    // Check if there's an accepted connection
    const isConnected = connections.some(
      (conn) => conn.connected_user_id === mentorId
    );
    if (isConnected) return "connected";

    // Check if there's a pending connection
    const isPending = pendingConnections.some(
      (conn) => conn.connection_senderid === mentorId
    );
    if (isPending) return "pending";

    return "not_connected";
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

  const handleConnect = async (mentorId) => {
    try {
      await axiosInstance.post("/api/connect/addConnection", {
        connection_recover_id: mentorId,
        connection_sender_id: localStorage.getItem("userId"),
      });
      // Update local state to show pending status
      setPendingConnections((prev) => [
        ...prev,
        { connection_senderid: mentorId },
      ]);
    } catch (err) {
      console.error("Error connecting with mentor:", err);
    }
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
                      {mentor.expertise || "Teacher"}
                    </p>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {mentor.organization || "Educational Institution"}
                    </p>
                  </div>
                </div>

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
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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
  const [pendingConnections, setPendingConnections] = useState([]);

  useEffect(() => {
    fetchLearners();
    fetchConnections();
    fetchPendingConnections();
  }, []);

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

  const fetchPendingConnections = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axiosInstance.get(
        `/api/connect/getAllConnectionsRequest/${userId}`
      );
      setPendingConnections(response.data);
    } catch (err) {
      console.error("Error fetching pending connections:", err);
    }
  };

  const getConnectionStatus = (learnerId) => {
    // Check if there's an accepted connection
    const isConnected = connections.some(
      (conn) => conn.connected_user_id === learnerId
    );
    if (isConnected) return "connected";

    // Check if there's a pending connection
    const isPending = pendingConnections.some(
      (conn) => conn.connection_senderid === learnerId
    );
    if (isPending) return "pending";

    return "not_connected";
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

  const handleConnect = async (learnerId) => {
    try {
      await axiosInstance.post("/api/connect/addConnection", {
        connection_recover_id: learnerId,
        connection_sender_id: localStorage.getItem("userId"),
      });
      // Update local state to show pending status
      setPendingConnections((prev) => [
        ...prev,
        { connection_senderid: learnerId },
      ]);
    } catch (err) {
      console.error("Error connecting with learner:", err);
    }
  };

  console.log(learners);
  const filteredLearners = React.useMemo(
    () =>
      learners?.filter((learner) => {
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

        return matchesSearch && matchesInterest;
      }),
    [learners, searchQuery, selectedInterest]
  );

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
                        {learner.level || "Beginner"} Level
                      </p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${learner.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

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
                    <button
                      onClick={() => handleConnect(learner.student_id)}
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
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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

export { MentorsGrid, LearnersGrid };
