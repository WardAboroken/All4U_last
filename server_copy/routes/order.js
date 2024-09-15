const express = require("express");
const router = express.Router();
const getDbConnection = require("../database/db"); // Import the getDbConnection function correctly
const doQuery = require("../database/query"); // Ensure this is the correct import for your query function
const addOrder = require("../database/queries/addOrder"); // Import the addOrder function

// Endpoint to get catalog numbers for a specific order and business owner
router.get("/get-catalog-numbers/:orderNumber/:userName", async (req, res) => {
  const { orderNumber, userName } = req.params;

  try {
    console.log(
      "Fetching catalog numbers for order:",
      orderNumber,
      "and user:",
      userName
    );

    const db = await getDbConnection(); // Get the database connection

    // Step 1: Get all catalog numbers for the order from ORDERSCONTAINSPRODUCTS
    const [catalogNumbersResult] = await db.query(
      `SELECT catalogNumber 
       FROM ORDERSCONTAINSPRODUCTS 
       WHERE orderNumber = ?`,
      [orderNumber]
    );

    console.log("Catalog numbers result:", catalogNumbersResult);

    if (!catalogNumbersResult || catalogNumbersResult.length === 0) {
      console.log("No catalog numbers found for this order.");
      return res.json([]); // No catalog numbers found for this order
    }

    const catalogNumbers = catalogNumbersResult.map((row) => row.catalogNumber);

    // Step 2: Filter catalog numbers that belong to the business owner from PRODUCTS
    const [productsResult] = await db.query(
      `SELECT catalogNumber 
       FROM PRODUCTS 
       WHERE catalogNumber IN (?) 
       AND userName = ?`,
      [catalogNumbers, userName]
    );

    console.log("Filtered catalog numbers result:", productsResult);

    if (!productsResult) {
      console.log("No products found for the given catalog numbers and user.");
      return res.json([]); // No products found
    }

    const filteredCatalogNumbers = productsResult.map(
      (row) => row.catalogNumber
    );

    // Step 3: Return the filtered catalog numbers
    res.json(filteredCatalogNumbers);
  } catch (error) {
    console.error("Error fetching catalog numbers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get out-of-stock products for a specific business owner
router.get("/get-out-of-stock-products/:userName", async (req, res) => {
  const { userName } = req.params;

  try {
    // SQL query to fetch products where amount is 0 for the given userName
    const outOfStockQuery = `
      SELECT catalogNumber, productName, picturePath, amount
      FROM PRODUCTS
      WHERE userName = ? AND amount = 0;
    `;

    const outOfStockProducts = await doQuery(outOfStockQuery, [userName]);

    if (!outOfStockProducts.length) {
      return res
        .status(404)
        .json({ message: "No out-of-stock products found." });
    }

    res.json(outOfStockProducts);
  } catch (error) {
    console.error("Error fetching out-of-stock products:", error);
    res.status(500).json({ message: "Error fetching out-of-stock products." });
  }
});

// Route to get all orders for a specific business owner
router.get("/get-business-orders2/:userName", async (req, res) => {
  const { userName } = req.params;

  try {
    const ordersQuery = `
      SELECT 
        o.orderNumber,                  
        o.orderDate AS date,             
        ocp.orderStatus AS status,        
        SUM(p.price * ocp.productQuantity) AS totalCost,  -- Calculate the total cost
        GROUP_CONCAT(p.catalogNumber) AS catalogNumbers  -- Concatenate catalog numbers
      FROM 
        orderscontainsproducts ocp        
      JOIN 
        orders o ON ocp.orderNumber = o.orderNumber  
      JOIN 
        products p ON ocp.catalogNumber = p.catalogNumber  
      WHERE 
        p.userName = ?
      GROUP BY 
        o.orderNumber, ocp.orderStatus, o.orderDate
      ORDER BY 
        o.orderDate DESC;
    `;

    const orders = await doQuery(ordersQuery, [userName]);

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this business owner." });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders for business owner:", error);
    res
      .status(500)
      .json({ message: "Error fetching orders for business owner." });
  }
});

// Route to add a new order
router.post("/addOrder", async (req, res) => {
  const { userName, shippingAddress, cartItems } = req.body;
  console.log("Order details received:", req.body);

  try {
    const result = await addOrder({ userName, shippingAddress, cartItems });

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    res.status(201).json({ message: result.success });
  } catch (error) {
    console.error("Error in order router:", error);
    res.status(500).json({ message: "Server error while adding the order" });
  }
});

module.exports = router;
