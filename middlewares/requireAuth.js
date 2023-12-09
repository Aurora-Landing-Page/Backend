const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// Import environment variables
const dotenv = require("dotenv");
dotenv.config();

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, _) => {
            if (err) { res.status(400).json({ "errors": {"message": "Invalid JWT"} }) } 
            else { next() }
        })
    } else { res.status(400).json({ "errors": {"message": "JWT does not exist, please login first"} }) }
};

module.exports = requireAuth;
