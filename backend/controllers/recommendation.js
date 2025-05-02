const pool = require("../config/database");
const StudentSkills = require("../models/StudentSkills");
const TeacherSkills = require("../models/TeacherSkills");
const Skills = require("../models/Skills");
const User = require("../models/User");

exports.getUsersByAnySkills = async (req, res) => {
  const { skillsList } = req.body;
  try {
    let data = "(";
    for (let i in skillsList) {
      data += i + ",";
    }
    data = data.substring(0, data.length - 1);
    data += ")";

    // Query to get both students and teachers with matching skills
    const [users] = await pool.query(`
            SELECT DISTINCT 
                'student' as user_type,
                student_id as user_id
            FROM student_skills 
            WHERE skill_id IN ${data}
            UNION ALL
            SELECT DISTINCT 
                'teacher' as user_type,
                teacher_id as user_id
            FROM teachers_skills 
            WHERE skill_id IN ${data}
        `);

    if (users.length > 0) {
      return res.status(200).json(users);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
