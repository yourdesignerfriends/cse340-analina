const invModel = require("../models/inventory-model")
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
* Middleware For Handling Errors
* Wrap other function in this for 
* General Error Handling
**************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util