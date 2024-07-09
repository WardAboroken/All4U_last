//This code defines a route handler for adding a new user to your application.
const express = require("express");
const addUser = require("../../database/queries/add-user");
const router = express.Router();


// POST /admin/add-user
router.post("/add-user", async (req, res, next) => {
  // This function defines a route handler for adding a new user to your application. When a POST request is sent to "/admin/add-user", the function attempts to add the user data received in the request body to the database. If the addition is successful, it redirects the client to "/index.html". If there's an error during the process, it sends an appropriate error response with the corresponding HTTP status code.
  try {
    console.log("Adding new user:", req.body);
    const user = req.body;
    const result = await addUser(user);

    // Sending a response to the client
    if (result.success) {
      res.status(200).json({ message: "add User success!" }); // Sending success message if addition is successful
    } else {
      res.status(400).json({ message: "User already exist." }); // Sending error message if user already exists
    }
  } catch (error) {
    console.error("Error adding user:", error);

    // Sending an error response to the client
    res.status(500).json({ error: "An error occurred while adding the user" });
  }
});

module.exports = router;
