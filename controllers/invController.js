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

/* ***************************
 *  Build Edit Inventory View
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)

    // Navigation
    let nav = await utilities.getNav()

    // Get the inventory item data
    const itemData = await invModel.getInventoryById(inv_id)
    const item = itemData[0]

    // Build classification select list with the current classification selected
    const classificationSelect = await utilities.buildClassificationList(item.classification_id)

    // Build the edit form HTML using your new utility function
    const editForm = utilities.buildEditInventoryForm(item, classificationSelect)

    // Build the item name for the title
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

/* ***************************
 *  Update Inventory Data
 * ************************** */
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

/* ***************************
 *  Build Delete Inventory Confirmation View
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)

    // Navigation
    const nav = await utilities.getNav()

    // Get the inventory item data
    const itemData = await invModel.getInventoryById(inv_id)
    const item = itemData[0]

    // Build the delete form HTML
    const deleteForm = utilities.buildDeleteInventoryForm(item)

    // Build the item name for the title
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

/* ***************************
 *  Process Inventory Delete
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)

    // Attempt delete
    const deleteResult = await invModel.deleteInventory(inv_id)

    if (deleteResult) {
      req.flash("notice", "The vehicle was successfully deleted.")
      return res.redirect("/inv/")
    }

    // If delete failed:
    req.flash("notice", "Sorry, the delete failed.")
    return res.redirect(`/inv/delete/${inv_id}`)

  } catch (error) {
    next(error)
  }
}

module.exports = invCont