const doQuery = require("../query");

/** A function that updates password for existing user, returns success with a successful updating else returns error
 * @param {*} user
 *@returns success/error
 */
async function findUserForNewPsw(user) {
  const { userName, psw } = user;
  console.log("you check user ", psw);
  try {
    // Update the user's password
    const resultusers = await doQuery(
      `SELECT username FROM users WHERE username = ?`,
      [userName]
    );
    const resultbis = await doQuery(
      `SELECT username FROM businessowner WHERE username = ?`,
      [userName]
    );
    if (resultusers.length > 0) {
      await doQuery(
        `UPDATE users 
       SET psw = ?
       WHERE username = ?`,
        [psw, userName]
      );
    } else if (resultbis.length > 0) {
      await doQuery(
        `UPDATE businessowner 
         SET psw = ?
         WHERE username = ?`,
        [psw, userName]
      );
    } else {
      return { error: "User not found" };
    }

    // Check if the user exists after updating the password
    // const result = await doQuery(
    //   `SELECT username FROM users
    //    WHERE username = ?

    //    UNION

    //    SELECT username FROM businessowner
    //    WHERE username = ?`,
    //   [userName, userName]
    // );

    if (resultusers.length > 0 || resultbis.length > 0) {
      return { success: true }; // User found and password updated successfully
    } else {
      return { error: "User not found" };
    }
  } catch (error) {
    console.error("Error updating user password and finding user:", error);
    return {
      error:
        "An error occurred while updating the password and finding the user",
    };
  }
}
module.exports = findUserForNewPsw;
