const Log = require("../models/log");

const createLog = async ({ req, action, status = 200, meta = {} }) => {
    try {
        const user = req.user || {};

        await Log.create({
            organisationId: user.organisationId || null,  
            userId: user.id || null,                      
            action,
            route: req.originalUrl,
            method: req.method,
            status,
            ip: req.ip,
            userAgent: req.headers["user-agent"] || "",    
            meta
        });
    } catch (err) {
        console.error("Log Error:", err.message);
    }
};

module.exports = { createLog };
