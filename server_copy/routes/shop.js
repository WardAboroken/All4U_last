const path = require("path");
const express = require("express");
const getProducts = require("../database/queries/get-products"); // Import your query function
const router = express.Router();

// Route to fetch all products or filter by userName
router.get("/get-products", async (req, res) => {
  const { userName } = req.query; // Get userName from the query parameters

  try {
    console.log(
      "Fetching products for user:",
      userName ? userName : "All Users"
    );
    let products = await getProducts(); // Fetch all products

    // If userName is provided, filter products by userName
    if (userName) {
      products = products.filter((product) => product.userName === userName);
    }

    res.json(products); // Send filtered or all products as JSON
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to search for products by name or category
router.get("/search", async (req, res) => {
  const { query } = req.query; // Extract query from the request

  if (!query) {
    return res.status(400).json({ message: "Query is required." });
  }

  try {
    console.log(`Searching for products with query: ${query}`);
    const products = await getProducts(); // Fetch all products

    // Filter products based on the query (case-insensitive search)
    const filteredProducts = products.filter((product) =>
      product.productName.toLowerCase().includes(query.toLowerCase())
    );

    res.status(200).json(filteredProducts);
  } catch (error) {
    console.error("Error in /shop/search GET:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
