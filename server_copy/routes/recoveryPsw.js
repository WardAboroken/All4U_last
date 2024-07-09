// This function defines a route handler for the password recovery feature in your application.
const express = require("express");
const findUserForNewPsw = require("../../database/queries/recoveryPsw");
const router = express.Router();

router.post("/recoveryPsw", async (req, res, next) => {
  // This function is responsible for handling POST requests for password recovery. It attempts to find the user in the database using the provided data. If the user is found, it redirects them to the main page; otherwise, it redirects them to the forgot password page.
  try {
    console.log("Recovery Password : ", req.body);
    const user = req.body;
    const result = await findUserForNewPsw(user);

    if (result.success) {
      res.status(200).json({ message: "recovery psw success!" }); // Sending success message if user is found
    } else {
      res.status(400).json({ message: "User does not exist." }); // Sending error message if user does not exist
    }
  } catch (error) {
    // Sending an error response to the client in case of any errors
    res.status(400).json({ message: "User does not exist." }); // Sending error message with status code 400 (Bad Request)
  }
});
module.exports = router;
