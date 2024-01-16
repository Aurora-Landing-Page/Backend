// Library Imports
const express = require("express");
const router = express.Router();

// User Imports
const eventController = require("../controllers/eventController")
const userController = require("../controllers/userController")
const { requireAdmin } = require("../middlewares/requireAuth")

// A small set of admin accounts will be pre-generated and shared with trusted individuals
// Ultra Protected Routes (available only to the admins)
router.post("/addIndividual", requireAdmin, eventController.addIndividual);
router.post("/addGroup", requireAdmin, eventController.addGroup);
router.get("/getParticipants", requireAdmin, eventController.getParticipants);
router.get("/verify", requireAdmin, eventController.verify);
router.post("/attended", requireAdmin, eventController.hasAttended);

// Exporting Router
module.exports = router;