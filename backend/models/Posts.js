const pool = require('../config/database');

class Posts {
    static async create({user_id ,content}) {
        const [result] = await pool.query(
            'INSERT INTO posts (user_id,content) VALUES (?,?)',
            [user_id ,content]
        );

        return result?.insertId || null;
    }
    static async updata({ user_id ,content,newContent}){
        const [rows] = await pool.query('UPDATE posts SET content=?  where user_id = ? and content= ?', [newContent,user_id,content ]);
        return rows[0] || null;
    }
    static async findAllPosts(user_id) {
        
        const [rows] = await pool.query(`SELECT content from posts where user_id = ?`,[user_id]);
        
        return rows || null;
    }

    static async delete({ user_id ,content}){
        const [rows] = await pool.query('DELETE from  posts where content=? and user_id = ? ', [ content,user_id ]);
        return rows[0] || null;
    }
}

module.exports = Posts;