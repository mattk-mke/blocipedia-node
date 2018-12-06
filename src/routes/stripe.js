const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripeController");

router.post("/stripe/events", stripeController.events);

module.exports = router;