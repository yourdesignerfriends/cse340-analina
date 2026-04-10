const utilities = require("../utilities/")
const adminModel = require("../models/admin-model")

/* ****************************************
*  Deliver Favorite Stats view (Admin only)
*  I get the statistics from the VIEW and
*  only allow Admin users to access this page.
**************************************** */
async function buildFavoriteStats(req, res, next) {
  // I get the navigation
  let nav = await utilities.getNav()

  // I get the logged-in user's data
  const accountData = res.locals.accountData
  const accountType = accountData.account_type

  // Only Admin users can access this view
  if (accountType !== "Admin") {
    req.flash("notice", "Access denied. Admins only.")
    return res.redirect("/account/")
  }

  try {
    // I call the model to get the data from the favorite_stats VIEW
    const stats = await adminModel.getFavoriteStats()

    // I render the view with the retrieved data
    res.render("admin/favorite-stats", {
      title: "Favorite Vehicle Statistics",
      nav,
      stats,
      errors: null
    })

  } catch (error) {
    console.error("Error loading favorite stats:", error)

    // If something goes wrong, I send the user back to the account dashboard
    req.flash("notice", "There was an error loading the statistics.")
    return res.redirect("/account/")
  }
}

module.exports = { buildFavoriteStats }