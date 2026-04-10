/* ********************************************
 *  Reviews Model
 *  I created this model to store and manage
 *  user reviews for vehicles. I handle adding
 *  a review and getting reviews for a vehicle.
 ******************************************** */

const pool = require("../database/")

/* *****************************
 *   Add a review
 *   I save a new review in the database.
 *************************** */
async function addReview(account_id, inv_id, review_text) {
    try {
        const sql = `
        INSERT INTO reviews (account_id, inv_id, review_text)
        VALUES ($1, $2, $3)
        RETURNING *;
        `
        const result = await pool.query(sql, [account_id, inv_id, review_text])
        return result.rows[0]
    } catch (error) {
        console.error("addReview error:", error)
        return null
    }
}

/* *****************************
 *   Get reviews for a vehicle
 *   I return all reviews for a
 *   specific vehicle.
 *************************** */
async function getReviewsByVehicle(inv_id) {
    try {
        const sql = `
        SELECT r.review_text, r.review_date, a.account_firstname
        FROM reviews r
        JOIN account a ON r.account_id = a.account_id
        WHERE r.inv_id = $1
        ORDER BY r.review_date DESC;
        `
        const result = await pool.query(sql, [inv_id])
        return result.rows
    } catch (error) {
        console.error("getReviewsByVehicle error:", error)
        return []
    }
}

/* *****************************
 *   Get reviews by account
 *   I return all reviews written
 *   by a specific user.
 *************************** */
async function getReviewsByAccount(account_id) {
  try {
    const sql = `
      SELECT r.review_text, r.review_date,
             i.inv_make, i.inv_model, i.inv_year, i.inv_id
      FROM reviews r
      JOIN inventory i ON r.inv_id = i.inv_id
      WHERE r.account_id = $1
      ORDER BY r.review_date DESC;
    `
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    console.error("getReviewsByAccount error:", error)
    return []
  }
}

module.exports = { addReview, getReviewsByVehicle, getReviewsByAccount }