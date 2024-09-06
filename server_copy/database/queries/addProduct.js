const doQuery = require("../query");

/**
 * A shop function that adds a new product to the products table if the product does not exist already and returns success if succeeded; otherwise, returns an error.
 * @param {*} product
 * @returns {Object} success or error message
 */
async function addProduct(product) {
  // Destructure product properties, ensuring all variables are provided correctly
  const {
    catalogNumber,
    productName,
    amount, // Ensure correct variable name
    size,
    color,
    price,
    categoryNumber, // Use categoryNumber instead of category
    userName, // Ensure userName is provided
    picturePath,
    description, // Ensure correct variable name
  } = product;

  try {
    // Check if the product already exists
    const existingProduct = await doQuery(
      `SELECT * FROM products WHERE catalogNumber = ?`,
      [catalogNumber]
    );

    if (existingProduct.length > 0) {
      return { error: "Product already exists in the database." }; // Return an error message
    }

    // Insert the product into the database
    const insertSql = `
      INSERT INTO products (catalogNumber, productName, amount, size, color, price, categoryNumber, userName, picturePath, description) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      catalogNumber,
      productName,
      amount,
      size,
      color,
      price,
      categoryNumber, // Use categoryNumber in the query
      userName, // Ensure userName is provided
      picturePath,
      description,
    ];

    const result = await doQuery(insertSql, params);

    // Log the result for debugging (optional)
    console.log("Insert result:", result);

    return { success: "New product has been added to the database." }; // Return a success message
  } catch (error) {
    console.error("Error adding product:", error); // Log the error for debugging
    return { error: "Error adding product to the database." }; // Return an error message
  }
}

module.exports = addProduct;
