// be/controllers/loginController.js
// Import necessary modules and functions
const checkUserType = require("../database/queries/login");
const findUser=require("../database/queries/findUser")

// Handle user login request
const handleLogin = async (req, res) => {
  try {
    console.log("Searching for user:", req.body);
    const user = req.body;

    // find user 
    const findResult=await findUser(user);

    // If user is found in the database
    if (findResult.success) {
      // Call the function to find the user in the database
      const userTypeResult = await checkUserType(user);

      if (userTypeResult === "normal") {
        req.session.result = "normal"; // Store user type in session
        return res.status(200).json({
          message: "User authenticated successfully",
          redirectUrl: "/ShopMainPage", // Redirect URL for normal users
        });
      } else if (userTypeResult === "worker") {
        req.session.userType = "worker"; // Store user type in session
        return res.status(200).json({
          message: "User authenticated successfully",
          redirectUrl: "/ShopOwnerMainPage", // Redirect URL for workers
        });
      } else {
        return res.status(400).json({ message: "Invalid user type" });
      }
    } else {
      // Send error response if user not found
      console.log("result =>  ", findResult);
      return res.status(400).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    // Handle errors that occur during user authentication
    console.error("Error finding user:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while finding the user" });
  }
};

// Export the function to make it accessible to your routes or other parts of your application
module.exports = {
  handleLogin,
};
