const express = require("express");
const { calculateForAddress } = require("../controllers/calculate");

const router = express.Router();
router.route("/").get(calculateForAddress);

module.exports = router;
