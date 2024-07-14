// A router that connect us to the uppropiate query to help us update the user's profile according to it's type and editing
const express = require("express");
const updateCustomerProfile = require("../database/queries/updateCustomerProfile");
const updateShopOwnerProfile = require("../database/queries/updateShopOwnerProfile");
const router = express.Router();
router.use(express.json());
