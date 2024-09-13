const doQuery = require("../query");

/**  A function that deletes a product if it is found in the products table, else returns an error
 * @param {*} product
 *@returns error or success message
 */
async function deleteProduct({ catalogNumber }) {
  // Use destructuring to directly get catalogNumber
  try {
    // Check if the product exists
    const existingProduct = await doQuery(
      `SELECT * FROM products WHERE catalogNumber = ?`,
      [catalogNumber]
    );

    if (existingProduct.length > 0) {
      await doQuery(`DELETE FROM products WHERE catalogNumber = ?`, [
        catalogNumber,
      ]);
      return { success: true };
    } else {
      return { error: "Product not found" };
    }
  } catch (error) {
    console.error("Error finding product:", error); // Log the error for debugging
    return { error: "Error finding product in the database" }; // Return an error message
  }
}

module.exports = deleteProduct;
