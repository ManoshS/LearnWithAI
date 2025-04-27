const pool = require('../config/database');

class StudentSkills {
    static async create({student_id, skill_id, proficiency_level }) {
        const [result] = await pool.query(
            'INSERT INTO student_skills (student_id,skill_id,proficiency_level) VALUES (?,?,?)',
            [student_id, skill_id, proficiency_level]
        );

        return result?.insertId || null;
    }

    static async findSkillsById(student_id) {
        const [rows] = await pool.query('SELECT s.skill_name FROM skills s JOIN student_skills ss ON s.skill_id = ss.skill_id WHERE ss.student_id = ?', [student_id]);
        return rows || null;
    }
    static async update({ student_id, skill_id, proficiency_level }) {
        const [rows] = await pool.query('UPDATE student_skills SET skill_id = ?,proficiency_level = ? where student_id = ?', [skill_id, proficiency_level, student_id]);
        return rows[0] || null;
    }
    static async delete({ student_id, skill_id}) {
        const [rows] = await pool.query('DELETE student_skills  where student_id = ? AND skill_id ?', [student_id,skill_id]);
        return rows[0] || null;
    }
}

module.exports = StudentSkills;