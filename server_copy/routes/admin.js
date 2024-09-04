const express = require("express");
const router = express.Router();
const {
  getUsersStatus2,
  updateStatus,
} = require("../database/queries/getUsersStatus2"); // Ensure correct path

router.get("/getUsersStatus2", async (req, res, next) => {
  try {
    const users = await getUsersStatus2();
    res.json(users);
  } catch (error) {
    console.error("Error in /getUsersStatus2 GET:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/admin/updateStatus/:id/:status", async (req, res) => {
  const userId = req.params.id; // Retrieve user ID from URL parameter
  const status = req.params.status; // Retrieve status from URL parameter

  console.log(
    `Request received to update status for user: ${userId} with status: ${status}`
  ); // Debugging log

  try {
    // Call the updateStatus function with parameters
    const result = await updateStatus(userId, status);

    if (result.success) {
      console.log(result.success); // Log success message for debugging
      res.status(200).json({ message: "Status updated successfully" });
    } else {
      console.error(result.error); // Log error message for debugging
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating status:", error); // Log error for debugging
    res.status(500).json({ message: "Error updating status", error });
  }
});

module.exports = router;
