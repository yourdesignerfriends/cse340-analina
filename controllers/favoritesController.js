/* ********************************************
 *  Favorites Controller
 *  I created this controller as part of my
 *  project enhancement to handle all actions
 *  related to the Favorites feature. This file
 *  manages showing the favorites page, adding
 *  a favorite, and removing one.
 ******************************************** */

const favoritesModel = require("../models/favorites-model")
const utilities = require("../utilities/")

/* *****************************
 *  Build Favorites View
 * *************************** */
async function buildFavorites(req, res) {
    console.log("➡️ Controller reached: buildFavorites()")

    const account_id = res.locals.accountData?.account_id
    console.log("➡️ account_id:", account_id)

    try {
        console.log("➡️ Calling favoritesModel.getUserFavorites()...")
        const favorites = await favoritesModel.getUserFavorites(account_id)
        console.log("➡️ favorites returned:", favorites)

        let nav = await utilities.getNav()

        console.log("➡️ Rendering favorites/favorites view...")
        res.render("favorites/favorites", {
            title: "My Favorites",
            nav,
            favorites,
            errors: null,
            message: req.flash("notice")[0] || null
        })
    } catch (error) {
        console.error("❌ buildFavorites error:", error)
        req.flash("notice", "Sorry, something went wrong loading your favorites.")
        res.redirect("/account/")
    }
}

/* *****************************
 *  Add a Favorite
 * *************************** */
async function addFavorite(req, res) {
    const account_id = res.locals.accountData.account_id
    const { inv_id } = req.body

    try {
        await favoritesModel.addFavorite(account_id, inv_id)
        req.flash("notice", "Vehicle added to your favorites.")
        res.redirect(`/inv/detail/${inv_id}`)
    }   catch (error) {
        console.error("addFavorite error:", error)
        req.flash("notice", "Unable to add this vehicle to favorites.")
        res.redirect(`/inv/detail/${inv_id}`)
    }
}

/* *****************************
 *  Remove a Favorite
 * *************************** */
async function removeFavorite(req, res) {
    const account_id = res.locals.accountData.account_id
    const { inv_id } = req.body

    try {
        await favoritesModel.removeFavorite(account_id, inv_id)
        req.flash("notice", "Vehicle removed from your favorites.")
        res.redirect("/favorites")
    }   catch (error) {
        console.error("removeFavorite error:", error)
        req.flash("notice", "Unable to remove this vehicle.")
        res.redirect("/favorites")
    }
}

module.exports = { buildFavorites, addFavorite, removeFavorite }