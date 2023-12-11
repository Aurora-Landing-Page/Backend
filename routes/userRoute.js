// Imported Required Framework And Module and created Express Router Instance
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")
const emailController = require("../controllers/emailController")
const requireAuth = require("../middlewares/requireAuth")

// All User Routes
router.post("/register",userController.registerUser);
router.post("/mail", emailController.sendMail);
router.post("/ca", userController.registerCa);
router.post("/loginCa", userController.loginCa);
router.post("/logoutCa", userController.logoutCa);

// To get all the users who have signed up using the CA's referral code
router.get("/getCaData", requireAuth, userController.getCaData);

// Exporting Router
module.exports = router;
