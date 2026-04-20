const express = require("express");
const router = express.Router();

const {
  addCamp,
  getUpcoming_Camps,
  deleteCamp,
  getCompletedCamps
} = require("../controllers/campController");

const { protect, isNGO } = require("../middleware/authMiddleware");

router.post("/", protect, isNGO, addCamp);
router.get("/upcoming",protect, getUpcoming_Camps);
router.get("/completed", protect, getCompletedCamps);
router.delete("/:id", protect, isNGO, deleteCamp);

module.exports = router;