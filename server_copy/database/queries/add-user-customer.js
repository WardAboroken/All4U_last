// import user_profile from "../assets/images/user_profile.jpeg";
const doQuery = require("../query");

async function addCustomerUser(user) {
  const {
    userName,
    name,
    password,
    email,
    phoneNumber,
    typeOfUser,
    selectedCategories,
  } = user;

  try {
    // Check if the user already exists
    const existingUser = await doQuery(
      `
      SELECT * FROM users WHERE userName = ?`,
      [userName]
    );

    if (existingUser.length > 0) {
      return { success: false, message: "User already exists" };
    }
    console.log("user's selected categories ==>>> ",selectedCategories);

    // Insert new user into the database
    await doQuery(
      `
      INSERT INTO users (userName, name, psw, email, phoneNumber, typeOfUser, preferredCategories) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userName,
        name,
        password,
        email,
        phoneNumber,
        typeOfUser,
        JSON.stringify(selectedCategories),
      ]
    );

    return { success: true, message: "User added successfully" };
  } catch (error) {
    console.error("Error adding user:", error);
    return { success: false, message: "Error adding user to the database" };
  }
}

module.exports = addCustomerUser;
