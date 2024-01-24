// Library Imports
const express = require("express");
const cookies = require("cookie-parser");
const app = express();
const cors = require("cors");
const path = require("path");

// User Imports
const connectDb = require("./config/dbConnect");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
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
app.use(cookies());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use((req, res, next) => {
  console.log("\nNew Request Made :");
  console.log("Host : ", req.hostname);
  console.log("Path : ", req.path);
  console.log("Method : ", req.method);
  if (Object.keys(req.body).length !== 0) {
    console.log("Body: ", req.body);
  }
  if (Object.keys(req.query).length !== 0) {
    console.log("Query: ", req.query);
  }
  if (Object.keys(req.params).length !== 0) {
    console.log("Params: ", req.params);
  }
  next();
});

// Using defined routes for handling various API endpoints
app.use(userRoutes);
app.use(adminRoutes);

// Testing payments
app.use(express.static(path.join(__dirname, "to-be-implemented")));

// Attach error handling middleware
app.use(errorHandler);
