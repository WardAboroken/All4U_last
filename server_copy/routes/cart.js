const express = require("express");
const router = express.Router();

// Mock Database (Replace with a real database in production)
let cartItems = []; // Initialize cartItems array

// Route to fetch cart items
router.get("/", (req, res) => {
  res.json(cartItems); // Respond with the current cart items
});

// Route to add a new item to the cart
router.post("/", (req, res) => {
  const { catalogNumber, productName, price, amount, picturePath } = req.body;

  if (!catalogNumber || !productName || !price || !amount) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingItem = cartItems.find(
    (item) => item.catalogNumber === catalogNumber
  );

  if (existingItem) {
    existingItem.amount += amount; // Update the quantity if the item already exists
  } else {
    cartItems.push({
      catalogNumber,
      productName,
      price,
      amount,
      picturePath,
    });
  }

  res.status(201).json(cartItems);
});

// Route to update the amount of an item in the cart
router.put("/:itemCatalogNumber", (req, res) => {
  const { itemCatalogNumber } = req.params; // This will be a string
  const { amount } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const item = cartItems.find(
    (item) => item.catalogNumber === parseInt(itemCatalogNumber) // Ensure correct type comparison
  );

  if (!item) {
    console.error(`Item not found for catalogNumber: ${itemCatalogNumber}`); // Debug log for missing item
    return res.status(404).json({ message: "Item not found" });
  }

  item.amount = amount; // Update the item amount
  res.status(200).json(cartItems); // Respond with the updated cart
});

// Route to remove an item from the cart
router.delete("/:itemCatalogNumber", (req, res) => {
  const { itemCatalogNumber } = req.params;

  const itemIndex = cartItems.findIndex(
    (item) => item.catalogNumber === parseInt(itemCatalogNumber) // Ensure correct type comparison
  );

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  cartItems.splice(itemIndex, 1); // Remove the item from the array
  res.status(200).json(cartItems); // Respond with the updated cart
});

module.exports = router;
