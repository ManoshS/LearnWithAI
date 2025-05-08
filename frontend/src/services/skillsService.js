import axiosInstance from "../authComponent/axiosConnection";

export const getUserSkills = async () => {
  try {
    const response = await axiosInstance.get("/api/users/showSkills");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching skills:", error);
    throw error;
  }
};

export const updateUserSkills = async (skillName) => {
  try {
    if (!skillName || typeof skillName !== "string") {
      throw new Error("Skill name must be a non-empty string");
    }

    const trimmedSkill = skillName.trim();
    if (trimmedSkill.length === 0) {
      throw new Error("Skill name cannot be empty");
    }

    // First create the skill
    await axiosInstance.post("/api/users/createSkills", {
      skill_name: trimmedSkill,
    });

    // Then add the skill to the user
    // const response = await axiosInstance.post("/api/users/addSkills", {
    //   skill_name: trimmedSkill,
    //   proficiency_level: 1, // Default proficiency level
    // });

    // return response.data;
  } catch (error) {
    console.error("Error updating skills:", error);
    throw error;
  }
};

export const deleteUserSkill = async (skillId) => {
  try {
    if (!skillId) {
      throw new Error("Skill ID is required");
    }

    const response = await axiosInstance.delete(`/api/users/skills/${skillId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting skill:", error);
    throw error;
  }
};
