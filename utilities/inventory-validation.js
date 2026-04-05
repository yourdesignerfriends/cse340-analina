const { body, validationResult } = require("express-validator")
const utilities = require(".")
const invController = require("../controllers/invController")

const invValidate = {}

// Validation rules for classification name
invValidate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .isAlpha()
        .withMessage("Classification must contain only letters.")
        .isLength({ min: 3, max: 25 })
        .withMessage("Classification must be 3-25 characters long.")
    ]
}

// Check for validation errors
invValidate.checkClassificationData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const nav = await utilities.getNav()
        return res.render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors,
            classification_name: req.body.classification_name
        })
    }
    next()
}

/* ***************************
 * Inventory Validation Rules
 * ************************** */
invValidate.inventoryRules = () => {
    return [
        body("classification_id")
            .trim()
            .isInt({ min: 1 })
            .withMessage("Please choose a classification."),

        body("inv_make")
            .trim()
            .matches(/^[A-Za-z ]{3,}$/)
            .withMessage("Make must be at least 3 alphabetic characters."),

        body("inv_model")
            .trim()
            .matches(/^[A-Za-z ]{3,}$/)
            .withMessage("Model must be at least 3 alphabetic characters."),

        body("inv_description")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a description."),

        body("inv_image")
            .trim()
            .matches(/^\/images\/vehicles\/.+/)
            .withMessage("Image path must start with /images/vehicles/"),

        body("inv_thumbnail")
            .trim()
            .matches(/^\/images\/vehicles\/.+/)
            .withMessage("Thumbnail path must start with /images/vehicles/"),

        body("inv_price")
            .trim()
            .matches(/^[0-9]{1,9}$/)
            .withMessage("Price must be 1-9 digits."),

        body("inv_year")
            .trim()
            .matches(/^[0-9]{4}$/)
            .withMessage("Year must be exactly 4 digits."),

        body("inv_miles")
            .trim()
            .matches(/^[0-9]+$/)
            .withMessage("Miles must contain digits only."),

        body("inv_color")
            .trim()
            .matches(/^[A-Za-z ]+$/)
            .withMessage("Color must contain letters and spaces only.")
    ]
}

/* ***************************
 * Check inventory data
 * ************************** */
invValidate.checkInventoryData = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList(req.body.classification_id)
        const inventoryForm = utilities.buildAddInventoryForm(req.body, classificationList)

        return res.render("inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            errors,
            message: null,
            inventoryForm
        })
    }
    next()
}

/* ***************************
 * Check update inventory data
 * ************************** */
invValidate.checkUpdateData = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const nav = await utilities.getNav()
        const inv_id = req.body.inv_id
        const classificationList = await utilities.buildClassificationList(req.body.classification_id)
        const inventoryForm = utilities.buildEditInventoryForm(req.body, classificationList)

        return res.render("inventory/edit-inventory", {
        title: `Edit ${req.body.inv_make} ${req.body.inv_model}`,
            nav,
            errors,
            message: null,
            inventoryForm,
            inv_id
        })
    }
    next()
}

module.exports = invValidate