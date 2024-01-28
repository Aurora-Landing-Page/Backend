// Library Imports
const mongoose = require("mongoose");

// Model Imports
const event = require("../models/event")

// Import environment variables
const dotenv = require("dotenv");
dotenv.config();

const individualList = []

const grouplList = []

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
        individualList.forEach(async (element) => {
            const newEvent = new event({
                name: element.name,
                fee: element.fee
            })

            await newEvent.save();
            console.log(newEvent);
        })

        grouplList.forEach(async (element) => {
            const newEvent = new event({
                name: element.name,
                fee: element.fee,
                isGroup: true
            })

            await newEvent.save();
            console.log(newEvent);
        })
    } else { process.exit(1) }
}

populate();