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
  const { id, name, price, quantity, image } = req.body;

  if (!id || !name || !price || !quantity) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingItem = cartItems.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cartItems.push({ id, name, price, quantity, image });
  }

  res.status(201).json(cartItems);
});

// Route to update the quantity of an item in the cart
router.put("/:itemId", (req, res) => {
  const { itemId } = req.params; // This will be a string
  const { quantity } = req.body;

  if (!quantity || isNaN(quantity)) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  // Convert itemId to number if necessary or ensure comparison is correct
  const item = cartItems.find(
    (item) => item.id === itemId || item.id === Number(itemId)
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  item.quantity = quantity; // Update the item quantity
  res.status(200).json(cartItems); // Respond with the updated cart
});

// Route to remove an item from the cart
router.delete("/:itemId", (req, res) => {
  const { itemId } = req.params;

  const itemIndex = cartItems.findIndex(
    (item) => item.id === itemId || item.id === Number(itemId)
  );
  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  cartItems.splice(itemIndex, 1); // Remove the item from the array
  res.status(200).json(cartItems); // Respond with the updated cart
});

module.exports = router;
