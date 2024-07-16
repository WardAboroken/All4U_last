// A router that connect us to the uppropiate query to help us update the user's profile according to it's type and editing
const express = require("express");
const updateCustomerProfile = require("../database/queries/updateCustomerProfile");
const updateShopOwnerProfile = require("../database/queries/updateShopOwnerProfile");
const router = express.Router();
router.use(express.json());

router.post("/updateCustomerProfile", async (req, res, next) => {
  console.log("Adding new user:", req.body);
  try {
    const user = req.body;
    const result = await updateCustomerProfile(user);

    // Sending a response to the client
    if (result.success) {
      res.status(200).json({ message: "add User success!" }); // Sending success message if addition is successful
    } else {
      res.status(400).json({ message: "User already exist." }); // Sending error message if user already exists
    }
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "An error occurred while adding the user" });
  }
});

module.exports = router;