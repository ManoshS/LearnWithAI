const pool = require("../config/database");
const connections = require("../models/Connections");
exports.add = async (req, res) => {
  const { connection_sender_id, connection_recover_id } = req.body;

  try {
    if (!connection_recover_id && !connection_sender_id) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = await connections.create({
      connection_sender_id,
      connection_recover_id,
    });
    console.log(user);
    res.status(201).json({ Update_Status: "OK" });
  } catch (error) {
    res.status(500).json({ err: err.message });
  }
};

exports.update = async (req, res) => {
  const { status, connection_sender_id, connection_recover_id } = req.body;
  try {
    const data = await connections.updata({
      status,
      connection_sender_id,
      connection_recover_id,
    });
    res.status(201).json({ Update_Status: "OK" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
exports.findAllConnects = async (req, res) => {
  try {
    const data = await connections.findAllConnects(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "No connections found" });
    }
    console.log("Found connections:", data);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error finding connections:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.findAllConnectsRequest = async (req, res) => {
  try {
    const data = await connections.findAllConnectsRequest(req.params.id);

    if (!data) {
      return res.status(404).json({ "message ": "Not found" });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

exports.acceptConnection = async (req, res) => {
  try {
    const connectionId = req.params.id;
    const data = await connections.update({
      id: connectionId,
      status: "accepted",
    });

    if (!data) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    res
      .status(200)
      .json({ message: "Connection request accepted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.rejectConnection = async (req, res) => {
  try {
    const connectionId = req.params.id;
    const data = await connections.update({
      id: connectionId,
      status: "rejected",
    });

    if (!data) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    res
      .status(200)
      .json({ message: "Connection request rejected successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
