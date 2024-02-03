const mongoose = require("mongoose");
const { PhysicalUser } = require("../../models/physicalUserModel");

const dotenv = require("dotenv");
dotenv.config();

let connected = false;
const connectDb = async () => {
  if (connected === false) {
    try {
      const connect = await mongoose.connect(process.env.URI);
      console.log("\nMongoDb Connected: ", connect.connection.name);
      connected = true;
      return true;
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  } else {
    return true;
  }
};

async function main() {
  try {
    await connectDb();

    try {
      const physicalUsers = await PhysicalUser.find({});
      console.log(physicalUsers);
    } catch (error) {
      console.error(error);
      console.error("Error occurred fetching users, skipping...");
    }

    console.log("Done");
    process.exit(0);
  } catch (error) {
    console.error(error);
    console.error("Error Occurred, Aborting...");
    process.exit(0);
  }
}

main();