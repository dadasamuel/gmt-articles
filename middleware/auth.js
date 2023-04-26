const { pool } = require("../database/db");
const jwt = require("jsonwebtoken")


exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.roles === 'admin')
            next();
        else {
            return res.status(401).json("you do not have permission to access..");
        }
    } catch (error) {
        console.error("Error", error);
    }
};

exports.allow = async (req, res, next) => {
    try {
        const { status, roles } = req.user;
        if (status == "Not-Subscribed" && roles == "user") {
            return res.status(401).json({
                message: "payment required",
            });
        } else {
            next();
        }
    } catch (error) {
        console.error("Error", error);
    }
};



exports.isAuthenticated = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        if (!token) return res.status(401).json("Authentication failed: 🔒");

        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

        if (!decoded) return res.status(401).json("Authentication failed: 🔒🔒🔒");

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json("Authentication failed: 🔒🔒🔒🔒🔒");
    }
};