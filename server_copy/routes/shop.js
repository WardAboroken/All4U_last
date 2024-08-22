// This function defines a route handler for fetching products from the database.
const path = require("path");
const express = require("express");
const getProducts = require("../database/queries/get-products");
const router = express.Router();

// /shop/get-products => GET

router.get("/get-products", async (req, res, next) => {
  // This function defines a route handler for fetching products from the database. When a GET request is made to "/shop/products", it retrieves the products from the database using the getProducts function. If successful, it sends the products as a JSON response to the client. If there's an error during the process, it sends a 500 status code with an error message as a JSON response.
  try {
    console.log("in /shop/products GET");
    const products = await getProducts();
    // console.log(products, "😂 in /shop/products GET");
    // send response to FE as JSON
    res.json(products);
  } catch (error) {
    console.error("Error in /shop/products GET:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
