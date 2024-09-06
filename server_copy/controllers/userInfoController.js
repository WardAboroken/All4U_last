
const getCustomerInfo = require("../database/queries/getCustomerInfo");
const getWorkerInfo = require("../database/queries/getWorkerInfo");

const getUserInfo = async (req, res) => {
  // console.log("😊 getting the infoooo");
  try {
    // Check if user session exists

    if (req.session.userName == undefined) {
      return res.status(401).json({ error: "User session not found" });
    }

    // Fetch user type from session
  userType= req.session.userType
    // Initialize userInfo object
    let userInfo = {
      userName: req.session.userName,
    };
    // Fetch detailed user information based on user type
    if (userType === "normal") {
      const customerInfo = await getCustomerInfo(userInfo);
      if (customerInfo) {
        userInfo = { ...userInfo, ...customerInfo };
      }
    } else if (userType === "worker" || userType === "admin") {
      const workerInfo = await getWorkerInfo(userInfo);
      if (workerInfo) {
        userInfo = { ...userInfo, ...workerInfo };
      }
    }
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
