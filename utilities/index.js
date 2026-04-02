// External dependencies
const jwt = require("jsonwebtoken")
require("dotenv").config()
// Models
const invModel = require("../models/inventory-model")
// Utilities
const Util = {}

/* =========================  Navigation Builder  ========================= */

/* ************************
 * Build the navigation menu HTML
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* =========================  Public HTML Builders  ========================= */

/* **************************************
* Build the classification grid HTML 
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => { 
            grid += '<li>'
            // Vehicle link + image
            grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
            + '" title="See details for ' + vehicle.inv_make + ' '+ vehicle.inv_model 
            + '"><img src="' + vehicle.inv_thumbnail +'" alt="Image of'+ vehicle.inv_make + ' ' + vehicle.inv_model +'"></a>'
            // Name + price container
            grid += '<div class="namePrice">'
            grid += '<hr>'
            grid += '<h2>'
            // Vehicle title link
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            // Price
            grid += '<span>$' 
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else { 
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* ***************************
* Build the vehicle detail HTML
* Custom function that will take the specific vehicle's information and wrap it up in 
* HTML to deliver to the view, I use backticks (template literals) to build the HTML because it is easier to read.
 * ************************** */
Util.buildDetailHTML = function (vehicle) {
    let detailHTML = `
        <div class="vehicle-detail-layout"> 
            <img class="vehicle-image"
                src="${vehicle.inv_image}" 
                alt="${vehicle.inv_make} ${vehicle.inv_model}">
            <div class="vehicle-text">
                <h2 class="detail-subtitle">
                    ${vehicle.inv_year}
                    ${vehicle.inv_make} 
                    ${vehicle.inv_model}
                    Details
                </h2>
                <div class="vehicle-info">
                    <p class="info-item highlight"><span class="info-label">Price: </span>$${new Intl.NumberFormat().format(vehicle.inv_price)}</p>
                    <p class="info-item"><span class="info-label">Description: </span>${vehicle.inv_description}</p>
                    <p class="info-item"><span class="info-label">Color: </span>${vehicle.inv_color}</p>
                    <p class="info-item"><span class="info-label">Miles: </span>${new Intl.NumberFormat().format(vehicle.inv_miles)}</p>
                </div>
            </div>
        </div>
    `
    return detailHTML
}

/* ======================  Administrative HTML Builders  ====================== */

/* **************************************
* Build the management view HTML
* ************************************ */
Util.buildManagementHTML = function () {
    let html = `
        <ul class="management-links">
            <li><a href="/inv/add-classification">Add New Classification</a></li>
            <li><a href="/inv/add-inventory">Add New Inventory</a></li>
        </ul>
    `
    return html
}

/* **************************************
* Build the add classification form HTML
* ************************************ */
Util.buildAddClassificationForm = function (classification_name = "") {
    let html = `

        <div class="form-container">
            <p class="required-msg">FIELD IS REQUIRED.</p>
            <form action="/inv/add-classification" method="post" class="classification-form">

                <label for="classification_name">Classification Name</label>

                <p class="input-rules">NAME MUST BE 3-25 ALPHABETIC CHARACTERS ONLY.</p>

                <input 
                    type="text" 
                    id="classification_name" 
                    name="classification_name" 
                    required
                    pattern="^[A-Za-z]{3,25}$"
                    title="Only alphabetic characters, 3-25 letters"
                    value="${classification_name}"
                >

                <button type="submit">Add Classification</button>
            </form>
        </div>
    `
    return html
}

/* ****************************************
 * Build the classification select list HTML
 **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
        '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"

    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })

    classificationList += "</select>"
    return classificationList
}

/* **************************************
* Build the add inventory form HTML
* ************************************ */
Util.buildAddInventoryForm = function (data = {}, classificationList) {
    let html = `
        <div class="form-container">
            <p class="required-msg">ALL FIELDS ARE REQUIRED.</p>

            <form action="/inv/add-inventory" method="post" class="inventory-form">

                <label for="classificationList">Classification</label>
                ${classificationList}

                <label for="inv_make">Make</label>
                <input 
                    type="text" 
                    id="inv_make" 
                    name="inv_make" 
                    required
                    pattern="^[A-Za-z ]{3,}$"
                    placeholder="Min of 3 characters"
                    value="${data.inv_make || ""}"
                >

                <label for="inv_model">Model</label>
                <input 
                    type="text" 
                    id="inv_model" 
                    name="inv_model" 
                    required
                    pattern="^[A-Za-z ]{3,}$"
                    placeholder="Min of 3 characters"
                    value="${data.inv_model || ""}"
                >

                <label for="inv_description">Description</label>
                <textarea 
                    id="inv_description" 
                    name="inv_description"
                    placeholder="Describe the vehicle..." 
                    required
                >${data.inv_description || ""}</textarea>

                <label for="inv_image">Image Path</label>
                <input 
                    type="text" 
                    id="inv_image" 
                    name="inv_image" 
                    required
                    pattern="^/images/vehicles/.+"
                    value="${data.inv_image || "/images/vehicles/no-image.png"}"
                >

                <label for="inv_thumbnail">Thumbnail Path</label>
                <input 
                    type="text" 
                    id="inv_thumbnail" 
                    name="inv_thumbnail" 
                    required
                    pattern="^/images/vehicles/.+"
                    value="${data.inv_thumbnail || "/images/vehicles/no-image-tn.png"}"
                >

                <label for="inv_price">Price</label>
                <input 
                    type="text" 
                    id="inv_price" 
                    name="inv_price" 
                    required
                    pattern="^[0-9]{1,9}$"
                    inputmode="numeric"
                    placeholder="Integer only"
                    value="${data.inv_price || ""}"
                >

                <label for="inv_year">Year</label>
                <input 
                    type="text" 
                    id="inv_year" 
                    name="inv_year" 
                    required
                    pattern="[0-9]{4}"
                    placeholder="4-digit year"
                    value="${data.inv_year || ""}"
                >

                <label for="inv_miles">Miles</label>
                <input 
                    type="text" 
                    id="inv_miles" 
                    name="inv_miles" 
                    required
                    pattern="^[0-9]+$"
                    placeholder="Digits only"
                    value="${data.inv_miles || ""}"
                >

                <label for="inv_color">Color</label>
                <input 
                    type="text" 
                    id="inv_color" 
                    name="inv_color" 
                    required
                    pattern="^[A-Za-z ]+$"
                    placeholder="Vehicle color"
                    value="${data.inv_color || ""}"
                >

                <button type="submit">Add Vehicle</button>
            </form>
        </div>
    `
    return html
}

/* **************************************
* Build the edit inventory form HTML
* ************************************ */
Util.buildEditInventoryForm = function (data = {}, classificationList) {
    let html = `
        <div class="form-container">
            <p class="required-msg">ALL FIELDS ARE REQUIRED.</p>

            <form action="/inv/update" method="post" class="inventory-form">

                <input type="hidden" name="inv_id" value="${data.inv_id}">

                <label for="classificationList">Classification</label>
                ${classificationList}

                <label for="inv_make">Make</label>
                <input 
                    type="text" 
                    id="inv_make" 
                    name="inv_make" 
                    required
                    pattern="^[A-Za-z ]{3,}$"
                    value="${data.inv_make}"
                >

                <label for="inv_model">Model</label>
                <input 
                    type="text" 
                    id="inv_model" 
                    name="inv_model" 
                    required
                    pattern="^[A-Za-z ]{3,}$"
                    value="${data.inv_model}"
                >

                <label for="inv_description">Description</label>
                <textarea 
                    id="inv_description" 
                    name="inv_description"
                    required
                >${data.inv_description}</textarea>

                <label for="inv_image">Image Path</label>
                <input 
                    type="text" 
                    id="inv_image" 
                    name="inv_image" 
                    required
                    pattern="^/images/vehicles/.+"
                    value="${data.inv_image}"
                >

                <label for="inv_thumbnail">Thumbnail Path</label>
                <input 
                    type="text" 
                    id="inv_thumbnail" 
                    name="inv_thumbnail" 
                    required
                    pattern="^/images/vehicles/.+"
                    value="${data.inv_thumbnail}"
                >

                <label for="inv_price">Price</label>
                <input 
                    type="text" 
                    id="inv_price" 
                    name="inv_price" 
                    required
                    pattern="^[0-9]{1,9}$"
                    inputmode="numeric"
                    value="${data.inv_price}"
                >

                <label for="inv_year">Year</label>
                <input 
                    type="text" 
                    id="inv_year" 
                    name="inv_year" 
                    required
                    pattern="[0-9]{4}"
                    value="${data.inv_year}"
                >

                <label for="inv_miles">Miles</label>
                <input 
                    type="text" 
                    id="inv_miles" 
                    name="inv_miles" 
                    required
                    pattern="^[0-9]+$"
                    value="${data.inv_miles}"
                >

                <label for="inv_color">Color</label>
                <input 
                    type="text" 
                    id="inv_color" 
                    name="inv_color" 
                    required
                    pattern="^[A-Za-z ]+$"
                    value="${data.inv_color}"
                >

                <button type="submit">Update Vehicle</button>
            </form>
        </div>
    `
    return html
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
* Check Login Middleware
**************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
* Middleware For Handling Errors
* Wrap other function in this for 
* General Error Handling
**************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util