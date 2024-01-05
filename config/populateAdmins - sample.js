// Library Imports
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

// Model Imports
const { User } = require("../models/userModel")

// Import environment variables
const dotenv = require("dotenv");
dotenv.config();

const admins = [
    {
        name: "John Doe",
        password: "password",
        email: "john@gmail.com",
        phone: 9999999999,
        isAdmin: true
    }
]

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
        admins.forEach(async (element) => {
            const hashedPassword = bcryptjs.hashSync(element.password, 10);

            const newAdmin = new User({
                name: element.name,
                email: element.email,
                phone: element.phone,
                password: hashedPassword,
                isAdmin: true
            });

            try {
                await newAdmin.save();
                const {password, __v, createdAt, updatedAt, _id, ...otherFields} = newAdmin._doc
                console.log("Admin created successfully: \n", otherFields)
            } catch (err) {
                console.error("Admin could not be created");
                console.error(err)
            }
    })} else { process.exit(1) }
}

populate();