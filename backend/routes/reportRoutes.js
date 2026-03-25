// routes/reportRoutes.js
const express = require("express");
const { addReport } = require("../controllers/reportController");

const router = express.Router();

router.post("/add", addReport);
module.exports = router;