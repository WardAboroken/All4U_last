const doQuery = require("../query");

async function getUsersStatus2() {
  sql = `SELECT * FROM businessowner
  WHERE status = 2`;
  result = await doQuery(sql);
  return result;
}

async function updateStatus(userName, newStatus) {
  try {
    // Update the user's status in the database
    const updateSql = `UPDATE businessowner SET status = ? WHERE userName = ?`;
    const params = [newStatus, userName];
    const result = await doQuery(updateSql, params);

    // Log the result for debugging (optional)
    console.log("Update result:", result);

    if (result.affectedRows > 0) {
      return { success: "User status has been updated in the database" }; // Return a success message
    } else {
      return { error: "No rows were affected; user might not exist" }; // Return an error message if no rows were updated
    }
  } catch (error) {
    console.error("Error updating user status:", error); // Log the error for debugging
    return { error: "Error updating user status in the database" }; // Return an error message
  }
}

module.exports = {
  getUsersStatus2,
  updateStatus,
};
