const doQuery = require("../query");

/**
 * A shop function which get all products from products table
 * @returns result of query
 */
async function getProducts() {
  sql = `SELECT picture_path,productName,Description,Catalog_number,Amount,Size,Color,Category,Price FROM products `;
  result = await doQuery(sql);
  // console.log(result, "🥱 in getProducts");
  return result;
}

module.exports = getProducts;
