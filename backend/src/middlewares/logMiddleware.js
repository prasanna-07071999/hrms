const { createLog } = require("../utils/logger");

const logMiddleware = (req, res, next) => {
    res.on("finish", () => {
        createLog({
            req,
            action: req.method + " " + req.originalUrl,
            status: res.statusCode,
            meta: {
                body: req.body,
                params: req.params,
                query: req.query
            }
        });
    });

    next();
};

const logAction = (action) => {
    return (req, res, next) => {
        res.on("finish", () => {
            createLog({
                req,
                action,
                status: res.statusCode,
                meta: {
                    body: req.body,
                    params: req.params,
                    query: req.query
                }
            });
        });

        next();
    };
};

module.exports = { logMiddleware, logAction };
