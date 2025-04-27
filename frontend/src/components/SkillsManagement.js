import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, X, Save, Loader2 } from "lucide-react";
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

    setIsLoading(true);
    try {
      await updateUserSkills(trimmedSkill);
      await loadSkills();
      setNewSkill("");
      setMessage({ text: "Skill added successfully", type: "success" });
    } catch (error) {
      console.error("Add skill error:", error);
      setMessage({
        text: error.response?.data?.message || "Failed to add skill",
        type: "error",
      });
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-[#f3ebe1] p-8">
      {/* Background Pattern - moved to after the main content */}
      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl p-8 shadow-lg relative z-10"
        >
          <h2 className="text-3xl font-bold text-[#8b4513] mb-6">
            Manage Your Skills
          </h2>

          {message.text && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mb-4 p-3 rounded-lg ${
                message.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message.text}
            </motion.div>
          )}

          <div className="mb-6 relative z-20">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new skill..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b4513] focus:border-transparent outline-none bg-white"
                disabled={isLoading}
                autoComplete="off"
              />
              <button
                onClick={handleAddSkill}
                disabled={isLoading}
                className="bg-[#8b4513] text-white p-3 rounded-lg hover:bg-[#5c2d0b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                type="button"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Plus className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2 mb-6 max-h-[400px] overflow-y-auto relative z-20">
            {skills.map((skill, index) => (
              <motion.div
                key={`${skill.skill_name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-[#f4e4bc] rounded-lg"
              >
                <span className="text-[#8b4513] font-medium">
                  {skill.skill_name}
                </span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  disabled={isLoading}
                  className="text-[#8b4513] hover:text-red-600 transition-colors disabled:opacity-50"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Background Pattern - moved to bottom layer */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20px 20px, #8b4513 2px, transparent 0),
              radial-gradient(circle at 60px 60px, #8b4513 2px, transparent 0),
              radial-gradient(circle at 100px 40px, #8b4513 2px, transparent 0)
            `,
            backgroundSize: "100px 100px",
            zIndex: 1,
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default SkillsManagement;
