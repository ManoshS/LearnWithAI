const pool = require("../config/database");
const StudentSkills = require("../models/StudentSkills");
const TeacherSkills = require("../models/TeacherSkills");
const Skills = require("../models/Skills");
const User = require("../models/User");

exports.getUsersByAnySkills = async (req, res) => {
  const { skillsList } = req.body;
  try {
    if (!Array.isArray(skillsList) || skillsList.length === 0) {
      return res
        .status(400)
        .json({ message: "skillsList must be a non-empty array" });
    }
    // Prepare placeholders for parameterized query
    const placeholders = skillsList.map(() => "?").join(",");
    const numSkills = skillsList.length;

    // Students who have ANY of the skills
    const [students] = await pool.query(
      `SELECT u.*, 'student' as user_type
       FROM users u
       JOIN student_skills ss ON u.user_id = ss.student_id
       WHERE ss.skill_id IN (${placeholders}) AND u.user_type = 'student'
       GROUP BY u.user_id`,
      skillsList
    );

    // Teachers who have ANY of the skills
    const [teachers] = await pool.query(
      `SELECT u.*, 'teacher' as user_type
       FROM users u
       JOIN teachers_skills ts ON u.user_id = ts.teacher_id
       WHERE ts.skill_id IN (${placeholders}) AND u.user_type = 'teacher'
       GROUP BY u.user_id`,
      skillsList
    );

    const users = [...students, ...teachers];

    if (users.length > 0) {
      return res.status(200).json(users);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
