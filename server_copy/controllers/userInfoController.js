// controllers/userInfoController.js

const checkUserType = require("../database/queries/login");
const getCustomerInfo = require("../database/queries/getCustomerInfo");
const getWorkerInfo = require("../database/queries/getWorkerInfo");

const getUserInfo = async (req, res) => {
      console.log("\u{1F60A} getting the infoooo");
  try {
    // Check if user session exists
    if (!req.session.user) {
      return res.status(401).json({ error: "User session not found" });
    }

    // Fetch user type from session
    const userType = req.session.userType;
    console.log("userType ===>>>", userType);
    // Initialize userInfo object
    let userInfo = {
      userName: req.session.user,
      userType: userType,
    };
    console.log("userInfo ===>>>", userInfo);
    // Fetch detailed user information based on user type
    if (userType === "normal") {
      const customerInfo = await getCustomerInfo(userInfo);
      if (customerInfo) {
        userInfo = { ...userInfo, ...customerInfo };
      }
    } else if (userType === "worker") {
      const workerInfo = await getWorkerInfo(userInfo);
      if (workerInfo) {
        userInfo = { ...userInfo, ...workerInfo };
      }
    }
    console.log("userInfo222222 ===>>>", userInfo);
    // Send response with user info
    res.status(200).json({ userInfo });
  } catch (error) {
    // Handle errors that occur during fetching or constructing userInfo
    console.error("Error fetching user info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUserInfo,
};
