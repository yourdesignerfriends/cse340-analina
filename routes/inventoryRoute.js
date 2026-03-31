// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to deliver the Management View (Task 1)
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to deliver the Add Classification View (Task 2)
router.get(
    "/add-classification",
    utilities.handleErrors(invController.buildAddClassification)
)

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route as part of the inventory route file
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildDetailView));

// Route to process the Add Classification form (Task 2 step 3)
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

module.exports = router;