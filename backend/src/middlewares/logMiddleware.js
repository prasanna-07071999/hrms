const { createLog } = require("../utils/logger");

const logMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const method = req.method;
    let event = "REQUEST HANDLED";
    if (method === "POST") event = "CREATE";
    else if (method === "PUT" || method === "PATCH") event = "UPDATE";
    else if (method === "DELETE") event = "DELETE";
    else if (method === "GET") event = "READ";

    createLog({
      req,
      status: res.statusCode,
      event
    });
  });

  next();
};

module.exports = { logMiddleware };


