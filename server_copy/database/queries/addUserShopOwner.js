const doQuery = require("../query");

async function addShopOwnerUser(user) {
  const {
    name,
    userName,
    email,
    phoneNumber, // Ensure this matches the key from the frontend
    password,
    subscriptionType,
    businessName,
    businessAddress,
    typeOfUser,
  } = user;

  try {
    console.log("User data in addShopOwnerUser:", user); // Log the user data to check
    // Check if the user already exists
    const existingUser = await doQuery(
      `
      SELECT * FROM businessowner WHERE userName = ?`,
      [userName]
    );

    if (existingUser.length > 0) {
      return { success: false, message: "User already exists" };
    }

    // Insert new user into the database
    await doQuery(
      `
      INSERT INTO businessowner (name, userName, email, phoneNumber, psw, subscriptionType, businessName, businessAddress, typeOfUser) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        userName,
        email,
        phoneNumber, // Ensure this matches the key used in the query
        password,
        subscriptionType,
        businessName,
        businessAddress,
        typeOfUser,
      ]
    );

    return { success: true };
  } catch (error) {
    console.error("Error adding shop owner user:", error);
    throw error;
  }
}

module.exports = addShopOwnerUser;
