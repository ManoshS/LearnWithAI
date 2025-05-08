import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Save, Loader2, Target, Sparkles } from "lucide-react";
import {
  getUserSkills,
  updateUserSkills,
  deleteUserSkill,
} from "../services/skillsService";

const SkillsManagement = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setIsLoading(true);
    try {
      const userSkills = await getUserSkills();
      setSkills(Array.isArray(userSkills) ? userSkills : []);
      setMessage({ text: "", type: "" });
    } catch (error) {
      console.error("Load skills error:", error);
      setMessage({
        text: error.response?.data?.message || "Failed to load skills",
        type: "error",
      });
      setSkills([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      setMessage({ text: "Please enter a skill", type: "error" });
      return;
    }

    const trimmedSkill = newSkill.trim();
    if (
      skills.some(
        (s) => s.skill_name.toLowerCase() === trimmedSkill.toLowerCase()
      )
    ) {
      setMessage({ text: "This skill already exists", type: "error" });
      return;
    }

    try {
      await updateUserSkills(trimmedSkill);

      await loadSkills();
      setNewSkill("");
      setMessage({ text: "Skill added successfully", type: "success" });
    } catch (error) {
      console.error("Add skill error:", error);
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    setIsLoading(true);
    try {
      if (skillToRemove.skill_id) {
        await deleteUserSkill(skillToRemove.skill_id);
        await loadSkills();
        setMessage({ text: "Skill removed successfully", type: "success" });
      }
    } catch (error) {
      console.error("Remove skill error:", error);
      setMessage({
        text: error.response?.data?.message || "Failed to remove skill",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleAddSkill();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated background pattern */}
      <div className="inset-0 opacity-10">
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Manage Your Skills
          </h1>
          <p className="text-gray-400">
            Add and manage your skills to enhance your learning journey
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200" />
          <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-lg border border-gray-700 p-8">
            {/* Message Display */}
            <AnimatePresence>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mb-6 p-4 rounded-lg ${
                    message.type === "error"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : "bg-green-500/10 text-green-400 border border-green-500/20"
                  }`}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add Skill Input */}
            <div className="mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200" />
                <div className="relative flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a new skill..."
                    className="flex-1 p-3 rounded-lg bg-gray-800/50 backdrop-blur-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-400"
                    disabled={isLoading}
                    autoComplete="off"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddSkill}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Add Skill
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Skills List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              <AnimatePresence>
                {skills.map((skill, index) => (
                  <motion.div
                    key={`${skill.skill_name}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200" />
                    <div className="relative flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-lg rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-medium">
                          {skill.skill_name}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveSkill(skill)}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SkillsManagement;
