/* *************************
*  Here I define the route that triggers the
*  intentional error process for testing.
* ************************** */

const express = require("express")
const router = express.Router()
const errorController = require("../controllers/errorController")

/* ************************
*  Route to test the intentional error
* ************************** */
router.get("/test-error", errorController.triggerError)

module.exports = router