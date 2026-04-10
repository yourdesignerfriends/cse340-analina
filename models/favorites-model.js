/* ********************************************
 *  Favorites Model
 *  I added this model to implement the new
 *  Favorites feature in my project. This file
 *  manages all queries related to the favorites
 *  table, including inserting a favorite,
 *  deleting one, and returning all favorites
 *  for a specific user.
 ******************************************** */

const pool = require("../database/")

/* *****************************
 *   Add a vehicle to favorites
 * *************************** */
async function addFavorite(account_id, inv_id) {
    try {
        const sql = `
            INSERT INTO favorites (account_id, inv_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
            RETURNING *;
        `
        const result = await pool.query(sql, [account_id, inv_id])
        return result.rows[0]
    }   catch (error) {
        console.error("addFavorite error:", error)
        return null
    }
}

/* *****************************
 *   Remove a vehicle from favorites
 * *************************** */
async function removeFavorite(account_id, inv_id) {
    try {
        const sql = `
            DELETE FROM favorites
            WHERE account_id = $1 AND inv_id = $2;
        `
        const result = await pool.query(sql, [account_id, inv_id])
        return result
    }   catch (error) {
        console.error("removeFavorite error:", error)
        return null
    }
}

/* *****************************
 *   Get all favorites for a user
 * *************************** */
async function getUserFavorites(account_id) {
    try {
        const sql = `
            SELECT i.*
            FROM favorites f
            JOIN inventory i ON f.inv_id = i.inv_id
            WHERE f.account_id = $1;
        `
        const result = await pool.query(sql, [account_id])
        return result.rows
    }   catch (error) {
        console.error("getUserFavorites error:", error)
        return null
    }
}

/* *****************************
 *   Check if a vehicle is already a favorite
 * *************************** */
async function checkFavorite(account_id, inv_id) {
    try {
        const sql = `
            SELECT 1 FROM favorites
            WHERE account_id = $1 AND inv_id = $2
            LIMIT 1;
        `
        const result = await pool.query(sql, [account_id, inv_id])
        return result.rows.length > 0
    } catch (error) {
        console.error("checkFavorite error:", error)
        return false
    }
}

module.exports = { addFavorite, removeFavorite, getUserFavorites, checkFavorite }