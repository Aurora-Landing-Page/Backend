const { titles } = require("../utils/constants");
require("dotenv").config();

const successHandler = (obj, res, fields) => {
    // statusCode property is guaranteed to exist due to constructor
    const statusCode = obj.statusCode ? obj.statusCode: 200;

    // JSON response conditionally includes the stack trace if running in a development environment
    if (statusCode in titles) {
        res.status(statusCode).json({
            title: titles[statusCode],
            message: obj.message,
            ...fields
        });
    } else {
        res.status(200).json({
            title: "OK",
            message: "",
        });
    }
};

module.exports = successHandler;
