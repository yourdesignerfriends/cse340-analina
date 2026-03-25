// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

// Route that handles GET requests for the login page
router.get("/login", utilities.handleErrors(accountController.buildLogin))

module.exports = router