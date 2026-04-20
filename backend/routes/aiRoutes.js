const express = require("express");
const router = express.Router();

const { queryAI } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.post("/query", protect, queryAI);

module.exports = router;