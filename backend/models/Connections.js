const pool = require("../config/database");

class Connections {
  static async create({ connection_sender_id, connection_recover_id }) {
    // 1. Check if a connection already exists between the two users
    const [existingConnections] = await pool.query(
      `SELECT status FROM connects 
           WHERE (connection_senderid = ? AND connection_recoverid = ?)
              OR (connection_senderid = ? AND connection_recoverid = ?)`,
      [
        connection_sender_id,
        connection_recover_id,
        connection_recover_id,
        connection_sender_id,
      ]
    );

    // 2. If any connection exists that is 'pending' or 'accepted', reject creation
    if (existingConnections.length > 0) {
      for (const connection of existingConnections) {
        if (
          connection.status === "pending" ||
          connection.status === "accepted"
        ) {
          // A valid connection already exists
          return null;
        }
      }
      // If all previous connections are 'rejected', allow creating new one
    }

    // 3. Insert a new connection
    const [result] = await pool.query(
      `INSERT INTO connects (connection_senderid, connection_recoverid, status) 
           VALUES (?, ?, ?)`,
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
      `SELECT connection_senderid, connection_recoverid, status 
       FROM connects 
       WHERE (connection_senderid = ? OR connection_recoverid = ?) 
         AND (status = "accepted" OR status = "pending");`,
      [user_id, user_id]
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
