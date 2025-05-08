import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosConnection";
import { Select, InputNumber, Form, Space, Button, message, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Plus, CheckCircle2 } from "lucide-react";

const AddSkills = () => {
  const [availableSkills, setAvailableSkills] = useState([]);
  const [existingSkills, setExistingSkills] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("jwtToken");
        if (!userId || !token) {
          setError("User ID or token not found. Please login again.");
          return;
        }

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        const skillsResponse = await axiosInstance.get("/api/users/showSkills");
        let skillOptions = skillsResponse.data.map((skill) => ({
          value: skill.skill_id,
          label: skill.skill_name,
          disabled: false,
        }));
        setAvailableSkills(skillOptions);

        const userSkillsResponse = await axiosInstance.get(
          `/api/users/getSkillsById/${userId}`
        );
        const userSkills = userSkillsResponse.data.map((skill) => ({
          skill_id: skill.skill_id,
          skill_name: skill.skill_name,
          proficiency_level: skill.proficiency_level,
        }));
        setExistingSkills(userSkills);

        skillOptions = skillOptions.map((option) => ({
          ...option,
          disabled: userSkills.some(
            (userSkill) => userSkill.skill_id === option.value
          ),
        }));
        setAvailableSkills(skillOptions);
      } catch (err) {
        console.error("Error fetching skills:", err);
      }
    };

    fetchData();
  }, []);

  const handleSkillsSubmit = async (values) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID not found. Please login again.");
        return;
      }

      const selectedSkills = values.skills;
      const proficiencyLevels = {};

      Object.keys(values).forEach((key) => {
        if (key.startsWith("proficiency_")) {
          const skillId = parseInt(key.split("_")[1]);
          proficiencyLevels[skillId] = values[key];
        }
      });

      for (const skillId of selectedSkills) {
        try {
          await axiosInstance.post("/api/users/addSkills", {
            skill_id: skillId,
            user_id: userId,
            proficiency_level: proficiencyLevels[skillId],
          });
        } catch (skillError) {
          console.error(`Error adding skill ${skillId}:`, skillError);
          throw new Error(
            `Failed to add skill: ${
              skillError.response?.data?.message || "Unknown error"
            }`
          );
        }
      }

      message.success("Skills added successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error adding skills:", err);
      setError(err.message || "Failed to add skills");
      message.error(err.message || "Failed to add skills");
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

      <div className=" max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-gray-700"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Add Your Skills
            </h2>
            <p className="text-gray-400 mt-2">
              Select your skills and set your proficiency level
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {existingSkills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-green-400" />
                Your Current Skills:
              </h3>
              <div className="flex flex-wrap gap-2">
                {existingSkills.map((skill) => (
                  <Tag
                    key={skill.skill_id}
                    className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full"
                  >
                    {skill.skill_name}
                  </Tag>
                ))}
              </div>
            </motion.div>
          )}

          <Form
            form={form}
            onFinish={handleSkillsSubmit}
            layout="vertical"
            className="space-y-6"
          >
            <Form.Item
              name="skills"
              label={
                <span className="text-gray-300 flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Select new skills
                </span>
              }
              rules={[
                { required: true, message: "Please select at least one skill" },
              ]}
            >
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select your skills"
                options={availableSkills}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                className="custom-select"
                onChange={(selectedSkills) => {
                  const currentValues = form.getFieldsValue();
                  const newValues = { ...currentValues };

                  Object.keys(currentValues).forEach((key) => {
                    if (
                      key.startsWith("proficiency_") &&
                      !selectedSkills.includes(parseInt(key.split("_")[1]))
                    ) {
                      delete newValues[key];
                    }
                  });

                  form.setFieldsValue(newValues);
                }}
              />
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues?.skills !== currentValues?.skills
              }
            >
              {({ getFieldValue }) => {
                const selectedSkills = getFieldValue("skills") || [];
                return selectedSkills.map((skillId) => {
                  const skill = availableSkills.find(
                    (s) => s.value === skillId
                  );
                  return (
                    <Form.Item
                      key={skillId}
                      name={`proficiency_${skillId}`}
                      label={
                        <span className="text-gray-300">
                          Proficiency level for {skill?.label}
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please set proficiency level",
                        },
                      ]}
                    >
                      <InputNumber
                        min={1}
                        max={10}
                        style={{ width: "100%" }}
                        placeholder="Enter proficiency level (1-10)"
                        className="custom-input"
                      />
                    </Form.Item>
                  );
                });
              }}
            </Form.Item>

            <Form.Item>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Brain className="w-5 h-5" />
                Save Skills
              </motion.button>
            </Form.Item>
          </Form>
        </motion.div>
      </div>

      <style jsx global>{`
        .custom-select .ant-select-selector {
          background-color: rgba(31, 41, 55, 0.5) !important;
          border-color: rgba(75, 85, 99, 1) !important;
          color: white !important;
        }
        .custom-select .ant-select-selection-item {
          background-color: rgba(59, 130, 246, 0.2) !important;
          border-color: rgba(59, 130, 246, 0.3) !important;
          color: rgb(96, 165, 250) !important;
        }
        .custom-input .ant-input-number-input {
          background-color: rgba(31, 41, 55, 0.5) !important;
          border-color: rgba(75, 85, 99, 1) !important;
          color: white !important;
        }
        .ant-select-dropdown {
          background-color: rgb(31, 41, 55) !important;
        }
        .ant-select-item {
          color: white !important;
        }
        .ant-select-item-option-selected {
          background-color: rgba(59, 130, 246, 0.2) !important;
        }
        .ant-select-item-option-active {
          background-color: rgba(59, 130, 246, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default AddSkills;
