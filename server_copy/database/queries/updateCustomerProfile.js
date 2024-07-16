const doQuery = require("../query");
const bcrypt = require("bcrypt");
const findUser = require("../queries/findUser");

async function updateCustomerProfile(user) {
  const { name, userName, email, phoneNumber, password, newPassword } = user;

  try {
    console.log("Updating user profile");

    // Check if the user exists and get their current password
    // const existingUser = await doQuery(
    //   `SELECT * FROM users WHERE userName = ?`,
    //   [userName]
    // );
    const userinfo  = {
      userName: userName,
      psw: password
    }
     const findResult = await findUser(userinfo);
console.log("user infoooooooooooooooo heerereee: ", findResult);
    if (!findResult.success) {
      return { success: false, message: "User not found" };
    }

   
console.log("user infoooooooooooooooo heerereee: ", findResult);
  
    // Update user in the database
    await doQuery(
      `UPDATE users SET name = ?, email = ?, phoneNumber = ?, psw = ? WHERE userName = ?`,
      [name, email, phoneNumber, newPassword, userName]
    );

    return { success: true, message: "User updated successfully" };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: "Error updating user in the database" };
  }
}

module.exports = updateCustomerProfile;
