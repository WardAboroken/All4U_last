// routes/userinfo.js

const express = require("express");
const userInfoController = require("../controllers/userInfoController");
const router = express.Router();

// GET /getUserInfo

router.get("/userInfoController", userInfoController.getUserInfo);

module.exports = router;
