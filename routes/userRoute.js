// Imported Required Framework And Module and created Express Router Instance
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")

// All User Routes
router.post("/register",userController.registerUser);


// Exporting Router
module.exports = router;
