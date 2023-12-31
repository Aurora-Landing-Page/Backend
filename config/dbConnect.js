// Required Librarys Imported
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Brings Environment Variable form .env file into Runtime Environment
dotenv.config();

// Asynchronous function to Connect Database
const connectDb = async () => {
  try {
    // Attempt to connect MongoDB using Mongoose
    const connect = await mongoose.connect(process.env.URI);

    // If connection is sucessful, log connection details
    console.log(
      "\nMongoDb Connected: ",
      connect.connection.name // Name of Database
    );
    return true;
  } catch (err) {
    // In case of Error 
    console.log(err);
    return false;
    // process.exit(1);
  }
};

// Export connectDb function
module.exports = connectDb;
