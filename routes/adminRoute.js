// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const adminController = require("../controllers/adminController")

/* *******************************
* Route that delivers the Favorite Stats view (Admin only)
******************************* */
router.get(
    "/favorite-stats",
    utilities.checkLogin,
    utilities.handleErrors(adminController.buildFavoriteStats)
)

module.exports = router