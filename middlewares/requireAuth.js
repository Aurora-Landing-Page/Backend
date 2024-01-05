const {NotFoundError, UserError, ServerError} = require("../utils/errors")
const jwt = require("jsonwebtoken");

// Import environment variables
const dotenv = require("dotenv");
const { User } = require("../models/userModel");
dotenv.config();

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, _) => {
            if (err) { next(new UserError("Invalid JWT", 403)) } 
            else { next() }
        })
    } else { next(new UserError("JWT does not exist, please login using your credentials first", 403)) }
};

const requireAdmin = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) { next(new UserError("Invalid JWT", 403)) } 
            else {
                const userDoc = await User.findById(decoded.id)
                if (userDoc.isAdmin) { next() }
                else { next(new UserError("Invalid credentials", 403)) }
            }
        })
    } else { next(new UserError("JWT does not exist, please login using your credentials first", 403)) }
}

module.exports = { requireAuth, requireAdmin };