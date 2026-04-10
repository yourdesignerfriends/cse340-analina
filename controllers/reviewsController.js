/* ********************************************
 *  Reviews Controller
 *  I created this controller to handle writing
 *  reviews for vehicles. I validate the input,
 *  save the review, and return the correct view.
 ******************************************** */

const reviewsModel = require("../models/reviews-model")
const utilities = require("../utilities/")
const { validationResult } = require("express-validator")

/* *****************************
 *  Build Add Review View (GET)
 *  I load the form so the user
 *  can write a new review.
 *************************** */
async function buildAddReviewView(req, res) {
  const inv_id = req.query.inv_id
  let nav = await utilities.getNav()

  return res.render("reviews/add-review", {
    title: "Write a Review",
    nav,
    errors: null,
    locals: { inv_id, review: "" }
  })
}

/* *****************************
 *  Add a Review (POST)
 *  I validate the input, save
 *  the review, and show a
 *  confirmation view.
 *************************** */
async function addReview(req, res) {
  const errors = validationResult(req)
  const { inv_id, review } = req.body
  const account_id = res.locals.accountData?.account_id
  let nav = await utilities.getNav()

  // If validation fails, I return the form with errors
  if (!errors.isEmpty()) {
    return res.render("reviews/add-review", {
      title: "Write a Review",
      nav,
      errors,
      locals: { inv_id, review }
    })
  }

  try {
    // I save the review in the database
    await reviewsModel.addReview(account_id, inv_id, review)

    req.flash("notice", "Your review was saved.")

    // I show the confirmation view
    return res.render("reviews/confirm-review", {
      title: "Review Submitted",
      nav,
      inv_id
    })

  } catch (error) {
    console.error("addReview controller error:", error)
    req.flash("notice", "Sorry, something went wrong saving your review.")

    // I return the form again if something fails
    return res.render("reviews/add-review", {
      title: "Write a Review",
      nav,
      errors: null,
      locals: { inv_id, review }
    })
  }
}

/* *****************************
 *  Build My Reviews View (GET)
 *  I load a simple list showing
 *  all the reviews written by
 *  the logged-in user.
 *************************** */
async function buildMyReviews(req, res) {
  const account_id = res.locals.accountData.account_id
  let nav = await utilities.getNav()

  try {
    // I get all reviews written by this user
    const reviews = await reviewsModel.getReviewsByAccount(account_id)

    // I return the view with the list of reviews
    return res.render("reviews/view-my-reviews", {
      title: "View My Reviews",
      nav,
      reviews,
      errors: null 
    })

  } catch (error) {
    console.error("buildMyReviews controller error:", error)
    req.flash("notice", "Sorry, something went wrong loading your reviews.")

    return res.render("reviews/view-my-reviews", {
      title: "View My Reviews",
      nav,
      reviews: [],
      errors: null
    })
  }
}

module.exports = { buildAddReviewView, addReview, buildMyReviews }