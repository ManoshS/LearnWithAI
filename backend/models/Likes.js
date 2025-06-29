const pool = require("../config/database");

class Likes {
  static async add({ user_id, post_id }) {
    const [result] = await pool.query(
      "INSERT INTO likes (user_id,post_id) VALUES (?,?)",
      [user_id, post_id]
    );

    return result?.insertId || null;
  }

  static async findAllLikesById(post_id) {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as count from likes where post_id = ?`,
      [post_id]
    );

    return rows[0] || null;
  }

  static async delete(like_id) {
    const [rows] = await pool.query("DELETE from likes where like_id = ? ", [
      like_id,
    ]);
    return rows[0] || null;
  }
}

module.exports = Likes;
