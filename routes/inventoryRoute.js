// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

/* ===== Administrative Inventory Routes Restricted to Employee / Admin ======= */

// Route to deliver the Management View (Task 1)
router.get(
  "/",
  utilities.checkEmployee, 
  utilities.handleErrors(invController.buildManagement))

// Route to deliver the Add Classification View (Task 2)
router.get(
  "/add-classification",
  utilities.checkEmployee,
  utilities.handleErrors(invController.buildAddClassification)
)
// Route to process the Add Classification form (Task 2 step 3)
router.post(
  "/add-classification",
  utilities.checkEmployee,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to deliver the Add Inventory view (Task 3)
router.get(
  "/add-inventory",
  utilities.checkEmployee,
  utilities.handleErrors(invController.buildAddInventory)
)
// Route to process the Add Inventory form (Task 3 step 3)
router.post(
  "/add-inventory",
  utilities.checkEmployee,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Route used by the management view JavaScript to fetch inventory data by classification_id
router.get(
  "/getInventory/:classification_id",
  utilities.checkEmployee, 
  utilities.handleErrors(invController.getInventoryJSON))

// Route to deliver the Edit Inventory view
router.get(
  "/edit/:inv_id",
  utilities.checkEmployee, 
  utilities.handleErrors(invController.buildEditInventory))

// Route to process the Edit Inventory form
router.post(
  "/update",
  utilities.checkEmployee,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Route to deliver the Delete Confirmation view
router.get(
  "/delete/:inv_id",
  utilities.checkEmployee,
  utilities.handleErrors(invController.buildDeleteInventory)
)
// Route to process the Delete Inventory form
router.post(
  "/delete",
  utilities.checkEmployee,
  utilities.handleErrors(invController.deleteInventory)
)

/* ====== Public Inventory Routes Accessible to all site visitors ======== */

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route as part of the inventory route file
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildDetailView));

module.exports = router;