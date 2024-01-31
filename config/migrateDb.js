// Library Imports
const mongoose = require("mongoose");

// Model Imports
const User = require("../models/userModel");
const CA = require("../models/caModel");

// Import environment variables
const dotenv = require("dotenv");
dotenv.config();

const db1 = "";
const db2 = "";
let connected1 = false;
let connected2 = false;

const connectDb1 = async () => {
    if (connected1 === false) {
        try {
            const connection1 = await mongoose.connect(db1);
            console.log("\nMongoDb Connected: ", connection1.connection.name);
            connected1 = true
            return true;
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
    } else { return true }
};

const connectDb2 = async () => {
    if (connected2 === false) {
        try {
            const connection2 = await mongoose.connect(db2);
            console.log("\nMongoDb Connected: ", connection2.connection.name);
            connected2 = true
            return true;
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
    } else { return true }
};


async function main() {
    await connectDb1();
    await connectDb2();
    
    await User.find({}, function(err, users) {
        if (err) {
           console.error('Failed to retrieve users', err);
           return;
        }
        
        console.log(users);
        // const destinationUsers = mongoose.model('DestinationUser', userSchema, 'users');
        // destinationUsers.insertMany(users, function(err, result) {
        //    if (err) {
        //      console.error('Failed to insert users', err);
        //      return;
        //    }
        //    console.log('Inserted users into Destination Database');
        // });
    });
}

main()
.catch((err) => {
    console.error(err);
    process.exit(1);
})
.then(() => {
    console.log("Done");
    process.exit(0);
});