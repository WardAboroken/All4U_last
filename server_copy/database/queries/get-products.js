const doQuery = require("../query");

/**
 * A shop function which get all products from products table
 * @returns result of query
 */
async function getProducts() {
  sql = `SELECT catalogNumber,productName,amount,size,color,price,picturePath,categoryNumber ,userName ,description FROM products `;
  result = await doQuery(sql);
  // console.log(result, "🥱 in getProducts");
  return result;
}

module.exports = getProducts;
