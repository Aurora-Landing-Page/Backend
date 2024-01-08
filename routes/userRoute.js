// Imported Required Framework And Module and created Express Router Instance
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const emailController = require("../controllers/emailController");
const requireAuth = require("../middlewares/requireAuth");

router.post("/mail", emailController.sendSignupMail);
router.post("/register", userController.registerUser);
router.post("/ca", userController.registerCa);
router.post("/loginCa", userController.loginCa);
router.post("/loginUser", userController.loginUser);
router.post("/logout", userController.logout);
router.post("/forgotPassword", userController.forgotPass);

// To get all the users who have signed up using the CA's referral code
router.get("/getCaData", requireAuth, userController.getCaData);

// Exporting Router
module.exports = router;
