const pool = require('../config/database');

class TeacherSkills {
    static async create({ teacher_id, skill_id, proficiency_level }) {
        const [result] = await pool.query(
            'INSERT INTO teachers_skills (teacher_id,skill_id,proficiency_level) VALUES (?,?,?)',
            [teacher_id, skill_id, proficiency_level]
        );

        return result?.insertId || null;
    }

    static async findById(teacher_id) {
        const [rows] = await pool.query('SELECT * FROM teachers_skills where teacher_id = ?', [teacher_id]);
        return rows[0] || null;
    }
    static async update({ teacher_id, skill_id, proficiency_level }) {
        const [rows] = await pool.query('UPDATE teachers_skills SET skill_id = ?,proficiency_level = ? where teacher_id = ?', [skill_id, proficiency_level, teacher_id]);
        return rows[0] || null;
    }
    static async delete({ teacher_id, skill_id}) {
        const [rows] = await pool.query('DELETE teachers_skills  where teacher_id = ? AND skill_id ?', [teacher_id,skill_id]);
        return rows[0] || null;
    }
}

module.exports = TeacherSkills;