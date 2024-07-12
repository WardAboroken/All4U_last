// controllers/userInfoController.js

const getUserInfo = (req, res) => {
  try {
    // Check if user session exists
    if (!req.session.user) {
      return res.status(401).json({ error: "User session not found" });
    }

    // Assuming you have a function to fetch user info from your database
    // Replace with your actual logic to fetch user info
    const userInfo = {
      userName: req.session.user,
      userType: req.session.userType, // Optionally include user type if needed
      // Add other user information as needed
    };

    res.status(200).json({ userInfo });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUserInfo,
};
