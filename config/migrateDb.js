// Library Imports
const mongoose = require("mongoose");

// Model Imports
const User = require("../models/userModel");
const CA = require("../models/caModel");

// Import environment variables
const dotenv = require("dotenv");
dotenv.config();

let connected = false

const connectDb = async () => {
    if (connected === false) {
        try {
            const connect = await mongoose.connect(process.env.URI);
            console.log("\nMongoDb Connected: ", connect.connection.name);
            connected = true
            return true;
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
    } else { return true }
};

const populate = async () => {
    if (await connectDb()) {
        var userMap = {};
        var caMap = {};

        const users = await User.find({}, (err, users) => {
            users.forEach((user) => {
            userMap[user._id] = user;
        });
        })

        const cas = await CA.find({}, (err, cas) => {
            cas.forEach((ca) => {
            caMap[ca._id] = ca;
        });

        console.log(userMap);
        console.log(caMap);
        console.log(users);
        console.log(cas);
    })
    } else { process.exit(1) }
}

populate();