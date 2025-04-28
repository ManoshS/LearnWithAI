import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import axiosInstance from "../authComponent/axiosConnection";
import { useUser } from "../context/UserContext";
import { Link, useParams } from "react-router-dom";
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
  const { userId } = useParams();

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
        setPosts(postsResponse.data);
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
            .filter((item) => item.status == "accepted")
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
        console.error("Error fetching posts:", error);
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
          .filter((item) => item.status == "accepted")
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

  return (
    <div
      className="min-h-screen bg-gray-50 py-8"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20px 10px, #939393 2px, transparent 0),
          radial-gradient(circle at 40px 20px, #939393 2px, transparent 0),
          radial-gradient(circle at 80px 40px, #939393 2px, transparent 0)
        `,
        backgroundSize: "100px 100px",
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Main Profile */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex space-x-4">
                  <div className="relative">
                    <div className="w-22 h-22 rounded-full bg-blue-100 flex items-center justify-center">
                      {/* <User className="w-12 h-12 text-blue-600" /> */}
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
                    <div className="absolute -bottom-2 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">
                      {userData.first_name + " " + userData.last_name}
                    </h1>
                    <p className="text-gray-600">
                      {userData.bio || userData.grade_level || "User"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        {"Bengaluru"}
                      </span>
                      <span className="flex items-center text-sm text-gray-500">
                        <Mail className="w-4 h-4 mr-1" />
                        {userData.email}
                      </span>
                      {/* <span className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        Joined {userData.joinDate}
                      </span> */}
                    </div>
                  </div>
                </div>
                {userId == localStorage.getItem("userId") ? (
                  <Link to="../add-skills">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
                      <EditIcon className="w-4 h-4 mr-2" />
                      Edit Skills
                    </button>
                  </Link>
                ) : (
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Connect
                  </button>
                )}
              </div>

              {/* Skills */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills &&
                    skills
                      ?.slice(0, showAllSkills ? 0 : 3)
                      .map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {skill.skill_name}
                        </span>
                      ))}

                  {!showAllSkills && skills.length > 3 && (
                    <button
                      // onClick={() => setShowAllSkills(true)}
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      +{skills.length - 3} more
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Active Courses */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Active Courses</h2>
                <span className="text-sm text-gray-500">
                  {activeCourses.length} courses
                </span>
              </div>
              <div className="space-y-4">
                {activeCourses.map((course) => (
                  <div
                    key={course.id}
                    className="border rounded-lg p-4 hover:border-blue-200 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{course.title}</h3>
                      <span className="text-sm text-gray-500">
                        {course.lastAccessed}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {course.progress}% completed
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* {data ? <pre>{JSON.stringify(data, null, 1)}</pre> : <p>Loading...</p>} */}
            {/* Posts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Posts</h2>
              <div className="space-y-6">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="border-b last:border-b-0 pb-4 last:pb-0"
                  >
                    <p className="mb-3">{post.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <button className="flex items-center hover:text-blue-600">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {post.likes}
                      </button>
                      <button className="flex items-center hover:text-blue-600">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {post.comments}
                      </button>
                      <button className="flex items-center hover:text-blue-600">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </button>
                      <span className="ml-auto">{post.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Create Roadmap Button */}
            <Link to={"/"}>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2">
                <PlusCircle className="w-5 h-5" />
                <span>Create New Roadmap</span>
              </button>
            </Link>

            {/* Connection Requests */}
            {connectionRequests.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Connection Requests</h2>
                  <span className="text-sm text-gray-500">
                    {console.log(connectionRequests)}
                    {connectionRequests.length} requests
                  </span>
                </div>
                <div className="space-y-4">
                  {connectionRequests.map((request) => (
                    <div
                      key={request.request_id}
                      className="flex items-center justify-between"
                    >
                      {console.log(request)}
                      <Link to={`/${request.user_id}`}>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
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
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{request.user_name}</h3>
                            <p className="text-sm text-gray-500">
                              {request.bio || request.grade_level}
                            </p>
                          </div>
                        </div>
                      </Link>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleAcceptConnection(request.request_id)
                          }
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleRejectConnection(request.request_id)
                          }
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Connections</h2>
                <span className="text-sm text-gray-500">
                  {connections.length} connections
                </span>
              </div>
              <div className="space-y-4">
                {connections.map((connection) => (
                  <Link to={`/${connection.user_id}`}>
                    <div
                      key={connection.user_id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
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
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {connection.user_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {connection.bio || connection.grade_level}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs text-gray-500">
                        {parseInt(Math.random() * 10)} mutual
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
