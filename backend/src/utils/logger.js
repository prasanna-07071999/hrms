const Log = require("../models/log");

const createLog = async ({ req, event, status}) => {
  try {
    const user = req.user || {};
    await Log.create({
        organisationId: user.organisationId || null,
        userId: user.id || null,
        action:`${req.method} ${req.originalUrl}`,
        event,
        status,
        ip: req.headers["x-forwarded-for"] || req.ip.replace("::ffff:", ""),
        timestamp: new Date(),
    });
    
  } catch (err) {
    console.error("Log Error:", err.message);
  }
};

module.exports = { createLog };
