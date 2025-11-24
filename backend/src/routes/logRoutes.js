const express = require("express");
const router = express.Router();

const Log = require("../models/log");
const User = require("../models/user");
const adminOnly = require("../middlewares/adminOnly");

// GET LOGS (Admin Only)
router.get("/", adminOnly, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const logs = await Log.findAll({
      include: [
        {
          model: User,
          attributes: ["name", "email"]
        }
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset
    });

    res.json({
      success: true,
      count: logs.length,
      logs
    });

  } catch (err) {
    console.error("Error fetching logs", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
