const express = require("express");
const userInfoController = require("../controllers/userInfoController");
const router = express.Router();

// GET /getUserInfo
router.get("/getUserInfo", userInfoController.getUserInfo);

module.exports = router;
