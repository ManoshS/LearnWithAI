const pool = require("../config/database");

class User {
  static async create({
    username,
    email,
    password,
    first_name,
    last_name,
    user_type,
    bio,
  }) {
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password_hash, first_name, last_name, user_type) VALUES (?, ?, ?, ?, ?, ?)",
      [username, email, password, first_name, last_name, user_type]
    );
    if (user_type + "".toLowerCase() === "teacher") {
      const [result1] = await pool.query(
        "INSERT INTO teachers (teacher_id , bio , years_of_experience) VALUES (?, ?, ?)",
        [result.insertId, bio, 0]
      );
    } else {
      const [result1] = await pool.query(
        "INSERT INTO students (student_id , grade_level ) VALUES (?, ?)",
        [result.insertId, bio]
      );
    }

    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM users WHERE user_id = ?", [
      id,
    ]);
    return rows[0] || null;
  }
  static async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0] || null;
  }
  static async findAll() {
    const [rows] = await pool.query("SELECT * FROM users ");
    return rows || null;
  }

  static async findSkillsById(id) {
    const [rows] = await pool.query(
      "SELECT s.skill_id, s.skill_name FROM skills s JOIN teachers_skills ts ON s.skill_id = ts.skill_id WHERE ts.teacher_id = ? UNION SELECT s.skill_id, s.skill_name FROM skills s JOIN student_skills ss ON s.skill_id = ss.skill_id WHERE ss.student_id = ?;",
      [id, id]
    );
    return rows || [];
  }

  static async updateSkills(userId, skills) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Get user type
      const [userRow] = await connection.query(
        "SELECT user_type FROM users WHERE user_id = ?",
        [userId]
      );
      if (!userRow || userRow.length === 0) {
        throw new Error("User not found");
      }

      const userType = userRow[0].user_type.toLowerCase();
      const table =
        userType === "teacher" ? "teachers_skills" : "student_skills";
      const idField = userType === "teacher" ? "teacher_id" : "student_id";

      // Delete existing skills
      await connection.query(`DELETE FROM ${table} WHERE ${idField} = ?`, [
        userId,
      ]);

      // Insert new skills
      for (const skillName of skills) {
        // Check if skill exists, if not create it
        let [skillRow] = await connection.query(
          "SELECT skill_id FROM skills WHERE skill_name = ?",
          [skillName]
        );
        let skillId;

        if (!skillRow || skillRow.length === 0) {
          const [newSkill] = await connection.query(
            "INSERT INTO skills (skill_name) VALUES (?)",
            [skillName]
          );
          skillId = newSkill.insertId;
        } else {
          skillId = skillRow[0].skill_id;
        }

        // Add skill to user
        await connection.query(
          `INSERT INTO ${table} (${idField}, skill_id) VALUES (?, ?)`,
          [userId, skillId]
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async deleteSkill(userId, skillId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Get user type
      const [userRow] = await connection.query(
        "SELECT user_type FROM users WHERE user_id = ?",
        [userId]
      );
      if (!userRow || userRow.length === 0) {
        throw new Error("User not found");
      }

      const userType = userRow[0].user_type.toLowerCase();
      const table =
        userType === "teacher" ? "teachers_skills" : "student_skills";
      const idField = userType === "teacher" ? "teacher_id" : "student_id";

      // Delete the skill
      await connection.query(
        `DELETE FROM ${table} WHERE ${idField} = ? AND skill_id = ?`,
        [userId, skillId]
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = User;
