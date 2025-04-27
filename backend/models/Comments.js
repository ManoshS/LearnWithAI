const pool = require('../config/database');

class Comments {
    static async add({user_id ,post_id,content}) {
        const [result] = await pool.query(
            'INSERT INTO comments (post_id,user_id,content) VALUES (?,?,?)',
            [post_id,user_id ,content]
        );

        return result?.insertId || null;
    }
    
    static async findAllCommentsById(post_id) {
        
        const [rows] = await pool.query(`SELECT * from comments where post_id = ?`,[post_id]);
        
        return rows || null;
    }

    static async delete(comment_id){
        const [rows] = await pool.query('DELETE from comments where comment_id = ? ', [ comment_id]);
        return rows[0] || null;
    }
}

module.exports = Comments;