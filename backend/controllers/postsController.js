const posts = require("../models/Posts");
exports.create = async (req, res) => {
  const { user_id, content } = req.body;

  try {
    if (!user_id || !content) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const post = await posts.create({ user_id, content });

    res.status(201).json({ Update_Status: "OK", post });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

exports.update = async (req, res) => {
  const { user_id, content, newContent } = req.body;
  try {
    const data = await posts.updata({ user_id, content, newContent });
    res.status(201).json({ Update_Status: "OK" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

exports.delete = async (req, res) => {
  const { user_id, content } = req.body;
  try {
    const data = await posts.delete({ user_id, content });
    res.status(201).json({ Status: "DELETED" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
exports.findAllPosts = async (req, res) => {
  try {
    const data = await posts.findAllPosts(req.params.id);
    if (!data) {
      return res.status(404).json({ "message ": "Not found" });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
