
const express = require("express");
const router = express.Router();

const {
  getMedicineByBarcode,
  createMedicine,getMedicine,
  deleteMedicine
} = require("../controllers/medicineController");


router.get("/barcode/:barcode", getMedicineByBarcode);


router.post("/", createMedicine);
router.get("/getmedicine", getMedicine);

router.delete("/:id", deleteMedicine);

module.exports = router;