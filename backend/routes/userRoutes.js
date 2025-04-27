const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const recommendation = require("../controllers/recommendation");
const { authenticate, authorizeTeacher } = require("../middleware/auth");
const User = require("../models/User");

router.put("/", userController.update);
router.get("/get/:id", authenticate, userController.getUser);
router.post("/addSkills", authenticate, userController.addSkills);
router.post(
  "/createSkills",
  authenticate,
  authorizeTeacher,
  userController.createSkills
);
router.get("/showSkills", authenticate, userController.showSkills);
router.get("/getAll", authenticate, userController.getAllUser);
router.get(
  "/getUserBySkillId/:id",
  authenticate,
  userController.getUsersBySkillId
);
router.post(
  "/getUserByAnySkill",
  authenticate,
  recommendation.getUsersByAnySkills
);
router.get("/getSkillsById/:id", authenticate, userController.getSkillsById);
router.get("/getAllTeachers/:id", authenticate, userController.getAllTeachers);
router.get("/getAllStudents/:id", authenticate, userController.getAllStudents);

// Skills management routes
router.post("/skills", authenticate, async (req, res) => {
  try {
    const { skills } = req.body;
    const userId = req.user.userId;
    await User.updateSkills(userId, skills);
    res.json({ message: "Skills updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/skills/:skillId", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const skillId = req.params.skillId;
    await User.deleteSkill(userId, skillId);
    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/skills", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const skills = await User.findSkillsById(userId);
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
