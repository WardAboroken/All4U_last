const express = require("express");
const router = express.Router();
const getDbConnection = require("../database/db"); // Import the getDbConnection function correctly
const addOrder = require("../database/queries/addOrder"); // Import the addOrder function
const { client } = require("../utils/paypal"); // Import PayPal client
const paypal = require("@paypal/checkout-server-sdk"); // Import PayPal SDK
const doQuery = require("../database/query"); // Ensure this is the correct import for your query function
const updateOrderStatus = require("./../database/queries/updateOrderStatusInDB");


// Function to get PayPal emails for products
async function getPaypalEmailForProducts(products) {
  const db = await getDbConnection();
  const catalogNumbers = products.map((product) => product.catalogNumber);
  const [results] = await db.query(
    `SELECT DISTINCT p.catalogNumber, u.paypalEmail
     FROM PRODUCTS p
     JOIN users u ON p.userName = u.userName
     WHERE p.catalogNumber IN (?)`,
    [catalogNumbers]
  );
console.log("resultsssssssssssssssssssssssss", results);
  const emailMap = results.reduce((map, row) => {
    map[row.catalogNumber] = row.paypalEmail;
    return map;
  }, {});

  return emailMap;
}

// Route to create PayPal orders for multiple shops
router.post("/createOrders", async (req, res) => {
  const { items, shippingAddress } = req.body; // Array of cart items and shipping address

  try {
    // Fetch the PayPal email for each product
    const emailMap = await getPaypalEmailForProducts(items);

    // Group items by shop (paypalEmail)
    const itemsGroupedByShop = items.reduce((groupedItems, item) => {
      const paypalEmail = emailMap[item.catalogNumber]; // Get the PayPal email for each item
      if (!groupedItems[paypalEmail]) {
        groupedItems[paypalEmail] = [];
      }
      groupedItems[paypalEmail].push(item);
      return groupedItems;
    }, {});

    const orders = {}; // Store order IDs for each shop

    for (const [paypalEmail, shopItems] of Object.entries(itemsGroupedByShop)) {
      const totalAmount = shopItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: totalAmount.toFixed(2),
            },
            payee: {
              email_address: paypalEmail, // Use the fetched PayPal email
            },
          },
        ],
      });

      const order = await client.execute(request);
      orders[paypalEmail] = order.result.id; // Store order ID for this shop
    }

    res.status(201).json({ success: true, orders });
  } catch (error) {
    console.error("Error creating PayPal orders:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating PayPal orders.",
    });
  }
});

// Capture PayPal Orders for Multiple Shops
router.post("/captureOrders", async (req, res) => {
  const { orderIds, shippingAddress } = req.body; // Object with order IDs to capture and shipping address
  const captureResults = {};

  try {
    for (const [paypalEmail, orderId] of Object.entries(orderIds)) {
      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});

      const capture = await client.execute(request);
      captureResults[paypalEmail] = capture.result; // Store capture result for this shop

      // After successful payment capture, add the order to the database
      const shopItems = capture.result.purchase_units[0].reference_id; // Assuming you pass necessary cartItems and userName in the request
      await finalizeOrderForShop(userName, shippingAddress, shopItems);
    }

    res.status(200).json({ success: true, captures: captureResults });
  } catch (error) {
    console.error("Error capturing PayPal orders:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while capturing PayPal orders.",
    });
  }
});


// Endpoint to get completed orders for a specific business owner
router.get("/get-completed-orders/:userName", async (req, res) => {
  const { userName } = req.params;

  try {
    const db = await getDbConnection(); // Get the database connection

    // SQL query to fetch completed orders with orderStatus = 'DONE'
    const [completedOrdersResult] = await db.query(
      `SELECT 
        o.orderNumber, 
        SUM(p.price * ocp.productQuantity) AS totalCost, 
        GROUP_CONCAT(p.catalogNumber) AS catalogNumbers 
       FROM orderscontainsproducts ocp 
       JOIN orders o ON ocp.orderNumber = o.orderNumber 
       JOIN products p ON ocp.catalogNumber = p.catalogNumber 
       WHERE p.userName = ? AND ocp.orderStatus = 'Been Provided' 
       GROUP BY o.orderNumber 
       ORDER BY o.orderDate DESC`,
      [userName]
    );

    if (!completedOrdersResult || completedOrdersResult.length === 0) {
      return res.status(404).json({ message: "No completed orders found for this business owner." });
    }

    res.json(completedOrdersResult);
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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

// Route to get all orders for a specific business owner (new orders)
router.get("/get-business-orders2/:userName", async (req, res) => {
  const { userName } = req.params;

  try {
    // Query to get all the 'Received' orders for the business owner
    const ordersQuery = `
      SELECT 
        o.orderNumber,                  
        o.orderDate AS date,             
        ocp.orderStatus AS status,        
        SUM(p.price * ocp.productQuantity) AS totalCost  
      FROM 
        orderscontainsproducts ocp        
      JOIN 
        orders o ON ocp.orderNumber = o.orderNumber  
      JOIN 
        products p ON ocp.catalogNumber = p.catalogNumber  
      WHERE 
        p.userName = ? AND ocp.orderStatus = 'Received'  
      GROUP BY 
        o.orderNumber, ocp.orderStatus, o.orderDate
      ORDER BY 
        o.orderDate DESC;
    `;

    const orders = await doQuery(ordersQuery, [userName]);

    if (!orders.length) {
      return res.status(404).json({
        message:
          "No new orders with status 'Received' found for this business owner.",
      });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders for business owner:", error);
    res
      .status(500)
      .json({ message: "Error fetching orders for business owner." });
  }
});

router.get("/get-business-orders/:userName", async (req, res) => {
  const { userName } = req.params;

  try {
    // Query to get all the 'WAITING' orders for the business owner
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
        p.userName = ? AND ocp.orderStatus != 'Been Provided'  -- Ensure the order status is 'WAITING'
      GROUP BY 
        o.orderNumber, ocp.orderStatus, o.orderDate
      ORDER BY 
        o.orderDate DESC;
    `;

    const orders = await doQuery(ordersQuery, [userName]);

    if (!orders.length) {
      return res.status(404).json({
        message:
          "No new orders with status 'WAITING' found for this business owner.",
      });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders for business owner:", error);
    res
      .status(500)
      .json({ message: "Error fetching orders for business owner." });
  }
});

// פונקציה לעדכון סטטוס ההזמנה עבור מוצר ספציפי
// Route to update order status for a specific product within an order
router.put("/update-order-status/:orderNumber", async (req, res) => {
  const { orderNumber } = req.params;
  const { catalogNumbers, status } = req.body; // Get catalog numbers and status from the request body

  if (!status || !catalogNumbers || !catalogNumbers.length) {
    return res
      .status(400)
      .json({ message: "Status and catalog numbers are required" });
  }

  try {
    // Call the function to perform the update in the database
    const result = await updateOrderStatus(orderNumber, catalogNumbers, status);
    if (result.success) {
      res.status(200).json({ message: "Order status updated successfully" });
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

// Endpoint to get detailed product information for a specific order and user
router.post("/get-order-details", async (req, res) => {
  const { orderNumber, userName } = req.body; // Get orderNumber and userName from the request body

  try {
    const db = await getDbConnection();

    // SQL query to fetch the product details for each catalogNumber in the order
    const [orderDetailsResult] = await db.query(
      `SELECT 
         ocp.catalogNumber, 
         p.productName, 
         ocp.productQuantity AS amount, 
         p.size, 
         p.color, 
         p.price 
       FROM 
         orderscontainsproducts ocp 
       JOIN 
         products p ON ocp.catalogNumber = p.catalogNumber 
       WHERE 
         ocp.orderNumber = ? 
       AND 
         p.userName = ?`, // Ensure products belong to the logged-in user (business owner)
      [orderNumber, userName]
    );

    if (!orderDetailsResult.length) {
      return res.status(404).json({ message: "No details found for this order." });
    }

    res.json(orderDetailsResult);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Define handleError function
const handleError = (res, error, message = "An error occurred") => {
  console.error(message, error);
  res.status(500).json({ error: message });
};

// Reintroduce /addOrder route ///// ward
// router.post("/addOrder", async (req, res) => {
//   // Accessing the userInfo from session
//   const userInfo = req.session.userInfo;

//   if (!userInfo) {
//     return res
//       .status(401)
//       .json({ success: false, message: "User not logged in" });
//   }

//   const { cartItems } = req.body;

//   try {
//     const result = await addOrder({
//       userName: userInfo.userName, // Use userName from session
//       cartItems,
//     });

//     if (result.error) {
//       return res.status(400).json({ success: false, message: result.error });
//     }

//     res.status(201).json({ success: true, message: result.success });
//   } catch (error) {
//     handleError(res, error, "Error adding order.");
//   }
// });
// Example: /order/addOrder route
router.post("/addOrder", (req, res) => {
  const user = req.session.user; // Access user info from session
console.log("add orderrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
  if (!user) {
    return res.status(401).json({ message: "User not logged in" });
  }

  const { cartItems } = req.body;
  const userName = user.userName; // Use session-stored user info
const shippingAddress=user.address;
  // Proceed to add the order
  addOrder({ userName,shippingAddress, cartItems })
    .then((result) => {
      res.status(201).json({ success: true, message: "Order added" });
    })
    .catch((error) => {
      console.error("Error adding order:", error);
      res.status(500).json({ error: "Failed to add order" });
    });
});




module.exports = router;
