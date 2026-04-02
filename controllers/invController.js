const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* =========================  Public Inventory Views  ========================= */

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

/* ======================  Administrative Inventory Views  ====================== */

/* ***************************
*  Deliver Management View
* ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    const managementHTML = utilities.buildManagementHTML()

    res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        managementHTML,
        classificationSelect,
        errors: null,
        message: req.flash("notice") 
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
*  Deliver Add Classification View
* ************************** */
invCont.buildAddClassification = async function (req, res, next) {
    try {
        const nav = await utilities.getNav()
        const classificationForm = utilities.buildAddClassificationForm()

        res.render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            classificationForm,
            errors: null
        })
    }   catch (error) {
        next(error)
    }
}

/* ***************************
*  Process Add Classification
* ************************** */
invCont.addClassification = async function (req, res, next) {
    try {
        const { classification_name } = req.body
        const result = await invModel.addClassification(classification_name)

        if (result) {
            req.flash("notice", `Classification "${classification_name}" added successfully.`)
            res.redirect("/inv/")
        } else {
            req.flash("notice", "Failed to add classification.")
            res.redirect("/inv/add-classification")
        }
    } catch (error) {
        next(error)
    }
}

/* ***************************
 *  Deliver Add Inventory View
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
    try {
        const nav = await utilities.getNav()

        const classificationList = await utilities.buildClassificationList()

        const inventoryForm = utilities.buildAddInventoryForm({}, classificationList)

        res.render("inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            errors: null,
            message: null,
            inventoryForm
        })
    }   catch (error) {
            next(error)
    }
}

/* ***************************
 *  Process Add Inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
    try {
        const {
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        } = req.body

        // Insert into database
        const result = await invModel.addInventory(
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        )

        if (result) {
            req.flash("notice", `${inv_make} ${inv_model} added successfully.`)
            res.redirect("/inv/")
        } else {
            req.flash("notice", "Failed to add inventory item.")
            res.redirect("/inv/add-inventory")
        }
    } catch (error) {
        next(error)
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

module.exports = invCont