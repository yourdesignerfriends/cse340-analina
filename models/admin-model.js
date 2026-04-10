const pool = require("../database/")

/* *****************************
*   Get favorite stats from the VIEW
* *************************** */
async function getFavoriteStats() {
  try {
    const sql = "SELECT * FROM favorite_stats ORDER BY total_favorites DESC"
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    console.error("Error in getFavoriteStats:", error)
    return error.message
  }
}

module.exports = { getFavoriteStats }