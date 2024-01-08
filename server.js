// Library Imports
const express = require("express");
const cookies = require("cookie-parser");
const app = express();
const cors = require("cors");

// User Imports
const connectDb = require("./config/dbConnect");
const userRoutes = require("./routes/userRoute");
const errorHandler = require("./middlewares/errorHandler");

// Import environment variables
require("dotenv").config();

const port = process.env.PORT || 3000;

const startServer = async () => {
  if (await connectDb()) {
    try {
      // Start the Express server and listen on the defined port
      app.listen(port, () => {
        console.log(
          `\nSuccessfully Connected to Database...\nListening to Requests at Port: ${port}\nServer Started...`
        );
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("Server Error");
  }
};

// Start Server
startServer();

// Configuring middleware
app.use(cors());
app.use(express.json());
app.use(cookies());
app.use((req, res, next) => {
  console.log("\nNew Request Made :");
  console.log("Host : ", req.hostname);
  console.log("Path : ", req.path);
  console.log("Method : ", req.method);
  next();
});

// Using defined routes for handling various API endpoints
app.use(userRoutes);

// Attach error handling middleware
app.use(errorHandler);
