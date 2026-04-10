// Needed Resources
const express = require("express")
const router = new express.Router()
const favoritesController = require("../controllers/favoritesController")
const utilities = require("../utilities/")

/* ===== Favorites Routes (User must be logged in) ===== */

// Show all favorites for the logged-in user
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(favoritesController.buildFavorites)
)

// Add a vehicle to favorites
router.post(
  "/add",
  utilities.checkLogin,
  utilities.handleErrors(favoritesController.addFavorite)
)

// Remove a vehicle from favorites
router.post(
  "/remove",
  utilities.checkLogin,
  utilities.handleErrors(favoritesController.removeFavorite)
)

module.exports = router