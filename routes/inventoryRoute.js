// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to deliver the Management View (Task 1)
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route as part of the inventory route file
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildDetailView));

module.exports = router;