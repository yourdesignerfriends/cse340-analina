const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
*  Controller function, which is part of the inventory controller
* ************************** */
invCont.buildDetailView = async function (req, res, next) {
    try {
        const vehicleId = req.params.inv_id
        const vehicleData = await invModel.getInventoryById(vehicleId)
        const selectedVehicle = vehicleData[0]

        const navigationMenu = await utilities.getNav()
        const vehicleDetailHTML = await utilities.buildDetailHTML(selectedVehicle)

        res.render("./inventory/detail", {
            title: `${selectedVehicle.inv_make} ${selectedVehicle.inv_model}`,
            nav: navigationMenu,
            detailHTML: vehicleDetailHTML
        })
    }   catch (error) {
        next(error)
    }
}

/* ***************************
*  Deliver Management View
* ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const managementHTML = utilities.buildManagementHTML()

    res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        managementHTML,
        errors: null,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = invCont