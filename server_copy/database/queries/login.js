// be/database/queries/login.js
// Import your database query function (doQuery) here
const doQuery = require("../query");

// Function to check user type based on credentials
async function checkUserType(userInfo) {
  const { userName, psw } = userInfo;
  try {
    // SQL query to check if user exists in either 'users' or 'businessowner' table
    const results = await doQuery(
      `SELECT 'normal' AS userType
      FROM users
      WHERE userName = ? AND psw = ?
      UNION
      SELECT typeOfUser AS userType
      FROM businessowner
      WHERE userName = ? AND psw = ?
   `,
      [userName, psw, userName, psw]
    );
    // Check if results were returned
    if (results.length > 0) {
      // Assuming only one result will be returned due to UNION (user should be in only one table)

      return results[0].userType; // 'normal' or 'worker'
    } else {
      return null; // User not found in either table
    }
  } catch (error) {
    console.error("Error checking user type:", error);
    throw error; // Propagate error for handling elsewhere
  }
}

// Export the function to make it accessible to other parts of your application
module.exports = checkUserType;
