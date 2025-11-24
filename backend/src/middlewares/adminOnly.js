module.exports = function adminOnly(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        next();
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
