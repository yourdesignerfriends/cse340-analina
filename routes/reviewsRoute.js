/* ********************************************
 *  Reviews Routes
 *  I created this route file to handle the
 *  review actions for vehicles. I protect the
 *  routes and validate the input.
 ******************************************** */

const express = require("express")
const router = new express.Router()
const reviewsController = require("../controllers/reviewsController")
const utilities = require("../utilities/")
const { body } = require("express-validator")

/* *****************************
 *  Write a review (GET)
 *  I load the form so the user
 *  can write a new review.
 *************************** */
router.get(
  "/add",
  utilities.checkLogin,
  reviewsController.buildAddReviewView
)

/* *****************************
 *  Add a review (POST)
 *  I validate the input and save
 *  the review in the database.
 *************************** */
router.post(
  "/add",
  utilities.checkLogin,
  body("review")
    .trim()
    .isLength({ min: 3 }).withMessage("Review must be at least 3 characters.")
    .isLength({ max: 200 }).withMessage("Review must be under 200 characters."),
  reviewsController.addReview
)
/* ********************************************
 *  View My Reviews Route
 *  I created this route so the user can see
 *  all the reviews they have written.
 *  I protect the route so only logged-in users
 *  can access their own reviews.
 ******************************************** */

router.get(
  "/view-my-reviews",
  // Only logged-in users can view their reviews
  utilities.checkLogin, 
  utilities.handleErrors(reviewsController.buildMyReviews)
)

module.exports = router