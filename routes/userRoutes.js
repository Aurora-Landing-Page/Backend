// Library Imports
const express = require("express");
const multer = require('multer');
const upload = multer({ dest: process.env.UPLOADS_DIR });
const router = express.Router();

// USer Imports
const userController = require("../controllers/userController")
const newPaymentController = require("../controllers/newPaymentController")

const { requireAuth } = require("../middlewares/requireAuth")

// Routes open to the public
router.post("/registerUser",userController.registerUser);
router.post("/registerCA", userController.registerCa);
router.post("/loginUser", userController.loginUser);
router.post("/loginCa", userController.loginCa);
router.post("/logout", userController.logout);
router.post("/forgotPassword", userController.forgotPass);
router.post("/contactUs", userController.contactUs);
router.post("/getPaymentStatus", userController.getUserPaymentStatus);

// Protected Routes (available to registered users / admins / CAs)
router.get("/getUserData", requireAuth, userController.getUserData);
router.get("/getCaData", requireAuth, userController.getCaData);
router.get("/generateTicket", requireAuth, userController.generateQR);
router.post("/sendPhysicalMail", requireAuth, userController.sendPhysicalMail)

// DEPRECATED
// RazorPay Payment Routes
// router.get("/getKey", requireAuth, paymentController.sendKey)
// router.post("/createOrder", requireAuth, paymentController.createPurchaseIntent);
// router.post("/verifyOrder", requireAuth, paymentController.verifyPurchase);

// Manual Payment Routes
router.post("/uploadScreenshot", requireAuth, upload.single('image'), newPaymentController.uploadScreenshot);
router.post("/createPurchase", requireAuth, newPaymentController.createPurchaseIntent);

// Exporting Router
module.exports = router;
