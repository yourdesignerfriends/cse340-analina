const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const favoritesModel = require("../models/favorites-model")

const invCont = {}

/* == Public Views  ==*/

/* Build inventory by classification view */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    // I added this to handle the case where the category has no vehicles.
    if (!data || data.length === 0) {
    let nav = await utilities.getNav()
    return res.render("./inventory/classification", {
        title: "No vehicles found",
        nav,
        grid: "<p class='notice'>No vehicles available in this classification.</p>",
    })
    }

    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}
/* Controller function, which is part of the inventory controller */
invCont.buildDetailView = async function (req, res, next) {
    try {
        const vehicleId = req.params.inv_id
        const vehicleData = await invModel.getInventoryById(vehicleId)
        const selectedVehicle = vehicleData[0]

        const navigationMenu = await utilities.getNav()
        
        // ⭐ check if logged in AND if vehicle is favorite
        let isFavorite = false
        if (res.locals.loggedin) {
            const account_id = res.locals.accountData.account_id
            isFavorite = await favoritesModel.checkFavorite(account_id, vehicleId)
        }

        const vehicleDetailHTML = await utilities.buildDetailHTML(selectedVehicle, isFavorite)

        res.render("./inventory/detail", {
            title: `${selectedVehicle.inv_make} ${selectedVehicle.inv_model}`,
            nav: navigationMenu,
            detailHTML: vehicleDetailHTML
        })
    }   catch (error) {
        next(error)
    }
}

/* == Administrative Views  === */

/* Deliver Inventory Management View (views/inventory/management.ejs) */
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()

    res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        classificationSelect,
        errors: null,
        message: req.flash("notice")[0] || null 
    })
  } catch (error) {
    next(error)
  }
}
/* Return Inventory by Classification As JSON (public/js/inventory.js) */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

/* Deliver Add Classification View (views/inventory/add-classification.ejs) */
invCont.buildAddClassification = async function (req, res, next) {
    try {
        const nav = await utilities.getNav()

        res.render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
            classification_name: ""
        })
    }   catch (error) {
        next(error)
    }
}
/* Process Add Classification (views/inventory/add-classification.ejs) */
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

/* Deliver Add Inventory View (views/inventory/add-inventory.ejs) */
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
/* Process Add Inventory view (views/inventory/add-inventory.ejs) */
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

/* Build Delete Inventory Confirmation View (views/inventory/delete-confirm.ejs) */
invCont.buildDeleteInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    const item = itemData[0]
    const deleteForm = utilities.buildDeleteInventoryForm(item)
    const itemName = `${item.inv_make} ${item.inv_model}`

    res.render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      message: req.flash("notice"),
      deleteForm
    })
  } catch (error) {
    next(error)
  }
}
/* Process Delete Inventory Confirmation View (views/inventory/delete-confirm.ejs) */
invCont.deleteInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)
    const deleteResult = await invModel.deleteInventory(inv_id)

    if (deleteResult) {
      req.flash("notice", "The vehicle was successfully deleted.")
      return res.redirect("/inv/")
    }

    req.flash("notice", "Sorry, the delete failed.")
    return res.redirect(`/inv/delete/${inv_id}`)

  } catch (error) {
    next(error)
  }
}

/* Build Edit Inventory View (views/inventory/edit-inventory.ejs) */
invCont.buildEditInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)

    let nav = await utilities.getNav()

    const itemData = await invModel.getInventoryById(inv_id)
    const item = itemData[0]
    const classificationSelect = await utilities.buildClassificationList(item.classification_id)
    const editForm = utilities.buildEditInventoryForm(item, classificationSelect)
    const itemName = `${item.inv_make} ${item.inv_model}`

    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      errors: null,
      editForm
    })
  } catch (error) {
    next(error)
  }
}

/* Update Inventory Data */
invCont.updateInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()

    const {
        inv_id,
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

    // Attempt update
    const updateResult = await invModel.updateInventory(
        inv_id,
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

    if (updateResult) {
        const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`
        req.flash("notice", `The ${itemName} was successfully updated.`)
        return res.redirect("/inv/")
    }

    // If update failed:
    const classificationList = await utilities.buildClassificationList(classification_id)
    const inventoryForm = utilities.buildEditInventoryForm(req.body, classificationList)
    const itemName = `${inv_make} ${inv_model}`

    req.flash("notice", "Sorry, the update failed.")
    return res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        errors: null,
        message: null,
        inventoryForm,
        inv_id
    })

  } catch (error) {
    next(error)
  }
}

module.exports = invCont