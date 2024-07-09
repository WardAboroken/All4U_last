const doQuery = require("../query");

/**
 * A shop function which add a new product to the products table if product does not exist already and returns success if succeeded, else returns error
 * @param {*} product 
 * @returns success/error
 */
async function addProduct(product) {
  const { catalogNumber, productName, Amount, size, color, price , category , picture_path , Description } = product;

  try {
    // Check if the user already exists
    const existingUser = await doQuery(
      `SELECT * FROM products WHERE Catalog_Number = ?`,
      [catalogNumber]
    );
    if (existingUser.length > 0) {
      return { error: "product already exists in the database" }; // Return an error message
    }

    // Insert the user into the database
    const insertSql = `INSERT INTO products (Catalog_Number, productName, Amount, Size, Color, Price,Category,picture_path , Description) VALUES (?, ?, ?, ?, ?, ? , ? , ? , ?)`;
    const params = [catalogNumber, productName, Amount, size, color, price , category , picture_path , Description];
    const result = await doQuery(insertSql, params);
    // Log the result for debugging (optional)
    console.log("Insert result:", result);
    return { success: "New product has been added to the database" }; // Return a success message
  } catch (error) {
    console.error("Error adding product:", error); // Log the error for debugging
    return { error: "Error adding product to the database" }; // Return an error message
  }
}

module.exports = addProduct;
