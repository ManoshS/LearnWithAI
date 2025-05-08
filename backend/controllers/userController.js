const bcrypt = require("bcrypt");
const pool = require("../config/database");
const StudentSkills = require("../models/StudentSkills");
const TeacherSkills = require("../models/TeacherSkills");
const Skills = require("../models/Skills");
const User = require("../models/User");

exports.update = async (req, res) => {
  const { username, email, password, first_name, last_name, user_type } =
    req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (req.user.email !== email)
      return res.status(403).json({ message: "No Access" });
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const [result] = await pool.query(
      "UPDATE users SET username=?,first_name=?,last_name=?,user_type=? WHERE email=?",
      [username, first_name, last_name, user_type, email]
    );
    res
      .status(201)
      .json({ Update_Status: "OK", message: "User Update successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAllUser = async (req, res) => {
  try {
    const rows = await User.findAll();
    if (rows.length > 0) {
      const users = rows;
      res.json(users);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getUser = async (req, res) => {
  try {
    let role = "";
    const [rows] = await pool.query(
      "SELECT user_type FROM users WHERE user_id=?",
      [req.params.id]
    );
    if (rows.length > 0) {
      const user = rows[0];
      role = user.user_type;
    } else {
      return res.status(404).json({ message: "User not found" });
    }
    if (role === "student") {
      const [rows] = await pool.query(
        "SELECT * FROM users u JOIN students s ON u.user_id = s.student_id  WHERE user_id = ?",
        [req.params.id]
      );
      if (rows.length > 0) {
        const user = rows[0];
        delete user.password_hash;
        return res.json(user);
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } else if (role === "teacher") {
      const [rows] = await pool.query(
        "SELECT * FROM users u JOIN teachers t ON u.user_id = t.teacher_id   WHERE user_id = ?",
        [req.params.id]
      );
      if (rows.length > 0) {
        const user = rows[0];
        delete user.password_hash;
        return res.json(user);
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } else res.status(404).json({ message: "User not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.addSkills = async (req, res) => {
  const { skill_id, user_id, proficiency_level } = req.body;

  try {
    console.log(user_id, req.user.userId);
    if (user_id != req.user.userId) {
      return res.status(403).json({ message: "NO ACCESS" });
    }

    const [rows] = await pool.query(
      "SELECT skill_name FROM skills where skill_id = ?",
      [skill_id]
    );
    if (rows.length > 0) {
      if (req.user.user_type == "teacher") {
        const teacher_id = user_id;
        TeacherSkills.create({ teacher_id, skill_id, proficiency_level });
      } else {
        const student_id = user_id;
        StudentSkills.create({ student_id, skill_id, proficiency_level });
      }
      res.status(201).json({ message: "Skill Added" });
    } else {
      res.status(404).json({ message: "Skill Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSkills = async (req, res) => {
  const { skill_name } = req.body;
  try {
    const insertId = await Skills.create({ skill_name });
    res.status(201).json({ message: `Inserted ${insertId}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.showSkills = async (req, res) => {
  try {
    const skillsList = await Skills.findAll();
    if (!skillsList) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json(skillsList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getUsersBySkillId = async (req, res) => {
  try {
    const [row] = await pool.query(
      "select student_id, proficiency_level from student_skills where skill_id = ?",
      [req.params.id]
    );
    if (row.length > 0) {
      return res.json(row[0]);
    } else {
      return res.status(404).json({ error: "Not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getSkillsById = async (req, res) => {
  try {
    const row = await User.findSkillsById(req.params.id);
    if (row.length > 0) {
      return res.json(row);
    } else {
      return res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const [row] = await pool.query("select * from students");
    if (row.length > 0) {
      return res.json(row);
    } else {
      return res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const [row] = await pool.query("select * from teachers");
    if (row.length > 0) {
      return res.json(row);
    } else {
      return res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a skill by ID
exports.deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    // First check if the skill exists
    const skillExists = await pool.query(
      "SELECT * FROM Skills WHERE skill_id = ?",
      [skillId]
    );

    if (skillExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    // Delete the skill
    await pool.query("DELETE FROM Skills WHERE skill_id = ?", [skillId]);

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting skill:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete skill",
      error: error.message,
    });
  }
};
