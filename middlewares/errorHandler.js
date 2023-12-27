const { titles } = require("../utils/constants");
require("dotenv").config();

const errorHandler = (error, req, res, next) => {
    // statusCode property is guaranteed to exist due to constructor
    const statusCode = error.statusCode ? error.statusCode : 500;

    // Log server errors
    if (statusCode >= 500) {
        console.error(error.message);
        console.error(error.stack);
    }

    // JSON response conditionally includes the stack trace if running in a development environment
    if (statusCode in titles) {
        res.status(statusCode).json({
            title: titles[statusCode],
            name: error.name,
            message: error.message,
            ...(process.env.NODE_ENV === "development" ? {stackTrace: error.stack} : {})
        });
    } else {
        if (error)
        {
            res.status(statusCode).json({
                title: "Unknown error",
                name: error.name,
                message: "Unknown error occurred",
                ...(process.env.NODE_ENV === "development" ? {stackTrace: error.stack} : {})
            });
        }
        else {
            console.error("Unhandled Exception Occurred");
        }
    }
};

module.exports = errorHandler;
