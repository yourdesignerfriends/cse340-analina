const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* Deliver login view (views/account/login.ejs) */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}
/* Process login request (views/account/login.ejs) */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  // Normalize the email to ensure consistent lookup in the database
  let { account_email, account_password } = req.body
  account_email = account_email.toLowerCase().trim()

  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "The email or password you entered is incorrect.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "The email or password you entered is incorrect.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* Deliver registration view (views/account/register.ejs) */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}
/* Process Registration (views/account/register.ejs) */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()

  // Normalize the email to ensure consistent storage and comparison in the database
  let { account_firstname, account_lastname, account_email, account_password } = req.body
  account_email = account_email.toLowerCase().trim()

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* Deliver Account Management view (views/account/account-management.ejs) */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()

  const accountData = res.locals.accountData
  const accountType = accountData.account_type
  const accountId = accountData.account_id

  res.render("account/account-management", {
    title: "Account Management",
    accountData,
    accountType,
    accountId,
    nav,
    errors: null
  })
}

/* Deliver Update Account view (views/account/update-account.ejs) */
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()

  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountById(account_id)

  res.render("account/update-account", {
    title: "Update Account Information",
    nav,
    errors: null,
    accountData
  })
}
/* Process Account Update (views/account/update-account.ejs) */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateResult) {
    // I fetch the updated account data from the database
    const updatedAccount = await accountModel.getAccountById(account_id)

    // I remove the password for security (it should never be stored in the session)
    delete updatedAccount.account_password

    // I generate a new JWT with the updated account data
    const newToken = jwt.sign(updatedAccount, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })

    // I replace the old cookie with the new one
    res.cookie("jwt", newToken, { httpOnly: true, maxAge: 3600 * 1000 })

    // I update the session with the new account information
    res.locals.accountData = updatedAccount

    req.flash("notice", "Account information updated successfully.")
    return res.redirect("/account/")
  }
  req.flash("notice", "Update failed.")
  res.render("account/update-account", {
    title: "Update Account Information",
    nav,
    errors: null,
    accountData: req.body
  })
}

/* Process Password Update ((views/account/update-account.ejs) */
async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  const hashedPassword = await bcrypt.hash(account_password, 10)

  const updateResult = await accountModel.updatePassword(
    hashedPassword,
    account_id
  )

  if (updateResult) {
    req.flash("notice", "Password updated successfully.")
    return res.redirect("/account/")
  }

  console.log("FLASH PASSWORD FAIL:", "Password update failed.")
  req.flash("notice", "Password update failed.")

  res.render("account/update-account", {
    title: "Update Account Information",
    nav,
    errors: null,
    accountData: req.body
  })
}

/* Logout Process */
async function logout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  return res.redirect("/")
}

module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildAccountManagement, 
  buildUpdateAccount, 
  updateAccount, 
  updatePassword, 
  logout 
}