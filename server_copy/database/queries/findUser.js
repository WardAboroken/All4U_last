// be/database/queries/findUser.js

const doQuery = require("../query");

async function findUser(userInfo) {
  const { userName, psw } = userInfo;
  try {
    const result = await doQuery(
      `
      SELECT userName, psw, 'users' AS tableName FROM users WHERE userName = ? AND psw = ?
      UNION
      SELECT userName, psw, 'businessowner' AS tableName FROM businessowner WHERE userName = ? AND psw = ?
    `,
      [userName, psw, userName, psw]
    );
    
    if (result.length > 0) {
      return { success: true, message: "User found." };
    } else {
      return { success: false, message: "User not found." };
    }
  } catch (error) {
    return { success: false, message: `Error: ${error.message}` };
  }
}

module.exports = findUser;
