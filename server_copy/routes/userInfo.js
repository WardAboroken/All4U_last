// routes/userinfo.js

const express = require("express");
const userInfoController = require("../controllers/userInfoController");
const router = express.Router();

// GET /userinfo
router.get("/userinfo", userInfoController.getUserInfo);

module.exports = router;
