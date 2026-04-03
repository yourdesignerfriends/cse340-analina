const utilities = require("../utilities/")
    const { body, validationResult } = require("express-validator")
    const validate = {}
    const accountModel = require("../models/account-model")

/*  **********************************
*  Registration Data Validation Rules
* ********************************* */
validate.registationRules = () => {
    return [
        // firstname is required and must be string
            body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.
  
        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.
  
        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists){
                throw new Error("Email exists. Please log in or use different email")
                }
            }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    // Best practice: the client must re-enter the password.
    // The password value is NOT returned to the view for security reasons.
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* ******************************
 * Login form validation: checks email format and required password
 * ***************************** */
validate.loginRules = () => {
    return [
        body("account_email")
            .trim()
            .isEmail()
            .withMessage("Please provide a valid email."),

        body("account_password")
            .trim()
            .notEmpty()
            .withMessage("Please provide a password.")
    ]
}

/* ******************************
 * Validate login credentials and re-render view if errors exist
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        return res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email
        })
    }
    next()
}

/* ******************************
* Update Account Validation Rules
* ***************************** */
validate.updateAccountRules = () => {
    return [
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("First name is required."),

        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Last name is required."),

        body("account_email")
            .trim()
            .isEmail()
            .withMessage("A valid email is required.")
    ]
}

/* ******************************
* Check Update Account Data
* ***************************** */
validate.checkUpdateAccountData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        return res.render("account/update-account", {
            title: "Update Account Information",
            nav,
            errors,
            accountData: req.body
        })
    }
    next()
}

/* ******************************
* Update Password Validation Rules
* ***************************** */
validate.updatePasswordRules = () => {
return [
    body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })
        .withMessage("Password does not meet requirements.")
    ]
}

/* ******************************
* Check Update Password Data
* ***************************** */
validate.checkUpdatePasswordData = async (req, res, next) => {
const errors = validationResult(req)
if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        return res.render("account/update-account", {
            title: "Update Account Information",
            nav,
            errors,
            accountData: req.body
        })
    }
    next()
}

module.exports = validate