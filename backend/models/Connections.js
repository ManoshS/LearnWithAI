const pool = require("../config/database");

class Connections {
  static async create({ connection_sender_id, connection_recover_id }) {
    const [result] = await pool.query(
      "INSERT INTO connects (connection_senderid,connection_recoverid,status) VALUES (?,?,?)",
      [connection_sender_id, connection_recover_id, "pending"]
    );

    return result?.insertId || null;
  }

  static async update({ id, status }) {
    const [rows] = await pool.query(
      "UPDATE connects SET status = ? WHERE connection_id = ?",
      [status, id]
    );
    return rows.affectedRows > 0;
  }

  static async updateByUsers({
    status,
    connection_sender_id,
    connection_recover_id,
  }) {
    const [rows] = await pool.query(
      "UPDATE connects SET status = ? WHERE connection_senderid = ? AND connection_recoverid = ?",
      [status, connection_sender_id, connection_recover_id]
    );
    return rows.affectedRows > 0;
  }

  static async findAllConnects(user_id) {
    const [rows] = await pool.query(
      `SELECT CASE WHEN connection_senderid = ${user_id} THEN connection_recoverid ELSE connection_senderid END AS connected_user_id FROM connects WHERE (connection_senderid = ${user_id} OR connection_recoverid = ${user_id}) AND status = "accepted";`
    );

    return rows || null;
  }

  static async findAllConnectsRequest(user_id) {
    const [rows] = await pool.query(
      "SELECT connection_id, connection_senderid FROM connects WHERE status = 'pending' AND connection_recoverid = ?;",
      [user_id]
    );

    return rows || null;
  }
}

module.exports = Connections;
