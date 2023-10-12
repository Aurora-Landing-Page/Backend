// Imported Required Frameworks And Modules and created Express App Instance
const express = require("express");
const app = express();
const connectDb = require("./config/dbConnect");
const userRoutes = require("./routes/userRoute");

const errorHandler = require("./middlewares/errorhandlers");

// Imported all Required Middlewares
const cors = require("cors");

// Defined Port for server
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

// Middleware for handling CORS
app.use(cors());

// Middleware for parsing incoming JSON data
app.use(express.json());

// Middleware to log information about incoming requests
app.use((req, res, next) => {
  console.log("\nNew Request Made :");
  console.log("Host : ", req.hostname);
  console.log("Path : ", req.path);
  console.log("Method : ", req.method);
  next();
});

// Using defined routes for handling various API endpoints
app.use(userRoutes);

app.use(errorHandler);
