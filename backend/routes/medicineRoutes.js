const express = require("express");
const router = express.Router();

const {
  createMedicine,
  getMedicine,
  deleteMedicine
} = require("../controllers/medicineController");


const { protect, isNGO } = require("../middleware/authMiddleware");

// ✅ NGO only
router.post("/", protect, isNGO, createMedicine);

router.get("/", protect, getMedicine);

// ✅ NGO only
router.delete("/:id", protect, isNGO, deleteMedicine);

module.exports = router;