import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Award,
  Book,
  Users,
  Plus,
  MapPin,
  Mail,
  Calendar,
  MessageSquare,
  ThumbsUp,
  Share2,
  Bookmark,
  PlusCircle,
  Check,
  X,
  EditIcon,
  MessageCircle,
  Phone,
  Github,
  Linkedin,
  Twitter,
  Edit2,
  BookOpen,
  Target,
  Briefcase,
  GraduationCap,
  Star,
  UserPlus,
} from "lucide-react";
import axiosInstance from "../authComponent/axiosConnection";
import { useUser } from "../context/UserContext";
import { Link, useParams, useNavigate } from "react-router-dom";
// Dummy data
// const userData = {
//   name: "Alex Johnson",
//   role: "Software Engineering Student",
//   location: "Bengaluru, Karnataka",
//   email: "alex.j@email.com",
//   joinDate: "January 2024"
// }
// const skills= ["JavaScript", "React", "Python", "UI/UX Design", "Data Structures"];
// const activeCourses= [
//     {
//       id: 1,
//       title: "Advanced Web Development",
//       progress: 65,
//       lastAccessed: "2 days ago"
//     },
//     {
//       id: 2,
//       title: "Machine Learning Basics",
//       progress: 30,
//       lastAccessed: "5 days ago"
//     }
//   ]
//   const certificates= [
//     {
//       id: 1,
//       title: "React Frontend Development",
//       issueDate: "March 2024",
//       credential: "CERT-123-456"
//     },
//     {
//       id: 2,
//       title: "Python Programming",
//       issueDate: "February 2024",
//       credential: "CERT-789-012"
//     }
//   ]
//   const connections= [
//     { id: 1, name: "Sarah Wilson", role: "UX Designer", mutual: 12 },
//     { id: 2, name: "Mike Chen", role: "Full Stack Developer", mutual: 8 },
//     { id: 3, name: "Emma Davis", role: "Data Scientist", mutual: 15 }
//   ]

//  const posts= [
//     {
//       id: 1,
//       content: "Just completed my first machine learning project! Check out my implementation of a neural network from scratch 🚀",
//       likes: 24,
//       comments: 8,
//       timeAgo: "2 days ago"
//     },
//     {
//       id: 2,
//       content: "Looking for study partners for the Advanced Algorithms course. Anyone interested?",
//       likes: 15,
//       comments: 12,
//       timeAgo: "5 days ago"
//     },
//     {
//       id: 3,
//       content: "I am Happy to annunce that I and building a startup.",
//       likes: 10,
//       comments: 3,
//       timeAgo: "3 days ago"
//     },
//     {
//       id: 4,
//       content: "Looking for study partners for the Advanced Java course. Anyone interested?",
//       likes: 5,
//       comments: 2,
//       timeAgo: "10 days ago"
//     }
//   ]

const UserProfile = ({ id }) => {
  const user = useUser();
  const [userData, setUserData] = useState({});
  const [skills, setSkills] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeCourses, setActiveCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [connections, setConnections] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("not_connected");
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  const [totalConnections, setTotalConnections] = useState(0);
  const [activeTab, setActiveTab] = useState("about");
  const [isEditing, setIsEditing] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [commentInputs, setCommentInputs] = useState({});

  const stats = [
    {
      label: "Students",
      value: "45",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Courses",
      value: "12",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      label: "Achievements",
      value: "8",
      icon: <Award className="w-5 h-5" />,
    },
    {
      label: "Goals",
      value: "5",
      icon: <Target className="w-5 h-5" />,
    },
  ];

  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, href: "https://github.com" },
    { icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com" },
    { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/api/users/get/${userId}`);
        setData(response.data);
        setUserData(response.data);
        console.log(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      try {
        const skillsResponse = await axiosInstance.get(
          `/api/users/getSkillsById/${userId}`
        );
        setSkills(skillsResponse.data || []);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }

      try {
        const postsResponse = await axiosInstance.get(
          `/api/posts/getAllPosts/${userId}`
        );
        const postDetails = [...postsResponse.data];
        console.log("Initial posts:", postDetails);

        // Process all posts with their likes and comments
        const processedPosts = await Promise.all(
          postDetails.map(async (item) => {
            try {
              // Get likes count
              const postLikeCount = await axiosInstance.get(
                `/api/likes/getAllLikes/${item.post_id}`
              );

              // Get comments
              const postComments = await axiosInstance.get(
                `/api/comments/getAllComments/${item.post_id}`
              );

              // Process comments to get user names
              const comments = await Promise.all(
                postComments.data.map(async (comment) => {
                  try {
                    const userdata = await axiosInstance.get(
                      `/api/users/get/${comment.user_id}`
                    );
                    return {
                      ...comment,
                      user_name: userdata.data.first_name,
                      last_name: userdata.data.last_name,
                    };
                  } catch (error) {
                    console.error(
                      "Error fetching user data for comment:",
                      error
                    );
                    return {
                      ...comment,
                      user_name: "Unknown User",
                      last_name: "",
                    };
                  }
                })
              );

              console.log(
                "Processed comments for post",
                item.post_id,
                ":",
                comments
              );

              return {
                ...item,
                likesCount: postLikeCount?.data?.count || 0,
                comments: comments || [],
              };
            } catch (error) {
              console.error("Error processing post", item.post_id, ":", error);
              return {
                ...item,
                likesCount: 0,
                comments: [],
              };
            }
          })
        );

        console.log("Final processed posts:", processedPosts);
        setPosts(processedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      try {
        const connectionsResponse = await axiosInstance.get(
          `/api/connect/getAllConnections/${userId}`
        );
        console.log(connectionsResponse);
        const data = await Promise.all(
          connectionsResponse.data
            .filter(
              (item) =>
                item.status == "accepted" &&
                (item.connection_recoverid == userId ||
                  item.connection_senderid == userId)
            )
            .map(async (item) => {
              console.log(item);
              let connected_user_id =
                item.connection_recoverid == userId
                  ? item.connection_senderid
                  : item.connection_recoverid;

              console.log(connected_user_id);
              const userdata = await axiosInstance.get(
                `/api/users/get/${connected_user_id}`
              );
              console.log(userdata);
              return {
                user_id: userdata.data.user_id,
                user_name: userdata.data.first_name,
                last_name: userdata.data.last_name,
                grade_level: userdata.data.grade_level,
              };
            })
        );
        console.log(data);
        console.log(connectionsResponse); // Now `data` will be fully resolved
        setConnections(data);
        console.log(connectionsResponse.data);
        const acceptedConnections = connectionsResponse.data.filter(
          (item) =>
            item.status == "accepted" &&
            (item.connection_recoverid == userId ||
              item.connection_senderid == userId)
        );
        setTotalConnections(acceptedConnections.length);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }

      if (userId != currentUserId) {
        return;
      }
      try {
        const requestsResponse = await axiosInstance.get(
          `/api/connect/getAllConnectionsRequest/${userId}`
        );
        console.log(requestsResponse);
        const requestsData = await Promise.all(
          requestsResponse.data.map(async (item) => {
            let connected_user_id = item.connection_senderid;

            console.log(connected_user_id);
            const userdata = await axiosInstance.get(
              `/api/users/get/${connected_user_id}`
            );
            console.log(userdata);
            return {
              user_id: userdata.data.user_id,
              user_name: userdata.data.first_name,
              last_name: userdata.data.last_name,
              grade_level: userdata.data.grade_level,
              request_id: item.connection_id,
            };
          })
        );
        setConnectionRequests(requestsData);
      } catch (error) {
        console.error("Error fetching connection requests:", error);
      }
    };

    fetchData();
  }, [userId]);
  // Separate useEffect for fetching user data

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/api/users/get/${userId}`);
        setData(response.data);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Separate useEffect for fetching skills
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skillsResponse = await axiosInstance.get(
          `/api/users/getSkillsById/${userId}`
        );
        setSkills(skillsResponse.data || []);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, [userId]);

  // Separate useEffect for fetching posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsResponse = await axiosInstance.get(
          `/api/posts/getAllPosts/${userId}`
        );
        const postDetails = [...postsResponse.data];
        console.log("Initial posts:", postDetails);

        // Process all posts with their likes and comments
        const processedPosts = await Promise.all(
          postDetails.map(async (item) => {
            try {
              // Get likes count
              const postLikeCount = await axiosInstance.get(
                `/api/likes/getAllLikes/${item.post_id}`
              );

              // Get comments
              const postComments = await axiosInstance.get(
                `/api/comments/getAllComments/${item.post_id}`
              );

              // Process comments to get user names
              const comments = await Promise.all(
                postComments.data.map(async (comment) => {
                  try {
                    const userdata = await axiosInstance.get(
                      `/api/users/get/${comment.user_id}`
                    );
                    return {
                      ...comment,
                      user_name: userdata.data.first_name,
                      last_name: userdata.data.last_name,
                    };
                  } catch (error) {
                    console.error(
                      "Error fetching user data for comment:",
                      error
                    );
                    return {
                      ...comment,
                      user_name: "Unknown User",
                      last_name: "",
                    };
                  }
                })
              );

              console.log(
                "Processed comments for post",
                item.post_id,
                ":",
                comments
              );

              return {
                ...item,
                likesCount: postLikeCount?.data?.count || 0,
                comments: comments || [],
              };
            } catch (error) {
              console.error("Error processing post", item.post_id, ":", error);
              return {
                ...item,
                likesCount: 0,
                comments: [],
              };
            }
          })
        );

        console.log("Final processed posts:", processedPosts);
        setPosts(processedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [userId]);

  // Separate useEffect for checking connection status
  useEffect(() => {
    const checkConnectionStatus = async () => {
      if (userId === currentUserId) {
        setIsConnected(false);
        setConnectionStatus("not_connected");
        return;
      }

      try {
        const connectionsResponse = await axiosInstance.get(
          `/api/connect/getAllConnections/${currentUserId}`
        );
        const isUsersConnected = connectionsResponse.data.some(
          (conn) =>
            conn.status === "accepted" &&
            (conn.connection_senderid === parseInt(userId) ||
              conn.connection_recoverid === parseInt(userId))
        );
        const isPending = connectionsResponse.data.some(
          (conn) =>
            conn.status === "pending" &&
            (conn.connection_senderid === parseInt(userId) ||
              conn.connection_recoverid === parseInt(userId))
        );
        setIsConnected(isUsersConnected);
        if (isUsersConnected) setConnectionStatus("connected");
        else if (isPending) setConnectionStatus("pending");
        else setConnectionStatus("not_connected");
      } catch (error) {
        console.error("Error checking connection status:", error);
        setIsConnected(false);
        setConnectionStatus("not_connected");
      }
    };

    checkConnectionStatus();
  }, [userId, currentUserId]);

  // Separate useEffect for fetching connections
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const connectionsResponse = await axiosInstance.get(
          `/api/connect/getAllConnections/${currentUserId}`
        );
        const data = await Promise.all(
          connectionsResponse.data
            .filter((item) => item.status === "accepted")
            .map(async (item) => {
              let connected_user_id =
                item.connection_recoverid === parseInt(currentUserId)
                  ? item.connection_senderid
                  : item.connection_recoverid;

              const userdata = await axiosInstance.get(
                `/api/users/get/${connected_user_id}`
              );
              return {
                user_id: userdata.data.user_id,
                user_name: userdata.data.first_name,
                last_name: userdata.data.last_name,
                grade_level: userdata.data.grade_level,
              };
            })
        );
        console.log(data);
        console.log(connectionsResponse); // Now `data` will be fully resolved
        setConnections(data);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    fetchConnections();
  }, [currentUserId]);

  const handleAcceptConnection = async (requestId) => {
    try {
      await axiosInstance.put(`/api/connect/acceptConnection/${requestId}`);
      // Refresh connection requests and connections
      const requestsResponse = await axiosInstance.get(
        `/api/connect/getAllConnectionsRequest/${userId}`
      );
      const requestsData = await Promise.all(
        requestsResponse.data.map(async (item) => {
          let connected_user_id = item.connection_senderid;

          console.log(connected_user_id);
          const userdata = await axiosInstance.get(
            `/api/users/get/${connected_user_id}`
          );
          console.log(userdata);
          return {
            user_id: userdata.data.user_id,
            user_name: userdata.data.first_name,
            last_name: userdata.data.last_name,
            grade_level: userdata.data.grade_level,
            request_id: item.connection_id,
          };
        })
      );
      setConnectionRequests(requestsData);

      const connectionsResponse = await axiosInstance.get(
        `/api/connect/getAllConnections/${userId}`
      );
      console.log(connectionsResponse);
      const data = await Promise.all(
        connectionsResponse.data
          .filter(
            (item) =>
              item.status == "accepted" &&
              (item.connection_recoverid == userId ||
                item.connection_senderid == userId)
          )
          .map(async (item) => {
            console.log(item);
            let connected_user_id =
              item.connection_recoverid == userId
                ? item.connection_senderid
                : item.connection_recoverid;

            console.log(connected_user_id);
            const userdata = await axiosInstance.get(
              `/api/users/get/${connected_user_id}`
            );
            console.log(userdata);
            return {
              user_id: userdata.data.user_id,
              user_name: userdata.data.first_name,
              last_name: userdata.data.last_name,
              grade_level: userdata.data.grade_level,
            };
          })
      );
      console.log(data);
      console.log(connectionsResponse); // Now `data` will be fully resolved
      setConnections(data);
    } catch (error) {
      console.error("Error accepting connection:", error);
    }
  };

  const handleRejectConnection = async (requestId) => {
    try {
      await axiosInstance.put(`/api/connect/rejectConnection/${requestId}`);
      // Refresh connection requests
      const requestsResponse = await axiosInstance.get(
        `/api/connect/getAllConnectionsRequest/${userId}`
      );
      const requestsData = await Promise.all(
        requestsResponse.data.map(async (item) => {
          let connected_user_id = item.connection_senderid;

          console.log(connected_user_id);
          const userdata = await axiosInstance.get(
            `/api/users/get/${connected_user_id}`
          );
          console.log(userdata);
          return {
            user_id: userdata.data.user_id,
            user_name: userdata.data.first_name,
            last_name: userdata.data.last_name,
            grade_level: userdata.data.grade_level,
            request_id: item.connection_id,
          };
        })
      );
      setConnectionRequests(requestsData);
    } catch (error) {
      console.error("Error rejecting connection:", error);
    }
  };

  const handleChatClick = () => {
    navigate(`/chat/${userId}`);
  };

  const handleConnect = async () => {
    try {
      await axiosInstance.post("/api/connect/addConnection", {
        connection_recover_id: userId,
        connection_sender_id: currentUserId,
      });
      setConnectionStatus("pending");
    } catch (err) {
      console.error("Error connecting with user:", err);
    }
  };

  // Handler to create a new post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    try {
      const response = await axiosInstance.post("/api/posts/createPost", {
        user_id: currentUserId,
        content: newPostContent,
      });
      setNewPostContent("");
      // Optionally, prepend the new post to the posts list
      setPosts((prev) => [
        {
          ...{
            user_id: currentUserId,
            content: newPostContent,
          },
          likesCount: 0,
          comments: [],
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  // Handler to create a new comment for a post
  const handleCreateComment = async (postId, e) => {
    e.preventDefault();
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    try {
      const response = await axiosInstance.post("/api/comments/addComment", {
        user_id: currentUserId,
        post_id: postId,
        content,
      });
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));

      // Get current user data for the new comment
      const userResponse = await axiosInstance.get(
        `/api/users/get/${currentUserId}`
      );
      const newComment = {
        comment_id: response.data.comment_id || Date.now(), // Use response ID or fallback
        user_id: currentUserId,
        post_id: postId,
        content,
        user_name: userResponse.data.first_name,
        last_name: userResponse.data.last_name,
      };

      // Update posts state with the new comment
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.post_id === postId
            ? {
                ...post,
                comments: post.comments
                  ? [...post.comments, newComment]
                  : [newComment],
              }
            : post
        )
      );
    } catch (err) {
      console.error("Error creating comment:", err);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await axiosInstance.post("/api/likes/addLike", {
        user_id: currentUserId,
        post_id: postId,
      });
      // Update likesCount in UI
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.post_id === postId
            ? { ...post, likesCount: (post.likesCount || 0) + 1 }
            : post
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
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

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Main Profile */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex space-x-4">
                  <div className="relative">
                    <div className="w-22 h-22 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1">
                      <img
                        src={
                          userData
                            ? `https://ui-avatars.com/api/?name=${
                                userData.first_name + " " + userData.last_name
                              }&background=random`
                            : "https://ui-avatars.com/api/?name=User&background=random"
                        }
                        alt={
                          userData
                            ? `${userData.first_name} ${userData.last_name}`
                            : "User"
                        }
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-gray-800"></div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      {userData.first_name + " " + userData.last_name}
                    </h1>
                    <p className="text-gray-400">
                      {userData.bio || userData.grade_level || "User"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="flex items-center text-sm text-gray-400">
                        <MapPin className="w-4 h-4 mr-1" />
                        {"Bengaluru"}
                      </span>
                      <span className="flex items-center text-sm text-gray-400">
                        <Mail className="w-4 h-4 mr-1" />
                        {userData.email}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {userId !== currentUserId && isConnected && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleChatClick}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all duration-200 flex items-center"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </motion.button>
                  )}
                  {userId === currentUserId ? (
                    <Link to="../add-skills">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all duration-200 flex items-center"
                      >
                        <EditIcon className="w-4 h-4 mr-2" />
                        Edit Skills
                      </motion.button>
                    </Link>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConnect}
                      disabled={connectionStatus !== "not_connected"}
                      className={`px-6 py-2 rounded-lg transition-all duration-200 flex items-center
                        ${
                          connectionStatus === "connected"
                            ? "bg-gray-500 cursor-not-allowed"
                            : connectionStatus === "pending"
                            ? "bg-yellow-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
                        }
                      `}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {connectionStatus === "connected"
                        ? "Connected"
                        : connectionStatus === "pending"
                        ? "Pending"
                        : "Connect"}
                    </motion.button>
                  )}
                  {userId === currentUserId && (
                    <Link to="/chat-list">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all duration-200 flex items-center"
                      >
                        View All Chats
                      </motion.button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-white mb-3">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills &&
                    skills
                      ?.slice(0, showAllSkills ? 0 : 3)
                      .map((skill, index) => (
                        <motion.span
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/20"
                        >
                          {skill.skill_name}
                        </motion.span>
                      ))}

                  {!showAllSkills && skills.length > 3 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-400 text-sm font-medium hover:text-blue-300"
                    >
                      +{skills.length - 3} more
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Active Courses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-gray-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Active Courses
                </h2>
                <span className="text-sm text-gray-400">
                  {activeCourses.length} courses
                </span>
              </div>
              <div className="space-y-4">
                {activeCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-blue-500/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-white">{course.title}</h3>
                      <span className="text-sm text-gray-400">
                        {course.lastAccessed}
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      />
                    </div>
                    <span className="text-sm text-gray-400">
                      {course.progress}% completed
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Posts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-gray-700"
            >
              <h2 className="text-lg font-semibold text-white mb-4">
                Recent Posts
              </h2>
              {/* Send Post Form (only for current user) */}
              {userId === currentUserId && (
                <form onSubmit={handleCreatePost} className="mb-6">
                  <textarea
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 resize-none mb-2"
                    rows={2}
                    placeholder="What's on your mind?"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200"
                  >
                    Send Post
                  </motion.button>
                </form>
              )}
              <div className="space-y-6">
                {posts.map((post) => (
                  <motion.div
                    key={post?.post_id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-blue-500/50 transition-colors"
                  >
                    <p className="text-gray-300 mb-3">{post.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center hover:text-blue-400"
                        onClick={() => handleLikePost(post.post_id)}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {post?.likesCount}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center hover:text-blue-400"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {post?.comments?.length}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center hover:text-blue-400"
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </motion.button>
                      <span className="ml-auto">{post.timeAgo}</span>
                    </div>
                    {/* Comments Section */}
                    <div className="mt-4">
                      <h4 className="text-sm text-gray-400 mb-2">Comments</h4>
                      <div className="space-y-2">
                        {post.comments && post.comments.length > 0 ? (
                          post.comments.map((comment, idx) => (
                            <div
                              key={comment.comment_id || idx}
                              className="bg-gray-800/60 rounded p-2 text-gray-200 text-sm"
                            >
                              <span className="font-semibold">
                                {comment.user_name ? comment.user_name : "You"}
                              </span>
                              : {comment.content}
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 text-xs">
                            No comments yet.
                          </div>
                        )}
                      </div>
                      {/* Add Comment Form */}
                      <form
                        onSubmit={(e) => handleCreateComment(post.post_id, e)}
                        className="flex items-center mt-2 gap-2"
                      >
                        <input
                          type="text"
                          className="flex-1 p-1 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 text-sm"
                          placeholder="Add a comment..."
                          value={commentInputs[post.post_id] || ""}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [post.post_id]: e.target.value,
                            }))
                          }
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs"
                        >
                          Comment
                        </motion.button>
                      </form>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Create Roadmap Button */}
            <Link to={"/"}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create New Roadmap</span>
              </motion.button>
            </Link>

            {/* Connection Requests */}
            {connectionRequests.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-gray-700"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-white">
                    Connection Requests
                  </h2>
                  <span className="text-sm text-gray-400">
                    {connectionRequests.length} requests
                  </span>
                </div>
                <div className="space-y-4">
                  {connectionRequests.map((request) => (
                    <motion.div
                      key={request.request_id}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3 border border-gray-600"
                    >
                      <Link to={`/${request.user_id}`}>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                            <img
                              src={
                                request
                                  ? `https://ui-avatars.com/api/?name=${
                                      request.user_name +
                                      " " +
                                      request.last_name
                                    }&background=random`
                                  : "https://ui-avatars.com/api/?name=User&background=random"
                              }
                              alt={
                                request
                                  ? `${request.user_name} ${request.last_name}`
                                  : "User"
                              }
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">
                              {request.user_name}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {request.bio || request.grade_level}
                            </p>
                          </div>
                        </div>
                      </Link>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleAcceptConnection(request.request_id)
                          }
                          className="p-2 text-green-400 hover:bg-green-500/10 rounded-full transition-colors"
                        >
                          <Check className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleRejectConnection(request.request_id)
                          }
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Certificates */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Certificates</h2>
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex items-start space-x-3">
                    <Award className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">{cert.title}</h3>
                      <p className="text-sm text-gray-500">
                        Issued {cert.issueDate}
                      </p>
                      <p className="text-xs text-gray-400">
                        Credential: {cert.credential}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-gray-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Connections
                </h2>
                <span className="text-sm text-gray-400">
                  {totalConnections} connections
                </span>
              </div>
              <div className="space-y-4">
                {connections.map((connection) => (
                  <Link to={`/${connection.user_id}`} key={connection.user_id}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3 border border-gray-600 hover:border-blue-500/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                          <img
                            src={
                              connection
                                ? `https://ui-avatars.com/api/?name=${
                                    connection.user_name +
                                    " " +
                                    connection.last_name
                                  }&background=random`
                                : "https://ui-avatars.com/api/?name=User&background=random"
                            }
                            alt={
                              connection
                                ? `${connection.user_name} ${connection.last_name}`
                                : "User"
                            }
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">
                            {connection.user_name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {connection.bio || connection.grade_level}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {parseInt(Math.random() * 10)} mutual
                      </span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
