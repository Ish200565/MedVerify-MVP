const express = require("express");
const router = express.Router();



const { addReport, getMyReports,getReportsByCamp } = require("../controllers/reportController");

const { protect, isDoctor } = require("../middleware/authMiddleware");

// ✅ ONLY DOCTOR can submit report
router.post("/", protect, isDoctor, addReport);
router.get("/my", protect, getMyReports);
router.get("/camp/:campId", protect, getReportsByCamp);
module.exports = router;