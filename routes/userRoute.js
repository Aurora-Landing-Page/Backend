// Imported Required Framework And Module and created Express Router Instance
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")
const emailController = require("../controllers/emailController")
const requireAuth = require("../middlewares/requireAuth")

router.post("/register",userController.registerUser);
router.post("/ca", userController.registerCa);
router.post("/loginCa", userController.loginCa);
router.post("/loginUser", userController.loginUser);
router.post("/logout", userController.logout);
router.post("/forgotPassword", userController.forgotPass);

router.post("/mail", requireAuth, emailController.sendSignupMail);
router.get("/getCaData", requireAuth, userController.getCaData);

// Exporting Router
module.exports = router;
