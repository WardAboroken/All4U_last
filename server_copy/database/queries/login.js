const doQuery = require("../query");

/**  A function that returns success if user was found in one of the tables, else returns error
 * @param {*} user
 *@returns success/error
 */
async function findUser(user) {
  const { userName, password } = user;
  try {
    // Check if the user exists in users table
    const existingUser = await doQuery(
      `SELECT * FROM users WHERE userName = ? AND psw=? `,
      [userName, password]
    );
    if (existingUser.length > 0) {
      return { success: "User found" }; // Return a success message
    } else {
      const secondBdeka = await doQuery(
        // Checking if user exists in workers table
        `SELECT * FROM businessowner WHERE userName = ? AND psw=? `,
        [userName, password]
      );
      if (secondBdeka.length > 0) {
        return { success: "User found" };
      } else return { error: "User not found" };
    }
  } catch (error) {
    console.error("Error finding user:", error); // Log the error for debugging
    return { error: "Error finding user to the database" }; // Return an error message
  }
}
module.exports = findUser;
