const doQuery = require("../query");

/**
 * A shop function which get all products from products table
 * @returns result of query
 */
async function getProducts() {
  sql = `SELECT 
  p.catalogNumber,
  p.productName,
  p.amount,
  p.size,
  p.color,
  p.price,
  p.picturePath,
  p.categoryNumber,
  p.userName,
  p.description
FROM 
  products p
JOIN 
  businessowner b ON p.userName = b.userName
WHERE 
  p.amount != 0
  AND b.status = 1 And p.status = 'Active'`;
  result = await doQuery(sql);
  // console.log(result, "🥱 in getProducts");
  return result;
}

module.exports = getProducts;
