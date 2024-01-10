// Library Imports
const express = require("express");
const router = express.Router();

// USer Imports
const userController = require("../controllers/userController")
const eventController = require("../controllers/eventController")
const emailController = require("../controllers/emailController")

const { requireAuth, requireAdmin } = require("../middlewares/requireAuth")

// Routes open to the public
router.post("/registerUser",userController.registerUser);
router.post("/registerCA", userController.registerCa);
router.post("/loginUser", userController.loginUser);
router.post("/loginCa", userController.loginCa);
router.post("/logout", userController.logout);
router.post("/forgotPassword", userController.forgotPass);
router.post("/contactUs", userController.contactUs);

// Protected Routes (available to registered users / admins / CAs)
// router.get("/getUserData", requireAuth, userController.getUserData);
// router.get("/getCaData", requireAuth, userController.getCaData);
// router.get("/generateTicket", requireAuth, userController.generateQR);
// router.post("/participateIndividual", requireAuth, eventController.participateIndividual);
// router.post("/participateGroup", requireAuth, eventController.participateGroup);
// router.post("/purchase", requireAuth, eventController.createPurchaseIntent);
// router.post("/verifyPurchase", requireAuth, eventController.verifyPurchase);

// Exporting Router
module.exports = router;
