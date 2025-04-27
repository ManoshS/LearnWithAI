const pool = require('../config/database');

class Skills {
    static async create({ skill_name }) {
        const [result] = await pool.query(
            'INSERT INTO skills (skill_name) VALUES (?)',
            [skill_name]
        );

        return result?.insertId || null;
    }

    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM skills');
        
        return rows;
    }
    static async findSkillId(skill_name) {
        const [rows] = await pool.query('SELECT skill_id FROM skills where skill_name= ?', [skill_name]);
        return rows[0] || null;
    }
}

module.exports = Skills;