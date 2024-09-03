const path = require("path");
const express = require("express");
const getProducts = require("../database/queries/get-products");
const router = express.Router();

// Route to fetch all products
router.get("/get-products", async (req, res, next) => {
  try {
    console.log("in /shop/products GET");
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    console.error("Error in /shop/products GET:", error);
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
    const products = await getProducts(); // Assuming getProducts() fetches all products

    // Filter products based on the query (case-insensitive search)
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );

    res.status(200).json(filteredProducts);
  } catch (error) {
    console.error("Error in /shop/search GET:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
