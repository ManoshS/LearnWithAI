const pool = require('../config/database');

class Likes {
    static async add({user_id ,post_id}) {
        const [result] = await pool.query(
            'INSERT INTO likes (user_id,post_id) VALUES (?,?)',
            [user_id ,post_id]
        );

        return result?.insertId || null;
    }
    
    static async findAllLikesById(user_id) {
        
        const [rows] = await pool.query(`SELECT * from likes where user_id = ?`,[user_id]);
        
        return rows || null;
    }

    static async delete(like_id){
        const [rows] = await pool.query('DELETE from likes where like_id = ? ', [ like_id]);
        return rows[0] || null;
    }
}

module.exports = Likes;