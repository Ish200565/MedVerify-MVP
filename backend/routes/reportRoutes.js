const express = require("express");
const router = express.Router();



const { addReport, getMyReports } = require("../controllers/reportController");

const { protect, isDoctor } = require("../middleware/authMiddleware");

// ✅ ONLY DOCTOR can submit report
router.post("/", protect, isDoctor, addReport);
router.get("/my", protect, isDoctor, getMyReports);
module.exports = router;