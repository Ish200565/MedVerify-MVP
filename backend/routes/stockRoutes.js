const express = require("express");
const router = express.Router();

const {
  addStock,
  deleteStock,
  getInventory
} = require("../controllers/stockController");


router.post("/", addStock);
router.get("/inventory", getInventory);
router.delete("/:id", deleteStock);

module.exports = router;