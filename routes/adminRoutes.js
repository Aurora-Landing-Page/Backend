// Library Imports
const express = require("express");
const router = express.Router();

// User Imports
const eventController = require("../controllers/eventController")
const newPaymentController = require("../controllers/newPaymentController")
const userController = require("../controllers/userController")
const { requireAdmin } = require("../middlewares/requireAuth")

// A small set of admin accounts will be pre-generated and shared with trusted individuals
// Ultra Protected Routes (available only to the admins)
router.post("/addGroup", requireAdmin, eventController.addGroup);
router.post("/addIndividual", requireAdmin, eventController.addIndividual);
router.get("/getParticipants", requireAdmin, eventController.getParticipants);
router.get("/getAllCas", requireAdmin, userController.getAllCas);
router.get("/getReceipt", requireAdmin, eventController.getReceipt);
router.post("/attended", requireAdmin, eventController.hasAttended);
router.get("/verify", requireAdmin, eventController.verify);
router.get("/physicalVerify", requireAdmin, eventController.physicalVerify);

// New Payment System Routes
router.get("/getReceiptDetails", requireAdmin, newPaymentController.getReceipt);
router.post("/approvePayment", requireAdmin, newPaymentController.approvePurchase);
router.post("/denyPayment", requireAdmin, newPaymentController.denyPurchase);
router.get("/getApprovedReceipts", requireAdmin, newPaymentController.getAllApprovedReceipts);
router.get("/getUnapprovedReceipts", requireAdmin, newPaymentController.getAllUnapprovedReceipts);

// Exporting Router
module.exports = router;