const express = require("express");
const router = express.Router();

const {
  addStock,
  deleteStock,
  getInventory,
  getStockByBarcode
} = require("../controllers/stockController");



const { protect, isNGO } = require("../middleware/authMiddleware");

// ✅ NGO only
router.post("/", protect, isNGO, addStock);

router.get("/inventory", protect, isNGO, getInventory);

// 🔥 Barcode scan (IMPORTANT)
router.get("/barcode/:barcode", protect, getStockByBarcode);

// ✅ NGO only
router.delete("/:id", protect, isNGO, deleteStock);

module.exports = router;