// ProfileCard.js
import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Edit2,
  Award,
  BookOpen,
  Target,
} from "lucide-react";

const ProfileCard = ({ user }) => {
  const stats = [
    { label: "Courses", value: "12", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Achievements", value: "8", icon: <Award className="w-5 h-5" /> },
    { label: "Goals", value: "5", icon: <Target className="w-5 h-5" /> },
  ];

  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, href: "https://github.com" },
    { icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com" },
    { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com" },
  ];

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

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-200" />
          <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-colors overflow-hidden">
            {/* Cover Image */}
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-4 right-4 p-2 bg-gray-800/50 backdrop-blur-lg rounded-lg text-white hover:bg-gray-700/50 transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Profile Content */}
            <div className="px-6 py-8">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative -mt-20"
                >
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1">
                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute bottom-0 right-0 p-2 bg-gray-800/50 backdrop-blur-lg rounded-lg text-white hover:bg-gray-700/50 transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </motion.button>
                </motion.div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {user?.name || "John Doe"}
                  </h1>
                  <p className="text-gray-400 mb-4">
                    {user?.title || "Full Stack Developer"}
                  </p>
                  <div className="flex justify-center md:justify-start gap-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gray-700/30 rounded-lg p-4 text-center"
                  >
                    <div className="flex justify-center mb-2 text-blue-400">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Mail className="w-5 h-5" />
                    <span>{user?.email || "john.doe@example.com"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Phone className="w-5 h-5" />
                    <span>{user?.phone || "+1 234 567 890"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <MapPin className="w-5 h-5" />
                    <span>{user?.location || "San Francisco, CA"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileCard;
