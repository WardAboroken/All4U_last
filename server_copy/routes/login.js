// This function defines a route handler for user login functionality in your application. 
const express = require("express");
const findUser = require("../../database/queries/login");
const normalUser = require("../../database/queries/checkIfIsNormalUser");
const router = express.Router();

router.post("/login", async (req, res, next) => {
  // This function handles POST requests for user login. It attempts to find the user in the database using provided login credentials. If the user is found, it determines whether they are a normal user or a worker. Based on this, it redirects them to different pages. If the user is not found or an error occurs, it redirects them to the login page.
  try {
    console.log("Searching for user : ", req.body);
    const user = req.body;
    const result = await findUser(user);

    if (result.success) {
      console.log("User exists!");
      const newResult = await normalUser(user); // פונקציה הבודקת אם הוא משתמש רגיל או עובד
      if (newResult.success) {
        res.status(200).json({ message: "User exists!" });
      } else {
        res.status(200).json({ message: "User Worker exists!" });
      }
    } else {
      res.status(400).json({ message: "User does not exist." });
     
    }
    // res.status(400).json({ error: result.error });
  } catch (error) {
    // console.error("Error finding user:", error) ;
    console.log({ error: "An error occurred while finding the user" });
    res.redirect("/index.html");

    // Sending an error response to the client
    // res.status(500).json({ error: "An error occurred while finding the user" });
  }
});
module.exports = router;
