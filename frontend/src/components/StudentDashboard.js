import React, { useState, useRef, useEffect } from "react";
import { Search, X, SendHorizontal, Settings2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Target,
  Award,
  Clock,
  TrendingUp,
  Calendar,
  Star,
  Users,
} from "lucide-react";

//create CeacherDashboard same as StudentDashboard
const StudentDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [matchedStudents, setMatchedStudents] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Simulated search results
    setMatchedStudents(["Student 1", "Student 2"]);
    setIsDropdownOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const stats = [
    {
      title: "Courses Enrolled",
      value: "12",
      icon: <BookOpen className="w-6 h-6" />,
      change: "+2",
    },
    {
      title: "Goals Completed",
      value: "8",
      icon: <Target className="w-6 h-6" />,
      change: "+3",
    },
    {
      title: "Achievements",
      value: "15",
      icon: <Award className="w-6 h-6" />,
      change: "+5",
    },
    {
      title: "Study Hours",
      value: "45",
      icon: <Clock className="w-6 h-6" />,
      change: "+12",
    },
  ];

  const recentActivities = [
    {
      title: "Completed React Basics",
      type: "course",
      time: "2 hours ago",
      progress: 100,
    },
    {
      title: "Started Node.js Course",
      type: "course",
      time: "5 hours ago",
      progress: 25,
    },
    {
      title: "Achieved JavaScript Expert Badge",
      type: "achievement",
      time: "1 day ago",
      progress: 100,
    },
  ];

  const upcomingEvents = [
    {
      title: "Web Development Workshop",
      date: "Tomorrow, 2:00 PM",
      participants: 45,
    },
    {
      title: "AI Study Group",
      date: "Friday, 4:00 PM",
      participants: 28,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Track your progress, achievements, and upcoming learning activities
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200" />
              <div className="relative bg-gray-800/50 backdrop-blur-lg p-6 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-gray-700/50 rounded-lg">
                    {stat.icon}
                  </div>
                  <span className="text-green-400 text-sm font-medium">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-400 text-sm">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200" />
            <div className="relative bg-gray-800/50 backdrop-blur-lg p-6 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recent Activities
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1">
                        {activity.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{activity.time}</p>
                    </div>
                    <div className="w-24">
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${activity.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200" />
            <div className="relative bg-gray-800/50 backdrop-blur-lg p-6 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Events
              </h2>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-4 bg-gray-700/30 rounded-lg"
                  >
                    <h3 className="text-white font-medium mb-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{event.date}</span>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{event.participants}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
