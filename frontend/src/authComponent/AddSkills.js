import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosConnection";
import { Select, InputNumber, Form, Space, Button, message, Tag } from "antd";
import { useNavigate } from "react-router-dom";

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
        console.log(userId, token);
        if (!userId || !token) {
          setError("User ID or token not found. Please login again.");
          return;
        }

        // Set the token in the axios instance
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        // Fetch available skills first
        const skillsResponse = await axiosInstance.get("/api/users/showSkills");
        let skillOptions = skillsResponse.data.map((skill) => ({
          value: skill.skill_id,
          label: skill.skill_name,
          disabled: false, // will update after fetching user skills
        }));
        setAvailableSkills(skillOptions);

        // Then fetch user's existing skills
        const userSkillsResponse = await axiosInstance.get(
          `/api/users/getSkillsById/${userId}`
        );
        const userSkills = userSkillsResponse.data.map((skill) => ({
          skill_id: skill.skill_id,
          skill_name: skill.skill_name,
          proficiency_level: skill.proficiency_level,
        }));
        setExistingSkills(userSkills);

        // Update available skills to disable existing ones
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

      // Get the selected skills with their proficiency levels
      const selectedSkills = values.skills;
      const proficiencyLevels = {};

      // Extract proficiency levels for each skill
      Object.keys(values).forEach((key) => {
        if (key.startsWith("proficiency_")) {
          const skillId = parseInt(key.split("_")[1]);
          proficiencyLevels[skillId] = values[key];
        }
      });

      // Add each skill one by one
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

      // Refresh the skills list after adding new skills
      //   const userSkillsResponse = await axiosInstance.get(
      //     `/api/users/getSkillsById/${userId}`
      //   );
      //   const updatedUserSkills = userSkillsResponse.data.map((skill) => ({
      //     skill_id: skill.skill_id,
      //     skill_name: skill.skill_name,
      //     proficiency_level: skill.proficiency_level,
      //   }));
      //   setExistingSkills(updatedUserSkills);

      //   // Update available skills to reflect new disabled options
      //   setAvailableSkills((prev) =>
      //     prev.map((skill) => ({
      //       ...skill,
      //       disabled: updatedUserSkills.some(
      //         (userSkill) => userSkill.skill_id === skill.value
      //       ),
      //     }))
      //   );

      //   // Clear the form
      //   form.resetFields();

      // Redirect to home page
      navigate("/");
    } catch (err) {
      console.error("Error adding skills:", err);
      setError(err.message || "Failed to add skills");
      message.error(err.message || "Failed to add skills");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{
        backgroundImage: `
              radial-gradient(circle at 20px 20px, #8b4513 2px, transparent 0),
              radial-gradient(circle at 60px 60px, #8b4513 2px, transparent 0),
              radial-gradient(circle at 100px 40px, #8b4513 2px, transparent 0)
            `,
        backgroundSize: "100px 100px",
      }}
    >
      <div
        className="flex items-center justify-center min-h-screen bg-gray-100"
        style={{
          minWidth: "450px",
        }}
      >
        <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-xl rounded-lg">
          <h2 className="text-2xl font-bold text-center">Add Your Skills</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Display existing skills */}
          {existingSkills.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Your Current Skills:
              </h3>
              <div className="flex flex-wrap gap-2">
                {existingSkills.map((skill) => (
                  <Tag key={skill.skill_id} color="blue">
                    {skill.skill_name}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          <Form form={form} onFinish={handleSkillsSubmit} layout="vertical">
            <Form.Item
              name="skills"
              label="Select new skills"
              rules={[
                { required: true, message: "Please select at least one skill" },
              ]}
            >
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select your skills"
                options={availableSkills}
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
                      label={`Proficiency level for ${skill?.label}`}
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
                      />
                    </Form.Item>
                  );
                });
              }}
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Save Skills
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddSkills;
