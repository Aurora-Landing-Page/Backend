// Imported Required Framework And Module and created Express Router Instance
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")
const emailController = require("../controllers/emailController")
// All User Routes
router.post("/register",userController.registerUser);
router.post("/mail", emailController.sendMail);
router.post("/ca", userController.registerCa);

// Exporting Router
module.exports = router;
