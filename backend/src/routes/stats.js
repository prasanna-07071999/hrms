const express = require("express");
const router = express.Router();

const Employee = require("../models/employee");
const Team = require("../models/team");
const User = require("../models/user");

router.get("/summary", async (req, res) => {
    try {
        const totalEmployees = await Employee.count();
        const totalTeams = await Team.count();
        const totalAdmins = await User.count({ where: { isAdmin: true } });

        res.json({
            totalEmployees,
            totalTeams,
            totalAdmins
        });

    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ message: "Failed to load stats" });
    }
});

module.exports = router;
