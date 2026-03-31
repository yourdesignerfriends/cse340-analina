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
            classificationForm: utilities.buildAddClassificationForm(req.body.classification_name)
        })
    }
    next()
}

module.exports = invValidate