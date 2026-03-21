/* ***************************
 *  Here I define functions related to intentional
 *  errors that I use to test the application's
 *  error‑handling process.
 * ************************** */

const errorController = {}

/* ***************************
 *  Intentional 500 error
 *  In this function, I intentionally generate an error
 *  so that the global Express error handling middleware
 *  can catch it and render the error view.
 * ************************** */
errorController.triggerError = (req, res, next) => {
  next(new Error("Intentional error process"))
}

module.exports = errorController