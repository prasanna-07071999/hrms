const express = require("express");
const router = express.Router();

const Log = require("../models/log");
const User = require("../models/user");
const Organisation = require('../models/organisation')
const adminOnly = require("../middlewares/adminOnly");


router.get("/", adminOnly, async (req, res) => {
  try {
    const logs = await Log.findAll({
      include: [
        { model: User, attributes: ["name", "email"] },
        { model: Organisation, attributes: ["name"] }
      ],
      order: [["timestamp", "DESC"]],
    });

    res.json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logs", error: err.message });
  }
});

module.exports = router;
