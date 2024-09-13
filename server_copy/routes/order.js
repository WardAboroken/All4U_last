const express = require("express");
const router = express.Router();
const addOrder = require("../database/queries/addOrder"); // Import the addOrder function

// Route to add a new order
router.post("/addOrder", async (req, res) => {
  const { userName, shippingAddress, cartItems } = req.body; // Extract order details from request body
  console.log("orderrrrrrrrrrr issssssssss" , req.body)

  try {
    const result = await addOrder({ userName, shippingAddress, cartItems }); // Call the addOrder function with the order details

    if (result.error) {
      return res.status(400).json({ message: result.error }); // Return error if there's an error in adding the order
    }

    res.status(201).json({ message: result.success }); // Return success message if order added successfully
  } catch (error) {
    console.error("Error in order router:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error while adding the order" }); // Return server error message
  }
});

module.exports = router;
